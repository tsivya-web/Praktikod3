using System.Diagnostics;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using ToDoApi;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Runtime.ConstrainedExecution;
var builder = WebApplication.CreateBuilder(args);

// ✅ בדיקת מחרוזת חיבור
var connectionString = builder.Configuration.GetConnectionString("tododb");
if (string.IsNullOrEmpty(connectionString))
    throw new InvalidOperationException("Missing database connection string.");

// ✅ שירותים
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});

builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.Parse("8.0.40-mysql"))
);

// ✅ CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3002", "https://clientpraktikod3.onrender.com")
              .AllowCredentials()
              .WithMethods("GET", "POST", "PUT", "DELETE")
              .WithHeaders("Content-Type", "Authorization");
    });
});

// ✅ JWT Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
        };
    });

builder.Services.AddAuthorization(); // ⬅️ חשוב לפני Build

// ✅ Build
var app = builder.Build();

// ✅ Middleware לפי הסדר
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
app.UseSwagger();
app.UseSwaggerUI();

// ✅ טיפול בשגיאות גלובלי
app.Use(async (context, next) =>
{
    try { await next(); }
    catch (Exception ex)
    {
        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "שגיאה התרחשה במהלך עיבוד הבקשה.");
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync($"{{\"שגיאה\": \"אירעה שגיאה בשרת: {ex.Message}\"}}");
    }
});



app.MapGet("/", () => "ToDoApi-Server is running!!!!");


app.MapPost("/register", async ( ToDoDbContext context,User i) =>
{
    var id=context.Users.Max(x=>x.Identify);
    var newUser=new User{
Identify=id+1,
Name=i.Name,
Password=i.Password,
Email=i.Email,
Role=i.Role
    };

await context.Users.AddAsync(newUser);
System.Console.WriteLine("nnnn");
  await context.SaveChangesAsync();

 var jwt = CreateJWT(newUser);
    System.Console.WriteLine( "This  is object  JWT!!"+   jwt);
    return Results.Ok(new { jwt });
});






app.MapPost("/login", async ( ToDoDbContext context,[FromBody] User req) =>
{
      System.Console.WriteLine("huygouy");
    System.Console.WriteLine(context.Users);
    

    if (context.Users == null)
    {
        Console.WriteLine("Users DbSet is null");
    }
    else
    {
        var usersCount = await context.Users.CountAsync();
        Console.WriteLine($"Users count: {usersCount}");
       ;
    }
    User i = await context.Users?.FirstOrDefaultAsync(u => u.Email == req.Email && u.Password == req.Password);
    if (i == null)
    {
       return Results.Json(new {message="!!!!"});
        
    }
    var jwt = CreateJWT(i);
    System.Console.WriteLine( "This  is object  JWT!!"+   jwt);
    return Results.Ok(new { jwt });
});

object CreateJWT(User user)
{
    
    var claims = new List<Claim>()
                {
                    new Claim("id", user.Identify.ToString()),
                    new Claim("name", user.Name),
                    new Claim("email", user.Email),
                    new Claim("role", user.Role)
                };
    var _configuration = builder.Configuration.GetSection("Jwt");
    var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]));
    var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        var tokeOptions = new JwtSecurityToken(
        issuer: builder.Configuration["JWT:Issuer"],
        audience: builder.Configuration["JWT:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(2), // השתמש ב-UTC
        signingCredentials: signinCredentials
    );

    var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
    return new { Token = tokenString };
}






app.MapGet("/users", async (ToDoDbContext context) =>
{
   var users= await context.Users.ToListAsync();

Console.WriteLine("🔍 Total Users: " + users.Count);
return users ;});


app.MapGet("/items", async (ToDoDbContext context) =>
{
    try
    {
        var items = await context.Items.ToListAsync();
        Console.WriteLine($"🔍 Number of items: {items.Count}");
        return Results.Ok(items);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error: {ex.Message}");
        return Results.Problem("An error occurred while retrieving the items.");
    }
});





// app.MapPost("/addTask", async (ToDoDbContext context, Item i) =>
// {
//     i.IsComplete = false;
//     await context.Items.AddAsync(i);
//     await context.SaveChangesAsync();
//     var result = await context.Items.FindAsync(i.Id);
//     return result;
// }
// );

app.MapPost("/addTask", async (ToDoDbContext context, [FromBody] string request) =>
{

    // קביעת ה-ID החדש לפי ה-ID הגבוה ביותר במסד הנתונים
    var lastId = await context.Items.MaxAsync(i => (int?)i.Id) ?? 0; // מחזיר 0 אם אין נתונים
    var newId = lastId + 1;

    var newItem = new Item
    {
        Id = newId, // קביעת ה-ID
        Name = request,
        IsComplete = false
    };

    await context.Items.AddAsync(newItem);
    await context.SaveChangesAsync();
 var result = await context.Items.FindAsync(newItem.Id);
    return result;
   
});

app.MapPut("/update/{id}", async (ToDoDbContext context,int id ,[FromBody] Item updateItem) =>
{

    var r = await context.Items.FindAsync(id);

    if (r == null)
    {
        return Results.NotFound();  // החזרת שגיאה אם המשימה לא קיימת
    }
    r.IsComplete=updateItem.IsComplete;
    // else
    // {
    //    r.Id=id;
    //    r.Name=r.Name;
    //    r.IsComplete=IsComplete;
    // }
    await context.SaveChangesAsync();
    return Results.Ok(r);
}
);


app.MapDelete("/delete/{id}", async (ToDoDbContext context, int id) =>
{
    var r = await context.Items.FindAsync(id);

    if (r == null)
    {
        return Results.NotFound();  // החזרת שגיאה אם המשימה לא קיימת
    }

    context.Items.Remove(r);
    await context.SaveChangesAsync();
    return Results.Ok(r);
}
);


app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
app.Run();






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
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.AspNetCore.Mvc;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", PolicyBuilder =>
    {
        PolicyBuilder
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("tododb"),
    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("tododb"))));

    
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

var app = builder.Build();
app.UseCors("CorsPolicy");
// if (app.Environment.IsDevelopment())
// {
    app.UseSwagger();
    app.UseSwaggerUI();
// }

app.Use(async (context, next) =>
{
    try
    {
        await next(); // המשך לבקשה הבאה
    }
    catch (Exception ex)
    {
        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "שגיאה התרחשה במהלך עיבוד הבקשה.");

        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
      await context.Response.WriteAsync($"{{\"שגיאה\": \"אירעה שגיאה בשרת: {ex.Message}\", \"סטאק\": \"{ex.StackTrace}\"}}");
    }
});





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






app.MapPost("/login", async ( ToDoDbContext context,[FromBody] LoginModel req) =>
{
      System.Console.WriteLine("huygouy");
    User i = context.Users?.FirstOrDefault(u => u.Email ==req.Email && u.Password == req.Password);
  System.Console.WriteLine("this is mty bvar"+" "+i.Email +i.Name );
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
    await context.Users.ToListAsync());


app.MapGet("/items", async (ToDoDbContext context) =>
    await context.Items.ToListAsync());



app.MapPost("/addTask", async (ToDoDbContext context, Item i) =>
{
    i.IsComplete = false;
    await context.Items.AddAsync(i);
    await context.SaveChangesAsync();
    var result = await context.Items.FindAsync(i.Id);
    return result;
}
);

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
app.MapGet('/',()=>"ToDoApi-Server is running!!!!")
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
app.Run();






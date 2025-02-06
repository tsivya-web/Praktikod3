// using Microsoft.AspNetCore.Mvc;
// using ToDoApi;
// using Microsoft.AspNetCore.Http;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using System.Security.Claims;
// using System.IdentityModel.Tokens.Jwt;


// using System.IO;
// using System.Text.Json;
// // using ToDoApi.Models;

// public class AuthController : ControllerBase
// {
//     private readonly IConfiguration _configuration;
//     private readonly ToDoDbContext _context;
//     public AuthController(IConfiguration conf, ToDoDbContext cont)
//     {
//         _configuration = conf;
//         _context = cont;
//     }

//     [HttpPost("/login")]
//     public IActionResult Login([FromBody] LoginModel loginModel)
//     {
//         var user = _context.Users?.FirstOrDefault(u => u.Email == loginModel.Email && u.Password == loginModel.Password);
//         if (user is not null)
//         {
//             var jwt = CreateJWT(user);
//             return Ok(jwt);
//         }
//         return Unauthorized();
//     }
//     private object CreateJWT(User user)
//     {
//         var claims = new List<Claim>()
//                 {
//                     new Claim("id", user.Identify.ToString()),
//                     new Claim("name", user.Name),
//                     new Claim("email", user.Email),
//                     new Claim("role", user.Role)
//                 };

//         var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JWT:Key")));
//         var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
//         var tokeOptions = new JwtSecurityToken(
//             issuer: _configuration.GetValue<string>("JWT:Issuer"),
//             audience: _configuration.GetValue<string>("JWT:Audience"),
//             claims: claims,
//             expires: DateTime.Now.AddDays(30),
//             signingCredentials: signinCredentials
//         );
//         var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
//         return new { Token = tokenString };
//     }

// }
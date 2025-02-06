using System;
using System.Collections.Generic;

namespace ToDoApi;

public partial class User
{
    public int Identify { get; set; }

    public string Name { get; set; } = null!;

    public string? Password { get; set; }

    public string? Email { get; set; }

    public string? Role { get; set; }


    
}

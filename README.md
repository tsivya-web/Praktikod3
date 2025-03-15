# ✨ Daily Tasks - React & C#
    
🏆 Overview
Daily Tasks is an intuitive application for managing daily tasks. 

The system includes a public page and a private page, where only registered users can access the private page.  


Authentication is done using JSON Web Token (JWT), which is stored in Local Storage and sent with every request to the server, reducing server calls and ensuring secure authentication.

## 🛠 Technologies
🔹 Frontend: React.js with Hooks and Router

🔹 Backend: C# with ASP.NET Web API

🔹 Database: MYSQL Server

🔹 Authentication: JWT Token

## 🚀 Key Features
✔️ Registration and login system with JWT

✔️ Page separation - public and private based on permissions

✔️ Reduced server load with token-based authentication

✔️ Task management – add, delete, and update task statuses

✔️ Secure database with relationships between users and tasks

## 📂 Project Structure

    
    
	📁 DailyTasksProject

     ┣ 📂 client          # React application
     ┃ ┣ 📂 src
     ┃ ┃ ┣ 📂 components  # Components
     ┃ ┃ ┣ 📂 pages       # Pages (Public/Private)
     ┃ ┃ ┣ 📜 App.js      # Main file
    ┣ 📂 server          # C# server
     ┃ ┣ 📂 Controllers   # API controllers
     ┃ ┣ 📂 Models        # Data models
     ┃ ┣ 📂 Services      # Business logic
     ┃ ┣ 📜 Program.cs    # Main entry file
     ┣ 📂 database        # Database scripts
## ⚡ Installation and Running
### 🔧 Installing the Frontend
    sh
    cd ToDoListReact-master-Client
    npm install
    npm start
### 🔧 Installing the Backend
    sh
    cd ToDoApi-Server
    dotnet run
##  Usage:
1.	🌐 Open the public page.
2.	🔑 Register or log in to access the private page.
3.	Upon login, a 🔑 JWT token is issued and stored in 💾 local storage.
4.	The token is sent with each request to the backend to verify authentication.
5.	If the token is invalid or tampered with, the user is redirected to the 🔒 login page.

## 📊 Setting up the Database (SQL)
    sql
    CopyEdit
    CREATE TABLE Users (
        id INT PRIMARY KEY IDENTITY,
        username NVARCHAR(50) UNIQUE NOT NULL,
        passwordHash NVARCHAR(255) NOT NULL
    );

    CREATE TABLE Tasks (
        id INT PRIMARY KEY IDENTITY,
        userId INT FOREIGN KEY REFERENCES Users(id),
        title NVARCHAR(100) NOT NULL,
        completed BIT DEFAULT 0
    );
## 🔐 Security and Protection
🔑 JWT is stored in Local Storage and sent with every request to the server

🔑 User authentication is performed on the server using a secure signing key

🔑 Permissions are checked before accessing the private page and performing database actions

### 🎯 Contributing and Improving the Project
We welcome collaboration! You can Fork the repository and submit a Pull Request with improvements and extensions.
### 📧 Email: tsivyacohen@gmail.com

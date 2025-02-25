import { useState } from "react"
import { useNavigate } from "react-router-dom";
import service from "../service";

export const  Register=()=>{
const[user,setuser]=useState()

const n=useNavigate();
  async function func() {
    debugger
  try{
      const todos = await service.register(user);
    n('/todos')}
    catch{
      alert(" הפעולה נכשלה נסה שוב")
    }
}

    return <>
    <div class="card">
    <div class="card-header text-center">
      <h3>הרשמה</h3>
    </div>
    <div class="card-body">
    <div class="form-group">
         
          <input type="text" class="form-control" id="name" placeholder="הכנס שם" onBlur={(e) => setuser({ ...user, Name: e.target.value })} required/>
        </div> 
        <br></br>
          <div class="form-group">
          
         
         <input type="password" class="form-control" id="password" placeholder="הכנס סיסמא" onBlur={(e) => setuser({ ...user, Password: e.target.value })} required/>
         <br></br>
        </div>
              <div class="form-group">
         
          <input type="email" class="form-control" id="email" placeholder="הכנס את כתובת האימייל שלך" onBlur={(e) => setuser({ ...user, Email: e.target.value })} required/>
        </div>
     
      <br></br>
        <div class="form-group">
         
          <input type="text" class="form-control" id="role" placeholder="הכנס תפקיד" onBlur={(e) => setuser({ ...user, Role: e.target.value })} required/>
        </div>
      
        <br></br>
        <button onClick={()=>func()} class="btn btn-primary btn-block">הרשמה</button>

    </div>
  </div>
  </>
}
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import service from '../service.js';
export const Login=()=>{
    const[user,setuser]=useState({})
    const n=useNavigate()
    async function getUser() {
      debugger
      try{
      const todos = await service.login(user.email,user.password);
    n('/todos')}
    catch{
      alert("עליך להירשם")
    }
    }
    return <>
    <h2>login page</h2>
    <input className="form-control" type="text" placeholder="email"  onBlur={(e) => setuser({ ...user, email: e.target.value })} ></input><br></br>
    <input className="form-control" type="text" placeholder="password"  onBlur={(e) => setuser({ ...user, password: e.target.value })}></input>
    <button style={{ margin: "0.5rem" }} className="btn btn-primary"  onClick={()=>getUser()} >שמור</button>
  </>
}
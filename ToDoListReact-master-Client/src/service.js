import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Register } from './components/register';

axios.defaults.baseURL = "/";
axios.defaults.headers.common['Content-Type'] = 'application/json';
setAuthorizationBearer();



  axios.interceptors.response.use(
    function(response){
      return response;
    },
    function(error){
      if(error.response.status==401)
        return(window.location.href="/login")
      return Promise.reject(error)
    }

  )
  function setAuthorizationBearer(){
    const acessToken=localStorage.getItem("access_token")
    if(acessToken)
      axios.defaults.headers.common["Authorization"]=`Bearer ${acessToken}`
      }
    function saveAccessToken(authResult){
      debugger
    localStorage.setItem("access_token",authResult.token)
    setAuthorizationBearer();
    }

export default {
  getLoginUser: () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
return null;}
try{
const dekoded=jwtDecode(accessToken);
const currentTime=Math.floor(Date.now()/1000);
if(dekoded.exp<currentTime){
  localStorage.removeItem("access_token")
  return null;
}
return dekoded
}
catch(e){
console.error("error is ",e)
return null;
}
}
,
  getTasks: async () => {
    const result = await axios.get(`/items`)   
    return result.data;
  },
  getUsers: async () => {
    const result = await axios.get(`/users`)   
    return result.data;
  },

  addTask: async(name)=>{
    debugger
    console.log('addTask', name,)
    const result=await axios.post(`/addTask`, name);
    console.log("sucess")
  },

  setCompleted: async(id,IsComplete)=>{
    debugger
    console.log('setCompleted', {id, IsComplete});

    try{
    //TODO
    const result = await axios.put(`/update/${id}`,
      {id:id,IsComplete:IsComplete} );

await  axios.get(`/items`)   ;  // קריאה לפונקציה שמעדכנת את הרשימה

    return result.data;
  }
    catch(error){
      console.log(error)
     console.log("לא עובד")
    }
  },

  deleteTask:async(id)=>{
    console.log('deleteTask')
    const result = await axios.delete(`/delete/${id}`)    
    return result.data;
  }

  
 , 
  login:async(email,password)=>{
    debugger
    console.log('login', {email,password})
    const result = await axios.post(`/login`,
     {Email:email,Password:password} 
    )    
     saveAccessToken(result.data.jwt)}
     ,


     register:async(user)=>{
      debugger
      console.log('addPerson', user,)
        const result=await axios.post(`/register`, user);
        saveAccessToken(result.data.jwt)
    console.log("sucess")

     }


     
};

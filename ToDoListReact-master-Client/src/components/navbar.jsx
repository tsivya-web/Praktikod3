import { Link } from "react-router-dom"

export const Navbar=()=>{
const func=()=>{
localStorage.removeItem("access_token")
}
      return <>
 <ul className="nav nav-tabs">
    <li class="nav-item">
     <Link  className="nav-link" to={'register'}> הירשם </Link>
      </li>
      <li class="nav-item">
      <Link  className="nav-link" to={'login'}>  התחברות    </Link>
      </li>
       <li class="nav-item">
      <Link  className="nav-link" to={'todos'}>רשימת מטלות  </Link>
      </li>
      <li class="nav-item">
      <Link  className="nav-link" to={'home'}>דף הבית   </Link>
      </li>
      <li class="nav-item">
      <button onClick={()=>func()}>התנתק</button>
      </li>
     </ul>
      </>
      }
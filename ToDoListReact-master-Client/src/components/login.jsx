import { useState } from "react"
import { useNavigate } from "react-router-dom";
import service from '../service.js';

export const Login = () => {
  const [user, setuser] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const n = useNavigate()
  async function getUser() {
    try {
      const todos = await service.login(user.email, user.password);
      n('/todos')
    }
    catch {
      alert("עליך להירשם")
    }
  }
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", direction: "rtl", textAlign: "right" }}>
      <div className="card shadow" style={{ minWidth: "350px", maxWidth: "400px", width: "100%" }}>
        <div className="card-header text-center bg-primary text-white">
          <h3>התחברות</h3>
        </div>
        <div className="card-body">
          <div className="mb-3 text-end">
            <label className="form-label" htmlFor="login-email">אימייל</label>
            <input className="form-control" id="login-email" type="email" placeholder="הכנס אימייל" onBlur={(e) => setuser({ ...user, email: e.target.value })} />
          </div>
          <div className="mb-3 text-end">
            <label className="form-label" htmlFor="login-password">סיסמה</label>
            <input 
              className="form-control" 
              id="login-password" 
              type={showPassword ? "text" : "password"} 
              placeholder="הכנס סיסמה" 
              onBlur={(e) => setuser({ ...user, password: e.target.value })} 
            />
            <div className="form-check mt-2 text-end">
              <input
                className="form-check-input ms-2"
                type="checkbox"
                id="showPasswordCheck"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="showPasswordCheck">
                הצג סיסמה
              </label>
            </div>
          </div>
          <button className="btn btn-primary w-100" onClick={getUser}>התחבר</button>
        </div>
      </div>
    </div>
  )
}
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import service from "../service";

export const Register = () => {
  const [user, setuser] = useState({})
  const n = useNavigate();
  async function func() {
    try {
      const todos = await service.register(user);
      n('/todos')
    }
    catch {
      alert("הפעולה נכשלה נסה שוב")
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", direction: "rtl", textAlign: "right" }}>
      <div className="card shadow" style={{ minWidth: "350px", maxWidth: "400px", width: "100%" }}>
        <div className="card-header text-center bg-primary text-white">
          <h3>הרשמה</h3>
        </div>
        <div className="card-body">
          <div className="mb-3 text-end">
            <label className="form-label" htmlFor="register-name">שם</label>
            <input type="text" className="form-control" id="register-name" placeholder="הכנס שם" onBlur={(e) => setuser({ ...user, Name: e.target.value })} required />
          </div>
          <div className="mb-3 text-end">
            <label className="form-label" htmlFor="register-password">סיסמה</label>
            <input type="password" className="form-control" id="register-password" placeholder="הכנס סיסמה" onBlur={(e) => setuser({ ...user, Password: e.target.value })} required />
          </div>
          <div className="mb-3 text-end">
            <label className="form-label" htmlFor="register-email">אימייל</label>
            <input type="email" className="form-control" id="register-email" placeholder="הכנס אימייל" onBlur={(e) => setuser({ ...user, Email: e.target.value })} required />
          </div>
          <div className="mb-3 text-end">
            <label className="form-label" htmlFor="register-role">תפקיד</label>
            <input type="text" className="form-control" id="register-role" placeholder="הכנס תפקיד" onBlur={(e) => setuser({ ...user, Role: e.target.value })} required />
          </div>
          <button onClick={func} className="btn btn-primary w-100">הרשמה</button>
        </div>
      </div>
    </div>
  )
}
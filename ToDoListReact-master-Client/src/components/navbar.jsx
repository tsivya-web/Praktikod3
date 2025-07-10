import { Link } from "react-router-dom"
import service from "../service";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!service.getLoginUser());
    // נרצה להאזין לשינויים ב-localStorage, למשל בהתנתקות/התחברות
    const onStorage = () => setIsLoggedIn(!!service.getLoginUser());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const func = () => {
    localStorage.removeItem("access_token")
    setIsLoggedIn(false);
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to={'/home'}>
          ToDoList
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={'/register'}>הרשמה</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/login'}>התחברות</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to={'/todos'}>רשימת מטלות</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={'/home'}>דף הבית</Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={func}>התנתק</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
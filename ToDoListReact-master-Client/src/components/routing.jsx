import { Route, Routes } from "react-router-dom"
import { Login } from "./login"
import { Todos } from "./todos"
import { Home } from "./home"
import { Register } from "./register"


export const Routing = () => {
    return<Routes>
  <Route path="register" element={<Register></Register>} >  </Route>
        <Route path="login" element={<Login></Login>} >  </Route>
        <Route path="todos" element={<Todos></Todos>} >  </Route>
        <Route path="home" element={<Home></Home>} >  </Route>

        <Route path="/" element={<Home></Home>} >  </Route>

    </Routes>
}
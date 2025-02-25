import { Login } from "./components/login";
import { Todos } from "./components/todos";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/todos',
        element: <Todos/>
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
];

export default AppRoutes;
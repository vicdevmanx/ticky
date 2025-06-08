import { createBrowserRouter } from "react-router-dom";
import App from "./src/App";
import Home from "./src/page/home/home";
import Game from "./src/page/game/game.jsx";
import Signup from "./src/page/auth/signup.jsx";
import Login from "./src/page/auth/login.jsx";
import AuthProtected from "./authprotected.jsx";
import Leaderboard from "./src/page/leaderboard/leaderboard.jsx";
import Message from "./src/page/messages/message.jsx";
import Users from "./src/page/users/users.jsx";
import Chat from './src/page/chat/chat.jsx';


export const routes = createBrowserRouter([
{
    path: '/',
    element: <App/>,
    children:[
        {
            path:'',
            element:<AuthProtected children={<Home/>}/>
        },
        {
            path:'/game',
            element:<Game/>
        },
        {
            path:'/signup',
            element:<Signup/>
        },
        {
        path:'/login',
        element: <Login/>
        },
        {
            path: '/messages',
            element: <Message/>
        },
        {
            path:'/users',
            element: <Users/>
        },
        {
            path: '/leaderboard',
            element: <Leaderboard/>
        },
        {
            path: '/chat',
            element: <Chat/>
        }
    ]
}

])
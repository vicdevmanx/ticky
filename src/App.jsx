import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from 'sonner';
import { socket } from "../socket";



const App = () => {
useEffect(() => {
localStorage.getItem('userId') && socket.emit('register', { userId: localStorage.getItem('userId') })
},[])

  return (
  <div className="select-none font-[poppins] bg-[#1a1b20] h-full min-h-[100dvh] text-white">
    <Toaster position='top-center'/>
    <Outlet/>
  </div>
);
};

export default App;

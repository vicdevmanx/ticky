import { NavLink } from 'react-router-dom'


const BottomBar = () => {
    return(
        <div className='bg-[#1a1b20ba] z-3 w-full max-w-28 self-center rounded-full  flex items-center justify-between text-sm p-1 font-[poppins-bold] border-1 border-[#262a35] text-[#fafeff98] fixed bottom-6' style={{backdropFilter: 'blur(5px)'}}>
        <NavLink to='/'>
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='size-11 fill-[#fafeff50] bg-transparent p-2.5 rounded-full' viewBox="0 0 16 16"><path d="M8.543 2.232a.75.75 0 0 0-1.085 0l-5.25 5.5A.75.75 0 0 0 2.75 9H4v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V9h1.25a.75.75 0 0 0 .543-1.268z"/></svg>
        </NavLink>
        <NavLink to='/messages'>
        {({isActive}) => ( isActive ? 
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='size-11 fill-[#fff] bg-[#3b52fa] p-2.5 rounded-full transition active:bg-[#262a35] hover:bg-[#262a35]' viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 3a9 9 0 0 0 0 18h4.5c1.398 0 2.097 0 2.648-.228a3 3 0 0 0 1.624-1.624C21 18.597 21 17.898 21 16.5V12a9 9 0 0 0-9-9m-4 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m3 4a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1" clip-rule="evenodd"/></svg>
        
    :
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='size-11 fill-[#fafeff50] bg-transparent p-2.5 rounded-full transition active:bg-[#262a35] hover:bg-[#262a35]' viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 3a9 9 0 0 0 0 18h4.5c1.398 0 2.097 0 2.648-.228a3 3 0 0 0 1.624-1.624C21 18.597 21 17.898 21 16.5V12a9 9 0 0 0-9-9m-4 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m3 4a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1" clip-rule="evenodd"/></svg>

    )}</NavLink>
        
        {/* <NavLink to='/users'>
        {({isActive}) => ( isActive ? 
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='size-11 fill-[#fff] bg-[#3b52fa] p-2.5 rounded-full transition active:bg-[#262a35] hover:bg-[#262a35]'>
     <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
   </svg> :
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='size-11 fill-[#fafeff50] bg-transparent p-2.5 rounded-full transition active:bg-[#262a35] hover:bg-[#262a35]'>
   <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
 </svg>
        )}</NavLink> 
   
   <NavLink to='/leaderboard'>
    {({isActive}) => ( isActive ? 
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='size-11 fill-[#fff] bg-[#3b52fa] p-3 rounded-full transition active:bg-[#262a35] hover:bg-[#262a35]'>
     <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
   </svg>
   :
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='size-11 fill-[#fafeff50] bg-transparent p-3 rounded-full transition active:bg-[#262a35] hover:bg-[#262a35]'>
   <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
 </svg>
)}
   </NavLink> */}
    
         </div>
    )
}

export default BottomBar
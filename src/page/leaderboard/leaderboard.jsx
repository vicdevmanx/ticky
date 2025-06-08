import { useNavigate, NavLink } from 'react-router-dom'
import { useRef, useState } from 'react'
import BottomBar from '../../bottombar/bottom'


const Leaderboard = () => {
    const navigate = useNavigate()
    const [ isFocused, setIsFocused ] = useState(false)
    const inputRef = useRef(null);

    const handleInputRef = () => {
        setTimeout(() => {
        inputRef.current?.focus()
        }, 0);
        setIsFocused(true)
    }

    return (
        <div className='w-full max-w-lg m-auto flex flex-col h-full min-h-screen relative' >
        {/* <div className='h-[40vh] w-full absolute z-1' style={{background: 'linear-gradient(to bottom,#3b51fa, #1a1b20 100%)'}}></div> */}
        <div className='p-4 pl-2 gap-2 flex items-center z-3 justify-between sticky top-0 relative ' style={{backdropFilter: 'blur(5px)'}}>
          
           
                <p className='text-xl font-[poppins-bold]'>Leaderboard</p>

{
isFocused && (
    <input 
    ref={inputRef}
    onBlur={() => setIsFocused(false)}
    type='search' 
    placeholder='Search users...' 
    className='absolute text-xs bg-[#262a35] rounded-xl p-3 pl-4 outline-0 InputAni' />
)
}

{
    !isFocused && (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5.5 " onClick={handleInputRef}>
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
  </svg>
    )
}

            </div>
            <div className='z-2 flex gap-1 mt-8 justify-center'>
                <div className='flex flex-col gap-0 pt-10 items-center'>
            <div className="w-18 h-18 rounded-full bg-[#262a35] flex justify-center items-center">
                        <p className='font-[poppins-bold] text-2xl'>U</p>
                    </div>
                    
                    <div className='font-[poppins-bold] p-2 bg-[#262a35] relative -top-4 rounded-full text-xs flex flex-col justify-center items-center h-6'>🥉</div>
                    <p className='font-[poppins-medium] text-[11px] py-1 px-2 rounded-lg bg-[#262a35] w-28 flex items-center justify-center -mt-2'>usernameith</p>
                </div>
            <div className='flex flex-col gap-0 items-center'>
                    <div className="w-22 h-22 rounded-full bg-[#262a35] flex justify-center items-center">
                        <p className='font-[poppins-bold] text-2xl'>U</p>
                    </div>
                    <div className='font-[poppins-bold] p-2 bg-[#262a35] relative -top-4 rounded-full text-xs flex flex-col justify-center items-center h-6'>🥇</div>
                    <p className='font-[poppins-medium] text-[11px] py-1 px-2 rounded-lg bg-[#262a35]  w-28 flex items-center justify-center -mt-2'>usernamejhogith</p>
                    </div>

                    
                    <div className='flex flex-col gap-0 pt-8 items-center'>
                    <div className="w-20 h-20 rounded-full bg-[#262a35] flex justify-center items-center">
                        <p className='font-[poppins-bold] text-2xl'>U</p>
                    </div>
                    <div className='font-[poppins-bold] p-2 bg-[#262a35] relative -top-4 rounded-full text-xs flex flex-col justify-center items-center h-6'>🥈</div>
                    <p className='font-[poppins-medium] text-[11px] py-1 px-2 rounded-lg bg-[#262a35]  w-28 flex items-center justify-center -mt-2'>usernamejhogith</p>
                    </div>
            </div>
         <div className='p-2 z-2 mt-8 mb-24 flex flex-col gap-2'>
         <div className='flex justify-between items-center p-2 pr-6 bg-[#262a35] rounded-2xl'>
                    <div className='flex items-center gap-3'>
                    <div className="w-13 h-13 rounded-full bg-[#1a1b20] flex justify-center items-center">
                        <p className='font-[poppins-bold] text-xl'>U</p>
                    </div>
                    

                    <div className='flex flex-col -gap-1 justify-center'>
                        <p className='font-[poppins-medium] text-md'>Me</p>
                        <p className='text-xs text-[#ffffff80] font-[poppins-medium]'>300 XP</p>
                    </div>
                    </div>
                    <div className='p-2 rounded-full bg-[#3b52fa] text-xs w-6 h-6 flex justify-center items-center font-[poppins-medium]'>2</div>
                </div>


            <div className='w-full flex max-h-128 overflow-scroll customScroll flex-col rounded-3xl bg-[#262a35] gap-3 pt-2 '>

                <div className='flex justify-between items-center p-2 pr-4'>
                    <div className='flex items-center gap-3'>
                    <div className="w-13 h-13 rounded-full bg-[#1a1b20] flex justify-center items-center">
                        <p className='font-[poppins-bold] text-xl'>U</p>
                    </div>

                    <div className='flex flex-col -gap-1 justify-center'>
                        <p className='font-[poppins-medium] text-md'>Username</p>
                        <p className='text-xs text-[#ffffff80] font-[poppins-medium]'>300 XP</p>
                    </div>
                    </div>
                    <div className='p-2 rounded-full bg-[#3b52fa] text-xs w-6 h-6 flex justify-center items-center font-[poppins-medium]'>2</div>
                </div>


             </div>

            </div>


            <BottomBar/>

       
        </div>
    )
}


export default Leaderboard;
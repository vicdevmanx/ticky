import { useNavigate, NavLink } from 'react-router-dom'
import { useRef, useState, useContext, useEffect } from 'react'
import './messages.css'
import BottomBar from '../../bottombar/bottom'
import { GlobalContext } from '../../context'
import Loader from '../../assets/loader/loader'
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Chat from '../chat/chat';
import { socket } from '../../../socket'



const Message = () => {
    const navigate = useNavigate()
    const { url, allUsers, setAllUsers, loading, setLoading, conversation, setConversation } = useContext(GlobalContext)
    const [openChat, setOpenChat] = useState(false);
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef(null);
    const [unread, setUnread] = useState([])



    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${url}/users`, {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem('tickyAuthToken'),
                    'Content-Type': 'application/json'
                }


            })
            if (!response.ok) {
                setLoading(false)
                const result = await response.json()
                console.log(result.message)
                return
            };
            const result = await response.json()
            if (result) {
                setLoading(false)
                const mainUsers = result.users.filter((person) => person._id != localStorage.getItem('userId'))
                console.log(mainUsers)
                setAllUsers(mainUsers)
                localStorage.setItem('allUsers', JSON.stringify(mainUsers))
            } else {
                console.log(result)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const storedUsers = localStorage.getItem('allUsers');

        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers);
            if (parsedUsers.length !== 0) {
                setAllUsers(parsedUsers);
            }
        }

        fetchUsers();

    }, [])

    const handleInputRef = () => {
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0);
        setIsFocused(true)
    }


    return (
        <div className='w-full max-w-lg m-auto flex flex-col h-full min-h-screen bg-[#1a1b20]'>
            <div className='p-4 pl-2 gap-2 flex items-center justify-between sticky top-0 bg-[#1a1b20] border-b border-[#262a35] relative'>
                <p className='text-xl font-[poppins-bold]'>Messages</p>

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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5.5" onClick={handleInputRef}>
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                        </svg>
                    )
                }

            </div>

            <div className='w-full flex flex-col mb-24'>




                {
                    loading ?
                        <>
                            {allUsers.length != 0 && allUsers.map((person) => (

                                <div className='flex justify-between items-center p-2 py-3 transition active:bg-[#262a3550] pr-4' onClick={() => {
                                    setOpenChat(true)
                                    setConversation({
                                        ...conversation,
                                        receiver: person
                                    })
                                }}>
                                    <div className='flex items-center gap-3'>
                                        <div className="w-13 h-13 rounded-full bg-[#262a35] flex justify-center items-center">
                                            <p className='font-[poppins-bold] text-xl'>{person.username[0].toUpperCase()}</p>
                                        </div>

                                        <div className='flex flex-col justify-center'>
                                            <p className='font-[poppins-medium] text-md'>{person.username}</p>
                                            <p className='text-xs text-[#ffffff80] font-[poppins-medium]'>{(person.totalScore + person.bonus) - person.xpreduction} XP</p>
                                        </div>
                                    </div>
                                    {/* <div className='p-2 rounded-full bg-red-500 text-xs w-6 h-6 flex justify-center items-center font-[poppins-medium]'>2</div> */}
                                </div>

                            ))}
                            <div className='flex justify-center'><Loader size={20} /></div>
                        </>
                        :
                        allUsers.map((person, i) => (
                            <div className='flex justify-between items-center active:bg-[#262a3560] p-2 py-3 transition pr-4' key={i} onClick={() => {
                                setOpenChat(true)
                                setConversation({
                                    ...conversation,
                                    receiver: person
                                })

                                const filtered = unread.filter((id) => id != person._id)
                                setUnread(filtered)
                                socket.emit('getMsg', {
                                    from: localStorage.getItem('userId'),
                                    to: person._id
                                });
                            }}>

                                <div className='flex items-center gap-3'>
                                    <div className="w-13 h-13 rounded-full bg-[#262a35] flex justify-center items-center">
                                        <p className='font-[poppins-bold] text-xl'>{person.username[0].toUpperCase()}</p>
                                    </div>

                                    <div className='flex flex-col -gap-1 justify-center'>
                                        <p className='font-[poppins-medium] text-md'>{person.username}</p>
                                        <p className='text-xs text-[#ffffff80] font-[poppins-medium]'>{(person.totalScore + person.bonus) - person.xpreduction} XP</p>
                                    </div>
                                </div>
                                {unread.includes(person._id) && <div className='p-2 rounded-full bg-[#3b52fa] text-xs w-2 h-2 flex justify-center items-center font-[poppins-medium]'></div>}
                            </div>

                        ))}


            </div>




            <BottomBar />
            <SwipeableDrawer
                anchor="bottom"
                open={openChat}
                onClose={() => {
                    setOpenChat(false);

                }}
                onOpen={() => setOpenChat(true)}
                transitionDuration={200}
                PaperProps={{
                    sx: {
                        backgroundColor: '#1a1b20',
                        borderTopLeftRadius: '2rem',
                        borderTopRightRadius: '2rem',
                    },
                }}
            >
                <div className="p-1.5 px-3 text-white bg-[#1a1b20] transition flex flex-col gap-4 items-center relative">
                    <div className='bg-[#262a35] w-12 h-1.5 rounded-full'></div>
                 
                    <Chat key={conversation.receiver?._id} users={conversation} setUnread={setUnread} />
                </div>
            </SwipeableDrawer>
        </div>
    )
}

export default Message;
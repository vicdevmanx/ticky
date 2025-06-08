import './chat.css';
import { useState, useContext, useEffect, useRef } from 'react';
import { GlobalContext } from '../../context';
import { socket } from '../../../socket';
import { toast } from 'sonner';

const Chat = ({ users, setUnread }) => {

    const { player, gameId, url } = useContext(GlobalContext);
    const [chat, setChat] = useState([]); // [{player: 'X', msg: 'content'}, {player: 'O', msg: 'content'}]
    const [inputs, setInputs] = useState({
        chatContent: ''
    });
    const chatEndRef = useRef(null);

    const autoScroll = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        autoScroll();
    }, [chat])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })
    }

    const handleSendMsg = () => {
        socket.emit('sendMessage', {
            message: {
                from: localStorage.getItem('userId'),
                to: users.receiver._id,
                content: inputs.chatContent,
                timestamp: Date.now()
            }
        });
        setInputs({
            ...inputs,
            chatContent: ''
        })
        autoScroll();
    }


    useEffect(() => {
        const handleNewMessage = ({ message, fromUser }) => {
            setChat((prev) => [...prev, message]);
            console.log('message:', message);

            if (localStorage.getItem('userId') !== message.from) {
                toast(`${fromUser.username}: ${message.content}`);
            }

            setUnread((prev) => Array.from(new Set([...prev, message.from])));

        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage); // 👈 cleanup here
        };
    }, []);

    useEffect(() => {
        socket.on('getMsg', ({ messages }) => {
            setChat((prev) => [...prev, ...messages])
            console.log('message:', ...messages)
        })
    },[])

    if (!users || !users.receiver) return null;
    return (
        <div className='flex flex-col w-screen max-w-lg relative pt-2'>
            <div className='flex items-center py-0 pb-3 p-3 border-b-1 fixed border-[#262a35] w-full max-w-lg z-10'>
                <div className='flex w-full  rounded-xl gap-3 items-center'>
                    <div className="w-10 h-10 rounded-full bg-[#262a35] flex justify-center items-center">
                        <p className='font-[poppins-bold] text-lg'>{users.receiver.username?.[0].toUpperCase() || ''}</p>
                    </div>
                    <div className='flex flex-col'>
                        <h3 className='font-[poppins-bold] text-sm'>{users.receiver.username}</h3>
                        <h5 className="text-xs">{(users.receiver.totalScore + users.receiver.bonus) - users.receiver.xpreduction} XP</h5>
                    </div>
                </div>


            </div>
            <div className="chats w-full max-h-[65vh] overflow-auto mt-13 mb-15 p-3 bg-[#1a1b20] flex flex-col gap-1 scrollbar-hidden">
                {chat && chat.map((singleMsg, i) => (
                    <div className={singleMsg.from == localStorage.getItem('userId') ? 'w-full flex justify-end' : 'w-full flex justify-start'} key={i}>
                        <p className='text-[0.85rem] py-1.5 flex items-center px-2 max-w-[85%] leading-4.5 font-[poppins-medium]' style={{ background: singleMsg.from == localStorage.getItem('userId') ? '#3b52fa' : '#262a35', borderRadius: singleMsg.from == localStorage.getItem('userId') ? '10px 10px 0 10px' : '10px 10px 10px 0' }}>
                            {singleMsg.content}
                        </p>
                        <div ref={chatEndRef}></div>
                    </div>

                ))}
            </div>
            <div className='flex items-center px-2  gap-1.5 fixed bottom-3 w-full max-w-lg bg-[#1a1b20] z-10'>
                <input
                    type="text"
                    className="bg-[#262a35] rounded-full p-3 pl-4 flex-grow outline-0"
                    placeholder='message'
                    name='chatContent'
                    value={inputs.chatContent}
                    onChange={handleChange}
                />
                <button className='p-3.5 transition rounded-full' style={{ backgroundColor: inputs.chatContent ? '#3b52fa' : '#262a35' }} onClick={handleSendMsg}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={inputs.chatContent ? "size-5 stroke-[#ffffff]" : "size-5 stroke-[#ffffff50]"}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </div>
    )
};

export default Chat
import O from '../../assets/characters/Oplayer.svg';
import X from '../../assets/characters/Xplayer.svg';
import { useState, useEffect, useContext, useRef } from 'react';
import { socket } from '../../../socket';
import { GlobalContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { toast } from 'sonner';


//connect to socket server

const Game = () => {
    const navigate = useNavigate();

    const [gameEnd, setGameEnd] = useState(false);
    const [winner, setWinner] = useState(null);
    const [tempBoard, setTempBoard] = useState(Array(9).fill(''))
    const [openChat, setOpenChat] = useState(false);
    const [reconnectPane, setReconnectPane] = useState(false);
    const [clickedEnd, setClickedEnd] = useState(false)
    const [points, setPoints] = useState({
        X: 0,
        O: 0
    });
    const [newChat, setNewChat] = useState(null)


    const {
        board, setBoard,
        player, setPlayer,
        currentPlayer, setCurrentPlayer,
        gameId, setGameId,
        setPendingGames,
        opponent, setOpponent,
        gameOn
    } = useContext(GlobalContext)

    useEffect(() => {
        if (!gameOn) {
            navigate('/')
            localStorage.removeItem('currentGameId')
            setGameId(localStorage.getItem('username') && localStorage.getItem('username') + 'Game')
        }
    }, [])


    const sendIndex = (boxIndex) => {
        if (board[boxIndex] || player !== currentPlayer) return

        console.log('move sent')
        socket.emit('move', { boxIndex: boxIndex, player, gameId: gameId });
        console.log(currentPlayer)
    }


    useEffect(() => {
        socket.on('boxIndex', ({ boxIndex, currentPlayer, board }) => {
            setCurrentPlayer(currentPlayer)
            setBoard(board)
            setTempBoard(board)
            console.log('currentPlayer:', currentPlayer)
        })

        socket.on('win', ({ winner, board, points }) => {
            setPoints({
                X: points.X,
                O: points.O
            });
            setGameEnd(true);
            setWinner(winner);
            setTempBoard(board);
        })

        socket.on('draw', ({ draw, board }) => {
            setGameEnd(true)
            setTempBoard(board)
        })
    }, [])


    const handleClose = () => {
        setGameEnd(false);
        setTimeout(() => {
            setWinner(null);
            setBoard(tempBoard)
            setClickedEnd(false)
        }, 100)

        socket.emit('continueGame', { gameId })

    }
    const [countDown, setCountDown] = useState(null);

    // Countdown Logic
    useEffect(() => {
        if (countDown === 0) {
            setGameEnd(false);
            setWinner(null);
            setBoard(tempBoard)
            setCountDown(null)
            return;
        }

        if (countDown === null) return;

        const interval = setInterval(() => {
            setCountDown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [countDown]);

    useEffect(() => {
        socket.on('continueGame', () => {
            setCountDown(3); // Start fresh countdown
        });

        return () => {
            socket.off('continueGame');
        };
    }, []);

    const RenderBox = ({ character, index }) => {
        return (
            <div className=' flex items-center justify-center rounded-2xl aspect-square bg-[#1a1b20] w-full' onClick={() => sendIndex(index)}>
                {character ? <img src={character == 'X' ? X : O} alt="" className='size-12' /> : <p className='w-12'></p>}
            </div>
        )
    }

    ///chatting
    const [chat, setChat] = useState([]); // [{player: 'X', msg: 'content'}, {player: 'O', msg: 'content'}]
    const [inputs, setInputs] = useState({
        chatContent: ''
    });
    const chatEndRef = useRef(null);

    const autoScroll = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })

    }

    
        const handleSendMsg = () => {
            socket.emit('sendMessage', {message: {
                from: localStorage.getItem('userId'), 
                to: opponent._id,
                content: inputs.chatContent,
                timestamp: Date.now()
            }, gameId});
            setInputs({
                ...inputs,
                chatContent: ''
            })
            autoScroll();
        }
    
    
        useEffect(() => {
           const handleGameMessage = ({ message, fromUser }) => {
        setChat((prev) => [...prev, message]);
        console.log('message:', message);

        if (localStorage.getItem('userId') !== message.from) {
            toast(`${fromUser.username}: ${message.content}`);
            setNewChat(true);
        }
    };

    socket.on('gameMessage', handleGameMessage);
    
    return () => {
        socket.off('gameMessage', handleGameMessage); // ✨ Clean it up
    };
        }, [])
    
         
    return (
        <div>

            <Dialog open={gameEnd} onClose={handleClose} PaperProps={{
                sx: {
                    borderRadius: '14px',
                    backgroundColor: '#1a1b20'
                }
            }}>
                <div className='bg-[#1a1b20] p-4 rounded-lg flex flex-col gap-4 min-w-64'>
                    <div className='font-[poppins-bold] text-lg text-center text-white'> {winner ? `${winner == player ? localStorage.getItem('username') : opponent.username}(${winner}) wins!` : clickedEnd ? 'What do you wanna do?' : `It's a draw!`} </div>
                    <div className='flex gap-2'>  <button className='bg-red-400 flex-grow p-1.5 px-3 rounded-lg text-md font-[poppins-bold] text-white cursor-pointer' onClick={async () => {
                            setPendingGames([])
                            // socket.emit('leaveGame', { gameId, player })
                            // socket.emit('deleteGame', ({ gameId }))
                            window.location.reload();
                        }}> End</button>
                        <button className='bg-blue-500 flex-grow p-1.5 px-3 rounded-lg text-md font-[poppins-bold] text-white' onClick={handleClose}> Continue {countDown && `(${countDown})`}</button>
                      
                    </div>
                </div>
            </Dialog>
            <div className='bg-[#1a1b20] p-4 flex items-center justify-between'>

                <p className='text-xl font-[poppins-bold]'>Game</p>
                <svg onClick={() => {
                    setGameEnd(true)
                    setClickedEnd(true)
                }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-9 p-2 transition rounded-full hover:bg-[#262a35] active:bg-[#262a35] cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>
            {/* <p className='text-4xl font-[poppins-bold] flex justify-center mt-2'>00:00</p> */}
            <div className='flex justify-center mt-4 gap-4'>
                <div className='flex flex-col items-center gap-2 '>
                    <div className='bg-[#262a35] p-1 pr-4 gap-3 rounded-full flex justify-center items-center border-2 transition' style={{ borderColor: currentPlayer == 'O' ? '#ffffff' : '#ffffff00' }}>
                        <div className='w-8 h-8 bg-[#1a1b20] font-[poppins-bold] text-xl rounded-full flex items-center justify-center'>{player == 'O' ? `${localStorage.getItem('username')[0].toUpperCase()}` : opponent?.username && opponent?.username[0].toUpperCase()}</div>
                        <img src={O} className='w-5' />
                        <p className='text-xl font-[poppins-bold]'>{points.O}</p>
                    </div>
                    <div className='bg-[#262a35] text-white p-1 px-1.5 rounded-lg text-sm min-w-28 flex items-center justify-center' style={{ background: currentPlayer == 'O' ? '#c75eff' : '#262a35' }}>{player == 'O' ? `${localStorage.getItem('username')} . Me` : opponent.username}</div>
                </div>

                <div className='flex flex-col items-center gap-2'>
                    <div className='bg-[#262a35] p-1 pr-4 gap-3 rounded-full flex justify-center items-center border-2 transition' style={{ borderColor: currentPlayer == 'X' ? '#ffffff' : '#ffffff00' }}>
                        <div className='w-8 h-8 bg-[#1a1b20] font-[poppins-bold] text-xl rounded-full flex items-center justify-center'>{player == 'X' ? `${localStorage.getItem('username')[0].toUpperCase()}` : opponent?.username && opponent.username[0].toUpperCase()}</div>
                        <img src={X} className='w-5' />
                        <p className='text-xl font-[poppins-bold]'>{points.X}</p>
                    </div>

                    <div className=' text-white p-1 px-1.5 rounded-lg text-sm min-w-28 flex items-center justify-center' style={{ background: currentPlayer == 'X' ? '#c75eff' : '#262a35' }}>{player == 'X' ? `${localStorage.getItem('username')} . Me` : opponent.username}</div>
                </div>
            </div>
            <div className='pb-4 pt-2 px-2 flex flex-col gap-2'>
                <div className='grid grid-cols-3 w-full p-2.5 gap-2.5 mt-2 max-w-sm m-auto bg-[#262a35] rounded-3xl'>
                    {board.map((item, index) => (
                        <RenderBox index={index} character={item} key={index} />
                    ))
                    }
                </div>
                <div className='pb-4 px-2'>
                    <div onClick={() => setOpenChat(true)} className='max-w-sm m-auto text-center font-[poppins-bold] text-sm transition active:bg-gradient-to-l from-[#3b52fa] to-[#c75eff] rounded-xl p-4 flex items-center gap-2 justify-center'
                        style={{ background: newChat ? 'linear-gradient(to right, #3b52fa, #c75eff)' : '#262a35' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                        </svg>
                        Open Chat
                    </div>

                </div>
            </div>
            {/*chats*/}
            <SwipeableDrawer
                anchor="bottom"
                open={openChat}
                onClose={() => {
                    setOpenChat(false);
                    setNewChat(false)
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
                    <div className='flex flex-col w-screen max-w-lg relative pt-2'>
                        <div className='flex items-center py-0 pb-3 p-3 border-b-1 fixed border-[#262a35] w-full max-w-lg z-10'>
                            <div className='flex w-full  rounded-xl gap-3 items-center'>
                                <div className="w-10 h-10 rounded-full bg-[#262a35] flex justify-center items-center">
                                    <p className='font-[poppins-bold] text-lg'>{opponent.username?.[0].toUpperCase() || ''}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <h3 className='font-[poppins-bold] text-sm'>{opponent.username}</h3>
                                    <h5 className="text-xs">{(opponent.totalScore + opponent.bonus) - opponent.xpreduction} XP</h5>
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
                            <button className='p-3.5 transition rounded-full' style={{ backgroundColor: inputs.chatContent ? '#3b52fa' : '#262a35' }}  onClick={handleSendMsg}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={inputs.chatContent ? "size-5 stroke-[#ffffff]" : "size-5 stroke-[#ffffff50]"}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </SwipeableDrawer>

            {/*reconnect Pane*/}
            <Drawer
                anchor="bottom"
                open={reconnectPane}
                transitionDuration={200}
                PaperProps={{
                    sx: {
                        backgroundColor: '#1a1b20',
                        borderTopLeftRadius: '2rem',
                        borderTopRightRadius: '2rem',
                    },
                }}
            >
                <div className="p-1.5 px-3 text-white h-[30vh] bg-[#1a1b20] flex flex-col gap-4 items-center">
                    <div className='bg-[#262a35] w-12 h-1.5 rounded-full'></div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>

                    <h3 className='font-[poppins-bold] text-lg'>Oops! you are Disconnected</h3>
                    <div className='flex gap-2 items-center'>
                        <button className=' flex items-center gap-1 px-4 py-2 rounded-xl bg-[#3b52fa] text-md font-[poppins-bold]' onClick={() => setReconnectPane(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>

                            Reconnect</button>

                        <button className='flex items-center gap-1 px-4 py-2 rounded-xl bg-red-400 text-md font-[poppins-bold]' onClick={() => navigate('/')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5" >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                            </svg>

                            Quit</button>

                    </div>
                </div>
            </Drawer>

        </div>
    )
}

export default Game
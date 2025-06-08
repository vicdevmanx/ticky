import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../../socket';
import { GlobalContext } from '../../context';
import { NavLink } from 'react-router-dom'
import { Button } from '@mui/material';
import { toast } from 'sonner';
import Loader from '../../assets/loader/loader';

//connect to socket server

const Home = () => {

  const navigate = useNavigate()
  const {
    board, setBoard,
    player, setPlayer,
    currentPlayer, setCurrentPlayer,
    gameId, setGameId,
    url, pendingGames, setPendingGames,
    opponent, setOpponent,
    gameOn, setGameOn
  } = useContext(GlobalContext)

  const [createGame, setCreateGame] = useState(false);
  const [joinGame, setJoinGame] = useState(false);
  const [copied, setCopied] = useState(false);
  const [XP, setXP] = useState(0)
  const [user, setUser] = useState('')

  useEffect(() => {
    socket.on('joinMsg', (data) => console.log(data))
  }, [])

  useEffect(() => {
    socket.on('player', ({ player }) => {
      console.log('player:', player)
      setPlayer(player)

    })

    socket.on('startGame', ({ currentPlayer }) => {
      console.log('currentPlayer:', currentPlayer)
      setCurrentPlayer(currentPlayer)

    })

    socket.on('userJoined', ({ users }) => {
      users.forEach((user) => {
        localStorage.getItem('userId') && user._id != localStorage.getItem('userId') && setOpponent(user)
      })

    })
  }, [])



  const handleCopy = async (gameCode) => {
    try {
      await navigator.clipboard.writeText(gameCode);
      toast.success('Game Code Copied!')
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      toast.error('failed to copy Game Code!')
    }
  };


  const fetchData = async () => {
    try {
      const response = await fetch(`${url}/api/v1/auth/data`, {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
        },
        body: JSON.stringify({ token: localStorage.getItem('tickyAuthToken') })
      });

      const result = await response.json()
      if (result.ok) {
        console.log('data:', result.user)
        localStorage.setItem('userId', result.user?._id)
        localStorage.setItem('username', result.user?.username)
        setUser(result.user?.username)
        setGameId(localStorage.getItem('currentGameId') || result?.user?.username + 'Game')
        const xpCal = ((result.user?.totalScore + result.user?.bonus) - result.user?.xpreduction)
        setXP(xpCal)
      } else {
        console.log('error:', result.message)
      }
    }
    catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    const storedToken = localStorage.getItem('tickyAuthToken')
    if (storedToken) {
      fetchData();
    }
  }, [])

  const [form, setForm] = useState({
    gameCode: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value
    })
  }

 useEffect(() => {
  const handleUserLeft = ({ message }) => {
    toast(`${opponent?.username || 'Player'} ${message}`);
  };

  socket.on('userLeft', handleUserLeft);

}, []); // 🔄 Include `opponent` if it's reactive


  const [gameCreated, setGameCreated] = useState(false)

  const handleJoinGameCheck = () => {
    if (!form.gameCode) {
      toast.error('Enter a Game to Join')
      return
    };
    socket.emit('checkGameExist', { gameId: form.gameCode })
  }

  useEffect(() => {
  const handleCheckGameExist = ({ exist, message, gameId }) => {
    if (exist) {
      socket.emit('joinGame', {
        gameId: gameId,
        userId: localStorage.getItem('userId'),
      });
      toast.success(`Successfully Joined ${gameId}!`);
      setGameId(gameId);
      localStorage.setItem('currentGameId', gameId);
      setPendingGames([{ gameCode: gameId, ready: true }]);
      setGameOn(true);
      navigate('/game');
    } else {
      toast.error(message);
    }
  };

  socket.on('checkGameExist', handleCheckGameExist);

  return () => {
    socket.off('checkGameExist', handleCheckGameExist);
  };
}, [navigate]); // Include navigate if needed


  useEffect(() => {
  const handleUserReady = ({ gameId }) => {
    setPendingGames([{ gameCode: gameId, ready: true }]);
    setGameOn(true);
    navigate('/game');
    toast.success(`${opponent?.username || 'Player'} Joined Your Game!`);
  };

  socket.on('userReady', handleUserReady);

 
}, []); // 👀 include deps you use inside


  return (
    <div>
      <div className="p-3 flex justify-between items-center bg-[#1a1b20] sticky top-0">
        <div className="flex  items-center">
          <img src="../../../logo.svg" alt="" className="w-10" />
        </div>
        <div className="flex gap-2 items-center">
          <div className="px-1 pr-2 py-1 min-w-16 h-7 bg-[#262a35] flex gap-1 justify-start rounded-2xl items-center">
            <span>🟡</span>
            <p className="text-sm pt-0.5 font-[poppins-medium]">{XP} XP</p>
          </div>
          {/* <div className='relative p-0.5'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
            <div className='bg-red-500 text-white p-1 absolute flex justify-center items-center rounded-full w-4 h-4 text-[10px] font-[poppins-bold] top-0 right-0'>10</div>
          </div> */}
          <div className="w-7 h-7 rounded-full bg-[#262a35] flex justify-center items-center border-1  border-[#3b52fa]"><p className='font-[poppins-bold] text-sm flex'>{user && user[0].toUpperCase()}</p></div>
          <button className='text-sm px-1 py-0.5 active:bg-[#3b52fa95] hover:bg-[#3b52fa95] rounded-md cursor-pointer text-white' onClick={() => {
            navigate('/login');
            localStorage.removeItem('tickyAuthToken')
            localStorage.removeItem('userId')
            localStorage.removeItem('username')
            localStorage.removeItem('currentGameId') && localStorage.removeItem('currentGameId')
            toast('You Logged Out!')
          }}>Logout</button>
        </div>
      </div>

      <div className="mt-2 p-2 flex flex-col gap-3 max-w-lg m-auto mb-6">
        <div className="w-full h-32 bg-gradient-to-l from-[#3b52fa] to-[#c75eff] rounded-xl gap-2 flex flex-col items-center justify-center ">
          <div className="rounded-full border-1 border-white p-0.5 px-2 bg-[#ffffff30] text-sm gap-2 flex gap-1 items-center"> <div className="bg-amber-300 w-3 h-3 rounded-full"></div><p>GAMES ONGOING</p> </div>
          <p className="text-[2rem] font-[poppins-bold]">5000</p>
        </div>
        <div className="flex gap-2">
          <div className="w-full h-14 bg-[#3b52fa] rounded-xl flex items-center 
        justify-center text-sm active:bg-[#3b52fa95] font-[poppins-bold]" onClick={() => {
              pendingGames.length == 0 ? setCreateGame(true) : toast.error('Please Quit Pending Game First!')
            }}>
            Create Game</div>

          <div className="w-full h-14 bg-[#262a35] rounded-xl flex items-center 
        justify-center text-sm active:bg-[#262a3595] font-[poppins-bold]" onClick={() => pendingGames.length != 0 ? toast.error('Please Quit Pending Game First!') : setJoinGame(true)}>
            Join Game</div>

        </div>

        {pendingGames.length != 0 ? <div className="w-full p-0 py-2 bg-[#262a35] rounded-xl flex flex-col">
          <p className="text-sm mb-2 pl-3 font-[poppins-bold]">🎮 Your Games </p>
          {pendingGames.map((element, i) =>
            <div className="flex gap-2 p-3 py-2 items-center justify-between  border-t-[0.5px] border-[#fafeff10] text-[13px] flex-wrap">

              <p className="font-[poppins-bold] text-[#ffffff] flex items-center"> {element.gameCode} <span className='w-8 h-8 active:bg-[#1a1b20] hover:bg-[#1a1b20] transition flex items-center justify-center rounded-xl cursor-pointer' onClick={() => handleCopy(gameId)}>
                {copied ? <p className='font-[poppins-bold]'>copied</p> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="size-5">
                  <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                  <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
                </svg>}
              </span></p>

              <div className='flex items-center'>
                {false ? <><p className='font-[poppins-bold] text-sm text-red-400' >Full</p>
                  <button className='bg-[#3b52fa] active:bg-[#3b52fa90] px-4 font-[poppins-bold] py-2 text-xs rounded-lg ml-4'>Close</button>
                </> : <> <button className={`${element.ready ? 'bg-[#3b52fa] active:bg-[#3b52fa90] px-2' : 'bg-[#3b52fa95] active:bg-[#3b52fa50] px-2'}  font-[poppins-bold] py-2 text-xs rounded-lg flex items-center justify-center gap-1.5`} onClick={() => element.ready ? navigate('/game') : toast.error('Waiting for other User to Join')}>{!element.ready && <Loader size={14} />}{element.ready ? 'Ready, Enter' : 'Pending...'}</button>
                  <button className='bg-red-400 active:bg-red-500 px-4 font-[poppins-bold] py-2 text-xs rounded-lg ml-2' onClick={
                    () => {
                      setGameCreated(false)
                      setPendingGames([])
                      socket.emit('leaveGame', { gameId, player })
                      socket.emit('deleteGame', ({ gameId }))
                      localStorage.removeItem('currentGameId')
                      setGameId(localStorage.getItem('username') && localStorage.getItem('username') + 'Game')
                      toast.success('Game Ended!')
                    }
                  }>Quit</button></>}
              </div>
            </div>
          )
          }

        </div> : <p className="text-sm mb-2 pl-3 font-[poppins-bold] text-center"> No Pending Games! </p>}

        <div className="w-full p-0 py-2 bg-[#262a35] rounded-xl flex flex-col">
          <p className="text-sm mb-2 pl-3 font-[poppins-bold]">Active Users</p>

          <div className="flex gap-2 p-2 items-center  border-t-[0.5px] border-[#fafeff10]">
            <span className="w-9 h-9 rounded-full bg-[#171a23]"></span>
            <span className="flex flex-col text-[13px]">
              <p className="font-[poppins-bold]">username</p>
              <p className="text-[10px]">300 XP</p>
            </span>
          </div>

          <div className="flex gap-2 p-2 items-center  border-t-[0.5px] border-[#fafeff10]">
            <span className="w-9 h-9 rounded-full bg-[#171a23]"></span>
            <span className="flex flex-col text-[13px]">
              <p className="font-[poppins-bold]">username</p>
              <p className="text-[10px]">300 XP</p>
            </span>
          </div>

          <div className="flex gap-2 p-2 items-center  border-t-[0.5px] border-[#fafeff10]">
            <span className="w-9 h-9 rounded-full bg-[#171a23]"></span>
            <span className="flex flex-col text-[13px]">
              <p className="font-[poppins-bold]">username</p>
              <p className="text-[10px]">300 XP</p>
            </span>
          </div>

          <div className="flex items-end justify-center w-full h-28 bg-gradient-to-t from-[#262a35] to-[#262a3520] -mt-28">
            <p className="text-[#fafeff98] font-[poppins-bold] text-xs active:bg-[#171a23] p-1 px-2 -mb-1 transition rounded-lg" onClick={() => navigate('/users')}>See more</p>
          </div>
        </div>





        <div className="w-full p-0 py-2 bg-[#262a35] rounded-xl flex flex-col">
          <p className="text-sm mb-2 pl-3 font-[poppins-bold]">🏆 Leaderboard</p>

          <div className="flex gap-2 p-2 items-center  border-t-[0.5px] border-[#fafeff10]">
            <span className="w-9 h-9 rounded-full bg-[#171a23]"></span>
            <span className="flex flex-col text-[13px]">
              <p className="font-[poppins-bold]">username🥇</p>
              <p className="text-[10px]">300 XP</p>
            </span>
          </div>

          <div className="flex gap-2 p-2 items-center  border-t-[0.5px] border-[#fafeff10]">
            <span className="w-9 h-9 rounded-full bg-[#171a23]"></span>
            <span className="flex flex-col text-[13px]">
              <p className="font-[poppins-bold]">username🥈</p>
              <p className="text-[10px]">300 XP</p>
            </span>
          </div>

          <div className="flex gap-2 p-2 items-center  border-t-[0.5px] border-[#fafeff10]">
            <span className="w-9 h-9 rounded-full bg-[#171a23]"></span>
            <span className="flex flex-col text-[13px]">
              <p className="font-[poppins-bold]">username🥉</p>
              <p className="text-[10px]">300 XP</p>
            </span>
          </div>

          <div className="flex items-end justify-center w-full h-28 bg-gradient-to-t from-[#262a35] to-[#262a3520] -mt-28">
            <p className="text-[#fafeff98] font-[poppins-bold] text-xs active:bg-[#171a23] p-1 px-2 -mb-1 transition rounded-lg" onClick={() => navigate('/leaderboard')}>see more</p>
          </div>
        </div>
      </div>

      <div className='bg-[#1a1b20ba] w-full max-w-28 m-auto rounded-full  flex items-center justify-between text-sm p-1 font-[poppins-bold] border-1 border-[#262a35] text-[#fafeff98] sticky bottom-6' style={{ backdropFilter: 'blur(5px)' }}>
        <NavLink to='/' className={({ isActive }) => console.log('good')}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='size-11 fill-[#fff] bg-[#3b52fa] p-2.5 rounded-full' viewBox="0 0 16 16"><path d="M8.543 2.232a.75.75 0 0 0-1.085 0l-5.25 5.5A.75.75 0 0 0 2.75 9H4v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V9h1.25a.75.75 0 0 0 .543-1.268z" /></svg></NavLink>

        <NavLink to='/messages'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='size-11 fill-[#fafeff50] bg-transparent p-2.5 rounded-full transition active:bg-[#262a35] hover:bg-[#262a35]' viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 3a9 9 0 0 0 0 18h4.5c1.398 0 2.097 0 2.648-.228a3 3 0 0 0 1.624-1.624C21 18.597 21 17.898 21 16.5V12a9 9 0 0 0-9-9m-4 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m3 4a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1" clip-rule="evenodd" /></svg></NavLink>
{/* 
        <NavLink to='/users'> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='size-11 fill-[#fafeff50] bg-transparent p-2.5 rounded-full transition active:bg-[#262a35] hover:bg-[#262a35]'>
          <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
        </svg></NavLink>

        <NavLink to='/leaderboard'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='size-11 fill-[#fafeff50] bg-transparent p-3 rounded-full transition active:bg-[#262a35] hover:bg-[#262a35]'>
          <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
        </svg></NavLink> */}

      </div>

      {/*create game drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={createGame}
        onClose={() => setCreateGame(false)}
        onOpen={() => setCreateGame(true)}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1b20',
            borderTopLeftRadius: '2rem',
            borderTopRightRadius: '2rem',
          },
        }}
      >
        <div className="p-1.5 px-3 max-w-md w-full text-white bg-[#1a1b20] flex flex-col gap-4 items-center m-auto">
          <div className='bg-[#262a35] w-12 h-1.5 rounded-full'></div>
          <p className="text-md mt-md font-[poppins-bold]">Create Game</p>
          <div className="max-w-md w-full p-3 pl-4 h-12 bg-[#262a35] rounded-lg flex items-center justify-between text-sm gap-6">
            <p className='font-[poppins-bold] text-sm'>{gameId}</p>
            <div className='w-10 h-10 rounded active:bg-[#1a1b20] transition flex items-center justify-center' onClick={() => handleCopy(gameId)}>
              {copied ? <p className='font-[poppins-bold]'>copied</p> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="size-6">
                <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
              </svg>}
            </div>
          </div>

          <div className='flex flex-col gap-2 w-full cursor-pointer'>
            <span className='w-full rounded-lg p-4 border-1 bg-[#262a34] border-[#3b52fa]'>Normal Tic-Tac-Toe</span>
            <span className='w-full rounded-lg p-4 border-1 border-[#262a34]'>Infinite Tic-Tac-Toe <br /> <span className='text-gray-500'>coming Soon...</span></span>
          </div>
          {gameCreated ? <button className='w-full rounded-lg bg-[#3b52fa95] py-3 mb-4 text-sm font-[poppins-bold] flex items-center justify-center gap-2 text-gray-300'><Loader size={18} /> Game Created Waiting for a Player</button> : <button className='w-full rounded-lg bg-[#3b52fa] py-3 text-sm mb-4' onClick={() => {
            setGameCreated(true);
            socket.emit('joinGame', { gameId: gameId, userId: localStorage.getItem('userId') })
            setPendingGames([
              ...pendingGames,
              { gameCode: gameId, ready: false }
            ])
            setCreateGame(false)
            toast.success('Game Created. Invite a friend!', {
              closeButton: true
            })
          }}>Create Game</button>}
        </div>
      </SwipeableDrawer>


      {/* join game drawer */}

      <SwipeableDrawer
        anchor="bottom"
        open={joinGame}
        onClose={() => setJoinGame(false)}
        onOpen={() => setJoinGame(true)}
        transitionDuration={200}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1b20',
            borderTopLeftRadius: '2rem',
            borderTopRightRadius: '2rem',
          },
        }}
      >
        <div className="p-1.5 px-3 max-w-md w-full text-white bg-[#1a1b20] flex flex-col gap-4 items-center m-auto">
              <div className='bg-[#262a35] w-12 h-1.5 rounded-full'></div>
          {/* <div className='w-full flex gap-2 items-center'> */}
          <p className="text-md mt-md font-[poppins-bold] ">Join Game</p>
          <div className="max-w-md w-full gap-2 h-12 bg-[#262a35] rounded-lg flex items-center text-sm min mb-4">
            <input type="search" placeholder="Enter Game Code" className="rounded-lg flex-grow h-full bg-transparent outline-none px-3 text-white border-1 border-transparent focus:border-[#3b5af2]"
              name='gameCode'
              value={form.gameCode}
              onChange={handleChange}
            />
            <button className='py-2 h-full px-4 bg-[#3b52fa] active:bg-[#3b52fa98] rounded-lg' onClick={handleJoinGameCheck}>Join</button>
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default Home;

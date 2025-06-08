import { createContext, useState, useEffect } from "react";
import { socket } from "../socket";
import { toast } from "sonner";






export const GlobalContext = createContext();


const GlobalState = ({children}) => {
    
const [board, setBoard] = useState(Array(9).fill(''));
const [player, setPlayer] = useState(null);
const [currentPlayer, setCurrentPlayer] = useState(null)
const [gameId, setGameId] = useState(localStorage.getItem('username') && localStorage.getItem('username') + 'Game' || localStorage.getItem('currentGameId') && localStorage.getItem('currentGameId')) ;
const [ allUsers, setAllUsers ] = useState([]);
const [url, setUrl] = useState('https://ticky-api.onrender.com')
const [loading, setLoading] = useState(false)
const [pendingGames, setPendingGames] = useState([])
const [opponent, setOpponent] = useState('Opponent')
const [gameOn, setGameOn] = useState(false)
 const [conversation, setConversation] = useState({
        sender: localStorage.getItem('username'),
        receiver: ''
    })
    const [chat, setChat] = useState([]); // [{player: 'X', msg: 'content'}, {player: 'O', msg: 'content'}]
        
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
    

    return(
        <GlobalContext.Provider 
        value={{
            board, setBoard,
            player, setPlayer,
            currentPlayer, setCurrentPlayer,
            gameId, setGameId,
            url, allUsers, setAllUsers,
            loading, setLoading,
            pendingGames, setPendingGames,
            opponent, setOpponent,
            gameOn, setGameOn,
            conversation, setConversation,
            chat, setChat
        }}>
        {children}</GlobalContext.Provider>
    )
}


export default GlobalState;
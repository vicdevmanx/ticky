import { createContext, useState } from "react";




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
            conversation, setConversation
        }}>
        {children}</GlobalContext.Provider>
    )
}


export default GlobalState;
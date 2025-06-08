import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '../../context'
import BottomBar from '../../bottombar/bottom'
import './users.css'
import Loader from '../../assets/loader/loader'
import { toast } from 'sonner'


const Users = () => {
    const navigate = useNavigate()
    const { url, allUsers, setAllUsers , loading, setLoading} = useContext(GlobalContext)

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
            if(!response.ok) {
                setLoading(false)
                const result = await response.json()
                console.log(result.message)
                return
            };
            const result = await response.json()
            if(result){
                setLoading(false)
                console.log(result.users)
                setAllUsers(result.users)
                localStorage.setItem('allUsers', JSON.stringify(result.users))
            }else{
                console.log(result)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        localStorage.getItem('allUsers') && setAllUsers(JSON.parse(localStorage.getItem('allUsers')))
        fetchUsers();
       
    },[])

    return (
        <div className='w-full max-w-lg m-auto flex flex-col h-full min-h-screen bg-[#1a1b20]'>
<div className='p-2 pb-0'>
                <input type='search' placeholder='Search users...' className='w-full text-sm bg-[#262a35] rounded-xl p-3 pl-4 outline-0' />
                </div>
            <div className='p-2 flex flex-col gap-2 sticky top-0 bg-[#1a1b20]'>
                <div className='flex gap-2 text-sm font-[poppins-medium] items-center'>
                <p className='p-1 px-3 rounded-full' style={{backgroundColor: '#3b52fa'}} onClick={() => setActive(false)}>All Users {allUsers && allUsers.length}</p>
                </div>
            </div>
         
            <div className='w-full flex flex-col gap-0 mb-24'>

{
    loading ?
<>
{allUsers.length != 0 && allUsers.map((person) => (

                <div className='flex justify-between items-center p-2 py-3 transition active:bg-[#262a3550] pr-4'>
                    <div className='flex items-center gap-3'>
                    <div className="w-13 h-13 rounded-full bg-[#262a35] flex justify-center items-center">
                        <p className='font-[poppins-bold] text-xl'>{person.username[0].toUpperCase()}</p>
                    </div>

                    <div className='flex flex-col justify-center'>
                        <p className='font-[poppins-medium] text-md'>{person.username}</p>
                        <p className='text-xs text-[#ffffff80] font-[poppins-medium]'>{(person.totalScore + person.bonus) - person.xpreduction} XP</p>
                    </div>
                    </div>
                    <div className='p-1.5 px-2.5 rounded-lg bg-[#3b52fa] text-sm flex justify-center items-center font-[poppins-medium] active:bg-[#262a3550]'>Challenge</div>
                </div>

))}
<div className='flex justify-center'><Loader size={20}/></div>
</>
    :
   allUsers.map((person) => (
                <div className='flex justify-between items-center p-2 py-3 transition pr-4'>
                    <div className='flex items-center gap-3'>
                    <div className="w-13 h-13 rounded-full bg-[#262a35] flex justify-center items-center">
                        <p className='font-[poppins-bold] text-xl'>{person.username[0].toUpperCase()}</p>
                    </div>

                    <div className='flex flex-col -gap-1 justify-center'>
                        <p className='font-[poppins-medium] text-md'>{person.username}</p>
                        <p className='text-xs text-[#ffffff80] font-[poppins-medium]'>{(person.totalScore + person.bonus) - person.xpreduction} XP</p>
                    </div>
                    </div>
                    <div className='p-1.5 px-2.5 rounded-lg bg-[#3b52fa] text-sm flex justify-center items-center font-[poppins-medium] active:bg-[#262a3550]'>Challenge</div>
                </div>

))}
            </div>


            

          <BottomBar/>
        </div>
    )
}

export default Users;
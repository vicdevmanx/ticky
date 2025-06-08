import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react'
import Loader from '../../assets/loader/loader';
import { toast } from 'sonner';
import { GlobalContext } from '../../context';


const Signup = () => {

    const navigate = useNavigate();
    const { url } = useContext(GlobalContext)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [err, setErr] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value.trim()
        })

    }

    const handleSignup = async () => {

        try {

            if (!formData.username || !formData.email || !formData.password) {
                toast.error('please fill out all fields')
                return
            }
            if (err.username || err.email || err.password) {
                toast.error(err.username || err.email || err.password)
                return
            }
            setLoading(true);
            const response = await fetch(`${url}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password })
            });
            const result = await response.json()
            if (result.ok) {
                setLoading(false);
                toast.success(result.message);
                localStorage.setItem('tickyAuthToken', result.token)
                console.log(result.token);
                navigate('/')
            } else {
                setLoading(false);
                toast.error(`${result.message} try again!`);
            }

        }
        catch (err) {
            console.log(err)
            toast.error(err);
        }
    }

    const checkUsername = async (identifier) => {
        const response = await fetch(`${url}/api/v1/auth/checkdata`, {
            method: 'POST',
            headers: { 'content-Type': 'application/json' },
            body: JSON.stringify({ identifier })
        });
        const result = await response.json()
        if (result.ok) {
            if (result.exists) {
                
                setErr({ ...err, username: `username already exists` })
            } else setErr({ ...err, username: '' });
        }
    }

    const checkEmail = async (identifier) => {
        const response = await fetch(`${url}/api/v1/auth/checkdata`, {
            method: 'POST',
            headers: { 'content-Type': 'application/json' },
            body: JSON.stringify({ identifier })
        });
        const result = await response.json()
        if (result.ok) {
            if (result.exists) {
                
                setErr({ ...err, email: `Email already exists` })
            } else setErr({ ...err, email: '' });
        }
    }

    return (
        <>
            <div className='max-lg:m-auto w-full flex items-center h-screen gap-[8%] min-sm:justify-center min-lg:justify-start max-lg:flex-col'>
                <div className='h-screen bg-gradient-to-l from-[#3b52fa] to-[#c75eff] w-[50%] max-lg:hidden flex items-center gap-4 justify-center'>
                    <img src='../../../tictactoelogolarge.svg' className='w-16' />
                    <h3 className='text-4xl font-[poppins-bold]'>Ticky</h3>
                </div>

                <div className='flex flex-col items-center w-full gap-1 max-w-sm px-2 '>

                    <h1 className='font-[poppins-bold] text-2xl mb-4 max-sm:mt-8 gap-2 items-center flex'>
                        <img src='../../../logo.svg' className='min-lg:hidden w-12 ' />
                        Welcome! Signup.</h1>
                    <input
                        required
                        type='text'
                        placeholder='Enter username i.e Nick name'
                        className="bg-[#262a35] w-full p-4 rounded-lg text-sm outline-none transition focus:border-[#ffffff] border-2 border-transparent "
                        name='username'
                        value={formData.username}
                        onChange={handleChange}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                            
                            if (e.target.value.length < 3) {
                                setErr({ ...err, username: 'Username must be at least 3 characters' });
                            } else if (e.target.value.length > 15) {
                                setErr({ ...err, username: 'Username must be at most 15 characters' });
                            }
                            else {
                                setErr({ ...err, username: '' });
                                checkUsername(e.target.value)
                            }


                        }}
                    />
                    <p className='text-red-500 text-sm'>{err.username}</p>
                    <input
                        required
                        type='email'
                        placeholder='Enter email'
                        className="bg-[#262a35] w-full p-4 rounded-lg text-sm outline-none transition focus:border-[#ffffff] border-2 border-transparent "
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^a-zA-Z0-9@._+%-]/g, '')
                            
                            if (!/\S+@\S+\.\S+/.test(e.target.value)) {
                                setErr({ ...err, email: 'Please enter a valid email address' });
                            } else if (e.target.value.length < 5) {
                                setErr({ ...err, email: 'Email must be at least 5 characters' });
                            } else if (e.target.value.length > 30) {
                                setErr({ ...err, email: 'Email must be at most 30 characters' });
                            }
                            else {
                                setErr({ ...err, email: '' });
                                checkEmail(e.target.value)
                            }
                        }}
                    />
                    <p className='text-red-500 text-sm'>{err.email}</p>
                    <input
                        required
                        type='text'
                        placeholder='Enter password'
                        className="bg-[#262a35] w-full p-4 rounded-lg text-sm outline-none transition focus:border-[#ffffff] border-2 border-transparent "
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^a-zA-Z0-9!@#$%&-_=+]/g, '')
                            if (e.target.value.length < 6) {
                                setErr({ ...err, password: 'Password must be at least 6 characters' });
                            } else if (e.target.value.length > 20) {
                                setErr({ ...err, password: 'Password must be at most 20 characters' });
                            }
                            else {
                                setErr({ ...err, password: '' });
                            }
                        }
                        }
                    />
                    <p className='text-red-500 text-sm'>{err.password}</p>
                    <button type='submit' onClick={handleSignup} disabled={loading} className={loading ? 'bg-gradient-to-l from-[#3b52fa98] to-[#c75eff98] w-full p-4 rounded-lg text-md mt-2 flex items-center gap-2 justify-center ' : 'transition hover:from-[#3b52faaa] hover:to-[#c75effaa] cursor-pointer bg-gradient-to-l from-[#3b52fa] to-[#c75eff] active:from-[#3b52fa98] active:to-[#c75eff98] transition w-full p-4 rounded-lg text-md mt-2 flex items-center gap-2 justify-center'}>
                        {loading ?
                            <> <Loader size='16px' /> <p>Signing up...</p></>
                            :
                            <p> Signup </p>
                        }
                    </button>
                    <p className='my-4'>Already have an account?</p>
                    <button className='w-full p-4 border-2 border-[#ffffff] rounded-lg text-md cursor-pointer' onClick={() => navigate('/login')}>Login</button>
                </div>
            </div>
        </>
    )
};

export default Signup;
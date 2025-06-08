import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import Loader from '../../assets/loader/loader';
import { toast } from 'sonner';
import { GlobalContext } from '../../context';

const Login = () => {

    const navigate = useNavigate();
    const { url } = useContext(GlobalContext)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })

    }

    const handleLogin = async () => {
        try {
            if(!formData.username || !formData.password) {
                toast.error('Please out all field')
                return
            }
            setLoading(true)
            const response = await fetch(`${url}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ username: formData.username, password: formData.password })
            });
            const result = await response.json();
            if (result.ok) {
                setLoading(false);
                toast.success(result.message);
                localStorage.setItem('tickyAuthToken', result.token)
                navigate('/')
            } else {
                setLoading(false);
                toast.error(`${result.message} try again!`);
            }
        }
        catch (err) {
                console.log(err)
            }
        }

    return (
            <div className='max-lg:m-auto w-full flex items-center h-screen gap-[8%] min-sm:justify-center min-lg:justify-start max-lg:flex-col'>
                <div className='h-screen bg-gradient-to-l from-[#3b52fa] to-[#c75eff] w-[50%] max-lg:hidden flex items-center gap-4 justify-center'>
                    <img src='../../../tictactoelogolarge.svg' className='w-16' />
                    <h3 className='text-4xl font-[poppins-bold]'>Ticky</h3>
                </div>

                <div className='flex flex-col items-center w-full gap-2 max-w-sm px-2 '>

                    <h1 className='font-[poppins-bold] text-2xl mb-4 max-sm:mt-8 gap-2 items-center flex'>
                        <img src='../../../logo.svg' className='min-lg:hidden w-12 ' />
                        Welcome! Login.</h1>
                    <input
                        type='text'
                        placeholder='Enter username i.e Nick name or Email'
                        className="bg-[#262a35] w-full p-4 rounded-lg text-sm outline-none transition focus:border-[#ffffff] border-2 border-transparent "
                        name='username'
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input
                        type='text'
                        placeholder='Enter password'
                        className="bg-[#262a35] w-full p-4 rounded-lg text-sm outline-none transition focus:border-[#ffffff] border-2 border-transparent "
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button onClick={handleLogin} disabled={loading} className={loading ? 'bg-gradient-to-l from-[#3b52fa98] to-[#c75eff98] w-full p-4 rounded-lg text-md mt-2 flex items-center gap-2 justify-center' : 'bg-gradient-to-l from-[#3b52fa] to-[#c75eff] active:from-[#3b52fa98] active:to-[#c75eff98] transition  w-full p-4 rounded-lg text-md mt-2 flex items-center gap-2 justify-center'}>
                        {loading ?
                            <> <Loader size='16px' /> <p>Logging in...</p></>
                            :
                            <p> Login </p>
                        }
                    </button>
                    <p className='my-4 text-md'>Don't have an account?</p>
                    <button className='w-full p-4 border-2 border-[#ffffff] rounded-lg text-md' onClick={() => navigate('/signup')}>Create an Account</button>
                </div>
            </div>
        )
    };


    export default Login;
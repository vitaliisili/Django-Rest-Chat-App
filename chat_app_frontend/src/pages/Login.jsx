import React, {useState} from 'react';
import login_bg from '../static/images/login_bg.jpg'
import {FaLock, FaUser} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import axios from "../api/axios";
import useAuthService from "../hooks/useAuthService";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {toast} from "react-toastify";


const LOGIN_URL = '/auth/token/'
const CURRENT_USER_URL = '/api/accounts/users/me'
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET

const Login = () => {
    const authService = useAuthService()
    const navigate = useNavigate()
    const privateAxios = useAxiosPrivate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginHandler = async  () => {
        const toast_id = toast.loading('Please wait...')
        try {
            const response = await axios.post(LOGIN_URL, {
                grant_type: 'password',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                username: email,
                password,
            }, {
                withCredentials: true
            });

            const accessToken = response?.data?.access_token
            const refreshToken = response?.data?.refresh_token

            authService.setAccessToken(accessToken)
            authService.setRefreshToken(refreshToken)

            const currentUser = await privateAxios(CURRENT_USER_URL)
            const data = currentUser?.data

            authService.setUser({
                name: `${data?.first_name} ${data?.last_name}`,
                email: data?.email,
                image: data?.image
            })

            setEmail('')
            setPassword('')
            toast.update(toast_id, {render: "Login success", type: 'success', isLoading: false, autoClose: 3000})
            navigate('/chat')

            console.log('Login success')
        } catch (error) {
            toast.update(toast_id, {render:"Login failed", type: 'error', isLoading:false, autoClose: 3000})
            console.error('Login failed:', error?.response?.data);
        }
    }

    const keyPressedHandler = (e) => {
        if (e.code === 'Enter') {
            loginHandler()
        }
    }

    return (
        <div className="flex h-screen justify-center items-center bg-no-repeat bg-cover" style={{backgroundImage: `url(${login_bg})`}}>

            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-4xl font-poppins text-white mb-4'>Login</h1>
                <div className='flex justify-center items-center bg-white/30 backdrop-blur-sm rounded-3xl backdrop-opacity-85'>
                    <FaUser className='text-white pl-3 pr-2 text-4xl'/>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='bg-transparent w-64 py-3 text-gray-700 border-none focus:ring-0 focus:outline-none' placeholder='Email address'/>
                </div>

                <div onKeyDown={keyPressedHandler} className='flex justify-center items-center bg-white/30 backdrop-blur-sm mt-4 rounded-3xl backdrop-opacity-85'>
                    <FaLock className='text-white pl-3 pr-2 text-4xl'/>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='bg-transparent w-64 py-3 text-gray-700 border-none focus:ring-0 focus:outline-none' placeholder='Password'/>
                </div>

                <button onClick={loginHandler} className='text-white bg-[#fc636b] font-bold rounded-3xl w-full py-2 mt-4'>Login</button>

                <div className='text-nobel-light mt-4 w-full text-center'>Not registered yet</div>

                <div className='text-white mt-4 font-bold uppercase'>
                    <Link to='/registration'>Create Account</Link>
                </div>
            </div>

        </div>
    );
};

export default Login;
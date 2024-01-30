import React, {useState} from 'react';
import login_bg from '../static/images/login_bg.jpg'
import {FaLock, FaUser} from "react-icons/fa";
import google from '../static/images/google.svg'
import facebook from '../static/images/facebook.svg'
import linkedin from '../static/images/linkedin.svg'
import github from '../static/images/github.svg'
import {Link, useNavigate} from "react-router-dom";
import axios from "../api/axios";
import useAuthService from "../hooks/useAuthService";
import useAxiosPrivate from "../hooks/useAxiosPrivate";


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
    const [errMsg, setErrMsg] = useState('');

    const loginHandler = async  () => {
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
            navigate('/chat')

            console.log('Login success')
        } catch (error) {
            console.error('Login failed:', error?.response?.data);
        }
    }

    return (
        <div className="flex h-screen justify-center items-center bg-no-repeat bg-cover" style={{backgroundImage: `url(${login_bg})`}}>

            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-4xl font-poppins text-white mb-4'>Login</h1>
                <div className='flex justify-center items-center bg-white/30 backdrop-blur-sm rounded-3xl backdrop-opacity-85'>
                    <FaUser className='text-white pl-3 pr-2 text-4xl'/>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" className='bg-transparent py-3 text-gray-700 border-none focus:ring-0 focus:outline-none' placeholder='Email address'/>
                </div>

                <div className='flex justify-center items-center bg-white/30 backdrop-blur-sm mt-4 rounded-3xl backdrop-opacity-85'>
                    <FaLock className='text-white pl-3 pr-2 text-4xl'/>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='bg-transparent py-3 text-gray-700 border-none focus:ring-0 focus:outline-none' placeholder='Password'/>
                </div>

                <button onClick={loginHandler} className='text-white bg-[#fc636b] font-bold rounded-3xl w-full py-2 mt-4'>Login</button>

                <div className='text-white mt-4 w-full text-center'>Or login using social media</div>
                <div className='flex mt-3 w-full justify-around'>
                    <img className='cursor-pointer' src={google} alt="google" width='50' height='50'/>
                    <img className='cursor-pointer' src={facebook} alt="facebook" width='50' height='50'/>
                    <img className='cursor-pointer' src={linkedin} alt="linkedin" width='50' height='50'/>
                    <img className='cursor-pointer' src={github} alt="github" width='50' height='50'/>
                </div>

                <div className='text-white mt-4 font-bold uppercase'>
                    <Link to='/registration'>Create Account</Link>
                </div>
            </div>

        </div>
    );
};

export default Login;
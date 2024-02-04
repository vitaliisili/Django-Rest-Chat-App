import React, {useState} from 'react';
import reg_bg from '../static/images/reg_bg.jpg'
import {FaLock, FaUser} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import axios from "../api/axios";
import {MdEmail} from "react-icons/md";
import {toast, ToastContainer} from "react-toastify";

const REGISTRATION_URL = '/api/accounts/users/'

const Registration = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('')
    const [submitLoader, setSubmitLoader] = useState(false)

    const registrationHandler = async () => {
        const toast_id = toast.loading('Please wait...')
        if (password !== checkPassword) {
            toast.update(toast_id, {render: "Password doesn't match", type: 'warning', isLoading: false, autoClose:3000})
            return
        }

        try {
            await axios.post(REGISTRATION_URL, {
                email,
                password,
                first_name: firstName,
                last_name: lastName
            })
            setEmail('')
            setFirstName('')
            setLastName('')
            setPassword('')
            setCheckPassword('')
            toast.update(toast_id, {render: "Registration success", type: 'success', isLoading: false, autoClose: 3000})
            navigate('/')
            console.log('Registration success')
        } catch (error) {
            toast.update(toast_id, {render:"Registration failed", type: 'error', isLoading:false, autoClose: 3000})
            console.log('Registration failed: ', error?.response?.data)
        }
    }

    return (
        <div className="flex h-screen justify-center items-center bg-no-repeat bg-cover"
             style={{backgroundImage: `url(${reg_bg})`}}>
            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-4xl font-poppins text-white mb-4'>Register</h1>
                <div className='flex justify-center items-center bg-white/30 backdrop-blur-sm rounded-3xl backdrop-opacity-85'>
                    <MdEmail className='text-white pl-3 pr-2 text-4xl'/>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="text"
                           className='bg-transparent w-64 py-3 text-gray-700 border-none focus:ring-0 focus:outline-none placeholder-gray-300'
                           placeholder='Email address'/>
                </div>

                <div
                    className='flex justify-center items-center bg-white/30 backdrop-blur-sm mt-4 rounded-3xl backdrop-opacity-85'>
                    <FaUser className='text-white pl-3 pr-2 text-4xl'/>
                    <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text"
                           className='bg-transparent w-64 py-3 text-gray-700 border-none focus:ring-0 focus:outline-none placeholder-gray-300'
                           placeholder='First name'/>
                </div>

                <div className='flex justify-center items-center bg-white/30 backdrop-blur-sm mt-4 rounded-3xl backdrop-opacity-85'>
                    <FaUser className='text-white pl-3 pr-2 text-4xl'/>
                    <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text"
                           className='bg-transparent w-64 py-3 text-gray-700 border-none focus:ring-0 focus:outline-none placeholder-gray-300'
                           placeholder='Last name'/>
                </div>

                <div className='flex justify-center items-center bg-white/30 backdrop-blur-sm mt-4 rounded-3xl backdrop-opacity-85'>
                    <FaLock className='text-white pl-3 pr-2 text-4xl'/>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password"
                           className='bg-transparent w-64 py-3 text-gray-700 border-none focus:ring-0 focus:outline-none placeholder-gray-300'
                           placeholder='Password'/>
                </div>

                <div className='flex justify-center items-center bg-white/30 backdrop-blur-sm mt-4 rounded-3xl backdrop-opacity-85'>
                    <FaLock className='text-white pl-3 pr-2 text-4xl'/>
                    <input onChange={(e) => setCheckPassword(e.target.value)} value={checkPassword} type="password"
                           className='bg-transparent w-64 py-3 text-gray-700 border-none focus:ring-0 focus:outline-none placeholder-gray-300'
                           placeholder='Check password'/>
                </div>

                <button onClick={registrationHandler} className='text-white bg-[#fc636b] font-bold rounded-3xl w-full py-2 mt-4'>Register</button>

                <div className='text-white mt-4 font-bold uppercase'>
                    <Link to='/'>Log In</Link>
                </div>
            </div>

        </div>
    );
};

export default Registration;
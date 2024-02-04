import React, {useEffect, useState} from 'react';
import {Tooltip} from "@mui/material";
import {LiaUserCheckSolid, LiaUserTimesSolid} from "react-icons/lia";
import {CiTimer} from "react-icons/ci";
import {IoCloseOutline} from "react-icons/io5";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuthService from "../hooks/useAuthService";


const CHAT_REQUEST_URL = '/api/chat/chat-requests/'
const API_URL = process.env.REACT_APP_API_BASE_URL;

const NotificationTab = ({tab}) => {
    const authService = useAuthService()
    const axios = useAxiosPrivate()
    const [chatRequests, setChatRequests] = useState(null)

    const notificationHandler = async () => {
        try {
            const response = await axios(CHAT_REQUEST_URL)
            const sendInvitation = []
            const receiveInvitation = []

            response?.data.forEach((item) => {
                if (item.receiver.email === authService.getUser().email && item.status === 'pending') {
                    sendInvitation.push(item)
                }

                if (item.sender.email === authService.getUser().email && item.status === 'pending') {
                    receiveInvitation.push(item)
                }
            })
            setChatRequests({sendInvitation: sendInvitation, receiveInvitation: receiveInvitation})
        } catch (error) {
            console.log('Failed to get notifications: ', error)
        }
    }

    useEffect(() => {
        if (tab) {
            notificationHandler()
        }
    }, []);


    const updateInvitationHandler = async (notification) => {
        try {
            const response = await axios.patch(`${CHAT_REQUEST_URL}${notification.id}/accept-invitation/`, {
                status: 2
            })
            console.log(response?.data)
            notificationHandler()
        }catch (error) {
            console.log('Contact accept failed: ', error?.response?.data)
        }
    }

    const removeInvitationHandler = async (notification) => {
        try {
            await axios.delete(`${CHAT_REQUEST_URL}${notification.id}/`)
            notificationHandler()
        }catch (error) {
            console.log('Notification removal failed: ', error?.response?.data)
        }
    }

    return (
        <div>
            {chatRequests &&
                <div className='p-4 space-y-4'>
                    <div className='text-2xl text-nobel'>Incoming requests</div>
                    {chatRequests.sendInvitation.map((invitation, index) => (
                        <div key={index} className='text-gallery'>
                            <div
                                className={`friends-container flex items-center text-gallery font-poppins`}>
                                <div className='image-wrapper items-center w[50px] h-[50px] text-center'>
                                    <div className='image bg-no-repeat bg-cover bg-center w-[50px] h-[50px] rounded-full' style={{backgroundImage: `url(${API_URL}${invitation.sender.image})`}}></div>
                                </div>

                                <div
                                    className='ml-4 flex justify-between w-full border-b border-shark py-4'>
                                    <div className='flex justify-center items-center'>
                                        <div>{invitation.sender.first_name} {invitation.sender.last_name}</div>
                                    </div>

                                    <div className='flex space-x-8'>
                                        <Tooltip title='Accept'>
                                            <div onClick={() => updateInvitationHandler(invitation)}><LiaUserCheckSolid className='cursor-pointer text-2xl text-green-900'/></div>
                                        </Tooltip>
                                        <Tooltip title='Decline'>
                                            <div onClick={() => removeInvitationHandler(invitation)}><LiaUserTimesSolid className='cursor-pointer text-2xl text-rose-900'/></div>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className='text-2xl text-nobel'>Out coming requests</div>
                    {chatRequests.receiveInvitation.map((invitation, index) => (

                        <div key={index} className='text-gallery'>
                            <div className={`friends-container flex items-center text-gallery font-poppins`}>
                                <div className='image-wrapper items-center w[50px] h-[50px] text-center'>
                                    <div className='image bg-no-repeat bg-cover bg-center w-[50px] h-[50px] rounded-full' style={{backgroundImage: `url(${API_URL}${invitation.receiver.image})`}}></div>
                                </div>

                                <div className='ml-4 flex justify-between w-full border-b border-shark py-4'>
                                    <div className='flex justify-center items-center'>
                                        <div>{invitation.receiver.first_name} {invitation.receiver.last_name}</div>
                                    </div>

                                    <div className='flex space-x-8'>
                                        {invitation.status === 'pending' ? <div className='flex space-x-2'>
                                            <Tooltip title='Pending'>
                                                <div><CiTimer className='text-2xl'/></div>
                                            </Tooltip>

                                            <Tooltip title='Cancel reuest'>
                                                <div><IoCloseOutline onClick={() => removeInvitationHandler(invitation)} className='cursor-pointer text-rose-900 text-2xl'/></div>
                                            </Tooltip>

                                        </div> : <></>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))

                    }
                </div>
            }
        </div>
    );
};

export default NotificationTab;
import React, {useEffect, useState} from 'react';
import testProfile from "../static/images/test-profile.jpg";
import {Tooltip} from "@mui/material";
import {LiaUserCheckSolid, LiaUserTimesSolid} from "react-icons/lia";
import {CiTimer} from "react-icons/ci";
import {IoCheckmarkDone, IoCloseOutline} from "react-icons/io5";
import {FaUserXmark} from "react-icons/fa6";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuthService from "../hooks/useAuthService";
import {TfiFaceSad} from "react-icons/tfi";

const CHAT_REQUEST_URL = '/api/chat/chat-requests/'

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
                if (item.receiver.email === authService.getUser().email && item.status === 'waiting') {
                    sendInvitation.push(item)
                }

                if (item.sender.email === authService.getUser().email) {
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


    const updateInvitationHandler = async (notification, type) => {
        try {
            const response = await axios.patch(`${CHAT_REQUEST_URL}${notification.id}/`, {
                status: type === 'accept' ? 2 : 3
            })
            notificationHandler()
        }catch (error) {
            console.log('Contact accept failed: ', error?.response?.data)
        }
    }

    const removeInvitationHandler = async (notification) => {
        try {
            const response = await axios.delete(`${CHAT_REQUEST_URL}${notification.id}/`)
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
                                    <div className='image bg-no-repeat bg-cover bg-center w-[50px] h-[50px] rounded-full' style={{backgroundImage: `url(${testProfile})`}}></div>
                                </div>

                                <div
                                    className='ml-4 flex justify-between w-full border-b border-shark py-4'>
                                    <div className='flex justify-center items-center'>
                                        <div>{invitation.sender.first_name} {invitation.sender.last_name}</div>
                                    </div>

                                    <div className='flex space-x-8'>
                                        <Tooltip title='Accept'>
                                            <div onClick={() => updateInvitationHandler(invitation, 'accept')}><LiaUserCheckSolid className='cursor-pointer text-2xl text-green-900'/></div>
                                        </Tooltip>
                                        <Tooltip title='Decline'>
                                            <div onClick={() => updateInvitationHandler(invitation, 'decline')}><LiaUserTimesSolid className='cursor-pointer text-2xl text-rose-900'/></div>
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
                                    <div className='image bg-no-repeat bg-cover bg-center w-[50px] h-[50px] rounded-full' style={{backgroundImage: `url(${testProfile})`}}></div>
                                </div>

                                <div className='ml-4 flex justify-between w-full border-b border-shark py-4'>
                                    <div className='flex justify-center items-center'>
                                        <div>{invitation.receiver.first_name} {invitation.receiver.last_name}</div>
                                    </div>

                                    <div className='flex space-x-8'>
                                        {invitation.status === 'waiting' ? <div className='flex space-x-2'>
                                            <Tooltip title='Pending'>
                                                <div><CiTimer className='text-2xl'/></div>
                                            </Tooltip>

                                            <Tooltip title='Cancel reuest'>
                                                <div><IoCloseOutline onClick={() => removeInvitationHandler(invitation)} className='cursor-pointer text-rose-900 text-2xl'/></div>
                                            </Tooltip>

                                        </div> : <></>}

                                        {invitation.status === 'declined' ? <div className='flex space-x-2'>
                                            <Tooltip title='Declined'>
                                                <div><TfiFaceSad className='text-2xl text-amber-700'/></div>
                                            </Tooltip>

                                            <Tooltip title='Remove notification'>
                                                <div><IoCloseOutline onClick={() => removeInvitationHandler(invitation)} className='cursor-pointer text-rose-900 text-2xl'/></div>
                                            </Tooltip>

                                        </div> : <></>}

                                        {invitation.status === 'accepted' ? <div className='flex space-x-2'>
                                            <Tooltip title='Accepted'>
                                                <div><IoCheckmarkDone className='text-2xl text-green-900'/></div>
                                            </Tooltip>

                                            <Tooltip title='Remove notification'>
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
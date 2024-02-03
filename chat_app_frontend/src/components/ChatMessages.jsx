import React, {useEffect, useState} from 'react';
import chatBg from "../static/images/chat_bg.jpg";
import AddContactsModal from "./AddContactsModal";
import {Tooltip} from "@mui/material";
import {FaRegSmileWink} from "react-icons/fa";
import {ImAttachment} from "react-icons/im";
import {TextareaAutosize as BaseTextareaAutosize} from "@mui/base/TextareaAutosize/TextareaAutosize";
import {GrSend} from "react-icons/gr";
import useAuthService from "../hooks/useAuthService";
import useWebSocket from "react-use-websocket";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import moment from "moment";

const MESSAGE_HISTORY_URL = '/api/chat/messages'
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ChatMessages = ({activeChat, addContactsModal, setAddContactsModal}) => {
    // console.log(activeChat)
    const authService = useAuthService()
    const axios = useAxiosPrivate()
    const [message, setMessage] = useState('')
    const [messageHistory, setMessageHistory] = useState([])
    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    } = useWebSocket(`ws://${BASE_URL}/ws/chat/${activeChat?.chat_name}?token=${authService.getAccessToken()}`, {
        onOpen: () => {

            const getHistory = async () => {
                try {
                    const response = await axios(`${MESSAGE_HISTORY_URL}/get-room-messages/?room-name=${activeChat.chat_name}`)
                    setMessageHistory(response?.data)
                } catch (error) {
                    console.log('Failed to get history: ', error?.response?.data)
                }
            }
            getHistory()
        },
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        if (lastJsonMessage !== null && lastJsonMessage?.type === 'message') {
            setMessageHistory((prev) => prev.concat(lastJsonMessage));
        }
        // console.log(lastJsonMessage)
    }, [lastJsonMessage, setMessageHistory]);

    const messageHandler = () => {
        if (!message) return
        sendJsonMessage({
            message: message,
            author: authService.getUser(),
            timestamp: new Date().toISOString()
        })
        setMessage('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
        }
    }

    const handleKeyUp = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            messageHandler()
        }
    }
    const convertTime = (timeStr) => {
        const date = moment(timeStr).toDate();
        const hours = String(date?.getHours()).padStart(2, '0');
        const minutes = String(date?.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    return (
        <div className='flex flex-col w-full h-full max-h-[calc(100%-68px)] z-10'>
            <div className={`relative flex flex-col-reverse flex-1 bg-cover bg-no-repeat bg-center w-full overflow-y-scroll py-8`} style={{backgroundImage: `url(${chatBg})`}}>
                {/*{*/}
                {/*    addContactsModal &&*/}
                {/*    <AddContactsModal callbackCloseModal={setAddContactsModal}/>*/}
                {/*}*/}
                {/*Message area*/}
                <div className='text-gallery w-full flex flex-col pb-5'>
                    {messageHistory && messageHistory.map((msg, index) => (
                        <div key={index} className='grid mb-1'>
                            {msg?.author?.email === authService.getUser().email ?
                                <div
                                    className='px-3 py-2 rounded-lg bg-eden flex justify-end justify-self-end mr-10 ml-32 break-all'>
                                    <div className='text-[14px]'>{msg.content}</div>
                                    <div className='flex min-w-8 text-[10px] text-nobel-light items-end justify-end -mb-0.5'>{convertTime(msg.timestamp)}</div>
                                </div> :
                                <div
                                    className='px-3 py-2 rounded-lg bg-shark flex justify-self-start ml-10 mr-32 break-all'>
                                    <div className='text-[14px]'>{msg.content}</div>
                                    <div className='flex min-w-8 text-[10px] text-nobel-light items-end justify-end -mb-0.5'>{convertTime(msg.timestamp)}</div>
                                </div>
                            }
                        </div>
                    ))}
                </div>


            </div>
            {/*Text Area Bottom Bar*/}
            <div className='bg-shark px-6 py-3 text-nobel-light flex space-x-4 items-end'>
                <div className='flex items-center h-10'>
                    <Tooltip title='Emoji'>
                        <div><FaRegSmileWink className='text-2xl cursor-pointer'/></div>
                    </Tooltip>
                </div>
                <div className='flex items-center h-10'>
                    <Tooltip title='Attach'>
                        <div><ImAttachment className='text-2xl cursor-pointer'/></div>
                    </Tooltip>
                </div>
                <BaseTextareaAutosize
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    value={message}
                    className='custom-scroll bg-space w-full px-4 py-2.5 rounded-md focus:outline-none resize-none'
                    maxRows={4} placeholder='Type a message'/>

                <div onClick={messageHandler} className='flex items-center h-10'>
                    <Tooltip title='Send'>
                        <div><GrSend className='text-2xl cursor-pointer'/></div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default ChatMessages;
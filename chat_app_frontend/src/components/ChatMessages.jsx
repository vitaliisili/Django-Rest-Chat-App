import React, {useEffect, useRef, useState} from 'react';
import chatBg from "../static/images/chat_bg.jpg";
import AddContactsModal from "./AddContactsModal";
import {Tooltip} from "@mui/material";
import {FaRegSmileWink} from "react-icons/fa";
import {ImAttachment} from "react-icons/im";
import {TextareaAutosize as BaseTextareaAutosize} from "@mui/base/TextareaAutosize/TextareaAutosize";
import {GrSend} from "react-icons/gr";
import useAuthService from "../hooks/useAuthService";
import useWebSocket from "react-use-websocket";

const ChatMessages = ({activeChat, addContactsModal, setAddContactsModal}) => {
    // console.log(activeChat)
    const authService = useAuthService()
    const [message, setMessage] = useState('')
    const [messageHistory, setMessageHistory] = useState([])
    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    } = useWebSocket(`ws://localhost:8000/ws/chat/${activeChat?.chat_name}?token=${authService.getAccessToken()}`, {
        onOpen: () => console.log('opened'),
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        if (lastJsonMessage !== null && lastJsonMessage?.type === 'message') {
            setMessageHistory((prev) => prev.concat(lastJsonMessage));
        }
        console.log(lastJsonMessage)
    }, [lastJsonMessage, setMessageHistory]);

    const messageHandler = () => {
        if (!message) return
        sendJsonMessage({
            message: message,
            author: authService.getUser()
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

    return (
        <div className='flex flex-col w-full h-full overflow-hidden'>
            <div
                // className={`relative flex flex-1 border bg-cover bg-no-repeat bg-center ${addContactsModal ? 'overflow-hidden' : 'overflow-y-scroll'}`}
                className={`relative flex flex-1 bg-cover bg-no-repeat bg-center overflow-hidden`}
                style={{backgroundImage: `url(${chatBg})`}}>
                {
                    addContactsModal &&
                    <AddContactsModal callbackCloseModal={setAddContactsModal}/>
                }
                {/*Message area*/}
                <div className='text-gallery w-full overflow-y-scroll flex flex-col justify-end border pb-5'>
                    {messageHistory && messageHistory.map((msg, index) => (
                        <div key={index} className='grid mb-0.5'>
                            {msg?.author?.email === authService.getUser().email ?
                                <div className='px-3 py-1 rounded-lg bg-eden w-fit justify-self-end mr-8'>{msg.message}</div>:
                                <div className='px-3 py-1 rounded-lg bg-shark w-fit justify-self-start ml-8'>{msg.message}</div>
                            }
                        </div>
                        // <div key={index}>{msg.message} : {msg.author.name}</div>
                    ))}
                </div>


            </div>
            {/*Text Area Bottom Bar*/}
            <div className='chat-type-bar bg-shark px-6 py-3 text-nobel-light flex space-x-4 items-end'>
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
                    className='custom-scroll bg-space w-full px-4 py-2.5 rounded-md focus:outline-0 resize-none'
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
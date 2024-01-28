import React, {useEffect, useState} from 'react';
import useWebSocket from "react-use-websocket";
import useAuthService from "../hooks/useAuthService";

const ChatTest = () => {
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
    } = useWebSocket(`ws://localhost:8000/ws/chat/1?token=${authService.getAccessToken()}`, {
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
        sendJsonMessage({
            message: message
        })
        setMessage('')
    }

    return (
        <div>
            <h1>Chat Lobby</h1>

            <input onChange={(e) => setMessage(e.target.value)} value={message} type="text"/>
            <button onClick={messageHandler}>Send message</button>

            <div>
                {messageHistory && messageHistory.map((msg, index) => (
                    <div key={index}>{msg.message} : {msg.user}</div>
                ))}
            </div>
        </div>
    );
};

export default ChatTest;
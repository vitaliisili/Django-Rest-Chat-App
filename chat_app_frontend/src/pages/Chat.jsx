import React, {useEffect, useState} from 'react';
import {IoSearch} from "react-icons/io5";
import {BsPersonAdd} from "react-icons/bs";
import {HiOutlineDotsVertical} from "react-icons/hi";
import {Tooltip} from "@mui/material";
import AddContactsModal from "../components/AddContactsModal";
import {MdNotifications} from "react-icons/md";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuthService from "../hooks/useAuthService";
import {useNavigate} from "react-router-dom";
import NotificationTab from "../components/NotificationTab";
import ChatMessages from "../components/ChatMessages";

const CHAT_CONTACTS_URL = '/api/chat/chat-rooms/contacts'
const API_URL = process.env.REACT_APP_API_BASE_URL;

const Chat = () => {
    const navigate = useNavigate()
    const authService = useAuthService()
    const axios = useAxiosPrivate()
    const [search, setSearch] = useState('')
    const [menuActive, setMenuActive] = useState(false)
    const [chatActive, setChatActive] = useState(null)
    const [addContactsModal, setAddContactsModal] = useState(false)
    const [contacts, setContacts] = useState(null)
    const [notificationTab, setNotificationTab] = useState(false)

    useEffect(() => {
        if (!notificationTab) {
            const getContacts = async () => {
                try {
                    const response = await axios(CHAT_CONTACTS_URL)
                    setContacts(response?.data)
                } catch (error) {
                    console.log('Failed to get contacts: ', error?.response?.data)
                }
            }
            getContacts()
        }
    }, [notificationTab]);

    const handleClearChat = () => {
    }

    const handleCloseChat = () => {
    }

    const handleDeleteChat = () => {
    }


    const handleActiveChat = (contact) => {
        setChatActive(contact)
    }

    const handleLogout = () => {
        authService.logout()
        navigate('/')
    }

    return (
        // <div className='mx-auto bg-bunker-dark justify-center flex w-full h-screen py-8'>
        <div className='bg-bunker-dark flex justify-center py-10 h-screen overflow-hidden'>
            <div className='flex w-full max-w-[1600px]'>
                {/*Left Window*/}
                <div className='flex flex-col border-r border-cape w-full min-w-[300px] max-w-[400px]'>
                    {/*Authenticated User Top Bar*/}
                    <div className='prfile-top flex justify-between items-center bg-shark px-4 py-3'>
                        <div className='flex space-x-3'>
                            <div className='image-wrapper items-center w[45px] h-[45px] text-center'>
                                <div className='image bg-no-repeat bg-cover bg-center w-[45px] h-[45px] rounded-full'
                                     style={{backgroundImage: `url(${authService.getUser().image})`}}></div>
                            </div>

                            <div
                                className='profile-info flex flex-col items-center justify-center text-gallery font-poppins leading-5'>
                                <span className='name'>{authService.getUser().name}</span>
                            </div>
                        </div>
                        {/*Notification bell*/}
                        <div onClick={() => setNotificationTab(!notificationTab)} className='relative cursor-pointer'>
                            <Tooltip title='Notification'>
                                <div>
                                    <MdNotifications className='text-nobel text-2xl mr-4'/>
                                    <div
                                        className='absolute w-1.5 h-1.5 rounded-full bg-emerald-500 top-0.5 right-3.5'></div>
                                </div>
                            </Tooltip>
                        </div>

                    </div>
                    {notificationTab ?
                        <NotificationTab tab={notificationTab}/> :
                        <div className='overflow-hidden h-full'>
                            {/*Search Section*/}
                            <div className='flex bg-bunker-light px-4 py-2'>
                                <div
                                    className='bg-shark flex justify-center items-center text-nobel px-4 rounded-bl-md rounded-tl-md'>
                                    <IoSearch/></div>
                                <input onChange={(e) => setSearch(e.target.value)} value={search} type="search"
                                       className='border-0 focus:outline-none bg-shark rounded-br-md rounded-tr-md w-full py-[8px] text-gallery text-sm'
                                       placeholder='Search for friends'/>
                                <Tooltip title='Add new friend'>
                                    <div onClick={() => setAddContactsModal(!addContactsModal)}
                                         className='add-new-member-button flex text-nobel cursor-pointer justify-center items-center ml-2'>
                                        <BsPersonAdd className='text-2xl'/></div>
                                </Tooltip>
                            </div>
                            {/*Contacts*/}
                            <div className='bg-bunker-light pb-20 h-full overflow-y-scroll'>
                                {contacts && contacts.map((contact, index) => (
                                    <div key={index}
                                         onClick={() => handleActiveChat(contact)}
                                         className={`friends-container pl-4 cursor-pointer hover:bg-shark flex items-center text-gallery font-poppins ${chatActive && chatActive === contact ? 'bg-space' : ''}`}>
                                        <div className='image-wrapper items-center w[50px] h-[50px] text-center'>
                                            <div
                                                className='image bg-no-repeat bg-cover bg-center w-[50px] h-[50px] rounded-full'
                                                style={{backgroundImage: `url(${API_URL}${contact.image})`}}>
                                            </div>
                                        </div>

                                        <div
                                            className='firend name ml-4 flex flex-col w-full border-b border-shark py-4'>
                                            <div className='flex justify-between'>
                                                <div>{contact.contact_name}</div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    }

                </div>
                {/*Right Window*/}
                <div className='flex flex-col w-full relative'>

                    {
                        addContactsModal &&
                        <AddContactsModal callbackCloseModal={setAddContactsModal}/>
                    }

                    {/*Top Info Bar*/}
                    <div className='bg-shark px-4 py-3 w-full'>
                        <div className='bar-info flex justify-between items-center'>
                            <div className='flex space-x-3'>
                                <div className='image-wrapper items-center w[45px] h-[45px] text-center'>
                                    <div
                                        className='image bg-no-repeat bg-cover bg-center w-[45px] h-[45px] rounded-full'
                                        style={{backgroundImage: `url(${API_URL}${chatActive?.image})`}}></div>
                                </div>

                                <div className='profile-info flex flex-col justify-center items-center text-gallery leading-5'>
                                    <span className='name'>{chatActive?.contact_name}</span>
                                </div>
                            </div>


                            <Tooltip title={menuActive ? '' : 'Menu'}>
                                <div className='relative inline-block'>
                                    <div onClick={() => setMenuActive(!menuActive)}>
                                        <HiOutlineDotsVertical className='text-2xl text-gallery cursor-pointer'/>
                                    </div>
                                    {menuActive &&
                                        <div
                                            className="absolute right-0 z-40 mt-2 w-40 font-light origin-top-right text-gallery text-sm rounded-[2px] py-2 bg-space shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div onClick={handleClearChat}
                                                 className='cursor-pointer hover:bg-shark px-5 py-2 transition-all duration-100'>Clear
                                                chat
                                            </div>
                                            <div onClick={handleCloseChat}
                                                 className='cursor-pointer hover:bg-shark px-5 py-2 transition-all duration-100'>Close
                                                chat
                                            </div>
                                            <div onClick={handleDeleteChat}
                                                 className='cursor-pointer hover:bg-shark px-5 py-2 transition-all duration-100'>Delete
                                                chat
                                            </div>
                                            <div onClick={handleLogout}
                                                 className='cursor-pointer hover:bg-shark px-5 py-2 transition-all duration-100'>Logout
                                            </div>
                                        </div>
                                    }
                                </div>
                            </Tooltip>
                        </div>

                    </div>
                    {/*Chat Window*/}
                    {
                        chatActive && <ChatMessages activeChat={chatActive} addContactsModal={addContactsModal}
                                                    setAddContactsModal={setAddContactsModal}/>
                    }

                </div>
            </div>
        </div>
    )
        ;
};

export default Chat;
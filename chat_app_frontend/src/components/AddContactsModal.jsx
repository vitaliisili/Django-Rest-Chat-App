import React, {useState} from 'react';
import {Tooltip} from "@mui/material";
import {IoMdCloseCircle} from "react-icons/io";
import {IoSearch} from "react-icons/io5";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
// import testProfile from "../static/images/test-profile.jpg";

const URL_REQUEST_INVITE = '/api/chat/chat-requests/'
const URL_CONTACT = '/api/accounts/users/contact/'
const AddContactsModal = ({callbackCloseModal}) => {
    const axios = useAxiosPrivate()
    const [search, setSearch] = useState('')
    const [contact, setContact] = useState(null)
    const [showNotFound, setShowNotFound] = useState(false)

    const submitInviteHandler = async () => {
        try {
            const response = await axios.post(URL_REQUEST_INVITE, {
                email: contact?.email
            })
            setContact(null)
            setSearch('')
        }catch (error) {
            console.log('Friend Request Fail: ', error?.response?.data)
        }
    }

    const searchContactHandler = async () => {
        try {
            const response = await axios(`${URL_CONTACT}?email=${search}`)
            setContact(response?.data)
            setShowNotFound(false)
        }catch (error) {
            setShowNotFound(true)
            setContact(null)
            console.log('Searching failed: ', error?.response?.data)
        }
    }

    return (
        <div className='bg-space/30 backdrop-blur-sm flex w-full h-full justify-center absolute z-50'>
            <div className='relative flex flex-col h-fit mt-20 bg-bunker-light/80 p-16 px-24'>
                <div className='flex'>
                    <Tooltip title='Close'>
                        <div onClick={() => callbackCloseModal(false)}
                             className='absolute top-2 right-2 cursor-pointer'>
                            <IoMdCloseCircle className='text-space text-3xl'/>
                        </div>
                    </Tooltip>

                    <div
                        className='bg-shark flex justify-center items-center text-nobel px-4 rounded-bl-md rounded-tl-md'>
                        <IoSearch className='text-2xl'/>
                    </div>
                    <input onChange={(e) => setSearch(e.target.value)} value={search} type="search"
                           className='border-0 focus:outline-none bg-shark  w-80 py-4 text-gallery text-sm'
                           placeholder='Type friend email'/>
                    <button
                        onClick={searchContactHandler}
                        onKeyDown={searchContactHandler}
                        className='text-nobel bg-space px-3 rounded-tr-md rounded-br-md cursor-pointer hover:bg-space/80'>Search
                    </button>
                </div>
                <div className='text-nobel justify-center items-center mt-8'>
                    <div>
                        {contact ?
                            <div className={`friends-container flex items-center text-gallery font-poppins`}>
                                <div className='image-wrapper items-center w[50px] h-[50px] text-center'>
                                    <div className='image bg-no-repeat bg-cover bg-center w-[50px] h-[50px] rounded-full' style={{backgroundImage: `url(${contact?.image})`}}></div>
                                </div>

                                <div className='ml-4 flex justify-between w-full border-b border-shark py-4'>
                                    <div className='flex justify-center items-center'>
                                        <div>{contact.first_name} {contact.last_name}</div>
                                    </div>
                                    <button
                                        onClick={submitInviteHandler}
                                        className='cursor-pointer bg-space hover:bg-space/80 p-2 rounded-md text-sm text-nobel'>Send Invite
                                    </button>
                                </div>
                            </div> :
                            <div className='text-center'>
                                {showNotFound ?  "Contact not found with this email" : ""}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddContactsModal;
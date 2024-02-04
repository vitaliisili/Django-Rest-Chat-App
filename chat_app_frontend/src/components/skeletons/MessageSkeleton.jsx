import React from 'react';

const MessageSkeleton = () => {
    return (
        <div className='text-gallery w-full flex flex-col pb-5'>
            <div className='grid mb-1 space-y-2'>
                <div className='skeleton w-24 h-6 rounded-lg justify-self-end mr-10 ml-32 bg-shark'></div>
                <div className='skeleton w-32 h-6 rounded-lg bg-shark justify-self-start ml-10 mr-32'></div>

                <div className='skeleton w-24 h-6 rounded-lg justify-self-end mr-10 ml-32 bg-shark'></div>
                <div className='skeleton w-60 h-6 rounded-lg bg-shark justify-self-start ml-10 mr-32'></div>
                <div className='skeleton w-48 h-6 rounded-lg bg-shark justify-self-start ml-10 mr-32'></div>
            </div>
        </div>
    );
};

export default MessageSkeleton;
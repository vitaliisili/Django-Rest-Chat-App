import React from 'react';

const ContactsSkeleton = () => {
    return (
        <div className='bg-bunker-light pb-20 h-full overflow-y-scroll space-y-4'>
            <div className='pl-4 cursor-pointer space-x-5 flex items-center'>
                <div className='skeleton bg-shark w-14 h-12 rounded-full'></div>

                <div className='ml-4 w-full border-b border-shark py-4'>
                    <div className='skeleton w-36 h-5 bg-shark'></div>
                </div>
            </div>

            <div className='pl-4 cursor-pointer space-x-5 flex items-center'>
                <div className='skeleton bg-shark w-14 h-12 rounded-full'></div>

                <div className='ml-4 w-full border-b border-shark py-4'>
                    <div className='skeleton w-36 h-5 bg-shark'></div>
                </div>
            </div>

            <div className='pl-4 cursor-pointer space-x-5 flex items-center'>
                <div className='skeleton bg-shark w-14 h-12 rounded-full'></div>

                <div className='ml-4 w-full border-b border-shark py-4'>
                    <div className='skeleton w-36 h-5 bg-shark'></div>
                </div>
            </div>
        </div>
    );
};

export default ContactsSkeleton;
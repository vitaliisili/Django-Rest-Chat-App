import React from 'react';

const SearchContactSkeleton = () => {
    return (
        <div className='flex items-center justify-between border-b border-cape pb-2'>
            <div className='flex items-center'>
                <div className='skeleton bg-shark w-14 h-14 rounded-full'></div>
                <div className='skeleton bg-shark w-48 ml-4 h-5'></div>
            </div>
            <div className='skeleton bg-shark rounded-md w-28 h-10'></div>
        </div>
    );
};

export default SearchContactSkeleton;
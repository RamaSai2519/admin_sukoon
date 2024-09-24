import React, { useState } from 'react';

const DashboardTile = ({ title, msg, children, style, onClick, pointer = "default", customClass = "" }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className={`relative m-2 min-h-36 p-5 rounded-3xl min-w-fit cshadow justify-between dark:bg-lightBlack items-start flex flex-col cursor-${pointer} ${customClass}`}
            style={style}
            onClick={onClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {msg &&
                <div className={`absolute right-0 bottom-[15%] z-10 w-[120px] text-white p-1.5 text-center rounded-lg bg-black transition-opacity duration-300 ${showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    {msg}
                </div>
            }
            {title && <h3 className='text-2xl font-bold'>{title}</h3>}
            {children}
        </div>
    );
};

export default DashboardTile;

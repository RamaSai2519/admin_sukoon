import React, { useState } from 'react';

const DashboardTile = ({ title, msg, children, style, onClick, pointer = "default" }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const tooltipStyle = {
        visibility: showTooltip ? 'visible' : 'hidden',
        width: '120px',
        backgroundColor: 'black',
        color: '#fff',
        textAlign: 'center',
        borderRadius: '6px',
        padding: '5px',
        position: 'absolute',
        bottom: "15%",
        right: 0,
        zIndex: 1,
        opacity: showTooltip ? 1 : 0,
        transition: 'opacity 0.3s',
    };

    const arrowStyle = {
        content: '""',
        position: 'absolute',
        top: '100%', /* Arrow at the bottom of the tooltip */
        left: '50%',
        marginLeft: '-5px',
        borderWidth: '5px',
        borderStyle: 'solid',
        borderColor: 'black transparent transparent transparent',
    };

    return (
        <div
            className={`m-2 min-h-36 p-5 rounded-3xl min-w-fit cshadow justify-between dark:bg-lightBlack items-start flex flex-col cursor-${pointer}`}
            style={{ ...style, position: 'relative' }}
            onClick={onClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {msg &&
                <div style={tooltipStyle}>
                    {msg}
                    <div style={arrowStyle}></div>
                </div>
            }
            <h3 className='text-2xl font-bold'>{title}</h3>
            {children}
        </div>
    );
};

export default DashboardTile;

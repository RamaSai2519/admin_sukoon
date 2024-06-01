import { useEffect, useRef, useState } from 'react';

const DashboardTile = ({ title, children, style, onClick, pointer = "default" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={ref} className={`opacity-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : ''} m-2 min-h-36 p-5 rounded-3xl min-w-fit cshadow justify-between dark:bg-lightBlack items-start flex flex-col cursor-${pointer}`} style={style} onClick={onClick}>
            <h3 className='text-2xl font-bold'>{title}</h3>
            {children}
        </div>
    );
};

export default DashboardTile;
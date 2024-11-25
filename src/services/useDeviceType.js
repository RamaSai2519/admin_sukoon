import { useState, useEffect } from 'react';

const useDeviceType = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isDesktop;
};

export default useDeviceType;

import { useState, useEffect } from 'react';

const useMediaQuery = (width) => {
    const [targetReached, setTargetReached] = useState(false);

    const updateTarget = (e) => {
        if (e.matches) {
            setTargetReached(true);
        } else {
            setTargetReached(false);
        }
    };

    useEffect(() => {
        const media = window.matchMedia(`(min-width: ${width}px)`);
        media.addEventListener('change', updateTarget);

        if (media.matches) {
            setTargetReached(true);
        }

        return () => media.removeEventListener('change', updateTarget);
    }, []);

    return targetReached;
};

export default useMediaQuery;

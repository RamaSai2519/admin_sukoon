import { useEffect, useRef, useState } from 'react';

const LazyLoad = ({ children }) => {
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
        <div ref={ref} className={`opacity-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : ''}`}>
            {children}
        </div>
    );
};

export default LazyLoad;

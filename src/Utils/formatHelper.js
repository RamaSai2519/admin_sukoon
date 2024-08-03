export const formatTime = (time) => {
    const newTime = new Date(time).toLocaleTimeString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
    if (newTime === 'Invalid Date') {
        return time || '';
    }
    return newTime;
};

export const formatDate = (date) => {
    const newDate = new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    if (newDate === 'Invalid Date') {
        return date || '';
    }
    return newDate;
};
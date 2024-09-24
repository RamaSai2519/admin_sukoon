const convertToIST = (time) => {
    const date = new Date(time);
    const offsetIST = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
    return new Date(date.getTime() + offsetIST);
};

export const formatTime = (time) => {
    const istDate = convertToIST(time);

    const newTime = istDate.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });
    if (newTime === 'Invalid Date') return time || '';
    return newTime;
};

export const formatDate = (time) => {
    const istDate = convertToIST(time);
    const newDate = istDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    if (newDate === 'Invalid Date') return time || '';
    return newDate;
};
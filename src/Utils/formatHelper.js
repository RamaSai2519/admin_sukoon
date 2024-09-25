import { format } from 'date-fns';

// Convert time to IST
export const convertToIST = (time) => {
    let utcDate = new Date(time);

    // Get the time in milliseconds and add the IST offset (5 hours 30 minutes)
    let istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    let istDate = new Date(utcDate.getTime() + istOffset);

    return istDate === 'Invalid Date' ? (time || '') : istDate;
};

// Format time with date and time details
export const formatTime = (time) => {
    const istDate = convertToIST(time);
    const newTime = format(istDate, 'd MMM yyyy, h:mm:ss a');
    return newTime === 'Invalid Date' ? (time || '') : newTime;
};

// Format only the date, with an optional year
export const formatDate = (time, year = true) => {
    const istDate = convertToIST(time);
    const newDate = year ? format(istDate, 'd MMM yyyy') : format(istDate, 'd MMM');
    return newDate === 'Invalid Date' ? (time || '') : newDate;
};
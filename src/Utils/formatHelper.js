import { format } from 'date-fns';

export const convertToIST = (time) => {
    let utcDate = new Date(time);

    let istOffset = 5.5 * 60 * 60 * 1000;
    let istDate = new Date(utcDate.getTime() + istOffset);

    return istDate === 'Invalid Date' ? (time || '') : istDate;
};

export const formatTime = (time) => {
    const istDate = convertToIST(time);
    try {
        const newDate = format(istDate, 'd MMM yyyy, h:mm:ss a');
        return newDate;
    } catch (error) {
        console.log('error', error);
        return istDate;
        
    }
};

export const formatDate = (time, year = true) => {
    const istDate = convertToIST(time);
    try {
        const newDate = year ? format(istDate, 'd MMM yyyy') : format(istDate, 'd MMM');
        return newDate;
    } catch (error) {
        console.log('error', error);
        return istDate;
    }
};
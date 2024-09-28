import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const strToDate = (timeString) => {
    const utcDate = new Date(timeString);
    if (isNaN(utcDate.getTime())) {
        return timeString;
    }
    const istDate = toZonedTime(utcDate, 'Asia/Kolkata');
    return istDate;
};

export const formatTime = (time) => {
    const istDate = strToDate(time);
    try {
        const newDate = format(istDate, 'd MMM yyyy, h:mm:ss a');
        return newDate;
    } catch (error) {
        console.log('error', error);
        return istDate;
    }
};

export const formatDate = (time, year = true) => {
    const istDate = strToDate(time);
    try {
        const newDate = year ? format(istDate, 'd MMM yyyy') : format(istDate, 'd MMM');
        return newDate;
    } catch (error) {
        console.log('error', error);
        return istDate;
    }
};

import moment from 'moment-timezone';

// Convert time to IST
export const convertToIST = (time) => {
    const value = moment(time).tz('Asia/Kolkata');
    return new Date(value.format());
};

// Format time with date and time details
export const formatTime = (time) => {
    const istDate = convertToIST(time);
    const newTime = istDate.format('D MMM YYYY, h:mm:ss A');
    return newTime === 'Invalid Date' ? (time || '') : newTime;
};

// Format only the date, with an optional year
export const formatDate = (time, year = true) => {
    const istDate = convertToIST(time);
    const newDate = year ? istDate.format('D MMM YYYY') : istDate.format('D MMM');
    return newDate === 'Invalid Date' ? (time || '') : newDate;
};
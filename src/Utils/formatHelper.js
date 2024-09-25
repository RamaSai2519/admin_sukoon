import moment from 'moment-timezone';

// Convert time to IST
export const convertToIST = (time, reqDateObj = true) => {
    const value = moment(time).tz('Asia/Kolkata');
    if (reqDateObj) {
        return new Date(value.format());
    } else {
        return value
    }
};

// Format time with date and time details
export const formatTime = (time) => {
    const istDate = convertToIST(time, false);
    const newTime = istDate.format('D MMM YYYY, h:mm:ss A');
    return newTime === 'Invalid Date' ? (time || '') : newTime;
};

// Format only the date, with an optional year
export const formatDate = (time, year = true) => {
    const istDate = convertToIST(time, false);
    const newDate = year ? istDate.format('D MMM YYYY') : istDate.format('D MMM');
    return newDate === 'Invalid Date' ? (time || '') : newDate;
};
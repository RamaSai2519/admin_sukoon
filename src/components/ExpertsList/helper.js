import { formatDate } from '../../Utils/formatHelper';
import { Button } from 'antd';

const durationStrToSeconds = (duration) => {
    if (!duration) return 0;
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

export const calculateCallStats = (expertCalls, expert) => {
    const stats = {
        failed: 0,
        missed: 0,
        successful: 0,
        totalDuration: 0,
        totalSuccessfulDuration: 0,
        uniqueDaysSpoken: new Set(),
    };

    expertCalls.forEach(call => {
        if (call.status === 'successful' && call.failedReason === '') {
            stats.successful++;
            stats.totalSuccessfulDuration += durationStrToSeconds(call.duration); // Add the duration for successful calls
        } else if (call.status === 'failed') {
            stats.failed++;
        } else if (call.status === 'missed') {
            stats.missed++;
        }

        stats.totalDuration += durationStrToSeconds(call.duration);
        stats.uniqueDaysSpoken.add(formatDate(call.initiatedTime));
    });

    const avgCallsPerDay = stats.successful / expert.daysLoggedIn;
    const failedCallsCent = (stats.failed / expertCalls.length) * 100;
    const missedCallsCent = (stats.missed / expertCalls.length) * 100;
    const successfulCallsCent = (stats.successful / expertCalls.length) * 100;

    const hoursSpoken = (stats.totalDuration / 3600).toFixed(2);

    const utilization = (hoursSpoken > expert.timeSpent ? 100 : (hoursSpoken / expert.timeSpent) * 100);

    // Calculate avg duration of successful calls
    const avgSuccessfulCallDuration = stats.successful > 0
        ? (stats.totalSuccessfulDuration / stats.successful / 60).toFixed(2)
        : 0;

    return {
        failed: stats.failed,
        missed: stats.missed,
        hoursSpoken: hoursSpoken,
        successful: stats.successful,
        utilization: utilization.toFixed(2),
        avgCallsPerDay: avgCallsPerDay.toFixed(2),
        failedCallsCent: failedCallsCent.toFixed(2),
        missedCallsCent: missedCallsCent.toFixed(2),
        uniqueDaysSpoken: stats.uniqueDaysSpoken.size,
        successfulCallsCent: successfulCallsCent.toFixed(2),
        avgSuccessfulCallDuration: avgSuccessfulCallDuration
    };
};

const createColumn = (title, dataIndex, key, sorterType = 'numeric', fixed = false) => {
    const sorter = (a, b) => {
        if (sorterType === 'numeric') {
            return (a[dataIndex] || 0) - (b[dataIndex] || 0);
        } else {
            return (a[dataIndex] || '').localeCompare(b[dataIndex] || '');
        }
    };

    return {
        title,
        dataIndex,
        key,
        sorter,
        ...(fixed && { fixed })
    };
};

const nameSorter = (a, b) => {
    const nameA = a.name ? a.name.replace('Sarathi ', '') : '';
    const nameB = b.name ? b.name.replace('Sarathi ', '') : '';
    return nameA.localeCompare(nameB);
};

export const columns = [
    {
        title: 'Expert',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        sorter: nameSorter,
    },
    createColumn('Days Logged In', 'daysLoggedIn', 'daysLoggedIn'),
    createColumn('Logged In Hours', 'timeSpent', 'timeSpent'),
    createColumn('Hours Spoken', 'hoursSpoken', 'hoursSpoken'),
    createColumn('Utilization %', 'utilization', 'utilization'),
    createColumn('Unique Days Spoken', 'uniqueDaysSpoken', 'uniqueDaysSpoken'),
    createColumn('Successful Calls', 'successfulCalls', 'successfulCalls'),
    createColumn('Successful Calls %', 'successfulCallsCent', 'successfulCallsCent'),
    createColumn('Avg. ✅ Duration', 'avgSuccessfulCallDuration', 'avgSuccessfulCallDuration'),
    createColumn('Failed Calls', 'failedCalls', 'failedCalls'),
    createColumn('Failed Calls %', 'failedCallsCent', 'failedCallsCent'),
    createColumn('Missed Calls', 'missedCalls', 'missedCalls'),
    createColumn('Missed Calls %', 'missedCallsCent', 'missedCallsCent'),
    createColumn('Avg. Calls Per Day', 'avgCallsPerDay', 'avgCallsPerDay'),
    createColumn('Avg. Conv. Score %', 'score', 'score'),
    createColumn('Calls Share %', 'calls_share', 'calls_share', 'text'),
    createColumn('Repeat Score %', 'repeat_score', 'repeat_score', 'text'),
    createColumn('Total Score %', 'total_score', 'total_score'),
    createColumn('Status', 'status', 'status', 'text'),
    {
        title: 'Details',
        key: 'details',
        fixed: 'right',
        render: (record) => {
            localStorage.setItem('expertId', record.key);
            return (
                <Button onClick={() => window.location.href = `/admin/experts/${record.phoneNumber}`}>View</Button>
            );
        },
    },
];
const mockData = {
    successfulCalls: [
        { key: '1', category: '< 15 mins', value: '20%' },
        { key: '2', category: '15-30 mins', value: '30%' },
        { key: '3', category: '30-45 mins', value: '25%' },
        { key: '4', category: '45-60 mins', value: '15%' },
        { key: '5', category: '> 60 mins', value: '10%' },
    ],
    avgCallDuration: [
        { key: '1', category: 'First Call', value: '10 mins' },
        { key: '2', category: 'Second Call', value: '12 mins' },
        { key: '3', category: 'Repeat Calls', value: '15 mins' },
        { key: '4', category: 'Scheduled Calls', value: '14 mins' },
        { key: '5', category: 'Organic Calls', value: '13 mins' },
    ],
    otherStats: [
        { key: '1', category: 'Avg Days Between', value: '7 days' },
        { key: '2', category: 'First Call Split', value: '40%' },
        { key: '3', category: 'Repeat Call Split', value: '60%' },
    ],
};

export default mockData;
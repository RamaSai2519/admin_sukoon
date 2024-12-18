import React, { useEffect, useState } from "react";
import axios from "axios";

const IncomingCalls = () => {
    const [total, setTotal] = useState(0);
    const [calls, setCalls] = useState([]);
    const [limit, setLimit] = useState(100);
    const [offset, setOffset] = useState(0);

    const fetchCalls = async () => {
        const response = await axios.get('https://kpi.knowlarity.com/Basic/v1/account/calllog',
            {
                params: {
                    start_time: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                    limit: limit,
                    offset: offset
                },
                headers: {
                    'x-api-key': 'oMD414h0SK3jhZ3u4hAU07mXwpaNm0d18D876tVf',
                    Authorization: '0738be9e-1fe5-4a8b-8923-0fe503e87deb'
                }
            }
        )
        if (response.status === 200) {
            setCalls(response.data.objects)
            setTotal(response.data.meta.total_count)
        }
    }

    return (
        <div>

        </div>
    );
};

export default IncomingCalls;
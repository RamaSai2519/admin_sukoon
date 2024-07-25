import React from "react";
import { fetchShorts } from "../../services/fetchData";
import { Table, Tooltip, Button } from "antd";
import LazyLoad from "../../components/LazyLoad/lazyload";
import Loading from "../../components/Loading/loading";
import Raxios from "../../services/axiosHelper";

const ContentTab = () => {
    const [shorts, setShorts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedVideo, setSelectedVideo] = React.useState(null);

    React.useEffect(() => {
        setLoading(true);
        fetchShorts(setShorts);
        setLoading(false);
    }, []);

    const handleViewClick = async (record) => {
        setSelectedVideo(record);
    };

    const handleApproval = async (videoId, status) => {
        try {
            const response = await Raxios.post(`/content/Video?videoId=${videoId}&status=${status}`);
            if (response.status === 200) {
                setShorts(prevShorts =>
                    prevShorts.map(short =>
                        short.videoId === videoId ? { ...short, approved: status } : short
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: "Title", dataIndex: "title", key: "title",
            render: (text) => (
                <Tooltip title={text}>
                    <span>
                        {text.length > 40 ? `${text.substring(0, 45)}...` : text}
                    </span>
                </Tooltip>
            ),
        },
        { title: "Keyword", dataIndex: "keyword", key: "keyword" },
        {
            title: "Status", dataIndex: "approved", key: "approved",
            render: (text) => (
                <span>
                    {text === undefined ? "Pending" : text ? "Approved" : "Rejected"}
                </span>
            ),
        },
        {
            title: "View", key: "details",
            render: (record) => (
                <Button type="primary" onClick={() => handleViewClick(record)}>View</Button>
            ),
        }
    ];

    return (
        <div>
            <h1>Content Tab</h1>
            {loading ?
                <Loading /> :
                <LazyLoad>
                    <div className="grid grid-cols-2 gap-4">
                        <Table className="w-full h-full" dataSource={shorts} columns={columns} rowKey={(record) => record.videoId} />
                        <div className="flex flex-col justify-center border-l-2 border-lightBlack pl-2 w-full h-full">
                            {selectedVideo ? (
                                <div>
                                    <iframe
                                        width="100%"
                                        height="400"
                                        src={`https://d3q8r846m83fir.cloudfront.net/${selectedVideo.s3Key}.mp4`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={selectedVideo.title}
                                    />
                                    <div className="flex w-full p-10 pt-5 justify-between items-center">
                                        <Button
                                            type="primary"
                                            className="bg-green-500"
                                            onClick={() => handleApproval(selectedVideo.videoId, true)}
                                        >Approve</Button>
                                        <Button
                                            type="primary"
                                            className="bg-red-500"
                                            onClick={() => handleApproval(selectedVideo.videoId, false)}
                                        >Reject</Button>
                                    </div>
                                </div>
                            ) : (
                                <p>Select a video to view</p>
                            )}
                        </div>
                    </div>
                </LazyLoad>
            }
        </div>
    );
};

export default ContentTab;

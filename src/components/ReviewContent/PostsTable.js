import React, { useEffect, useState } from "react";
import Faxios from "../../services/raxiosHelper";
import { Button, message, Table } from "antd";

const PostsTable = ({ setPost }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await Faxios.get("/content", {
                params: {
                    page: pagination.current,
                    size: pagination.pageSize,
                },
            });
            if (response.status === 200) {
                setPosts(response.data.data);
                setPagination({
                    ...pagination,
                    total: response.data.total,
                });
            } else {
                message.error(response.msg);
            }
        } catch (error) {
            console.log("🚀 ~ fetchPosts ~ error:", error)
            message.error(error.response?.data?.message || 'An error occurred');
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchPosts();
    }, [pagination.current]);

    const columns = [
        {
            title: "Title", dataIndex: "response", key: "response",
            render: (record) => {
                return <p className="truncate max-w-md">{record}</p>
            }
        },
        { title: "Category", dataIndex: "category", key: "category", },
        {
            title: "Actions", dataIndex: "actions", key: "actions",
            render: (_, record) => <Button onClick={() => setPost(record)}>View</Button>
        }
    ];

    return (
        <div>
            <Table
                className="w-full overflow-auto"
                rowKey={(record) => record._id}
                columns={columns}
                dataSource={posts}
                loading={loading}
                pagination={pagination}
                onChange={(page) => {
                    setPagination(page);
                    fetchPosts();
                }}
            />
        </div>
    );
}

export default PostsTable;
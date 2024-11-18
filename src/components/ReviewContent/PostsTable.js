import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import { raxiosFetchData } from "../../services/fetchData";

const PostsTable = ({ setPost }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const setTotal = (total) => {
        setPagination({ ...pagination, total });
    }

    const fetchPosts = async () => {
        await raxiosFetchData(pagination.current, pagination.pageSize, setPosts, setTotal, "/actions/content");
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
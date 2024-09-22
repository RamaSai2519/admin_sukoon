import React, { useEffect, useState } from "react";
import PostsTable from "./PostsTable";

const ReviewContent = () => {
    const [post, setPost] = useState({});

    return (
        <div className="p-5 pl-0 w-full overflow-auto flex md:flex-row flex-col h-max">
            <div className="md:w-1/2 mr-2">
                <PostsTable setPost={setPost} />
            </div>
            <div className="flex md:mt-0 mt-5 md:w-1/2 pl-2 md:border-l-2 dark:md:border-lightBlack">
                <div className="w-full">
                    <h1 className="text-2xl font-bold">Post Details</h1>
                    <img src={post?.photo?.s3_url || ""} alt="post" className="w-full h-1/6 object-contain mt-4" />
                    <div className="mt-4">
                        <h2 className="text-lg whitespace-pre-wrap font-semibold">Content</h2>
                        <p>{post.response}</p>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold">Category</h2>
                        <p>{post.category}</p>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold">Tags</h2>
                        <p>{post.tags ? post.tags.join(', ') : ''}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewContent;
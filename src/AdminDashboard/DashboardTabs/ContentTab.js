import { Flex, Radio } from "antd";
import React, { useState } from "react";
import ReviewContent from "../../components/ReviewContent";
import CreateContent from "../../components/CreateContent";


const ContentTab = () => {
    const [screen, setScreen] = useState(
        localStorage.getItem("screen") === "create" ? "create" : "review"
    );

    const changeScreen = (screen) => {
        setScreen(screen);
        localStorage.setItem("screen", screen);
    };

    return (
        <div className="min-h-screen p-5 w-full overflow-auto">
            <div className="flex w-full justify-between items-center gap-2">
                <Flex vertical>
                    <Radio.Group
                        value={screen}
                        onChange={(e) => changeScreen(e.target.value)}
                    >
                        <Radio.Button value="create">Create Content</Radio.Button>
                        <Radio.Button value="review">Review Content</Radio.Button>
                    </Radio.Group>
                </Flex>
            </div>
            {screen === "create" ? <CreateContent /> : <ReviewContent />}
        </div>
    )
};

export default ContentTab;
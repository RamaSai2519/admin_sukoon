import { message } from "antd";
import Faxios from "../services/raxiosHelper";

export const FaxiosPost = async (url, data, isNotify = false) => {
    try {
        const response = await Faxios.post(url, data);
        if (isNotify && response.status === 200) {
            message.success(response.msg);
        } else {
            message.error(response.msg);
        }
        return response;
    } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred');
    }
};
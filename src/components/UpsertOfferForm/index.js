import { Button, DatePicker, Form, Input, InputNumber, message, Popconfirm, Select } from "antd";
import { RaxiosPost } from "../../services/fetchData";
import { useAdmin } from "../../contexts/useData";
import React, { useState, useEffect } from "react";
import S3Uploader from "../Upload";
import dayjs from "dayjs";

const UpsertOfferForm = ({ offer, setOffer }) => {
    const { admin } = useAdmin();
    const [imageUrl, setImageUrl] = useState(offer?.imageUrl || '');
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            name: admin.name,
            title: offer?.title,
            website: offer?.website,
            imageUrl: offer?.imageUrl,
            imageAlt: offer?.imageAlt,
            validTill: offer?.validTill ? dayjs(offer?.validTill) : undefined,
            buttonText: offer?.buttonText,
            couponCode: offer?.couponCode,
            offer_type: offer?.offer_type,
            description: offer?.description,
            actual_price: offer?.actual_price,
            flatDiscount: offer?.flatDiscount,
            discountPercentage: offer?.discountPercentage,
        });
        setImageUrl(offer?.imageUrl || '');
    }, [offer, admin, form]);

    const handleUpsert = async (values) => {
        const { image, ...otherValues } = values;
        if (!imageUrl) { message.error('Please upload an image'); return; }
        const response = await RaxiosPost('/actions/upsert_offer', {
            ...otherValues,
            imageUrl: imageUrl
        });
        if (response.status === 200) {
            message.success(response.msg);
            setOffer({});
        } else {
            message.error(response.msg);
        }
    };

    const createFormItem = (label, name, component, rules) => ({ label, name, component, rules });

    const formItems1 = [
        createFormItem("Created by", "name", <Input disabled={true} />, [{ required: true, message: 'Please enter the name' }]),
        createFormItem("Title", "title", <Input />, [
            { required: true, message: 'Please enter the title' },
            { max: 40, message: 'Max length is 40' }
        ]),
        createFormItem("Image Alt", "imageAlt", <Input />, [{ required: true, message: 'Please enter the image alt' }]),
        createFormItem("Button Text", "buttonText", <Input />, [{ required: true, message: 'Please enter the button text' }]),
        createFormItem("Coupon Code", "couponCode", <Input />, [{ required: true, message: 'Please enter the coupon code' }]),
        createFormItem("Offer Type", "offer_type", <Select>
            <Select.Option value="code">Code</Select.Option>
            <Select.Option value="partner">Partner</Select.Option>
        </Select>, [{ required: true, message: 'Please enter the offer type' }]),
        createFormItem("Website", "website", <Input />),
        createFormItem("Valid Till", "validTill", <DatePicker className='w-full' showTime={false} />, [{ required: true, message: 'Please enter the valid till date' }]),
    ];

    const formItems2 = [
        createFormItem("Actual Price", "actual_price", <InputNumber prefix={"₹"} />, [{ required: true, message: 'Please enter the actual price' }]),
        createFormItem("Flat Discount", "flatDiscount", <InputNumber prefix={"₹"} />, []),
        createFormItem("Discount Percentage", "discountPercentage", <InputNumber suffix={"%"} />, []),
    ]

    const imageFormItem = createFormItem("Image", "image", <S3Uploader setFileUrl={setImageUrl} finalFileUrl={imageUrl} />, []);
    const descritptionFormItem = createFormItem("Description", "description", <Input.TextArea />, [{ required: true, message: 'Please enter the description' }]);
    const submitFormItem = createFormItem("", "submit", <Button type="primary" htmlType="submit">{offer ? 'Update Offer' : 'Create Offer'}</Button>, []);

    const RenderFormItem = ({ item }) => {
        return (
            <Form.Item
                key={item.name} label={item.label}
                name={item.name} rules={item.rules}
            >
                {item.component}
            </Form.Item>
        );
    }

    const handleExpire = async () => {
        const { _id, createdDate, finalPrice, ...otherValues } = offer;
        const expiredOffer = { ...otherValues, validTill: dayjs(), name: admin.name };
        const response = await RaxiosPost('/actions/upsert_offer', expiredOffer);
        if (response.status === 200) {
            message.success("Offer expired successfully");
            setOffer({});
        } else {
            message.error(response.msg);
        }
    };

    return (
        <div className="w-full">
            <Form
                layout="vertical"
                name="upsert_offer"
                onFinish={handleUpsert}
                form={form}
            >
                <div className="grid grid-cols-2 gap-4">
                    {formItems1.map((item) => RenderFormItem({ item }))}
                </div>
                {RenderFormItem({ item: descritptionFormItem })}
                <div className="grid grid-cols-3 gap-4">
                    {formItems2.map((item) => RenderFormItem({ item }))}
                </div>
                {RenderFormItem({ item: imageFormItem })}
                <div className="flex justify-between items-start">
                    {RenderFormItem({ item: submitFormItem })}
                    <div className="flex gap-2 items-start">
                        <Button onClick={() => window.location.reload()}>Cancel</Button>
                        <Popconfirm
                            title="Are you sure? This will cost us credits."
                            onConfirm={handleExpire}
                            okText="Yes"
                            cancelText="No"
                            onCancel={() => message.info('Reprocess cancelled')}
                        >
                            <Button danger>Expire Offer</Button>
                        </Popconfirm>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default UpsertOfferForm;
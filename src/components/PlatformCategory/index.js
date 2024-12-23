import React, { useState, useEffect } from 'react';
import Raxios from '../../services/axiosHelper';
import { RaxiosPost } from "../../services/fetchData";
import { Form, Input, Button, List, Card, Row, Col, message } from 'antd';


const PlatformCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [form] = Form.useForm();

  const fetchPlatformCategories = async () => {
    try {
      const response = await Raxios.get('/actions/platform_category?type=main');
      if (response.status === 200) {
        const categoryData = response.data.data;

        const formattedCategories = categoryData.map(
          (category) => category.name
        );
        const formattedSubCategories = categoryData.reduce((acc, category) => {
          acc[category.name] = category.sub_categories.map((sub) => sub.name);
          return acc;
        }, {});

        setCategories(formattedCategories);
        setSubCategories(formattedSubCategories);
      } else {
        message.error('Failed to fetch categories');
      }
    } catch (error) {
      message.error('An error occurred while fetching categories');
      console.error(error);
    }
  };

  const addCategory = (values) => {
    setCategories([...categories, values.category]);
    setSubCategories({ ...subCategories, [values.category]: [] });
    form.resetFields();
  };

  const addSubCategory = async (category, subCategory) => {
    await RaxiosPost('/actions/platform_category', { name: category, sub_category: subCategory }, true);

    setSubCategories({
      ...subCategories,
      [category]: [...(subCategories[category] || []), subCategory],
    });
  };

  useEffect(() => {
    fetchPlatformCategories();
  }, []);

  return (
    <div className='py-5'>
      <Form form={form} layout="inline" onFinish={addCategory}>
        <Form.Item
          name="category"
          rules={[{ required: true, message: 'Please input category!' }]}
        >
          <Input placeholder="Category" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Category
          </Button>
        </Form.Item>
      </Form>

      <Row gutter={16} style={{ marginTop: 20 }}>
        {categories.map((category) => (
          <Col span={8} key={category}>
            <Card title={category}>
              <Form
                layout="inline"
                onFinish={(values) =>
                  addSubCategory(category, values.subCategory)
                }
              >
                <Form.Item
                  name="subCategory"
                  rules={[
                    { required: true, message: 'Please input sub-category!' },
                  ]}
                >
                  <Input placeholder="Sub-Category" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Add Sub-Category
                  </Button>
                </Form.Item>
              </Form>
              <List
                size="small"
                bordered
                dataSource={subCategories[category] || []}
                renderItem={(item) => <List.Item>{item}</List.Item>}
                style={{ marginTop: 10 }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PlatformCategory;

import { useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  message,
} from 'antd';
import { useGetCategoriesQuery } from '../../services/productApi';
import type { Product } from '../../types';
import './EditProductDrawer.scss';

const { TextArea } = Input;

interface EditProductDrawerProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

const EditProductDrawer: React.FC<EditProductDrawerProps> = ({
  product,
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { data: categories } = useGetCategoriesQuery();

  useEffect(() => {
    if (open && product) {
      form.setFieldsValue({
        title: product.title,
        description: product.description,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        brand: product.brand,
        category: product.category,
        warrantyInformation: product.warrantyInformation,
        shippingInformation: product.shippingInformation,
        returnPolicy: product.returnPolicy,
        minimumOrderQuantity: product.minimumOrderQuantity,
      });
    }
  }, [open, product, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);
      message.success('Product updated successfully (frontend only)');
      onClose();
    } catch {
      message.error('Please fix form validation errors');
    }
  };

  const categoryOptions =
    categories?.map((cat) => ({
      label: cat.name,
      value: cat.slug,
    })) || [];

  return (
    <Drawer
      title="Edit Product"
      placement="right"
      width={520}
      onClose={onClose}
      open={open}
      className="edit-product-drawer"
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="title"
          label="Product Title"
          rules={[
            { required: true, message: 'Product title is required' },
            { min: 3, message: 'Title must be at least 3 characters' },
            { max: 100, message: 'Title cannot exceed 100 characters' },
          ]}
        >
          <Input placeholder="Enter product title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: 'Description is required' },
            { min: 10, message: 'Description must be at least 10 characters' },
            { max: 500, message: 'Description cannot exceed 500 characters' },
          ]}
        >
          <TextArea rows={4} placeholder="Enter product description" showCount maxLength={500} />
        </Form.Item>

        <div className="edit-product-drawer__row">
          <Form.Item
            name="price"
            label="Price ($)"
            rules={[
              { required: true, message: 'Price is required' },
              {
                type: 'number',
                min: 0.01,
                message: 'Price must be greater than $0.00',
              },
              {
                type: 'number',
                max: 99999.99,
                message: 'Price cannot exceed $99,999.99',
              },
            ]}
          >
            <InputNumber
              min={0.01}
              max={99999.99}
              precision={2}
              prefix="$"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="discountPercentage"
            label="Discount (%)"
            rules={[
              {
                type: 'number',
                min: 0,
                message: 'Discount cannot be negative',
              },
              {
                type: 'number',
                max: 100,
                message: 'Discount cannot exceed 100%',
              },
            ]}
          >
            <InputNumber
              min={0}
              max={100}
              precision={2}
              suffix="%"
              className="w-full"
            />
          </Form.Item>
        </div>

        <div className="edit-product-drawer__row">
          <Form.Item
            name="stock"
            label="Stock"
            rules={[
              { required: true, message: 'Stock is required' },
              {
                type: 'number',
                min: 0,
                message: 'Stock cannot be negative',
              },
              {
                validator: (_, value) => {
                  if (value !== undefined && !Number.isInteger(value)) {
                    return Promise.reject('Stock must be a whole number');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber min={0} precision={0} className="w-full" />
          </Form.Item>

          <Form.Item
            name="minimumOrderQuantity"
            label="Min Order Qty"
            rules={[
              {
                type: 'number',
                min: 1,
                message: 'Minimum order must be at least 1',
              },
            ]}
          >
            <InputNumber min={1} precision={0} className="w-full" />
          </Form.Item>
        </div>

        <Form.Item
          name="brand"
          label="Brand"
          rules={[
            { max: 50, message: 'Brand name cannot exceed 50 characters' },
          ]}
        >
          <Input placeholder="Enter brand name" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Category is required' }]}
        >
          <Select
            placeholder="Select category"
            options={categoryOptions}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item
          name="warrantyInformation"
          label="Warranty Information"
        >
          <Input placeholder="e.g., 1 year warranty" />
        </Form.Item>

        <Form.Item
          name="shippingInformation"
          label="Shipping Information"
        >
          <Input placeholder="e.g., Ships in 1 week" />
        </Form.Item>

        <Form.Item
          name="returnPolicy"
          label="Return Policy"
        >
          <Input placeholder="e.g., 30 days return policy" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditProductDrawer;

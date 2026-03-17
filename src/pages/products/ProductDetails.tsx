import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Tag,
  Rate,
  Button,
  Skeleton,
  Image,
  Descriptions,
  Space,
  Alert,
  Carousel,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useGetProductByIdQuery } from '../../services/productApi';
import EditProductDrawer from './EditProductDrawer';
import './ProductDetails.scss';

const { Title, Text, Paragraph } = Typography;

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const productId = Number(id);
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId, {
    skip: !id || isNaN(productId),
  });

  if (isLoading) {
    return (
      <div className="product-details">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details">
        <Alert
          message="Error"
          description="Failed to load product details. The product may not exist."
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate('/products')}>Back to Products</Button>
          }
        />
      </div>
    );
  }

  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  return (
    <div className="product-details">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/products')}
        className="product-details__back-btn"
      >
        Back to Products
      </Button>

      <Card className="product-details__card">
        <div className="product-details__content">
          <div className="product-details__gallery">
            <Carousel autoplay arrows className="product-details__carousel">
              {product.images.map((img, index) => (
                <div key={index} className="product-details__image-wrapper">
                  <Image
                    src={img}
                    alt={`${product.title} - ${index + 1}`}
                    className="product-details__image"
                    preview={{ mask: 'Preview' }}
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="product-details__info">
            <div className="flex items-center gap-3 mb-2">
              <Tag color="blue">{product.category}</Tag>
              {product.brand && (
                <Tag color="purple">{product.brand}</Tag>
              )}
              <Tag
                color={
                  product.availabilityStatus === 'In Stock'
                    ? 'green'
                    : product.availabilityStatus === 'Low Stock'
                    ? 'orange'
                    : 'red'
                }
              >
                {product.availabilityStatus}
              </Tag>
            </div>

            <Title level={2} className="product-details__title">
              {product.title}
            </Title>

            <div className="flex items-center gap-3 mb-4">
              <Rate disabled defaultValue={product.rating} allowHalf />
              <Text type="secondary">({product.rating})</Text>
            </div>

            <Paragraph className="text-gray-600 text-base mb-4">
              {product.description}
            </Paragraph>

            <div className="product-details__pricing">
              <Text className="product-details__price">
                ${discountedPrice.toFixed(2)}
              </Text>
              {product.discountPercentage > 0 && (
                <>
                  <Text delete type="secondary" className="text-lg">
                    ${product.price.toFixed(2)}
                  </Text>
                  <Tag color="red">-{product.discountPercentage.toFixed(0)}%</Tag>
                </>
              )}
            </div>

            <Descriptions
              bordered
              column={1}
              size="small"
              className="product-details__specs"
            >
              <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
              <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
              <Descriptions.Item label="Weight">{product.weight}g</Descriptions.Item>
              <Descriptions.Item label="Dimensions">
                {product.dimensions.width} x {product.dimensions.height} x{' '}
                {product.dimensions.depth} cm
              </Descriptions.Item>
              <Descriptions.Item label="Warranty">
                {product.warrantyInformation}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping">
                {product.shippingInformation}
              </Descriptions.Item>
              <Descriptions.Item label="Return Policy">
                {product.returnPolicy}
              </Descriptions.Item>
              <Descriptions.Item label="Min Order">
                {product.minimumOrderQuantity}
              </Descriptions.Item>
            </Descriptions>

            <Space className="mt-6">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="large"
                onClick={() => setDrawerOpen(true)}
              >
                Edit Product
              </Button>
              <Button
                icon={<ShoppingCartOutlined />}
                size="large"
              >
                Add to Cart
              </Button>
            </Space>
          </div>
        </div>

        {product.reviews.length > 0 && (
          <div className="product-details__reviews">
            <Title level={4}>Customer Reviews</Title>
            {product.reviews.map((review, index) => (
              <Card key={index} size="small" className="product-details__review-card">
                <div className="flex items-center justify-between mb-2">
                  <Text strong>{review.reviewerName}</Text>
                  <Rate disabled defaultValue={review.rating} style={{ fontSize: 12 }} />
                </div>
                <Paragraph className="mb-0 text-gray-600">
                  {review.comment}
                </Paragraph>
                <Text type="secondary" className="text-xs">
                  {new Date(review.date).toLocaleDateString()}
                </Text>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <EditProductDrawer
        product={product}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default ProductDetails;

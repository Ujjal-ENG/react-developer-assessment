import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Input, Select, Tag, Rate, Button, Space, Typography } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
} from '../../services/productApi';
import type { Product } from '../../types';
import './ProductList.scss';

const { Title } = Typography;

const PAGE_SIZE = 10;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  const skip = (currentPage - 1) * PAGE_SIZE;

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useGetProductsQuery(
    { limit: PAGE_SIZE, skip, category: selectedCategory },
    { skip: !!searchQuery }
  );

  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useSearchProductsQuery(
    { q: searchQuery, limit: PAGE_SIZE, skip },
    { skip: !searchQuery }
  );

  const data = searchQuery ? searchData : productsData;
  const isLoading = searchQuery ? searchLoading : productsLoading;
  const isFetching = searchQuery ? searchFetching : productsFetching;

  const categoryOptions = useMemo(() => {
    if (!categoriesData) return [];
    return categoriesData.map((cat) => ({
      label: cat.name,
      value: cat.slug,
    }));
  }, [categoriesData]);

  const handleSearch = (value: string) => {
    setSearchQuery(value.trim());
    setCurrentPage(1);
    if (value.trim()) {
      setSelectedCategory(undefined);
    }
  };

  const handleCategoryChange = (value: string | undefined) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    if (value) {
      setSearchQuery('');
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      render: (thumbnail: string) => (
        <img
          src={thumbnail}
          alt="product"
          className="product-thumbnail"
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title: string) => (
        <span className="font-medium text-gray-800">{title}</span>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => (
        <span className="font-semibold text-green-600">${price.toFixed(2)}</span>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 180,
      sorter: (a, b) => a.rating - b.rating,
      render: (rating: number) => (
        <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: 14 }} />
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 90,
      sorter: (a, b) => a.stock - b.stock,
      render: (stock: number) => (
        <Tag color={stock > 50 ? 'green' : stock > 10 ? 'orange' : 'red'}>
          {stock}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 140,
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => navigate(`/products/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="product-list">
      <Title level={3} className="product-list__title">
        Product Management
      </Title>

      <div className="product-list__filters">
        <Space wrap size="middle">
          <Input.Search
            placeholder="Search products..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            value={searchQuery}
            onChange={(e) => {
              if (!e.target.value) {
                setSearchQuery('');
                setCurrentPage(1);
              } else {
                setSearchQuery(e.target.value);
              }
            }}
            className="product-list__search"
          />
          <Select
            placeholder="Filter by category"
            allowClear
            showSearch
            optionFilterProp="label"
            value={selectedCategory}
            onChange={handleCategoryChange}
            options={categoryOptions}
            loading={categoriesLoading}
            className="product-list__category-select"
          />
        </Space>
      </div>

      <Table<Product>
        columns={columns}
        dataSource={data?.products}
        rowKey="id"
        loading={isLoading || isFetching}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: data?.total || 0,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} products`,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default ProductList;

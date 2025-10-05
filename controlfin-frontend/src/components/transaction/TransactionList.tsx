import {
  BarChartOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { FilterValue, SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransactionStore } from '../../stores/transactionStore';
import type { Transaction, TransactionFilters } from '../../types/transaction';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;

interface TransactionListProps {
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onViewTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onExportData: () => void;
  onImportData: () => void;
  onViewCharts: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  onAddTransaction,
  onEditTransaction,
  onViewTransaction,
  onDeleteTransaction,
  onExportData,
  onImportData,
  onViewCharts,
}) => {
  const { t } = useTranslation();
  const {
    transactions,
    categories,
    paymentMethods,
    stats,
    loading,
    error,
    filters,
    searchQuery,
    sortBy,
    sortOrder,
    currentPage,
    pageSize,
    totalCount,
    setFilters,
    setSearchQuery,
    setSorting,
    setPage,
    setPageSize,
    setTotalCount,
    refreshData,
  } = useTransactionStore();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === filters.type);
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((transaction) => transaction.categoryId === filters.category);
    }

    // Apply payment method filter
    if (filters.paymentMethod) {
      filtered = filtered.filter(
        (transaction) => transaction.paymentMethodId === filters.paymentMethod
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter((transaction) => {
        const transactionDate = dayjs(transaction.date);
        return (
          transactionDate.isAfter(dayjs(startDate).subtract(1, 'day')) &&
          transactionDate.isBefore(dayjs(endDate).add(1, 'day'))
        );
      });
    }

    // Apply amount range filter
    if (filters.amountRange) {
      const [minAmount, maxAmount] = filters.amountRange;
      filtered = filtered.filter(
        (transaction) => transaction.amount >= minAmount && transaction.amount <= maxAmount
      );
    }

    // Apply tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((transaction) =>
        filters.tags.every((tag) => transaction.tags.includes(tag))
      );
    }

    // Apply recurring filter
    if (filters.isRecurring !== null) {
      filtered = filtered.filter((transaction) => transaction.isRecurring === filters.isRecurring);
    }

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (sortBy) {
        case 'date': {
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        }
        case 'amount': {
          aValue = a.amount;
          bValue = b.amount;
          break;
        }
        case 'description': {
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        }
        case 'category': {
          const categoryA = categories.find((c) => c.id === a.categoryId);
          const categoryB = categories.find((c) => c.id === b.categoryId);
          aValue = categoryA?.name || '';
          bValue = categoryB?.name || '';
          break;
        }
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, categories, filters, searchQuery, sortBy, sortOrder]);

  // Paginate transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // Update total count when filters change
  React.useEffect(() => {
    setTotalCount(filteredTransactions.length);
  }, [filteredTransactions.length, setTotalCount]);

  const handleFilterChange = (
    key: keyof TransactionFilters,
    value: string | number | boolean | null
  ) => {
    setFilters({ [key]: value });
  };

  const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
    if (dates && dates[0] && dates[1]) {
      setFilters({
        dateRange: [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')],
      });
    } else {
      setFilters({ dateRange: null });
    }
  };

  const handleSortChange = (column: string) => {
    const newSortBy = column as 'date' | 'amount' | 'description' | 'category';
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    setSorting(newSortBy, newSortOrder);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || t('transaction.unknown');
  };

  const getPaymentMethodName = (paymentMethodId: string) => {
    const paymentMethod = paymentMethods.find((pm) => pm.id === paymentMethodId);
    return paymentMethod?.name || t('transaction.unknown');
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'green';
      case 'expense':
        return 'red';
      case 'transfer':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return '↗️';
      case 'expense':
        return '↘️';
      case 'transfer':
        return '↔️';
      default:
        return '💰';
    }
  };

  const columns = [
    {
      title: t('transaction.type'),
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={getTransactionTypeColor(type)} icon={getTransactionTypeIcon(type)}>
          {type.toUpperCase()}
        </Tag>
      ),
      sorter: true,
      sortOrder: sortBy === 'type' ? (sortOrder as SortOrder) : undefined,
    },
    {
      title: t('transaction.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string, record: Transaction) => (
        <div>
          <Text strong>{text}</Text>
          {record.tags.length > 0 && (
            <div style={{ marginTop: 4 }}>
              {record.tags.map((tag) => (
                <Tag key={tag} color='blue'>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
      ),
      sorter: true,
      sortOrder: sortBy === 'description' ? (sortOrder as SortOrder) : undefined,
    },
    {
      title: t('transaction.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right' as const,
      render: (amount: number, record: Transaction) => (
        <Text
          strong
          style={{
            color:
              record.type === 'income'
                ? '#52c41a'
                : record.type === 'expense'
                  ? '#ff4d4f'
                  : '#1890ff',
          }}
        >
          {record.type === 'expense' ? '-' : record.type === 'income' ? '+' : ''}$
          {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
      ),
      sorter: true,
      sortOrder: sortBy === 'amount' ? (sortOrder as SortOrder) : undefined,
    },
    {
      title: t('transaction.category'),
      dataIndex: 'categoryId',
      key: 'category',
      width: 120,
      render: (categoryId: string) => <Tag color='purple'>{getCategoryName(categoryId)}</Tag>,
      sorter: true,
      sortOrder: sortBy === 'category' ? (sortOrder as SortOrder) : undefined,
    },
    {
      title: t('transaction.paymentMethod'),
      dataIndex: 'paymentMethodId',
      key: 'paymentMethod',
      width: 120,
      render: (paymentMethodId: string) => getPaymentMethodName(paymentMethodId),
    },
    {
      title: t('transaction.date'),
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: true,
      sortOrder: sortBy === 'date' ? (sortOrder as SortOrder) : undefined,
    },
    {
      title: t('transaction.actions'),
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Transaction) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                label: t('transaction.view'),
                icon: <EyeOutlined />,
                onClick: () => onViewTransaction(record),
              },
              {
                key: 'edit',
                label: t('transaction.edit'),
                icon: <EditOutlined />,
                onClick: () => onEditTransaction(record),
              },
              {
                key: 'delete',
                label: t('transaction.delete'),
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => onDeleteTransaction(record.id),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type='text' icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _tableFilters: Record<string, FilterValue | null>,
    sorter: SorterResult<Transaction> | SorterResult<Transaction>[]
  ) => {
    const sorterArray = Array.isArray(sorter) ? sorter : [sorter];
    const activeSorter = sorterArray.find((s) => s.columnKey || s.field);

    if (activeSorter?.field) {
      const sortField = Array.isArray(activeSorter.field)
        ? activeSorter.field[0]
        : activeSorter.field;
      if (sortField) {
        handleSortChange(sortField as string);
      }
    }

    if (pagination.current !== currentPage) {
      setPage(pagination.current || 1);
    }
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize || 10);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => setSelectedRowKeys(selectedKeys),
  };

  if (error) {
    return (
      <Card>
        <Empty description={t('transaction.failedToLoad')} image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button type='primary' onClick={refreshData}>
            Try Again
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div>
      {/* Header with Stats */}
      {stats && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title={t('transaction.totalIncome')}
                value={stats.totalIncome}
                prefix='$'
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={t('transaction.totalExpense')}
                value={stats.totalExpense}
                prefix='$'
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={t('transaction.netAmount')}
                value={stats.netAmount}
                prefix='$'
                valueStyle={{ color: stats.netAmount >= 0 ? '#52c41a' : '#ff4d4f' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={t('transaction.transactions')}
                value={stats.transactionCount}
                suffix={`this ${dayjs().format('MMMM')}`}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Toolbar */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align='middle'>
          <Col flex='auto'>
            <Space wrap>
              <Search
                placeholder='Search transactions...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                type={showFilters ? 'primary' : 'default'}
              >
                Filters
              </Button>
              <Button icon={<ReloadOutlined />} onClick={refreshData} loading={loading}>
                Refresh
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<BarChartOutlined />} onClick={onViewCharts}>
                Charts
              </Button>
              <Button icon={<DownloadOutlined />} onClick={onExportData}>
                Export
              </Button>
              <Button icon={<UploadOutlined />} onClick={onImportData}>
                Import
              </Button>
              <Button type='primary' icon={<PlusOutlined />} onClick={onAddTransaction}>
                Add Transaction
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Advanced Filters */}
        {showFilters && (
          <>
            <Divider />
            <Row gutter={16}>
              <Col span={6}>
                <Text strong>Type</Text>
                <Select
                  value={filters.type}
                  onChange={(value) => handleFilterChange('type', value)}
                  style={{ width: '100%', marginTop: 4 }}
                >
                  <Option value='all'>All Types</Option>
                  <Option value='income'>Income</Option>
                  <Option value='expense'>Expense</Option>
                  <Option value='transfer'>Transfer</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Text strong>Category</Text>
                <Select
                  value={filters.category}
                  onChange={(value) => handleFilterChange('category', value)}
                  style={{ width: '100%', marginTop: 4 }}
                  allowClear
                  placeholder={t('transaction.selectCategory')}
                >
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Text strong>Payment Method</Text>
                <Select
                  value={filters.paymentMethod}
                  onChange={(value) => handleFilterChange('paymentMethod', value)}
                  style={{ width: '100%', marginTop: 4 }}
                  allowClear
                  placeholder={t('transaction.selectPaymentMethod')}
                >
                  {paymentMethods.map((pm) => (
                    <Option key={pm.id} value={pm.id}>
                      {pm.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Text strong>Date Range</Text>
                <RangePicker
                  value={
                    filters.dateRange
                      ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])]
                      : null
                  }
                  onChange={(dates) => {
                    if (dates && dates[0] && dates[1]) {
                      handleDateRangeChange([dates[0], dates[1]]);
                    } else {
                      handleDateRangeChange(null);
                    }
                  }}
                  style={{ width: '100%', marginTop: 4 }}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={6}>
                <Text strong>Recurring</Text>
                <Select
                  value={filters.isRecurring}
                  onChange={(value) => handleFilterChange('isRecurring', value)}
                  style={{ width: '100%', marginTop: 4 }}
                  allowClear
                  placeholder={t('transaction.allTransactions')}
                >
                  <Option value={true}>Recurring only</Option>
                  <Option value={false}>One-time only</Option>
                </Select>
              </Col>
              <Col span={18}>
                <Space>
                  <Button
                    onClick={() =>
                      setFilters({
                        search: '',
                        category: null,
                        paymentMethod: null,
                        type: 'all',
                        dateRange: null,
                        amountRange: null,
                        tags: [],
                        isRecurring: null,
                      })
                    }
                  >
                    Clear All Filters
                  </Button>
                </Space>
              </Col>
            </Row>
          </>
        )}
      </Card>

      {/* Transaction Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={paginatedTransactions}
          rowKey='id'
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
          }}
          onChange={handleTableChange}
          rowSelection={rowSelection}
          scroll={{ x: 800 }}
          size='small'
        />
      </Card>
    </div>
  );
};

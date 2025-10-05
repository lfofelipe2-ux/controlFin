import { ClearOutlined, FilterOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Input,
  Row,
  Select,
  Slider,
  Space,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTransactionStore } from '../../../stores/transactionStore';
import type { TransactionFilters } from '../../../types/transaction';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Text } = Typography;
const { Panel } = Collapse;

interface FilterPanelProps {
  onApplyFilters: (filters: TransactionFilters) => void;
  onClearFilters: () => void;
  onSavePreset: (name: string, filters: TransactionFilters) => void;
  onLoadPreset: (preset: TransactionFilters) => void;
  presets: Array<{ name: string; filters: TransactionFilters }>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onApplyFilters,
  onClearFilters,
  onSavePreset,
  onLoadPreset,
  presets,
}) => {
  const { filters, categories, paymentMethods, setFilters } = useTransactionStore();

  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);
  const [presetName, setPresetName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onApplyFilters(localFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: TransactionFilters = {
      search: '',
      category: null,
      paymentMethod: null,
      type: 'all',
      dateRange: null,
      amountRange: null,
      tags: [],
      isRecurring: null,
    };
    setLocalFilters(defaultFilters);
    setFilters(defaultFilters);
    onClearFilters();
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset(presetName.trim(), localFilters);
      setPresetName('');
    }
  };

  const handleLoadPreset = (preset: TransactionFilters) => {
    setLocalFilters(preset);
    setFilters(preset);
    onLoadPreset(preset);
  };

  const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    if (dates && dates[0] && dates[1]) {
      handleFilterChange('dateRange', [
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD'),
      ]);
    } else {
      handleFilterChange('dateRange', null);
    }
  };

  const handleAmountRangeChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      handleFilterChange('amountRange', value as [number, number]);
    }
  };

  const handleTagSearch = (value: string) => {
    // This would typically search for existing tags
    // For now, we'll just update the search
    handleFilterChange('search', value);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.type !== 'all') count++;
    if (localFilters.category) count++;
    if (localFilters.paymentMethod) count++;
    if (localFilters.dateRange) count++;
    if (localFilters.amountRange) count++;
    if (localFilters.tags.length > 0) count++;
    if (localFilters.isRecurring !== null) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <Text strong>Advanced Filters</Text>
          {activeFiltersCount > 0 && <Tag color='blue'>{activeFiltersCount} active</Tag>}
        </Space>
      }
      extra={
        <Space>
          <Button size='small' onClick={() => setShowAdvanced(!showAdvanced)}>
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
          <Button size='small' icon={<ClearOutlined />} onClick={handleClearFilters}>
            Clear All
          </Button>
        </Space>
      }
    >
      {/* Quick Filters */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Text strong>Transaction Type</Text>
          <Select
            value={localFilters.type}
            onChange={(value) => handleFilterChange('type', value)}
            style={{ width: '100%', marginTop: 4 }}
          >
            <Option value='all'>All Types</Option>
            <Option value='income'>Income</Option>
            <Option value='expense'>Expense</Option>
            <Option value='transfer'>Transfer</Option>
          </Select>
        </Col>

        <Col span={8}>
          <Text strong>Category</Text>
          <Select
            value={localFilters.category}
            onChange={(value) => handleFilterChange('category', value)}
            style={{ width: '100%', marginTop: 4 }}
            allowClear
            placeholder='Select category'
            showSearch
            optionFilterProp='children'
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                <Space>
                  <span style={{ color: category.color }}>●</span>
                  {category.name}
                </Space>
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={8}>
          <Text strong>Payment Method</Text>
          <Select
            value={localFilters.paymentMethod}
            onChange={(value) => handleFilterChange('paymentMethod', value)}
            style={{ width: '100%', marginTop: 4 }}
            allowClear
            placeholder='Select payment method'
            showSearch
            optionFilterProp='children'
          >
            {paymentMethods.map((pm) => (
              <Option key={pm.id} value={pm.id}>
                <Space>
                  <span style={{ color: pm.color }}>●</span>
                  {pm.name}
                </Space>
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Divider />

      {/* Date Range */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text strong>Date Range</Text>
          <RangePicker
            value={
              localFilters.dateRange
                ? [dayjs(localFilters.dateRange[0]), dayjs(localFilters.dateRange[1])]
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
            presets={[
              {
                label: 'Last 7 days',
                value: [dayjs().subtract(7, 'day'), dayjs()],
              },
              {
                label: 'Last 30 days',
                value: [dayjs().subtract(30, 'day'), dayjs()],
              },
              {
                label: 'This month',
                value: [dayjs().startOf('month'), dayjs().endOf('month')],
              },
              {
                label: 'Last month',
                value: [
                  dayjs().subtract(1, 'month').startOf('month'),
                  dayjs().subtract(1, 'month').endOf('month'),
                ],
              },
            ]}
          />
        </Col>

        <Col span={12}>
          <Text strong>Amount Range</Text>
          <div style={{ marginTop: 4 }}>
            <Slider
              range
              min={0}
              max={10000}
              step={10}
              value={localFilters.amountRange || [0, 10000]}
              onChange={handleAmountRangeChange}
              marks={{
                0: '$0',
                2500: '$2,500',
                5000: '$5,000',
                7500: '$7,500',
                10000: '$10,000+',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <Text type='secondary'>${localFilters.amountRange?.[0] || 0}</Text>
              <Text type='secondary'>${localFilters.amountRange?.[1] || 10000}</Text>
            </div>
          </div>
        </Col>
      </Row>

      {/* Advanced Filters */}
      {showAdvanced && (
        <>
          <Divider />
          <Collapse ghost>
            <Panel header='Advanced Filters' key='advanced'>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Search Tags</Text>
                  <Search
                    placeholder='Search for tags...'
                    value={localFilters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    onSearch={handleTagSearch}
                    style={{ width: '100%', marginTop: 4 }}
                    allowClear
                  />
                </Col>

                <Col span={12}>
                  <Text strong>Recurring Transactions</Text>
                  <div style={{ marginTop: 4 }}>
                    <Select
                      value={localFilters.isRecurring}
                      onChange={(value) => handleFilterChange('isRecurring', value)}
                      style={{ width: '100%' }}
                      allowClear
                      placeholder='All transactions'
                    >
                      <Option value={true}>Recurring only</Option>
                      <Option value={false}>One-time only</Option>
                    </Select>
                  </div>
                </Col>
              </Row>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Text strong>Quick Date Filters</Text>
                  <div style={{ marginTop: 8 }}>
                    <Space wrap>
                      <Button
                        size='small'
                        onClick={() =>
                          handleFilterChange('dateRange', [
                            dayjs().format('YYYY-MM-DD'),
                            dayjs().format('YYYY-MM-DD'),
                          ])
                        }
                      >
                        Today
                      </Button>
                      <Button
                        size='small'
                        onClick={() =>
                          handleFilterChange('dateRange', [
                            dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
                            dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
                          ])
                        }
                      >
                        Yesterday
                      </Button>
                      <Button
                        size='small'
                        onClick={() =>
                          handleFilterChange('dateRange', [
                            dayjs().startOf('week').format('YYYY-MM-DD'),
                            dayjs().endOf('week').format('YYYY-MM-DD'),
                          ])
                        }
                      >
                        This Week
                      </Button>
                      <Button
                        size='small'
                        onClick={() =>
                          handleFilterChange('dateRange', [
                            dayjs().startOf('month').format('YYYY-MM-DD'),
                            dayjs().endOf('month').format('YYYY-MM-DD'),
                          ])
                        }
                      >
                        This Month
                      </Button>
                    </Space>
                  </div>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </>
      )}

      <Divider />

      {/* Filter Presets */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text strong>Saved Presets</Text>
          <div style={{ marginTop: 4 }}>
            <Select
              placeholder='Load saved filter preset'
              style={{ width: '100%' }}
              onChange={(value) => {
                const preset = presets.find((p) => p.name === value);
                if (preset) handleLoadPreset(preset.filters);
              }}
            >
              {presets.map((preset) => (
                <Option key={preset.name} value={preset.name}>
                  {preset.name}
                </Option>
              ))}
            </Select>
          </div>
        </Col>

        <Col span={12}>
          <Text strong>Save Current Filters</Text>
          <Space.Compact style={{ width: '100%', marginTop: 4 }}>
            <Input
              placeholder='Preset name'
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
            <Button
              type='primary'
              icon={<SaveOutlined />}
              onClick={handleSavePreset}
              disabled={!presetName.trim()}
            >
              Save
            </Button>
          </Space.Compact>
        </Col>
      </Row>

      <Divider />

      {/* Action Buttons */}
      <Row justify='end'>
        <Space>
          <Button onClick={handleClearFilters}>Clear All</Button>
          <Button type='primary' onClick={handleApplyFilters} icon={<FilterOutlined />}>
            Apply Filters
          </Button>
        </Space>
      </Row>
    </Card>
  );
};

import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import {
    Alert,
    Button,
    Checkbox,
    DatePicker,
    Divider,
    Form,
    InputNumber,
    Modal,
    Select,
    Slider,
    Space,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTransactionStore } from '../stores/transactionStore';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ExportModalProps {
    visible: boolean;
    onClose: () => void;
    onExport: (options: ExportOptions) => void;
    loading: boolean;
}

interface ExportOptions {
    format: 'csv' | 'excel' | 'json';
    dateRange: { start: Date; end: Date };
    filters: {
        categories: string[];
        types: ('income' | 'expense')[];
        amountRange: { min: number; max: number };
    };
    includeMetadata: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({
    visible,
    onClose,
    onExport,
    loading,
}) => {
    const [form] = Form.useForm();
    const { categories, transactions } = useTransactionStore();

    const [amountRange, setAmountRange] = useState<[number, number]>([0, 10000]);

    const handleExport = async () => {
        try {
            const values = await form.validateFields();

            const exportOptions: ExportOptions = {
                format: values.format,
                dateRange: {
                    start: values.dateRange[0].toDate(),
                    end: values.dateRange[1].toDate(),
                },
                filters: {
                    categories: values.categories || [],
                    types: values.types || ['income', 'expense'],
                    amountRange: {
                        min: amountRange[0],
                        max: amountRange[1],
                    },
                },
                includeMetadata: values.includeMetadata || false,
            };

            onExport(exportOptions);
        } catch (error) {
            console.error('Export validation failed:', error);
        }
    };

    const handleQuickExport = () => {
        const quickOptions: ExportOptions = {
            format: 'csv',
            dateRange: {
                start: new Date(0), // All time
                end: new Date(),
            },
            filters: {
                categories: [],
                types: ['income', 'expense'],
                amountRange: { min: 0, max: 1000000 },
            },
            includeMetadata: false,
        };

        onExport(quickOptions);
    };

    const incomeCategories = categories.filter(cat => cat.type === 'income');
    const expenseCategories = categories.filter(cat => cat.type === 'expense');

    return (
        <Modal
            title="Export Transactions"
            open={visible}
            onCancel={onClose}
            width={600}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="quick" onClick={handleQuickExport} disabled={loading}>
                    Quick Export (CSV)
                </Button>,
                <Button
                    key="export"
                    type="primary"
                    icon={loading ? <LoadingOutlined /> : <DownloadOutlined />}
                    onClick={handleExport}
                    loading={loading}
                >
                    Export
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    format: 'csv',
                    types: ['income', 'expense'],
                    includeMetadata: false,
                }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {/* Format Selection */}
                    <Form.Item
                        label="Export Format"
                        name="format"
                        rules={[{ required: true, message: 'Please select a format' }]}
                    >
                        <Select placeholder="Select format">
                            <Option value="csv">CSV (Comma Separated Values)</Option>
                            <Option value="excel">Excel (.xlsx)</Option>
                            <Option value="json">JSON (JavaScript Object Notation)</Option>
                        </Select>
                    </Form.Item>

                    {/* Date Range */}
                    <Form.Item
                        label="Date Range"
                        name="dateRange"
                        rules={[{ required: true, message: 'Please select date range' }]}
                    >
                        <RangePicker
                            style={{ width: '100%' }}
                            ranges={{
                                'Last 30 days': [dayjs().subtract(30, 'day'), dayjs()],
                                'Last 3 months': [dayjs().subtract(3, 'month'), dayjs()],
                                'Last year': [dayjs().subtract(1, 'year'), dayjs()],
                                'All time': [dayjs(0), dayjs()],
                            }}
                        />
                    </Form.Item>

                    <Divider>Filters</Divider>

                    {/* Transaction Types */}
                    <Form.Item
                        label="Transaction Types"
                        name="types"
                        rules={[{ required: true, message: 'Please select at least one type' }]}
                    >
                        <Checkbox.Group>
                            <Space direction="vertical">
                                <Checkbox value="income">Income</Checkbox>
                                <Checkbox value="expense">Expense</Checkbox>
                            </Space>
                        </Checkbox.Group>
                    </Form.Item>

                    {/* Categories */}
                    <Form.Item label="Categories" name="categories">
                        <Select
                            mode="multiple"
                            placeholder="Select categories (leave empty for all)"
                            allowClear
                        >
                            {incomeCategories.map(category => (
                                <Option key={category.id} value={category.id}>
                                    💰 {category.name}
                                </Option>
                            ))}
                            {expenseCategories.map(category => (
                                <Option key={category.id} value={category.id}>
                                    💸 {category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Amount Range */}
                    <Form.Item label="Amount Range">
                        <div style={{ padding: '0 16px' }}>
                            <Slider
                                range
                                min={0}
                                max={100000}
                                step={100}
                                value={amountRange}
                                onChange={(value) => setAmountRange(value as [number, number])}
                                marks={{
                                    0: 'R$ 0',
                                    25000: 'R$ 25k',
                                    50000: 'R$ 50k',
                                    75000: 'R$ 75k',
                                    100000: 'R$ 100k+',
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                <InputNumber
                                    value={amountRange[0]}
                                    onChange={(value) => setAmountRange([value || 0, amountRange[1]])}
                                    formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => parseFloat(value!.replace(/R\$\s?|(,*)/g, '')) || 0}
                                />
                                <InputNumber
                                    value={amountRange[1]}
                                    onChange={(value) => setAmountRange([amountRange[0], value || 0])}
                                    formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => parseFloat(value!.replace(/R\$\s?|(,*)/g, '')) || 0}
                                />
                            </div>
                        </div>
                    </Form.Item>

                    {/* Options */}
                    <Form.Item name="includeMetadata" valuePropName="checked">
                        <Checkbox>Include metadata (tags, notes, etc.)</Checkbox>
                    </Form.Item>

                    {/* Info */}
                    <Alert
                        message="Export Information"
                        description={`This will export approximately ${transactions.length} transactions based on your current filters.`}
                        type="info"
                        showIcon
                    />
                </Space>
            </Form>
        </Modal>
    );
};

export default ExportModal;

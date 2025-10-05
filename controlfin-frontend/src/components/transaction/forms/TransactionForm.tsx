import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTransactionStore } from '../../../stores/transactionStore';
import type { TransactionFormData } from '../../../types/transaction';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface TransactionFormProps {
  onSave: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSave,
  onCancel,
  loading = false,
}) => {
  const { formData, categories, paymentMethods, formMode, setFormData, resetForm } =
    useTransactionStore();

  const [form] = Form.useForm();
  const [tagInput, setTagInput] = useState('');

  // Filter categories by transaction type
  const filteredCategories = categories.filter(
    (category) => category.type === formData.type || category.type === 'transfer'
  );

  // Filter payment methods by transaction type
  const filteredPaymentMethods = paymentMethods.filter(
    (pm) =>
      pm.type === 'other' ||
      (formData.type === 'income' && pm.type === 'bank') ||
      (formData.type === 'expense' && pm.type === 'card')
  );

  useEffect(() => {
    form.setFieldsValue({
      ...formData,
      date: formData.date ? dayjs(formData.date) : dayjs(),
    });
  }, [formData, form]);

  const handleTypeChange = (type: 'income' | 'expense' | 'transfer') => {
    setFormData({ type });
    // Reset category and payment method when type changes
    form.setFieldsValue({
      categoryId: undefined,
      paymentMethodId: undefined,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      const newTags = [...formData.tags, tagInput.trim()];
      setFormData({ tags: newTags });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = formData.tags.filter((tag) => tag !== tagToRemove);
    setFormData({ tags: newTags });
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const submitData: TransactionFormData = {
        type: values.type as TransactionFormData['type'],
        amount: values.amount as number,
        description: values.description as string,
        categoryId: values.categoryId as string,
        paymentMethodId: values.paymentMethodId as string,
        date: (values.date as Dayjs).format('YYYY-MM-DD'),
        tags: formData.tags,
        isRecurring: (values.isRecurring as boolean | undefined) || false,
        metadata: {
          location: (values.location as string | undefined) || '',
          notes: (values.notes as string | undefined) || '',
        },
      };

      await onSave(submitData);
      message.success(
        formMode === 'create'
          ? 'Transaction created successfully!'
          : 'Transaction updated successfully!'
      );
      resetForm();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save transaction');
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <Card>
      <Title level={4}>
        {formMode === 'create'
          ? 'Add New Transaction'
          : formMode === 'edit'
            ? 'Edit Transaction'
            : 'View Transaction'}
      </Title>

      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{
          type: formData.type,
          amount: formData.amount,
          description: formData.description,
          categoryId: formData.categoryId,
          paymentMethodId: formData.paymentMethodId,
          date: formData.date ? dayjs(formData.date) : dayjs(),
          isRecurring: formData.isRecurring,
          location: formData.metadata.location,
          notes: formData.metadata.notes,
        }}
        disabled={formMode === 'view'}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name='type'
              label='Transaction Type'
              rules={[{ required: true, message: 'Please select transaction type' }]}
            >
              <Select onChange={handleTypeChange}>
                <Option value='income'>Income</Option>
                <Option value='expense'>Expense</Option>
                <Option value='transfer'>Transfer</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name='amount'
              label='Amount'
              rules={[
                { required: true, message: 'Please enter amount' },
                { type: 'number', min: 0.01, message: 'Amount must be greater than 0' },
              ]}
            >
              <InputNumber style={{ width: '100%' }} prefix='$' precision={2} min={0} step={0.01} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name='date'
              label='Date'
              rules={[{ required: true, message: 'Please select date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='categoryId'
              label='Category'
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select
                placeholder='Select category'
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {filteredCategories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    <Space>
                      <span style={{ color: category.color }}>●</span>
                      {category.name}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name='paymentMethodId'
              label='Payment Method'
              rules={[{ required: true, message: 'Please select payment method' }]}
            >
              <Select
                placeholder='Select payment method'
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {filteredPaymentMethods.map((pm) => (
                  <Option key={pm.id} value={pm.id}>
                    <Space>
                      <span style={{ color: pm.color }}>●</span>
                      {pm.name}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name='description'
          label='Description'
          rules={[
            { required: true, message: 'Please enter description' },
            { max: 500, message: 'Description must be less than 500 characters' },
          ]}
        >
          <Input placeholder='Enter transaction description' />
        </Form.Item>

        <Form.Item label='Tags'>
          <div>
            <Space wrap style={{ marginBottom: 8 }}>
              {formData.tags.map((tag) => (
                <Tag
                  key={tag}
                  closable={formMode !== 'view'}
                  onClose={() => handleRemoveTag(tag)}
                  color='blue'
                >
                  {tag}
                </Tag>
              ))}
            </Space>
            {formMode !== 'view' && (
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder='Add tag'
                  onPressEnter={handleAddTag}
                />
                <Button type='dashed' icon={<PlusOutlined />} onClick={handleAddTag}>
                  Add
                </Button>
              </Space.Compact>
            )}
          </div>
        </Form.Item>

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name='location' label='Location'>
              <Input placeholder='Enter location (optional)' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name='isRecurring' label='Recurring Transaction' valuePropName='checked'>
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name='notes' label='Notes'>
          <TextArea rows={3} placeholder='Additional notes (optional)' maxLength={1000} showCount />
        </Form.Item>

        {formMode !== 'view' && (
          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' loading={loading}>
                {formMode === 'create' ? 'Create Transaction' : 'Update Transaction'}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
};

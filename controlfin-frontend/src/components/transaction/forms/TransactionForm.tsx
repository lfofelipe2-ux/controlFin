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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        date: (values.date as dayjs.Dayjs).format('YYYY-MM-DD'),
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
          ? t('transaction.transactionCreatedSuccessfully')
          : t('transaction.transactionUpdatedSuccessfully')
      );
      resetForm();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : t('transaction.failedToSaveTransaction')
      );
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
          ? t('transaction.addNewTransaction')
          : formMode === 'edit'
            ? t('transaction.editTransaction')
            : t('transaction.viewTransaction')}
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
              label={t('transaction.transactionType')}
              rules={[{ required: true, message: t('transaction.pleaseSelectTransactionType') }]}
            >
              <Select onChange={handleTypeChange}>
                <Option value='income'>{t('transaction.income')}</Option>
                <Option value='expense'>{t('transaction.expense')}</Option>
                <Option value='transfer'>{t('transaction.transfer')}</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name='amount'
              label={t('transaction.amount')}
              rules={[
                { required: true, message: t('transaction.pleaseEnterAmount') },
                {
                  type: 'number',
                  min: 0.01,
                  message: t('transaction.amountMustBeGreaterThanZero'),
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} prefix='$' precision={2} min={0} step={0.01} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name='date'
              label={t('transaction.date')}
              rules={[{ required: true, message: t('transaction.pleaseSelectDate') }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='categoryId'
              label={t('transaction.category')}
              rules={[{ required: true, message: t('transaction.pleaseSelectCategory') }]}
            >
              <Select
                placeholder={t('transaction.selectCategory')}
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
              label={t('transaction.paymentMethod')}
              rules={[{ required: true, message: t('transaction.pleaseSelectPaymentMethod') }]}
            >
              <Select
                placeholder={t('transaction.selectPaymentMethod')}
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
          label={t('transaction.description')}
          rules={[
            { required: true, message: t('transaction.pleaseEnterDescription') },
            { max: 500, message: t('transaction.descriptionMustBeLessThan500Characters') },
          ]}
        >
          <Input placeholder={t('transaction.enterTransactionDescription')} />
        </Form.Item>

        <Form.Item label={t('transaction.tags')}>
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
                  placeholder={t('transaction.addTag')}
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
            <Form.Item name='location' label={t('transaction.location')}>
              <Input placeholder={t('transaction.enterLocationOptional')} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name='isRecurring'
              label={t('transaction.recurringTransaction')}
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name='notes' label={t('transaction.notes')}>
          <TextArea
            rows={3}
            placeholder={t('transaction.additionalNotesOptional')}
            maxLength={1000}
            showCount
          />
        </Form.Item>

        {formMode !== 'view' && (
          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' loading={loading}>
                {formMode === 'create'
                  ? t('transaction.createTransaction')
                  : t('transaction.updateTransaction')}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
};

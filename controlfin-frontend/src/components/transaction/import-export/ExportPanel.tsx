import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  message,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { useTransactionStore } from '../../../stores/transactionStore';
import type { ExportOptions, Transaction } from '../../../types/transaction';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

interface ExportPanelProps {
  visible: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ visible, onClose, transactions }) => {
  const { t } = useTranslation();
  const { isExporting } = useTransactionStore();
  const [form] = Form.useForm();
  const [exportProgress, setExportProgress] = useState(0);

  const handleExport = async (values: Record<string, unknown>) => {
    try {
      setExportProgress(0);

      const dateRange = values.dateRange as [Dayjs, Dayjs] | undefined;
      const exportOptions: ExportOptions = {
        format: values.format as ExportOptions['format'],
        dateRange: dateRange
          ? [dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD')]
          : [dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        includeCategories: (values.includeCategories as boolean | undefined) || false,
        includePaymentMethods: (values.includePaymentMethods as boolean | undefined) || false,
        includeMetadata: (values.includeMetadata as boolean | undefined) || false,
      };

      // Filter transactions by date range
      const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = dayjs(transaction.date);
        return (
          transactionDate.isAfter(dayjs(exportOptions.dateRange[0]).subtract(1, 'day')) &&
          transactionDate.isBefore(dayjs(exportOptions.dateRange[1]).add(1, 'day'))
        );
      });

      setExportProgress(25);

      // Prepare data for export
      const exportDataArray = filteredTransactions.map((transaction) => {
        const baseData: Record<string, string> = {
          'Transaction ID': transaction.id,
          Type: transaction.type.toUpperCase(),
          Amount: transaction.amount.toString(),
          Description: transaction.description,
          Date: dayjs(transaction.date).format('YYYY-MM-DD'),
          Tags: transaction.tags.join(', '),
          Recurring: transaction.isRecurring ? t('common.yes') : t('common.no'),
        };

        if (exportOptions.includeCategories) {
          baseData[t('transaction.category')] = transaction.categoryId; // Would need to resolve to name
        }

        if (exportOptions.includePaymentMethods) {
          baseData[t('transaction.paymentMethod')] = transaction.paymentMethodId; // Would need to resolve to name
        }

        if (exportOptions.includeMetadata) {
          baseData[t('transaction.location')] = transaction.metadata.location || '';
          baseData[t('transaction.notes')] = transaction.metadata.notes || '';
        }

        return baseData;
      });

      setExportProgress(50);

      // Generate file based on format
      let fileName = `transactions_${dayjs().format('YYYY-MM-DD')}`;
      let mimeType = '';
      let fileContent: string;

      switch (exportOptions.format) {
        case 'csv':
          fileName += '.csv';
          mimeType = 'text/csv';
          fileContent = convertToCSV(exportDataArray);
          break;
        case 'excel':
          fileName += '.xlsx';
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileContent = convertToExcel(exportDataArray);
          break;
        case 'pdf':
          fileName += '.pdf';
          mimeType = 'application/pdf';
          // PDF generation would require additional library like jsPDF
          message.warning('PDF export not yet implemented');
          return;
        default:
          throw new Error('Unsupported export format');
      }

      setExportProgress(75);

      // Download file
      downloadFile(fileContent, fileName, mimeType);

      setExportProgress(100);
      message.success(`Exported ${filteredTransactions.length} transactions successfully`);

      // Call the store's export function
      // await exportData(exportOptions);

      onClose();
    } catch (error) {
      message.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setExportProgress(0);
    }
  };

  const convertToCSV = (data: Record<string, string>[]) => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(',')
      ),
    ].join('\n');

    return csvContent;
  };

  const convertToExcel = (data: Record<string, string>[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    // Convert to binary string
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  };

  const downloadFile = (content: string | ArrayBuffer, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    form.resetFields();
    setExportProgress(0);
    onClose();
  };

  return (
    <Modal
      title={t('transaction.export')}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleExport}
        initialValues={{
          format: 'excel',
          dateRange: [dayjs().subtract(1, 'month'), dayjs()],
          includeCategories: true,
          includePaymentMethods: true,
          includeMetadata: false,
        }}
      >
        <Title level={4}>Export Options</Title>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='format'
              label={t('transaction.exportFormat')}
              rules={[{ required: true, message: t('transaction.pleaseSelectFormat') }]}
            >
              <Select>
                <Option value='excel'>
                  <Space>
                    <FileExcelOutlined style={{ color: '#52c41a' }} />
                    Excel (.xlsx)
                  </Space>
                </Option>
                <Option value='csv'>
                  <Space>
                    <FileTextOutlined style={{ color: '#1890ff' }} />
                    CSV (.csv)
                  </Space>
                </Option>
                <Option value='pdf' disabled>
                  <Space>
                    <FilePdfOutlined style={{ color: '#ff4d4f' }} />
                    PDF (.pdf) - Coming Soon
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name='dateRange'
              label={t('transaction.dateRange')}
              rules={[{ required: true, message: t('transaction.pleaseSelectDateRange') }]}
            >
              <RangePicker
                style={{ width: '100%' }}
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
                    label: t('transaction.thisMonth'),
                    value: [dayjs().startOf('month'), dayjs().endOf('month')],
                  },
                  {
                    label: 'Last 3 months',
                    value: [dayjs().subtract(3, 'month'), dayjs()],
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={5}>Include Additional Data</Title>

        <Form.Item name='includeCategories' valuePropName='checked'>
          <Checkbox>Include category names</Checkbox>
        </Form.Item>

        <Form.Item name='includePaymentMethods' valuePropName='checked'>
          <Checkbox>Include payment method names</Checkbox>
        </Form.Item>

        <Form.Item name='includeMetadata' valuePropName='checked'>
          <Checkbox>Include location and notes</Checkbox>
        </Form.Item>

        <Divider />

        <Card>
          <Row gutter={16} align='middle'>
            <Col flex='auto'>
              <div>
                <Text strong>Total Transactions: {transactions.length}</Text>
                <br />
                <Text type='secondary'>
                  Export will include all transactions in the selected date range
                </Text>
              </div>
            </Col>
            <Col>
              <Space>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  icon={<DownloadOutlined />}
                  loading={isExporting}
                >
                  Export
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {isExporting && (
          <Card style={{ marginTop: 16 }}>
            <div>
              <Text>Exporting transactions...</Text>
              <Progress
                percent={exportProgress}
                status={exportProgress === 100 ? 'success' : 'active'}
                style={{ marginTop: 8 }}
              />
            </div>
          </Card>
        )}
      </Form>
    </Modal>
  );
};

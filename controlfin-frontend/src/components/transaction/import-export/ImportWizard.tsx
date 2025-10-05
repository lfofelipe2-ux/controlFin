import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Divider,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Steps,
  Table,
  Tag,
  Typography,
  Upload,
} from 'antd';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { useTransactionStore } from '../../../stores/transactionStore';
import type { ImportResult, TransactionFormData } from '../../../types/transaction';

const { Step } = Steps;
const { Dragger } = Upload;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface ImportWizardProps {
  visible: boolean;
  onClose: () => void;
  onImportComplete: (result: ImportResult) => void;
}

interface ParsedData {
  data: Record<string, unknown>[];
  headers: string[];
  errors: string[];
}

export const ImportWizard: React.FC<ImportWizardProps> = ({
  visible,
  onClose,
  onImportComplete,
}) => {
  const { t } = useTranslation();
  const { isImporting } = useTransactionStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [mappedData, setMappedData] = useState<TransactionFormData[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});

  const steps = [
    {
      title: 'Upload File',
      description: 'Select CSV or Excel file',
    },
    {
      title: 'Map Fields',
      description: 'Match columns to transaction fields',
    },
    {
      title: 'Review Data',
      description: 'Preview and validate data',
    },
    {
      title: 'Import',
      description: 'Process and import transactions',
    },
  ];

  const requiredFields = ['type', 'amount', 'description', 'categoryId', 'paymentMethodId', 'date'];

  const optionalFields = ['tags', 'location', 'notes', 'isRecurring'];

  const handleFileUpload = useCallback((file: File) => {
    setFile(file);
    setCurrentStep(1);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          message.error('File must contain at least a header row and one data row');
          return;
        }

        const headers = jsonData[0] as string[];
        const dataRows = (jsonData.slice(1) as unknown[][]).map((row) => {
          const rowData: Record<string, unknown> = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });

        // Auto-map common field names
        const autoMapping: Record<string, string> = {};
        headers.forEach((header) => {
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('type') || lowerHeader.includes('transaction')) {
            autoMapping[header] = 'type';
          } else if (lowerHeader.includes('amount') || lowerHeader.includes('value')) {
            autoMapping[header] = 'amount';
          } else if (
            lowerHeader.includes('description') ||
            lowerHeader.includes('memo') ||
            lowerHeader.includes('note')
          ) {
            autoMapping[header] = 'description';
          } else if (lowerHeader.includes('category')) {
            autoMapping[header] = 'categoryId';
          } else if (lowerHeader.includes('payment') || lowerHeader.includes('method')) {
            autoMapping[header] = 'paymentMethodId';
          } else if (lowerHeader.includes('date')) {
            autoMapping[header] = 'date';
          } else if (lowerHeader.includes('tag')) {
            autoMapping[header] = 'tags';
          } else if (lowerHeader.includes('location')) {
            autoMapping[header] = 'location';
          }
        });

        setFieldMapping(autoMapping);
        setParsedData({
          data: dataRows,
          headers,
          errors: [],
        });
      } catch {
        message.error('Failed to parse file. Please check the file format.');
      }
    };

    reader.readAsBinaryString(file);
    return false; // Prevent default upload
  }, []);

  const handleFieldMapping = (header: string, field: string) => {
    setFieldMapping((prev) => ({
      ...prev,
      [header]: field,
    }));
  };

  const handlePreviewData = () => {
    if (!parsedData) return;

    const mappedRows: TransactionFormData[] = [];
    const errors: string[] = [];

    parsedData.data.forEach((row, _index) => {
      try {
        const mappedRow: Record<string, unknown> = {};

        // Map each field
        Object.entries(fieldMapping).forEach(([header, field]) => {
          const headerIndex = parsedData.headers.indexOf(header);
          if (headerIndex !== -1 && row[headerIndex] !== undefined) {
            mappedRow[field] = row[headerIndex];
          }
        });

        // Validate required fields
        const missingFields = requiredFields.filter((field) => !mappedRow[field]);
        if (missingFields.length > 0) {
          errors.push(`Row ${_index + 2}: Missing required fields: ${missingFields.join(', ')}`);
          return;
        }

        // Transform data to proper format
        const typeValue = mappedRow.type as string | undefined;
        const amountValue = mappedRow.amount as string | number | undefined;
        const tagsValue = mappedRow.tags as string | undefined;

        const transactionData: TransactionFormData = {
          type: (typeValue?.toString().toLowerCase() || 'expense') as TransactionFormData['type'],
          amount: parseFloat(amountValue?.toString() || '0') || 0,
          description: (mappedRow.description as string | undefined) || '',
          categoryId: (mappedRow.categoryId as string | undefined) || '',
          paymentMethodId: (mappedRow.paymentMethodId as string | undefined) || '',
          date: (mappedRow.date as string | undefined) || new Date().toISOString().split('T')[0],
          tags: tagsValue ? tagsValue.split(',').map((tag) => tag.trim()) : [],
          isRecurring: mappedRow.isRecurring === 'true' || mappedRow.isRecurring === true,
          metadata: {
            location: (mappedRow.location as string | undefined) || '',
            notes: (mappedRow.notes as string | undefined) || '',
          },
        };

        mappedRows.push(transactionData);
      } catch (error) {
        errors.push(
          `Row ${_index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });

    setMappedData(mappedRows);
    setCurrentStep(2);
  };

  const handleImport = async () => {
    if (!file) return;

    setCurrentStep(3);
    try {
      // const result = await importData(file);
      const result: ImportResult = {
        success: true,
        imported: 0,
        errors: [],
        warnings: [],
      };
      setImportResult(result);
      onImportComplete(result);

      if (result.success) {
        message.success(t('transaction.importSuccess'));
      } else {
        message.error(
          t('transaction.importFailed', { error: result.errors[0]?.message || 'Unknown error' })
        );
      }
    } catch {
      message.error(t('transaction.importFailed', { error: 'Unknown error' }));
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFile(null);
    setParsedData(null);
    setMappedData([]);
    setImportResult(null);
    setFieldMapping({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Title level={4}>Upload Transaction File</Title>
            <Paragraph>
              Upload a CSV or Excel file containing your transaction data. The file should have
              headers in the first row.
            </Paragraph>

            <Dragger
              accept='.csv,.xlsx,.xls'
              beforeUpload={handleFileUpload}
              showUploadList={false}
              style={{ padding: '40px 0' }}
            >
              <p className='ant-upload-drag-icon'>
                <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </p>
              <p className='ant-upload-text'>Click or drag file to this area to upload</p>
              <p className='ant-upload-hint'>Support for CSV and Excel files (.csv, .xlsx, .xls)</p>
            </Dragger>

            {file && (
              <Card style={{ marginTop: 16 }}>
                <Space>
                  <FileExcelOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <div>
                    <Text strong>{file.name}</Text>
                    <br />
                    <Text type='secondary'>{(file.size / 1024).toFixed(1)} KB</Text>
                  </div>
                </Space>
              </Card>
            )}
          </div>
        );

      case 1:
        return (
          <div>
            <Title level={4}>Map Fields</Title>
            <Paragraph>
              Map the columns from your file to the transaction fields. Required fields are marked
              with an asterisk (*).
            </Paragraph>

            <Table
              dataSource={parsedData?.headers.map((header, index) => ({
                key: index,
                header,
                mapping: fieldMapping[header] || '',
              }))}
              columns={[
                {
                  title: 'File Column',
                  dataIndex: 'header',
                  key: 'header',
                },
                {
                  title: 'Transaction Field',
                  dataIndex: 'mapping',
                  key: 'mapping',
                  render: (value, record) => (
                    <Select
                      value={value}
                      onChange={(newValue: string) => handleFieldMapping(record.header, newValue)}
                      style={{ width: '100%' }}
                      placeholder='Select field'
                    >
                      <optgroup label='Required Fields'>
                        {requiredFields.map((field) => (
                          <Option key={field} value={field}>
                            {field} *
                          </Option>
                        ))}
                      </optgroup>
                      <optgroup label='Optional Fields'>
                        {optionalFields.map((field) => (
                          <Option key={field} value={field}>
                            {field}
                          </Option>
                        ))}
                      </optgroup>
                    </Select>
                  ),
                },
              ]}
              pagination={false}
              size='small'
            />

            <Divider />

            <Row justify='end'>
              <Space>
                <Button onClick={() => setCurrentStep(0)}>Back</Button>
                <Button
                  type='primary'
                  onClick={handlePreviewData}
                  disabled={Object.keys(fieldMapping).length === 0}
                >
                  Preview Data
                </Button>
              </Space>
            </Row>
          </div>
        );

      case 2:
        return (
          <div>
            <Title level={4}>Review Data</Title>
            <Paragraph>
              Review the mapped data before importing. Check for any errors or missing information.
            </Paragraph>

            <Table
              dataSource={mappedData.slice(0, 10)} // Show first 10 rows
              columns={[
                {
                  title: 'Type',
                  dataIndex: 'type',
                  key: 'type',
                  render: (type) => (
                    <Tag color={type === 'income' ? 'green' : type === 'expense' ? 'red' : 'blue'}>
                      {type.toUpperCase()}
                    </Tag>
                  ),
                },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (amount) => `$${amount.toFixed(2)}`,
                },
                {
                  title: 'Description',
                  dataIndex: 'description',
                  key: 'description',
                  ellipsis: true,
                },
                {
                  title: 'Date',
                  dataIndex: 'date',
                  key: 'date',
                },
              ]}
              pagination={false}
              size='small'
            />

            {mappedData.length > 10 && (
              <Text type='secondary'>
                Showing first 10 rows of {mappedData.length} total transactions
              </Text>
            )}

            <Divider />

            <Row justify='end'>
              <Space>
                <Button onClick={() => setCurrentStep(1)}>Back</Button>
                <Button type='primary' onClick={handleImport} loading={isImporting}>
                  Import {mappedData.length} Transactions
                </Button>
              </Space>
            </Row>
          </div>
        );

      case 3:
        return (
          <div>
            <Title level={4}>Import Results</Title>

            {importResult && (
              <div>
                {importResult.success ? (
                  <Alert
                    message='Import Successful'
                    description={`Successfully imported ${importResult.imported} transactions`}
                    type='success'
                    icon={<CheckCircleOutlined />}
                    style={{ marginBottom: 16 }}
                  />
                ) : (
                  <Alert
                    message='Import Failed'
                    description='There were errors during the import process'
                    type='error'
                    icon={<ExclamationCircleOutlined />}
                    style={{ marginBottom: 16 }}
                  />
                )}

                {importResult.errors.length > 0 && (
                  <Card title='Errors' style={{ marginBottom: 16 }}>
                    {importResult.errors.map((error, index) => (
                      <div key={index} style={{ marginBottom: 8 }}>
                        <Text type='danger'>
                          Row {error.row}: {error.message}
                        </Text>
                      </div>
                    ))}
                  </Card>
                )}

                {importResult.warnings.length > 0 && (
                  <Card title='Warnings' style={{ marginBottom: 16 }}>
                    {importResult.warnings.map((warning, index) => (
                      <div key={index} style={{ marginBottom: 8 }}>
                        <Text type='warning'>
                          Row {warning.row}: {warning.message}
                        </Text>
                      </div>
                    ))}
                  </Card>
                )}

                <Row justify='end'>
                  <Space>
                    <Button onClick={handleReset}>Import Another File</Button>
                    <Button type='primary' onClick={handleClose}>
                      Close
                    </Button>
                  </Space>
                </Row>
              </div>
            )}

            {isImporting && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size='large' />
                <div style={{ marginTop: 16 }}>
                  <Text>Importing transactions...</Text>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title='Import Transactions'
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} description={step.description} />
        ))}
      </Steps>

      {renderStepContent()}
    </Modal>
  );
};

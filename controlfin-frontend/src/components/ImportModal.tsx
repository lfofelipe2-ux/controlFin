import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    InboxOutlined,
    LoadingOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import {
    Alert,
    Button,
    Checkbox,
    Divider,
    Modal,
    Space,
    Table,
    Typography,
    Upload,
} from 'antd';
import Papa from 'papaparse';
import React, { useCallback, useState } from 'react';
import { useTransactionStore } from '../stores/transactionStore';

const { Dragger } = Upload;
const { Text, Title } = Typography;

interface ImportModalProps {
    visible: boolean;
    onClose: () => void;
    onImport: (file: File, options: ImportOptions) => void;
    loading: boolean;
}

interface ImportOptions {
    skipDuplicates: boolean;
    updateExisting: boolean;
    dateFormat: string;
    delimiter: string;
}

interface ParsedTransaction {
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    categoryId: string;
    isValid: boolean;
    errors: string[];
}

const ImportModal: React.FC<ImportModalProps> = ({
    visible,
    onClose,
    onImport,
    loading,
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
    const [importOptions, setImportOptions] = useState<ImportOptions>({
        skipDuplicates: true,
        updateExisting: false,
        dateFormat: 'YYYY-MM-DD',
        delimiter: ',',
    });
    const [parsing, setParsing] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);

    const { categories } = useTransactionStore();

    const handleFileChange: UploadProps['onChange'] = useCallback(({ fileList: newFileList }: any) => {
        setFileList(newFileList);

        if (newFileList.length > 0) {
            const file = newFileList[0].originFileObj;
            if (file) {
                parseFile(file);
            }
        } else {
            setParsedData([]);
            setParseError(null);
        }
    }, []);

    const parseFile = async (file: File) => {
        setParsing(true);
        setParseError(null);

        try {
            const text = await file.text();

            Papa.parse(text, {
                header: false,
                skipEmptyLines: true,
                delimiter: importOptions.delimiter,
                complete: (results) => {
                    const parsed: ParsedTransaction[] = results.data.map((row: any) => {
                        const [date, description, amount, type, categoryId] = row;
                        const errors: string[] = [];

                        // Validate date
                        if (!date || isNaN(Date.parse(date))) {
                            errors.push('Invalid date format');
                        }

                        // Validate amount
                        const parsedAmount = parseFloat(amount);
                        if (isNaN(parsedAmount) || parsedAmount === 0) {
                            errors.push('Invalid amount');
                        }

                        // Validate type
                        if (!['income', 'expense'].includes(type)) {
                            errors.push('Type must be "income" or "expense"');
                        }

                        // Validate category
                        const categoryExists = categories.some(cat => cat.id === categoryId);
                        if (categoryId && !categoryExists) {
                            errors.push('Category not found');
                        }

                        return {
                            date: date || '',
                            description: description || '',
                            amount: parsedAmount || 0,
                            type: type as 'income' | 'expense',
                            categoryId: categoryId || '',
                            isValid: errors.length === 0,
                            errors,
                        };
                    });

                    setParsedData(parsed);
                    setParsing(false);
                },
                error: (error: any) => {
                    setParseError(`Parse error: ${error.message}`);
                    setParsing(false);
                },
            });
        } catch (error) {
            setParseError(`File read error: ${error}`);
            setParsing(false);
        }
    };

    const handleImport = () => {
        if (fileList.length > 0 && fileList[0].originFileObj) {
            onImport(fileList[0].originFileObj, importOptions);
        }
    };

    const validTransactions = parsedData.filter(t => t.isValid);
    const invalidTransactions = parsedData.filter(t => !t.isValid);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 100,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 100,
            render: (amount: number) => `R$ ${amount.toFixed(2)}`,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: (type: string) => (
                <span style={{ color: type === 'income' ? '#52c41a' : '#ff4d4f' }}>
                    {type === 'income' ? '💰' : '💸'} {type}
                </span>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 80,
            render: (record: ParsedTransaction) => (
                record.isValid ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : (
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                )
            ),
        },
    ];

    return (
        <Modal
            title="Import Transactions"
            open={visible}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="import"
                    type="primary"
                    icon={loading ? <LoadingOutlined /> : <UploadOutlined />}
                    onClick={handleImport}
                    loading={loading}
                    disabled={validTransactions.length === 0}
                >
                    Import {validTransactions.length} Transactions
                </Button>,
            ]}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* File Upload */}
                <div>
                    <Title level={5}>Upload File</Title>
                    <Dragger
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={() => false}
                        accept=".csv,.xlsx,.xls"
                        maxCount={1}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                            Support for CSV, Excel files. Expected format: Date, Description, Amount, Type, Category ID
                        </p>
                    </Dragger>
                </div>

                {/* Parse Status */}
                {parsing && (
                    <Alert
                        message="Parsing file..."
                        description="Please wait while we parse your file."
                        type="info"
                        icon={<LoadingOutlined />}
                        showIcon
                    />
                )}

                {parseError && (
                    <Alert
                        message="Parse Error"
                        description={parseError}
                        type="error"
                        showIcon
                    />
                )}

                {/* Import Options */}
                {parsedData.length > 0 && (
                    <>
                        <Divider>Import Options</Divider>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Checkbox
                                checked={importOptions.skipDuplicates}
                                onChange={(e) => setImportOptions({
                                    ...importOptions,
                                    skipDuplicates: e.target.checked,
                                })}
                            >
                                Skip duplicate transactions
                            </Checkbox>
                            <Checkbox
                                checked={importOptions.updateExisting}
                                onChange={(e) => setImportOptions({
                                    ...importOptions,
                                    updateExisting: e.target.checked,
                                })}
                            >
                                Update existing transactions
                            </Checkbox>
                        </Space>
                    </>
                )}

                {/* Preview Table */}
                {parsedData.length > 0 && (
                    <>
                        <Divider>Preview ({parsedData.length} rows)</Divider>
                        <div style={{ maxHeight: 300, overflow: 'auto' }}>
                            <Table
                                columns={columns}
                                dataSource={parsedData.map((item, index) => ({ ...item, key: index }))}
                                pagination={false}
                                size="small"
                                scroll={{ y: 200 }}
                            />
                        </div>

                        {/* Summary */}
                        <Space>
                            <Text type="success">
                                ✓ {validTransactions.length} valid transactions
                            </Text>
                            {invalidTransactions.length > 0 && (
                                <Text type="danger">
                                    ✗ {invalidTransactions.length} invalid transactions
                                </Text>
                            )}
                        </Space>
                    </>
                )}

                {/* Instructions */}
                <Alert
                    message="File Format Instructions"
                    description={
                        <div>
                            <p>Your CSV file should have the following columns in order:</p>
                            <ol>
                                <li><strong>Date:</strong> YYYY-MM-DD format (e.g., 2025-01-27)</li>
                                <li><strong>Description:</strong> Transaction description</li>
                                <li><strong>Amount:</strong> Numeric value (e.g., 100.50)</li>
                                <li><strong>Type:</strong> "income" or "expense"</li>
                                <li><strong>Category ID:</strong> Valid category ID from your categories</li>
                            </ol>
                        </div>
                    }
                    type="info"
                    showIcon
                />
            </Space>
        </Modal>
    );
};

export default ImportModal;

import {
  BarChartOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Button, Layout, message, Modal, Space, Tabs, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTransactionStore } from '../../stores/transactionStore';
import type {
  ImportResult,
  Transaction,
  TransactionFilters,
  TransactionFormData,
} from '../../types/transaction';
import { TransactionList } from './TransactionList';
import { TransactionChart } from './charts/TransactionChart';
import { FilterPanel } from './filters/FilterPanel';
import { TransactionForm } from './forms/TransactionForm';
import { ExportPanel } from './import-export/ExportPanel';
import { ImportWizard } from './import-export/ImportWizard';

const { Content } = Layout;
const { Title } = Typography;

export const TransactionManagement: React.FC = () => {
  const {
    transactions,
    stats,
    loading,
    error,
    isFormOpen,
    formMode,
    selectedTransaction,
    refreshData,
    openForm,
    closeForm,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
  } = useTransactionStore();

  const [activeTab, setActiveTab] = useState('list');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterPresets, setFilterPresets] = useState<
    Array<{ name: string; filters: TransactionFilters }>
  >([]);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Mock data for demonstration
  // useEffect(() => {
  //     if (transactions.length === 0) {
  //     // Add some mock data for demonstration
  //     // const mockTransactions: Transaction[] = [
  //     //     {
  //                 id: '1',
  //                 spaceId: 'space1',
  //                 userId: 'user1',
  //                 type: 'expense',
  //                 amount: 25.50,
  //                 description: 'Coffee at Starbucks',
  //                 categoryId: 'cat1',
  //                 paymentMethodId: 'pm1',
  //                 date: '2025-10-04',
  //                 tags: ['food', 'coffee'],
  //                 isRecurring: false,
  //                 metadata: {
  //                     location: 'Downtown',
  //                     notes: 'Morning coffee',
  //                 },
  //                 createdAt: '2025-10-04T10:00:00Z',
  //                 updatedAt: '2025-10-04T10:00:00Z',
  //             },
  //             {
  //                 id: '2',
  //                 spaceId: 'space1',
  //                 userId: 'user1',
  //                 type: 'income',
  //                 amount: 3000.00,
  //                 description: 'Salary',
  //                 categoryId: 'cat2',
  //                 paymentMethodId: 'pm2',
  //                 date: '2025-10-01',
  //                 tags: ['salary', 'work'],
  //                 isRecurring: true,
  //                 metadata: {
  //                     notes: 'Monthly salary',
  //                 },
  //                 createdAt: '2025-10-01T09:00:00Z',
  //                 updatedAt: '2025-10-01T09:00:00Z',
  //             },
  //         ];

  //         const mockCategories = [
  //             {
  //                 id: 'cat1',
  //                 spaceId: 'space1',
  //                 name: 'Food & Dining',
  //                 type: 'expense' as const,
  //                 color: '#ff4d4f',
  //                 icon: '🍽️',
  //                 isActive: true,
  //                 createdAt: '2025-10-01T00:00:00Z',
  //                 updatedAt: '2025-10-01T00:00:00Z',
  //             },
  //             {
  //                 id: 'cat2',
  //                 spaceId: 'space1',
  //                 name: 'Salary',
  //                 type: 'income' as const,
  //                 color: '#52c41a',
  //                 icon: '💰',
  //                 isActive: true,
  //                 createdAt: '2025-10-01T00:00:00Z',
  //                 updatedAt: '2025-10-01T00:00:00Z',
  //             },
  //         ];

  //         const mockPaymentMethods = [
  //             {
  //                 id: 'pm1',
  //                 spaceId: 'space1',
  //                 name: 'Credit Card',
  //                 type: 'card' as const,
  //                 color: '#1890ff',
  //                 icon: '💳',
  //                 isActive: true,
  //                 createdAt: '2025-10-01T00:00:00Z',
  //                 updatedAt: '2025-10-01T00:00:00Z',
  //             },
  //             {
  //                 id: 'pm2',
  //                 spaceId: 'space1',
  //                 name: 'Bank Account',
  //                 type: 'bank' as const,
  //                 color: '#52c41a',
  //                 icon: '🏦',
  //                 isActive: true,
  //                 createdAt: '2025-10-01T00:00:00Z',
  //                 updatedAt: '2025-10-01T00:00:00Z',
  //             },
  //         ];

  //     // Set mock data
  //     // transactions.forEach(t => addTransaction(t));
  //     // mockCategories.forEach(c => {
  //     //     // This would normally be set through the store
  //     // });
  //     // mockPaymentMethods.forEach(pm => {
  //     //     // This would normally be set through the store
  //     // });
  //     }
  // }, [transactions.length, addTransaction]);

  const handleAddTransaction = () => {
    openForm('create');
  };

  const handleEditTransaction = (transaction: Transaction) => {
    openForm('edit', transaction);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    openForm('view', transaction);
  };

  const handleDeleteTransaction = (id: string) => {
    Modal.confirm({
      title: 'Delete Transaction',
      content: 'Are you sure you want to delete this transaction? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        deleteTransaction(id);
        message.success('Transaction deleted successfully');
      },
    });
  };

  const handleSaveTransaction = async (data: TransactionFormData) => {
    try {
      if (formMode === 'create') {
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          spaceId: 'space1',
          userId: 'user1',
          ...data,
          date: data.date,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addTransaction(newTransaction);
      } else if (formMode === 'edit' && selectedTransaction) {
        updateTransaction(selectedTransaction.id, {
          ...data,
          date: data.date,
          updatedAt: new Date().toISOString(),
        });
      }
      closeForm();
    } catch (error) {
      throw error;
    }
  };

  const handleExportData = () => {
    setShowExportModal(true);
  };

  const handleImportData = () => {
    setShowImportModal(true);
  };

  const handleImportComplete = (result: ImportResult) => {
    if (result.success) {
      message.success(`Successfully imported ${result.imported} transactions`);
    } else {
      message.error(`Import failed: ${result.errors[0]?.message || 'Unknown error'}`);
    }
  };

  const handleViewCharts = () => {
    setActiveTab('charts');
  };

  const handleApplyFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setShowFilterPanel(false);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: null,
      paymentMethod: null,
      type: 'all',
      dateRange: null,
      amountRange: null,
      tags: [],
      isRecurring: null,
    });
  };

  const handleSavePreset = (name: string, filters: TransactionFilters) => {
    setFilterPresets((prev) => [...prev, { name, filters }]);
    message.success(`Filter preset "${name}" saved successfully`);
  };

  const handleLoadPreset = (filters: TransactionFilters) => {
    setFilters(filters);
    message.success('Filter preset loaded successfully');
  };

  const handleDateRangeChange = (dates: [string, string]) => {
    setFilters({ dateRange: dates });
  };

  const handleChartTypeChange = (type: string) => {
    // Handle chart type change
    console.log('Chart type changed to:', type);
  };

  if (error) {
    return (
      <Content style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={3} type='danger'>
            Error Loading Transactions
          </Title>
          <p>{error}</p>
          <Button type='primary' onClick={refreshData}>
            Try Again
          </Button>
        </div>
      </Content>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#1f1f1f' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ color: '#ffffff', marginBottom: '8px' }}>
            Transaction Management
          </Title>
          <Space>
            <Button type='primary' icon={<PlusOutlined />} onClick={handleAddTransaction}>
              Add Transaction
            </Button>
            <Button icon={<ImportOutlined />} onClick={handleImportData}>
              Import
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExportData}>
              Export
            </Button>
          </Space>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'list',
              label: (
                <span>
                  <TableOutlined />
                  Transactions
                </span>
              ),
              children: (
                <TransactionList
                  onAddTransaction={handleAddTransaction}
                  onEditTransaction={handleEditTransaction}
                  onViewTransaction={handleViewTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  onExportData={handleExportData}
                  onImportData={handleImportData}
                  onViewCharts={handleViewCharts}
                />
              ),
            },
            {
              key: 'charts',
              label: (
                <span>
                  <BarChartOutlined />
                  Analytics
                </span>
              ),
              children: stats ? (
                <TransactionChart
                  stats={stats}
                  onDateRangeChange={handleDateRangeChange}
                  onChartTypeChange={handleChartTypeChange}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <Title level={3}>No Data Available</Title>
                  <p>Add some transactions to see analytics</p>
                </div>
              ),
            },
          ]}
        />

        {/* Transaction Form Modal */}
        {isFormOpen && (
          <Modal
            title={
              formMode === 'create'
                ? 'Add Transaction'
                : formMode === 'edit'
                  ? 'Edit Transaction'
                  : 'View Transaction'
            }
            open={isFormOpen}
            onCancel={closeForm}
            footer={null}
            width={800}
            destroyOnClose
          >
            <TransactionForm
              onSave={handleSaveTransaction}
              onCancel={closeForm}
              loading={loading}
            />
          </Modal>
        )}

        {/* Import Wizard Modal */}
        <ImportWizard
          visible={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportComplete={handleImportComplete}
        />

        {/* Export Panel Modal */}
        <ExportPanel
          visible={showExportModal}
          onClose={() => setShowExportModal(false)}
          transactions={transactions}
        />

        {/* Filter Panel Modal */}
        <Modal
          title='Advanced Filters'
          open={showFilterPanel}
          onCancel={() => setShowFilterPanel(false)}
          footer={null}
          width={800}
        >
          <FilterPanel
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            presets={filterPresets}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

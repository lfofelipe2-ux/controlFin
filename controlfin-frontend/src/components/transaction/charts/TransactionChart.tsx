import { Card, Col, DatePicker, Row, Select, Space, Spin, Typography } from 'antd';
import dayjs from 'dayjs';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransactionStore } from '../../../stores/transactionStore';
import type { TransactionStats } from '../../../types/transaction';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

interface TransactionChartProps {
  stats: TransactionStats;
  onDateRangeChange: (dates: [string, string]) => void;
  onChartTypeChange: (type: string) => void;
}

export const TransactionChart: React.FC<TransactionChartProps> = ({
  stats,
  onDateRangeChange,
  onChartTypeChange,
}) => {
  const { t } = useTranslation();
  const { loading } = useTransactionStore();

  // Category breakdown chart options
  const categoryChartOptions = useMemo(
    () => ({
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      },
      title: {
        text: t('transaction.expensesByCategory'),
        style: {
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '600',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f}%',
            style: {
              color: '#ffffff',
              textOutline: 'none',
            },
          },
          showInLegend: true,
        },
      },
      legend: {
        itemStyle: {
          color: '#ffffff',
        },
      },
      series: [
        {
          name: 'Amount',
          colorByPoint: true,
          data: stats.categoryBreakdown.map((item, index) => ({
            name: item.categoryName,
            y: item.amount,
            color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
          })),
        },
      ],
      credits: {
        enabled: false,
      },
    }),
    [stats.categoryBreakdown]
  );

  // Payment method breakdown chart options
  const paymentMethodChartOptions = useMemo(
    () => ({
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      },
      title: {
        text: t('transaction.transactionsByPaymentMethod'),
        style: {
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '600',
        },
      },
      xAxis: {
        categories: stats.paymentMethodBreakdown.map((item) => item.paymentMethodName),
        labels: {
          style: {
            color: '#ffffff',
          },
        },
      },
      yAxis: {
        title: {
          text: 'Amount ($)',
          style: {
            color: '#ffffff',
          },
        },
        labels: {
          style: {
            color: '#ffffff',
          },
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            format: '${y}',
            style: {
              color: '#ffffff',
              textOutline: 'none',
            },
          },
        },
      },
      series: [
        {
          name: 'Amount',
          data: stats.paymentMethodBreakdown.map((item) => item.amount),
          color: '#1890ff',
        },
      ],
      credits: {
        enabled: false,
      },
    }),
    [stats.paymentMethodBreakdown]
  );

  // Monthly trend chart options
  const monthlyTrendOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      },
      title: {
        text: t('transaction.monthlyTrend'),
        style: {
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '600',
        },
      },
      xAxis: {
        categories: stats.monthlyTrend.map((item) => item.month),
        labels: {
          style: {
            color: '#ffffff',
          },
        },
      },
      yAxis: {
        title: {
          text: 'Amount ($)',
          style: {
            color: '#ffffff',
          },
        },
        labels: {
          style: {
            color: '#ffffff',
          },
        },
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
            format: '${y}',
            style: {
              color: '#ffffff',
              textOutline: 'none',
            },
          },
        },
      },
      series: [
        {
          name: 'Income',
          data: stats.monthlyTrend.map((item) => item.income),
          color: '#52c41a',
        },
        {
          name: 'Expense',
          data: stats.monthlyTrend.map((item) => item.expense),
          color: '#ff4d4f',
        },
        {
          name: 'Net',
          data: stats.monthlyTrend.map((item) => item.net),
          color: '#1890ff',
        },
      ],
      credits: {
        enabled: false,
      },
    }),
    [stats.monthlyTrend]
  );

  // Income vs Expense comparison chart
  const incomeExpenseOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      },
      title: {
        text: t('transaction.incomeVsExpense'),
        style: {
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '600',
        },
      },
      xAxis: {
        categories: [t('transaction.total')],
        labels: {
          style: {
            color: '#ffffff',
          },
        },
      },
      yAxis: {
        title: {
          text: 'Amount ($)',
          style: {
            color: '#ffffff',
          },
        },
        labels: {
          style: {
            color: '#ffffff',
          },
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            format: '${y}',
            style: {
              color: '#ffffff',
              textOutline: 'none',
            },
          },
        },
      },
      series: [
        {
          name: 'Income',
          data: [stats.totalIncome],
          color: '#52c41a',
        },
        {
          name: 'Expense',
          data: [stats.totalExpense],
          color: '#ff4d4f',
        },
      ],
      credits: {
        enabled: false,
      },
    }),
    [stats.totalIncome, stats.totalExpense]
  );

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size='large' />
          <div style={{ marginTop: 16 }}>
            <Text>Loading charts...</Text>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Chart Controls */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align='middle'>
          <Col flex='auto'>
            <Space>
              <Text strong>Chart Period:</Text>
              <RangePicker
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    onDateRangeChange([
                      dates[0].format('YYYY-MM-DD'),
                      dates[1].format('YYYY-MM-DD'),
                    ]);
                  }
                }}
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
                    label: 'Last 3 months',
                    value: [dayjs().subtract(3, 'month'), dayjs()],
                  },
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Text strong>Chart Type:</Text>
              <Select defaultValue='overview' onChange={onChartTypeChange} style={{ width: 120 }}>
                <Option value='overview'>Overview</Option>
                <Option value='categories'>Categories</Option>
                <Option value='trends'>Trends</Option>
                <Option value='comparison'>Comparison</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Charts Grid */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card>
            <HighchartsReact highcharts={Highcharts} options={categoryChartOptions} />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <HighchartsReact highcharts={Highcharts} options={paymentMethodChartOptions} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card>
            <HighchartsReact highcharts={Highcharts} options={monthlyTrendOptions} />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <HighchartsReact highcharts={Highcharts} options={incomeExpenseOptions} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

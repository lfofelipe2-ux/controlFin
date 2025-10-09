import { CheckCircleOutlined, ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Modal, Progress, Space, Typography } from 'antd';
import React from 'react';

const { Text, Title } = Typography;

interface ProgressIndicatorProps {
    visible: boolean;
    progress: number;
    message: string;
    status?: 'active' | 'success' | 'exception';
    onCancel?: () => void;
    onClose?: () => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
    visible,
    progress,
    message,
    status = 'active',
    onCancel,
    onClose,
}) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />;
            case 'exception':
                return <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />;
            default:
                return <LoadingOutlined style={{ color: '#1890ff', fontSize: 24 }} />;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return '#52c41a';
            case 'exception':
                return '#ff4d4f';
            default:
                return '#1890ff';
        }
    };

    const isComplete = status === 'success' || status === 'exception';
    const canCancel = status === 'active' && onCancel;

    return (
        <Modal
            title="Processing..."
            open={visible}
            closable={isComplete}
            onCancel={isComplete ? onClose : undefined}
            footer={
                <Space>
                    {canCancel && (
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    {isComplete && (
                        <Button type="primary" onClick={onClose}>
                            Close
                        </Button>
                    )}
                </Space>
            }
            width={400}
            centered
        >
            <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="large">
                {/* Status Icon */}
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                    {getStatusIcon()}
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%' }}>
                    <Progress
                        percent={Math.round(progress)}
                        status={status}
                        strokeColor={getStatusColor()}
                        showInfo={true}
                        format={(percent) => `${percent}%`}
                    />
                </div>

                {/* Message */}
                <div>
                    <Title level={5} style={{ margin: 0, color: getStatusColor() }}>
                        {message}
                    </Title>
                </div>

                {/* Additional Info */}
                {status === 'active' && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Please don't close this window while processing...
                    </Text>
                )}

                {status === 'success' && (
                    <Text type="success" style={{ fontSize: 12 }}>
                        Operation completed successfully!
                    </Text>
                )}

                {status === 'exception' && (
                    <Text type="danger" style={{ fontSize: 12 }}>
                        An error occurred during processing.
                    </Text>
                )}
            </Space>
        </Modal>
    );
};

export default ProgressIndicator;

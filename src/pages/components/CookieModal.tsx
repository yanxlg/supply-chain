import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, Table, Form, Input } from 'antd';
import { queryCookie, saveCookie } from '@/services/order';
import '@/styles/index.less';
import LoadingButton from '@/pages/components/LoadingBtn';

declare interface CookieModalProps {
    visible: boolean;
    onClose: () => void;
}

declare interface ITableItem {
    account_id: string;
    phone: string;
    cookie: string;
    status: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: ITableItem;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
                                                       editing,
                                                       dataIndex,
                                                       title,
                                                       inputType,
                                                       record,
                                                       index,
                                                       children,
                                                       ...restProps
                                                   }) => {

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `请输入Cookie`,
                        },
                    ]}
                >
                    <Input.TextArea className="cookie-column"/>
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const CookieModal: React.FC<CookieModalProps> = ({ visible, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [dataSet, setDataSet] = useState<ITableItem[]>([]);

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<string | undefined>(undefined);

    const isEditing = (record: ITableItem) => record.account_id === editingKey;

    const refresh = useCallback(() => {
        setLoading(true);
        setEditingKey(undefined);
        return queryCookie().then(({ data: { list = [] } }) => {
            setDataSet(list);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (visible) {
            setLoading(true);
            refresh();
        }
        return () => {
            setLoading(false);
        };
    }, [visible]);

    const columns: any[] = [{
        title: '账户',
        dataIndex: 'phone',
        align: 'center',
        width: '150px',
    }, {
        title: 'cookie',
        dataIndex: 'cookie',
        align: 'center',
        width: '400px',
        className: 'break-all',
        editable: true,
        render: (_: string) => {
            return <div className="cookie-column">{_}</div>;
        },
    }, {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        width: '100px',
        render: (status: any) => {
            return status === "1" ? '有效' : status === "2" ? '过期' : '默认';
        },
    }, {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: '150px',
        render: (_: any, record: ITableItem) => {
            const editable = isEditing(record);
            return editable ? (
                <LoadingButton type="link" onClick={() => save(record.account_id)}>保存</LoadingButton>
            ) : (
                <Button type="link" onClick={() => edit(record)}>修改</Button>
            );
        },
    }];

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ITableItem) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const edit = (record: ITableItem) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.account_id);
    };

    const save = async (key: string) => {
        try {
            const values = (await form.validateFields());
            await saveCookie({
                account_id: key,
                cookie: values.cookie,
            });
            setEditingKey(undefined);
            refresh();
        } catch (errInfo) {
        }
    };

    return useMemo(() => {
        return (
            <Modal visible={visible} width={900} onCancel={onClose} title={
                <div>
                    采购账号Cookie维护
                    <LoadingButton type="link" onClick={refresh}>刷新</LoadingButton>
                </div>
            } footer={null}>
                <Form form={form} component={false}>
                    <Table loading={loading} tableLayout="fixed"
                           rowKey={"account_id"}
                           components={{
                               body: {
                                   cell: EditableCell,
                               },
                           }}
                           bordered={true}
                           dataSource={dataSet}
                           columns={mergedColumns} pagination={false}
                           scroll={{
                               y:600
                           }}
                    />
                </Form>
            </Modal>
        );
    }, [visible, loading, editingKey]);
};

export default CookieModal;

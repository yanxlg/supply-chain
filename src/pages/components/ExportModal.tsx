import React, { useCallback, useMemo } from 'react';
import { Form, Modal, Checkbox } from 'antd';
import { IStoreItem } from '@/pages/components/TabChild';

declare interface IExportModalProps {
    visible: boolean;
    onCancel: () => void;
    storeList: IStoreItem[];
}

const ExportModal: React.FC<IExportModalProps> = ({ visible, onCancel, storeList = [] }) => {
    const form = Form.useForm()[0];
    const onOKey = useCallback(() => {
        form.validateFields().then((values)=>{

        });
    }, []);
    return useMemo(() => {
        return (
            <Modal visible={visible} width={700} onCancel={onCancel} onOk={onOKey} destroyOnClose={true}>
                <Form form={form} layout="horizontal" initialValues={{
                    export_filed: ['gsn', 'virtual_goods_id', 'pdd_goods_id', 'pdd_sales_num', 'vova_cat_id', 'pdd_cat_id', 'pdd_goods_url', 'goods_add_time'],
                    is_on_sale: [1],
                    merchant_id: storeList.map(store=>store.key),
                }}>
                    <Form.Item label="店铺名称" name="merchant_id" rules={[{
                        required: true,
                        message: '请选择导出店铺',
                    }]}>
                        <Checkbox.Group>
                            {
                                storeList.map(({ key, value }) => {
                                    return (
                                        <Checkbox key={key} value={key}>
                                            {value}
                                        </Checkbox>
                                    )
                                })}
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item label="在架状态" name="is_on_sale" rules={[{
                        required: true,
                        message: '请选择在架状态',
                    }]}>
                        <Checkbox.Group>
                            <Checkbox value={1}>
                                已上架
                            </Checkbox>
                            <Checkbox value={2}>
                                已下架
                            </Checkbox>
                            <Checkbox value={3}>
                                待上架
                            </Checkbox>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item label="导出数据" name={'export_filed'} rules={[{
                        required: true,
                        message: '请选择导出数据',
                    }]}>
                        <Checkbox.Group>
                            <div>
                                <Checkbox value={'gsn'}>
                                    GSN
                                </Checkbox>
                                <Checkbox value={'virtual_goods_id'}>
                                    虚拟ID
                                </Checkbox>
                                <Checkbox value={'pdd_goods_id'}>
                                    pdd goods id
                                </Checkbox>
                                <Checkbox value={'pdd_sales_num'}>
                                    拼多多销量
                                </Checkbox>
                            </div>
                            <div>
                                <Checkbox value={'vova_cat_id'}>
                                    vova 二级分类id
                                </Checkbox>
                                <Checkbox value={'pdd_cat_id'}>
                                    拼多多分类id
                                </Checkbox>
                                <Checkbox value={'pdd_goods_url'}>
                                    pdd商详链接
                                </Checkbox>
                                <Checkbox value={'goods_add_time'}>
                                    商品上传时间
                                </Checkbox>
                            </div>
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }, [visible, storeList]);
};

export default ExportModal;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { IDataItem } from '@/pages/components/TabChild';
import { afterSalesConfirmDelivery } from '@/services/order';

declare interface Interface {
    visible:false|IDataItem;
    expressList:Array<{
        shippingId: number;
        shippingName: string;
    }>;
    onClose:()=>void;
}

const RefundModal:React.FC<Interface>=({visible,expressList,onClose})=>{
    const [form] = Form.useForm();
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        if(visible){
            form.resetFields();
        }
    },[visible]);

    const onOKey = useCallback(()=>{
        form.validateFields().then((values)=>{
            const {tracking_number,shipping_id} = values;
            const shipping_name = expressList.find((item)=>item.shippingId ===shipping_id)?.shippingName;
            const {order_goods_sn} = visible as IDataItem;
            setLoading(true);
            afterSalesConfirmDelivery({
                salesOrderGoodsSn:order_goods_sn,
                shipping_id,
                shipping_name,
                tracking_number
            }).then(()=>{
                onClose();
            }).finally(()=>{
                setLoading(false);
            });
        });
    },[expressList,onClose]);

    return useMemo(()=>{
        return (
            <Modal title="退货信息" visible={!!visible} onCancel={onClose} onOk={onOKey} confirmLoading={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item rules={[{required:true,message:"请填写运单号"}]} name="tracking_number" label="运单号">
                        <Input/>
                    </Form.Item>
                    <Form.Item rules={[{required:true,message:"请选择物流方式"}]} name="shipping_id" label="物流方式">
                        <Select>
                            {expressList.map(({shippingId,shippingName})=>{
                                return <Select.Option value={shippingId} key={shippingId}>{shippingName}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        )
    },[visible,expressList,onClose,loading]);
};

export default RefundModal;

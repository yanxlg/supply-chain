import React, { ChangeEvent, RefObject } from 'react';
import { Form, Input, Modal } from 'antd';
import "@/styles/index.less";
import { FormInstance } from 'antd/es/form';
import { updatePurchaseOrder } from '@/services/order';


declare interface IBeatServiceModalProps{
    visible:boolean;
    purchaseOrderGoodsId?:string;
    saleOrderGoodsSn?:string;
    onCancel:()=>void;
    onSuccess:()=>void;
}
declare interface IBeatServiceModalState {
    confirmLoading:boolean;
}

class BeatServiceModal extends React.PureComponent<IBeatServiceModalProps,IBeatServiceModalState>{
    private formRef:RefObject<FormInstance> = React.createRef();
    constructor(props:IBeatServiceModalProps) {
        super(props);
        this.state={
            confirmLoading:false
        }
    }
    private onSubmit=()=>{
        const {purchaseOrderGoodsId,saleOrderGoodsSn} = this.props;
        this.setState({
            confirmLoading:true
        });
        this.formRef.current!.validateFields().then(({goodsId,sku})=>{
            updatePurchaseOrder({
                goodsId:goodsId,
                skuId:sku,
                purchaseOrderGoodsId:purchaseOrderGoodsId!,
                saleOrderGoodsSn:saleOrderGoodsSn!
            }).then(()=>{
                this.props.onCancel();
                this.props.onSuccess();
            }).finally(()=>{
                this.setState({
                    confirmLoading:false
                })
            })
        })
    };
    render(){
        const {visible,onCancel} = this.props;
        const {confirmLoading} = this.state;
        return (
            <Modal confirmLoading={confirmLoading} title="请输入相似款的商品信息:" visible={visible} okText='保存并立即拍单' cancelText="取消" onCancel={onCancel} onOk={this.onSubmit} destroyOnClose={true}>
                <Form layout="horizontal" ref={this.formRef}>
                    <Form.Item label={<span>pdd goods id</span>} name={"goodsId"} rules={[{
                        required:true,
                        message:"请输入pdd goods id"
                    }]}>
                        <Input className="input"/>
                    </Form.Item>
                    <Form.Item label={<span>pdd&emsp;sku&ensp;id</span>} name={"sku"} rules={[{
                        required:true,
                        message:"请输入pdd sku id"
                    }]}>
                        <Input className="input"/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default BeatServiceModal;

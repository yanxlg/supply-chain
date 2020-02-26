import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Timeline } from 'antd';


declare interface IShippingModalProps {
    purchase_order_goods_sn?:string;
}

const ShippingModal:React.FC<IShippingModalProps> = ({purchase_order_goods_sn})=>{
    const [] = useState();
    useEffect(()=>{
        if(purchase_order_goods_sn){
            // query
        }else{
            //clear

        }
    },[purchase_order_goods_sn]);


    return useMemo(()=>{
        return (
            <Modal visible={!!purchase_order_goods_sn} title={<div><img/>顺丰快递</div>} footer={null}>
                <Timeline>
                    <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                    <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                    <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                    <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                </Timeline>
            </Modal>
        )
    },[purchase_order_goods_sn]);
};

export {ShippingModal};

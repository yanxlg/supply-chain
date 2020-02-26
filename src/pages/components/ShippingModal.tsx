import React, { useEffect, useMemo, useState } from 'react';
import { Empty, Modal, Spin, Timeline } from 'antd';
import { queryShippingDetail } from '@/services/order';


declare interface IShippingModalProps {
    pdd_order_sn?:string;
    main_url?:string;
    onClose:()=>void;
    visible:boolean;
}

declare interface IDetail {
    pdd_order_sn?:string;
    shipping_tracking_number?:string;
    shipping_carrier?:string;
    traces?:Array<{
        info:string;
        time:string;
        status:string;
        statusTag:string;
        subStatus:string;
        clearanceDesc:string;
        trackEvents:string;
        trackJump:string;
    }>
}

const ShippingModal:React.FC<IShippingModalProps> = ({visible,pdd_order_sn,onClose,main_url})=>{
    const [detail,setDetail] = useState<IDetail>({});
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
        if(visible){
            setLoading(true);
            // query
            queryShippingDetail(pdd_order_sn!).then(({data:{shippingData={}}})=>{
                setDetail(shippingData);
            }).finally(()=>{
                setLoading(false);
            });
        }
    },[visible]);

    return useMemo(()=>{
        const detailProps = detail.pdd_order_sn===pdd_order_sn?detail:{};
        const {shipping_carrier,shipping_tracking_number,traces=[]} = detailProps;
        return (
            <Modal visible={visible} title={
                <div>
                    <img className="track-img" src={main_url}/>
                    <div className="track-info">
                        <div className="">{shipping_carrier}</div>
                        <div>快递单号：{shipping_tracking_number}</div>
                    </div>
                </div>
            } footer={null} onCancel={onClose}>
                <Spin spinning={loading}>
                    <div className="track-content">
                        {
                            !loading&&traces.length===0?<Empty />:(
                                <Timeline>
                                    {
                                        traces.map((trace,index)=>{
                                            const {info,time,status} = trace;
                                            return (
                                                <Timeline.Item key={index} color={index===0&&index<traces.length-1?undefined:"#ccc"}>
                                                    <div className={status === "SIGN"?"track-sign":""}>
                                                        <div>{info}</div>
                                                        <div className="track-time">{time}</div>
                                                    </div>
                                                </Timeline.Item>
                                            )
                                        })
                                    }
                                </Timeline>
                            )
                        }
                    </div>
                </Spin>
            </Modal>
        )
    },[visible,pdd_order_sn,detail,loading,main_url]);
};

export {ShippingModal};

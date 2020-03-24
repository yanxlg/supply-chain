import React, { useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import { getLogList } from '@/services/order';


const logStatusMap:{[key:string]:string} = {
    0:"待拍单",
    1:"拍单中",
    2:"拍单失败",
    3:"拍单完成",
};


const LogView:React.FC=()=>{
    const [dataSet,setDataSet] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        getLogList().then(({data:{list=[]}={}})=>{
            setDataSet(list);
        }).finally(()=>{
            setLoading(false);
        })
    },[]);

    const columns = useMemo(()=>{
        return [{
            title:"操作时间",
            dataIndex:"create_time",
            align:"center"
        },{
            title:"当前状态",
            dataIndex:"status",
            align:"center",
            render:(_:string)=>logStatusMap[_]
        },{
            title:"总提交数",
            dataIndex:"all_submit",
            align:"center"
        },{
            title:"有效订单",
            dataIndex:"can_purchase_sum",
            align:"center"
        },{
            title:"待拍单",
            dataIndex:"wait_sum",
            align:"center"
        },{
            title:"拍单成功",
            dataIndex:"success_sum",
            align:"center"
        },{
            title:"拍单失败",
            dataIndex:"fail_sum",
            align:"center"
        }]
    },[]);

    return useMemo(()=>{
        return <Table loading={loading} columns={columns} dataSource={dataSet} pagination={false}/>
    },[loading]);
};

export default LogView;

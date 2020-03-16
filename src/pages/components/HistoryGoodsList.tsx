import React from 'react';
import { Table } from 'antd';
import { queryHistoryList } from '@/services/order';
import { ColumnProps } from 'antd/es/table';

declare interface IItem {
    pdd_goods_id:string;
    pdd_sku_id:string;
}

const columns:ColumnProps<IItem>[] = [{
    title:"序号",
    dataIndex:"",
    render:(_,record,index)=>{
        return index+1;
    }
},{
    title:"pdd goods id",
    dataIndex:"pdd_goods_id"
},{
    title:"pdd sku id",
    dataIndex:"pdd_sku_id"
}];

declare interface HistoryGoodsListProps {
    saleOrderGoodsSn?:string;
}

declare interface IHistoryGoodsListState {
    list:IItem[];
    loading:boolean;
}

class HistoryGoodsList extends React.PureComponent<HistoryGoodsListProps,IHistoryGoodsListState>{
    constructor(props:HistoryGoodsListProps) {
        super(props);
        this.state={
            list:[],
            loading:true
        }
    }
    componentDidMount(): void {
        const {saleOrderGoodsSn} = this.props;
        queryHistoryList(saleOrderGoodsSn!).then(({data:{list=[]}={}}={})=>{
            this.setState({
                list
            })
        }).finally(()=>{
            this.setState({
                loading:false
            })
        });
    }

    render(){
        const {list,loading} = this.state;
        return (
            <Table loading={loading} columns={columns} dataSource={list} pagination={false}/>
        )
    }
}

export default HistoryGoodsList;

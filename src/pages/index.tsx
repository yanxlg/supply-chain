import React from 'react';
import moment from "moment";

import '../styles/index.less';

import { Button, Card, Input, DatePicker, Select, Pagination, Divider, Table, Checkbox } from 'antd';
import { BindAll } from 'lodash-decorators';


const columns = [
    {
        title: '序号',
        width: "100px",
        dataIndex: 'key',
        key: 'name',
        fixed: 'left',
        align: 'center',
    },
    {
        title: '订单时间',
        width: "126px",
        dataIndex: 'name',
        key: 'time',
        align: 'center',
    },
    {
        title: '订单ID',
        dataIndex: 'address',
        key: '1',
        width: "178px",
        align: 'center',
    },
    {
        title: '商品ID',
        dataIndex: 'address',
        key: '2',
        width: "182px",
        align: 'center',
    },
    {
        title: '商品图片',
        dataIndex: 'address',
        key: '3',
        width: "106px",
        align: 'center',
        render: () => <img className="goods-image"/>
    },
    {
        title: '商品信息',
        dataIndex: 'address',
        key: '4',
        width: "121px",
        align: 'center',
    },
    {
        title: 'Sku',
        dataIndex: 'address',
        key: '5',
        width: "223px",
        align: 'center',
    },
    {
        title: '数量',
        dataIndex: 'address',
        key: '6',
        width: "100px",
        align: 'center',
    },
    {
        title: '实付',
        dataIndex: 'address',
        key: '7',
        width: "105px",
        align: 'center',
    },
    {
        title: '拍单价',
        dataIndex: 'address',
        key: '8',
        width:"105px",
        align: 'center'
    },
    {
        title: '收入核算',
        dataIndex: 'address',
        key: '9',
        width:"105px",
        align: 'center'
    },
    {
        title: '订单状态',
        dataIndex: 'address',
        key: '10',
        width:"134px",
        align: 'center'
    },
    {
        title: '拍单状态',
        dataIndex: 'address',
        key: '11',
        width:"218px",
        align: 'center'
    },
    {
        title: '操作',
        key: 'operation',
        width: "105px",
        align: 'center',
        render: () => <Button type="link" className="button-link">拍单</Button>,
    },
    {
        title: '取消订单',
        key: 'cancel',
        width: "105px",
        align: 'center',
        render: () => <Button type="link" className="button-link">取消</Button>,
    },
    {
        title: '拍单时间',
        dataIndex: 'address',
        key: '12',
        width:"126px",
        align: 'center'
    },
    {
        title: '拍单订单号1',
        dataIndex: 'address',
        key: '13',
        width:"245px",
        align: 'center'
    },
    {
        title: '拍单运单号2',
        dataIndex: 'address',
        key: '14',
        width:"245px",
        align: 'center'
    },
    {
        title: '运单数量',
        dataIndex: 'address',
        key: '15',
        width:"105px",
        align: 'center'
    },
];

const data = [];
for (let i = 0; i < 20; i++) {
    data.push({
        key: i,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}


declare interface IIndexState {
    patting:boolean;
    patLength?:number;
    patAccess?:number;
    pddAccount?:string;
    storeAccount?:string;
    sn?:string;
    order?:string;
    trackingNumber?:string;
    startDate?:string;
    endDate?:string;
    patState?:string;
    payState?:string;
    userName?:string;


    // 分页
    pageNumber:number;
    pageSize:number;
    total:number;

    patBtnLoading:boolean;// 拍单按钮loading
}

@BindAll()
class Index extends React.PureComponent<{},IIndexState> {
    private static showTotal(total: number) {
        return <span className="data-grid-total">共有{total}条</span>;
    }
    private static getCalendarContainer(triggerNode:Element){
        return triggerNode.parentElement!;
    }

    constructor(props:{}) {
        super(props);
        this.state={
            patting:false,
            pddAccount:"好挣钱",
            storeAccount:"好挣钱的店铺",
            userName:"Beauty",
            pageNumber:1,
            pageSize:100,
            total:20,
            patBtnLoading:false
        }
    }

    private onSNInput(e:React.ChangeEvent<HTMLTextAreaElement>){
        this.setState({
            sn:e.target.value
        })
    }
    private onOrderInput(e:React.ChangeEvent<HTMLTextAreaElement>){
        this.setState({
            order:e.target.value
        })
    }
    private onTrackingInput(e:React.ChangeEvent<HTMLTextAreaElement>){
        this.setState({
            trackingNumber:e.target.value
        })
    }
    private onStartDateChange(date:moment.Moment|null,dateString:string){
        this.setState({
            startDate:dateString
        });
    }
    private onEndDateChange(date:moment.Moment|null,dateString:string){
        this.setState({
            endDate:dateString
        });
    }
    private disabledStartDate(current:moment.Moment|null){
        const {endDate} = this.state;
        const end = endDate?moment(endDate):null;
        if(current){
            if(current > moment().endOf('day')){
                return true;
            }
            if(end&&current>end.endOf("day")){
                return true;
            }
        }
        return false;
    }
    private disabledEndDate(current:moment.Moment|null){
        const {startDate} = this.state;
        const start = startDate?moment(startDate):null;
        if(current){
            if(current > moment().endOf('day')){
                return true;
            }
            if(start&&current<start.startOf("day")){
                return true;
            }
        }
        return false;
    }
    private onPatStateChange(value:string){
        this.setState({
            patState:value
        })
    }
    private onPayStateChange(value:string){
        this.setState({
            payState:value
        })
    }
    private onPageChange(page:number,pageSize?:number){
        // 调用接口获取数据，然后更新
        alert(pageSize);
    }
    private onShowSizeChange(page:number,size:number){
        alert(size);
    }
    private patAction(){
        const {patting} = this.state;
        this.setState({
           patBtnLoading:true
        });
        if(patting){
            // 停止拍单
            new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve()
                },2000)
            }).then(()=>{
                this.setState({
                   patting:false,
                   patLength:100,
                   patAccess:90
                });
            }).finally(()=>{
                this.setState({
                    patBtnLoading:false
                })
            })
        }else{
            // 一键拍单
            new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve()
                },2000)
            }).then(()=>{
                this.setState({
                    patting:true,
                    patLength:100,
                    patAccess:10
                });
            }).finally(()=>{
                this.setState({
                    patBtnLoading:false
                })
            })
        }
    }
    render() {
        const rowSelection = {
            fixed: 'left',
            columnWidth: '100px',
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        };

        const {userName,patting,patAccess,patLength,patState,payState,pddAccount,sn,order,storeAccount,startDate,endDate,trackingNumber,pageNumber,pageSize,total,patBtnLoading} = this.state;
        return (
            <main className="main">
                <header className="header">
                    <div className="header-title">
                        供应链管理中台（简易版）
                    </div>
                    <div className="header-user">
                        Hi，{userName}
                    </div>
                </header>
                <div className="content">
                    <Card className="card">
                        <div className="card-item">
                            <label className="label-1">PDD账号：</label>
                            <span className="value-1">
                                {pddAccount}
                            </span>
                            <Button className="button-1">进入个人中心</Button>
                            <Button className="button-1 button-2" type={'primary'}>同步拍单信息</Button>
                        </div>
                        <div className="card-item">
                            <label className="label-1">商家账号：</label>
                            <span className="value-1">
                                {storeAccount}
                            </span>
                            <Button className="button-1" href="https://merchant.vova.com.hk/index.php?q=admin/main/systemNotification/index" target="_blank">进入商家后台</Button>
                        </div>
                    </Card>
                    <Card className="card">
                        <div className="textarea-wrap">
                            <label className="label-2">
                                Order SN：
                            </label>
                            <Input.TextArea value={sn} onChange={this.onSNInput} placeholder="041287b6b99385bf" className="textarea"/>
                        </div>
                        <div className="textarea-wrap">
                            <label className="label-2">
                                拍单订单号：
                            </label>
                            <Input.TextArea value={order} onChange={this.onOrderInput} placeholder="一行一个" className="textarea"/>
                        </div>
                        <div className="textarea-wrap">
                            <label className="label-2">
                                拍单运单号：
                            </label>
                            <Input.TextArea value={trackingNumber} onChange={this.onTrackingInput} placeholder="一行一个" className="textarea"/>
                        </div>
                        <div className="row">
                            <div className="input-item">
                                <label className="label-2">订单时间：</label>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabledDate={this.disabledStartDate}
                                    value={startDate?moment(startDate):null}
                                    onChange={this.onStartDateChange}
                                    getCalendarContainer={Index.getCalendarContainer}
                                    className="datepicker"
                                    placeholder="请选择"
                                />
                                <span className="datepicker-separator"/>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabledDate={this.disabledEndDate}
                                    value={endDate?moment(endDate):null}
                                    onChange={this.onEndDateChange}
                                    getCalendarContainer={Index.getCalendarContainer}
                                    className="datepicker"
                                    placeholder="请选择"
                                />
                            </div>
                            <div className="input-item">
                                <label className="label-2">拍单状态：</label>
                                <Select value={patState} placeholder="请选择" className="select" onChange={this.onPatStateChange}>
                                    <Select.Option value="">请选择</Select.Option>
                                </Select>
                            </div>
                            <div className="input-item">
                                <label className="label-2">支付状态：</label>
                                <Select value={payState} placeholder="请选择" className="select" onChange={this.onPayStateChange}>
                                    <Select.Option value="">请选择</Select.Option>
                                </Select>
                            </div>
                        </div>
                        <div className="row">
                            <Button type={'primary'} className="button-search">
                                搜索
                            </Button>
                            <Button className="button-refresh">
                                刷新
                            </Button>
                            <Button className="button-export">
                                导出数据
                            </Button>
                        </div>
                        <Divider className="divider"/>
                        <div className="relative">
                            {
                                patting&&(
                                    <label className="pat-status">
                                        拍单中 {patAccess}/{patLength}
                                    </label>
                                )
                            }
                            <Button loading={patBtnLoading} type={patting?'default':'primary'} className={patting?"button-outline":"button-search"} onClick={this.patAction}>
                                {patting?"停止拍单":"一键拍单"}
                            </Button>
                            <Button className="button-export">
                                一键支付
                            </Button>
                            {
                                !patting&&patLength&&patAccess&&(
                                    <label className="pat-result">
                                        拍单数量 {patLength}，拍单成功数量{patAccess}，拍单失败{patLength-patAccess}。
                                    </label>
                                )
                            }
                            <Pagination
                                className="pagination-inline pagination-right"
                                pageSize={pageSize}
                                current={pageNumber}
                                total={total}
                                pageSizeOptions={['100','200','500']}
                                onChange={this.onPageChange}
                                onShowSizeChange={this.onShowSizeChange}
                                showSizeChanger={true}
                                showQuickJumper={{
                                    goButton: <Button className="button-go">Go</Button>,
                                }}
                                showLessItems={true}
                                showTotal={Index.showTotal}
                            />
                        </div>
                        <Table
                            className="data-grid"
                            bordered={true}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={data}
                            scroll={{ x: 2834, y: 700 }}
                            pagination={false}
                        />
                        <div>
                            <Pagination
                                className="pagination-inline pagination-right"
                                pageSize={pageSize}
                                current={pageNumber}
                                total={total}
                                pageSizeOptions={['100','200','500']}
                                onChange={this.onPageChange}
                                onShowSizeChange={this.onShowSizeChange}
                                showSizeChanger={true}
                                showQuickJumper={{
                                    goButton: <Button className="button-go">Go</Button>,
                                }}
                                showLessItems={true}
                                showTotal={Index.showTotal}
                            />
                        </div>
                    </Card>
                </div>
            </main>
        );
    }
}

export default Index;

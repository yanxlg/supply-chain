import React from 'react';
import moment from 'moment';
import { Button, Card, Input, DatePicker, Select, Pagination, Divider, Table } from 'antd';
import { BindAll } from 'lodash-decorators';
import User from '@/storage/User';
import {
    filterOrder,
    modifyOrderInfo,
    cancelOrder,
    modifyMark,
    manualCreatePurchaseOrder,
    exportOrderList,
} from '@/services/order';
import { ColumnProps } from 'antd/lib/table';
import '../styles/index.less';


declare interface IDataItem {
    'confirm_time': string,
    'order_goods_sn': string,
    'vova_goods_id': string,
    'image_url': string,
    'goods_number': string,
    'sales_total_amount': string,
    'sales_currency': string,
    'purchase_total_amount': string,
    'purchase_currency': string,
    'sales_order_status': string,
    'sales_pay_status': string,
    'purchase_order_status': string,
    'purchase_pay_status': string,
    'purchase_pay_time': string,
    'pdd_order_sn': string,
    'pdd_order_time': string,
    'purchase_tracking_number': string,
    'style_values': string;
    purchase_shipping_status:string;

    purchase_order_remark: string;

    _purchase_tracking_number?: string;
    _purchase_order_remark?: string;
}


declare interface IIndexState {
    patting: boolean;
    patLength?: number;
    patAccess?: number;
    pddAccount?: string;
    storeAccount?: string;

    // form
    orderSns?: string;
    pddSkuIds?: string;
    pddOrderSns?: string;
    pddShippingNumbers?: string;
    pddOrderStatus: number;
    pddPayStatus: number;
    orderStatus: number;
    pddShippingStatus: number;
    orderStartTime?: string;
    orderEndTime?: string;
    pddOrderStartTime?: string;
    pddOrderEndTime?: string;


    // 分页
    pageNumber: number;
    pageSize: number;
    total: number;
    dataSet: IDataItem[];

    searchLoading: boolean;
    refreshLoading: boolean;
    exportLoading: boolean;
    dataLoading: boolean;
    updateTrackingNumberLoading: boolean;
    patBtnLoading: boolean;// 拍单按钮loading
    selectedRowKeys: number[];
}

@BindAll()
class Index extends React.PureComponent<{}, IIndexState> {
    private static showTotal(total: number) {
        return <span className="data-grid-total">共有{total}条</span>;
    }

    private static getCalendarContainer(triggerNode: Element) {
        return triggerNode.parentElement!;
    }

    constructor(props: {}) {
        super(props);
        this.state = {
            patting: false,
            pddAccount: '好挣钱',
            storeAccount: '好挣钱的店铺',
            pddOrderStatus: -1,
            pddPayStatus: -1,
            orderStatus: -1,
            pddShippingStatus: -1,
            pageNumber: 1,
            pageSize: 100,
            total: 0,
            patBtnLoading: false,
            dataLoading: false,
            searchLoading: false,
            refreshLoading: false,
            exportLoading: false,
            updateTrackingNumberLoading: false,
            dataSet: [],
            selectedRowKeys: [],
        };
    }

    componentDidMount(): void {
        this.onSearch();
    }

    private onOrderSnsInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            orderSns: e.target.value,
        });
    }

    private onPddSkuIdsInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            pddSkuIds: e.target.value,
        });
    }

    private onPddOrderSnsInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            pddOrderSns: e.target.value,
        });
    }

    private onPddShippingNumbersInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            pddShippingNumbers: e.target.value,
        });
    }

    private onOrderStartTimeChange(date: moment.Moment | null, dateString: string) {
        this.setState({
            orderStartTime: dateString,
        });
    }

    private onOrderEndTimeChange(date: moment.Moment | null, dateString: string) {
        this.setState({
            orderEndTime: dateString,
        });
    }

    private onPddOrderStartTimeChange(date: moment.Moment | null, dateString: string) {
        this.setState({
            pddOrderStartTime: dateString,
        });
    }

    private onPddOrderEndTimeChange(date: moment.Moment | null, dateString: string) {
        this.setState({
            pddOrderEndTime: dateString,
        });
    }

    private disabledStartDate(current: moment.Moment | null) {
        const { orderEndTime } = this.state;
        const end = orderEndTime ? moment(orderEndTime) : null;
        if (current) {
            if (current > moment().endOf('day')) {
                return true;
            }
            if (end && current > end.endOf('day')) {
                return true;
            }
        }
        return false;
    }

    private disabledEndDate(current: moment.Moment | null) {
        const { orderStartTime } = this.state;
        const start = orderStartTime ? moment(orderStartTime) : null;
        if (current) {
            if (current > moment().endOf('day')) {
                return true;
            }
            if (start && current < start.startOf('day')) {
                return true;
            }
        }
        return false;
    }

    private disabledPddStartDate(current: moment.Moment | null) {
        const { pddOrderEndTime } = this.state;
        const end = pddOrderEndTime ? moment(pddOrderEndTime) : null;
        if (current) {
            if (current > moment().endOf('day')) {
                return true;
            }
            if (end && current > end.endOf('day')) {
                return true;
            }
        }
        return false;
    }

    private disabledPddEndDate(current: moment.Moment | null) {
        const { pddOrderStartTime } = this.state;
        const start = pddOrderStartTime ? moment(pddOrderStartTime) : null;
        if (current) {
            if (current > moment().endOf('day')) {
                return true;
            }
            if (start && current < start.startOf('day')) {
                return true;
            }
        }
        return false;
    }

    private onPddOrderStatus(value: string) {
        this.setState({
            pddOrderStatus: Number(value),
        });
    }

    private onOrderStatus(value: string) {
        this.setState({
            orderStatus: Number(value),
        });
    }

    private onPddPayStatus(value: string) {
        this.setState({
            pddPayStatus: Number(value),
        });
    }

    private onPddShippingStatus(value: string) {
        this.setState({
            pddShippingStatus: Number(value),
        });
    }

    private onPageChange(page: number, pageSize?: number) {
        this.onFilter({
            page: page,
            refreshLoading: false,
        }).finally(() => {

        });
    }

    private onShowSizeChange(page: number, size: number) {
        this.onFilter({
            page: page,
            refreshLoading: false,
            size: size,
        }).finally(() => {

        });
    }

    private onSearch() {
        this.setState({
            searchLoading: true,
        });
        this.onFilter({
            page: 1,
            refreshLoading: false,
        }).finally(() => {
            this.setState({
                searchLoading: false,
            });
        });
    }

    private onRefresh() {
        this.onFilter();
    }

    private onFilter({ page, refreshLoading = true, size }: { page: number; refreshLoading?: boolean; size?: number } = {
        page: this.state.pageNumber,
    }) {
        const {
            pageSize,
            pddShippingStatus,
            pddPayStatus,
            pddOrderStatus,
            orderStatus,
            pddOrderEndTime,
            pddOrderStartTime,
            orderEndTime,
            orderStartTime,
            pddSkuIds,
            orderSns,
            pddOrderSns,
            pddShippingNumbers,
        } = this.state;
        this.setState({
            dataLoading: true,
            refreshLoading: refreshLoading,
        });
        const nextPageSize = size || pageSize;
        return filterOrder({
            page: page,
            size: nextPageSize,
            pddShippingStatus,
            pddPayStatus,
            pddOrderStatus,
            orderStatus,
            pddOrderEndTime,
            pddOrderStartTime,
            orderEndTime,
            orderStartTime,
            pddSkuIds,
            orderSns,
            pddOrderSns,
            pddShippingNumbers,
        }).then(({ data: { list = [], total } }) => {
            this.setState({
                dataSet: list,
                total: total,
                pageNumber: page,
                pageSize: nextPageSize,
                selectedRowKeys:[]
            });
        }).finally(() => {
            this.setState({
                dataLoading: false,
                refreshLoading: false,
            });
        });
    }

    private patAction() {
        const { patting } = this.state;
        this.setState({
            patBtnLoading: true,
        });
        if (patting) {
            // 停止拍单  不做，代码保留
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            }).then(() => {
                this.setState({
                    patting: false,
                    patLength: 100,
                    patAccess: 90,
                });
            }).finally(() => {
                this.setState({
                    patBtnLoading: false,
                });
            });
        } else {
            // 一键拍单
            const { selectedRowKeys = [], dataSet = [] } = this.state;
            const salesOrderGoodsSns = dataSet.filter((_, index) => selectedRowKeys.indexOf(index) > -1).map((_) => _.order_goods_sn).join(',');
            manualCreatePurchaseOrder({
                salesOrderGoodsSns: salesOrderGoodsSns,
            }).then(() => {
      /*          this.setState({
                    patting: true,
                    patLength: 100,
                    patAccess: 10,
                });*/
            }).finally(() => {
                this.setState({
                    patBtnLoading: false,
                });
            });
        }
    }

    private onExport() {
        const {
            pddShippingStatus,
            pddPayStatus,
            pddOrderStatus,
            orderStatus,
            pddOrderEndTime,
            pddOrderStartTime,
            orderEndTime,
            orderStartTime,
            pddSkuIds,
            orderSns,
            pddOrderSns,
            pddShippingNumbers,
        } = this.state;
        this.setState({
            exportLoading: true,
        });
        exportOrderList({
            pddShippingStatus,
            pddPayStatus,
            pddOrderStatus,
            orderStatus,
            pddOrderEndTime,
            pddOrderStartTime,
            orderEndTime,
            orderStartTime,
            pddSkuIds,
            orderSns,
            pddOrderSns,
            pddShippingNumbers,
        }).then(() => {
            // 下载成功
        }).catch(() => {
            // 下载失败
        }).finally(() => {
            this.setState({
                exportLoading: false,
            });
        });
    }

    private updateTrackingNumber(record: IDataItem) {
        this.setState({
            updateTrackingNumberLoading: true,
        });
        modifyOrderInfo({
            purchaseTrackingNumber: record._purchase_tracking_number,
            salesOrderGoodsSn: record.order_goods_sn,
        }).then(() => {
            this.onFilter();
        }).finally(() => {
            this.setState({
                updateTrackingNumberLoading: false,
            });
        });
    }

    private modifyMark(record: IDataItem) {
        this.setState({
            dataLoading:true
        });
        modifyMark({
            salesOrderGoodsSn: record.order_goods_sn,
            remark: record._purchase_order_remark || '',
        }).then(() => {
            // 修改成功后刷新当前页面
            this.onFilter();
        }).catch(()=>{
            this.setState({
                dataLoading:false
            });
        });
    }

    private cancelOrder(record: IDataItem) {
        cancelOrder({
            salesOrderGoodsSn: record.order_goods_sn,
        }).then(() => {
            this.onFilter();
        });
    }

    private manualCreatePurchaseOrder(id: string) {
        manualCreatePurchaseOrder({
            salesOrderGoodsSns: id,
        }).then(() => {
            this.onFilter();
        });
    }

    private getColumns(): ColumnProps<IDataItem>[] {
        const { pageSize, pageNumber } = this.state;
        return [
            {
                title: '序号',
                width: '100px',
                dataIndex: 'index',
                fixed: 'left',
                align: 'center',
                render: (text: string, record: any, index: number) => index + 1 + pageSize * (pageNumber - 1),
            },
            {
                title: '订单时间',
                width: '126px',
                dataIndex: 'pdd_order_time',
                align: 'center',
            },
            {
                title: '订单ID',
                dataIndex: 'order_goods_sn',
                width: '178px',
                align: 'center',
            },
            {
                title: 'Goods id',
                dataIndex: 'vova_goods_id',
                width: '182px',
                align: 'center',
            },
            {
                title: 'sku id',
                dataIndex: 'pdd_sku',
                width: '223px',
                align: 'center',
            },
            {
                title: '商品图片',
                dataIndex: 'image_url',
                width: '106px',
                align: 'center',
                render: (img: string) => <img src={img} className="goods-image"/>,
            },
            {
                title: '商品信息',
                dataIndex: 'style_values',
                width: '200px',
                align: 'center',
            },
            {
                title: '数量',
                dataIndex: 'goods_number',
                width: '100px',
                align: 'center',
            },
            {
                title: '实付',
                dataIndex: 'sales_total_amount',
                width: '105px',
                align: 'center',
            },
            {
                title: '拍单价',
                dataIndex: 'purchase_total_amount',
                width: '105px',
                align: 'center',
            },
    /*        {
                title: '收入核算',
                dataIndex: 'purchase_total_amount',
                width: '105px',
                align: 'center',
            },*/
            {
                title: '供应链订单状态',
                dataIndex: 'sales_order_status',
                width: '134px',
                align: 'center',
                render: (text: string) =>{
                    const status = String(text);
                    return  status === '1' ? '已确认' : status === '2' ? '已取消' : ''
                },
            },
            {
                title: '采购订单状态',
                dataIndex: 'purchase_order_status',
                width: '134px',
                align: 'center',
                render: (text: string) => {
                    const status = String(text);
                    return status === '0' ? '未拍单' : status === '2' ? '已取消' : status === '4' ? '拍单失败' : status === '1' ? '已拍单' : ''
                },
            },
            {
                title: '采购支付状态',
                dataIndex: 'purchase_pay_status',
                width: '134px',
                align: 'center',
                render: (text: string) => {
                    const status = String(text);
                    return status === '0' ? '未支付' : status === '2' ? '已支付' : status === '31' ? '审核不通过完结' : status === '30' ? '待审核' : status === '3' ? '待退款' : status === '4' ? '已退款' : '';
                }
            },
            {
                title: '采购配送状态',
                dataIndex: 'purchase_shipping_status',
                width: '218px',
                align: 'center',
                render: (text: string) => {
                    const status = String(text);
                    return status === '0' ? '未发货' : status === '1' ? '已发货' : status === '2' ? '已签收' : '';
                }
            },
            {
                title: '操作',
                width: '105px',
                align: 'center',
                render: (text: any, record: IDataItem) => {
                    // 根据采购订单状态显示对应的按钮
                    // 未拍单=>显示拍单 已取消=>null 拍单失败=>重新拍单   已拍单=>null
                    // 采购支付状态：已退款 =>钱款去向
                    const payStatus = String(record.purchase_pay_status);
                    const orderStatus = String(record.purchase_order_status);
                    const shipStatus = String(record.purchase_shipping_status);
                    const saleStatus = String(record.sales_order_status);
                   /* if (payStatus === '4') {
                        return <Button type="link" className="button-link">钱款去向</Button>;
                    }*/
                   /* if(shipStatus === '1' || shipStatus === '2'){
                        return <Button type="link" className="button-link">物流配送</Button>;
                    }*/
                    if (orderStatus === '0') {
                        return <Button type="link" className="button-link"
                                       onClick={() => this.manualCreatePurchaseOrder(record.order_goods_sn)}>拍单</Button>;
                    }
                    if (orderStatus === '4' || saleStatus==='1' && orderStatus==='2') {
                        return <Button type="link" className="button-link"
                                       onClick={() => this.manualCreatePurchaseOrder(record.order_goods_sn)}>重新拍单</Button>;
                    }
                    return null;
                },
            },
            {
                title: '取消订单',
                width: '105px',
                align: 'center',
                render: (text: any, record: IDataItem) => {
                    const orderStatus = String(record.purchase_order_status);
                    const payStatus = String(record.purchase_pay_status);
                    return (orderStatus === '2' || payStatus === '2') ?
                        null :
                        <Button type="link" className="button-link" onClick={() => this.cancelOrder(record)}>取消</Button>;//已取消或者支付状态已支付 不显示
                },
            },
            {
                title: '采购时间',
                dataIndex: 'purchase_pay_time',
                width: '126px',
                align: 'center',
            },
            {
                title: '采购订单号',
                dataIndex: 'pdd_order_sn',
                width: '245px',
                align: 'center',
            },
            {
                title: '采购运单号',
                dataIndex: 'purchase_tracking_number',
                width: '245px',
                align: 'center',
                render: (value: string, record: IDataItem) => {
                    // 未拍单和已取消的不可编辑
                    const status = String(record.purchase_order_status);
                    const disabled = status === '0' || status === '2' || status === '4';
                    const { updateTrackingNumberLoading } = this.state;
                    return (
                        <div className="data-grid-edit-wrap">
                            <Input.TextArea
                                disabled={disabled}
                                value={record._purchase_tracking_number || record.purchase_tracking_number}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    record._purchase_tracking_number = e.target.value;
                                    this.forceUpdate();
                                }}
                                className="textarea-edit"
                            />
                            {
                                record._purchase_tracking_number && !disabled ?
                                    <Button
                                        loading={updateTrackingNumberLoading}
                                        type="link" className="button-link data-grid-edit"
                                        onClick={() => this.updateTrackingNumber(record)}>保存</Button> : null
                            }
                        </div>
                    );
                },
            },
            {
                title: '备注',
                dataIndex: 'purchase_order_remark',
                width: '245px',
                align: 'center',
                render: (value: string, record: IDataItem) => {
                    return (
                        <div className="data-grid-edit-wrap">
                            <Input.TextArea
                                value={record._purchase_order_remark || record.purchase_order_remark}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    record._purchase_order_remark = e.target.value;
                                    this.forceUpdate();
                                }}
                                className="textarea-edit"/>
                            {
                                record._purchase_order_remark &&
                                <Button type="link" className="button-link data-grid-edit" onClick={() => this.modifyMark(record)}>保存</Button>
                            }
                        </div>
                    );
                },
            },
        ];
    }

    private onSelectChange(selectedRowKeys: number[] | string[]) {
        this.setState({ selectedRowKeys: selectedRowKeys as number[] });
    };

    render() {
        const { exportLoading, searchLoading, refreshLoading, dataLoading, patting, patAccess, patLength, pddAccount, storeAccount, pageNumber, pageSize, total, patBtnLoading, orderStatus, pddOrderStatus, pddPayStatus, pddShippingStatus, pddShippingNumbers, pddOrderSns, pddSkuIds, orderSns, orderStartTime, orderEndTime, pddOrderStartTime, pddOrderEndTime, dataSet = [], selectedRowKeys } = this.state;
        const rowSelection = {
            fixed: true,
            columnWidth: '100px',
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <main className="main">
                <header className="header">
                    <div className="header-title">
                        供应链管理中台（简易版）
                    </div>
                    <div className="header-user">
                        Hi，{User.userName}
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
                            {/*<Button className="button-1 button-2" type={'primary'}>同步拍单信息</Button>*/}
                        </div>
                        <div className="card-item">
                            <label className="label-1">商家账号：</label>
                            <span className="value-1">
                                {storeAccount}
                            </span>
                            <Button className="button-1"
                                    href="https://merchant.vova.com.hk/index.php?q=admin/main/systemNotification/index"
                                    target="_blank">进入商家后台</Button>
                        </div>
                    </Card>
                    <Card className="card">
                        <div className="textarea-wrap">
                            <label className="label-2">
                                供应链订单 ID：
                            </label>
                            <Input.TextArea value={orderSns} onChange={this.onOrderSnsInput} placeholder="一行一个"
                                            className="textarea"/>
                        </div>
                        <div className="textarea-wrap">
                            <label className="label-2">
                                sku id：
                            </label>
                            <Input.TextArea value={pddSkuIds} onChange={this.onPddSkuIdsInput} placeholder="一行一个"
                                            className="textarea"/>
                        </div>
                        <div className="textarea-wrap">
                            <label className="label-2">
                                采购订单号：
                            </label>
                            <Input.TextArea value={pddOrderSns} onChange={this.onPddOrderSnsInput} placeholder="一行一个"
                                            className="textarea"/>
                        </div>
                        <div className="textarea-wrap">
                            <label className="label-2">
                                采购运单号：
                            </label>
                            <Input.TextArea value={pddShippingNumbers} onChange={this.onPddShippingNumbersInput}
                                            placeholder="一行一个" className="textarea"/>
                        </div>
                        <div className="row">
                            <div className="input-item">
                                <label className="label-2">供应链订单状态：</label>
                                <Select value={String(orderStatus)} placeholder="全部" className="select"
                                        onChange={this.onOrderStatus}>
                                    <Select.Option value="-1">全部</Select.Option>
                                    <Select.Option value="1">已确认</Select.Option>
                                    <Select.Option value="2">已取消</Select.Option>
                                </Select>
                            </div>
                            <div className="input-item">
                                <label className="label-2">采购订单状态：</label>
                                <Select value={String(pddOrderStatus)} placeholder="全部" className="select"
                                        onChange={this.onPddOrderStatus}>
                                    <Select.Option value="-1">全部</Select.Option>
                                    <Select.Option value="0">未拍单</Select.Option>
                                    <Select.Option value="2">已取消</Select.Option>
                                    <Select.Option value="4">拍单失败</Select.Option>
                                    <Select.Option value="1">已拍单</Select.Option>
                                </Select>
                            </div>
                            <div className="input-item">
                                <label className="label-2">采购支付状态：</label>
                                <Select value={String(pddPayStatus)} placeholder="全部" className="select"
                                        onChange={this.onPddPayStatus}>
                                    <Select.Option value="-1">全部</Select.Option>
                                    <Select.Option value="0">未支付</Select.Option>
                                    <Select.Option value="2">已支付</Select.Option>
                                    <Select.Option value="31">审核不通过完结</Select.Option>
                                    <Select.Option value="30">待审核</Select.Option>
                                    <Select.Option value="3">待退款</Select.Option>
                                    <Select.Option value="4">已退款</Select.Option>
                                </Select>
                            </div>
                            <div className="input-item">
                                <label className="label-2">采购配送状态：</label>
                                <Select value={String(pddShippingStatus)} placeholder="全部" className="select"
                                        onChange={this.onPddShippingStatus}>
                                    <Select.Option value="-1">全部</Select.Option>
                                    <Select.Option value="0">未发货</Select.Option>
                                    <Select.Option value="1">已发货</Select.Option>
                                    <Select.Option value="2">已签收</Select.Option>
                                </Select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-item">
                                <label className="label-2">订单时间：</label>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabledDate={this.disabledStartDate}
                                    value={orderStartTime ? moment(orderStartTime) : null}
                                    onChange={this.onOrderStartTimeChange}
                                    getCalendarContainer={Index.getCalendarContainer}
                                    className="datepicker"
                                    placeholder="请选择"
                                />
                                <span className="datepicker-separator"/>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabledDate={this.disabledEndDate}
                                    value={orderEndTime ? moment(orderEndTime) : null}
                                    onChange={this.onOrderEndTimeChange}
                                    getCalendarContainer={Index.getCalendarContainer}
                                    className="datepicker"
                                    placeholder="请选择"
                                />
                            </div>
                            <div className="input-item">
                                <label className="label-2">采购时间：</label>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabledDate={this.disabledPddStartDate}
                                    value={pddOrderStartTime ? moment(pddOrderStartTime) : null}
                                    onChange={this.onPddOrderStartTimeChange}
                                    getCalendarContainer={Index.getCalendarContainer}
                                    className="datepicker"
                                    placeholder="请选择"
                                />
                                <span className="datepicker-separator"/>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabledDate={this.disabledPddEndDate}
                                    value={pddOrderEndTime ? moment(pddOrderEndTime) : null}
                                    onChange={this.onPddOrderEndTimeChange}
                                    getCalendarContainer={Index.getCalendarContainer}
                                    className="datepicker"
                                    placeholder="请选择"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <Button loading={searchLoading} disabled={refreshLoading || dataLoading && !searchLoading}
                                    type={'primary'} className="button-search" onClick={this.onSearch}>
                                搜索
                            </Button>
                            <Button loading={refreshLoading} disabled={searchLoading || dataLoading && !refreshLoading}
                                    className="button-refresh" onClick={this.onRefresh}>
                                刷新
                            </Button>
                            <Button className="button-export" loading={exportLoading} onClick={this.onExport}>
                                导出数据
                            </Button>
                        </div>
                        <Divider className="divider"/>
                        <div className="relative">
                            {
                                patting && (
                                    <label className="pat-status">
                                        拍单中 {patAccess}/{patLength}
                                    </label>
                                )
                            }
                            <Button disabled={selectedRowKeys.length===0} loading={patBtnLoading} type={patting ? 'default' : 'primary'}
                                    className={patting ? 'button-outline' : 'button-search'} onClick={this.patAction}>
                                {patting ? '停止拍单' : '一键拍单'}
                            </Button>
                         {/*   <Button className="button-export">
                                一键支付
                            </Button>*/}
                            {
                                !patting && patLength && patAccess && (
                                    <label className="pat-result">
                                        拍单数量 {patLength}，拍单成功数量{patAccess}，拍单失败{patLength - patAccess}。
                                    </label>
                                )
                            }
                            <Pagination
                                className="pagination-inline pagination-right"
                                pageSize={pageSize}
                                current={pageNumber}
                                total={total}
                                pageSizeOptions={['100', '200', '500']}
                                onChange={this.onPageChange}
                                onShowSizeChange={this.onShowSizeChange}
                                showSizeChanger={true}
                                showQuickJumper={{
                                    goButton: <Button className="button-go">Go</Button>,
                                }}
                                showLessItems={true}
                                showTotal={Index.showTotal}
                                disabled={dataLoading}
                            />
                        </div>
                        <Table
                            rowKey="order_goods_sn"
                            className="data-grid"
                            bordered={true}
                            rowSelection={rowSelection}
                            columns={this.getColumns()}
                            dataSource={dataSet}
                            scroll={{ x: 2834, y: 700 }}
                            pagination={false}
                            loading={dataLoading}
                        />
                        <div>
                            <Pagination
                                className="pagination-inline pagination-right"
                                pageSize={pageSize}
                                current={pageNumber}
                                total={total}
                                pageSizeOptions={['100', '200', '500']}
                                onChange={this.onPageChange}
                                onShowSizeChange={this.onShowSizeChange}
                                showSizeChanger={true}
                                showQuickJumper={{
                                    goButton: <Button className="button-go">Go</Button>,
                                }}
                                showLessItems={true}
                                showTotal={Index.showTotal}
                                disabled={dataLoading}
                            />
                        </div>
                    </Card>
                </div>
            </main>
        );
    }
}

export default Index;

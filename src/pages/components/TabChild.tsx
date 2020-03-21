import React, { ReactText, RefObject } from 'react';
import moment from 'moment';
import { Button, Input, DatePicker, Select, Pagination, Divider, Table, Tooltip, message, Modal, Checkbox, Form } from 'antd';
import { BindAll } from 'lodash-decorators';
import QRCode from 'qrcode.react';
import {
    filterOrder,
    modifyOrderInfo,
    cancelOrder,
    modifyMark,
    manualCreatePurchaseOrder,
    exportOrderList, getOrderList, confirmPay, cancelSaleOrder, exportGoods, updateTag,
} from '@/services/order';
import { ColumnProps } from 'antd/lib/table';
import '../../styles/index.less';
import { ShippingModal } from './ShippingModal';
import HistoryGoodsList from '@/pages/components/HistoryGoodsList';
import BeatServiceModal from '@/pages/components/BeatServiceModal';
import ExportModal from '@/pages/components/ExportModal';
import { FormInstance } from 'antd/es/form';


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
    purchase_shipping_status: string;
    pdd_parent_order_sn: string;
    purchase_order_remark: string;
    purchase_order_desc?:string;
    pdd_sku:string;

    _purchase_tracking_number?: string;
    _purchase_order_remark?: string;
    payStatus?: 1 | 2 | 3;

    show_history:0|1;
    show_reorder:0|1;
    purchase_order_goods_id:string;
}


declare interface IStatusMap {
    [key: string]: string;
}

declare interface IStoreMap{
    [key: string]: string;
}

declare interface IStatesItem {
    key: string;
    value: string;
}


export declare interface IStoreItem{
    key: string;
    value: string;
}

declare interface IIndexState {
    patting: boolean;
    patLength?: number;
    patAccess?: number;
    pddAccount?: string;
    merchantAccount?: string;
    pddUrl?: string;
    merchantUrl?: string;

    // form
    orderSns?: string;
    pddSkuIds?: string;
    pddOrderSns?: string;
    pddParentOrderSn?: string;
    pddShippingNumbers?: string;
    pddOrderStatus: number;
    pddPayStatus: number;
    pddOrderCancelType: number;
    orderStatus: number;
    pddShippingStatus: number;
    orderStartTime?: string;
    orderEndTime?: string;
    pddOrderStartTime?: string;
    pddOrderEndTime?: string;
    vovaGoodsIds?: string;
    shopName?:string;
    pddGoodsId?:string;
    tagType:number;


    // 分页
    pageNumber: number;
    pageSize: number;
    total: number;
    dataSet: IDataItem[];

    searchLoading: boolean;
    refreshLoading: boolean;
    exportLoading: boolean;
    exportLoading1: boolean;
    dataLoading: boolean;
    updateTrackingNumberLoading: boolean;
    patBtnLoading: boolean;// 拍单按钮loading
    cancelPatBtnLoading: boolean;
    cancelSaleBtnLoading: boolean;
    selectedRowKeys: string[];


    orderStatusList: IStatesItem[];
    orderStatusMap: IStatusMap;
    pddOrderStatusList: IStatesItem[];
    pddOrderStatusMap: IStatusMap;
    pddPayStatusList: IStatesItem[];
    pddPayStatusMap: IStatusMap;
    pddShippingStatusList: IStatesItem[];
    pddShippingStatusMap: IStatusMap;
    storeList:IStoreItem[];
    storeMap:IStoreMap;
    failureReasonMap:IStatusMap;
    failureReasonList:IStatesItem[];
    tagMap:IStatusMap;
    tagList:IStatesItem[];


    pddCancelReasonList: IStatesItem[];
    pddCancelReasonMap: IStatusMap;

    showMoreSearch: boolean;

    trackModalId: {
        pdd_order_sn?: string;
        image_url?: string;
        visible: boolean;
    };

    historyVisible:boolean;
    historySaleOrderGoodsSn?:string;
    beatModal:boolean;
    beatPurchaseOrderGoodsId?:string;
    beatSaleOrderGoodsSn?:string;

    exportModal:boolean;
}

declare interface ITabChildProps {
    tabType: 0 | 1 | 2 | 3 | 4;// 不同类型
    setAllTotal: (allTotal: number) => void;
    setPayTotal: (payTotal: number) => void;
}

@BindAll()
class TabChild extends React.PureComponent<ITabChildProps, IIndexState> {
    private static showTotal(total: number) {
        return <span className="data-grid-total">共有{total}条</span>;
    }

    private static getCalendarContainer(triggerNode: Element) {
        return triggerNode.parentElement!;
    }

    constructor(props: ITabChildProps) {
        super(props);
        this.state = {
            patting: false,
            pddAccount: '',
            merchantAccount: '',
            pddOrderStatus: -1,
            pddPayStatus: -1,
            pddOrderCancelType: -1,
            orderStatus: -1,
            pddShippingStatus: -1,
            tagType:-1,
            pageNumber: 1,
            pageSize: 100,
            total: 0,
            shopName:"",
            pddGoodsId:"",
            patBtnLoading: false,
            cancelPatBtnLoading: false,
            cancelSaleBtnLoading: false,
            dataLoading: false,
            searchLoading: false,
            refreshLoading: false,
            exportLoading: false,
            exportLoading1: false,
            updateTrackingNumberLoading: false,
            dataSet: [],
            selectedRowKeys: [],
            orderStatusList: [],
            pddOrderStatusList: [],
            pddPayStatusList: [],
            pddShippingStatusList: [],
            pddCancelReasonList: [],
            failureReasonList:[],
            tagList:[],
            storeList:[],
            orderStatusMap: {},
            pddOrderStatusMap: {},
            pddPayStatusMap: {},
            pddShippingStatusMap: {},
            pddCancelReasonMap: {},
            storeMap:{},
            failureReasonMap:{},
            tagMap:{},
            showMoreSearch: false,
            trackModalId: {
                visible: false,
            },
            historyVisible:false,
            beatModal:false,
            exportModal:false
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

    private onPddGoodsIdsInput(e: React.ChangeEvent<HTMLTextAreaElement>){
        this.setState({
            pddGoodsId: e.target.value,
        });
    }

    private onPddOrderSnsInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            pddOrderSns: e.target.value,
        });
    }

    private onpddParentOrderSnInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            pddParentOrderSn: e.target.value,
        });
    }

    private onPddShippingNumbersInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            pddShippingNumbers: e.target.value,
        });
    }

    private onVovaGoodsIdInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            vovaGoodsIds: e.target.value,
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

    private onPddCancelReason(value: string) {
        this.setState({
            pddOrderCancelType: Number(value),
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

    private objToArr(obj: IStatusMap) {
        let arr: IStatesItem[] = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push({
                    key: String(key),
                    value: obj[key],
                });
            }
        }
        return arr.sort((prev: IStatesItem, next: IStatesItem) => Number(prev.key) < Number(next.key) ? -1 : 1);
    }

    private onSearch() {
        this.setState({
            searchLoading: true,
            dataLoading: true,
        });
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
            vovaGoodsIds,
            pddParentOrderSn,
            pddOrderCancelType,
            shopName,
            pddGoodsId,
            tagType
        } = this.state;
        const { tabType } = this.props;
        return getOrderList({
            page: 1,
            size: pageSize,
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
            vovaGoodsIds,
            pddParentOrderSn,
            tabType,
            pddOrderCancelType,
            pddGoodsId,
            pddGoodsTag:tagType,
            merchant_id:shopName,
        }).then(({ data: { list = [], total, allTotal = 0, payTotal = 0, orderStatusList = {}, pddGoodsTagList={},pddOrderStatusList = {},merchantShop={}, pddPayStatusList = {}, pddShippingStatusList = {}, pddOrderCancelTypeList: pddCancelReasonList = {}, accountInfo: { pddAccount = '', merchantAccount = '', pddUrl = '', merchantUrl = '' } = {} } }) => {
            const orderStatusArr = this.objToArr(orderStatusList);
            const pddOrderStatusArr = this.objToArr(pddOrderStatusList);
            const pddPayStatusArr = this.objToArr(pddPayStatusList);
            const pddShippingStatusArr = this.objToArr(pddShippingStatusList);
            const pddCancelReasonArr = this.objToArr(pddCancelReasonList);
            const storeArr = this.objToArr(merchantShop);
            const tagArr = this.objToArr(pddGoodsTagList);
            this.setState({
                dataSet: list,
                total: total,
                pageNumber: 1,
                selectedRowKeys: [],
                pddAccount,
                merchantAccount,
                pddUrl,
                merchantUrl,
                storeMap:merchantShop,
                storeList:storeArr,
                tagMap:pddGoodsTagList,
                tagList:tagArr,
                orderStatusList: orderStatusArr,
                pddOrderStatusList: pddOrderStatusArr,
                pddPayStatusList: pddPayStatusArr,
                pddShippingStatusList: pddShippingStatusArr,
                pddCancelReasonList: pddCancelReasonArr,
                orderStatusMap: orderStatusList,
                pddOrderStatusMap: pddOrderStatusList,
                pddPayStatusMap: pddPayStatusList,
                pddCancelReasonMap: pddCancelReasonList,
                pddShippingStatusMap: pddShippingStatusList,
            });
            this.props.setAllTotal(allTotal);
            this.props.setPayTotal(payTotal);
        }).finally(() => {
            this.setState({
                dataLoading: false,
                searchLoading: false,
            });
        });
    }


    private toggleMoreForm() {
        this.setState({
            showMoreSearch: !this.state.showMoreSearch,
        });
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
            vovaGoodsIds,
            pddParentOrderSn,
            pddOrderCancelType,
            shopName,
            pddGoodsId,
            tagType
        } = this.state;
        const { tabType } = this.props;
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
            vovaGoodsIds,
            pddParentOrderSn,
            tabType,
            pddGoodsId,
            pddOrderCancelType,
            pddGoodsTag:tagType,
            merchant_id:shopName,
        }).then(({ data: { list = [], total, allTotal = 0, payTotal = 0, accountInfo: { pddAccount = '', merchantAccount = '', pddUrl = '', merchantUrl = '' } = {} } }) => {
            this.setState({
                dataSet: list,
                total: total,
                pageNumber: page,
                pageSize: nextPageSize,
                selectedRowKeys: [],
                pddAccount,
                merchantAccount,
                pddUrl,
                merchantUrl,
            });
            this.props.setAllTotal(allTotal);
            this.props.setPayTotal(payTotal);
        }).finally(() => {
            this.setState({
                dataLoading: false,
                refreshLoading: false,
            });
        });
    }


    private onCancelPadOrder() {
        const { selectedRowKeys } = this.state;
        this.setState({
            cancelPatBtnLoading: true,
        });
        cancelOrder({
            salesOrderGoodsSn: selectedRowKeys.join(','),
        }).then(({ message: msg }) => {
            message.success(msg);
            this.onFilter();
        }).finally(() => {
            this.setState({
                cancelPatBtnLoading: false,
            });
        });
    }

    private onCancelSaleOrder() {
        const { selectedRowKeys } = this.state;
        this.setState({
            cancelSaleBtnLoading: true,
        });
        cancelSaleOrder(selectedRowKeys.join(',')).then(({ message: msg }) => {
            message.success(msg);
            this.onFilter();
        }).finally(() => {
            this.setState({
                cancelSaleBtnLoading: false,
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
            const { selectedRowKeys = [] } = this.state;
            manualCreatePurchaseOrder({
                salesOrderGoodsSns: selectedRowKeys.join(','),
            }).then(() => {
                this.onFilter();
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
            vovaGoodsIds,
            pddParentOrderSn,
            pddOrderCancelType,
            shopName,
            pddGoodsId,
            tagType
        } = this.state;
        this.setState({
            exportLoading: true,
        });
        const { tabType } = this.props;
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
            vovaGoodsIds,
            pddParentOrderSn,
            tabType,
            merchant_id:shopName,
            pddGoodsId,
            pddOrderCancelType,
            pddGoodsTag:tagType,
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

    private onExportShop(){
        this.setState({
            exportLoading1:true
        });
        exportGoods().catch(()=>{
            message.error("导出失败!");
        }).finally(()=>{
            this.setState({
                exportLoading1:false
            })
        });

        //
        // this.setState({
        //     exportModal:true
        // })
    }
    private onExportCancel(){
        this.setState({
            exportModal:false
        })
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
            dataLoading: true,
        });
        modifyMark({
            salesOrderGoodsSn: record.order_goods_sn,
            remark: record._purchase_order_remark || '',
        }).then(() => {
            // 修改成功后刷新当前页面
            this.onFilter();
        }).catch(() => {
            this.setState({
                dataLoading: false,
            });
        });
    }


    private manualCreatePurchaseOrder(id: string) {
        manualCreatePurchaseOrder({
            salesOrderGoodsSns: id,
        }).then(() => {
            this.onFilter();
        });
    }

    private showShippingModal(record: IDataItem) {
        this.setState({
            trackModalId: {
                pdd_order_sn: record.pdd_order_sn,
                image_url: record.image_url,
                visible: true,
            },
        });
    }

    private closeShippingModal() {
        this.setState({
            trackModalId: {
                ...this.state.trackModalId,
                visible: false,
            },
        });
    }
    private addTag(tags:number[]|undefined,pddGoodsSkuId:string){
        const {tagList} = this.state;
        const ref:RefObject<FormInstance> = React.createRef();
        const edit = !!tags;
        Modal.info({
            icon:undefined,
            maskClosable:true,
           content:(
               <Form initialValues={{
                   tags:tags
               }} ref={ref}>
                   <Form.Item name="tags">
                       <Checkbox.Group>
                           {
                               tagList.map(({key,value})=>{
                                   if(key==="-1"){
                                       return null
                                   }
                                   return <Checkbox style={{margin:"5px 8px 5px 0"}} key={key} value={key}>{value}</Checkbox>
                               })}
                       </Checkbox.Group>
                   </Form.Item>
               </Form>
           ),
            onOk:()=>{
                const tags = ref.current!.getFieldValue("tags");
                return updateTag({tags,pddGoodsSkuId}).then(()=>{
                    message.success(edit?"修改成功":"添加成功");
                    this.onFilter();
                },()=>{
                    message.error(edit?"修改失败":"添加失败");
                });
            }
        });
    }

    private getColumns(): ColumnProps<IDataItem>[] {
        const { pageSize, pageNumber } = this.state;
        return [
            {
                title: '序号',
                width: '70px',
                dataIndex: 'index',
                fixed: 'left',
                align: 'center',
                render: (text: string, record: any, index: number) => index + 1 + pageSize * (pageNumber - 1),
            },
            {
                title: '销售时间',
                width: '126px',
                dataIndex: 'confirm_time',
                align: 'center',
            },
            {
                title: '销售订单ID',
                dataIndex: 'order_goods_sn',
                width: '178px',
                align: 'center',
            },
            {
                title: '店铺名称',
                dataIndex: 'merchant_id',
                width: '178px',
                align: 'center',
                render:(_,record)=>{
                    return this.state.storeMap[_];
                }
            },
            {
                title: 'vv Goods id',
                dataIndex: 'vova_goods_id',
                width: '182px',
                align: 'center',
            },
            {
                title: 'pdd goods id',
                dataIndex: 'pdd_goods_id',
                width: '223px',
                align: 'center',
            },
            {
                title: 'pdd sku id',
                dataIndex: 'pdd_sku',
                width: '223px',
                align: 'center',
                render:(_:string,record)=>{
                    const {show_history,show_reorder,order_goods_sn,purchase_order_goods_id} = record;
                    return (
                        <div>
                            {_}
                            {
                                Number(show_history)===1?<div><Button onClick={()=>{this.setState({
                                    historyVisible:true,
                                    historySaleOrderGoodsSn:order_goods_sn
                                })}}>历史商品</Button></div>:null
                            }
                            {
                                Number(show_reorder)===1?<div><Button onClick={()=>{
                                    this.setState({
                                        beatModal:true,
                                        beatSaleOrderGoodsSn:order_goods_sn,
                                        beatPurchaseOrderGoodsId:purchase_order_goods_id
                                    })
                                }}>相似款代拍</Button></div>:null
                            }
                        </div>
                    )
                }
            },
            {
                title: '商品图片',
                dataIndex: 'image_url',
                width: '106px',
                align: 'center',
                render: (img: string) => img ?
                    <Tooltip placement="right"
                             title={<img src={img.replace('150_150', '240_240')} className="goods-image-preview"/>}
                             overlayClassName="goods-image-tooltip">
                        <img src={img} className="goods-image"/>
                    </Tooltip> : null,
            },
            {
                title: '商品信息',
                dataIndex: 'style_values',
                width: '200px',
                align: 'center',
            },
            {
                title: '商品属性标签',
                dataIndex: 'tags',
                width: '200px',
                align: 'center',
                render:(tags:number[],record)=>{
                    const {tagMap} = this.state;
                    return (
                        <>
                            {tags.map(tag=>tagMap[tag]).join("、")}
                            <div>
                                {
                                    !tags||tags.length===0
                                        ?
                                        <Button type="link" onClick={()=>this.addTag(undefined,record.pdd_sku)}>添加标签</Button>:
                                        <Button type="link" onClick={()=>this.addTag(tags,record.pdd_sku)}>修改标签</Button>}
                            </div>
                        </>
                    )
                }
            },
            {
                title: '数量',
                dataIndex: 'goods_number',
                width: '100px',
                align: 'center',
            },
            {
                title: '预估运费',
                dataIndex: 'shipping_price',
                width: '105px',
                align: 'center',
            },
            {
                title: '销售价',
                dataIndex: 'sales_total_amount',
                width: '105px',
                align: 'center',
            },
            {
                title: '采购价',
                dataIndex: 'purchase_total_amount',
                width: '105px',
                align: 'center',
            },
            {
                title: 'vv二级分类',
                dataIndex: 'vova_cat_id',
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
                title: '销售订单状态',
                dataIndex: 'sales_order_status',
                width: '134px',
                align: 'center',
                render: (text: string) => {
                    const status = String(text);
                    const { orderStatusMap } = this.state;
                    return orderStatusMap[status] || '';
                },
            },
            {
                title: '采购订单状态',
                dataIndex: 'purchase_order_status',
                width: '134px',
                align: 'center',
                render: (text: string,record) => {
                    const status = String(text);
                    const { pddOrderStatusMap } = this.state;
                    const desc = record.purchase_order_desc;
                    return status === '4'?`${pddOrderStatusMap[status]}${desc?`:${record.purchase_order_desc}`:''}`:pddOrderStatusMap[status] || '';
                },
            },
            {
                title: '采购支付状态',
                dataIndex: 'purchase_pay_status',
                width: '134px',
                align: 'center',
                render: (text: string) => {
                    const status = String(text);
                    const { pddPayStatusMap } = this.state;
                    return pddPayStatusMap[status] || '';
                },
            },
            {
                title: '采购配送状态',
                dataIndex: 'purchase_shipping_status',
                width: '218px',
                align: 'center',
                render: (text: string, record: IDataItem) => {
                    const status = String(text);
                    const { pddShippingStatusMap } = this.state;
                    return (
                        <>
                            {pddShippingStatusMap[status] || ''}
                            {text === '1' ?
                                <div><Button onClick={() => this.showShippingModal(record)}>物流轨迹</Button></div> : null}
                        </>
                    );
                },
            }, {
                title: '采购取消原因',
                dataIndex: 'cancel_type',
                width: '140px',
                align: 'center',
                render: (text: string) => {
                    const status = String(text);
                    const { pddCancelReasonMap } = this.state;
                    return pddCancelReasonMap[status] || '';
                },
            },
            {
                title: '采购下单时间',
                dataIndex: 'pdd_order_time',
                width: '126px',
                align: 'center',
            },
            {
                title: '采购支付时间',
                dataIndex: 'purchase_pay_time',
                width: '126px',
                align: 'center',
            },
            {
                title: '采购父订单ID',
                dataIndex: 'pdd_parent_order_sn',
                width: '245px',
                align: 'center',
            },
            {
                title: '采购子订单ID',
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
                                <Button type="link" className="button-link data-grid-edit"
                                        onClick={() => this.modifyMark(record)}>保存</Button>
                            }
                        </div>
                    );
                },
            },
        ];
    }

    private confirmPay(record: IDataItem) {
        record.payStatus = 1;// 支付中
        this.forceUpdate();
        confirmPay(record.pdd_parent_order_sn).then(() => {
            this.onFilter();
        }).catch(() => {
            record.payStatus = 3;// 支付成功
            this.forceUpdate();
        });
    }

    private getPayColumns(): ColumnProps<IDataItem>[] {
        const { pageSize, pageNumber } = this.state;
        return [
            {
                title: '序号',
                width: '70px',
                dataIndex: 'index',
                fixed: 'left',
                align: 'center',
                render: (text: string, record: any, index: number) => index + 1 + pageSize * (pageNumber - 1),
            },
            {
                title: '采购时间',
                dataIndex: 'pdd_order_time',
                width: '126px',
                align: 'center',
            },
            {
                title: '采购父订单ID',
                dataIndex: 'pdd_parent_order_sn',
                width: '245px',
                align: 'center',
            },
            {
                title: '支付二维码',
                dataIndex: 'pay_url',
                align: 'center',
                width: '250px',
                render: (text: string, record: IDataItem) => {
                    const payedStatus = record.purchase_pay_status;
                    if (payedStatus === '2') {
                        return '已支付';
                    }
                    if (payedStatus === '0') {
                        const { payStatus } = record;
                        if (payStatus === 1) {
                            return '支付确认中，请稍后…';
                        }
                        if (payStatus === 2) {
                            return '已支付';
                        }
                        if (payStatus === 3) {
                            return (
                                <>
                                    <div>
                                        未支付成功，请重新支付
                                    </div>
                                    <Tooltip placement="right"
                                             title={<QRCode value={text} size={300} className="goods-image-preview"/>}
                                             overlayClassName="goods-image-tooltip">
                                        <QRCode value={text} size={40} className="qr-image"/>
                                    </Tooltip>
                                    <Button onClick={() => this.confirmPay(record)}>确认支付</Button>
                                </>
                            );
                        }
                        return (
                            <>
                                <Tooltip placement="right"
                                         title={<QRCode value={text} size={300} className="goods-image-preview"/>}
                                         overlayClassName="goods-image-tooltip">
                                    <QRCode value={text} size={40} className="qr-image"/>
                                </Tooltip>
                                <Button onClick={() => this.confirmPay(record)}>确认支付</Button>
                            </>
                        );
                    }
                },
            },
            {
                title: '采购子订单ID',
                dataIndex: 'pdd_order_sn',
                width: '245px',
                align: 'center',
            },
            {
                title: '采购价',
                dataIndex: 'purchase_total_amount',
                width: '105px',
                align: 'center',
            },
            {
                title: '采购支付状态',
                dataIndex: 'purchase_pay_status',
                width: '134px',
                align: 'center',
                render: (text: string) => {
                    const status = String(text);
                    const { pddPayStatusMap } = this.state;
                    return pddPayStatusMap[status] || '';
                },
            },
            {
                title: '采购订单状态',
                dataIndex: 'purchase_order_status',
                width: '134px',
                align: 'center',
                render: (text: string,record) => {
                    const status = String(text);
                    const { pddOrderStatusMap } = this.state;
                    const desc = record.purchase_order_desc;
                    return status === '4'?`${pddOrderStatusMap[status]}${desc?`:${record.purchase_order_desc}`:''}`:pddOrderStatusMap[status] || '';
                },
            },
            {
                title: '销售时间',
                width: '126px',
                dataIndex: 'confirm_time',
                align: 'center',
            },
            {
                title: '销售订单ID',
                dataIndex: 'order_goods_sn',
                width: '178px',
                align: 'center',
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
                                <Button type="link" className="button-link data-grid-edit"
                                        onClick={() => this.modifyMark(record)}>保存</Button>
                            }
                        </div>
                    );
                },
            },
        ];
    }

    private onSelectChange(selectedRowKeys: ReactText[]) {
        this.setState({ selectedRowKeys: selectedRowKeys as string[] });
    };

    private closeBeatModal(){
        this.setState({
            beatModal:false
        })
    }

    private onShopNameChange(value: string){
        this.setState({
            shopName:value
        })
    }
    render() {
        const { tabType } = this.props;
        const { tagList,tagType,exportLoading1,exportModal,pddCancelReasonList,pddGoodsId,shopName,storeList=[],beatModal,beatPurchaseOrderGoodsId,beatSaleOrderGoodsSn,historyVisible,historySaleOrderGoodsSn, trackModalId, pddOrderCancelType, pddParentOrderSn, showMoreSearch, vovaGoodsIds, orderStatusList, pddOrderStatusList, pddPayStatusList, pddShippingStatusList, exportLoading, searchLoading, refreshLoading, dataLoading, pageNumber, pageSize, total, patBtnLoading, cancelPatBtnLoading, cancelSaleBtnLoading, orderStatus, pddOrderStatus, pddPayStatus, pddShippingStatus, pddShippingNumbers, pddOrderSns, pddSkuIds, orderSns, orderStartTime, orderEndTime, pddOrderStartTime, pddOrderEndTime, dataSet = [], selectedRowKeys } = this.state;
        const rowSelection = {
            fixed: true,
            columnWidth: '50px',
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div>
                {
                    tabType ===0?(
                        <React.Fragment>
                            <div>
                                <div className="input-item">
                                    <label className="label-2">销售时间：</label>
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        disabledDate={this.disabledStartDate}
                                        value={orderStartTime ? moment(orderStartTime) : null}
                                        onChange={this.onOrderStartTimeChange}
                                        getPopupContainer={TabChild.getCalendarContainer}
                                        className="datepicker"
                                        placeholder="请选择"
                                    />
                                    <span className="datepicker-separator"/>
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        disabledDate={this.disabledEndDate}
                                        value={orderEndTime ? moment(orderEndTime) : null}
                                        onChange={this.onOrderEndTimeChange}
                                        getPopupContainer={TabChild.getCalendarContainer}
                                        className="datepicker"
                                        placeholder="请选择"
                                    />
                                </div>
                                <div className="input-item">
                                    <label className="label-2">店铺名称：</label>
                                    <Select value={String(shopName)} placeholder="全部" className="select"
                                            onChange={this.onShopNameChange}>
                                        <Select.Option value="">全部</Select.Option>
                                        {
                                            storeList.map((item) =>
                                                <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)
                                        }
                                    </Select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-item">
                                    <label className="label-2">销售订单状态：</label>
                                    <Select value={String(orderStatus)} placeholder="全部" className="select"
                                            onChange={this.onOrderStatus}>
                                        {orderStatusList.map((item) => <Select.Option key={item.key}
                                                                                      value={item.key}>{item.value}</Select.Option>)}
                                    </Select>
                                </div>
                                <div className="input-item">
                                    <label className="label-2">采购订单状态：</label>
                                    <Select value={String(pddOrderStatus)} placeholder="全部" className="select"
                                            onChange={this.onPddOrderStatus}>
                                        {pddOrderStatusList.map((item) => <Select.Option key={item.key}
                                                                                         value={item.key}>{item.value}</Select.Option>)}
                                    </Select>
                                </div>
                          {/*      <div className="input-item">
                                    <label className="label-2">拍单失败原因：</label>
                                    <Select value={String(pddOrderStatus)} placeholder="全部" className="select"
                                            onChange={this.onPddOrderStatus}>
                                        {pddOrderStatusList.map((item) => <Select.Option key={item.key}
                                                                                         value={item.key}>{item.value}</Select.Option>)}
                                    </Select>
                                </div>*/}
                                <div className="input-item">
                                    <label className="label-2">采购支付状态：</label>
                                    <Select value={String(pddPayStatus)} placeholder="全部" className="select"
                                            onChange={this.onPddPayStatus}>
                                        {pddPayStatusList.map((item) => <Select.Option key={item.key}
                                                                                       value={item.key}>{item.value}</Select.Option>)}
                                    </Select>
                                </div>
                                <div className="input-item">
                                    <label className="label-2">采购配送状态：</label>
                                    <Select value={String(pddShippingStatus)} placeholder="全部" className="select"
                                            onChange={this.onPddShippingStatus}>
                                        {pddShippingStatusList.map((item) => <Select.Option key={item.key}
                                                                                            value={item.key}>{item.value}</Select.Option>)}
                                    </Select>
                                </div>
                            </div>
                        </React.Fragment>
                    ):tabType===2?(
                        <div>
                            <div className="input-item">
                                <label className="label-2">采购时间：</label>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabledDate={this.disabledPddStartDate}
                                    value={pddOrderStartTime ? moment(pddOrderStartTime) : null}
                                    onChange={this.onPddOrderStartTimeChange}
                                    getPopupContainer={TabChild.getCalendarContainer}
                                    className="datepicker"
                                    placeholder="请选择"
                                />
                                <span className="datepicker-separator"/>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabledDate={this.disabledPddEndDate}
                                    value={pddOrderEndTime ? moment(pddOrderEndTime) : null}
                                    onChange={this.onPddOrderEndTimeChange}
                                    getPopupContainer={TabChild.getCalendarContainer}
                                    className="datepicker"
                                    placeholder="请选择"
                                />
                            </div>
                            <div className="textarea-wrap">
                                <label className="label-2">
                                    采购订单 ID：
                                </label>
                                <Input.TextArea value={pddOrderSns} onChange={this.onPddOrderSnsInput} placeholder="一行一个"
                                                className="textarea" rows={1}/>
                            </div>
                            <div className="textarea-wrap">
                                <label className="label-2">
                                    采购父订单 ID：
                                </label>
                                <Input.TextArea value={pddParentOrderSn} onChange={this.onpddParentOrderSnInput}
                                                placeholder="一行一个"
                                                className="textarea" rows={1}/>
                            </div>
                        </div>
                    ):null
                }
                <div className="row">
                    <Button loading={searchLoading} disabled={refreshLoading || dataLoading && !searchLoading}
                            type={'primary'} className="button-search" onClick={this.onSearch}>
                        搜索
                    </Button>
                    {
                        tabType === 2 ? null : (
                            <Button className="button-more" onClick={this.toggleMoreForm}>
                                更多搜索条件
                            </Button>
                        )
                    }
                    {/*<Button loading={refreshLoading} disabled={searchLoading || dataLoading && !refreshLoading}
                            className="button-refresh" onClick={this.onRefresh}>
                        刷新
                    </Button>*/}
                    <Button disabled={selectedRowKeys.length === 0} loading={patBtnLoading} className='button-refresh'
                            onClick={this.patAction}>
                        一键拍单
                    </Button>
                    <Button disabled={selectedRowKeys.length === 0} loading={cancelPatBtnLoading}
                            className="button-refresh" onClick={this.onCancelPadOrder}>
                        取消采购单
                    </Button>
                    <Button disabled={selectedRowKeys.length === 0} loading={cancelSaleBtnLoading}
                            className="button-refresh" onClick={this.onCancelSaleOrder}>
                        取消销售单
                    </Button>
                    <Button className="button-export" loading={exportLoading} onClick={this.onExport}>
                        导出数据
                    </Button>
                    {
                        tabType === 0?(
                            <Button className="button-export" loading={exportLoading1} onClick={this.onExportShop}>
                                导出店铺商品
                            </Button>
                        ):null
                    }
                </div>

                {
                    showMoreSearch ?
                        tabType === 0 ? (
                            <div className="search-more">
                                <div>
                                    <div className="textarea-wrap">
                                        <label className="label-2">
                                            销售订单 ID：
                                        </label>
                                        <Input.TextArea value={orderSns} onChange={this.onOrderSnsInput} placeholder="一行一个"
                                                        className="textarea" rows={1}/>
                                    </div>
                                    <div className="input-item input-item-next">
                                        <label className="label-2">采购时间：</label>
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            disabledDate={this.disabledPddStartDate}
                                            value={pddOrderStartTime ? moment(pddOrderStartTime) : null}
                                            onChange={this.onPddOrderStartTimeChange}
                                            getPopupContainer={TabChild.getCalendarContainer}
                                            className="datepicker"
                                            placeholder="请选择"
                                        />
                                        <span className="datepicker-separator"/>
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            disabledDate={this.disabledPddEndDate}
                                            value={pddOrderEndTime ? moment(pddOrderEndTime) : null}
                                            onChange={this.onPddOrderEndTimeChange}
                                            getPopupContainer={TabChild.getCalendarContainer}
                                            className="datepicker"
                                            placeholder="请选择"
                                        />
                                    </div>
                                    <div className="textarea-wrap margin-left-none">
                                        <label className="label-2">
                                            vv Goods id：
                                        </label>
                                        <Input.TextArea value={vovaGoodsIds} onChange={this.onVovaGoodsIdInput}
                                                        placeholder="一行一个" className="textarea" rows={1}/>
                                    </div>

                                    <div className="textarea-wrap">
                                        <label className="label-2">
                                            pdd sku id：
                                        </label>
                                        <Input.TextArea value={pddSkuIds} onChange={this.onPddSkuIdsInput}
                                                        placeholder="一行一个"
                                                        className="textarea" rows={1}/>
                                    </div>
                                    <div className="textarea-wrap">
                                        <label className="label-2">
                                            pdd goods id：
                                        </label>
                                        <Input.TextArea value={pddGoodsId} onChange={this.onPddGoodsIdsInput}
                                                        placeholder="一行一个"
                                                        className="textarea" rows={1}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="textarea-wrap">
                                        <label className="label-2">
                                            采购订单 ID：
                                        </label>
                                        <Input.TextArea value={pddOrderSns} onChange={this.onPddOrderSnsInput} placeholder="一行一个"
                                                        className="textarea" rows={1}/>
                                    </div>
                                    <div className="textarea-wrap">
                                        <label className="label-2">
                                            采购运单号：
                                        </label>
                                        <Input.TextArea value={pddShippingNumbers} onChange={this.onPddShippingNumbersInput}
                                                        placeholder="一行一个" className="textarea" rows={1}/>
                                    </div>
                                    <div className="textarea-wrap">
                                        <label className="label-2">
                                            采购父订单 ID：
                                        </label>
                                        <Input.TextArea value={pddParentOrderSn}
                                                        onChange={this.onpddParentOrderSnInput}
                                                        placeholder="一行一个"
                                                        className="textarea" rows={1}/>
                                    </div>
                                    <div className="input-item input-item-next">
                                        <label className="label-2">采购取消原因：</label>
                                        <Select value={String(pddOrderCancelType)} placeholder="全部" className="select"
                                                onChange={this.onPddCancelReason}>
                                            {pddCancelReasonList.map((item) => <Select.Option key={item.key}
                                                                                              value={item.key}>{item.value}</Select.Option>)}
                                        </Select>
                                    </div>
                                    <div className="input-item">
                                        <label className="label-2">商品属性标签：</label>
                                        <Select value={String(tagType)} placeholder="全部" className="select"
                                                onChange={(value: string) =>{
                                                    this.setState({
                                                        tagType: Number(value),
                                                    });
                                                }}>
                                            {tagList.map((item) => <Select.Option key={item.key}
                                                                                             value={item.key}>{item.value}</Select.Option>)}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        ) : null
                        : null
                }

                <Divider className="divider"/>
                <Table
                    rowKey="order_goods_sn"
                    className="data-grid"
                    bordered={true}
                    rowSelection={rowSelection}
                    columns={tabType === 2 ? this.getPayColumns() : this.getColumns()}
                    dataSource={dataSet}
                    scroll={{ x: 'max-content', y: 700 }}
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
                        showTotal={TabChild.showTotal}
                        disabled={dataLoading}
                    />
                </div>
                <ShippingModal visible={trackModalId.visible} main_url={trackModalId?.image_url}
                               pdd_order_sn={trackModalId?.pdd_order_sn} onClose={this.closeShippingModal}/>
               <Modal title="历史商品记录" footer={false} visible={historyVisible} destroyOnClose={true} onCancel={()=>{this.setState({
                   historyVisible:false
               })}}>
                   <HistoryGoodsList saleOrderGoodsSn={historySaleOrderGoodsSn}/>
               </Modal>
                <BeatServiceModal onSuccess={this.onFilter} visible={beatModal} purchaseOrderGoodsId={beatPurchaseOrderGoodsId} saleOrderGoodsSn={beatSaleOrderGoodsSn} onCancel={this.closeBeatModal}/>
                <ExportModal visible={exportModal} onCancel={this.onExportCancel} storeList={storeList}/>
            </div>
        );
    }
}

export default TabChild;

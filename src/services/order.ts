import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';
import Qs from "qs";

declare interface IBaseFilterProps {
    orderSns?: string;
    pddOrderSns?: string;
    pddShippingNumbers?: string;
    orderStartTime?: string;
    orderEndTime?: string;
    orderStatus?: number;
    pddOrderStatus?: number;
    pddPayStatus?: number;
    pddSkuIds?: string;
    pddOrderStartTime?: string;
    pddOrderEndTime?: string;
    pddShippingStatus?: number;
    vovaGoodsIds?:string;
    tabType?:0|1|2|3|4|5;
    pddParentOrderSn?:string;
    pddOrderCancelType?:number;
    merchant_id?:string;
    pddGoodsId?:string;
    pddGoodsTag?:number;
    purchaseOrderGoodsErrorCode?:string;
    purchaseOrderGoodsErrorMsg?:string;
}

declare interface IFilterProps extends IBaseFilterProps {
    page: number;
    size: number;
}

export async function getOrderList(params: IFilterProps) {
    return request.get(ApiPathEnum.GetOrderList, {
        requestType: 'form',
        params: params,
    });
}

export async function getLastLog() {
    return request.get(ApiPathEnum.QueryLastLog, {
        requestType: 'form',
    });
}

export async function getLogList() {
    return request.get(ApiPathEnum.QueryLogList, {
        requestType: 'form',
    });
}


export async function filterOrder(params: IFilterProps) {
    return request.get(ApiPathEnum.FilterOrder, {
        requestType: 'form',
        params: params,
    });
}

export async function modifyOrderInfo(params: { salesOrderGoodsSn: string; purchaseTrackingNumber?: string; }) {
    return request.post(ApiPathEnum.ModifyOrderInfo, {
        requestType: 'form',
        data: params,
    });
}

export async function cancelOrder(params: { salesOrderGoodsSn: string }) {
    return request.post(ApiPathEnum.CancelOrder, {
        requestType: 'form',
        data: params,
    });
}

export async function cancelSaleOrder(salesOrderGoodsSn:string) {
    return request.post(ApiPathEnum.CancelSaleOrder, {
        requestType: 'form',
        data: {salesOrderGoodsSn},
    });
}

export async function modifyMark(params: {
    salesOrderGoodsSn: string,
    remark: string
}) {
    return request.post(ApiPathEnum.ModifyMark, {
        requestType: 'form',
        data: params,
    });
}

export async function manualCreatePurchaseOrder(params:{salesOrderGoodsSns:string}) {
    return request.post(ApiPathEnum.ManualCreatePurchaseOrder, {
        requestType: 'form',
        data: params,
    });
}

export async function exportOrderList(params: IBaseFilterProps) {
    return request.get(ApiPathEnum.ExportOrder, {
        requestType: 'form',
        params: params,
        responseType:"blob",
        parseResponse:false
    }).then((response)=>{
        const disposition = response.headers.get('content-disposition');
        const fileName = decodeURI(disposition.substring(disposition.indexOf('filename=')+9, disposition.length));
        response.blob().then((blob:Blob)=>{
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
    });
}

export async function exportGoods() {
    return request.get(ApiPathEnum.ExportGoods, {
        requestType: 'form',
        responseType:"blob",
        parseResponse:false
    }).then((response)=>{
        const disposition = response.headers.get('content-disposition');
        const fileName = decodeURI(disposition.substring(disposition.indexOf('filename=')+9, disposition.length));
        response.blob().then((blob:Blob)=>{
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
    });
}


export async function confirmPay(pddParentOrderSn:string) {
    return request.post(ApiPathEnum.ConfirmPay,{
        requestType: 'form',
        data:{pddParentOrderSn}
    });
}


export async function queryShippingDetail(pdd_order_sn:string) {
    return request.get(ApiPathEnum.QueryTrack,{
        requestType: 'form',
        params:{
            pdd_order_sn
        }
    })
}


export async function queryHistoryList(saleOrderGoodsSn:string) {
    return request.post(ApiPathEnum.QueryHistoryList,{
        requestType: 'form',
        data:{
            saleOrderGoodsSn
        }
    })
}

export async function updatePurchaseOrder(data:{
    purchaseOrderGoodsId:string;
    saleOrderGoodsSn:string;
    goodsId:string;
    skuId:string
}) {
    return request.post(ApiPathEnum.UpdatePurchaseOrder,{
        requestType: 'form',
        data:data
    });
}


export async function updateTag({pddGoodsSkuId,tags}:{
    pddGoodsSkuId:string;
    tags:number[];
}) {
    return request.post(ApiPathEnum.UpdateTag,{
        requestType: 'form',
        data:{
            pddGoodsSkuId,
            tags:(tags||[]).join(",")
        },
    });
}

import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';

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

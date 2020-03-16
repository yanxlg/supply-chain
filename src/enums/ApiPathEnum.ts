enum ApiPathEnum {
    Login = '/api/login/login',
    GetOrderList="/api/order/list",
    FilterOrder="/api/order/filter",
    ExportOrder="/api/order/export",
    ModifyOrderInfo="/api/order/modifyPurchaseOrderInfo",
    CancelOrder="/api/order/cancelPurchaseOrder",
    ModifyMark="/api/order/modifyRemark",
    ManualCreatePurchaseOrder="/api/order/manualCreatePurchaseOrder",
    ConfirmPay = "/api/order/confirmPay",
    CancelSaleOrder = "/api/order/cancelSaleOrder",
    QueryTrack="/api/order/queryTrack",
    QueryHistoryList='/api/order/historyOrderList',
    UpdatePurchaseOrder='/api/order/changePurchaseOrder',
}

export { ApiPathEnum };

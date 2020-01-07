## 供应链接口

#### token：请求header头中加入X-Token

#### token验证不通过，返回http code 401

### 登陆

#### 请求url: /login/login

#### 请求方式: POST

#### 请求参数

| 参数     | 参数说明 | 参数类型 | 是否必须 | 参数值或者示例 |
| -------- | -------- | -------- | -------- | -------------- |
| username | 用户名   | String   | 是       | admin          |
| password | 密码     | String   | 是       | 123456         |

#### 返回参数

```json
{
    "code": "success",
    "message": "登陆成功",
    "data": {
        "token": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9zdXBwbHkudm92YS5jb20iLCJzdWIiOiJBdXRoIiwiYXVkIjoiMSIsImlhdCI6MTU3ODEwNjM4OSwibmJmIjoxNTc4MTA2Mzg5LCJleHAiOjE1NzgxOTI3ODl9.7KbRPLLZOq67bS7CXHD7miY0SvmBUFH_F3J1LgfHc0U"
    }
}
```

### 订单列表页

#### 请求url：/order/list

#### 请求参数：GET

| 参数               | 参数说明               | 参数类型 | 是否必须 | 参数值或者示例      |
| ------------------ | ---------------------- | -------- | -------- | ------------------- |
| orderSns           | 销售订单号             | String   | 否       | abc,def,ss          |
| pddOrderSns        | 拼多多订单号           | String   | 否       | 111,222,333         |
| pddShippingNumbers | 拼多多运单号           | String   | 否       | 111,222,333         |
| orderStartTime     | 确认订单查询开始时间   | DateTime | 否       | 2020-01-01 00:00:00 |
| orderEndTime       | 确认订单查询结束时间   | DateTime | 否       | 2020-01-02 00:00:00 |
| orderStatus        | 订单状态               | Integer  | 否       | -1                  |
| pddOrderStatus     | 拼多多订单状态         | Integer  | 否       | -1                  |
| pddPayStatus       | 拼多多支付状态         | Integer  | 否       | -1                  |
| pddSkuIds          | 拼多多sku id           | String   | 否       | 123,345,567         |
| pddOrderStartTime  | 拼多多订单查询开始时间 | DateTime | 否       | 2020-01-01 00:00:00 |
| pddOrderEndTime    | 拼多多订单查询结束时间 | DateTime | 否       | 2020-01-02 00:00:00 |
| pddShippingStatus  | 拼多多配送状态         | Integer  | 否       | -1                  |

#### 返回参数

```json
{
    "code": "success",
    "data": {
        "orderStatusList": {
            "-1": "全部",
            "0": "未确认",
            "1": "已确认",
            "2": "已取消"
        },
        "pddOrderStatusList": {
            "-1": "全部",
            "0": "未确认",
            "1": "已确认",
            "2": "已删除"
        },
        "pddPayStatusList": {
            "-1": "全部",
            "0": "未付款",
            "2": "已付款",
            "4": "已退款"
        },
        "pddShippingStatusList": {
            "-1": "全部",
            "0": "未发货",
            "1": "已发货",
            "2": "已妥投"
        },
        "list": [
            {
                "confirm_time": "1970-01-01 00:00:01",
                "order_goods_sn": "1",
                "vova_goods_id": "1",
                "pdd_sku": "440694009877",
                "image_url": "",
                "goods_number": "1",
                "sales_total_amount": "0.00",
                "sales_currency": "",
                "purchase_total_amount": "17.80",
                "purchase_currency": "CNY",
                "sales_order_status": "1", // 供应链订单状态
                "purchase_order_status": "0", // 采购订单状态
                "purchase_pay_status": "0", // 采购支付状态
                "purchase_pay_time": "0000-00-00 00:00:00", 
                "purchase_shipping_status": "0", // 采购配送状态
                "pdd_order_sn": "",
                "pdd_order_time": "0000-00-00 00:00:00",
                "purchase_tracking_number": "abcdefg",
                "style_values": "",
              	"purchase_order_desc": ""
            }
        ],
        "total": 8,
        "page": 1,
        "size": 20
    }
}
```

### 订单筛选

#### 请求url：order/filter

| 参数               | 参数说明               | 参数类型 | 是否必须 | 参数值或者示例      |
| ------------------ | ---------------------- | -------- | -------- | ------------------- |
| orderSns           | 销售订单号             | String   | 否       | abc,def,ss          |
| pddOrderSns        | 拼多多订单号           | String   | 否       | 111,222,333         |
| pddShippingNumbers | 拼多多运单号           | String   | 否       | 111,222,333         |
| orderStartTime     | 确认订单查询开始时间   | DateTime | 否       | 2020-01-01 00:00:00 |
| orderEndTime       | 确认订单查询结束时间   | DateTime | 否       | 2020-01-02 00:00:00 |
| orderPayStatus     | 订单状态               | Integer  | 否       | -1                  |
| pddOrderStatus     | 拼多多订单状态         | Integer  | 否       | -1                  |
| pddPayStatus       | 拼多多支付状态         | Integer  | 否       | -1                  |
| pddSkuIds          | 拼多多sku id           | String   | 否       | 123,345,567         |
| pddOrderStartTime  | 拼多多订单查询开始时间 | DateTime | 否       | 2020-01-01 00:00:00 |
| pddOrderEndTime    | 拼多多订单查询结束时间 | DateTime | 否       | 2020-01-02 00:00:00 |
| pddShippingStatus  | 拼多多配送状态         | Integer  | 否       | -1                  |
| page               | 第几页                 | Integer  | 否       | 1                   |
| size               | 每页多少条数据         | Integer  | 否       | 20                  |

#### 请求方式：GET

#### 返回参数

```json
{
    "code": "success",
    "data": {
        "list": [
            {
                "confirm_time": "1970-01-01 00:00:01",
                "order_goods_sn": "1",
                "vova_goods_id": "1",
                "pdd_sku": "440694009877",
                "image_url": "",
                "goods_number": "1",
                "sales_total_amount": "0.00",
                "sales_currency": "",
                "purchase_total_amount": "0.00",
                "purchase_currency": "",
                "sales_order_status": "1",
                "sales_pay_status": "0",
                "purchase_order_status": "4",
                "purchase_pay_status": "0",
                "purchase_pay_time": "0000-00-00 00:00:00",
                "pdd_order_sn": "",
                "pdd_order_time": "0000-00-00 00:00:00",
                "purchase_tracking_number": "abcdefg",
                "style_values": "",
              	"purchase_order_desc": ""
            }
        ],
        "total": 8,
        "page": 1,
        "size": 20
    }
}
```

### 订单导出

#### 请求url：order/export

#### 请求方式：POST

| 参数               | 参数说明               | 参数类型 | 是否必须 | 参数值或者示例      |
| ------------------ | ---------------------- | -------- | -------- | ------------------- |
| orderSns           | 销售订单号             | String   | 否       | abc,def,ss          |
| pddOrderSns        | 拼多多订单号           | String   | 否       | 111,222,333         |
| pddShippingNumbers | 拼多多运单号           | String   | 否       | 111,222,333         |
| orderStartTime     | 确认订单查询开始时间   | DateTime | 否       | 2020-01-01 00:00:00 |
| orderEndTime       | 确认订单查询结束时间   | DateTime | 否       | 2020-01-02 00:00:00 |
| orderPayStatus     | 订单状态               | Integer  | 否       | -1                  |
| pddOrderStatus     | 拼多多订单状态         | Integer  | 否       | -1                  |
| pddPayStatus       | 拼多多支付状态         | Integer  | 否       | -1                  |
| pddSkuIds          | 拼多多sku id           | String   | 否       | 123,345,567         |
| pddOrderStartTime  | 拼多多订单查询开始时间 | DateTime | 否       | 2020-01-01 00:00:00 |
| pddOrderEndTime    | 拼多多订单查询结束时间 | DateTime | 否       | 2020-01-02 00:00:00 |
| pddShippingStatus  | 拼多多配送状态         | Integer  | 否       | -1                  |

#### 返回参数

```json

```

### 修改采购订单信息

#### 请求url：order/modifyPurchaseOrderInfo

#### 请求方式: POST

| 参数                   | 参数说明   | 参数类型 | 是否必须 | 参数值或者示例 |
| ---------------------- | ---------- | -------- | -------- | -------------- |
| salesOrderGoodsSn      | 销售订单号 | String   | 是       | 123456         |
| purchaseTrackingNumber | 采购运单号 | String   | 是       | 123456         |

#### 返回参数

```json
{
    "code": "success",
    "message": "修改成功"
}
```

### 取消采购订单

#### 请求url：order/cancelPurchaseOrder

#### 请求方式:POST

| 参数              | 参数说明   | 参数类型 | 是否必须 | 参数值或者示例 |
| ----------------- | ---------- | -------- | -------- | -------------- |
| salesOrderGoodsSn | 销售订单号 | String   | 是       | 123456         |

#### 返回参数

```json
{
    "code": "success",
    "message": "取消成功"
}
```

### 手动拍单

#### 请求url：order/manualCreatePurchaseOrder

#### 请求方式：POST

| 参数               | 参数说明   | 参数类型 | 是否必须 | 参数值或者示例 |
| ------------------ | ---------- | -------- | -------- | -------------- |
| salesOrderGoodsSns | 销售订单号 | String   | 是       | 123,456,789    |

#### 返回参数

```json
{
    "code": "success",
    "message": "拍单中"
}
```

### 添加或修改备注

#### 请求url：order/modifyRemark

#### 请求方式：POST

| 参数              | 参数说明   | 参数类型 | 是否必须 | 参数值或者示例 |
| ----------------- | ---------- | -------- | -------- | -------------- |
| salesOrderGoodsSn | 销售订单号 | String   | 是       | 123            |
| remark            | 备注       | String   | 是       | 我是备注       |

#### 返回参数

```json
{
    "code": "success",
    "message": "修改成功"
}
```


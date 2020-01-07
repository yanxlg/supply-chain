import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据

const Mock = require('mockjs');

const list = Mock.mock({
    'data|100-500': [
        {
            confirm_time: '1970-01-01 00:00:01',
            order_goods_sn: '@increment',
            vova_goods_id: '@increment',
            image_url: '@image',
            pdd_sku: 'SKU_ID',
            goods_number: '@increment',
            sales_total_amount: '0.00',
            sales_currency: '0.00',
            purchase_total_amount: '0.00',
            purchase_currency: '0.00',
            sales_order_status: '1',
            sales_pay_status: '0',
            purchase_order_status: '4',
            purchase_pay_status: '0',
            purchase_pay_time: '0000-00-00 00:00:00',
            pdd_order_sn: '采购订单号',
            pdd_order_time: '0000-00-00 00:00:00',
            purchase_tracking_number: 'abcdefg',
            style_values: '@cparagraph',
            purchase_order_desc:'@cparagraph',
            purchase_shipping_status:1
        },
    ],
});


export default {
    'POST /order/filter': (req: Request, res: Response) => {
        const { page, size } = req.body;
        res.status(200).send({
                'code': 'success',
                'data': {
                    'list': list.data.slice(
                        Number(size) * Number(page-1),
                        Number(size) * (Number(page)),
                    ),
                    'total': list.data.length,
                    'page': 1,
                    'size': 100,
                },
            },
        );
    },
};

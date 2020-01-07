import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
    'POST /login/login': (req: Request, res: Response) => {
        res.status(200).send({
                "code": "success",
                "message": "登陆成功",
                "data": {
                    "token": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9zdXBwbHkudm92YS5jb20iLCJzdWIiOiJBdXRoIiwiYXVkIjoiMSIsImlhdCI6MTU3ODEwNjM4OSwibmJmIjoxNTc4MTA2Mzg5LCJleHAiOjE1NzgxOTI3ODl9.7KbRPLLZOq67bS7CXHD7miY0SvmBUFH_F3J1LgfHc0U"
                }
            }
        );
    },
};

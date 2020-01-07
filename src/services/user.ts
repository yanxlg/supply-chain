import request from '@/utils/request';
import { ApiPathEnum } from '@/enums/ApiPathEnum';

export async function userLogin(params: {username:string;password:string}) {
    return request.post(ApiPathEnum.Login, {
        requestType:"form",
        data:params,
        errorHandler:(error: { response: Response; data: any })=>Promise.reject(error.data),// 拦截掉handler处理
    });
}

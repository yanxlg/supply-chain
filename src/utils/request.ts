import { message, notification } from 'antd';
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend, RequestOptionsInit, ResponseError } from 'umi-request';
import { router } from 'umi';
import { parse, stringify } from 'querystring';
import User from '@/storage/User';

let messageQueue: string[] = []; // 消息队列 避免重复msg显示

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

const newMessage = (msg: string) => {
    if (!messageQueue.includes(msg)) {
        messageQueue.push(msg);
        message.error(msg, 3, () => {
            messageQueue = messageQueue.filter(one => one !== msg);
        });
    }
};

const codeMessage:{[key:number]:string} = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

export const apiCodeMessage = {
    success: "success",
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response; data: any }) => {
    const { response, data } = error;
    if (response && response.status) {
        if (response.status !== 200) {
            if(response.status === 401){
                const msg = '身份已过期，需要重新登录';
                newMessage(msg);
                const { redirect } = getPageQuery();
                if (window.location.pathname !== '/login' && !redirect) {
                    router.replace({
                        pathname: '/login',
                        search: stringify({
                            redirect: window.location.href,
                        }),
                    });
                }
            }else{
                const errorText = codeMessage[response.status] || response.statusText;
                const { status, url } = response;
                notification.error({
                    message: `请求错误 ${status}: ${url}`,
                    description: errorText,
                });
            }
        } else {
            if (!data || data.code !== apiCodeMessage.success) {
                const msg = (data && data.message) || '接口异常';
                newMessage(msg);
            }
            return Promise.reject(data); // 所有错误传递到onrejected中，业务层可以进一步处理
        }
    } else if (!response) {
        notification.error({
            description: '您的网络发生异常，无法连接服务器',
            message: '网络异常',
        });
    }
    return Promise.reject({
        status: response.status,
        msg: response.statusText,
    });
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
    errorHandler, // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.response.use(async (response: Response, options: RequestOptionsInit) => {
    if(!options.responseType||options.responseType==="json"){
        try {
            const data = await response.clone().json();
            // code !== 0 当作error处理
            if (!data || data.code !== apiCodeMessage.success) {
                // @ts-ignore
                return Promise.reject(new ResponseError<any>(response, 'data Error', data, null, 'DataError')); // invalid user 不传递到业务层
            }
            return response;
        } catch (error) {
            // @ts-ignore
            return Promise.reject(new ResponseError<any>(response, 'parse Error', null, null, 'ParseError')); // invalid user 不传递到业务层
        }
    }
    return response;
});


// 登录身份设置
request.interceptors.request.use(( url: string,options: RequestOptionsInit)=>{
    if(User.token){
        options.headers = Object.assign({},options.headers,{
            "X-Token":User.token
        });
    }
    return {
        url,
        options
    }
});

export default request;

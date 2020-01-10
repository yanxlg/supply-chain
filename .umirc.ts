import { IConfig } from 'umi-types';
const shajs = require('sha.js');

// ref: https://umijs.org/config/
const config: IConfig = {
    treeShaking: true,
    hash:true,
    cssLoaderOptions: {
        modules: false, // false 不起作用
        getLocalIdent: (
            context: {
                resourcePath: string;
            },
            _: string,
            localName: string,
        ) => {
            const { resourcePath } = context;
            if (/_[a-zA-Z\.\-_0-9]+\.less$/.test(resourcePath)) {
                const match = resourcePath.match(/src(.*)/);
                if (match && match[1]) {
                    const hash = shajs('sha256')
                        .update(resourcePath)
                        .digest('hex')
                        .substr(0, 8); //最大长度
                    return `${localName.replace(/([A-Z])/g, '-$1').toLowerCase()}_${hash}`;
                }
            }
            return localName;
        },
    },
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport: { webpackChunkName: true },
            title: '供应链管理中台',
            dll: true,
            locale: {
                enable: false,
                default: 'zh-CN',
                baseNavigator: false,
            },
            routes: {
                exclude: [
                    /models\//,
                    /services\//,
                    /model\.(t|j)sx?$/,
                    /service\.(t|j)sx?$/,
                    /components\//,
                ],
            },
        }],
    ],
    proxy: {
        '/api': {
            target: 'https://pos-t.vova.com.hk/',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
        },
    },
};

export default config;

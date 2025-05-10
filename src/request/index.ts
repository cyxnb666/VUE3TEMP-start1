import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { notification } from 'ant-design-vue';

// 配置axios默认值
axios.defaults.timeout = 30000;
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API;
// 返回状态码范围
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500;
};
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true;

// NProgress配置
NProgress.configure({
    showSpinner: false,
});

// HTTP request拦截
axios.interceptors.request.use(
    (config: any) => {
        NProgress.start(); // 开始进度条

        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['X-Access-Token'] = token;
        }

        // 添加时间戳到请求头
        const timestamp = Date.now();
        config.headers.timestamp = timestamp.toString();

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// HTTP response拦截
axios.interceptors.response.use(
    (res: any) => {
        NProgress.done(); // 结束进度条

        if (!res) return Promise.reject(new Error('请求失败'));

        const status = res.status || 200;

        // 验证码请求的特殊处理
        if (res.config?.url?.includes('/auth/getVerifyCode') && status === 200) {
            return Promise.resolve(res.data);
        }

        // blob 类型响应的处理
        if (res.config?.responseType === 'blob' && status === 200) {
            const contentType = res.headers['content-type'];

            // 图片类型直接返回 blob 对象
            if (contentType?.includes('image/')) {
                return Promise.resolve(res.data);
            }

            if (contentType?.includes('video/')) {
                return Promise.resolve(res.data);
            }

            // 通用 octet-stream 类型
            if (contentType?.startsWith('application/octet-stream')) {
                return Promise.resolve(res.data);
            }

            // 处理 zip 下载等情况
            if (contentType && (
                contentType.includes('application/zip') ||
                contentType.includes('application/x-zip-compressed')
            )) {
                const blob = new Blob([res.data], { type: contentType });
                if (res.config?.isDownload) {
                    const aLink = document.createElement('a');
                    aLink.style.display = 'none';
                    aLink.href = URL.createObjectURL(blob);
                    aLink.download = res.config.name || '下载文件.zip';
                    document.body.appendChild(aLink);
                    aLink.click();
                    document.body.removeChild(aLink);
                    URL.revokeObjectURL(aLink.href);
                    return Promise.resolve();
                }
                return Promise.resolve(blob);
            }

            // 可能是错误响应，尝试读取内容
            const reader = new FileReader();
            reader.readAsText(res.data, 'utf-8');

            return new Promise((resolve, reject) => {
                reader.onload = function (e: any) {
                    try {
                        const jsonData = JSON.parse(e.target.result);
                        if (jsonData && jsonData.code !== 200 && jsonData.code !== 0 && jsonData.code !== '0000') {
                            notification.error({
                                message: '提示',
                                description: jsonData.message || '请求异常',
                                duration: 3,
                            });
                            reject(jsonData.message || '请求异常');
                            return;
                        }
                    } catch (error) {
                        // 读取失败时直接返回原始 blob
                        resolve(res.data);
                        return;
                    }
                    resolve(res.data);
                };

                reader.onerror = function (error) {
                    console.error('FileReader error:', error);
                    reject(error);
                };
            });
        }

        // 处理HTTP错误状态码
        if (status !== 200) {
            notification.error({
                message: '系统提示',
                description: `服务器请求【${status}】异常，请联系管理员`,
                duration: 3,
            });
            return Promise.reject(new Error('接口异常'));
        }

        // 处理响应数据
        if (res.data instanceof Object) {
            const code = res.data.retCode;
            const msg = res.data.retMsg;
            const data = res.data.retData;

            // 处理成功响应
            if (code === 200 || code === 0 || code === '0000') {
                return Promise.resolve(data);
            }

            // 处理登录失效
            if (code === 401 || code === 403) {
                notification.error({
                    message: '登录提示',
                    description: '登录状态已过期，请重新登录',
                    duration: 3,
                });
                return Promise.reject('登录状态已过期，请重新登录');
            }

            // 处理其他错误情况
            notification.error({
                message: '提示',
                description: msg || '系统异常',
                duration: 3,
            });
            return Promise.reject(msg || '系统异常');
        }

        return Promise.resolve(res.data);
    },
    (error) => {
        NProgress.done();

        // 处理网络错误等
        notification.error({
            message: '网络异常',
            description: error.message || '网络请求失败',
            duration: 3,
        });

        return Promise.reject(error);
    },
);

export default axios;
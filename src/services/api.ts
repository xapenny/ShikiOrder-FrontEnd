import Taro from '@tarojs/taro'
import { useStore } from 'vuex';
import { onMounted } from 'vue';

const store = useStore();
const ignoredUrl = ['/user/login'];

export default {
    baseOptions(params, method = 'GET') {
        let { url, data } = params
        let header = { 'content-type': 'application/json' };
        if (ignoredUrl.indexOf(url) === -1) {
            header['Authorization'] = "Bearer " + Taro.getStorageSync('bearer')
        }
        return Taro.request({
            isShowLoading: false,
            loadingText: '正在加载',
            // @ts-ignore Already defined in global constant
            url: API_URL + url,
            data: data,
            // @ts-ignore Dunno why it keeps giving me errors
            method: method,
            header: header
        }).then((res) => {
            if (res.statusCode === 401) {
                Taro.removeStorageSync('bearer');
                onMounted(() => {
                    store.commit('user/logout');
                    store.commit('shop/resetShop');
                    store.commit('products/resetProducts');
                })
                return { "expired": true, "error": "session expired" }
            } else if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 400) {
                return res.data
            } else {
                return { "error": "unknown error" }
            }
        })
    },
    get: function (url, data = null) {
        let option = { url, data }
        return this.baseOptions(option)
    },
    post: function (url, data) {
        let params = { url, data }
        return this.baseOptions(params, 'POST')
    }
}
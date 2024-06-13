import Taro from '@tarojs/taro'
import api from '@/services/api'
import store from '@/store';
import router from '@/router';

export async function signIn() {
    try {
        const resp = await api.get('/user/signin');
        if (resp.expired) {
            router.push('/login');
            return
        }
        if (resp.error) {
            Taro.showToast({
                title: resp.error,
                icon: 'none'
            });
        } else {
            let msg = "签到成功！经验+" + resp.added_exp + "，积分+" + resp.added_points;
            store.commit('user/addExp', resp.added_exp);
            store.commit('user/addPoints', resp.added_points);
            Taro.showToast({
                title: msg,
                icon: 'none'
            });
        }
    } catch (error) {
        Taro.showToast({
            title: "签到失败",
            icon: 'error'
        });
        console.log(error);
    }
};

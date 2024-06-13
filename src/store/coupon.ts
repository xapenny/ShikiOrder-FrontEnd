import api from '@/services/api'
import router from '@/router'
import Taro from '@tarojs/taro'

const state = () => ({
    all: []
})

const getters = {
    getCouponById: (state) => (id) => {
        return state.all.find(coupon => coupon.id === Number(id))
    }
}

const actions = {
    async initialize({ commit }, { shopId }) {
        const resp = await api.get(`/coupon/all?shop=${shopId}`);
        if (resp.expired) {
            router.push('/login');
            return
        }
        if (resp.error) {
            Taro.showModal({
                title: '错误',
                content: resp.error,
                showCancel: false
            })
            return
        }
        commit('setAll', resp.coupons)
    }
}

const mutations = {
    setAll(state, all) {
        state.all = all
    },
    resetCoupons(state) {
        state.all = []
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
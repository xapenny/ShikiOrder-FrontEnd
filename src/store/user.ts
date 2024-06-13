import api from '@/services/api'
import router from '@/router'
import Taro from '@tarojs/taro'

const state = () => ({
    userId: null,
    openId: null,
    userName: '微信用户',
    gender: '保密',
    phone: null,
    points: 0,
    exp: 0,
    coupons: [],
    userAvatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
})

const mutations = {
    setUserInfo(state, userInfo) {
        state.userId = userInfo.userId
        state.openId = userInfo.openId
        state.userName = userInfo.userName
        state.userAvatar = userInfo.userAvatar
        state.gender = userInfo.gender
        state.phone = userInfo.phone
        state.points = userInfo.points
        state.exp = userInfo.exp
        state.coupons = userInfo.coupons
    },
    addExp(state, exp) {
        state.exp += exp
    },
    addPoints(state, points) {
        state.points += points
    },
    consumePoints(state, points) {
        state.points -= points
    },
    consumeCoupon(state, id) {
        const index = state.coupons.findIndex(coupon => coupon.id === id)
        state.coupons.splice(index, 1)
    },
    logout(state) {
        state.userId = null
        state.openId = null
        state.userName = '微信用户'
        state.userAvatar = 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
        state.gender = '保密'
        state.phone = null
        state.points = 0
        state.exp = 0
    }
}

const actions = {
    async initialize({ commit }) {
        const resp = await api.get('/user/info');
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
        commit('setUserInfo', {
            userId: resp.user_id,
            openId: resp.open_id,
            userName: resp.nickname,
            userAvatar: resp.avatar,
            gender: resp.gender,
            phone: resp.phone,
            points: resp.total_points,
            exp: resp.level_exp,
            coupons: resp.coupons
        });

    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
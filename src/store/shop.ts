import api from '@/services/api'
import router from '@/router'
import Taro from '@tarojs/taro'

const state = () => ({
    all: [],
    cart: {},
    checkoutStatus: null,
    currentShop: {
        id: null,
        name: null,
        address: null,
        phone: '',
        about: '',
        email: '',
        announcement: '',
        swipers: []
    },
    tableId: null,
})

const actions = {
    async initialize({ commit }) {
        const resp = await api.get('/shop/all');
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
        commit('setAll', resp.shops);

    }
}

const getters = {
    getShopById: (state) => (id) => {
        return state.all.find(shop => shop.id === Number(id))
    },
    getProductQuantity: (state) => (id) => {
        if (state.cart[id]) {
            return state.cart[id]
        } else {
            return 0
        }
    },
    getTotalPrice(state, getters, rootState, rootGetters) {
        return Object.keys(state.cart).reduce((total, id) => {
            const product = rootGetters['products/getProductById'](id)
            return total + product.price * state.cart[id]
        }, 0)
    },
    getTotalQuantity(state) {
        return Object.keys(state.cart).reduce((total, id) => {
            return total + state.cart[id]
        }, 0)
    },
    getCoordinateById: (state) => (id) => {
        let shop = state.all.find(shop => shop.id === Number(id));
        let res = shop.address.split(',');
        return {
            latitude: parseFloat(res[1]),
            longitude: parseFloat(res[2])
        }
    }
}
const mutations = {
    setAll(state, all) {
        state.all = all
    },
    setCurrentShop(state, shop) {
        state.currentShop = shop
    },
    pushProductToCart(state, { id }) {
        if (!state.cart[id]) {
            state.cart[id] = 1
        } else {
            state.cart[id]++
        }
    },
    removeProductFromCart(state, { id }) {
        if (state.cart[id]) {
            delete state.cart[id]
        }
    },
    incrementItemQuantity(state, { id }) {
        if (state.cart[id]) {
            state.cart[id]++
        }
    },
    decreaseItemQuantity(state, { id }) {
        if (state.cart[id]) {
            state.cart[id]--
            if (state.cart[id] < 1) {
                delete state.cart[id]
            }
        }
    },
    setCartItems(state, { cart }) {
        state.cart = cart
    },
    setCheckoutStatus(state, status) {
        state.checkoutStatus = status
    },
    setTableId(state, id) {
        state.tableId = id
    },
    clearCart(state) {
        state.cart = {}
    },
    resetShop(state) {
        state.all = []
        state.currentShop = {
            id: null,
            name: null,
            address: null,
            phone: '',
            about: '',
            email: '',
            announcement: ''
        }
        state.tableId = null
        state.cart = {}
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
import api from '@/services/api'
import router from '@/router'
import Taro from '@tarojs/taro'

const state = () => ({
    all: [],
    category: [],
    categoryChild: []
})

const getters = {
    getProductById: (state) => (id) => {
        return state.all.find(product => product.id === Number(id))
    },

}

const actions = {
    async initialize({ commit }, { shopId }) {
        const resp = await api.get(`/product/all?shop=${shopId}`);
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
        commit('setAll', resp.all)
        commit('setCategory', resp.category)
        commit('setCategoryChild', resp.category[0].children)
    }
}

const mutations = {
    setAll(state, all) {
        state.all = all
    },
    setCategory(state, category) {
        state.category = category
    },
    setCategoryChild(state, categoryChild) {
        state.categoryChild = categoryChild
    },
    decrementProductInventory(state, { id }) {
        const product = state.all.find(product => product.id === id)
        product.inventory--
    },
    changePage(state, { page }) {
        state.categoryChild = [].concat(state.category[page].children)
    },
    resetProducts(state) {
        state.all = []
        state.category = []
        state.categoryChild = []
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
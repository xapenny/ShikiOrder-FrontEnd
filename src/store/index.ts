import { createStore, createLogger } from 'vuex'
import shop from './shop'
import products from './products'
import user from './user'
import coupon from './coupon'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
    modules: {
        shop,
        products,
        user,
        coupon
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
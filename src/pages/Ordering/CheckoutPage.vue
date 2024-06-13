<template>
    <view class="vert-wrapper align-center" style="max-height: 600px; overflow-y: auto;">
        <!--  Top Card -->
        <view class="round-card vert-wrapper pt_20 pb_20 m_20 w_90p rgap_10">
            <view class="hori-wrapper pl_20 pr_20">
                <view class="vert-wrapper shop-wrapper">
                    <p class="shop-title">{{ shop.name }}</p>
                    <view class="hori-wrapper">
                        <Location2 />
                        <p class="shop-subtitle">{{ shop.address.split(',')[0] }}</p>
                    </view>
                </view>
            </view>
            <view class="vert-wrapper pl_20 pr_20">
                <view class="divider" />
                <view class="hori-wrapper">
                    <view :class="'option-card hori-wrapper' + (!isTakeout ? ' selected' : '')"
                        @click="isTakeout = false">
                        <img src="http://127.0.0.1/images/ts.png" />
                        <p>店内用餐</p>
                    </view>
                    <view :class="'option-card ml_20 hori-wrapper' + (isTakeout ? ' selected' : '')"
                        @click="isTakeout = true">
                        <img src="http://127.0.0.1/images/db.png" />
                        <p>外带</p>
                    </view>
                </view>
            </view>

        </view>
        <!-- Middle Card -->
        <view class="round-card vert-wrapper pt_20 pb_20 m_20 w_90p">
            <li v-for="cartItemId in Object.keys(userCart)" :key="cartItemId">
                <CartCheckoutCard :id="Number(cartItemId)" />
            </li>
        </view>
        <view class="m_20 w_90p">
            <nut-cell style="border-radius: 10px;" title="优惠券"
                :desc="couponOption.find(coupon => coupon.id === couponId[0])?.text || '请选择优惠券'"
                @click="couponSelectorVisible = true" />
            <nut-cascader v-model:visible="couponSelectorVisible" v-model="couponId" title="选择优惠券" text-key="text"
                value-key="id" :options="couponOption" @change="change" />
        </view>
        <view class="round-card vert-wrapper w_90p">
            <view class="hori-wrapper pl_20 checkout-phone-wrapper">
                <view class="w_20p checkout-phone">
                    <p>手机号</p>
                </view>
                <nut-input type="number" v-model="userPhone" placeholder="" input-align="right" />
            </view>
            <view class="hori-wrapper pl_20 checkout-phone-wrapper" v-if="!isTakeout">
                <view class="w_20p checkout-phone">
                    <p>桌号</p>
                </view>
                <nut-input type="number" v-model="tableId" placeholder="" input-align="right" />
            </view>
            <view class="hori-wrapper pl_20 checkout-phone-wrapper">
                <view class="w_20p checkout-phone">
                    <p>备注</p>
                </view>
                <nut-input v-model="comments" placeholder="" input-align="right" />
            </view>
        </view>
    </view>
    <view class="bottom-bar-wrapper">
        <view class="hori-wrapper pl_20 pr_20">
            <view class="w_60p hori-wrapper mb_10">
                <view class="bottom-total-quantity">共{{ totalQuantity }}件 合计
                </view>
                <view class="bottom-total-price">¥ {{ formatPrice(totalPrice) }}</view>
            </view>
            <view class="checkout-button-wrapper">
                <button class="bg_gray white" @click="router.back()">
                    <p class="bold">取消</p>
                </button>
            </view>
            <view class="checkout-button-wrapper">
                <button class="bg_green white" @click="createOrder">
                    <p class="bold">下单</p>
                </button>
            </view>
        </view>
    </view>

</template>

<script setup lang="ts">
import '@/style/global.scss'
import { Location2 } from '@nutui/icons-vue-taro';
import { useStore } from 'vuex'
import { computed, onMounted, reactive, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import CartCheckoutCard from '@/components/ShoppingCart/CartCheckoutCard.vue'
import { formatPrice } from '@/utils/priceUtil'
import { isPhoneNumber } from '@/utils/verifyUtil'
import dayjs from 'dayjs';
import api from '@/services/api';
import Taro from '@tarojs/taro';

const store = useStore()
const router = useRouter()
const userCart = computed(() => store.state.shop.cart)
const userPhone = ref<string>('')
const tableId = ref<number | null>(null)
const shop = computed(() => store.state.shop.currentShop)
const totalPrice = ref(0)
const totalQuantity = computed(() => store.getters['shop/getTotalQuantity'])
const isTakeout = ref(false)
const couponSelectorVisible = ref(false)
const couponId = ref([-1])
const comments = ref('')
const couponOption = reactive([
    {
        text: '不使用优惠券',
        id: -1
    }
])
const change = (option: any) => {
    if (option[0] === -1) {
        totalPrice.value = store.getters['shop/getTotalPrice']
        return
    }
    let coupon = store.state.coupon.all.find(coupon => coupon.id === store.state.user.coupons.find(userCoupon => userCoupon.id === option[0]).coupon_id)
    if (!coupon.discount_percentage) {
        totalPrice.value = store.getters['shop/getTotalPrice'] - coupon.discount
    } else {
        totalPrice.value = Math.round(store.getters['shop/getTotalPrice'] * (1 - coupon.discount_percentage / 100))
    }
}

const createOrder = async () => {
    if (!isPhoneNumber(userPhone.value)) {
        Taro.showToast({
            title: '手机号格式错误',
            icon: 'error'
        })
        return
    }
    if (!isTakeout.value && !tableId.value) {
        Taro.showToast({
            title: '请输入桌号',
            icon: 'error'
        })
        return
    }
    const data = {
        shop_id: shop.value.id,
        shop_name: shop.value.name,
        table_id: tableId.value || null,
        phone: userPhone.value,
        is_takeout: isTakeout.value,
        used_coupon_id: couponId.value[0],
        total_price: totalPrice.value,
        comments: comments.value,
        products: Object.entries(userCart.value)
    }
    api.post('/order/create', data).then((resp) => {
        if (resp.expired) {
            router.push('/login')
            return
        }
        if (resp.error) {
            Taro.showToast({
                title: resp.error,
                icon: 'none'
            })
        } else {
            if (couponId.value[0] != -1)
                store.commit('user/consumeCoupon', couponId.value[0]);
            Taro.showToast({
                title: '下单成功',
                icon: 'success'
            })
            store.commit('shop/clearCart');
            router.push('/order/detail/' + resp.order_id)
        }
    })
}

onMounted(() => {
    store.dispatch('coupon/initialize', {
        shopId: shop.value.id
    })
})

watchEffect(() => {
    if (store.state.shop.tableId && !tableId.value)
        tableId.value = store.state.shop.tableId
    if (store.state.user.phone && !userPhone.value) {
        userPhone.value = store.state.user.phone
    }
    if (totalPrice.value === 0) {
        totalPrice.value = store.getters['shop/getTotalPrice']
    }
    if (!store.state.coupon.all || store.state.user.coupons.length === 0) return
    if (couponOption.length === 1)
        store.state.user.coupons.forEach(userCoupon => {
            let coupon = store.state.coupon.all.find(coupon => coupon.id === userCoupon.coupon_id && coupon.shop_id === shop.value.id)
            if (coupon) {
                if ((coupon.threshold <= store.getters['shop/getTotalPrice']) && dayjs().isBefore(dayjs(coupon.valid_date))) {
                    couponOption.push({
                        text: coupon.name,
                        id: userCoupon.id
                    })
                }
            }
        })
})
</script>

<style>
.shop-wrapper {
    display: grid;
}

.option-card {
    margin-top: 20px;
    border-style: solid;
    border-color: silver;
    border-width: 6px;
    border-radius: 20px;
    background-color: white;
    width: 50%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.option-card img {
    width: 75px;
    height: 75px;
}

.option-card p {
    font-weight: 400;
}

.option-wrapper:last-child {
    margin-left: 20px;
}

.selected {
    border-color: green;
}

.checkout-phone-wrapper {
    display: flex;
    align-items: center;
}

.checkout-phone {
    margin-left: 10px;
}

.checkout-phone p {
    font-size: 85%;
    color: gray;
}

.checkout-button-wrapper {
    width: 200px;
    height: 100%;
}


.checkout-button-wrapper button {
    border-radius: 50px;
    display: flex;
    justify-content: center;
}

.bottom-total-price {
    display: flex;
    align-items: flex-end;
    margin-left: 10px;
    font-size: 150%;
    font-weight: bold;
    color: green;
}

.bottom-total-quantity {
    display: flex;
    align-items: flex-end;
    font-size: 75%;
}
</style>
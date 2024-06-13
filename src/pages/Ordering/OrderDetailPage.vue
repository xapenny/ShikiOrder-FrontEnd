<template>
    <view class="vert-wrapper align-center" style="max-height: 600px; overflow-y: auto;">
        <view class="round-card vert-wrapper align-center pt_20 pb_20 m_20 w_90p" v-if="orderInfo.state == 3">
            <view class="align-center" id="order-state">{{ getOrderState(orderInfo.state) }}</view>
            <view class="align-center" id="verify-code">{{ orderInfo.verifyCode }}</view>
            <view class="align-center">取单号</view>
        </view>
        <view class="round-card vert-wrapper align-center pt_20 pb_20 m_20 w_90p" v-if="orderInfo.state != 3">
            <view class="align-center" id="order-state-pending">{{ getOrderState(orderInfo.state) }}</view>
            <view class="align-center" id="order-state-msg">{{
                getOrderStateMsg(orderInfo.state) }}</view>
        </view>
        <view class="round-card vert-wrapper align-center pt_20 pb_20 m_20 w_90p">
            <view class="hori-wrapper overflow-text w_90p">
                <view class="hori-wrapper">
                    <Shop size="24" />
                    <span class="ml_10 order-detail-shop-name">{{ orderInfo.shopName }}</span>
                </view>
            </view>
            <view class="inline-divider" />
            <view class="w_95p">
                <li v-for="orderItem in products" :key="orderItem">
                    <CartCheckoutCard :id="Number(orderItem.id)" :item="orderItem" :quantity="orderItem.quantity" />
                </li>
            </view>
            <view class="inline-divider" />
            <view class="hori-wrapper order-detail-total-price-wrapper">
                <span>¥{{ formatPrice(orderInfo.paidPrice) }}</span>
            </view>
        </view>
        <view class="round-card vert-wrapper align-center pt_20 pb_20 m_20 w_90p">
            <view class="hori-wrapper overflow-text w_90p">
                <span class=" order-detail-shop-name">订单详情</span>
            </view>
            <view class="inline-divider" />
            <view class="vert-wrapper w_90p rgap_10">
                <view class="hori-wrapper space-between">
                    <span class="gray">订单号</span>
                    <span>{{ orderId }}</span>
                </view>
                <view class="hori-wrapper space-between">
                    <span class="gray">下单时间</span>
                    <span>{{ orderInfo.time }}</span>
                </view>
                <view class="hori-wrapper space-between">
                    <span class="gray">取餐方式</span>
                    <span v-if="!orderInfo.isTakeout">店内取餐</span>
                    <span v-if="orderInfo.isTakeout">打包</span>
                </view>
                <view class="hori-wrapper space-between" v-if="orderInfo.tableId">
                    <span class="gray">桌号</span>
                    <span>{{ orderInfo.tableId }}</span>
                </view>
                <view class="hori-wrapper space-between" v-if="orderInfo.state > 1">
                    <span class="gray">支付方式</span>
                    <span>微信支付</span>
                </view>
            </view>
        </view>
    </view>
    <view class="bottom-bar-wrapper">
        <view class="hori-wrapper pl_20 pr_20 space-between">
            <view class="order-detail-button-wrapper">
                <button class="white" style="background-image: linear-gradient(to right, #d9d7d7, #737373) !important"
                    @click="router.push('/order/manage')">
                    <p class="bold">返回</p>
                </button>
            </view>
            <view class="order-detail-button-wrapper" v-if="orderInfo.state === 0">
                <button class="white" style="background-image: linear-gradient(to right, #ffd900, #ff6200);"
                    v-if="orderInfo.state === 0" @click="cancelOrder">
                    <p class="bold">取消</p>
                </button>
            </view>
            <view class="order-detail-button-wrapper" v-if="orderInfo.state === 0">
                <button class="bg_green white" style="background-image: linear-gradient(to right, #00ffcc, #4dbc76)"
                    v-if="orderInfo.state === 0" @click="payOrder">
                    <p class="bold">付款</p>
                </button>
            </view>
        </view>
    </view>

</template>

<script setup lang="ts">
import '@/style/global.scss'
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { Shop } from '@nutui/icons-vue-taro'
import CartCheckoutCard from '@/components/ShoppingCart/CartCheckoutCard.vue';
import api from '@/services/api';
import { getOrderState, getOrderStateMsg } from '@/utils/orderUtil';
import { formatPrice } from '@/utils/priceUtil';
import Taro from '@tarojs/taro';

const store = useStore();
const route = useRoute();
const router = useRouter();
const orderId = route.params.id;
const orderInfo = ref({
    shopName: '',
    verifyCode: '',
    time: '',
    state: 0,
    paidPrice: 0,
    isTakeout: false,
    comments: '',
    tableId: 0
});
const products = ref<any>([]);

const cancelOrder = async () => {
    try {
        const resp = await api.get('/order/cancel?id=' + orderId);
        if (resp.expired) {
            router.push('/login');
            return
        }
        if (resp.error) {
            Taro.showToast({
                title: resp.error,
                icon: 'none'
            });
            console.log(resp.error);
        } else {
            Taro.showToast({
                title: "订单已取消",
                icon: 'success'
            });
            router.push('/order/manage');
        }
    } catch (error) {
        Taro.showToast({
            title: "取消订单失败",
            icon: 'error'
        });
        console.log(error);
    }
}

const payOrder = async () => {
    try {
        const resp = await api.get('/order/pay?id=' + orderId);
        if (resp.expired) {
            router.push('/login');
            return
        }
        if (resp.error) {
            Taro.showToast({
                title: resp.error,
                icon: 'none'
            });
            console.log(resp.error);
        } else {
            Taro.showToast({
                title: "支付成功",
                icon: 'success'
            });
            orderInfo.value.state = 2;
        }
    } catch (error) {
        Taro.showToast({
            title: '支付失败',
            icon: 'error'
        });
        console.log(error);
    }
}


onMounted(async () => {
    try {
        const resp = await api.get('/order/info?id=' + orderId);
        if (resp.expired) {
            router.push('/login');
            return
        }
        if (resp.error) {
            console.log(resp.error);
        } else {
            orderInfo.value = {
                shopName: resp.shop_name,
                verifyCode: resp.verify_code,
                time: resp.time,
                state: resp.state,
                paidPrice: resp.paid_price,
                isTakeout: resp.is_takeout,
                comments: resp.comments,
                tableId: resp.table_id
            }
            let tmpProcucts: Array<any> = [];
            for (let i = 0; i < resp.products.length; i++) {
                let productInfo = store.getters['products/getProductById'](resp.products[i][0]);
                if (!productInfo) {
                    continue;
                }
                tmpProcucts.push({
                    name: productInfo.name,
                    image: productInfo.image,
                    price: productInfo.price,
                    quantity: resp.products[i][1]
                });
            }
            products.value = tmpProcucts;
        }
    } catch (error) {
        console.log(error);
    }
})

</script>

<style>
.order-detail-button-wrapper {
    height: 100%;
    flex-grow: 1;
}

.order-detail-button-wrapper button {
    display: flex;
    justify-content: center;
}

#order-state {
    font-size: 120%;
    font-weight: 400;
}

#verify-code {
    padding-top: 10px;
    font-size: 200%;
    font-weight: 600;
}

#order-state-pending {
    font-size: 175%;
    font-weight: 600;
}

#order-state-msg {
    font-size: 100%;
    font-weight: 200;
}

.order-detail-shop-name {
    text-align: center;
    font-size: 125%;
    font-weight: 400;
}

.order-detail-total-price-wrapper {
    width: 90%;
    justify-content: flex-end;
    text-align: right;
}

.order-detail-total-price-wrapper span {
    font-size: 150%;
    font-weight: bold;
}
</style>
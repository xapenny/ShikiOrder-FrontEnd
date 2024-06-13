<template>
    <nut-overlay v-model:visible="showCart" :close-on-click-overlay="false">
        <view class="cart-preview-wrapper" v-if="showCart">
            <view class="cart-preview-title-wrapper" @click="showCart = false">
                <p>关闭购物车</p>
            </view>
            <view class="cart-preview">
                <li v-for="cartItemId in Object.keys(userCart)" :key="cartItemId">
                    <CartCard :id="Number(cartItemId)" />
                </li>
            </view>
        </view>
    </nut-overlay>
    <view class="cart-bar-wrapper">
        <view class="cart-bar">
            <view class="hori-wrapper align-center">
                <view class="cart-icon-wrapper" @click="toggleCart">
                    <Cart2 color="white" size="30px" />
                </view>
                <view class="price-wrapper">
                    <p>¥ {{ formatPrice(totalPrice) }}</p>
                </view>
                <view class="pay-button-wrapper center-button-text">
                    <button class="bg_green white bold" @click="checkout">
                        <p>去结算</p>
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { Cart2 } from '@nutui/icons-vue-taro'
import { ref, computed } from 'vue'
import CartCard from './CartCard.vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router';
import '@/style/global.scss'
import { formatPrice } from '@/utils/priceUtil';

const store = useStore()
const router = useRouter()

const userCart = computed(() => store.state.shop.cart)

const totalPrice = computed(() => store.getters['shop/getTotalPrice'])
const showCart = ref(false)

const toggleCart = () => {
    showCart.value = !showCart.value
}

const checkout = () => {
    if (Object.keys(userCart.value).length === 0) {
        Taro.showModal({
            title: '购物车为空',
            content: '请先添加商品到购物车',
            showCancel: false
        })
    } else {
        router.push('/order/checkout')
    }
}

</script>

<style>
.cart-bar-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25%;
    width: 100%;
    position: absolute;
    bottom: 0;
}

.cart-preview-title-wrapper {
    width: 90%;
    height: 100px;
    border-radius: 50px;
    background-color: black;
    align-items: center;
    justify-content: center;
    display: flex;
    margin-top: -75%;
    position: fixed;
}

.cart-preview-title-wrapper>p {
    color: white;
    font-weight: 400;
    font-size: 36px;
}

.cart-preview-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
}

.cart-bar {
    width: 90%;
    height: 100px;
    border-radius: 50px;
    background-color: black;
    /* color: black; */
    align-items: center;
    justify-content: center;
    position: fixed;
    margin-bottom: 150px
}

.cart-preview {
    width: 90%;
    height: 65%;
    overflow: auto;
    border-radius: 50px;
    background-color: white;
    border-style: solid;
    border-width: 4px;
    /* color: black; */
    align-items: center;
    justify-content: center;
    position: fixed;
    margin-top: 70%
}

.cart-icon-wrapper {
    padding-left: 35px;
    padding-top: 15px;
}


.price-wrapper {
    width: 40%;
    margin-left: 50px;
}

.price-wrapper p {
    font-size: 36px;
    font-weight: bold;
    color: white;
}

.pay-button-wrapper {
    width: 30%;
    margin-left: 10%;
    align-items: right;
}

.pay-button-wrapper button {
    border-radius: 75px;
}
</style>
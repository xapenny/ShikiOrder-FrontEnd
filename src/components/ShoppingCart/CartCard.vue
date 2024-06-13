<template>
    <view class="cart-card-wrapper">
        <view class="hori-wrapper align-center">
            <img :src="item.image" />
            <view class="vert-wrapper w_40p ml_15">
                <p id="cart-card-title">{{ item.name }}</p>
                <p id="cart-card-price">¥ {{ formatPrice(item.price) }}</p>
            </view>
            <view class="hori-wrapper w_30p align-center center-button-text">
                <button @click="decrease">
                    <p>-</p>
                </button>
                <p id="quantity">{{ quantity }}</p>
                <button @click="increase">
                    <p>+</p>
                </button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex';
import '@/style/global.scss'
import { formatPrice } from '@/utils/priceUtil'

const store = useStore();

const props = defineProps({
    id: { type: Number, required: true }
})

const quantity = computed(() => {
    return store.getters['shop/getProductQuantity'](props.id);
});

const item = computed(() => {
    return store.getters['products/getProductById'](props.id);
});

const increase = () => {
    store.commit('shop/incrementItemQuantity', {
        id: props.id
    })
}

const decrease = () => {
    store.commit('shop/decreaseItemQuantity', {
        id: props.id
    })
}

</script>

<style>
.cart-card-wrapper {
    background-color: white;
    border-radius: 30px;
    border-style: dotted;
    border-width: 2px;
    margin-top: 15px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
}

.cart-card-wrapper img {
    border-radius: 30px;
}

#cart-card-title {
    font-size: 40px;
    font-weight: 400;
}

#cart-card-price {
    font-size: 35px;
    font-weight: 400;
    color: red;
}
</style>
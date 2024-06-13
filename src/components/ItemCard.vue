<template>
    <view class="item-card-wrapper">
        <view class="hori-wrapper align-center">
            <img :src="item.image" />
            <view class="vert-wrapper ml_15">
                <p>{{ item.name }}</p>
                <p>¥{{ formatPrice(item.price) }}</p>
                <view class="hori-wrapper align-center center-button-text">
                    <button @click="decrease">-</button>
                    <p id="quantity">{{ quantity }}</p>
                    <button @click="increase">+</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import '@/style/global.scss'
import { formatPrice } from '@/utils/priceUtil'

const store = useStore()

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
    store.commit('shop/pushProductToCart', {
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
.item-card-wrapper {
    background-color: white;
    border-radius: 20px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
    margin-left: 15px;
    margin-top: 15px;
    margin-right: 15px;
    padding-left: 15px;
    padding-top: 15px;
    height: 200px;
    flex: 1;
}

button {
    margin-left: 10px;
    margin-top: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
    border-radius: 75px;
    background-color: #66ccff;
    height: 75px;
    align-items: center;
    justify-content: center;
}


.hori-wrapper img {
    width: 175px;
    height: 175px;
    border-radius: 20px;
}
</style>
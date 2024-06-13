<template>
    <view class="hori-wrapper pl_20 pr_20 cart-checkout-item-wrapper">
        <view class="w_20p">
            <img :src="item.image" />
        </view>
        <view class="hori-wrapper space-between fgrow">
            <view class="vert-wrapper pl_20">
                <span class="checkout-item-title">{{ item.name }}</span>
                <span class="checkout-item-subtitle">份</span>
                <span class="checkout-item-subtitle">x{{ quantity }}</span>
            </view>
            <span class="checkout-item-price">¥ {{ formatPrice(item.price) }}</span>
        </view>
    </view>
</template>

<script setup lang="ts">
import '@/style/global.scss'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatPrice } from '@/utils/priceUtil'

const store = useStore()
const props = defineProps({
    id: { type: Number, required: true },
    item: { type: Object },
    quantity: { type: Number }
})
const item = computed(() => {
    if (props.item) {
        return props.item;
    } else {
        return store.getters['products/getProductById'](props.id);
    }
});
const quantity = computed(() => {
    if (props.quantity) {
        return props.quantity;
    } else {
        return store.getters['shop/getProductQuantity'](props.id);
    }
});

</script>

<style>
.cart-checkout-item-wrapper {
    row-gap: 20px;
}

.cart-checkout-item-wrapper img {
    margin-top: 10px;
    width: 125px;
    height: 125px;
}

span.checkout-item-title {
    font-size: 125%;
    font-weight: bold;
}

span.checkout-item-subtitle {
    font-size: 90%;
    color: grey;
}

span.checkout-item-price {
    font-size: 110%;
    font-weight: 400;
    text-align: right;
}
</style>
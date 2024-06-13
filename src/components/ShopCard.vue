<template>
    <view class="shop-card-wrapper" @click="gotoOrder">
        <p class="shop-title">{{ shop.name }}</p>
        <p class="shop-subtitle">{{ shop.address.split(',')[0] }}</p>
        <p class="shop-subtitle">{{ shop.phone }}</p>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';

const props = defineProps({
    id: { type: Number, required: true }
})
const store = useStore();
const router = useRouter();

const shop = computed(() => {
    return store.getters['shop/getShopById'](props.id);
});


const gotoOrder = () => {
    store.commit('shop/setCurrentShop', shop.value)
    router.push('/home')
}

</script>

<style>
.shop-card-wrapper {
    display: grid;
    grid: auto;
    grid-gap: 10px;
    margin: 15px;
    padding: 20px;
    border-style: solid;
    border-radius: 25px;
    border-width: 4px;
    border-color: green;
}
</style>
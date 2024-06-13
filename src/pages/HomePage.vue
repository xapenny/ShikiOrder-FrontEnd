<template>
    <view>
        <nut-noticebar :text="shop.announcement" />
        <view class="swiper_wrapper">
            <nut-swiper :init-page="2" :auto-play="3000" pagination-visible pagination-color="#426543"
                pagination-unselected-color="#808080">
                <nut-swiper-item v-for="(item, index) in imgList" :key="index" style="height: 250px">
                    <img :src="item" alt="" style="height: 100%; width: 100%" draggable="false" />
                </nut-swiper-item>
            </nut-swiper>
        </view>
        <UserCard style="margin-top: -50px;" />
    </view>
    <view style="position: relative;">
        <router-link to="/order/order">
            <view style="width: 50%; height: 100%; z-index: 1; position: absolute; top: 100">
            </view>
        </router-link>
        <router-link to="/user/point">
            <view style="width: 50%; height: 100%; z-index: 1; position: absolute; top: 100; left: 50%;">
            </view>
        </router-link>
        <view class="home_button_wrapper">
            <img src="http://127.0.0.1/images/order_btn.png">
        </view>
    </view>

    <nut-button class="reselect-btn" color="linear-gradient(to right, #5e5c5c, #b5b1b1)"
        @click="handleSelect">重新选择店铺</nut-button>
    <Footer />
</template>

<script setup lang="ts">
import { onMounted, computed, watchEffect, reactive } from 'vue'
import Footer from '@/components/Footer.vue'
import UserCard from '@/components/UserCard.vue'
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore();
const router = useRouter();
const shop = computed(() => store.state.shop.currentShop)
const imgList = reactive<string[]>([])

const handleSelect = () => {
    store.commit('shop/resetShop')
    store.commit('products/resetProducts')
    router.push('/select')
}

onMounted(() => {
    if (!Taro.getStorageSync('bearer')) {
        router.push('/login')
    }
    else if (!shop.value.id) {
        router.push('/select')
    }
})

watchEffect(() => {
    if (shop.value.id && (store.state.products.category.length === 0 || store.state.products.all.length === 0)) {
        store.dispatch('products/initialize', {
            shopId: shop.value.id
        })
    }
})

watchEffect(() => {
    if (!shop.value.swipers) return;
    imgList.length = 0;
    shop.value.swipers.forEach(swiper => {
        imgList.push(swiper.__values__.image)
    });
})


</script>

<style>
.home_button_wrapper {
    display: flex;
    margin-top: 10px;
    justify-content: center;
    z-index: 2;
}

.home_button_wrapper img {
    width: 100%;
}

.swiper_wrapper {
    z-index: 0;
    position: relative;
}

.reselect-btn {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 10px;
    display: flex;
    flex: 1;
    width: auto;
}
</style>

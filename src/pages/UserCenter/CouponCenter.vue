<template>
    <nut-tabs v-model="isCouponAvailable">
        <nut-tab-pane title="未使用" pane-key="1">
            <view style="max-height: 500px; overflow-y: auto;">
                <li v-for="coupon in coupons" :key="coupon.id">
                    <CouponCard :title="coupon.title" :keyword="coupon.keyword" :expire="coupon.expire"
                        :requirement="coupon.requirement" v-if="dayjs().isBefore(dayjs(coupon.expire))" />
                </li>
                <view style="text-align: center;"
                    v-if="!coupons.length || coupons.every(coupon => !dayjs().isBefore(dayjs(coupon.expire)))">
                    <span>什么都没找到哦</span>
                </view>
            </view>

        </nut-tab-pane>
        <nut-tab-pane title="已过期" pane-key="2">
            <view style="max-height: 500px; overflow-y: auto;">
                <li v-for="coupon in coupons" :key="coupon.id">
                    <CouponCard :title="coupon.title" :keyword="coupon.keyword" :expire="coupon.expire"
                        :requirement="coupon.requirement" v-if="!dayjs().isBefore(dayjs(coupon.expire))" />
                </li>
                <view style="text-align: center;"
                    v-if="!coupons.length || coupons.every(coupon => dayjs().isBefore(dayjs(coupon.expire)))">
                    <span>什么都没找到哦</span>
                </view>
            </view>
        </nut-tab-pane>
    </nut-tabs>

    <view class="bottom-bar-wrapper">
        <view class="hori-wrapper pl_20 pr_20 space-between">
            <view class="order-detail-button-wrapper">
                <button class="white" style="background-image: linear-gradient(to right, #d9d7d7, #737373) !important"
                    @click="router.push('/user/user')">
                    <p class="bold">返回</p>
                </button>
            </view>
        </view>
    </view>

</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect, reactive } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { useStore } from 'vuex';
import CouponCard from '@/components/CouponCard.vue'
import Taro from '@tarojs/taro';

interface Coupon {
    id: number,
    title: string,
    keyword: string,
    expire: string,
    requirement: string
}

const store = useStore()
const shop = computed(() => store.state.shop.currentShop)
const isCouponAvailable = ref('1')
const router = useRouter();
const coupons = reactive<Coupon[]>([
])
onMounted(() => {
    Taro.setNavigationBarTitle({
        title: '优惠券中心'
    })
    store.dispatch('coupon/initialize', {
        shopId: shop.value.id
    })
})

watchEffect(() => {
    if (coupons.length === 0)
        store.state.user.coupons.forEach(userCoupon => {
            let coupon = store.state.coupon.all.find(coupon => coupon.id === userCoupon.coupon_id && coupon.shop_id === shop.value.id)
            console.log(coupon)
            if (coupon) {
                var keyword = ''
                if (coupon.name.indexOf('元') !== -1) {
                    let index = 1
                    if (coupon.name.indexOf('减') != -1)
                        index = 2
                    keyword = '¥' + coupon.name.substring(coupon.name.indexOf('元') + index, coupon.name.length)
                }
                else
                    keyword = coupon.name
                coupons.push({
                    id: coupon.id,
                    title: coupon.name,
                    keyword: keyword,
                    expire: coupon.valid_date,
                    requirement: `满${coupon.threshold / 100}元可用`
                })

            }
        })
})

</script>

<style></style>
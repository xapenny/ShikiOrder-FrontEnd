<template>
    <view class="point-shop-top">
        <view style="display: grid; grid: auto / auto auto; height: 100%">
            <view style="display: flex; justify-content: center; align-items: center;">
                <SFollow />
                <span>当前积分: {{ userInfo.points }}</span>
            </view>
            <view style="display: flex; justify-content: center; align-items: center;" @click="showLog">
                <Date />
                <span>兑换纪录</span>
            </view>
        </view>
    </view>
    <view class="point-shop-list-wrapper">
        <li v-for="item in itemList" :key="item.id">
            <PointStoreItemCard :id="item.id" :title="item.title" :image="item.image" :price="item.price" />
        </li>
    </view>
    <nut-popup v-model:visible="showTop" position="top" :style="{ height: '60%' }">
        <view style="display: grid; max-height: 100%; overflow-y: auto; padding-bottom: 60px;">
            <li v-for="log in purchaseLog" :key="log.id">
                <view
                    style="margin: 10px; border-radius: 20px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3); display: grid;">
                    <view style="padding: 10px;">
                        <view>{{ getLogTitle(log.item_id) }}</view>
                        <view>状态: {{ getLogState(log.express_id) }}</view>
                        <view v-if="log.express_id">单号: {{ log.express_id }}</view>
                        <view>兑换时间: {{ log.created_at }}</view>
                    </view>
                </view>
            </li>
        </view>
    </nut-popup>
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
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { SFollow, Date } from '@nutui/icons-vue-taro';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import PointStoreItemCard from '@/components/PointStoreItemCard.vue';
import Taro from '@tarojs/taro';
import api from '@/services/api'

interface PointShopItem {
    id: number;
    title: string;
    image: string;
    price: number;
}

interface PurchaseLog {
    id: number
    user_id: number
    item_id: number
    shop_id: number
    express_id: string | null
    created_at: string
}

const store = useStore();
const router = useRouter();
const showTop = ref(false)
const userInfo = computed(() => store.state.user)
const itemList = reactive<PointShopItem[]>([])
const purchaseLog = reactive<PurchaseLog[]>([])

const getLogTitle = (id: number) => {
    const item = itemList.find((item) => item.id === id)
    return item ? item.title : '未知商品'
}

const getLogState = (express_id: string | null) => {
    if (!express_id) return '待发货'
    return '已发货'
}

const showLog = () => {
    showTop.value = true
    purchaseLog.length = 0
    api.get(`/point-store/logs?shop=${store.state.shop.currentShop.id}`).then((resp) => {
        if (!resp.error) {
            resp.logs.forEach((log: any) => {
                purchaseLog.push({
                    id: log.id,
                    user_id: log.user_id,
                    item_id: log.item_id,
                    shop_id: log.shop_id,
                    express_id: log.express_id,
                    created_at: log.created_at
                })
            })
        } else {
            Taro.showModal({
                title: '错误',
                content: resp.error,
                showCancel: false
            })
        }
    })
}

onMounted(() => {
    Taro.setNavigationBarTitle({
        title: '积分商城'
    })
})

watchEffect(() => {
    if (itemList.length === 0) {
        api.get(`/point-store/items?shop=${store.state.shop.currentShop.id}`).then((resp) => {
            if (!resp.error) {
                itemList.length = 0;
                resp.items.forEach((item: any) => {
                    itemList.push({
                        id: item.id,
                        title: item.name,
                        image: item.image,
                        price: item.price
                    })
                })
            } else {
                Taro.showModal({
                    title: '错误',
                    content: resp.error,
                    showCancel: false
                })
            }
        })
    }
})
</script>

<style>
.point-shop-top {
    height: 100px;
    background-color: white;
    margin: 10px;
    border-radius: 20px;
}

.point-shop-list-wrapper {
    display: grid;
    grid: auto / 50% 50%;
    grid-gap: 20px;
    margin: 10px;
}
</style>
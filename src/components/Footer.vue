<template>
    <view class="index">
        <nut-tabbar v-model="activeName" @tab-switch="tabSwitch" bottom safe-area-inset-bottom>
            <nut-tabbar-item v-for="item in List" :key="item.name" :name="item.name" :tab-title="item.title"
                :icon="item.icon">
            </nut-tabbar-item>
        </nut-tabbar>
    </view>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
import { Home, Shop, Order, My } from '@nutui/icons-vue-taro'
import { useRouter, useRoute } from 'vue-router'
import Taro from '@tarojs/taro'

const router = useRouter()
const route = useRoute()

const activeName = ref(route.path)

const List = [
    {
        title: '主页',
        icon: h(Home),
        name: '/home'
    },
    {
        title: '点餐',
        icon: Shop,
        name: '/order/order'
    },
    {
        title: '订单',
        icon: Order,
        name: '/order/manage'
    },
    {
        title: '我的',
        icon: h(My),
        name: '/user/user'
    }
]

const tabSwitch = (item: Record<string, unknown>, index: string) => {
    var title = '首页';
    switch (index) {
        case '/home':
            title = '首页'
            break
        case '/order/order':
            title = '点餐'
            break
        case '/order/manage':
            title = '订单'
            break
        case '/user/user':
            title = '我的'
            break
    }
    Taro.setNavigationBarTitle({
        title: title
    })
    router.push(index)
}
</script>

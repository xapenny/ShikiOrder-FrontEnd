<template>
    <view>
        <UserCard style="margin-top: 20px;" />
        <view class="shortcut_grid">
            <p>更多服务</p>
            <nut-grid :column-num="3">
                <nut-grid-item text="签到" @click="signIn">
                    <Notice />
                </nut-grid-item>
                <nut-grid-item text="优惠券" @click="router.push('/user/coupon')">
                    <Date />
                </nut-grid-item>
                <nut-grid-item text="积分商城" @click="router.push('/user/point')">
                    <Shop />
                </nut-grid-item>
            </nut-grid>
            <nut-grid :column-num="3">
                <nut-grid-item text="问题反馈" @click="showUpcomingToast">
                    <Service />
                </nut-grid-item>
                <nut-grid-item text="关于我们" @click="showAbout">
                    <Tips />
                </nut-grid-item>
                <nut-grid-item text="设置" @click="router.push('/user/settings')">
                    <Setting />
                </nut-grid-item>
            </nut-grid>
        </view>
        <Footer />
    </view>
</template>

<script setup lang="ts">
import { Setting, Notice, Date, Shop, Service, Tips } from '@nutui/icons-vue-taro'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { signIn } from '@/utils/signin';
import Footer from '@/components/Footer.vue'
import UserCard from '@/components/UserCard.vue'
import Taro from '@tarojs/taro'


const router = useRouter()
const store = useStore()
const shop = computed(() => store.state.shop.currentShop)

const showUpcomingToast = () => {
    Taro.showToast({
        title: '敬请期待',
        icon: 'none'
    })
}

const showAbout = () => {
    Taro.showModal({
        title: '关于本店',
        content: shop.value.about,
        showCancel: false
    })
}

onMounted(() => {
    store.dispatch('user/initialize')
})

</script>

<style>
.avatar_wrapper {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.user_data_wrapper p {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 20px;
}

.shortcut_grid {
    margin-top: 50px;
}

.shortcut_grid p {
    color: gray;
    margin-left: 20px;
    font-size: 85%;
    margin-bottom: 10px;
}
</style>
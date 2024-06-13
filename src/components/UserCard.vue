<template>
    <view class="user_card_wrapper">
        <view class="user_card">
            <nut-avatar class="user_avatar" size="large" square> <img :src="userInfo.userAvatar" /> </nut-avatar>
            <view class="user_info">
                <span>欢迎您, {{ userInfo.userName }}</span>
                <nut-progress class="lv_progress" :percentage="userLvProgress" :text-inside="true">
                    <view class="lv_text">
                        <span>LV{{ userLv }}</span>
                    </view>
                </nut-progress>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { getUserLvProgress } from '@/utils/expUtil'

const store = useStore();

const userInfo = computed(() => store.state.user)
const userLv = ref(1)
const userLvProgress = ref(0)


onMounted(async () => {
    if (!store.state.user.userId) {
        store.dispatch('user/initialize')
    }
})

watchEffect(() => {
    if (userInfo.value.exp && !userLvProgress.value) {
        userLv.value = getUserLvProgress(userInfo.value.exp).lv
        userLvProgress.value = getUserLvProgress(userInfo.value.exp).progress
    }
})

</script>

<style>
.user_card {
    width: 90%;
    height: 200px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
    /* 添加阴影 */
    display: flex;
    align-items: center;
}

.user_card_wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    z-index: 10;
}

.user_avatar {
    margin-left: 40px;
}

.user_info {
    margin-left: 50px;
    width: 60%;
}

.lv_progress {
    margin-top: 30px;
}

.lv_text {
    background-color: #fa2c19;
    border-radius: 15px;
    width: 80px;
    height: 40px;
    text-align: center;
}

.lv_text span {
    color: white;
    font-size: 80%;
}
</style>
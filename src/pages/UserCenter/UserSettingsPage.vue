<template>
    <view class="vert-wrapper align-center">
        <view class="round-card vert-wrapper align-center pt_20 pb_20 m_20 w_90p h_200">
            <view class="avatar_wrapper">
                <nut-avatar size="80"> <img :src="userInfo.userAvatar" /> </nut-avatar>
            </view>
        </view>
        <view class="round-card vert-wrapper align-center pt_20 pb_20 m_20 w_90p fgrow">
            <view class="hori-wrapper align-center">
                <span style="width: 80px; color: gray; font-size: 85%;">昵称</span>
                <nut-input type="text" v-model="userName" placeholder="请输入昵称" />
            </view>
            <view class="hori-wrapper align-center">
                <span style="width: 80px; color: gray; font-size: 85%;">手机</span>
                <nut-input type="number" v-model="userPhone" placeholder="请输入手机号" />
            </view>
            <view class="hori-wrapper space-between w_90p mt_20" style="padding-left: 20px">
                <span style="width: 80px; color: gray; font-size: 85%;">性别</span>
                <nut-radio-group v-model="userGender" direction="horizontal">
                    <nut-radio label="保密">保密</nut-radio>
                    <nut-radio label="男">男</nut-radio>
                    <nut-radio label="女">女</nut-radio>
                </nut-radio-group>
            </view>
        </view>
        <view class="w_90p">
            <nut-button class="user-setting-button" color="linear-gradient(to right, #ff38b6, #f71616)"
                @click="commitUserInfo">保存修改</nut-button>
        </view>
        <view class="w_90p">
            <nut-button class="user-setting-button" color="linear-gradient(to right, #d9d7d7, #737373)"
                @click="router.push('/user/user')">返回</nut-button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import '@/style/global.scss'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import Taro from '@tarojs/taro';
import { isPhoneNumber } from '@/utils/verifyUtil';

const store = useStore();
const router = useRouter();
const userInfo = computed(() => store.state.user)
const userPhone = ref()
const userName = ref('')
const userGender = ref('')

onMounted(() => {
    userName.value = userInfo.value.userName
    userPhone.value = userInfo.value.phone
    userGender.value = userInfo.value.gender
})

const commitUserInfo = async () => {
    if (!isPhoneNumber(userPhone.value)) {
        Taro.showToast({
            title: "手机号格式错误",
            icon: 'error'
        });
        return;
    }
    if (!userName.value) {
        Taro.showToast({
            title: "昵称不能为空",
            icon: 'error'
        });
        return;
    }
    try {
        const resp = await api.post('/user/update', {
            nickname: userName.value,
            phone: userPhone.value,
            gender: userGender.value
        });
        if (resp.expired) {
            router.push('/login');
            return
        }
        if (resp.error) {
            Taro.showToast({
                title: resp.error,
                icon: 'none'
            });
            console.log(resp.error);
        } else {
            Taro.showToast({
                title: "修改成功",
                icon: 'success'
            });
            store.commit('user/setUserInfo', {
                userId: userInfo.value.userId,
                openId: userInfo.value.openId,
                userName: userName.value,
                userAvatar: userInfo.value.userAvatar,
                gender: userGender.value,
                phone: userPhone.value,
                points: userInfo.value.points,
                exp: userInfo.value.exp,
                coupons: userInfo.value.coupons
            });
            router.push('/user/user');
        }
    } catch (error) {
        Taro.showToast({
            title: "修改失败",
            icon: 'error'
        });
        console.log(error);
    }
}


</script>

<style>
span.user-setting-key {
    width: 100px;
    font-size: 85%;
    color: gray;
}

.user-setting-button {
    margin: 20px;
    display: flex;
    flex-grow: 1;
}
</style>
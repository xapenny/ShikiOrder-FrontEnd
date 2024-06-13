<template>
    <view class="vert-wrapper mt_50p">
        <view class="title-wrapper vert-wrapper">
            <nut-avatar size="large"> <img src="https://python-gino.org/docs/zh/1.1b2/_static/favicon.ico" />
            </nut-avatar>
            <p>成为会员，立享更多优惠福利</p>
        </view>
        <view>
            <nut-button class="login-btn" color="linear-gradient(to right, #6bdf83, #4dbc76)"
                @click="handleLogin">微信一键登录</nut-button>
        </view>
    </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import '@/style/global.scss'

const router = useRouter();
const handleLogin = async () => {
    await Taro.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
            Taro.login({
                success: (res2) => {
                    if (res2.code) {
                        api.post('/user/login', {
                            code: res2.code,
                            nickname: res.userInfo.nickName,
                            avatar: res.userInfo.avatarUrl
                        }
                        ).then((resp) => {
                            if (resp.error) {
                                showDeniedModal(resp.error)
                                return
                            } else {
                                Taro.setStorageSync('bearer', resp.access_token)
                                router.push('/home')
                            }
                        });
                    } else {
                        showDeniedModal('登录失败！ ' + res2.errMsg)
                    }
                },
                fail: (res) => {
                    showDeniedModal('登录失败！' + res.errMsg)
                }
            })
        },
        fail: () => {
            showDeniedModal('你必须同意获取数据才能完成注册！')
        }
    })
}

const showDeniedModal = (msg: string) => {
    Taro.showModal({
        title: '提示',
        content: msg,
        showCancel: false
    })
}

</script>

<style>
.login-btn {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    display: flex;
    flex: 1;
    width: auto;
}

.title-wrapper {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.title-wrapper>p {
    margin-top: 50px;
    font-size: 36px;
    font-weight: bold;
}
</style>
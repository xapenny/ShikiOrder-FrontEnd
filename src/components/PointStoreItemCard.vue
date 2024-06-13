<template>
    <view class="point-item-card">
        <view class="point-image-container">
            <img :src="image" />
        </view>
        <view style="display: grid; margin: 0px 10px 10px 10px">
            <p>{{ title }}</p>
            <view style="display: grid; grid: 20px / 60% auto">
                <view style="display: flex; align-items: baseline; color: red; font-weight: bold;">
                    <span style="font-size: large;">{{ price
                        }}</span>
                    <span style="font-size: small;">积分</span>
                </view>

                <view @click="purchase"
                    style="display: flex; border-radius: 10px; width: 100%; height: 25px; color: white; justify-content: center; align-items: center; background-image: linear-gradient(to right, #ff3b3b, #ff00b3) !important">
                    <span style="font-size: small; font-weight: bold;">兑换</span>
                </view>
            </view>
        </view>

    </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import api from '@/services/api'
import { useStore } from 'vuex';

const store = useStore()
const props = defineProps({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
})

const purchase = () => {
    api.get(`/point-store/purchase?item=${props.id}`).then((resp) => {
        if (!resp.error) {
            Taro.showToast({
                title: '兑换成功',
                icon: 'success',
                duration: 2000
            })
            store.commit('user/consumePoints', props.price)
        } else {
            Taro.showToast({
                title: resp.error,
                icon: 'error',
                duration: 2000
            })
        }
    })
}

</script>

<style>
.point-item-card {
    height: 490px;
    background-color: white;
    display: grid;
    grid: auto;
    grid-gap: 5px;
    width: 100%;
    border-radius: 30px;
}


.point-image-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    /* 确保容器是相对定位，以便图片可以绝对定位填充容器 */
    position: relative;
}

.point-image-container img {
    /* 使图片填充整个容器 */
    width: 100%;
    height: 100%;
    /* 保持图片的宽高比并缩放以适应容器 */
    object-fit: cover;
    /* 或使用 'contain' 依据需要调整 */
    /* 确保图片在容器内居中 */
    position: absolute;
    top: 0;
    left: 0;
}
</style>
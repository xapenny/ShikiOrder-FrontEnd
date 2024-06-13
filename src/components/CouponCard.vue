<template>
    <view class="coupon-card-wrapper">
        <span style="font-size: medium; font-weight: bold;">{{ title }}</span>
        <span style="font-size: small; color: gray;">有效期至：{{ expire }}</span>
        <span style="font-size: small; color: gray;">使用条件：{{ requirement }}</span>
        <view style="grid-area: rightArea; display: flex; align-items: center; justify-content: center;">
            <span style="color: red; font-weight: bold; font-size: large;" v-if="available">{{ keyword }}</span>
            <span style="color: gray; font-weight: bold; font-size: large;" v-if="!available">{{ keyword }}</span>
        </view>
    </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
const props = defineProps({
    title: { type: String, required: true },
    keyword: { type: String, required: true },
    expire: { type: String, required: true },
    requirement: { type: String, required: true }
})

const available = dayjs().isBefore(dayjs(props.expire));

</script>

<style>
.coupon-card-wrapper {
    display: grid;
    grid:
        '. rightArea'
        '. rightArea'
        '. rightArea'
    ;
    grid-gap: 10px;
    margin: 15px;
    padding: 25px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}
</style>
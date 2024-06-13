<template>
    <view>
        <view class="map_view">
            <map id="map" style="width: 100%; height: 250px;" :longitude="currentLocation.longitude"
                :latitude="currentLocation.latitude" scale="11" :markers="markers" :show-location="true"
                @markertap="markertap"></map>
        </view>
        <view class="shop_list">
            <view class="scan-wrapper" @click="scanQR">
                <view class="qrscan-btn">
                    <span>扫描二维码</span>
                </view>
            </view>
            <li v-for="shop in shopList" :key="shop.id">
                <ShopCard :id="shop.id" />
            </li>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import ShopCard from '@/components/ShopCard.vue';
import Taro from '@tarojs/taro';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const shopList = computed(() => store.state.shop.all);
// Map related
const currentLocation = ref({
    latitude: 23.10229,
    longitude: 113.3245211
})
const markers = ref<any[]>([])

const markertap = (e) => {
    let shop = store.getters['shop/getShopById'](e.detail.markerId)
    store.commit('shop/setCurrentShop', shop)
    router.push('/home')
}

const scanQR = () => {
    Taro.scanCode({
        success: (res) => {
            res.result.split('&').forEach(pair => {
                let keyValue = pair.split("=");
                switch (keyValue[0]) {
                    case 'shopId':
                        store.commit('shop/setCurrentShop', store.getters['shop/getShopById'](parseInt(keyValue[1])))
                        break
                    case 'tableId':
                        store.commit('shop/setTableId', parseInt(keyValue[1]))
                        break
                }

            })
            router.push('/home')
        },
        fail: (res) => {
            Taro.showModal({
                title: '扫描失败',
                content: res.errMsg,
                showCancel: false
            })
        }
    })
}

onMounted(async () => {
    if (shopList.value.length === 0) {
        store.dispatch('shop/initialize')
    }
})

watchEffect(() => {
    if (shopList.value.length === 0) return
    markers.value = shopList.value.map((shop) => {
        let coordinate = store.getters['shop/getCoordinateById'](shop.id);
        return {
            id: shop.id,
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            width: 25,
            height: 40,
            callout: {
                content: shop.name,
                color: '#000000',
                display: "ALWAYS",
                borderWidth: 1,
                borderColor: '#000000',
                borderRadius: 5,
                bgColor: '#ffffff',
                padding: 5
            },
        }
    })
    Taro.getLocation({
        type: 'wgs84',
        success: function (res) {
            currentLocation.value = {
                latitude: res.latitude,
                longitude: res.longitude
            }
        }
    })
})


</script>

<style>
.map_view {
    position: relative;
    z-index: 0;
    height: 500px;
    margin-top: 10px;
    background-color: gray;
}

.map_view>p {
    text-align: center;
    vertical-align: middle;
}

.shop_list {
    display: grid;
    position: relative;
    z-index: 1;
    margin-top: -50px;
    border-radius: 50px;
    background-color: white;
    padding: 20px;
    gap: 20px;
    max-height: 900px;
    overflow-y: auto;
}

.scan-wrapper {
    display: flex;
    justify-content: center;
    height: 100px;

}

.qrscan-btn {
    width: 96%;
    height: 100px;
    border-radius: 25px;
    border-style: solid;
    border-width: 5px;
    border-color: black;
    background-color: green;
    display: flex;
    justify-content: center;
    align-items: center;
}

.qrscan-btn span {
    color: white;
    font-weight: bold;
    font-size: large;
}
</style>
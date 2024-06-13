<template>
    <view>
        <view style="display: block; max-height: 625px; overflow-y: auto;">
            <li v-for="orderId in orderIds" :key="orderId">
                <OrderCard :id="orderId" @click="router.push('/order/detail/' + orderId)" />
            </li>
            <span style="margin-top: 20px; text-align: center; color: grey; ">到底了，仅展示最近一年的订单</span>
        </view>
        <Footer />
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import OrderCard from '@/components/OrderCard.vue';
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import api from '@/services/api';

const store = useStore();
const router = useRouter();
const shop = computed(() => store.state.shop.currentShop)
const orderIds = ref([]);

onMounted(async () => {
    try {
        const resp = await api.get('/order/history?shop=' + shop.value.id);
        if (resp.expired) {
            router.push('/login');
            return
        }
        if (resp.error) {
            console.log(resp.error);
        } else {
            orderIds.value = resp.order_ids;
        }
    } catch (error) {
        console.log(error);
    }
})



</script>

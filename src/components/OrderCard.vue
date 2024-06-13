<template>
    <view class="order-card-wrapper">
        <view class="vert-wrapper">
            <view class="hori-wrapper align-center">
                <p id="shop">{{ orderInfo.shopName }}</p>
                <p id="status">{{ getOrderState(orderInfo.state) }}</p>
            </view>
            <view class="hori-wrapper align-center mt_20">
                <view class="w_70p">
                    <view class="hori-wrapper align-center">
                        <li v-for="(item, index) in products.slice(0, 4)" :key="index" class="ml_20">
                            <view class="vert-wrapper">
                                <img id="item-img" :src="item.image"></img>
                                <p id="item-title" class="w_100 overflow-text">{{ item.name }}</p>
                            </view>
                        </li>
                    </view>
                </view>
                <view class="numbers">
                    <view class="vert-wrapper">
                        <p id="price">¥{{ formatPrice(orderInfo.paidPrice) }}</p>
                        <p>共{{ calcQuantity(products) }}件</p>
                    </view>
                </view>
            </view>
        </view>

    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import '@/style/global.scss'
import { formatPrice } from '@/utils/priceUtil';
import api from '@/services/api';
import { useStore } from 'vuex';
import { getOrderState } from '@/utils/orderUtil';
import { useRouter } from 'vue-router';

const props = defineProps({
    id: { type: Number, required: true }
})
const store = useStore();
const router = useRouter();

const orderInfo = ref({
    shopName: '',
    state: 0,
    paidPrice: 0,
});

const calcQuantity = (products) => {
    return products.reduce((acc, product) => acc + product.quantity, 0);
}

const products = ref<any>([]);

onMounted(async () => {
    try {
        const resp = await api.get('/order/info?id=' + props.id);
        if (resp.expired) {
            router.push('/login');
            return
        }
        if (resp.error) {
            console.log(resp.error);
        } else {
            orderInfo.value = {
                shopName: resp.shop_name,
                state: resp.state,
                paidPrice: resp.paid_price
            }
            let tmpProcucts: Array<any> = [];
            for (let i = 0; i < resp.products.length; i++) {
                let productInfo = store.getters['products/getProductById'](resp.products[i][0]);
                if (!productInfo) {
                    continue;
                }
                tmpProcucts.push({
                    name: productInfo.name,
                    image: productInfo.image,
                    quantity: resp.products[i][1]
                });
            }
            products.value = tmpProcucts;
        }
    } catch (error) {
        console.log(error);
    }
})

</script>

<style>
.order-card-wrapper {
    background-color: white;
    border-radius: 20px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
    margin-left: 15px;
    margin-top: 15px;
    margin-right: 15px;
    padding-left: 15px;
    padding-top: 15px;
    height: 250px;
    flex: 1;
}

#shop {
    margin-top: 25px;
    margin-left: 25px;
    font-size: 36px;
    font-weight: bold;
    width: 70%;
}

#status {
    text-align: right;
    width: 30%;
    font-size: 30px;
    margin-top: 25px;
    margin-right: 35px;
    color: green;
}


.numbers {
    width: 30%;
    text-align: right;
    margin-right: 30px;
}

#price {
    font-size: 36px;
    font-weight: bold;
    color: red;
}

#item-img {
    width: 100px;
    height: 100px;
    border-radius: 20px;
}

#item-title {
    font-size: 24px;
    color: grey;
    text-align: center;
}
</style>
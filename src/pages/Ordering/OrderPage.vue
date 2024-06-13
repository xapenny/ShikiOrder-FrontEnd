<template>
    <view class="main-wrapper">
        <view class="cat-wrapper">
            <nut-category :category="category" @change="change" />
        </view>
        <view class="goods-list">
            <li v-for="currChild in categoryChild" :key="currChild">
                <ItemCard :id="currChild.id" :title="currChild.name" :price="currChild.price"
                    :imgurl="currChild.image" />
            </li>
        </view>
    </view>
    <CartBar />
    <Footer />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import ItemCard from '@/components/ItemCard.vue';
import Footer from '@/components/Footer.vue'
import CartBar from '@/components/ShoppingCart/CartBar.vue';

const store = useStore()

const category = computed(() => store.state.products.category)
const categoryChild = computed(() => store.state.products.categoryChild)

const change = (index) => {
    store.commit('products/changePage', { page: index })
}
</script>

<style>
.goods-list {
    /* margin-top: 10px; */
    /* width: 100%; */
    flex-grow: 1;
    height: 100%;
    /* position: absolute; */
    max-height: 85%;
    overflow-y: auto;
    padding-bottom: 20px;
}

.goods-list>li {
    display: flex;
}

.cat-wrapper {
    display: sticky;
    top: 0;
}

.main-wrapper {
    display: flex;
    /* flex-direction: row; */
    /* justify-content: space-between; */
    /* align-items: center; */
    padding: 10px;
    height: 90%;
    width: 97%;
    /* overflow: auto; */
    position: absolute;
}

.bottom-bar-wrapper {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.3);
    height: 200px;
}
</style>
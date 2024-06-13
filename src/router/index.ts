import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import UserPage from '@/pages/UserCenter/UserPage.vue';
import OrderPage from "@/pages/Ordering/OrderPage.vue";
import CheckoutPage from "@/pages/Ordering/CheckoutPage.vue";
import OrderManagementPage from "@/pages/Ordering/OrderManagementPage.vue";
import OrderDetailPage from "@/pages/Ordering/OrderDetailPage.vue";
import ShopSelectPage from '@/pages/ShopSelectPage.vue';
import UserLoginPage from "@/pages/UserCenter/UserLoginPage.vue";
import UserSettingsPage from "@/pages/UserCenter/UserSettingsPage.vue";
import CouponCenter from "@/pages/UserCenter/CouponCenter.vue";
import PointShop from "@/pages/UserCenter/PointShop.vue";

const routes = [
    {
        path: "/",
        name: "base_view",
        redirect: "/home",
        children: [
            {
                path: "home",
                name: "home_page",
                component: HomePage
            },
            {
                path: "select",
                name: "shop_select_page",
                component: ShopSelectPage,
            },
            {
                path: "order",
                name: "order_base",
                redirect: "/order/order",
                children: [
                    {
                        path: "/order/order",
                        name: "order_page",
                        component: OrderPage,
                    },
                    {
                        path: "/order/checkout",
                        name: "checkout_page",
                        component: CheckoutPage,
                    },
                    {
                        path: "/order/manage",
                        name: "order_manage_page",
                        component: OrderManagementPage
                    },
                    {
                        path: "/order/detail/:id",
                        name: "order_detail_page",
                        component: OrderDetailPage
                    }
                ]
            },
            {
                path: "user",
                name: "user_page",
                redirect: "/user/user",
                children: [
                    {
                        path: "/user/user",
                        name: "user_page",
                        component: UserPage
                    },
                    {
                        path: "/user/settings",
                        name: "user_settings_page",
                        component: UserSettingsPage
                    },
                    {
                        path: "/user/coupon",
                        name: "coupon_center",
                        component: CouponCenter
                    },
                    {
                        path: "/user/point",
                        name: "point_shop",
                        component: PointShop
                    }
                ]
            },
        ]
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/home"
    },
    {
        path: "/login",
        name: "login_view",
        component: UserLoginPage,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
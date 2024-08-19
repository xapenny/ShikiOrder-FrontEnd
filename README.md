# ShikiOrder 小程序端

ShikiOrder 是一个基于 Taro 框架开发的点餐小程序，旨在为用户提供便捷的移动点餐体验。项目名称源于由`Visual Art's/Key`开发的视觉小说`Summer Pockets REFLECTION BLUE`中的角色**神山識(Kamiyama Shiki)**。该项目使用了 Vue 3、NutUI 和 TypeScript 等技术栈，实现了从店铺选择、菜单浏览、购物车管理到订单支付的全流程功能。

## 功能特性

- **店铺选择**：用户可以通过地图定位或扫描二维码选择附近的店铺。
- **菜单浏览**：展示店铺的菜单，支持分类浏览和搜索功能。
- **购物车管理**：用户可以将喜欢的菜品加入购物车，并进行数量调整和删除操作。
- **订单支付**：支持在线支付，用户可以选择优惠券和积分抵扣。
- **用户中心**：用户可以查看订单历史、积分记录、优惠券等信息。

## 技术栈

- **Taro**：多端统一开发框架，支持微信小程序、H5、React Native 等。
- **Vue 3**：渐进式 JavaScript 框架，用于构建用户界面。
- **NutUI**：京东风格的轻量级移动端组件库。
- **TypeScript**：JavaScript 的超集，提供静态类型检查。
- **Webpack**：模块打包工具，用于构建和打包项目。

## 项目结构

```
ShikiOrder-FrontEnd/
├── config/                # 项目配置文件
├── src/                   # 源代码目录
│   ├── components/        # 公共组件
│   ├── pages/             # 页面组件
│   ├── services/          # API 服务
│   ├── store/             # Vuex 状态管理
│   ├── utils/             # 工具函数
│   ├── app.scss           # 全局样式
│   ├── index.html         # 入口 HTML 文件
│   └── main.ts            # 项目入口文件
├── package.json           # 项目依赖和脚本
├── project.config.json    # 小程序项目配置
├── babel.config.js        # Babel 配置
└── README.md              # 项目说明文档
```

## 安装与运行

### 环境要求

- Node.js >= 14.x
- Yarn 或 npm

### 安装依赖

```bash
yarn install
# 或
npm install
```

### 运行开发服务器(微信小程序)

```bash
yarn dev:weapp
# 或
npm run dev:weapp
```

### 构建生产版本(微信小程序)

```bash
yarn build:weapp
# 或
npm run build:weapp
```

## 许可证

本项目采用 [MIT 许可证](./LICENSE)。

---

感谢您对 ShikiOrder 项目的关注和支持！

# WeMall 一体化商城系统

WeMall 提供微信小程序用户端、React 管理后台以及 Node.js 后端服务，覆盖商品浏览、购物车、下单支付、积分、订单管理等基础闭环能力。

## 目录结构

```
backend/        # Node.js + Express + TypeORM REST API
miniprogram/    # 微信小程序前端
admin/          # React + Ant Design 管理后台
```

## 环境要求

- Node.js 18+
- npm 9+
- MySQL 8（本地开发可使用 docker-compose）
- 微信开发者工具（预览小程序）

## 后端服务

### 安装依赖

```bash
cd backend
npm install
```

### 本地运行（使用内置 sqlite）

```bash
npm run start:dev
```

### 使用 MySQL

1. 复制 `.env.example` 为 `.env` 并调整数据库配置。
2. 使用 `scripts/schema.sql` 初始化数据库结构。
3. 启动服务：

```bash
npm run start:dev
```

或通过 Docker 启动：

```bash
docker-compose up --build
```

### 单元测试

```bash
npm test
```

### 关键能力

- 微信手机号快捷登录（开发态使用 Mock 解密数据）。
- JWT 鉴权、请求日志与全局异常处理。
- 商品、分类、购物车、订单、支付回调、积分入账、管理员接口。
- 微信支付流程以 Mock 形式模拟签名与回调，可根据沙箱/生产环境替换 `common/utils/wechatpay.ts`。

## 微信小程序

1. 使用微信开发者工具导入 `miniprogram/` 目录。
2. 在 `app.js` 中调整 `apiBaseUrl` 指向后端地址。
3. 开发态登录通过「手机号快捷登录」按钮触发 `wx.login + getPhoneNumber`，后端返回 JWT。
4. 页面涵盖：首页、分类、商品详情、购物车、确认订单、订单列表/详情、我的（含积分）。

## 管理后台

1. 安装依赖并运行：

```bash
cd admin
npm install
npm run dev
```

2. 复制 `.env.example` 为 `.env` 配置后端 API 地址。
3. 使用“管理员口令”任意输入，即可调用后端 Mock 接口获取管理 Token。
4. 提供商品管理、类目管理、订单发货、积分规则维护等功能。

## 安全与合规注意事项

- 微信支付密钥仅存于服务端配置（`.env`）。
- `/pay/wechat/notify` 已预留签名验证逻辑，生产环境需替换为真实验签。
- 所有写操作通过 Zod 做参数校验并结合 TypeORM 保证库存/数量限制。
- `common/utils/idempotency.ts` 提供幂等执行工具，支付回调等敏感操作调用。

## 常见问题

- **如何预览支付流程？** 当前为 Mock 支付，回调接口 `/pay/wechat/notify` 接收 `orderNo`、`amount`，可在 Postman 或管理后台触发模拟。
- **如何查看积分？** 用户支付成功后立即记账，可在小程序「我的」页面查看余额与明细。
- **如何扩展用户管理？** 后端已提供 `users` 模块，可在 `admin` 目录新增页面并复用 `useApi` 进行扩展。

## 许可证

MIT

# Vue 3 + TSX 荔枝记账

## 介绍
![](http://162.14.109.133/images/lychee-introduce.png)

1. 荔枝记账是一款基于 Vue 3 + TSX 和现代前端技术栈构建的个人财务管理应用，专注于提供简洁易用、功能完善的记账体验。

2. 此项目采用了最新的Vue生态系统组件，如 Vue 3 作为核心框架，并结合 Vue Router 进行页面路由管理，通过路由守卫进行权限控制，确保了单页应用的高效与流畅。

3. 状态管理存储方面采用 Pinia。引用 Faker.js 来生成随机模拟数据。

4. 封装 Axios 请求统一管理后期维护，并且添加了全局请求和响应拦截器，请求拦截器中添加请求头携带登录令牌、显示 loading 加载提示，响应拦截器中针对不同错误情况做相应的错误处理。

5. 可视化层面使用 ECharts 展示各类财务统计数据，增强用户对收支明细的直观性。

6. 封装组件 Form、FormItem、Tabs、Button、Icon等，封装表单验证。

7. 使用 TypeScript 开发提升代码质量和可维护性，构建工具使用 Vite，配合相关插件 @vitejs/plugin-vue-jsx，采用 TSX 编写代码。

8. 登录方面您可以使用我提前准备好的邮箱及验证码直接登录，也可自行输入邮箱获取验证码登录。

## 启动
```bash
pnpm run dev
```

## 打包
```bash
pnpm run build
```

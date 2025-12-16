# 提刚助手 - Taro 跨端版本

> 基于 Taro 框架开发，支持 H5 网页端和微信小程序双端发布

## 技术栈

- **框架**: Taro 4.x + React 18
- **语言**: TypeScript
- **状态管理**: Zustand
- **样式**: SCSS + TailwindCSS (weapp-tailwindcss)

## 项目结构

```
src/
├── app.ts                 # 应用入口
├── app.config.ts          # 全局配置
├── pages/                 # 页面
│   ├── home/              # 首页（设置页）
│   ├── training/          # 训练页
│   └── complete/          # 完成页
├── components/            # 组件
│   ├── Button/            # 按钮组件
│   ├── Slider/            # 滑块组件
│   ├── ProgressRing/      # 环形进度条（Canvas）
│   ├── SettingsCard/      # 设置卡片
│   ├── CountdownScreen/   # 倒计时屏幕
│   └── ExerciseScreen/    # 运动画面
├── store/                 # 状态管理
├── hooks/                 # 自定义 Hooks
├── types/                 # 类型定义
├── utils/                 # 工具函数
└── styles/                # 全局样式
```

## 开发命令

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# H5 网页端
npm run dev:h5

# 微信小程序
npm run dev:weapp
```

### 生产构建

```bash
# H5 网页端
npm run build:h5

# 微信小程序
npm run build:weapp
```

## 部署说明

### H5 网页版（兼容原有 EdgeOne 托管）

本项目 H5 版本构建后输出到 `dist/` 目录（与原 Vite 项目一致），**完全兼容原有的 GitHub + EdgeOne 部署方式**。

1. 运行 `npm run build`（或 `npm run build:h5`）
2. 构建产物在 `dist/` 目录
3. 推送到 GitHub，EdgeOne 自动拉取部署

**域名兼容性**：
- 原域名 `kegel.sparkinspyer.com` 可继续使用
- 无需修改 EdgeOne 配置

### 微信小程序

1. 运行 `npm run build:weapp`
2. 使用微信开发者工具打开 `dist/weapp` 目录
3. 在项目设置中填入 AppID
4. 上传代码到微信后台
5. 提交审核并发布

## 注意事项

### 首次运行前

1. 修复 npm 缓存权限（如有问题）:
   ```bash
   sudo chown -R $(whoami):staff ~/.npm
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

### 微信小程序配置

1. 在 `project.config.json` 中替换 `appid` 为您的真实 AppID
2. 确保已在微信后台配置相关域名白名单

## 从原 React 项目迁移

本项目从 React + Vite 项目迁移而来，主要变更：

| 原项目 | Taro 项目 |
|--------|-----------|
| HTML 元素 | Taro 组件 (View/Text/Button) |
| framer-motion | CSS 动画 |
| SVG 进度环 | Canvas 绘制 |
| localStorage | Taro.setStorage |
| React Router | Taro 路由 |

## 版本

- v1.0.0 - 初始版本，完成跨端迁移


# 制卡大师 (Card Master)

移动端 React Native + Expo 应用，帮助用户自定义并导出卡牌形象。应用提供实时预览、图片裁切、品质与技能配置、反馈收集以及本地持久化与下载保存功能，无需网络即可使用。

## 功能概览
- **实时预览**：设置区的修改即时更新预览卡牌，支持下拉放大预览。
- **基础信息**：名称（≤15 字）、副标题（≤25 字）、品质单选（N/R/SR/SSR/UR，默认 SSR）。
- **图片处理**：从相册选择图片并进入 3:4 裁切，完成后填充至卡面，可随时重新选择。
- **技能信息**：两个技能槽，标题（≤10 字）、正文（≤120 字）、等级单选（D/C/B/A/S，默认 A）。仅当标题或正文存在时才展示对应技能。
- **说明页反馈**：通过“?” 打开反馈输入（默认占位文案，不超过 1000 字），校验后保存并提示成功。
- **下载保存**：点击下载按钮截取预览卡片图片并保存到系统相册。
- **本地存储**：使用 `expo-sqlite` 记录最新卡牌设置与反馈提交历史。

## 技术栈
- **框架**：React Native + Expo (TypeScript)
- **样式**：NativeWind (TailwindCSS)
- **图标**：`lucide-react-native`
- **存储**：`expo-sqlite`
- **媒体与导出**：`expo-image-picker`、`react-native-view-shot`、`expo-media-library`

## 项目结构
- `App.tsx`：应用入口，注入 Tailwind 与安全区域容器。
- `src/screens/CardMakerScreen.tsx`：主界面与交互逻辑，包含预览、设置、反馈、下载等。
- `src/utils/validation.ts`：通用校验与技能过滤逻辑。
- `__tests__/`：Jest 测试用例。

## 运行环境
- Node.js ≥ 24
- Expo CLI / `npx expo`（如需真机调试）
- iOS/Android 模拟器或真机

## 快速开始
```bash
npm install
npm start        # 启动开发服务器
npm run ios      # iOS 模拟器（macOS）
npm run android  # Android 模拟器
```

首次运行会请求相册与存储权限，用于选图、裁切和保存卡片。

> 安装依赖需要可访问 npm 官方仓库或可用的镜像源。如果遭遇 `403 Forbidden` 等网络限制，可改用内部镜像或离线安装包后再运行 `npm test`/`npm start`。

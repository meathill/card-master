# 部署说明

本项目基于 Expo，可通过以下方式分发：

1. **本地打包**：使用 `npx expo prebuild` 准备原生工程后，借助 EAS CLI 或本地 Xcode/Android Studio 打包。
2. **EAS Build**：
   - 配置 `eas.json`（未包含在本仓库，可根据目标平台新增）。
   - 运行 `npx eas build --platform ios` 或 `npx eas build --platform android`。
3. **发布更新**：使用 `npx expo publish` 推送 OTA（需要配置 Expo 账号）。

打包前请确保已安装依赖并通过 `npm test`，以及为图标、启动图等资产提供正式资源。

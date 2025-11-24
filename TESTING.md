# 测试指南

项目使用 Jest 与 `@testing-library/react-native` 进行单元与组件测试。

## 运行测试
1. 安装依赖：`npm install`
2. 执行：`npm test`

> 若因网络策略导致依赖无法从 `npmjs.org` 下载（如 403 Forbidden），请配置企业/镜像源或使用预下载的离线包再执行测试。

## 当前覆盖
- `src/utils/validation.ts`：文本截断、反馈校验、技能可见性过滤。

> 注：本地或 CI 环境需具备联网能力以安装 Expo 相关依赖。如受限，可通过离线缓存或私有镜像完成依赖安装。

# 开发记录

- 预览区通过 `Animated.ScrollView` 的下拉偏移对预览区域做等比缩放，松手即回弹。
- 选择菜单统一用自定义 `SelectionModal`，提供确定/取消以贴近需求描述。后续可替换为平台 ActionSheet。
- 下载逻辑依赖 `react-native-view-shot` + `expo-media-library`，需申请相册权限。
- SQLite 使用 `openDatabaseAsync` + `execAsync`/`runAsync` 存储最近的卡牌配置与反馈日志。

# 代码目录结构

## 整体目录
```
RM-UI-Designer
├─index.html           // Vite 入口 HTML
├─public               // 静态资源目录（构建时原样拷贝）
├─scripts              // 实用脚本目录
├─doc                  // 项目文档目录
├─serial_test          // 串口通信测试代码
├─src                  // 前端源码（TypeScript/React）
└─src-tauri            // Tauri 后端与打包配置
```

## 构建与配置相关文件
```
package.json           // 项目依赖与 npm script
tsconfig.json          // TypeScript 配置
vite.config.ts         // Vite 配置
typings.d.ts           // 全局类型声明
```

## src 目录
```
src
│  global.css                          // 全局样式
│  global.ts                           // 全局初始化逻辑（PWA、生成器加载、fabric 注入等）
│  loading.tsx                         // 加载动画组件
│  main.tsx                            // 前端主入口
├─assets                               // 静态资源
│  │  about.md                         // 关于页文档
│  │  eula.md                          // 许可协议文档
│  ├─code_template                     // 代码生成模板
│  │  ├─dynamic
│  │  └─static
│  └─fonts                             // 字体资源
├─components                           // 组件目录
│  │  appHelper.tsx                    // 带上下文 message、Modal 获取辅助
│  ├─generator                       // 代码生成器相关组件
│  │  │  checkPanel.tsx                // 第一步：代码问题检查
│  │  │  downloadPanel.tsx             // 第二步：代码下载
│  │  └─ index.tsx                     // 代码生成器主组件
│  ├─menu                            // 顶部菜单相关组件
│  │  │  checkedItem.tsx               // 菜单选中项组件
│  │  └─ menu.tsx                      // 顶部菜单栏组件
│  ├─modals                          // 弹窗组件
│  │  │  aboutModal.tsx                // 关于弹窗
│  │  │  eulaModal.tsx                 // 许可协议弹窗
│  │  │  formModal.tsx                 // 表单弹窗（frame 操作）
│  │  │  logDrawer.tsx                 // 日志抽屉
│  │  │  modeModal.tsx                 // 模式切换弹窗
│  │  │  rxDrawer.tsx                  // 接收数据抽屉
│  │  │  serialModal.tsx               // 串口配置弹窗
│  │  │  startupReleaseModal.tsx       // 启动版本提示弹窗
│  │  └─ updateModal.tsx               // 自动更新弹窗
│  └─render                          // 渲染区组件
│     │  color.tsx                     // 颜色展示组件
│     │  elements.tsx                  // 元素列表组件
│     │  render.tsx                    // 画布渲染主组件
│     └─ switchButton.tsx              // 带状态开关组件
├─pages
│  └─ index.tsx                        // 主页面
└─utils                              // 工具与业务逻辑
  │  app.ts                            // 全局 app 上下文辅助
  │  autoSaver.ts                      // 自动保存逻辑
  │  columns.tsx                       // 属性面板列定义
  │  fabricObjects.ts                  // 自定义 fabric 对象注册
  │  history.ts                        // 撤销/重做历史管理
  │  rmuiReader.ts                     // RMUI 文件读取与保存
  │  update.ts                         // 自动更新相关函数
  │  utils.ts                          // 通用杂项工具函数
  ├─controllers                      // fabric 控件实现
  │  │  arc.ts                         // 圆弧控件
  │  │  ellipse.ts                     // 椭圆控件
  │  │  float.ts                       // 浮点输入控件
  │  │  line.ts                        // 直线控件
  │  │  number.ts                      // 数值输入控件
  │  │  rect.ts                        // 矩形控件
  │  │  round.ts                       // 正圆控件
  │  └─ text.ts                        // 文本控件
  ├─generator                        // 代码生成逻辑
  │  │  frame.ts                       // frame 代码生成
  │  │  generatorHelper.ts             // 代码生成入口与调度
  │  │  group.ts                       // group 代码生成
  │  │  groupSplit.ts                  // group 拆包生成
  │  └─ toSerialMsg.ts                 // 生成串口消息
  └─serial                           // 串口通信逻辑
    │  crc.ts                          // CRC 校验函数
    │  logger.ts                       // 串口日志工具
    │  msgView.ts                      // 数据包解析展示
    │  packObject.ts                   // 对象打包为 Uint8Array
    │  serialTransformer.ts            // 串口流拆包转换
    │  webSerialFromDriver.ts          // 从机器人读取模式驱动
    └─ webSerialToDriver.ts            // 向裁判系统发送模式驱动
```

## 说明
- 当前前端已完成 TypeScript 化，源码文件以 `.ts/.tsx` 为主。
- 构建工具已切换为 Vite，入口为 `index.html`，构建配置见 `vite.config.ts`。
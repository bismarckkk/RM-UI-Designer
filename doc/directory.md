# 代码目录结构

## 整体目录
```
RM-UI-Designer
├─doc                 // 项目文档目录
├─public              // 编译后释放到根目录的文件
├─scripts             // 实用脚本目录
├─serial_test         // 用来进行串口通信的测试代码
├─src                 // 前端代码
└─src-tauri           // tauri warp代码                
```

## src目录
```
src
│  favicon.ico                  // 网站图标
│  global.css                   // 全局样式
│  global.js                    // 全局js，注册了PWA的sw线程，加载了代码生成器，并完成了一些对fabricjs的注入操作
│  loading.jsx                  // 加载动画组件
├─assets                    // 静态资源目录
│  │      about.md              // 关于页的markdown文件
│  │      eula.md               // 许可协议markdown文件
│  │      background.png        // 默认背景图
│  │      moon.svg              // 夜间模式图标
│  │      sun.svg               // 日间模式图标
│  │      rm_ui_generator.js    // 代码生成器入口文件，来自项目rm_ui_generator
│  │      rm_ui_generator.wasm  // 代码生成器程序文件，来自项目rm_ui_generator
│  ├─code_template              // 代码生成模板目录
│  └─fonts                      // 字体文件目录
├─components                // 组件目录
│  │      appHelper.jsx         // 与utils/app.js结合，用于获取带上下文的meassage、Modal方法
│  │      menu.jsx              // 顶部菜单栏
│  ├─generator                  // 代码生成器组件
│  │      checkPanel.jsx            // 代码问题检查面板（第一步）
│  │      downloadPanel.jsx         // 代码下载面板（第二步）
│  │      index.jsx                 // 代码生成器主组件
│  ├─modals                     // 弹窗组件目录
│  │      aboutModal.jsx            // 关于弹窗
│  │      formModal.jsx             // 表单弹窗（用于各种frame操作）
│  │      updateModal.jsx           // 自动更新弹窗
│  └─render                     // 渲染组件目录
│         color.jsx                 // 颜色展示组件
│         elements.jsx              // 元素列表组件
│         render.jsx                // 渲染组件
│         switchButton.jsx          // 带状态的开关组件
├─pages                     // 页面目录
│      index.jsx                // 主页面
└─utils                     // 工具目录
  │    app.ts                   // 与appHelper.jsx结合，用于获取带上下文的meassage、Modal方法
  │    columns.js               // 属性面板中各属性的渲染配置
  │    fabricObjects.js         // 自定义的fabricjs控件（见控件目录）
  │    history.js               // 操作历史记录
  │    rmuiReader.js            // RMUI文件读取与保存
  │    update.ts                // 自动更新相关函数
  │    utils.js                 // 其他杂项函数
  ├─controllers                 // fabricjs控件目录
  │      arc.js                     // 圆弧控件
  │      ellipse.js                 // 椭圆控件
  │      line.js                    // 直线控件
  │      rect.js                    // 矩形控件
  │      round.js                   // 正圆控件
  │      text.js                    // 文本控件
  ├─generator                   // 代码生成器相关代码
  │     generatorHelper.js          // 代码生成类入口
  │     frame.js                    // frame代码生成
  │     group.js                    // group代码生成（每个group会被切分成数个split（消息包））
  │     groupSplit.js               // group代码生成
  │     object.js                   // 单个元素代码生成
  └serial                       // 串口通信相关代码
        crc.ts                      // CRC校验函数
        logger.ts                   // 日志库
        msgView.ts                  // 从uint8Array数据包中解析信息
        packObject.ts               // 将对象打包成uint8Array
        serialTransformer.ts        // 将串口数据流拆分成数据包
        webSerialFromDriver.js      // 从机器人读取模式串口驱动
        webSerialToDriver.js        // 向裁判系统发送模式串口驱动
```
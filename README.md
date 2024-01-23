# RoboMaster UI Designer

### Online Demo: [http://ui.bismarck.xyz/](http://ui.bismarck.xyz/)

## 自行部署
本项目为纯前端项目，可直接部署在任何静态服务器上，如Nginx、Apache等，在线demo使用Github Pages托管，
在`gh-pages`分支上可以找到自动构建的静态文件，
如需自行构建可以参考以下步骤：
```shell
git clone https://github.com/bismarckkk/RM-UI-Designer.git
cd RM-UI-Designer
yarn
yarn build
```

## 路线图
- 基本组件
  - [x] 直线
  - [x] 矩形
  - [x] 正圆
  - [x] 椭圆
  - [ ] 文本
  - [x] 圆弧
  - [x] 自定义背景图
- 高级组件
  - [ ] 旋转矩形
  - [ ] 平行四边形
  - [ ] 路径
- 编辑功能
  - [x] 拖拽
  - [x] 缩放
  - [ ] 通过缩放翻转
  - [ ] 撤销/重做🔥
  - [ ] 多选🔥
  - [x] 复制/粘贴
  - [x] 删除
  - [x] 自动保存到浏览器
  - [x] 保存/读取文件
  - [x] 在同一工程中切换frame
- 高级功能
  - [ ] 生成代码
  - [ ] UI模拟器
  - [ ] 保存为PWA应用


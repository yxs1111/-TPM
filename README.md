# April-UI

>~~基于[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)~~  
>~~主体是ElementUI，所有开发规范都可依照elementUI进行~~

>由于vue-element-admin截止2021.5.28已经长久没有更新，而Vue已经升级到3.0，且ElementUI也已升级到对应版本，
>至此，不再延续vue-element-admin的开发模式（其示例与API暂时也无法访问了）。

*基于Vue3.0及Element Plus*，to be continued


- [开始](#开始)
- [发布](#发布)
- [其他](#其他)


## 开始

```bash
# 克隆项目
git clone https://gitlab.jbinfo.work/qy_wanghongqun/april-ui.git

# 进入项目目录
cd april-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其他

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

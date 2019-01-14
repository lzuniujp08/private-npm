### npm私有仓库的使用和Vue组建发布与调用

##### 本文涉及内容包括：
1. 用sinopia搭建npm私服
2. 如何在本地使用npm私服；
3. 如何编写Vue组建；
4. 如何将已编写好的Vue组建发布到npm私服；
5. 如何调用已发布的Vue组建。

#### 一、用sinopia搭建npm私服
>[用sinopia搭建npm私服](https://www.cnblogs.com/LittleSix/p/6053549.html)

[内网私服地址](http://10.16.48.184:4873/)

登录信息：admin/admin, lzugis/lzugis

#### 二、如何在本地使用npm私服
为方便管理**npm registry**，我们需要安装**nrm**，安装和基本语法说明如下：
```
# 全局安装nrm
npm install -g nrm

# 查看已安装镜像
nrm ls

# 添加内网npm镜像地址
nrm add jtnpm http://10.16.48.184:4873/ 

# 使用镜像地址
nrm use jtnpm
```
```nrm ls```的运行结果如下：
```
npm ---- https://registry.npmjs.org/
cnpm --- http://r.cnpmjs.org/
taobao - https://registry.npm.taobao.org/
nj ----- https://registry.nodejitsu.com/
rednpm - http://registry.mirror.cqupt.edu.cn/
npmMirror  https://skimdb.npmjs.com/registry/
edunpm - http://registry.enpmjs.org/
* jtnpm -- http://10.16.48.184:4873/
```
**说明：**

```jtnpm```是在使用了```nrm use jtnpm```后的效果，表示当前使用的npm镜像；

#### 三、如何编写Vue组建
##### 3.1 手写
>[如何制作并发布一个vue的组件的npm包](https://blog.csdn.net/hamupp/article/details/79337643)

##### 3.2 vue-cli
>[Vue-Cli 3 构建项目并发布npm包](https://blog.csdn.net/github_36820944/article/details/82597264)

>[Vue-Cli 3 构建项目并发布npm包](https://blog.csdn.net/Fundebug/article/details/80620683)

```
# 0.安装或卸载vue-cli
npm uninstall -g vue-cli
npm install -g @vue/cli
  
# 1.用cli构建vue项目
vue create lzugis-vue
```
**说明：**

```vue-components```是一个已经创建好的工程，大家可在此基础上添加我们的公用组件。

#### 四、如何将已编写好的Vue组建发布到npm私服
>[npm publish 发布自己的模块（发布包）](https://blog.csdn.net/hsany330/article/details/78627352)

##### npm发布和撤销包
```
# 发布
npm publish package-name

# 撤销发布
npm unpublish package-name

# 强制撤销发布
npm unpublish package-name --force
```
**说明：**

1. ```vue-components```是一个已经创建好的工程，大家可在此基础上添加我们的公用组件。
2. ```npm unpublish```命令执行的时候一般会有权限的问题，所以一般我们在使用的时候会在后面添加```--force```参数；
3. ```npm publish```是可带package-name参数的，但是会存在权限问题，所以，一般直接读取配置文件里面的参数；

#### 五、如何调用已发布的Vue组建
### 1.导入组件
```
npm install jt-components --save
```

### 2.在项目中使用组件
#### 2.1 图例组件
```
<gw-legend
 :legend="legendData"
 class="u-legend"/>

import gwLegend from 'jt-components/src/components/gw-legend';

components: {
  ......,
  GwLegend
}
```

#### 2.2 时间轴组件
```
<gw-time-line
  v-if="timelineShow"
  ref="tl"
  :default-index="0"
  :speed="800"
  :data="timelineData"
  class="u-timeline"
  @callback="timelineCb"/>

import gwTimeLine from 'jt-components/src/components/gw-timeline';

components: {
  ......,
  gwTimeLine
}
```

**注意：**

1. ```npm install jt-components```有时会存在权限或者仓库不存在的问题，如遇到此问题，我们可通过命令```nrm use npm```切换到npm环境，安装完之后再切换为```jtnpm```环境。
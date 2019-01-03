### npm私服使用和Vue组建发布与调用

##### 本文涉及内容包括：
1. 如何在本地使用npm私服；
2. 如何编写Vue组建；
3. 如何将已编写好的Vue组建发布到npm私服；
4. 如何调用已发布的Vue组建。

#### 一、如何在本地使用npm私服
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
* ```* jtnpm```是在使用了```nrm use jtnpm```后的效果，表示当前使用的npm镜像；
#### 二、如何编写Vue组建
##### 2.1 手写
[如何制作并发布一个vue的组件的npm包](https://blog.csdn.net/hamupp/article/details/79337643)

##### 2.2 vue-cli
[Vue-Cli 3 构建项目并发布npm包](https://blog.csdn.net/github_36820944/article/details/82597264)

#### 三、如何将已编写好的Vue组建发布到npm私服
[npm publish 发布自己的模块（发布包）](https://blog.csdn.net/hsany330/article/details/78627352)


#### 四、如何调用已发布的Vue组建
```
# 1.导入组建
npm install lzugis-say-hello --save

# 2.在项目中使用组建
import SayHello from 'lzugis-say-hello'

components: {
  ......,
  SayHello
}

<say-hello :data="sayData"/>
```


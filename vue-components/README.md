# 玖天组件库

## 玖天的公用组件库，包括：图例、时间轴等。

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

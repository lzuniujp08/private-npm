<template>
  <div
    v-show="legend.length > 0"
    class="gw-map-legend">
    <div
      v-for="(color, index) in legend"
      :key="index"
      :class="color.code === 'ylj_mudflow'?'legend-dzzh':''">
      <div
        v-show="!legendShow"
        class="legend-title"
        @click="toggleLegend">
        <!-- {{ color.unit ? '('+color.unit+')' : '' }}-->
        <i class="icon-tuli"/>
      </div>
      <transition name="el-fade-in-linear">
        <div class="legend-bg">
          <span
            v-show="legendShow"
            class="legend-name">{{ color.unit ? '(' + color.unit + ')' : '' }}</span>
          <span
            v-show="legendShow"
            class="legend-closer"
            @click="legendShow = false"/>
          <ul
            v-show="legendShow"
            :style="{marginRight: getMarginRight(color.unit,color.colors)}"
            class="legend-color">
            <li
              v-for="(color,index) in color.colors"
              :key="index"
              :style="{background: getColor(color.color)}"
              class="legend-item">
              <div :style="{width: getLabelWidth(color.lable)}">
                <span
                  :style="{marginLeft: getLabelStyle(color.lable)}"
                  class="legend-lable">
                  {{ getLabel(color.lable) }}
                </span>
                <!--<span class="legend-lable">{{ color.lable.substring(color.lable.length-2,color.lable.length) }}</span>-->
              </div>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    legend: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      legendShow: true
    };
  },
  mounted() {},
  methods: {
    getLabel(lable) {
      const lables = lable.split('~');
      let lbl = lables[0];
      if (lables[1]) {
        lbl = lables[1];
      }
      if (lbl.indexOf('>') !== -1) {
        lbl = '';
      }
      lbl = lbl.replace('>', '');
      lbl = lbl.replace('=', '');
      lbl = lbl.replace('<', '');
      lbl = lbl.replace('≥', '');
      return lbl;
    },
    getColor(color) {
      const colors = color.split(',');
      let c =
        'rgba(' +
        parseInt(colors[0]) +
        ',' +
        parseInt(colors[1]) +
        ',' +
        parseInt(colors[2]) +
        ',' +
        parseInt(colors[3]) +
        ')';
      return c;
    },
    getLabelStyle(lable) {
      const lables = lable.split('~');
      const numRule = /[0-9]/;
      if (numRule.test(lables[0])) {
        return '15px';
      } else {
        return '0';
      }
    },
    getLabelWidth(lable) {
      let lables = lable.split('~')[0];
      lables = lables.replace('=', '');
      lables = lables.replace('<', '');
      let size = this.getsStrlen(lables);
      return size * 9 + 'px';
    },
    getMarginRight(unit, colors) {
      let marginRight = unit ? '45px' : '30px';
      let lable = colors[colors.length - 1].lable;
      if (lable.indexOf('>') !== -1) {
        marginRight = '30px';
      }
      return marginRight;
    },
    getsStrlen(str) {
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        // 单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
          len++;
        } else {
          len += 2;
        }
      }
      return len;
    },
    toggleLegend() {
      this.legendShow = !this.legendShow;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/iconfont.css';
$height: 32px;
$background: #353a50;
$background-opacity: 0.8;

.gw-map-legend {
  font-size: 12px;
  position: absolute;
  left: 15px;
  bottom: 15px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  .legend-title {
    height: $height;
    line-height: 36px;
    padding: 0;
    font-weight: bold;
    cursor: pointer;
    float: left;
    background: $background;
    opacity: $background-opacity;
    width: 32px;
    border-radius: 3px;
    text-align: center;
    margin-top: 28px;
    color: white;
    i {
      font-size: 15px !important;
    }
  }
  .legend-bg {
    display: inline-block;
    background: $background;
    opacity: $background-opacity;
    line-height: 40px;
    height: 40px;
    margin-left: 10px;
    border-radius: 3px;
    text-align: center;
    .legend-name {
      position: absolute;
      right: 4px;
      top: 10px;
      color: #bbbebd;
    }
    .legend-lable {
      margin-left: 16px;
    }
  }
  .legend-color {
    float: left;
    margin: 10px 45px 10px 10px;
    padding: 0;
    list-style: none;
    background-color: white;
    border-radius: 4px;
    li.legend-item {
      float: left;
      color: black;
      div {
        mix-blend-mode: difference;
        height: 10px;
        line-height: 40px;
        padding: 0 4px;
        color: #bbbebd;
        min-width: 26px;
        width: 26px;
      }
      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
    }
  }
  .legend-closer {
    text-decoration: none;
    position: absolute;
    top: -5px;
    right: 6px;
    cursor: pointer;
    color: #bbbebd;
    font-size: 30px;
    &::after {
      content: '×';
    }
  }
}
.legend-dzzh {
  .legend-bg {
    .legend-color {
      .legend-item {
        div {
          width: 70px;
          .legend-lable {
            margin-left: -70px;
          }
        }
      }
    }
  }
}
</style>

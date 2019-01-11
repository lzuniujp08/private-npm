<template>
  <div v-show="data.length>0">
    <div
      ref="elem"
      class="timeline-wrapper">
      <div
        :style="timeStyle"
        class="time">
        <!-- <div class="time-bar control"></div> -->
        <div
          class="time-bar clickable"
          @mousemove="timeBarMousevoerEvt"
          @click="timeBarClickEvt"
          @mouseleave="timeBarMouseoutEvt">
          <div class="time-bar total"/>
          <div
            :style="{width:currentPos+'px'}"
            class="time-bar played"/>
        </div>
        <div
          v-show="currentShow"
          :style="{left:(Number(currentPos)+50)+'px'}"
          class="select-tooltip tooltip">
          <div class="box">
            {{ currentTime }}
          </div>
        </div>
        <transition name="flow-fade">
          <div
            v-show="flowShow"
            :style="{left:(Number(flowPos)+50)+'px'}"
            class="flow-tooltip tooltip">
            <div class="box">
              {{ flowTime }}
            </div>
          </div>
        </transition>
      </div>
      <div class="calendar">
        <ul class="calendar-piecewise">
          <li
            class="control clickable"
            @click="playControl">
            <span v-if="!isPlay">
              <!--播放-->
              <i class="icon-bofang"/>
            </span>
            <span v-else>
              <!--暂停-->
              <i class="icon-zanting"/>
            </span>
          </li>
          <li
            v-for="(piecewiseObj,index) in calendarData"
            :key="index"
            :style="{width:piecewiseObj.width}"
            class="calendar-piecewise-item clickable">
            <span class="calendar-piecewise-item-label">{{ piecewiseObj.label }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeLine',
  props: {
    width: {
      type: [Number, String],
      default: 'auto'
    },
    /** 自动播放 */
    autoPlay: {
      type: Boolean,
      default: false
    },
    /** 播放速度 默认为1.5秒 */
    speed: {
      type: Number,
      default: 1500
    },
    /** 时间步长 默认为1小时 */
    step: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: () => []
    },
    /** 初始日期 */
    defaultValue: {
      type: [Number],
      default: null
    },
    /* 初始索引 */
    defaultIndex: {
      type: [String, Number, Array],
      default: null
    }
  },
  data() {
    return {
      size: 0,
      currentPos: 0, // 当前显示时间坐标 px
      flowPos: 0, // 鼠标滑动得时间坐标 px
      flowShow: false, // 是否显示滑动时间
      currentShow: false, // 是否显示选择的时间
      isPlay: false, // 是否开始
      currentTime: '', // 当前时间
      flowTime: '', // 滑动时间
      value: '',
      index: null,
      gap: null,
      calendarData: [],
      timeOut: null
    };
  },
  computed: {
    total() {
      return this.data && this.data.length;
    },
    timeStyle() {
      return {
        width: this.size - 50 + 'px'
      };
    },
    startTime() {
      return this.data && this.string2Date(this.data[0].time);
    },
    endTime() {
      return (
        this.data && this.string2Date(this.data[this.data.length - 1].time)
      );
    }
  },
  watch: {
    defaultValue(val) {
      this.setValue(val, false, true);
    },
    show(bool) {
      if (bool && !this.size) {
        this.nextTick(() => {
          this.refresh();
        });
      }
    },
    currentTime(val) {
      if (val !== '') this.currentShow = true;
    }
  },
  mounted() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    this.DatePrototypeAdd();
    this.$nextTick(() => {
      this.getStaticData();
      this.generateCalendar();
      this.defaultIndex !== null && this.setIndex(this.defaultIndex);
      this.defaultValue !== null &&
        this.setValue(this.defaultValue, false, true);
      this.bindEvents();
    });
  },
  beforeDestroy() {
    this.unbindEvents();
  },
  methods: {
    bindEvents() {
      // window.addEventListener('resize', this.refresh);
    },
    unbindEvents() {
      // window.removeEventListener('resize', this.refresh);
      // document.removeEventListener('mousemove', this.moving)
      // document.removeEventListener('mouseup', this.moveEnd)
      // document.removeEventListener('mouseleave', this.moveEnd)
    },
    refresh() {
      if (this.$refs.elem) {
        this.getStaticData();
        this.setPosition(this.value);
      }
    },
    getStaticData() {
      if (this.$refs.elem) {
        this.size = this.$refs.elem.offsetWidth;
      }
    },
    /**
     * 根据索引设置当前时间轴的值
     * @param val 索引
     */
    setIndex(val) {
      if (val < this.total) {
        this.index = val;
        this.setValue(this.data[val].time, false, false);
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[Vue-timeline error]: 超出数据最大索引范围');
        }
      }
    },
    /**
     * 根据时间字符串设置当前时间轴的值
     * @param val 时间字符串
     * @param noCb 是否有回调函数
     * @param update 更新索引
     */
    setValue(val, noCb, update) {
      if (this.isDiff(this.value, val)) {
        // let resetVal = this.limitValue(val);
        // if (resetVal !== false) {
        //   this.val = resetVal;
        // } else {
        //   this.val = val;
        // }
        this.value = val;
        update && this.updateIndex(val);
        this.syncValue(noCb);
      }
      this.setPosition(val);
      // this.$nextTick(() => this.setPosition(val));
    },
    updateIndex(val) {
      this.data.forEach((value, index) => {
        if (!this.isDiff(value.time, val)) {
          this.index = index;
        }
      });
    },
    /**
     * 根据时间字符串设定select-tooltip的位置 (绘制)
     * @param val 时间字符串
     */
    setPosition(val) {
      const totalMsec = Math.floor((this.endTime - this.startTime) / 1000);
      const valueTime = this.string2Date(val);
      this.gap = (this.size - 50) / totalMsec;
      this.currentPos =
        Math.floor((valueTime - this.startTime) / 1000) * this.gap;
      this.currentTime =
        this.fetchWeekDay(valueTime) +
        val.substring(6, 8) +
        '-' +
        val.substring(8, 10) +
        ':' +
        val.substring(10, 12);
    },
    syncValue(noCb) {
      noCb || this.$emit('callback', this.index);
    },
    /**
     * 日历单击事件(回到当前分钟)
     */
    piecewiseClickEvt(piecewiseObj) {
      this.setValue(piecewiseObj.time.substring(0, 12), false, true);
    },
    timeBarMousevoerEvt(e) {
      this.flowPos = e.offsetX;
      // let flowDate;
      const hours = Math.round(e.offsetX / this.gap);
      const startTime = this.string2Date(this.data[0].time);
      let value = new Date(
        startTime.setMinutes(startTime.getMinutes() + hours / 60)
      );
      // 判断value离哪个数据时间点更近
      let dataValue;
      let minInterval;
      for (let i = 0; i < this.data.length; i++) {
        let timeInterval = Math.abs(
          value - this.string2Date(this.data[i].time)
        );
        if (i === 0) {
          minInterval = timeInterval;
          dataValue = this.data[i].time;
        } else {
          if (timeInterval < minInterval) {
            minInterval = timeInterval;
            dataValue = this.data[i].time;
          }
        }
      }
      this.flowTime =
        dataValue.substring(8, 10) + ':' + dataValue.substring(10, 12);
      this.flowShow = true;
    },
    timeBarMouseoutEvt(e) {
      this.flowShow = false;
    },
    timeBarClickEvt(e) {
      const hours = Math.round(e.offsetX / this.gap);
      const startTime = this.string2Date(this.data[0].time);
      let value = new Date(
        startTime.setMinutes(startTime.getMinutes() + hours / 60)
      );
      // 判断value离哪个数据时间点更近
      let dataValue;
      let minInterval;
      for (let i = 0; i < this.data.length; i++) {
        let timeInterval = Math.abs(
          value - this.string2Date(this.data[i].time)
        );
        if (i === 0) {
          minInterval = timeInterval;
          dataValue = this.data[i].time;
        } else {
          if (timeInterval < minInterval) {
            minInterval = timeInterval;
            dataValue = this.data[i].time;
          }
        }
      }
      this.setValue(dataValue, false, true);
    },
    /**
     * 控制播放暂停
     */
    playControl() {
      this.isPlay = !this.isPlay;
      if (this.isPlay) {
        const that = this;
        (function foo() {
          that.setIndex(++that.index);
          if (that.index < that.total - 1 && that.isPlay) {
            that.timeOut = setTimeout(foo, that.speed);
          }
          if (that.index === that.total - 1) {
            that.isPlay = !that.isPlay;
            that.index = -1;
            that.autoPlay && that.playControl();
          }
        })();
      } else {
        clearTimeout(this.timeOut);
      }
    },
    /**
     * 生成下方日历条
     */
    generateCalendar() {
      this.calendarData = [];
      const totalHours = Math.floor((this.endTime - this.startTime) / 1000);
      if (this.startTime.getDate() === this.endTime.getDate()) {
        /* let label =
          this.startTime.getDate() +
          '日(' +
          this.fetchWeekDay(this.startTime) +
          ')'; */
        // 说明在一天之内
        this.calendarData = [
          {
            label: this.fetchWeekDay(this.startTime) + this.startTime.getDate(),
            index: 0,
            time: this.startTime.format('yyyyMMdd') + '120000',
            width: this.size - 50 - 1 + 'px'
          }
        ];
      } else {
        // 超过一天
        let startWidth =
          ((24 - this.startTime.getHours()) * 3600 * (this.size - 50)) /
            totalHours -
          1;
        /* let labelStart =
          this.startTime.getDate() +
          '日(' +
          this.fetchWeekDay(this.startTime) +
          ')'; */
        this.calendarData = [
          {
            label: this.fetchWeekDay(this.startTime) + this.startTime.getDate(),
            index: 0,
            time: this.startTime.format('yyyyMMdd') + '120000',
            width: startWidth + 'px'
          }
        ];
        const gapHours =
          totalHours -
          (24 - this.startTime.getHours()) * 3600 -
          this.endTime.getHours() * 3600;
        if (gapHours >= 24 * 3600) {
          const gapDays = Math.floor(gapHours / 3600 / 24);
          for (let i = 1; i <= gapDays; i++) {
            let dateTemp = new Date(this.startTime);
            const date = new Date(
              dateTemp.setDate(this.startTime.getDate() + 1 * i)
            );
            dateTemp = null;
            /* const label =
              date.getDate() + '日(' + this.fetchWeekDay(date) + ')'; */
            this.calendarData.push({
              label: this.fetchWeekDay(date) + date.getDate(),
              index: i,
              time: date.format('yyyyMMdd') + '120000',
              width: (24 * 3600 * (this.size - 50)) / totalHours - 1 + 'px'
            });
          }
        }
        let endWidth =
          (this.endTime.getHours() * 3600 * (this.size - 50)) / totalHours - 1;
        /*  let labelEnd =
          this.endTime.getDate() +
          '日(' +
          this.fetchWeekDay(this.endTime) +
          ')'; */
        this.calendarData.push({
          label: this.fetchWeekDay(this.endTime) + this.endTime.getDate(),
          index: gapHours + 1,
          time: this.endTime.format('yyyyMMdd') + '120000',
          width: endWidth + 'px'
        });
      }
    },
    isDiff(a, b) {
      if (
        Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)
      ) {
        return true;
      } else if (Array.isArray(a) && a.length === b.length) {
        return a.some((v, i) => v !== b[i]);
      }
      return a !== b;
    },
    DatePrototypeAdd() {
      /* eslint-disable no-extend-native */
      Date.prototype.format = function(fmt) {
        let o = {
          'M+': this.getMonth() + 1, // 月份
          'd+': this.getDate(), // 日
          'h+': this.getHours(), // 小时
          'm+': this.getMinutes(), // 分
          's+': this.getSeconds(), // 秒
          'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
          S: this.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length)
          );
        }
        for (let k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length === 1
                ? o[k]
                : ('00' + o[k]).substr(('' + o[k]).length)
            );
          }
        }
        return fmt;
      };
    },
    /**
     * 根据date对象生成相应的星期
     */
    fetchWeekDay(date) {
      const index = date.getDay();
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekdays[index];
    },
    /**
     *  接口字符串时间转换成date对象
     */
    string2Date(str) {
      return new Date(
        str.substring(0, 4) +
          '/' +
          str.substring(4, 6) +
          '/' +
          str.substring(6, 8) +
          ' ' +
          str.substring(8, 10) +
          ':' +
          str.substring(10, 12)
      );
    },
    resetTimeline() {
      clearTimeout(this.timeOut);
      this.value = '';
      this.setIndex(0);
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../../assets/iconfont.css';

$timebar-color: #ffaf3c;
$currenttip-color: #9d0300;
$flowtip-color: #9d0300;
$background: #353a50;
$background-opacity: 0.8;

.timeline-wrapper {
  // position: relative;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  user-select: none;
}

.time {
  height: auto;
  .time-bar {
    width: 100%;
    height: 6px;
    cursor: pointer;
    position: relative;
    // border-top: 10px solid transparent;
    // border-bottom: 10px solid transparent;
    background-clip: padding-box;
    float: left;
    transition: width ease-in-out 0.2s;
    &.clickable {
      left: 50px;
    }
    .played {
      position: absolute;
      top: 0;
      background: $timebar-color;
    }
    .total {
      width: 100%;
      float: none;
      background: #fffffd;
      border-top-right-radius: 3px;
    }
  }
  &::before {
    content: '';
    height: 6px;
    width: 50px;
    background: $timebar-color;
    position: absolute;
    left: 0;
    border-top-left-radius: 3px;
  }
}

.calendar {
  position: absolute;
  left: 0;
  top: 6px;
  height: auto;
  width: 100%;
  white-space: nowrap;
  .calendar-piecewise {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0px;
    li {
      display: inline-block;
      box-sizing: border-box;
      text-align: left;
      padding: 8px 0 0 15px;
      font-size: 12px;
      height: 32px;
      white-space: nowrap;
      overflow: hidden;
      color: #bbbebd;
      opacity: $background-opacity;
      background-color: $background;
      margin-left: 1px;
      &:last-child {
        border-bottom-right-radius: 3px;
      }
      &:first-child {
        border-bottom-left-radius: 3px;
      }
    }
  }
  .clickable:hover {
    opacity: $background-opacity;
  }
}

.tooltip {
  font-size: 10px;
  position: absolute;
  display: block;
  box-sizing: border-box;
  top: -2.6em;
  margin-left: -2em;
  .box {
    cursor: -webkit-grab;
    cursor: -moz-grab;
    cursor: grab;
    position: relative;
    background: #66b1ff;
    color: black;
    height: 2em;
    box-sizing: border-box;
    padding: 0.3em 0.8em;
    white-space: nowrap;
    text-align: center;
    display: inline-block;
    font-family: Verdana, sans-serif;
    &::after {
      top: 100%;
      left: 2em;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      border-top-color: #66b1ff;
      border-width: 0.5em;
      margin-left: -0.5em;
    }
  }
}

.flow-tooltip {
  pointer-events: none;
  .box {
    cursor: pointer;
    color: white;
    background: $flowtip-color;
    &::after {
      border-top-color: $flowtip-color;
    }
  }
}

.flow-fade-enter-active {
  transition: opacity 0.5s;
}
.flow-fade-leave-active {
  transition: opacity 0.5s;
}
.flow-fade-enter,
.flow-fade-leave-to {
  opacity: 0;
}

.control {
  width: 50px;
  margin: 0 !important;
  &.time-bar {
    height: 6px;
    background: $timebar-color;
  }
}
</style>

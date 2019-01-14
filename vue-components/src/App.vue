<template>
  <div id="app">
    <div class="marquee-wrap">
			<gw-legend
        :legend="legendData"
        class="u-legend"/>
		</div>
  </div>
</template>

<script>
import GwLegend from './components/gw-legend/index.vue';

export default {
  name: 'app',
  components: {
    GwLegend
  },
  data: function () {
    return {
      legendData: [{
        'id': 'db117aa78b574a9fab3382782e4b3018',
        'code': 'hspt_sum_pre',
        'name': '累积降水',
        'unit': '',
        'details': '',
        'preprocessClass': '',
        'projectCode': null,
        'legendColor': null,
        'colors': [{
          'id': '6f6ae37824b54cba98c81374fdab2bd1',
          'legendCode': 'hspt_sum_pre',
          'color': '2,220,202,255',
          'lable': '小雨',
          'sortBy': 1,
          'projectCode': null
        }, {
          'id': 'c5b1b9c7b5f84e0cb3b67a6109761583',
          'legendCode': 'hspt_sum_pre',
          'color': '0,128,210,255',
          'lable': '中雨',
          'sortBy': 2,
          'projectCode': null
        }, {
          'id': '3e41d8ad884f40b88567c79678b47758',
          'legendCode': 'hspt_sum_pre',
          'color': '1,52,118,255',
          'lable': '大雨',
          'sortBy': 3,
          'projectCode': null
        }, {
          'id': 'f7e0baaac2fb4a778f2b2c8b8548831e',
          'legendCode': 'hspt_sum_pre',
          'color': '255,102,255,255',
          'lable': '暴雨',
          'sortBy': 4,
          'projectCode': null
        }, {
          'id': 'd950f74a6eba4ea49ae704f3ccf9a6ed',
          'legendCode': 'hspt_sum_pre',
          'color': '220,0,255,255',
          'lable': '大暴雨',
          'sortBy': 5,
          'projectCode': null
        }, {
          'id': 'a0aaaf02ade04de1bc0e1ed889098288',
          'legendCode': 'hspt_sum_pre',
          'color': '153,51,153,255',
          'lable': '特大暴雨',
          'sortBy': 6,
          'projectCode': null
        }],
        'lable': null
      }],
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.u-legend {
  position: absolute;
  left: 15px;
  bottom: 15px !important;
  right: auto !important;
  top: auto !important;
  list-style: none;
}
</style>

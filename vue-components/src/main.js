import GwLegend from './components/gw-legend/index';
import GwMessage from './components/gw-message/index';
import GwTimeline from './components/gw-timeline/index';

const components = [
  GwLegend,
  GwMessage,
  GwTimeline
];

const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

module.exports = {
  version: '1.0.0',
  install,
  GwLegend,
  GwMessage,
  GwTimeline
};

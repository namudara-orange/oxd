import {defineComponent} from 'vue';
import {decoratorMixin} from '../Decorator/decorator-mixin';

export const cellMixin = defineComponent({
  mixins: [decoratorMixin],
  inject: ['screenState'],

  props: {
    header: {
      type: Object,
      default: () => ({}),
    },
  },
});

export default cellMixin;

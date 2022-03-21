# MOOB

微信小程序状态机,提供基础的observe和getter功能


## 初始

同pinia 一样定义store, 返回的实体上action 和state 在同一个this上访问.

```js
// store.js

export const pageStore = defineStore('home', {
  state: {
      pageParams:{}
  },

  getters: {
    //
    listChecked() {
      const { list } = this;

      const listChecked = (list || []).find((item) => item.checked) || {};

      return listChecked;
    }
  },

  actions: {
      setPageParams(){
          this.setData({
              pageParams:{}
          })
      }
  }

```
页面或组件是将匹配到的state或getter 放到对应的组件 data上, 会通过patch 识别动态有哪些state 更新,对data上对应的重新赋值

```js
// page.js or component
import {mapToData} from 'mpob'
import { pageStore } from './store'

const connect = mapToData('home', (state) => {
  return {
    pageParams: state.pageParams
  };
});

Component(
  connect({
    attached() {
      this.init();
    },
      methods: {
      init() {
          const { pageParams} =this.data
      },
      }
  }))

```

## Variations





## License

[MIT](LICENSE).

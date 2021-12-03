import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import { Tabs, TabPane, Table, TableColumn } from 'element-ui'

Vue.component(Tabs.name, Tabs)
Vue.component(TabPane.name, TabPane)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

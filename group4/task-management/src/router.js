import Vue from 'vue'
import Router from 'vue-router'
import taskCenter from './views/taskCenter.vue'
import taskPublish from './views/taskPublish.vue'
import history from './views/history.vue'
import taskRecord from './views/taskRecord.vue'
import taskChange from './views/taskChange.vue'
import taskNew from './views/taskNew.vue'
import personInfo from './views/personInfo.vue'
import login from './views/login.vue'
import index from './views/index.vue'
import register from './views/register.vue'
import popover from './components/popover.vue';
import userList from './views/userList.vue'
import taskList from './views/taskList.vue'




Vue.use(Router)

export default new Router({
  routes: [
    { 
      path: '/', 
      name: 'main', 
      component: login
    },
    { 
      path: '/login', 
      name: 'login', 
      component: login
    },
    { 
      path:'/register',
      name:'register',
      component: register,
    },
    {
      path: '/index',
      name: 'index',
      component:index,
      children:[
        {
          path: '/taskCenter',
          name: 'taskCenter',
          component: taskCenter
        },
        {
          path: '/taskList',
          name: 'taskList',
          component: taskList
        },
        {
          path: '/taskPublish',
          name: 'taskPublish',
          component: taskPublish,
          children:[
            {
              path:'/taskChange',
              name:'taskChange',
              component:taskChange
            },
            {
              path:'/taskNew',
              name:'taskNew',
              component:taskNew
            },
            {
              path:'/popover',
              name:'popover',
              component:popover
            },
          ],
        },
        {
          path:'/taskRecord',
          name:'taskRecord',
          component:taskRecord
        },
        {
          path:'/personInfo',
          name:'personInfo',
          component:personInfo
        },
        {
          path:'/history',
          name:'history',
          component:history
        },
        {
          path:'/userList',
          name:'userList',
          component:userList
        }
      ]
    },
  ]
})

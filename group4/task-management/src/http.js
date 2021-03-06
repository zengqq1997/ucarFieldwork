// 创建一个接口和地址,定义到Vue的原型上,这样就可以在其他地方直接使用$http进行操作
import axios from "axios"
import Vue from "vue"
import router from "./router"

const http = axios.create({  //创建一个axios请求实例，可以在任意的vue页面上用this.$http访问实例
  baseURL: "http://localhost:3000/api" //指定接口根地址
})

// //给所有的接口请求加一个请求头
http.interceptors.request.use(function (config) {
  // Do something before request is sent
   // bearer是行业规范：空格
  if (localStorage.token) {
    config.headers.Authorization = 'Bearer ' + localStorage.token
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

//给http请求加一个拦截器
http.interceptors.response.use(res =>{
  
  return res
}, err => {
  if(err.response.data.message){
  //err.response表示错误对象有一个返回对象
  // console.log(err.response.data.message)
  Vue.prototype.$message({
    type: 'error',
    message : err.response.data.message,

  })
  if(err.response.status===401){
    router.push('/login')
  }
}
  return Promise.reject(err);
})
export default http
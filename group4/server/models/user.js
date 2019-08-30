const mongoose = require("../plugins/db");


//新建用户所有信息数据库字段
const UserSchema = new mongoose.Schema({
    //邮箱
    email: { type: String, unique: true },
    //用户名
    username: { type: String, unique: true }, //定义类型，这样写还可以加别的参数
    //验证码
    vertifyCode: { type: String },
    //性别
    gender: { type: String },
    //联系方式
    tel: { type: String },
    //是否为管理员，默认为false
    isAdmin: {
        type: Boolean,
        default: false
    },
    //是否已激活
    isLive: {
        type: Boolean,
        default: false
    },
    //激活时间
    date: { type: String },
    //密码
    password: {
        type: String,
        set (val) {
            // return val  //默认的传过来什么值往数据库就存什么值，做加密需要npm i bcrypt
            return require("bcrypt").hashSync(val, 10); //同步的方法把密码散列,10是散列的密码的强度，指数若过大，效率会很低
        },
    }
});

const User = mongoose.model("User", UserSchema); //定义一个user模型model，
// User.db.dropCollection("users")//先删除已有的注册，因为之前有重复的，执行一遍就删掉了，之后就注释掉
module.exports = { User }; //导出一个对象，可以增加模型

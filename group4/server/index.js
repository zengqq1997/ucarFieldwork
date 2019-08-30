const express = require('express');

const app = express();

const assert = require('http-assert');

const nodemailer = require('nodemailer'); //邮箱

const jwt = require('jsonwebtoken');
const { User } = require('./models/user'); //用解构的语法
const { Task } = require('./models/task'); //用解构的语法

app.set('secret', 'dfasfdasdf');

//指定域名为8080跨域
app.use(
  require('cors')({ credentials: true, origin: 'http://localhost:8080' })
);
// 允许跨域
// app.use(require('cors')())
// 让express识别客户端提交的json
app.use(express.json());

//生成的随机六位数验证码函数
function createSixNum() {
  var Num = '';
  for (var i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}

//创建一个smtp服务器
const config = {
  host: 'smtp.qq.com',
  port: 465,
  auth: {
    user: '1548722047@qq.com', //注册的邮箱账号
    pass: 'qgmnobrkdznjifjh' //邮箱的授权码，不是注册时的密码,
  }
};
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);

//注册邮箱验证
app.post('/api/register', async (req, res) => {
  const email = req.body.email;
  var user = await User.findOne({
    email: email
  });
  if (user) {
    if (user.isLive) {
      return res.status(422).send({
        message: '邮箱已注册，请去登录'
      });
    } else {
      await user.remove();
    }
  }
  var vertifyCode = createSixNum(); //这里生成的随机六位数
  var date = String(new Date().getTime()); //获取当前时间
  const mail = {
    // 发件人
    from: '<1548722047@qq.com>',
    // 主题
    subject: '神州注册验证', //邮箱主题
    // 收件人
    to: email, //前台传过来的邮箱
    // 邮件内容，HTML格式
    html:
      '<h3> 欢迎注册神州任务领取系统 </h3> <p>你的验证码是</p><b>' +
      vertifyCode +
      '</b><p>请在10分钟内使用</p>' //发送验证码
  };
  user = User.insertMany({
    email: req.body.email,
    vertifyCode: vertifyCode, //将获取到的验证码存入数据库等待校对
    username: req.body.username,
    password: req.body.password,
    gender: '男', //性别注册时默认为男，在个人中心进行修改
    tel: ' ',
    isAdmin: 0, //管理员
    date: date,
    isLive: 0 //是否激活
  });

  transporter.sendMail(mail, function(err, info) {
    if (err) {
      return res.status(404).send({
        message: '错误'
      });
    }
    return res.status(200).send({
      message: '邮件已发送，请查看'
    });
  });
});

//注册
app.post('/api/register/:email', async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const checkPass = req.body.checkPass;
  const vertifyCode = req.body.vertifyCode;

  //校对密码是否填写正确
  if (password != checkPass) {
    return res.status(422).send({
      message: '错误，请校对信息'
    });
  }
  //找是否有相同的用户名
  var user1 = await User.findOne({
    username: username
  });
  if (user1) {
    return res.status(422).send({
      message: '用户名已存在'
    });
  }
  var user = await User.findOne({
    email: email
  });
  //如果找到那条记录
  if (user) {
    var nowDate = String(new Date().getTime()); //获取当前时间
    //判断验证码是否正确，时间是否超过10分钟以及前端密码与确认密码是否正确
    if (user.vertifyCode === vertifyCode && nowDate - user.date < 600000) {
      //更新数据库的用户信息，把用户名密码也存进去
      user = await User.findByIdAndUpdate(
        user._id,
        {
          password: password,
          username: username,
          isLive: 1, //注册成功
          date: nowDate
        },
        { new: true }
      );

      return res.status(200).send({
        message: '注册成功，请登录'
      });
    } else {
      await user.remove(); //如果不成功需移除数据库数据
      return res.status(422).send({
        message: '验证码错误或已过期'
      });
    }
  }
});

//登录
app.post('/api/login', async (req, res) => {
  const email = req.body.email.replace(/(^\s*)|(\s*$)/g, ''); //去掉开头和结尾空格;
  var flag = 0;
  //先找邮箱
  let user = await User.findOne({
    email: email
  });
  if (user) {
    flag = 1;
  }
  //如果不是邮箱找用户名
  if (!user) {
    const username = email;
    user = await User.findOne({
      username: username
    });
    //如果找到了
    if (user) {
      flag = 1;
    }
  }
  assert(flag, 422, '用户不存在');
  assert(user.isLive, 422, '用户不存在');

  //2.校验密码 、参数为(明文密码，密文密码)
  const isPasswordValid = require('bcrypt').compareSync(
    req.body.password,
    user.password
  ); //前者是客户端发来的，后者是加密的，进行比较,返回true or false
  assert(isPasswordValid, 422, '密码错误');

  //3.返回token

  const token = jwt.sign(
    {
      id: String(user._id) //在json里不用加_，只有mongodb里才加_,用户的密码不能放在token里，只用传一个ID或其他唯一的东西除了密码
    },
    app.get('secret')
  ); //表示要拿什么数据进行签名,为了告诉服务端给它签发的哪个token 在我们数据库里对应的哪个用户，可以直接用用户id
  //第二个参数secret不应该出现在代码库，应该在自己本地的，对别人不可见的一个密钥
  const name = user.username;
  res.send({ token, name, user }); //一般send一个对像，加一个token ，
});

//忘记密码邮箱验证
app.post('/api/login/:email', async function(req, res) {
  var vertifyCode = createSixNum(); //这里生成的随机六位数
  var date = String(new Date().getTime()); //获取当前时间
  var email = req.body.email;
  var user = await User.findOne({
    email: email
  });
  if (!user) {
    return res.status(422).send({
      message: '邮箱不存在'
    }); //如果不是用户，返回一个状态
  }

  user = await User.findByIdAndUpdate(
    user._id,
    {
      vertifyCode: vertifyCode, //更新验证码和当前时间
      date: date
    },
    { new: true }
  );

  const mail = {
    // 发件人
    from: '<1548722047@qq.com>',
    // 主题
    subject: '神州邮箱验证', //邮箱主题
    // 收件人
    to: email, //前台传过来的邮箱
    // 邮件内容，HTML格式
    html:
      '<h3> 神州任务领取系统 </h3> <p>你的验证码是</p><b>' +
      vertifyCode +
      '</b><p>请在10分钟内使用</p>' //发送验证码
  };
  transporter.sendMail(mail, function(err, info) {
    if (err) {
      return res.status(404).send({
        message: '错误'
      });
    }
    return res.status(200).send({
      message: '邮件已发送，请查看'
    });
  });
});

//忘记密码的修改密码
app.put('/api/login/:email', async (req, res) => {
  const email = req.body.email;
  const vertifyCode = req.body.vertifyCode;
  const password = req.body.password;
  const checkPass = req.body.checkPass;
  //校对密码是否填写正确
  if (password != checkPass) {
    return res.status(422).send({
      message: '错误，请校对信息'
    });
  }

  var user = await User.findOne({
    email: email
  });
  //如果找到那条记录
  if (user) {
    var nowDate = String(new Date().getTime()); //获取当前时间
    //判断验证码是否正确，时间是否超过10分钟
    if (user.vertifyCode === vertifyCode && nowDate - user.date < 600000) {
      //更新数据库的用户信息，把用户名密码也存进去
      user = await User.findByIdAndUpdate(
        user._id,
        {
          password: password,
          date: nowDate
        },
        { new: true }
      );

      return res.status(200).send({
        message: '修改密码成功,请登录'
      });
    } else {
      return res.status(422).send({
        message: '验证码错误或已过期'
      });
    }
  }
});

//获取个人信息
app.post(
  '/api/user',
  async (req, res, next) => {
    const token = String(req.headers.authorization || ' ')
      .split(' ')
      .pop();
    assert(token, 401, '请先登录');
    const { id } = jwt.verify(token, app.get('secret'));
    assert(id, 401, '请先登录');
    req.user = await User.findById(id);
    assert(req.user, 401, '请先登录');
    await next();
  },
  async (req, res) => {
    const user = await User.findOne({
      email: req.body.email
    });
    res.send(user);
  }
);

//修改个人信息(用户名未改变)
app.put('/api/user/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    username: req.body.username,
    gender: req.body.gender,
    tel: req.body.tel,
    password: req.body.password
  });

  res.send(user);
});
//修改个人信息(用户名改变)
app.put('/api/user/change/:id', async (req, res) => {
  const user1 = await User.findOne({
    username: req.body.username
  });
  if (user1) {
    return res.status(422).send({
      message: '用户名已存在'
    });
  } else {
    const user = await User.findByIdAndUpdate(req.params.id, {
      username: req.body.username,
      gender: req.body.gender,
      tel: req.body.tel,
      password: req.body.password
    });

    const task = await Task.findOne({
      getterEmail: req.body.email
    });
    if (task) {
      await Task.update({
        getter: req.body.username
      });
    }
    const task2 = await Task.findOne({
      publisherEmail: req.body.email
    });
    if (task2) {
      await Task.update({
        publisher: req.body.username
      });
    }
    res.send(user);
  }
});

//修改密码
app.put('/api/user/password/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  const isPasswordValid = require('bcrypt').compareSync(
    req.body[0],
    user.password
  );
  if (isPasswordValid) {
    const user1 = await User.findByIdAndUpdate(req.params.id, {
      password: req.body[1]
    });
    res.send(user1);
  } else {
    return res.status(422).send({
      message: '密码错误'
    });
  }
});

//新增任务
app.post('/api/task', async (req, res) => {
  const task = await Task.create(req.body);
  res.send(task);
});

// 显示（查询）所有任务
app.get(
  '/api/task',
  async (req, res, next) => {
    //校验用户是否登录
    //请求头里面的token为Bearer eyJhbGciOiJ，先用空格把token变成一个数组，第一个元素为bearer
    //第二个元素为token，然后把token pop出来赋值给token
    const token = String(req.headers.authorization || ' ')
      .split(' ')
      .pop();
    //将token解密出来，显示为tokenData（id， iat）
    // const tokenData = jwt.verify(token,app.get('secret'));
    assert(token, 401, '请先登录');
    const { id } = jwt.verify(token, app.get('secret'));
    assert(id, 401, '请先登录');
    //找出user中是否真的有这个用户（以防伪造）
    //将user挂载到req上，使得user在后续的请求中也可以使用
    req.user = await User.findById(id);
    assert(req.user, 401, '请先登录');
    await next(); //调用下一个
  },
  async (req, res) => {
    const tasks = await Task.find();
    res.send(tasks);
  }
);

// 在任务编辑页面显示该任务详情（接收参数）
app.get('/api/task/:id', async (req, res) => {
  const tasks = await Task.findById(req.params.id);
  res.send(tasks);
});

// 在任务编辑页面修改任务（接收参数）
app.put('/api/task/:id', async (req, res) => {
  const tasks = await Task.findByIdAndUpdate(req.params.id, req.body);
  res.send(tasks);
});

// 删除任务(接受参数)
app.delete('/api/task/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({
    status: true
  });
});

// 删除用户(接受参数)
app.delete('/api/user/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send({
    success: true
  });
});

// 显示所有用户
app.get(
  '/api/userList',
  async (req, res, next) => {
    const token = String(req.headers.authorization || ' ')
      .split(' ')
      .pop();
    assert(token, 401, '请先登录');
    const { id } = jwt.verify(token, app.get('secret'));
    assert(id, 401, '请先登录');
    req.user = await User.findById(id);
    assert(req.user, 401, '请先登录');
    await next();
  },
  async (req, res) => {
    const users = await User.find();
    res.send(users);
  }
);

//上传文件
const multer = require('multer');
const fs = require('fs');
// const upload = multer({ dest: __dirname + '/uploads' });
var upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      const url = __dirname + '/uploads';
      cb(null, url);
    },
    filename: function(req, file, cb) {
      //file.originalname上传文件的原始文件名
      var fileNameArr = file.originalname.split('.');
      var suffix = fileNameArr[fileNameArr.length - 1];
      var changedName =
        fileNameArr[0] + '-' + new Date().getTime() + '.' + suffix;
      cb(null, changedName);
    }
  })
});
app.use('/uploads', express.static(__dirname + '/uploads'));

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (file) {
    file.url = `http://localhost:3000/uploads/${file.filename}`;
  }
  res.send(file);
});
//删除文件
app.post('/api/delete/', async (req, res) => {
  console.log('yonghu' + req.body._id);
  fs.unlinkSync(`./server/uploads/${req.body.requirementFile.split('/')[4]}`);
  await Task.findByIdAndUpdate(
    req.body._id,
    {
      requirementFile: null
    },
    { new: true }
  );
  res.send({
    status: true
  });
});
app.post('/api/delete/change', async (req, res) => {
  console.log('yonghu' + req.body._id);
  fs.unlinkSync(`./server/uploads/${req.body.requirementFile.split('/')[4]}`);
  await Task.findByIdAndUpdate(
    req.body._id,
    {
      requirementFile: null
    },
    { new: true }
  );
  res.send({
    status: true
  });
});

// 错误处理函数
app.use(async (err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    message: err.message
  });
});

app.listen(3000, () => console.log('http://localhost:3000/'));

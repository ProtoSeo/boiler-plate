const express = require('express')
const mongoose = require('mongoose');
const {User} = require('./models/User');
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth }  =require('./middleware/auth');
const { Router } = require('express');
//application/x-www-form-urlencoded 이렇게 된 데이터를 가져오기 위함
app.use(bodyParser.urlencoded({extended:true}));

//application/json 이렇게 된 데이터를 가져오기 위함
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.connect(config.mongoURI,{
  useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:true}
)
.then(()=>console.log('Mongo DB Connected...'))
.catch(err=> console.log(err));


app.get('/', function (req, res) {
  res.send('hello world')
})

app.get('/api/hello', (req, res) => res.send('Hello World!~~ '))

app.post('/api/users/register',(req,res)=>{
  //  회원가입할때 필요한 정보를 클라이언트로 받아오면 그 것들을 database에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo)=>{
    if(err) return res.json({success:false,err});
    return res.status(200).json({
      success:true
    })
  })
});

app.post('/api/users/login',(req,res)=>{
  //  요청된 이메일이 있는지 찾는다.
  User.findOne({email: req.body.email},(err,user)=>{
    if(!user){
      return res.json({
        loginSuccess:false,
        message:"제공된 이메일에 해당하는 유저가 없습니다."
      });
    }
    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 같은지 확인
    user.comparePassword(req.body.password,(err,isMatch)=>{
      if(!isMatch) {
        return res.json({
          loginSuccess:false,
          message:"비밀번호가 틀렸습니다."
        })
      }
      //비밀번호 까지 맞다면 토큰을 생성하기
      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err)
        
        // 토큰을 저장한다. 어디에 저장?--> 쿠키 or 로컬스토리지
        // 쿠키 사용
        res.cookie("x_auth",user.token)
        .status(200)
        .json({
          loginSuccess:true,
          userId:user._id,
        });
      })
    })
  })
});

app.get('/api/users/auth',auth,(req,res)=>{

  //여기까지 middleware를 통과했다는 것은 인증이 통과되었다는 것
  res.status(200).json({
    _id:req.user._id,
    isAdmin:req.user.role === 0 ? false:true,
    isAuth:true,
    email:req.user.email,
    name:req.user.name,
    lastname:req.user.lastname,
    role:req.user.role,
    image:req.user.image
  });
});

app.get('/api/users/logout',auth,(req,res)=>{
  User.findOneAndUpdate({_id:req.user._id},{token:""},(err,user)=>{
    if(err) return res.json({success:false,err});
    return res.status(200).send({
      success:true
    })
  })
})
app.listen(5000);
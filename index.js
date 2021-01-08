const express = require('express')
const mongoose = require('mongoose');
const {User} = require('./models/User');
const app = express()
const bodyParser = require('body-parser');
const config = require('./config/key');
//application/x-www-form-urlencoded 이렇게 된 데이터를 가져오기 위함
app.use(bodyParser.urlencoded({extended:true}));

//application/json 이렇게 된 데이터를 가져오기 위함
app.use(bodyParser.json());

mongoose.connect(config.mongoURI,{
  useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:true}
)
.then(()=>console.log('Mongo DB Connected...'))
.catch(err=> console.log(err));


app.get('/', function (req, res) {
  res.send('hello world')
})

app.post('/register',(req,res)=>{
  //  회원가입할때 필요한 정보를 클라이언트로 받아오면 그 것들을 database에 넣어준다.
  const user = new User(req.body);
  
  user.save((err, userInfo)=>{
    if(err) return res.json({success:false,err});
    return res.status(200).json({
      success:true
    })
  })
})

app.listen(3000)
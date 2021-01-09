const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name:{
    type:String,
    maxlength:50,
  },
  email:{
    type:String,
    trim:true,
    unique:1,
  },
  password:{
    type:String,
    minlength:5,
  },
  lastname:{
    type:String,
    maxlength:50,
  },
  role:{
    type:Number,
    default:0,
  },
  image:String,
  token:{
    type:String,

  },tokenExp:{
    type:Number
  }
})

// save 하기전에 function을 실행한다.
userSchema.pre('save',function(next){
  var user = this;
  //비밀번호가 변경되었을 때만 
  if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, function(err, salt) {  // salt를 만들 때 saltrounds가 필요하다.
      if(err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
          // Store hash in your password DB.
          if(err) return next(err);
          // hash된 비밀번호로 변경
          user.password = hash;
          next();  //function 끝나고 다음으로 보낸다.
      });
    });
  }else{
    next();
  }
})

userSchema.methods.comparePassword = function(plainPassword,cb){
  //plainPassword vs 암호화된 비밀번호
  bcrypt.compare(plainPassword,this.password,function(err,isMatch){
    if (err) return cb(err);
    cb(null,isMatch);
  });
}

userSchema.methods.generateToken = function(cb){
  //jsonwebtoken을 사용하여 token 만들기
  var user = this;
  var token = jwt.sign(user._id.toHexString(),'secretToken');
  user.token = token;
  user.save(function(err, user){
    if(err)return cb(err);
    cb(null, user);
  })
}

userSchema.statics.findByToken = function(token,cb){
  var user = this;
  //토큰을 복호화 한다.
  jwt.verify(token,"secretToken",function(err, decoded){
    //  유저 아이디를 이용해서 유저를 찾은 다음,
    // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 같은지 확인
    user.findOne({"_id":decoded,"token":token},function(err,user){
      if(err) return cb(err);
      cb(null,user);
    })
  })
}
const User = mongoose.model('User',userSchema);

module.exports = {User};
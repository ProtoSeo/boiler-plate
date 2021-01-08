const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
  console.log(user);
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
  }
})
const User = mongoose.model('User',userSchema);

module.exports = {User};
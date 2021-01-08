var express = require('express')
const mongoose = require('mongoose');

var app = express()

mongoose.connect('mongodb+srv://ProtoSeo:<password>@boiler-plate.r7mki.mongodb.net/test?retryWrites=true&w=majority',{
  useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:true}
)
.then(()=>console.log('Mongo DB Connected...'))
.catch(err=> console.log(err));
app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(3000)
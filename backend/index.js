const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const app = express()

// middleware
app.use(express.json())
app.use(cors())


mongoose.connect("mongodb+srv://saro:9797@saro.t9tyq.mongodb.net/passkey?retryWrites=true&w=majority&appName=saro").then(()=>{console.log("Connected to DB")})
.catch(()=>{console.log("Failed to connect DB")})

const credential = mongoose.model("credential",{},"bulkmail")



app.post("/sendemail",function(req,res){
    const msg = req.body.message
    const email = req.body.emaillist
   
    credential.find().then(function(data){
      const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:data[0].toJSON().user,
            pass:data[0].toJSON().pass
        }
    });
    
    new Promise(async function(resolve,reject){
      try{
          for(var i=0;i<email.length;i++){
            await  transporter.sendMail(
                  {
                      from:"saravanasaro0000@gmail.com",
                      to:email[i],
                      subject:"A msg from bulkmail",
                      text:msg
                  }
              )
              console.log("success email sent to :"+ email[i])
          }
         resolve("success")
      }
      catch(error){
          reject("failed")
      }
    }).then(function(){
      res.send(true)
    }).catch(function(){
      res.send(false)
    })
    }).catch(function(error){
      console.log(error)
    })
 
  
})

app.listen(5000,function(){
    console.log("sever started")
})
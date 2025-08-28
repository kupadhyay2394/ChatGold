const express=require("express");
const router=require('./routes.js');
const cors = require("cors");
const connectDB= require('./db.js');
const userRouter=require("./user.controller.js");
const goldRouter = require("./gold.routes.js");
const app=express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  

// app.post('/api/v1/chat', async (req, res) => {
//   try {
//     const qure = req.body;       // req.body is the parsed body
//     console.log(qure.query);

//     // If you want to return the query back:
//     return res.status(201).json({
//       msg: "hello",
//       query: qure.query
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ msg: "Server error" });
//   }
// });



app.use('/api/v1/chat',router);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/gold", goldRouter);
const PORT=8000;
connectDB().then(()=>{
    app.on("error",(error)=>{
                    console.log("ERR: ", error);
                     throw error
                 })
    app.listen(PORT || 8000, ()=>{
        console.log(`sERVER IS RUNNING ON PORT:${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("Mongo db connention failed! ! !",err);
})
// app.listen(PORT || 8000, ()=>{
//          console.log(`sERVER IS RUNNING ON PORT:${process.env.PORT}`)
//      })

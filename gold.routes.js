const express= require('express');
const auth= require("./auth.middleware.js")
const {sellGold,buyGold,addMoney} = require('./gold.controller.js');

const goldRouter=express.Router();


goldRouter.post("/buy",auth,buyGold);
goldRouter.post("/sell",auth,sellGold);
goldRouter.post("/addmoney",auth,addMoney);

module.exports=goldRouter;

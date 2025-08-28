const Router=require("express");
const {getreply}=require('./controller.js')
const router=Router();

router.route("/chat/").post(getreply);
module.exports= router;
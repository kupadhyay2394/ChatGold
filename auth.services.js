const  sessionIdToUserMap=new Map();
function setUser(Id,User){
    sessionIdToUserMap.set(Id,User);
}

function  getUser(Id){
    return sessionIdToUserMap.get(Id);
}
module.exports={setUser,getUser};
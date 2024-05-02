const { checkUser } = require('./firebaseHandle');
const deviceAuth = async(req,res,next)=>{
  const user_id = req.get('user_id');
  if(await checkUser(user_id)){
    next();
  }else{
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    });
  
  }
}
module.exports ={
  deviceAuth: deviceAuth
}
const firebaseHandler = require('./firebaseHandle');
// const { getDatabase, set, ref } = require ("firebase/database");
const { deviceAuth } = require('./auth');
Number.prototype.round = function(p) {
  p = p || 10;
  return parseFloat( this.toFixed(p) );
};

module.exports =(app)=>{
  
  app.post('/api/data', deviceAuth, async(req,res)=>{
    const data = req.body;
    const user_id = req.get('user_id');
    try{
      data.temperature = parseFloat(data.temperature).round(2);
      data.humidity = parseFloat(data.humidity).round(2);
      data.dust = parseFloat(data.dust).round(2);
      data.ppm = parseFloat(data.ppm).round(2);
      console.log(data);

      await firebaseHandler.writeData(data, user_id);
    }catch(e){
      console.log("Error: ", e);
      res.status(400).json({
        status: 'error',
        message: 'Invalid data'
      });
      return;
    }
    
    res.json({
      status: 'success',
      data: data
    });
  });
  app.get('/api/data', async(req, res)=>{
    await writeUserData('Hello');
    res.status(200).send('Data written to database');
  })
}

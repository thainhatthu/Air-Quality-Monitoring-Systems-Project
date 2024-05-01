const firebaseHandler = require('./firebaseHandle');
const { getDatabase, set, ref } = require ("firebase/database");



module.exports =(app)=>{
  
  app.post('/api/data', async(req,res)=>{
    const data = req.body;
    console.log(data);
    try{
      data.temperature = parseFloat(data.temperature);
      data.humidity = parseFloat(data.humidity);
      data.dust = parseFloat(data.dust);
      data.ppm = parseFloat(data.ppm);
      await firebaseHandler.writeData(data);
    }catch{
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

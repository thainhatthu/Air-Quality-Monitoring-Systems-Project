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

  app.get('/api/data', async (req, res) => {
    try {
      // Đọc dữ liệu từ Firebase
      const snapshot = await firebaseHandler.readData();
      if (snapshot.exists()) {
        const data = snapshot.val();
        res.status(200).json({
          status: 'success',
          data: data
        });
      } else {
        res.status(404).json({
          status: 'error',
          message: 'No data available'
        });
      }
    } catch (error) {
      console.error('Error getting data from Firebase:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
});
  
}

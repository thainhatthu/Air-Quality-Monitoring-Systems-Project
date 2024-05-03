const firebaseHandler = require('./firebaseHandle');
// const { getDatabase, set, ref } = require ("firebase/database");
const { deviceAuth } = require('./auth');
Number.prototype.round = function (p) {
  p = p || 10;
  return parseFloat(this.toFixed(p));
};


module.exports = (app) => {

  app.post('/api/data', deviceAuth, async (req, res) => {
    const data = req.body;
    const user_id = req.get('user_id');
    try {
      data.temperature = parseFloat(data.temperature).round(2);
      data.humidity = parseFloat(data.humidity).round(2);
      data.dust = parseFloat(data.dust).round(2);
      data.ppm = parseFloat(data.ppm).round(2);
      console.log(data);

      await firebaseHandler.writeData(data, user_id);
    } catch (e) {
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
  app.post('/api/fakedata', deviceAuth, async (req, res) => {
    const data = req.body;
    const user_id = req.get('user_id');
    try {
      data.temperature = parseFloat(data.temperature).round(2);
      data.humidity = parseFloat(data.humidity).round(2);
      data.dust = parseFloat(data.dust).round(2);
      data.ppm = parseFloat(data.ppm).round(2);
      console.log(data);

      await firebaseHandler.writeData(data, user_id, true);
    } catch (e) {
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
}

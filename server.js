const express = require('express');
const cors = require('cors');

const pushDataToGas = require('./services/gasService');
const getSnapshotStream = require('./services/cameraService');

const app = express();

app.use(cors());
app.use(express.json());

// API đẩy dữ liệu lên GAS
app.post('/update-sheet', async (req, res) => {
  try {
    const response = await pushDataToGas(req.body);
    if (response.status === 'success') {
      res.json({ success: true, ...response });
    } else {
      res.status(400).json({ success: false, message: response.message });
    }
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: `Lỗi khi đẩy dữ liệu: ${error.message}`,
      details: error.response?.data || null,
    });
  }
});

// API chụp snapshot
app.get('/api/camera/snapshot', async (req, res) => {
  try {
    const response = await getSnapshotStream();
    res.setHeader('Content-Type', 'image/jpeg');
    response.data.pipe(res);
  } catch (error) {
    console.error('❌ Không lấy được snapshot:', error.message);
    res.status(500).send('Không thể lấy snapshot từ camera');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server chạy tại port ${PORT}`));

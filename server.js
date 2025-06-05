const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const axios = require('axios');
const app = express();
const AxiosDigestAuth = require('@mhoc/axios-digest-auth').default;

app.use(cors());
app.use(express.json());
const CAMERA_IP = '192.168.24.136';
const USERNAME = 'admin';
const PASSWORD = 'kinhduan12@';

const digestAuth = new AxiosDigestAuth({
  username: USERNAME,
  password: PASSWORD,
});

// Link Google Apps Script Web App đã deploy
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxsYtIANoDIWmfI-4BCtYGsEnEqCNeJ91RfmSXlGG7Lmny-tz0V3X6yBTbbjP1etKoa/exec';

app.post('/update-sheet', async (req, res) => {
    const bodyData = req.body;
    console.log('Data gửi sang GAS:', bodyData);

    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('GAS response error:', text);
            return res.status(500).json({ success: false, message: 'Lỗi từ GAS: ' + text });
        }

        const data = await response.json();
        console.log('GAS response data:', data);

        if (data.status === 'success') {
            res.json({
                success: true,
                message: data.message,
                sheetUrl: data.sheetUrl // ✅ Trả luôn link sheet mới tạo
            });
        } else {
            res.status(400).json({ success: false, message: data.message });
        }
    } catch (error) {
        console.error('Error in /update-sheet:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/camera/snapshot', async (req, res) => {
  try {
    const response = await digestAuth.request({
      url: `http://${CAMERA_IP}/ISAPI/Streaming/channels/1/picture`,
      method: 'GET',
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'image/jpeg');
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching snapshot:', error.message);
    res.status(500).send('Cannot get snapshot');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));

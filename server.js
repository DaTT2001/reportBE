// import fetch from 'node-fetch';

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Cho phép tất cả origin truy cập (có thể config cụ thể hơn nếu cần)
app.use(cors());
app.use(express.json());

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyR6ZmRBrDaULfq6TYJ1go_9fnDyaqH1Kb6IgqliXFdZQFpFMMofx_o-GX8OV4ElAMe/exec';

app.post('/update-sheet', async (req, res) => {
    const bodyData = req.body; // toàn bộ dữ liệu
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
            // Nếu GAS trả về lỗi HTTP, log và gửi lỗi
            const text = await response.text();
            console.error('GAS response error:', text);
            return res.status(500).json({ success: false, message: 'Lỗi từ GAS: ' + text });
        }

        const data = await response.json();
        console.log('GAS response data:', data);

        if (data.status === 'success') {
            res.json({ success: true, message: "Cập nhật thành công" });
        } else {
            res.status(400).json({ success: false, message: data.message });
        }
    } catch (error) {
        console.error('Error in /update-sheet:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));

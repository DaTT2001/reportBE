const axios = require('axios');
const { GAS_URL } = require('../config');
const validatePayload = require('../middlewares/validate');

async function pushDataToGas(payload) {
  validatePayload(payload);

  try {
    const res = await axios.post(GAS_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10_000,
    });
    console.log('✅ Đẩy lên GAS thành công:', res.data);
    return res.data;
  } catch (err) {
    const msg = err.response?.data || err.message;
    console.error('❌ Lỗi khi gọi GAS:', msg);
    throw err;
  }
}

async function pushDataToGas2(payload) {

  try {
    const res = await axios.post(GAS_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10_000,
    });
    console.log('✅ Đẩy lên GAS thành công:', res.data);
    return res.data;
  } catch (err) {
    const msg = err.response?.data || err.message;
    console.error('❌ Lỗi khi gọi GAS:', msg);
    throw err;
  }
}
module.exports = pushDataToGas;
module.exports = pushDataToGas2;

function validatePayload(payload) {
  const requiredFields = ['maKD', 'maLo', 't4data', 't5data'];
  for (const field of requiredFields) {
    if (!payload[field]) throw new Error(`Thiếu trường bắt buộc: ${field}`);
  }

  if (!Array.isArray(payload.t4data) || payload.t4data.length === 0)
    throw new Error('t4data phải là mảng và có ít nhất 1 phần tử');
  if (!Array.isArray(payload.t5data) || payload.t5data.length === 0)
    throw new Error('t5data phải là mảng và có ít nhất 1 phần tử');

  const isValid = (item) => 'temperature' in item && 'time' in item;
  if (!payload.t4data.every(isValid))
    throw new Error('Các phần tử trong t4data phải có temperature và time');
  if (!payload.t5data.every(isValid))
    throw new Error('Các phần tử trong t5data phải có temperature và time');
}

module.exports = validatePayload;

const AxiosDigestAuth = require('@mhoc/axios-digest-auth').default;
const { CAMERA_IP, USERNAME, PASSWORD } = require('../config');

const digestAuth = new AxiosDigestAuth({ username: USERNAME, password: PASSWORD });

async function getSnapshotStream() {
  return await digestAuth.request({
    url: `http://${CAMERA_IP}/ISAPI/Streaming/channels/1/picture`,
    method: 'GET',
    responseType: 'stream',
    timeout: 5000,
  });
}

module.exports = getSnapshotStream;

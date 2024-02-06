const os = require('os');
const crypto = require('crypto');

// Get some system properties

generateNodeId = () => {

  const platform = os.platform();
  const cpuArch = os.arch();
  const networkInterfaces = os.networkInterfaces();
  
  let systemString = platform + cpuArch;

  for (let interfaceName in networkInterfaces) {
    networkInterfaces[interfaceName].forEach((interface) => {
      systemString += interface.mac;
    });
  }
  const systemHash = crypto.createHash('sha256').update(systemString).digest('hex');
  return systemHash;  
}

module.exports.generateNodeId = generateNodeId;


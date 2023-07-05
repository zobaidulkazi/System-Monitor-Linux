const os = require('os');
const si = require('systeminformation');

function getCPUUsage() {
  return new Promise((resolve, reject) => {
    si.currentLoad((data) => {
      resolve(data.currentload);
    });
  });
}

function getMemoryUsage() {
  return new Promise((resolve, reject) => {
    si.mem((data) => {
      const usedMB = data.active / 1024;
      const totalMB = data.total / 1024;
      resolve({ usedMB, totalMB });
    });
  });
}

function getNetworkUsage() {
  return new Promise((resolve, reject) => {
    si.networkStats('eth0', (data) => {
      const sentMB = data[0].tx_sec / (1024 * 1024);
      const receivedMB = data[0].rx_sec / (1024 * 1024);
      resolve({ sentMB, receivedMB });
    });
  });
}

async function systemMonitor() {
  const cpuUsage = await getCPUUsage();
  const memoryUsage = await getMemoryUsage();
  const networkUsage = await getNetworkUsage();

  console.log('=== System Monitor ===');
  console.log(`CPU Usage: ${cpuUsage.toFixed(2)}%`);
  console.log(`Memory Usage: ${memoryUsage.usedMB.toFixed(2)} MB / ${memoryUsage.totalMB.toFixed(2)} MB`);
  console.log(`Network Usage: Sent: ${networkUsage.sentMB.toFixed(2)} MB, Received: ${networkUsage.receivedMB.toFixed(2)} MB`);
}


 // coll my systemMonitor function
systemMonitor();


// @zobaidulkazi
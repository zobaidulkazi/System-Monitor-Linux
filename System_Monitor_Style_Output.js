const si = require('systeminformation');

async function getCPUUsage() {
  const cpuData = await si.currentLoad();
  return cpuData.currentload;
}

async function getMemoryUsage() {
  const memData = await si.mem();
  const usedMB = memData.active / (1024 * 1024);
  const totalMB = memData.total / (1024 * 1024);
  return { usedMB, totalMB };
}

async function getNetworkUsage() {
  const netData = await si.networkStats('eth0');
  const sentMB = netData[0].tx_sec / (1024 * 1024);
  const receivedMB = netData[0].rx_sec / (1024 * 1024);
  return { sentMB, receivedMB };
}

async function getDiskUsage() {
  const diskData = await si.fsSize();
  const diskUsage = diskData.map(disk => {
    const usedGB = disk.used / (1024 * 1024 * 1024);
    const totalGB = disk.size / (1024 * 1024 * 1024);
    return { filesystem: disk.mount, usedGB, totalGB };
  });
  return diskUsage;
}

async function systemMonitor() {
  const cpuUsage = await getCPUUsage();
  const memoryUsage = await getMemoryUsage();
  const networkUsage = await getNetworkUsage();
  const diskUsage = await getDiskUsage();

  console.log('\x1b[36m%s\x1b[0m', '=== System Monitor ===');
  if (cpuUsage !== undefined) {
    console.log('\x1b[33m%s\x1b[0m', `CPU Usage: ${cpuUsage.toFixed(2)}%`);
  }
  console.log('\x1b[32m%s\x1b[0m', `Memory Usage: ${memoryUsage.usedMB.toFixed(2)} MB / ${memoryUsage.totalMB.toFixed(2)} MB`);
  console.log('\x1b[34m%s\x1b[0m', `Network Usage: Sent: ${networkUsage.sentMB.toFixed(2)} MB, Received: ${networkUsage.receivedMB.toFixed(2)} MB`);

  console.log('\x1b[35m%s\x1b[0m', 'Disk Usage:');
  diskUsage.forEach(disk => {
    console.log(`- \x1b[37m%s\x1b[0m: ${disk.usedGB.toFixed(2)} GB / ${disk.totalGB.toFixed(2)} GB`);
  });
}

systemMonitor();

export const logAuthDebug = (message, data) => {
  const timestamp = new Date().toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const logPrefix = `[AUTH_DEBUG ${timestamp}]`;
  
  if (data !== undefined) {
    console.log(`${logPrefix} ${message}:`, data);
  } else {
    console.log(`${logPrefix} ${message}`);
  }
};
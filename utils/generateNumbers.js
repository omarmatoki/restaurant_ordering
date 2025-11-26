// Utility to generate unique session and order numbers
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

exports.generateSessionNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const time = Date.now().toString().slice(-6);

  return `S-${year}${month}${day}-${time}`;
};

exports.generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const time = Date.now().toString().slice(-6);

  return `O-${year}${month}${day}-${time}`;
};

// Generate unique QR code identifier
exports.generateQRCode = (restaurantId, tableNumber) => {
  const uuid = require('uuid');
  return `QR-${restaurantId}-${tableNumber}-${uuid.v4().slice(0, 8)}`;
};

// Generate QR code image and return the file path
exports.generateQRCodeImage = async (restaurantId, tableNumber, qrCodeId) => {
  try {
    // Create the URL that the QR code will point to
    // This should be the URL to access the menu for this specific table
    const frontendIp = process.env.FRONTEND_IP || 'localhost';
    const frontendPort = process.env.FRONTEND_PORT || '3000';
    const menuUrl = `http://${frontendIp}:${frontendPort}/qr/${qrCodeId}`;

    // Generate filename
    const filename = `table-${restaurantId}-${tableNumber}-${Date.now()}.png`;
    const qrDir = path.join(__dirname, '..', 'public', 'qr-codes');

    // Ensure directory exists
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    const filePath = path.join(qrDir, filename);

    // Generate QR code image with options
    await QRCode.toFile(filePath, menuUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Return the relative path for storing in database
    return `/qr-codes/${filename}`;
  } catch (error) {
    console.error('Error generating QR code image:', error);
    throw error;
  }
};

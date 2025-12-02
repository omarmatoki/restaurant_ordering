require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const orderRoutes = require('./routes/orderRoutes');
const kitchenRoutes = require('./routes/kitchenRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = socketIO(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Make io accessible to our router
app.set('io', io);

// Middleware
// إعدادات CORS للسماح بالوصول من أي جهاز على الشبكة
app.use(cors({
  origin: true, // السماح لجميع المصادر
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (QR code images and uploads)
app.use('/qr-codes', express.static('public/qr-codes'));
app.use('/uploads', express.static('uploads'));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant Ordering System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      menu: '/api/menu',
      sessions: '/api/sessions',
      orders: '/api/orders',
      kitchen: '/api/kitchen',
      admin: '/api/admin'
    }
  });
});

// Socket.IO connection handling
const orderController = require('./controllers/orderController');

io.on('connection', (socket) => {
  console.log('🔌 Socket client connected:', socket.id);

  // Join kitchen room based on restaurantId
  socket.on('join-kitchen', (restaurantId) => {
    const room = `kitchen_${restaurantId}`;
    socket.join(room);
    console.log(`👨‍🍳 Kitchen joined room: ${room}`);
  });

  // Handle order creation via socket
  socket.on('create-order', async (orderData, callback) => {
    try {
      console.log('📦 Received order via socket:', orderData);

      // Create a mock request and response object
      const req = {
        body: orderData,
        app: { get: () => io }
      };

      let responseData = null;

      const res = {
        status: () => {
          return res;
        },
        json: (data) => {
          responseData = data;
        }
      };

      // Call the controller
      await orderController.createOrder(req, res);

      // Send response back via callback
      if (callback && typeof callback === 'function') {
        callback(responseData);
      }

      console.log('✅ Order created via socket successfully');
    } catch (error) {
      console.error('❌ Error creating order via socket:', error);
      if (callback && typeof callback === 'function') {
        callback({
          success: false,
          message: error.message || 'فشل إنشاء الطلب'
        });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket client disconnected:', socket.id);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'الصفحة غير موجودة'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'خطأ في الخادم',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection and server start
const PORT = process.env.PORT1;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // Sync database - التحقق من الاتصال فقط
    console.log('⏳ التحقق من قاعدة البيانات...');
    await sequelize.sync({ alter: false });
    console.log('✅ قاعدة البيانات جاهزة');

    // Start server
    server.listen(PORT1, '0.0.0.0', () => {
      const os = require('os');
      const networkInterfaces = os.networkInterfaces();
      let localIP = 'localhost';

      // البحث عن عنوان IP المحلي
      Object.keys(networkInterfaces).forEach((interfaceName) => {
        networkInterfaces[interfaceName].forEach((interface) => {
          if (interface.family === 'IPv4' && !interface.internal) {
            localIP = interface.address;
          }
        });
      });

      console.log(`\n🚀 الخادم يعمل على المنفذ ${PORT}`);
      console.log(`📍 البيئة: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔌 Socket.IO is ready`);
      console.log(`\n🌐 روابط الوصول:`);
      console.log(`   - المحلي: http://localhost:${PORT}`);
      console.log(`   - الشبكة: http://${localIP}:${PORT}`);
      console.log(`\n💡 للوصول من أجهزة أخرى على نفس الشبكة، استخدم: http://${localIP}:${PORT}`);
      console.log(`\n📚 API Endpoints:`);
      console.log(`   - Auth: http://${localIP}:${PORT}/api/auth`);
      console.log(`   - Menu: http://${localIP}:${PORT}/api/menu`);
      console.log(`   - Sessions: http://${localIP}:${PORT}/api/sessions`);
      console.log(`   - Orders: http://${localIP}:${PORT}/api/orders`);
      console.log(`   - Kitchen: http://${localIP}:${PORT}/api/kitchen`);
      console.log(`   - Admin: http://${localIP}:${PORT}/api/admin`);
    });
  } catch (error) {
    console.error('❌ خطأ في بدء الخادم:', error);
    process.exit(1);
  }
};


// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⏸️  تم استقبال إشارة SIGTERM، جاري إيقاف الخادم بشكل آمن...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⏸️  تم استقبال إشارة SIGINT (Ctrl+C)، جاري إيقاف الخادم بشكل آمن...');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
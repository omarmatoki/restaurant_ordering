# 🏗️ بنية المشروع - Project Structure

## 📁 هيكل الملفات والمجلدات

```
restaurant-ordering-system/
│
├── 📁 config/
│   └── database.js                 # إعدادات Sequelize والاتصال بقاعدة البيانات
│
├── 📁 models/                      # نماذج قاعدة البيانات (8 جداول)
│   ├── index.js                    # ✨ ملف العلاقات - يربط جميع Models
│   ├── Restaurant.js               # 🏪 المطاعم
│   ├── User.js                     # 👤 المستخدمين (Admin + Kitchen)
│   ├── Category.js                 # 📂 أقسام القائمة
│   ├── Item.js                     # 🍽️ الأصناف
│   ├── Table.js                    # 🪑 الطاولات + QR Codes
│   ├── Session.js                  # 🔄 الجلسات (أهم Model)
│   ├── Order.js                    # 📦 الطلبات
│   └── OrderItem.js                # 🛒 تفاصيل الطلب (Junction Table)
│
├── 📁 controllers/                 # منطق الأعمال (Business Logic)
│   ├── authController.js           # 🔐 المصادقة (Login, Register, JWT)
│   ├── menuController.js           # 🍽️ إدارة القوائم والأصناف
│   ├── sessionController.js        # 🔄 إدارة الجلسات (بدء/إغلاق)
│   ├── orderController.js          # 📦 إدارة الطلبات
│   ├── kitchenController.js        # 👨‍🍳 واجهة المطبخ
│   └── adminController.js          # 🔧 لوحة الإدارة والتقارير
│
├── 📁 routes/                      # تعريف المسارات (Endpoints)
│   ├── authRoutes.js               # /api/auth/*
│   ├── menuRoutes.js               # /api/menu/*
│   ├── sessionRoutes.js            # /api/sessions/*
│   ├── orderRoutes.js              # /api/orders/*
│   ├── kitchenRoutes.js            # /api/kitchen/*
│   └── adminRoutes.js              # /api/admin/*
│
├── 📁 middleware/                  # Middleware Functions
│   └── auth.js                     # 🔒 JWT Authentication & Authorization
│
├── 📁 migrations/                  # Sequelize Migrations (إنشاء الجداول)
│   ├── 20240101000001-create-restaurants.js
│   ├── 20240101000002-create-users.js
│   ├── 20240101000003-create-categories.js
│   ├── 20240101000004-create-items.js
│   ├── 20240101000005-create-tables.js
│   ├── 20240101000006-create-sessions.js
│   ├── 20240101000007-create-orders.js
│   └── 20240101000008-create-order-items.js
│
├── 📁 seeders/                     # بيانات تجريبية
│   └── 20240101000001-demo-data.js # مطعم + مستخدمين + أصناف + طاولات
│
├── 📁 utils/                       # وظائف مساعدة
│   └── generateNumbers.js          # توليد session/order numbers و QR codes
│
├── 📄 server.js                    # ⚡ نقطة البداية - Express App
├── 📄 package.json                 # المكتبات والـ scripts
├── 📄 .env.example                 # نموذج إعدادات البيئة
├── 📄 .sequelizerc                 # إعدادات Sequelize CLI
├── 📄 .gitignore                   # ملفات Git المستبعدة
│
└── 📚 Documentation/                # التوثيق
    ├── README.md                    # التوثيق الرئيسي
    ├── QUICK_START.md              # دليل البدء السريع
    ├── API_EXAMPLES.md             # أمثلة API كاملة
    └── PROJECT_STRUCTURE.md        # هذا الملف
```

---

## 🔍 شرح تفصيلي لكل مجلد

### 1️⃣ **config/** - الإعدادات

```javascript
// database.js
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
}
```

**الوظيفة:** إعدادات الاتصال بقاعدة البيانات لـ Sequelize

---

### 2️⃣ **models/** - نماذج قاعدة البيانات

#### ملف `index.js` - الأهم:
```javascript
// يحتوي على جميع العلاقات (Associations)
Restaurant.hasMany(User)
User.belongsTo(Restaurant)

Category.hasMany(Item)
Item.belongsTo(Category)

Session.hasMany(Order)
Order.belongsTo(Session)

// ... الخ
```

#### الجداول الثمانية:

| Model | الوظيفة | العلاقات |
|-------|---------|----------|
| **Restaurant** | معلومات المطعم | 1:N → Users, Categories, Tables, Sessions |
| **User** | الموظفين (admin/kitchen) | N:1 → Restaurant |
| **Category** | أقسام القائمة | N:1 → Restaurant, 1:N → Items |
| **Item** | الأصناف | N:1 → Category, N:M → Orders |
| **Table** | الطاولات + QR | N:1 → Restaurant, 1:N → Sessions |
| **Session** | الجلسات ⭐ | N:1 → Restaurant/Table, 1:N → Orders |
| **Order** | الطلبات | N:1 → Session/Table, 1:N → OrderItems |
| **OrderItem** | تفاصيل الطلب | N:1 → Order/Item |

---

### 3️⃣ **controllers/** - منطق الأعمال

```
authController.js        → تسجيل دخول، JWT، تغيير كلمة المرور
menuController.js        → CRUD للأصناف والأقسام
sessionController.js     → بدء جلسة، إغلاق جلسة، حساب الإجمالي
orderController.js       → إرسال طلب، تغيير حالة الطلب
kitchenController.js     → طلبات جديدة، قيد التحضير، إحصائيات
adminController.js       → تقارير، إدارة طاولات، إدارة مستخدمين
```

**كل Controller يحتوي على:**
- ✅ Error handling
- ✅ Input validation
- ✅ Authorization checks
- ✅ Database queries

---

### 4️⃣ **routes/** - تعريف الـ Endpoints

```javascript
// مثال: sessionRoutes.js
router.post('/start/:qrCode', sessionController.startSession);  // Public
router.post('/:id/close', authenticate, authorize('kitchen', 'admin'),
  sessionController.closeSession);  // Protected
```

**كل Route يحدد:**
- HTTP Method (GET, POST, PUT, DELETE, PATCH)
- الـ Path
- Middleware (authentication, authorization)
- Controller function

---

### 5️⃣ **middleware/** - Middleware Functions

#### `auth.js`:
```javascript
// 1. authenticate → فحص JWT token
exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
}

// 2. authorize → فحص الصلاحيات
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }
}
```

---

### 6️⃣ **migrations/** - بناء قاعدة البيانات

```javascript
// مثال: create-sessions.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sessions', {
      id: { type: Sequelize.INTEGER, primaryKey: true },
      tableId: { type: Sequelize.INTEGER, references: { model: 'Tables' } },
      status: { type: Sequelize.ENUM('active', 'closed') },
      // ...
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Sessions');
  }
};
```

**الترتيب مهم:**
1. Restaurants (أولاً - لا dependencies)
2. Users (يحتاج Restaurants)
3. Categories (يحتاج Restaurants)
4. Items (يحتاج Categories)
5. Tables (يحتاج Restaurants)
6. Sessions (يحتاج Tables + Users)
7. Orders (يحتاج Sessions)
8. OrderItems (يحتاج Orders + Items)

---

### 7️⃣ **seeders/** - البيانات التجريبية

```javascript
// يضيف:
- 1 مطعم تجريبي
- 2 مستخدمين (admin + kitchen)
- 4 أقسام قائمة
- 10 أصناف
- 5 طاولات مع QR Codes فريدة
```

**الاستخدام:**
```bash
npm run seed
```

---

### 8️⃣ **utils/** - وظائف مساعدة

```javascript
// generateNumbers.js
exports.generateSessionNumber = () => {
  return `S-${year}${month}${day}-${timestamp}`;
}

exports.generateOrderNumber = () => {
  return `O-${year}${month}${day}-${timestamp}`;
}

exports.generateQRCode = (restaurantId, tableNumber) => {
  return `QR-${restaurantId}-${tableNumber}-${uuid}`;
}
```

---

## 🔄 دورة حياة Request

### مثال: الزبون يبدأ جلسة

```
1. Frontend
   ↓
   POST /api/sessions/start/QR-1-T1-abc123

2. server.js
   ↓
   Express App يستقبل الطلب

3. routes/sessionRoutes.js
   ↓
   router.post('/start/:qrCode', sessionController.startSession)

4. controllers/sessionController.js
   ↓
   - يفحص QR code في جدول Tables
   - يبحث عن session نشطة
   - إذا لم توجد → ينشئ session جديدة
   - يُحدث Table.status = 'occupied'

5. models/Session.js & models/Table.js
   ↓
   Sequelize يُنفذ SQL queries

6. MySQL Database
   ↓
   INSERT INTO Sessions ...
   UPDATE Tables SET status='occupied' ...

7. Response
   ↓
   JSON { sessionId, sessionNumber, table }
```

---

## 📊 العلاقات بين Models (Diagram)

```
Restaurant (1)
    ├── Users (N)
    ├── Categories (N)
    │       └── Items (N)
    ├── Tables (N)
    │       └── Sessions (N)
    │               └── Orders (N)
    │                       └── OrderItems (N)
    │                               └── Items (N)
    └── Sessions (N)
```

### شرح العلاقات:

1. **One-to-Many (1:N)**
   - Restaurant → Users
   - Restaurant → Categories
   - Category → Items
   - Table → Sessions
   - Session → Orders
   - Order → OrderItems

2. **Many-to-Many (N:M)**
   - Orders ↔ Items (through OrderItems)

---

## 🛡️ طبقات الأمان

```
1. Network Layer
   ↓ CORS (cors middleware)

2. Authentication Layer
   ↓ JWT Token (middleware/auth.js)

3. Authorization Layer
   ↓ Role-based (admin/kitchen)

4. Validation Layer
   ↓ Input validation in controllers

5. Database Layer
   ↓ Sequelize (SQL injection protection)
```

---

## 📝 Scripts المتاحة

```json
{
  "start": "node server.js",           // إنتاج
  "dev": "nodemon server.js",          // تطوير
  "migrate": "sequelize-cli db:migrate", // تشغيل migrations
  "migrate:undo": "sequelize-cli db:migrate:undo", // تراجع
  "seed": "sequelize-cli db:seed:all"  // بيانات تجريبية
}
```

---

## 🎯 نقاط الدخول الرئيسية

### 1. للزبائن (Public - بدون مصادقة):
```
POST   /api/sessions/start/:qrCode
GET    /api/menu/categories
GET    /api/menu/items
POST   /api/orders
GET    /api/orders/session/:sessionId
```

### 2. للمطبخ (Kitchen - مع JWT):
```
GET    /api/kitchen/dashboard
GET    /api/kitchen/orders/pending
PATCH  /api/kitchen/orders/:id/status
POST   /api/kitchen/sessions/:id/close
```

### 3. للإدارة (Admin - مع JWT):
```
GET    /api/admin/dashboard
GET    /api/admin/reports/sales
POST   /api/admin/tables
POST   /api/admin/users
CRUD   /api/menu/*
```

---

## 🔧 ملفات الإعداد

### `.env` (البيئة):
```env
PORT=5000
DB_HOST=localhost
DB_NAME=restaurant_ordering_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=secret_key
```

### `.sequelizerc` (Sequelize CLI):
```javascript
module.exports = {
  'config': path.resolve('config', 'database.js'),
  'models-path': path.resolve('models'),
  'migrations-path': path.resolve('migrations'),
  'seeders-path': path.resolve('seeders')
};
```

---

## 📈 الأداء والتحسين

### Indexes في قاعدة البيانات:
```sql
-- Sessions
INDEX (tableId, status)
INDEX (sessionNumber) UNIQUE

-- Orders
INDEX (sessionId, status)
INDEX (orderNumber) UNIQUE

-- Items
INDEX (categoryId, isAvailable)

-- Users
INDEX (email) UNIQUE
INDEX (username) UNIQUE
```

### Eager Loading:
```javascript
Session.findOne({
  include: [{
    model: Order,
    include: [OrderItem]
  }]
});
```

---

## 🚀 مسار التطوير المستقبلي

### المرحلة 2 (اختياري):
- [ ] Socket.io للإشعارات الفورية
- [ ] رفع الصور (Multer + Cloud Storage)
- [ ] نظام الخصومات والعروض
- [ ] طرق الدفع (Visa, Mada, STCPay)
- [ ] نظام التقييمات
- [ ] تعدد اللغات (i18n)
- [ ] QR Code Generator داخل النظام

---

**البنية جاهزة للتطوير والتوسع! 🎉**

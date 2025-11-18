# 🍽️ نظام طلبات المطاعم الذكي - Smart Restaurant Ordering System

نظام متكامل لإدارة طلبات المطاعم باستخدام QR Code، يربط الزبائن مباشرة بالمطبخ بدون الحاجة لتسجيل دخول.

## 📋 المحتويات

- [نظرة عامة](#نظرة-عامة)
- [المميزات](#المميزات)
- [التقنيات المستخدمة](#التقنيات-المستخدمة)
- [متطلبات التشغيل](#متطلبات-التشغيل)
- [التثبيت](#التثبيت)
- [الإعداد](#الإعداد)
- [تشغيل المشروع](#تشغيل-المشروع)
- [هيكل المشروع](#هيكل-المشروع)
- [API Endpoints](#api-endpoints)
- [نماذج قاعدة البيانات](#نماذج-قاعدة-البيانات)

---

## 🎯 نظرة عامة

نظام يتيح للزبائن مسح QR Code على الطاولة، تصفح القائمة، وإرسال طلبات متعددة خلال جلسة واحدة. يستقبل المطبخ الطلبات فوراً ويدير حالتها، بينما تتوفر للإدارة تقارير شاملة وإدارة كاملة للنظام.

### الأدوار الثلاثة:

1. **الزبون (Customer)**: يمسح QR، يتصفح القائمة، يرسل طلبات (بدون تسجيل دخول)
2. **المطبخ (Kitchen)**: يستقبل الطلبات، يغير حالتها، يغلق الجلسات
3. **الإدارة (Admin)**: إدارة القوائم، الطاولات، المستخدمين، والتقارير

---

## ✨ المميزات

### للزبائن:
- ✅ مسح QR Code مباشرة من الطاولة
- ✅ تصفح القائمة بدون تسجيل دخول
- ✅ إرسال طلبات متعددة خلال نفس الجلسة
- ✅ متابعة حالة الطلبات (جديد، قيد التحضير، تم التوصيل)
- ✅ رؤية الفاتورة الموحدة للجلسة

### للمطبخ:
- ✅ استقبال الطلبات فوراً
- ✅ تحديث حالة الطلبات (FIFO)
- ✅ رؤية وقت الانتظار لكل طلب
- ✅ إدارة الجلسات النشطة
- ✅ إغلاق الجلسات وحساب الإجمالي

### للإدارة:
- ✅ إدارة القوائم والأصناف (CRUD)
- ✅ إدارة الطاولات وإنشاء QR Codes
- ✅ إدارة المستخدمين (موظفين)
- ✅ تقارير المبيعات (يومية، أسبوعية، شهرية)
- ✅ تقرير الأصناف الأكثر طلباً
- ✅ لوحة تحكم شاملة (Dashboard)

---

## 🛠️ التقنيات المستخدمة

- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **CORS**: cors

---

## 📦 متطلبات التشغيل

قبل البدء، تأكد من تثبيت:

- [Node.js](https://nodejs.org/) (v14 أو أحدث)
- [MySQL](https://www.mysql.com/) (v5.7 أو أحدث)
- [Git](https://git-scm.com/)

---

## 🚀 التثبيت

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd restaurant-ordering-system
```

### 2. تثبيت المكتبات

```bash
npm install
```

---

## ⚙️ الإعداد

### 1. إنشاء قاعدة البيانات

افتح MySQL وقم بتشغيل:

```sql
CREATE DATABASE restaurant_ordering_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. إعداد ملف البيئة

الملف `.env` موجود بالفعل! فقط تأكد من الإعدادات:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=restaurant_ordering_db
DB_USER=root
# DB_PASSWORD= (اتركه معلق إذا كنت تستخدم XAMPP بدون كلمة مرور)

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### 3. إنشاء قاعدة البيانات

**في phpMyAdmin** (http://localhost/phpmyadmin):
- اضغط "New" → اسم القاعدة: `restaurant_ordering_db`
- أو استورد الملف: [setup-database.sql](setup-database.sql)

### 4. إنشاء الجداول (تلقائياً!)

**لا تحتاج لتشغيل migrations!** الجداول ستُنشأ تلقائياً عند أول تشغيل:

```bash
npm start
```

ستُنشأ جميع الجداول الثمانية تلقائياً:
- ✅ Restaurants
- ✅ Users
- ✅ Categories
- ✅ Items
- ✅ Tables
- ✅ Sessions
- ✅ Orders
- ✅ OrderItems

### 5. (اختياري) إضافة بيانات تجريبية

لبدء سريع مع بيانات جاهزة، استخدم السكريبت المخصص:

```bash
npm run seed:run
```

**أو** باستخدام Sequelize CLI:
```bash
npm run seed
```

سيضيف تلقائياً:
- مطعم تجريبي: "مطعم الذواقة"
- مستخدم Admin (البريد: admin@restaurant.com | كلمة المرور: admin123)
- مستخدم Kitchen (البريد: kitchen@restaurant.com | كلمة المرور: admin123)
- 4 أقسام قائمة (مقبلات، أطباق رئيسية، مشروبات، حلويات)
- 10 أصناف متنوعة
- 5 طاولات مع QR Codes

📚 **للمزيد من التفاصيل:** راجع [SEEDING-GUIDE.md](SEEDING-GUIDE.md)

---

## ▶️ تشغيل المشروع

### وضع التطوير (Development)

```bash
npm run dev
```

### وضع الإنتاج (Production)

```bash
npm start
```

الخادم سيعمل على: `http://localhost:5000`

---

## 📮 اختبار API باستخدام Postman

لديك الآن **Postman Collection جاهزة** تحتوي على **50+ endpoint**!

### استيراد Collection:
1. افتح Postman
2. Import → اختر الملف: `Restaurant-Ordering-System.postman_collection.json`
3. Import Environment: `Restaurant-Dev.postman_environment.json`
4. اختر البيئة من القائمة المنسدلة

### ما يتضمنه:
- ✅ جميع endpoints للـ Authentication
- ✅ جميع endpoints للقائمة (عامة + إدارة)
- ✅ جميع endpoints للجلسات والطلبات
- ✅ واجهة المطبخ الكاملة
- ✅ واجهة الإدارة الكاملة + التقارير
- ✅ إدارة المستخدمين والطاولات
- ✅ متغيرات تلقائية (tokens, IDs)

📚 **دليل شامل:** راجع [POSTMAN-GUIDE.md](POSTMAN-GUIDE.md)

---

## 📁 هيكل المشروع

```
restaurant-ordering-system/
├── config/
│   └── database.js           # إعدادات Sequelize
├── models/
│   ├── index.js              # ملف العلاقات (Associations)
│   ├── Restaurant.js
│   ├── User.js
│   ├── Category.js
│   ├── Item.js
│   ├── Table.js
│   ├── Session.js
│   ├── Order.js
│   └── OrderItem.js
├── controllers/
│   ├── authController.js     # المصادقة
│   ├── menuController.js     # القوائم والأصناف
│   ├── sessionController.js  # إدارة الجلسات
│   ├── orderController.js    # الطلبات
│   ├── kitchenController.js  # واجهة المطبخ
│   └── adminController.js    # لوحة الإدارة
├── routes/
│   ├── authRoutes.js
│   ├── menuRoutes.js
│   ├── sessionRoutes.js
│   ├── orderRoutes.js
│   ├── kitchenRoutes.js
│   └── adminRoutes.js
├── middleware/
│   └── auth.js               # JWT Authentication & Authorization
├── migrations/               # Sequelize Migrations
├── utils/
│   └── generateNumbers.js    # توليد الأرقام الفريدة
├── .env.example
├── .sequelizerc
├── server.js                 # نقطة البداية
├── package.json
└── README.md
```

---

## 🌐 API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|----------|
| POST | `/login` | تسجيل دخول | Public |
| POST | `/register` | تسجيل مستخدم جديد | Admin |
| GET | `/me` | معلومات المستخدم الحالي | Authenticated |
| POST | `/logout` | تسجيل خروج | Authenticated |
| PUT | `/change-password` | تغيير كلمة المرور | Authenticated |

### 🍽️ Menu (`/api/menu`)

#### للزبائن (Public):

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/categories` | جلب جميع الأقسام |
| GET | `/categories/:id/items` | جلب أصناف قسم معين |
| GET | `/items` | جلب جميع الأصناف |
| GET | `/items/:id` | تفاصيل صنف واحد |

#### للإدارة (Admin):

| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | `/categories` | إضافة قسم جديد |
| PUT | `/categories/:id` | تعديل قسم |
| DELETE | `/categories/:id` | حذف قسم |
| POST | `/items` | إضافة صنف جديد |
| PUT | `/items/:id` | تعديل صنف |
| DELETE | `/items/:id` | حذف صنف |
| PATCH | `/items/:id/availability` | تغيير حالة التوفر |

### 🪑 Sessions (`/api/sessions`)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|----------|
| POST | `/start/:qrCode` | بدء جلسة جديدة أو استرجاع الحالية | Public |
| GET | `/:sessionId` | تفاصيل جلسة | Public |
| GET | `/table/:tableId` | جلب الجلسة النشطة لطاولة | Kitchen/Admin |
| POST | `/:sessionId/close` | إغلاق جلسة | Kitchen/Admin |
| GET | `/` | جلب كل الجلسات (مع filters) | Admin |

### 📦 Orders (`/api/orders`)

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|----------|
| POST | `/` | إرسال طلب جديد | Public |
| GET | `/session/:sessionId` | جلب طلبات جلسة | Public |
| GET | `/:orderId` | تفاصيل طلب | Public |
| GET | `/active/list` | الطلبات النشطة | Kitchen/Admin |
| GET | `/` | كل الطلبات (مع filters) | Kitchen/Admin |
| PATCH | `/:orderId/status` | تغيير حالة الطلب | Kitchen/Admin |

### 👨‍🍳 Kitchen (`/api/kitchen`)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/dashboard` | إحصائيات المطبخ |
| GET | `/orders/pending` | الطلبات الجديدة |
| GET | `/orders/preparing` | الطلبات قيد التحضير |
| PATCH | `/orders/:id/status` | تغيير حالة طلب |
| GET | `/sessions/active` | الجلسات النشطة |
| POST | `/sessions/:id/close` | إغلاق جلسة |

### 🔧 Admin (`/api/admin`)

#### Dashboard & Reports:

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/dashboard` | لوحة التحكم الرئيسية |
| GET | `/reports/sales` | تقرير المبيعات |
| GET | `/reports/popular-items` | الأصناف الأكثر طلباً |

#### إدارة الطاولات:

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/tables` | جلب كل الطاولات |
| POST | `/tables` | إضافة طاولة جديدة |
| PUT | `/tables/:id` | تعديل طاولة |
| DELETE | `/tables/:id` | حذف طاولة |

#### إدارة المستخدمين:

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/users` | جلب كل المستخدمين |
| POST | `/users` | إضافة مستخدم |
| PUT | `/users/:id` | تعديل مستخدم |
| DELETE | `/users/:id` | حذف مستخدم |

---

## 🗄️ نماذج قاعدة البيانات

### 1. Restaurants (المطاعم)
- id, name, address, phone, email, logo, isActive

### 2. Users (المستخدمين - موظفين فقط)
- id, restaurantId, username, email, password, role (admin/kitchen), isActive

### 3. Categories (أقسام القائمة)
- id, restaurantId, name, nameAr, description, displayOrder, isActive

### 4. Items (الأصناف)
- id, categoryId, name, nameAr, description, price, image, isAvailable, preparationTime, displayOrder

### 5. Tables (الطاولات)
- id, restaurantId, tableNumber, qrCode, capacity, status (available/occupied), location, isActive

### 6. Sessions (الجلسات) ⭐
- id, restaurantId, tableId, sessionNumber, startTime, endTime, status (active/closed), totalAmount, numberOfGuests, notes, closedBy

### 7. Orders (الطلبات)
- id, sessionId, tableId, orderNumber, orderTime, status (new/preparing/delivered), totalAmount, notes

### 8. OrderItems (تفاصيل الطلب)
- id, orderId, itemId, quantity, unitPrice, subtotal, notes

---

## 🔐 نظام المصادقة

### التسجيل الأولي (أول مرة):

**المشكلة:** `/api/auth/register` يحتاج Admin Token، لكن كيف تسجل أول Admin؟

**الحل:** استخدم Initial Registration Endpoint:

```bash
POST /api/auth/register/initial
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@myrestaurant.com",
  "password": "admin123",
  "restaurantName": "مطعمي",
  "restaurantAddress": "شارع الملك فهد",
  "restaurantPhone": "+966501234567"
}
```

**أو** استخدم البيانات الجاهزة:
```bash
npm run seed:run
```

📚 **للمزيد:** راجع [INITIAL-SETUP.md](INITIAL-SETUP.md)

### JWT Token Structure:

```json
{
  "userId": 1,
  "restaurantId": 1,
  "role": "admin"
}
```

### استخدام Token في Headers:

```
Authorization: Bearer <your-jwt-token>
```

---

## 📊 أمثلة الاستخدام

### 1. إنشاء مستخدم Admin أول (يدوياً في DB):

```sql
-- بعد تشغيل migrations، أضف مطعم ومستخدم admin
INSERT INTO Restaurants (name, email, isActive, createdAt, updatedAt)
VALUES ('مطعم التجربة', 'test@restaurant.com', 1, NOW(), NOW());

-- كلمة المرور يجب أن تُشفر ببرنامج bcrypt أولاً
-- استخدم هذا الكود في Node.js:
-- const bcrypt = require('bcryptjs');
-- const hashed = await bcrypt.hash('admin123', 10);

INSERT INTO Users (restaurantId, username, email, password, role, isActive, createdAt, updatedAt)
VALUES (1, 'admin', 'admin@restaurant.com', '$2a$10$...', 'admin', 1, NOW(), NOW());
```

### 2. تسجيل دخول:

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@restaurant.com",
  "password": "admin123"
}
```

### 3. إنشاء طاولة:

```bash
POST http://localhost:5000/api/admin/tables
Authorization: Bearer <token>
Content-Type: application/json

{
  "tableNumber": "T1",
  "capacity": 4,
  "location": "الطابق الأول"
}
```

### 4. الزبون يبدأ جلسة (مسح QR):

```bash
POST http://localhost:5000/api/sessions/start/QR-1-T1-abc123
Content-Type: application/json

{
  "numberOfGuests": 3
}
```

### 5. الزبون يرسل طلب:

```bash
POST http://localhost:5000/api/orders
Content-Type: application/json

{
  "sessionId": 1,
  "items": [
    {
      "itemId": 5,
      "quantity": 2,
      "notes": "بدون فلفل"
    },
    {
      "itemId": 12,
      "quantity": 1
    }
  ],
  "notes": "عجّل من فضلك"
}
```

---

## 🔄 دورة حياة الجلسة (Session Lifecycle)

1. **الزبون يمسح QR Code** → `POST /api/sessions/start/:qrCode`
2. النظام يفحص: هل هناك جلسة نشطة؟
   - نعم → يُرجع الجلسة الحالية
   - لا → ينشئ جلسة جديدة
3. الزبون يرسل طلبات متعددة → `POST /api/orders`
4. المطبخ يستقبل ويعالج الطلبات
5. المطبخ/الإدارة يُغلق الجلسة → `POST /api/sessions/:id/close`
6. النظام يحسب الإجمالي ويحرر الطاولة

---

## 🛡️ الأمان

- ✅ JWT للمصادقة
- ✅ bcrypt لتشفير كلمات المرور (10 rounds)
- ✅ Role-based authorization (admin/kitchen)
- ✅ Input validation
- ✅ SQL Injection protection (Sequelize)
- ✅ CORS configuration

---

## 📝 ملاحظات مهمة

1. **الزبون لا يستطيع إغلاق الجلسة** - فقط المطبخ/الإدارة
2. **جلسة واحدة نشطة فقط لكل طاولة**
3. **كل الطلبات تُربط بنفس الجلسة**
4. **الفاتورة تُحسب عند الإغلاق**
5. **QR Code فريد عالمياً**

---

## 🐛 حل المشاكل الشائعة

### خطأ في الاتصال بقاعدة البيانات:

```bash
# تأكد من أن MySQL يعمل
mysql -u root -p

# تأكد من بيانات الاتصال في .env
```

### خطأ في Migrations:

```bash
# تراجع عن آخر migration
npm run migrate:undo

# أعد تشغيل migrations
npm run migrate
```

---

## 📞 الدعم

للأسئلة والمساعدة، تواصل معنا.

---

## 📄 الترخيص

هذا المشروع مفتوح المصدر.

---

**تم التطوير بواسطة Claude Code** 🤖

# 📮 Postman Collection - Restaurant Ordering System

## 📦 الملفات المتوفرة

### 1. Postman Collection
📄 **File:** `Restaurant-Ordering-System.postman_collection.json`

يحتوي على **50+ endpoint** مقسمة إلى 10 مجموعات:

- 🔐 **Authentication** (6 requests)
- 🍽️ **Menu (Public)** (4 requests)
- 📋 **Menu Management (Admin)** (7 requests)
- 🪑 **Sessions (Customer)** (2 requests)
- 🛎️ **Sessions Management** (3 requests)
- 📦 **Orders (Customer)** (3 requests)
- 📋 **Orders Management** (3 requests)
- 👨‍🍳 **Kitchen Dashboard** (6 requests)
- 👨‍💼 **Admin Dashboard** (3 requests)
- 🪑 **Table Management** (4 requests)
- 👥 **User Management** (4 requests)
- 🏠 **Server Info** (1 request)

### 2. Environment File
📄 **File:** `Restaurant-Dev.postman_environment.json`

يحتوي على جميع المتغيرات المطلوبة:
- `base_url`
- `admin_token`
- `kitchen_token`
- `session_id`
- `order_id`
- `table_id`
- `user_id`
- `restaurant_id`

---

## 🚀 البدء السريع (3 خطوات)

### 1️⃣ استيراد الملفات
```
Postman → Import → اختر الملفين:
- Restaurant-Ordering-System.postman_collection.json
- Restaurant-Dev.postman_environment.json
```

### 2️⃣ اختيار البيئة
```
اختر "Restaurant Dev Environment" من القائمة المنسدلة في الأعلى
```

### 3️⃣ ابدأ الاختبار!
```
1. شغّل السيرفر: npm start
2. أضف البيانات: npm run seed:run
3. في Postman: 🔐 Authentication → Login (Admin)
4. جرّب أي endpoint!
```

---

## ✨ المميزات

### 🔄 متغيرات تلقائية
بعد تسجيل الدخول أو إنشاء طلب، تُحفظ المتغيرات تلقائياً:

| Request | يحفظ |
|---------|------|
| Login (Admin) | `admin_token`, `user_id`, `restaurant_id` |
| Login (Kitchen) | `kitchen_token` |
| Start Session | `session_id`, `table_id` |
| Create Order | `order_id` |

**لا تحتاج لنسخ ولصق!** ✨

### 📝 أمثلة جاهزة
كل request يحتوي على:
- ✅ Body جاهز بأمثلة واقعية
- ✅ Headers صحيحة
- ✅ Authorization تلقائي
- ✅ وصف بالعربية

### 🧪 Scripts تلقائية
Scripts لحفظ المتغيرات تلقائياً بعد كل request ناجح.

---

## 📋 سيناريوهات الاستخدام

### 🛒 سيناريو الزبون الكامل

```
1. Start Session (Scan QR)
   POST /api/sessions/start/:qrCode
   ↓
2. Get All Categories
   GET /api/menu/categories
   ↓
3. Get Items By Category
   GET /api/menu/categories/1/items
   ↓
4. Create Order
   POST /api/orders
   ↓
5. Get Orders By Session
   GET /api/orders/session/:sessionId
   ↓
6. Get Session Details (الفاتورة)
   GET /api/sessions/:sessionId
```

### 👨‍🍳 سيناريو المطبخ الكامل

```
1. Login (Kitchen)
   POST /api/auth/login
   ↓
2. Get Kitchen Dashboard
   GET /api/kitchen/dashboard
   ↓
3. Get Pending Orders
   GET /api/kitchen/orders/pending
   ↓
4. Update Order Status → preparing
   PATCH /api/kitchen/orders/:id/status
   ↓
5. Update Order Status → delivered
   PATCH /api/kitchen/orders/:id/status
   ↓
6. Get Active Sessions
   GET /api/kitchen/sessions/active
   ↓
7. Close Session
   POST /api/kitchen/sessions/:id/close
```

### 👨‍💼 سيناريو الإدارة الكامل

```
1. Login (Admin)
   POST /api/auth/login
   ↓
2. Get Dashboard
   GET /api/admin/dashboard
   ↓
3. Create Category
   POST /api/menu/categories
   ↓
4. Create Item
   POST /api/menu/items
   ↓
5. Create Table
   POST /api/admin/tables
   ↓
6. Get Sales Report
   GET /api/admin/reports/sales
   ↓
7. Get Popular Items
   GET /api/admin/reports/popular-items
```

---

## 🔑 بيانات الدخول

بعد تشغيل `npm run seed:run`:

```
👨‍💼 Admin:
Email: admin@restaurant.com
Password: admin123

👨‍🍳 Kitchen:
Email: kitchen@restaurant.com
Password: admin123
```

---

## 🎯 Endpoints حسب الدور

### 🌐 Public (بدون مصادقة)
- جميع Menu Endpoints
- Start Session
- Get Session
- Create Order
- Get Orders by Session

### 👨‍🍳 Kitchen
- Kitchen Dashboard
- Get/Update Orders
- Get/Close Sessions

### 👨‍💼 Admin
- كل ما سبق +
- Menu Management (CRUD)
- Table Management (CRUD)
- User Management (CRUD)
- Reports & Analytics

---

## 📊 حالات الطلب

```
new         الطلب جديد
  ↓
preparing   قيد التحضير
  ↓
delivered   تم التوصيل
```

---

## 🔧 حل المشاكل

### ❌ 401 Unauthorized
**السبب:** لم يتم تسجيل الدخول أو الـ token منتهي

**الحل:**
1. شغّل: `Login (Admin)` أو `Login (Kitchen)`
2. تحقق من حفظ الـ token في Environment
3. تأكد من اختيار البيئة الصحيحة

### ❌ 404 Not Found
**السبب:** السيرفر لا يعمل أو الـ URL خاطئ

**الحل:**
1. تحقق من تشغيل السيرفر: `npm start`
2. تحقق من `base_url` في Environment
3. تأكد من الـ endpoint الصحيح

### ❌ 400 Bad Request
**السبب:** البيانات المرسلة غير صحيحة

**الحل:**
1. راجع الـ Body
2. تأكد من صحة الـ IDs
3. راجع الأمثلة في Collection

### ❌ Session/Order not found
**السبب:** لم يتم إنشاء Session أو Order

**الحل:**
1. شغّل `Start Session` أولاً
2. شغّل `Create Order` قبل محاولة جلبه
3. تحقق من حفظ الـ IDs في Environment

---

## 📚 الملفات المساعدة

| الملف | الوصف |
|------|-------|
| [POSTMAN-GUIDE.md](POSTMAN-GUIDE.md) | دليل شامل لاستخدام Postman |
| [API-QUICK-REFERENCE.md](API-QUICK-REFERENCE.md) | مرجع سريع لجميع الـ Endpoints |
| [CREDENTIALS.md](CREDENTIALS.md) | بيانات تسجيل الدخول |
| [README.md](README.md) | التوثيق الكامل للمشروع |

---

## 🎉 ملخص الميزات

✅ **50+ Request جاهزة**
✅ **متغيرات تلقائية**
✅ **أمثلة واقعية**
✅ **Scripts تلقائية**
✅ **وصف بالعربية**
✅ **تنظيم احترافي**
✅ **Authorization تلقائي**
✅ **Environment جاهزة**

---

## 🚀 للفرونت إند

### استخدام الـ Collection كمرجع
```javascript
// مثال: تسجيل الدخول
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// مثال: جلب القائمة
const getCategories = async () => {
  const response = await fetch('http://localhost:5000/api/menu/categories');
  return await response.json();
};

// مثال: إنشاء طلب
const createOrder = async (sessionId, items, notes) => {
  const response = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, items, notes })
  });
  return await response.json();
};

// مثال: Request محمي (يحتاج Token)
const getMyProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

---

## 💡 نصائح

1. **ابدأ دائماً بـ Login** للحصول على Token
2. **احفظ المتغيرات** في localStorage في تطبيق الفرونت
3. **استخدم الـ Environment Variables** بدلاً من القيم الثابتة
4. **راجع الـ Response** لفهم هيكل البيانات
5. **جرّب السيناريوهات الكاملة** قبل البدء بالفرونت

---

**جاهز للاستخدام!** 🎊

شارك هذه الـ Collection مع فريق الفرونت إند مباشرة!

---

**آخر تحديث:** 2025-11-13

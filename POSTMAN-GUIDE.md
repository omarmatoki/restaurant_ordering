# 📮 دليل استخدام Postman Collection

## 📥 استيراد الـ Collection

### الطريقة 1: الاستيراد المباشر
1. افتح Postman
2. اضغط على **Import** في الزاوية اليسرى
3. اسحب ملف `Restaurant-Ordering-System.postman_collection.json`
4. اضغط **Import**

### الطريقة 2: من الملف
1. File → Import
2. اختر **Upload Files**
3. حدد ملف `Restaurant-Ordering-System.postman_collection.json`
4. اضغط **Import**

---

## ⚙️ إعداد Environment

### الخطوة 1: إنشاء Environment جديد
1. في Postman، اضغط على **Environments** (الزر ⚙️ في الزاوية اليمنى)
2. اضغط **Create Environment** أو **+**
3. اسم البيئة: `Restaurant Dev`

### الخطوة 2: إضافة المتغيرات

أضف المتغيرات التالية:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` |
| `admin_token` | (فارغ) | (فارغ) |
| `kitchen_token` | (فارغ) | (فارغ) |
| `session_id` | (فارغ) | (فارغ) |
| `order_id` | (فارغ) | (فارغ) |
| `table_id` | (فارغ) | (فارغ) |
| `user_id` | (فارغ) | (فارغ) |
| `restaurant_id` | (فارغ) | (فارغ) |

### الخطوة 3: حفظ وتفعيل
1. اضغط **Save**
2. اختر البيئة من القائمة المنسدلة في الأعلى

---

## 🚀 سير العمل الموصى به (Workflow)

### 1️⃣ تسجيل الدخول أولاً

#### كـ Admin:
```
🔐 Authentication → Login (Admin)
```
**سيحفظ تلقائياً:**
- `admin_token` ✅
- `user_id` ✅
- `restaurant_id` ✅

#### كـ Kitchen:
```
🔐 Authentication → Login (Kitchen)
```
**سيحفظ تلقائياً:**
- `kitchen_token` ✅

---

### 2️⃣ سيناريو الزبون (Customer Journey)

#### أ) مسح QR Code وبدء جلسة
```
🪑 Sessions (Customer) → Start Session (Scan QR)
```
**سيحفظ تلقائياً:**
- `session_id` ✅
- `table_id` ✅

#### ب) تصفح القائمة
```
🍽️ Menu (Public) → Get All Categories
🍽️ Menu (Public) → Get Items By Category
🍽️ Menu (Public) → Get All Items
```

#### ج) تقديم طلب
```
📦 Orders (Customer) → Create Order
```
**سيحفظ تلقائياً:**
- `order_id` ✅

#### د) متابعة الطلب
```
📦 Orders (Customer) → Get Order Details
📦 Orders (Customer) → Get Orders By Session
```

#### هـ) عرض الجلسة والفاتورة
```
🪑 Sessions (Customer) → Get Session Details
```

---

### 3️⃣ سيناريو المطبخ (Kitchen Workflow)

#### أ) عرض Dashboard
```
👨‍🍳 Kitchen Dashboard → Get Kitchen Dashboard
```

#### ب) عرض الطلبات الجديدة
```
👨‍🍳 Kitchen Dashboard → Get Pending Orders
```

#### ج) بدء التحضير
```
👨‍🍳 Kitchen Dashboard → Update Order Status (Kitchen)
Body: { "status": "preparing" }
```

#### د) إنهاء التحضير
```
👨‍🍳 Kitchen Dashboard → Update Order Status (Kitchen)
Body: { "status": "delivered" }
```

#### هـ) إغلاق الجلسة
```
👨‍🍳 Kitchen Dashboard → Close Session (Kitchen)
```

---

### 4️⃣ سيناريو الإدارة (Admin Workflow)

#### أ) Dashboard والتقارير
```
👨‍💼 Admin Dashboard → Get Dashboard
👨‍💼 Admin Dashboard → Get Sales Report
👨‍💼 Admin Dashboard → Get Popular Items
```

#### ب) إدارة القائمة
```
📋 Menu Management (Admin) → Create Category
📋 Menu Management (Admin) → Create Item
📋 Menu Management (Admin) → Update Item
📋 Menu Management (Admin) → Toggle Item Availability
```

#### ج) إدارة الطاولات
```
🪑 Table Management (Admin) → Get All Tables
🪑 Table Management (Admin) → Create Table
🪑 Table Management (Admin) → Update Table
```

#### د) إدارة المستخدمين
```
👥 User Management (Admin) → Get All Users
👥 User Management (Admin) → Create User
👥 User Management (Admin) → Update User
```

---

## 📊 هيكل الـ Collection

```
Restaurant Ordering System API
├── 🔐 Authentication (6 requests)
│   ├── Login (Admin)
│   ├── Login (Kitchen)
│   ├── Get My Profile
│   ├── Change Password
│   ├── Register New User
│   └── Logout
│
├── 🍽️ Menu (Public) (4 requests)
│   ├── Get All Categories
│   ├── Get Items By Category
│   ├── Get All Items
│   └── Get Single Item
│
├── 📋 Menu Management (Admin) (7 requests)
│   ├── Create Category
│   ├── Update Category
│   ├── Delete Category
│   ├── Create Item
│   ├── Update Item
│   ├── Delete Item
│   └── Toggle Item Availability
│
├── 🪑 Sessions (Customer) (2 requests)
│   ├── Start Session (Scan QR)
│   └── Get Session Details
│
├── 🛎️ Sessions Management (3 requests)
│   ├── Get Active Session By Table
│   ├── Close Session
│   └── Get All Sessions (Admin)
│
├── 📦 Orders (Customer) (3 requests)
│   ├── Create Order
│   ├── Get Orders By Session
│   └── Get Order Details
│
├── 📋 Orders Management (3 requests)
│   ├── Get Active Orders
│   ├── Get All Orders
│   └── Update Order Status
│
├── 👨‍🍳 Kitchen Dashboard (6 requests)
│   ├── Get Kitchen Dashboard
│   ├── Get Pending Orders
│   ├── Get Preparing Orders
│   ├── Update Order Status
│   ├── Get Active Sessions
│   └── Close Session
│
├── 👨‍💼 Admin Dashboard (3 requests)
│   ├── Get Dashboard
│   ├── Get Sales Report
│   └── Get Popular Items
│
├── 🪑 Table Management (4 requests)
│   ├── Get All Tables
│   ├── Create Table
│   ├── Update Table
│   └── Delete Table
│
├── 👥 User Management (4 requests)
│   ├── Get All Users
│   ├── Create User
│   ├── Update User
│   └── Delete User
│
└── 🏠 Server Info (1 request)
    └── Health Check
```

**المجموع:** 50+ request جاهزة للاستخدام!

---

## 🔑 المتغيرات التلقائية

الـ Collection يحفظ المتغيرات تلقائياً بعد تنفيذ بعض الـ requests:

| Request | يحفظ المتغيرات |
|---------|---------------|
| Login (Admin) | `admin_token`, `user_id`, `restaurant_id` |
| Login (Kitchen) | `kitchen_token` |
| Start Session | `session_id`, `table_id` |
| Create Order | `order_id` |

**لا تحتاج لنسخ ولصق!** كل شيء يُحفظ تلقائياً ✨

---

## 🧪 اختبار سريع (Quick Test)

### اختبار كامل في 5 دقائق:

```bash
1. تشغيل المشروع
   npm start

2. إضافة البيانات التجريبية
   npm run seed:run

3. في Postman:
   ✅ Login (Admin) → احفظ الـ token
   ✅ Get All Categories → تأكد من وجود 4 أقسام
   ✅ Get All Items → تأكد من وجود 10 أصناف
   ✅ Start Session → ابدأ جلسة
   ✅ Create Order → أضف طلب
   ✅ Login (Kitchen) → سجل دخول كـ Kitchen
   ✅ Get Pending Orders → تأكد من ظهور الطلب
   ✅ Update Order Status → غير الحالة لـ preparing
   ✅ Close Session → أغلق الجلسة
```

---

## 📝 ملاحظات مهمة

### بيانات تسجيل الدخول الافتراضية:
```
Admin:
  Username: admin
  Password: admin123

Kitchen:
  Username: kitchen
  Password: admin123
```

### حالات الطلب (Order Status):
- `new` - طلب جديد
- `preparing` - قيد التحضير
- `delivered` - تم التوصيل

### حالات الجلسة (Session Status):
- `active` - نشطة
- `closed` - مغلقة

### QR Codes الموجودة:
إذا استخدمت الـ Seeder، ستجد 5 طاولات. استخدم أحد رموز QR التالية:
- Table T1: `QR-1-T1-xxxxxxxx`
- Table T2: `QR-1-T2-xxxxxxxx`
- Table T3: `QR-1-T3-xxxxxxxx`
- Table T4: `QR-1-T4-xxxxxxxx`
- Table T5: `QR-1-T5-xxxxxxxx`

**ملاحظة:** يمكنك جلب QR الفعلي من:
```
GET {{base_url}}/api/admin/tables
```

---

## 🎯 نصائح للفرونت إند

### 1. استخدام الـ Variables
جميع الـ IDs محفوظة تلقائياً في المتغيرات، استخدمها:
```javascript
// مثال في JavaScript
const sessionId = localStorage.getItem('session_id');
const orderId = localStorage.getItem('order_id');
```

### 2. التعامل مع الـ Tokens
```javascript
// حفظ Token بعد Login
localStorage.setItem('token', response.data.token);

// استخدامه في Headers
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

### 3. Flow الزبون (بدون تسجيل دخول)
```
1. Scan QR → Start Session
2. Get Categories → عرض القائمة
3. Create Order → إرسال الطلب
4. Get Orders By Session → متابعة الطلبات
5. Get Session Details → عرض الفاتورة
```

### 4. Flow المطبخ (يحتاج Token)
```
1. Login → احصل على token
2. Get Pending Orders → عرض الطلبات الجديدة
3. Update Order Status → تغيير الحالة
4. Close Session → إغلاق الجلسة وحساب الإجمالي
```

---

## 🐛 حل المشاكل

### المشكلة: `401 Unauthorized`
**الحل:** تأكد من تسجيل الدخول أولاً وحفظ الـ token:
```
1. Run: Login (Admin) أو Login (Kitchen)
2. تحقق من Variable: admin_token أو kitchen_token
3. تأكد من اختيار البيئة الصحيحة
```

### المشكلة: `404 Not Found`
**الحل:** تأكد من:
- تشغيل السيرفر: `npm start`
- الـ base_url صحيح: `http://localhost:3000`

### المشكلة: `Session not found`
**الحل:** ابدأ جلسة جديدة:
```
Run: Start Session (Scan QR)
```

### المشكلة: `Order not found`
**الحل:** أنشئ طلب أولاً:
```
Run: Create Order
```

---

## 📚 المزيد من الموارد

- [README.md](README.md) - التوثيق الكامل
- [COMMANDS.md](COMMANDS.md) - جميع الأوامر
- [CREDENTIALS.md](CREDENTIALS.md) - بيانات الدخول
- [API Documentation](README.md#api-endpoints) - شرح مفصل للـ Endpoints

---

## 🎉 جاهز للاستخدام!

الآن لديك **50+ request جاهزة** لاختبار النظام بالكامل!

- ✅ All Authentication Endpoints
- ✅ All Menu Endpoints (Public & Admin)
- ✅ All Session Endpoints
- ✅ All Order Endpoints
- ✅ Complete Kitchen Interface
- ✅ Complete Admin Interface
- ✅ User Management
- ✅ Table Management
- ✅ Reports & Dashboard

**استمتع بالاختبار!** 🚀

---

**آخر تحديث:** 2025-11-22

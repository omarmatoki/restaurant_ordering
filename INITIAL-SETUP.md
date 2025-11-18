# 🚀 الإعداد الأولي - Initial Setup Guide

## ❓ المشكلة

عند محاولة التسجيل عبر `/api/auth/register` تحصل على خطأ **401 Unauthorized** لأن هذا الـ endpoint يحتاج:
- ✅ Token (تسجيل دخول)
- ✅ صلاحية Admin

**لكن كيف تسجل أول Admin إذا لم يكن هناك Admin؟** 🤔

---

## ✅ الحل: Initial Registration

تم إضافة endpoint جديد **للتسجيل الأولي فقط**:

### 🔗 Endpoint
```
POST /api/auth/register/initial
```

**مميزاته:**
- ❌ لا يحتاج Token
- ✅ يعمل فقط إذا لم يكن هناك أي Admin في النظام
- ✅ ينشئ مطعم جديد (اختياري)
- ✅ ينشئ أول مستخدم Admin
- ✅ يُرجع Token مباشرة

**بعد إنشاء أول Admin:**
- ❌ هذا الـ endpoint يتوقف عن العمل
- ✅ استخدم `/api/auth/register` (يحتاج Admin Token)

---

## 📝 طريقة الاستخدام

### 1️⃣ التسجيل الأولي (أول Admin)

#### Request:
```bash
POST http://localhost:5000/api/auth/register/initial
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@myrestaurant.com",
  "password": "admin123",
  "restaurantName": "مطعم النخبة",
  "restaurantAddress": "شارع الملك فهد، الرياض",
  "restaurantPhone": "+966501234567"
}
```

#### Response:
```json
{
  "success": true,
  "message": "تم إنشاء حساب المسؤول الأول بنجاح! يمكنك الآن تسجيل الدخول",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@myrestaurant.com",
      "role": "admin",
      "restaurantId": 1
    }
  }
}
```

### 2️⃣ تسجيل مستخدمين إضافيين (بعد وجود Admin)

#### Request:
```bash
POST http://localhost:5000/api/auth/register
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "username": "kitchen1",
  "email": "kitchen@myrestaurant.com",
  "password": "kitchen123",
  "role": "kitchen",
  "restaurantId": 1
}
```

---

## 🔄 الفرق بين الـ Endpoints

| الميزة | `/api/auth/register/initial` | `/api/auth/register` |
|--------|----------------------------|---------------------|
| يحتاج Token؟ | ❌ لا | ✅ نعم (Admin) |
| متى يعمل؟ | فقط إذا لم يكن هناك Admin | دائماً (مع Token) |
| ينشئ مطعم؟ | ✅ نعم (اختياري) | ❌ لا |
| الدور المُنشأ | admin فقط | admin أو kitchen |
| يُرجع Token؟ | ✅ نعم | ❌ لا |

---

## 🧪 أمثلة

### مثال 1: إعداد كامل من الصفر

```bash
# 1. تشغيل السيرفر
npm start

# 2. التسجيل الأولي (أول Admin)
curl -X POST http://localhost:5000/api/auth/register/initial \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@myrestaurant.com",
    "password": "admin123",
    "restaurantName": "مطعمي",
    "restaurantAddress": "شارع الملك فهد",
    "restaurantPhone": "+966501234567"
  }'

# ستحصل على Token مباشرة!
```

### مثال 2: إنشاء مستخدم Kitchen (بعد التسجيل)

```bash
# احفظ الـ Token من الخطوة السابقة
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# أنشئ مستخدم Kitchen
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "username": "kitchen1",
    "email": "kitchen@myrestaurant.com",
    "password": "kitchen123",
    "role": "kitchen",
    "restaurantId": 1
  }'
```

---

## 📮 في Postman

### إنشاء Request جديد:

1. **Method:** `POST`
2. **URL:** `{{base_url}}/api/auth/register/initial`
3. **Headers:** `Content-Type: application/json`
4. **Body (raw JSON):**
```json
{
  "username": "admin",
  "email": "admin@myrestaurant.com",
  "password": "admin123",
  "restaurantName": "مطعمي",
  "restaurantAddress": "شارع الملك فهد",
  "restaurantPhone": "+966501234567"
}
```

5. **Tests (لحفظ Token تلقائياً):**
```javascript
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("admin_token", jsonData.data.token);
    pm.environment.set("user_id", jsonData.data.user.id);
    pm.environment.set("restaurant_id", jsonData.data.user.restaurantId);
}
```

---

## ⚠️ ملاحظات مهمة

### 1. الأمان
- ✅ الـ endpoint يعمل **مرة واحدة فقط** (عند عدم وجود Admin)
- ✅ بعد إنشاء أول Admin، يصبح محمياً تلقائياً
- ⚠️ **لا تستخدم في الإنتاج بعد الإعداد الأولي**

### 2. بيانات المطعم اختيارية
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123"
  // يمكنك حذف بيانات المطعم
  // سينشئ مطعم افتراضي باسم "مطعمي"
}
```

### 3. بعد الإعداد الأولي
```bash
# محاولة استخدام /initial مرة أخرى ستفشل:
{
  "success": false,
  "message": "التسجيل الأولي متاح فقط عند عدم وجود مسؤول. استخدم /api/auth/register بدلاً من ذلك"
}
```

---

## 🔄 إعادة الإعداد (للتطوير فقط)

إذا أردت إعادة الإعداد من الصفر:

```bash
# 1. حذف جميع المستخدمين من قاعدة البيانات
# في phpMyAdmin أو MySQL:
DELETE FROM Users WHERE role = 'admin';

# 2. الآن يمكنك استخدام /register/initial مرة أخرى
```

---

## 📊 سير العمل الكامل

```
1. تشغيل المشروع
   npm start
   ↓
2. التسجيل الأولي
   POST /api/auth/register/initial
   (بدون Token - ينشئ Admin + مطعم)
   ↓
3. تسجيل الدخول
   POST /api/auth/login
   (احصل على Token)
   ↓
4. إضافة مستخدمين آخرين
   POST /api/auth/register
   (مع Admin Token - ينشئ Kitchen/Admin)
   ↓
5. استخدام النظام بالكامل!
```

---

## 🆚 البدائل الأخرى

### البديل 1: استخدام Seeder
```bash
npm run seed:run
# ينشئ Admin + Kitchen جاهزين
# Email: admin@restaurant.com / admin123
```

### البديل 2: SQL مباشر
```sql
-- في phpMyAdmin
INSERT INTO Restaurants (name, email, isActive, createdAt, updatedAt)
VALUES ('مطعمي', 'admin@example.com', 1, NOW(), NOW());

INSERT INTO Users (restaurantId, username, email, password, role, isActive, createdAt, updatedAt)
VALUES (1, 'admin', 'admin@example.com', '$2a$10$...hashed...', 'admin', 1, NOW(), NOW());
```

### البديل 3: استخدام Initial Register (الأسهل!)
```bash
POST /api/auth/register/initial
# كل شيء يُنشأ تلقائياً + Token فوري
```

---

## ✅ الخلاصة

**المشكلة:** لا يمكن استخدام `/api/auth/register` بدون Token

**الحل:**
1. ✅ استخدم `/api/auth/register/initial` للمرة الأولى فقط
2. ✅ أو استخدم `npm run seed:run` لإنشاء بيانات جاهزة
3. ✅ بعد ذلك استخدم `/api/auth/register` (مع Admin Token)

---

**تم التحديث:** 2025-11-13

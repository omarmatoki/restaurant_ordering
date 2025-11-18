# 🔐 بيانات الاعتماد - Credentials

## معلومات تسجيل الدخول للحسابات التجريبية

> **ملاحظة:** هذه البيانات تُستخدم فقط إذا قمت باستيراد ملف [seed-initial-data.sql](seed-initial-data.sql)

---

## 👨‍💼 حساب المدير (Admin)

```
البريد الإلكتروني: admin@elite-restaurant.com
كلمة المرور: admin123
الصلاحية: admin
```

**الصلاحيات:**
- إدارة القوائم والأصناف (CRUD)
- إدارة الطاولات
- إدارة المستخدمين
- عرض التقارير والإحصائيات
- لوحة التحكم الكاملة

---

## 👨‍🍳 حساب المطبخ (Kitchen)

```
البريد الإلكتروني: kitchen@elite-restaurant.com
كلمة المرور: kitchen123
الصلاحية: kitchen
```

**الصلاحيات:**
- عرض الطلبات الجديدة
- تحديث حالة الطلبات
- إدارة الجلسات النشطة
- إغلاق الجلسات

---

## 🔒 كلمات المرور المشفرة (bcrypt)

تم تشفير كلمات المرور باستخدام bcrypt (10 rounds):

```javascript
// admin123
$2a$10$X8hZKxNqHQN5VQdTYzNnZ.qE5yZVY5wqHYmN5qmZQYgZXQZkQZqQO

// kitchen123
$2a$10$tQZKxLqHQM5VPdTXzMmL.pD5yYUY4vpHXlL4plYOXgYWOYjYOYoON
```

---

## 🧪 اختبار تسجيل الدخول

### باستخدام cURL:

```bash
# تسجيل دخول Admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@elite-restaurant.com",
    "password": "admin123"
  }'
```

### باستخدام Postman أو أي REST Client:

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@elite-restaurant.com",
  "password": "admin123"
}
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@elite-restaurant.com",
    "role": "admin"
  }
}
```

---

## 🔄 تغيير كلمة المرور

بعد تسجيل الدخول، يمكن تغيير كلمة المرور:

```bash
PUT http://localhost:5000/api/auth/change-password
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "oldPassword": "admin123",
  "newPassword": "new_secure_password"
}
```

---

## 🆕 إنشاء مستخدم جديد

يمكن لـ Admin فقط إنشاء مستخدمين جدد:

```bash
POST http://localhost:5000/api/auth/register
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "username": "chef1",
  "email": "chef1@restaurant.com",
  "password": "chef123",
  "role": "kitchen"
}
```

---

## ⚠️ تحذير أمني

**مهم جداً:**
- لا تستخدم هذه البيانات في بيئة الإنتاج!
- غيّر كلمات المرور فوراً بعد أول تسجيل دخول
- استخدم كلمات مرور قوية ومعقدة في الإنتاج
- احذف هذا الملف قبل نشر المشروع

---

## 📚 المزيد من المعلومات

راجع [README.md](README.md) لمعرفة جميع API Endpoints المتاحة.

---

**التحديث:** 2025-11-12

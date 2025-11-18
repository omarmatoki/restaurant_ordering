# 🚀 دليل البدء السريع - Quick Start Guide

## خطوات التشغيل السريع

### 1️⃣ تثبيت المكتبات

```bash
npm install
```

### 2️⃣ إنشاء قاعدة البيانات

افتح MySQL:

```bash
mysql -u root -p
```

ثم نفذ:

```sql
CREATE DATABASE restaurant_ordering_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 3️⃣ إعداد ملف البيئة

انسخ ملف `.env.example` إلى `.env`:

```bash
cp .env.example .env
```

**في Windows:**
```bash
copy .env.example .env
```

عدّل ملف `.env` وضع كلمة مرور MySQL الخاصة بك:

```env
DB_PASSWORD=your_mysql_password_here
```

### 4️⃣ تشغيل Migrations

```bash
npm run migrate
```

### 5️⃣ إضافة بيانات تجريبية

```bash
npm run seed
```

هذا سيضيف:
- ✅ مطعم تجريبي
- ✅ مستخدمين (admin + kitchen)
- ✅ 4 أقسام قائمة
- ✅ 10 أصناف
- ✅ 5 طاولات مع QR Codes

### 6️⃣ تشغيل الخادم

```bash
npm run dev
```

الخادم سيعمل على: **http://localhost:5000**

---

## 🔐 بيانات الدخول التجريبية

### Admin (الإدارة):
- **Email:** `admin@restaurant.com`
- **Password:** `admin123`

### Kitchen (المطبخ):
- **Email:** `kitchen@restaurant.com`
- **Password:** `admin123`

---

## 🧪 اختبار النظام

### 1. تسجيل دخول Admin:

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@restaurant.com",
  "password": "admin123"
}
```

**استخدم Postman أو Thunder Client أو curl**

احفظ الـ `token` من الاستجابة.

### 2. جلب الطاولات:

```bash
GET http://localhost:5000/api/admin/tables
Authorization: Bearer <your-token>
```

### 3. جلب أول QR Code:

من استجابة الطاولات، احفظ `qrCode` للطاولة الأولى (مثل: `QR-1-T1-abc12345`)

### 4. تجربة الزبون - بدء جلسة:

```bash
POST http://localhost:5000/api/sessions/start/QR-1-T1-abc12345
Content-Type: application/json

{
  "numberOfGuests": 2
}
```

احفظ `sessionId` من الاستجابة.

### 5. تصفح القائمة (كزبون):

```bash
GET http://localhost:5000/api/menu/categories
GET http://localhost:5000/api/menu/items
```

### 6. إرسال طلب (كزبون):

```bash
POST http://localhost:5000/api/orders
Content-Type: application/json

{
  "sessionId": 1,
  "items": [
    {
      "itemId": 3,
      "quantity": 2,
      "notes": "بدون ملح"
    },
    {
      "itemId": 6,
      "quantity": 1
    }
  ],
  "notes": "عجّل من فضلك"
}
```

### 7. المطبخ يرى الطلبات:

```bash
GET http://localhost:5000/api/kitchen/orders/pending
Authorization: Bearer <kitchen-token>
```

### 8. المطبخ يغير حالة الطلب:

```bash
PATCH http://localhost:5000/api/kitchen/orders/1/status
Authorization: Bearer <kitchen-token>
Content-Type: application/json

{
  "status": "preparing"
}
```

### 9. إغلاق الجلسة:

```bash
POST http://localhost:5000/api/sessions/1/close
Authorization: Bearer <kitchen-token>
Content-Type: application/json

{
  "notes": "تم الدفع نقداً"
}
```

---

## 📊 لوحات التحكم

### Admin Dashboard:
```bash
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer <admin-token>
```

### Kitchen Dashboard:
```bash
GET http://localhost:5000/api/kitchen/dashboard
Authorization: Bearer <kitchen-token>
```

### تقرير المبيعات:
```bash
GET http://localhost:5000/api/admin/reports/sales?groupBy=day
Authorization: Bearer <admin-token>
```

### الأصناف الأكثر طلباً:
```bash
GET http://localhost:5000/api/admin/reports/popular-items?limit=5
Authorization: Bearer <admin-token>
```

---

## 🗂️ Postman Collection

يمكنك استيراد هذا Collection لـ Postman:

### Base URL:
```
http://localhost:5000
```

### Variables:
- `baseUrl`: `http://localhost:5000`
- `token`: (سيتم ملؤه بعد Login)

---

## 🔧 أوامر مفيدة

### إعادة تشغيل قاعدة البيانات:

```bash
# حذف جميع الجداول
npm run migrate:undo:all

# إعادة إنشائها
npm run migrate

# إضافة البيانات التجريبية
npm run seed
```

### عرض سجلات الخادم:

```bash
# في وضع التطوير مع إعادة تشغيل تلقائية
npm run dev
```

---

## 📱 اختبار السيناريو الكامل

### السيناريو: "عائلة في مطعم"

1. **الوصول للمطعم:**
   - الزبون يجلس على الطاولة T1
   - يمسح QR Code
   - يبدأ جلسة جديدة

2. **الطلب الأول (مقبلات ومشروبات):**
   - يتصفح القائمة
   - يطلب حمص + عصير برتقال
   - المطبخ يستقبل ويبدأ التحضير

3. **الطلب الثاني (وجبة رئيسية):**
   - بعد 15 دقيقة
   - يطلب كبسة + مشاوي
   - المطبخ يستقبل ويحضّر

4. **الطلب الثالث (حلويات):**
   - بعد الانتهاء من الوجبة
   - يطلب كنافة + قهوة
   - المطبخ يجهز

5. **الدفع والمغادرة:**
   - المطبخ يغلق الجلسة
   - يحسب الإجمالي النهائي
   - الطاولة تصبح متاحة

---

## 🐛 حل المشاكل

### لا يعمل npm install:

```bash
# امسح node_modules وأعد التثبيت
rm -rf node_modules package-lock.json
npm install
```

### خطأ في الاتصال بـ MySQL:

```bash
# تأكد من أن MySQL يعمل
# Windows:
net start MySQL80

# Linux/Mac:
sudo systemctl start mysql
```

### Migrations لا تعمل:

```bash
# تأكد من ملف .sequelizerc موجود
# تأكد من مجلد migrations موجود
# تأكد من بيانات الاتصال في .env صحيحة
```

---

## 📞 المساعدة

إذا واجهت أي مشكلة، تحقق من:

1. ✅ MySQL يعمل
2. ✅ قاعدة البيانات `restaurant_ordering_db` موجودة
3. ✅ ملف `.env` معبأ بالبيانات الصحيحة
4. ✅ Migrations تم تشغيلها بنجاح
5. ✅ المنفذ 5000 غير مستخدم

---

**جاهز للاستخدام! 🎉**

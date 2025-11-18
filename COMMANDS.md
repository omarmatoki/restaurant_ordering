# ⚡ دليل الأوامر السريع - Quick Commands Reference

## 🚀 الأوامر الأساسية

### تشغيل المشروع
```bash
# وضع التطوير (مع إعادة التشغيل التلقائي)
npm run dev

# وضع الإنتاج
npm start
```

### إضافة البيانات التجريبية
```bash
# الطريقة الموصى بها (سريعة + رسائل عربية)
npm run seed:run

# أو باستخدام Sequelize CLI
npm run seed

# أو اختصار
npm run db:setup
```

---

## 🗄️ أوامر قاعدة البيانات

### Migrations
```bash
# تشغيل migrations (إنشاء الجداول)
npm run migrate

# التراجع عن آخر migration
npm run migrate:undo

# إنشاء migration جديد
npx sequelize-cli migration:generate --name migration-name
```

### Seeders
```bash
# تشغيل جميع الـ seeders
npm run seed

# التراجع عن جميع الـ seeders
npx sequelize-cli db:seed:undo:all

# التراجع عن آخر seeder
npx sequelize-cli db:seed:undo

# إنشاء seeder جديد
npx sequelize-cli seed:generate --name seeder-name
```

---

## 📦 أوامر npm الأخرى

### التثبيت والتحديث
```bash
# تثبيت المكتبات
npm install

# تثبيت مكتبة جديدة
npm install package-name

# تثبيت مكتبة للتطوير فقط
npm install --save-dev package-name

# تحديث المكتبات
npm update
```

---

## 🔍 أوامر الفحص والاختبار

### اختبار الاتصال بقاعدة البيانات
```bash
# تشغيل السكريبت (سيتصل تلقائياً)
npm run seed:run
```

### اختبار API
```bash
# عرض معلومات السيرفر
curl http://localhost:5000/

# اختبار تسجيل الدخول
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}'
```

---

## 🛠️ أوامر تطوير مفيدة

### Git
```bash
# حفظ التغييرات
git add .
git commit -m "رسالة التغيير"
git push

# معرفة الحالة
git status

# معرفة الفروع
git branch
```

### Node.js
```bash
# معرفة إصدار Node
node --version

# معرفة إصدار npm
npm --version

# تنظيف node_modules
rm -rf node_modules
npm install
```

---

## 📊 أوامر MySQL

### الاتصال
```bash
# الاتصال بـ MySQL (Windows)
mysql -u root -p

# تشغيل ملف SQL
mysql -u root -p < setup-database.sql
```

### أوامر داخل MySQL
```sql
-- عرض قواعد البيانات
SHOW DATABASES;

-- استخدام قاعدة بيانات
USE restaurant_ordering_db;

-- عرض الجداول
SHOW TABLES;

-- عرض بيانات جدول
SELECT * FROM Restaurants;
SELECT * FROM Users;
SELECT * FROM Categories;
SELECT * FROM Items;
SELECT * FROM Tables;

-- عد الصفوف
SELECT COUNT(*) FROM Items;

-- حذف قاعدة بيانات
DROP DATABASE restaurant_ordering_db;

-- إنشاء قاعدة بيانات
CREATE DATABASE restaurant_ordering_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 🔧 سير العمل الكامل

### البدء من الصفر
```bash
# 1. تثبيت المكتبات
npm install

# 2. إنشاء قاعدة البيانات (في MySQL أو phpMyAdmin)
# CREATE DATABASE restaurant_ordering_db;

# 3. تشغيل المشروع (الجداول ستُنشأ تلقائياً)
npm start

# 4. في terminal آخر: إضافة البيانات التجريبية
npm run seed:run
```

### إعادة البدء من الصفر
```bash
# 1. حذف قاعدة البيانات (في phpMyAdmin)

# 2. إعادة إنشاء قاعدة البيانات
# CREATE DATABASE restaurant_ordering_db;

# 3. تشغيل المشروع
npm start

# 4. إضافة البيانات
npm run seed:run
```

---

## 🎯 الأوامر الأكثر استخداماً (Top 5)

```bash
# 1. تشغيل المشروع في وضع التطوير
npm run dev

# 2. إضافة البيانات التجريبية
npm run seed:run

# 3. تثبيت المكتبات (بعد clone)
npm install

# 4. معرفة حالة التغييرات
git status

# 5. حفظ التغييرات
git add . && git commit -m "رسالة" && git push
```

---

## 📝 ملاحظات مهمة

- ⚠️ **لا تستخدم** `node seeders/file.js` مباشرة - استخدم `npm run seed:run`
- ⚠️ تأكد من تشغيل MySQL قبل بدء المشروع
- ⚠️ الجداول تُنشأ تلقائياً عند أول `npm start`
- ✅ استخدم `npm run dev` للتطوير (إعادة تشغيل تلقائية)
- ✅ استخدم `npm start` للإنتاج

---

## 🆘 حل المشاكل السريع

### المشكلة: خطأ في الاتصال بقاعدة البيانات
```bash
# تحقق من تشغيل MySQL
# في XAMPP: Start MySQL
# أو تحقق من إعدادات .env
```

### المشكلة: الجداول غير موجودة
```bash
# شغّل المشروع مرة واحدة
npm start
# الجداول ستُنشأ تلقائياً
```

### المشكلة: لا توجد بيانات
```bash
# أضف البيانات التجريبية
npm run seed:run
```

### المشكلة: خطأ في port 5000
```bash
# Port محجوز؟ غيّره في .env
PORT=3000
```

---

## 📚 مراجع سريعة

- [README.md](README.md) - التوثيق الكامل
- [QUICK-START.md](QUICK-START.md) - البدء السريع
- [SEEDING-GUIDE.md](SEEDING-GUIDE.md) - دليل الـ Seeding
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - حل المشاكل

---

**آخر تحديث:** 2025-11-13

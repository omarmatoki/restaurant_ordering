# 📮 Postman Collection - Update Log

## ✅ تم تحديث الكولكشن الرئيسي

تم إضافة **Initial Register** إلى ملف الكولكشن الرئيسي:
- **الملف:** `Restaurant-Ordering-System.postman_collection.json`
- **الموقع:** في مجلد 🔐 Authentication، بعد Login endpoints
- **التاريخ:** 2025-11-13

---

## 📍 موقع Initial Register في الكولكشن

```
Restaurant Ordering System API
│
└── 🔐 Authentication
    ├── Login (Admin)
    ├── Login (Kitchen)
    ├── ⭐ Initial Register (First Admin)  ← تمت الإضافة هنا
    ├── Get My Profile
    ├── Change Password
    ├── Register New User (Admin Only)
    └── Logout
```

---

## 📦 الملفات المتوفرة الآن

### 1️⃣ الكولكشن الرئيسي الكامل (محدّث) ✅
**الملف:** `Restaurant-Ordering-System.postman_collection.json`

**يحتوي على:**
- ✅ جميع الـ endpoints (50+)
- ✅ Initial Register endpoint
- ✅ Auto-save tokens
- ✅ Environment variables
- ✅ Response examples
- ✅ Arabic descriptions

**كيفية الاستخدام:**
```bash
1. افتح Postman
2. اذهب إلى Import
3. اختر ملف: Restaurant-Ordering-System.postman_collection.json
4. Import!
```

**⚠️ تنبيه:**
- إذا كان لديك كولكشن قديم بنفس الاسم، سيتم إنشاء كولكشن جديد
- يُفضل حذف الكولكشن القديم قبل Import الجديد

---

### 2️⃣ ملف الـ Request منفصل (اختياري)
**الملف:** `Initial-Register.postman_request.json`

**متى تستخدمه:**
- إذا أردت إضافة الـ request فقط بدون تغيير الكولكشن
- لإضافة نسخة إضافية من الـ request

**كيفية الاستخدام:**
```bash
1. افتح الكولكشن القديم في Postman
2. اضغط بزر الماوس الأيمن على مجلد "Authentication"
3. اختر "Add Request"
4. Import من ملف: Initial-Register.postman_request.json
```

---

## 🆚 الفرق بين الملفين

| الميزة | Restaurant-Ordering-System.postman_collection.json | Initial-Register.postman_request.json |
|--------|------------------------------------------------|-------------------------------------|
| النوع | كولكشن كامل (50+ endpoints) | Request واحد فقط |
| الحجم | كبير (~200KB) | صغير (~2KB) |
| الاستخدام | استبدال الكولكشن بالكامل | إضافة request واحد فقط |
| Initial Register | ✅ موجود الآن | ✅ موجود |
| باقي الـ endpoints | ✅ موجودة | ❌ غير موجودة |

---

## 🎯 التوصية

### ✅ **الأفضل: استخدام الكولكشن الكامل المحدّث**

**لماذا؟**
1. ✅ يحتوي على جميع الـ endpoints محدثة
2. ✅ Initial Register موجود في مكانه الصحيح
3. ✅ Auto-save tokens يعمل
4. ✅ Environment variables جاهزة
5. ✅ منظم ومرتب حسب الأقسام

**الخطوات:**
```bash
# 1. احذف الكولكشن القديم (اختياري)
في Postman: اضغط بزر الماوس الأيمن على الكولكشن القديم → Delete

# 2. استورد الكولكشن الجديد
File → Import → Restaurant-Ordering-System.postman_collection.json

# 3. استورد Environment (إذا لم تفعل من قبل)
File → Import → Restaurant-Dev.postman_environment.json

# 4. اختر Environment
من القائمة العلوية: اختر "Restaurant-Dev"

# 5. ابدأ الاختبار!
```

---

## 📋 محتويات Initial Register في الكولكشن

### Request Details:
```
Method: POST
URL: {{base_url}}/api/auth/register/initial
Headers:
  - Content-Type: application/json

Body:
{
  "username": "admin",
  "email": "admin@myrestaurant.com",
  "password": "admin123",
  "restaurantName": "مطعمي",
  "restaurantAddress": "شارع الملك فهد، الرياض",
  "restaurantPhone": "+966501234567"
}
```

### Auto-save Script (في Tests tab):
```javascript
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("admin_token", jsonData.data.token);
    pm.environment.set("user_id", jsonData.data.user.id);
    pm.environment.set("restaurant_id", jsonData.data.user.restaurantId);
    console.log('✅ Admin created successfully!');
    console.log('Token saved:', jsonData.data.token);
}
```

### Success Response Example:
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

---

## 🔄 سير العمل الموصى به

### للمرة الأولى (Initial Setup):
```
1. شغّل السيرفر
   npm start
   ↓
2. افتح Postman
   استورد: Restaurant-Ordering-System.postman_collection.json
   استورد: Restaurant-Dev.postman_environment.json
   ↓
3. اختر Environment: "Restaurant-Dev"
   ↓
4. شغّل: Initial Register (First Admin)
   (سيتم حفظ Token تلقائياً)
   ↓
5. الآن جميع الـ endpoints الأخرى جاهزة للاختبار!
```

### للاختبار اليومي:
```
1. شغّل: Login (Admin) أو Login (Kitchen)
   (Token يُحفظ تلقائياً)
   ↓
2. اختبر أي endpoint تريد
   (Token يُستخدم تلقائياً من Environment)
```

---

## ⚠️ ملاحظات مهمة

### 1. Initial Register يعمل مرة واحدة فقط
```
✅ يعمل: عند عدم وجود Admin
❌ لا يعمل: بعد إنشاء أول Admin
```

### 2. بعد إنشاء أول Admin
```
✅ استخدم: Login (Admin)
✅ ثم: Register New User (Admin Only)
❌ لا تستخدم: Initial Register مرة أخرى
```

### 3. الـ Token يُحفظ تلقائياً
```javascript
// عند تشغيل Initial Register أو Login
// الـ Token يُحفظ في Environment تلقائياً:
{{admin_token}} = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// جميع الـ requests الأخرى تستخدم {{admin_token}} تلقائياً
```

---

## 📚 الملفات المرتبطة

| الملف | الوصف |
|------|-------|
| [Restaurant-Ordering-System.postman_collection.json](Restaurant-Ordering-System.postman_collection.json) | ✅ الكولكشن الكامل المحدّث |
| [Restaurant-Dev.postman_environment.json](Restaurant-Dev.postman_environment.json) | Environment variables |
| [Initial-Register.postman_request.json](Initial-Register.postman_request.json) | Request منفصل (اختياري) |
| [POSTMAN-GUIDE.md](POSTMAN-GUIDE.md) | دليل استخدام Postman شامل |
| [INITIAL-SETUP.md](INITIAL-SETUP.md) | دليل الإعداد الأولي |
| [AUTHENTICATION-FIX.md](AUTHENTICATION-FIX.md) | شرح مشكلة Authentication |
| [HOW-TO-UPDATE-POSTMAN.md](HOW-TO-UPDATE-POSTMAN.md) | كيفية تحديث Postman |

---

## ✅ الخلاصة

### ✔️ تم الإنجاز:
- ✅ إضافة Initial Register إلى الكولكشن الرئيسي
- ✅ Initial Register في الموقع الصحيح (بعد Login)
- ✅ Auto-save Token يعمل
- ✅ Response example مضاف
- ✅ Description بالعربي
- ✅ جميع الملفات محدثة

### 🎯 الآن يمكنك:
1. ✅ استيراد الكولكشن الكامل مباشرة
2. ✅ تشغيل Initial Register بدون token
3. ✅ إنشاء أول Admin + مطعم
4. ✅ الحصول على Token تلقائياً
5. ✅ اختبار جميع الـ endpoints الأخرى

---

**تم التحديث:** 2025-11-13
**الملف المحدّث:** `Restaurant-Ordering-System.postman_collection.json`

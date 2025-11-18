# ⚡ مرجع سريع لـ API - Quick API Reference

## 🔗 Base URL
```
http://localhost:5000
```

---

## 📋 جدول سريع لجميع الـ Endpoints

### 🔐 Authentication

| Method | Endpoint | الوصف | مصادقة؟ |
|--------|----------|-------|---------|
| POST | `/api/auth/login` | تسجيل دخول | ❌ |
| POST | `/api/auth/register` | تسجيل مستخدم جديد | ✅ Admin |
| GET | `/api/auth/me` | معلومات المستخدم الحالي | ✅ |
| POST | `/api/auth/logout` | تسجيل خروج | ✅ |
| PUT | `/api/auth/change-password` | تغيير كلمة المرور | ✅ |

---

### 🍽️ Menu (Public)

| Method | Endpoint | الوصف | مصادقة؟ |
|--------|----------|-------|---------|
| GET | `/api/menu/categories` | جميع الأقسام | ❌ |
| GET | `/api/menu/categories/:id/items` | أصناف قسم معين | ❌ |
| GET | `/api/menu/items` | جميع الأصناف | ❌ |
| GET | `/api/menu/items/:id` | تفاصيل صنف واحد | ❌ |

---

### 📋 Menu Management (Admin)

| Method | Endpoint | الوصف | مصادقة؟ |
|--------|----------|-------|---------|
| POST | `/api/menu/categories` | إنشاء قسم | ✅ Admin |
| PUT | `/api/menu/categories/:id` | تعديل قسم | ✅ Admin |
| DELETE | `/api/menu/categories/:id` | حذف قسم | ✅ Admin |
| POST | `/api/menu/items` | إضافة صنف | ✅ Admin |
| PUT | `/api/menu/items/:id` | تعديل صنف | ✅ Admin |
| DELETE | `/api/menu/items/:id` | حذف صنف | ✅ Admin |
| PATCH | `/api/menu/items/:id/availability` | تفعيل/تعطيل صنف | ✅ Admin/Kitchen |

---

### 🪑 Sessions

| Method | Endpoint | الوصف | مصادقة؟ |
|--------|----------|-------|---------|
| POST | `/api/sessions/start/:qrCode` | بدء جلسة (مسح QR) | ❌ |
| GET | `/api/sessions/:sessionId` | تفاصيل جلسة | ❌ |
| GET | `/api/sessions/table/:tableId` | جلسة نشطة لطاولة | ✅ Kitchen/Admin |
| POST | `/api/sessions/:sessionId/close` | إغلاق جلسة | ✅ Kitchen/Admin |
| GET | `/api/sessions` | جميع الجلسات | ✅ Admin |

---

### 📦 Orders

| Method | Endpoint | الوصف | مصادقة؟ |
|--------|----------|-------|---------|
| POST | `/api/orders` | إنشاء طلب جديد | ❌ |
| GET | `/api/orders/session/:sessionId` | طلبات جلسة معينة | ❌ |
| GET | `/api/orders/:orderId` | تفاصيل طلب | ❌ |
| GET | `/api/orders/active/list` | الطلبات النشطة | ✅ Kitchen/Admin |
| GET | `/api/orders` | جميع الطلبات | ✅ Kitchen/Admin |
| PATCH | `/api/orders/:orderId/status` | تحديث حالة طلب | ✅ Kitchen/Admin |

---

### 👨‍🍳 Kitchen

| Method | Endpoint | الوصف | مصادقة؟ |
|--------|----------|-------|---------|
| GET | `/api/kitchen/dashboard` | لوحة تحكم المطبخ | ✅ Kitchen/Admin |
| GET | `/api/kitchen/orders/pending` | الطلبات الجديدة | ✅ Kitchen/Admin |
| GET | `/api/kitchen/orders/preparing` | الطلبات قيد التحضير | ✅ Kitchen/Admin |
| PATCH | `/api/kitchen/orders/:id/status` | تحديث حالة طلب | ✅ Kitchen/Admin |
| GET | `/api/kitchen/sessions/active` | الجلسات النشطة | ✅ Kitchen/Admin |
| POST | `/api/kitchen/sessions/:id/close` | إغلاق جلسة | ✅ Kitchen/Admin |

---

### 👨‍💼 Admin

| Method | Endpoint | الوصف | مصادقة؟ |
|--------|----------|-------|---------|
| GET | `/api/admin/dashboard` | لوحة تحكم الإدارة | ✅ Admin |
| GET | `/api/admin/reports/sales` | تقرير المبيعات | ✅ Admin |
| GET | `/api/admin/reports/popular-items` | الأصناف الأكثر طلباً | ✅ Admin |
| GET | `/api/admin/tables` | جميع الطاولات | ✅ Admin |
| POST | `/api/admin/tables` | إنشاء طاولة | ✅ Admin |
| PUT | `/api/admin/tables/:id` | تعديل طاولة | ✅ Admin |
| DELETE | `/api/admin/tables/:id` | حذف طاولة | ✅ Admin |
| GET | `/api/admin/users` | جميع المستخدمين | ✅ Admin |
| POST | `/api/admin/users` | إنشاء مستخدم | ✅ Admin |
| PUT | `/api/admin/users/:id` | تعديل مستخدم | ✅ Admin |
| DELETE | `/api/admin/users/:id` | حذف مستخدم | ✅ Admin |

---

## 📊 أمثلة سريعة (cURL)

### 1️⃣ تسجيل الدخول
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "admin123"
  }'
```

### 2️⃣ جلب القائمة
```bash
curl http://localhost:5000/api/menu/categories
```

### 3️⃣ بدء جلسة
```bash
curl -X POST http://localhost:5000/api/sessions/start/QR-1-T1-abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "numberOfGuests": 4
  }'
```

### 4️⃣ إنشاء طلب
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": 1,
    "items": [
      {"itemId": 3, "quantity": 2, "notes": "بدون فلفل"},
      {"itemId": 7, "quantity": 3}
    ],
    "notes": "عجّل من فضلك"
  }'
```

### 5️⃣ تحديث حالة طلب (يحتاج Token)
```bash
curl -X PATCH http://localhost:5000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "preparing"
  }'
```

---

## 🔑 Headers المطلوبة

### للـ Endpoints العامة (Public):
```
Content-Type: application/json
```

### للـ Endpoints المحمية (Protected):
```
Content-Type: application/json
Authorization: Bearer <your-token-here>
```

---

## 📝 أمثلة على Request Bodies

### إنشاء قسم جديد
```json
{
  "name": "Seafood",
  "nameAr": "المأكولات البحرية",
  "description": "أطباق السمك والمأكولات البحرية",
  "displayOrder": 5
}
```

### إضافة صنف جديد
```json
{
  "categoryId": 2,
  "name": "Mansaf",
  "nameAr": "منسف",
  "description": "منسف أردني تقليدي",
  "price": 70.00,
  "image": "https://via.placeholder.com/300",
  "preparationTime": 40,
  "displayOrder": 4
}
```

### إنشاء طاولة
```json
{
  "tableNumber": "T6",
  "capacity": 6,
  "location": "الطابق الثالث - الشرفة"
}
```

### إنشاء طلب
```json
{
  "sessionId": 1,
  "items": [
    {
      "itemId": 3,
      "quantity": 2,
      "notes": "بدون فلفل من فضلك"
    },
    {
      "itemId": 7,
      "quantity": 3
    }
  ],
  "notes": "عجّل من فضلك"
}
```

### تحديث حالة طلب
```json
{
  "status": "preparing"
}
```

---

## 📊 Query Parameters

### تقرير المبيعات
```
GET /api/admin/reports/sales?period=monthly&startDate=2024-01-01&endDate=2024-12-31
```

Parameters:
- `period`: `daily`, `weekly`, `monthly`
- `startDate`: تاريخ البداية (YYYY-MM-DD)
- `endDate`: تاريخ النهاية (YYYY-MM-DD)

### الأصناف الأكثر طلباً
```
GET /api/admin/reports/popular-items?limit=10
```

Parameters:
- `limit`: عدد الأصناف (افتراضي: 10)

### جميع الجلسات
```
GET /api/sessions?status=active&limit=20
```

Parameters:
- `status`: `active`, `closed`
- `limit`: عدد النتائج

---

## 🎯 حالات الطلب (Order Status)

```
new         → الطلب جديد
preparing   → قيد التحضير
delivered   → تم التوصيل
```

**Flow:**
```
new → preparing → delivered
```

---

## 🔄 حالات الجلسة (Session Status)

```
active   → جلسة نشطة
closed   → جلسة مغلقة
```

---

## 🔐 الأدوار (Roles)

```
admin    → مدير النظام (كل الصلاحيات)
kitchen  → المطبخ (إدارة الطلبات والجلسات)
```

---

## 📋 Response Format

### نجاح (Success)
```json
{
  "success": true,
  "message": "رسالة النجاح",
  "data": { ... }
}
```

### خطأ (Error)
```json
{
  "success": false,
  "message": "رسالة الخطأ",
  "error": "تفاصيل الخطأ"
}
```

---

## 🧪 اختبار سريع

### 1. Health Check
```bash
curl http://localhost:5000/
```

**Expected:**
```json
{
  "success": true,
  "message": "Restaurant Ordering System API",
  "version": "1.0.0"
}
```

### 2. تسجيل دخول وحفظ Token
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}' \
  | jq -r '.token')

echo $TOKEN
```

### 3. استخدام Token
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/me
```

---

## 📚 المراجع

- [Postman Collection](Restaurant-Ordering-System.postman_collection.json)
- [Postman Guide](POSTMAN-GUIDE.md)
- [Full Documentation](README.md)
- [Credentials](CREDENTIALS.md)

---

**المجموع:** 50+ Endpoint جاهزة! ✨

**آخر تحديث:** 2025-11-13

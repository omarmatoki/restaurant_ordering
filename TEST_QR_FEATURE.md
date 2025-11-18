# اختبار ميزة QR Code

## الخطوات للاختبار

### 1. تسجيل الدخول كمدير
أولاً، سجل الدخول للحصول على token:

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@restaurant.com",
  "password": "admin123"
}
```

ستحصل على response مثل:
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "username": "admin",
    "email": "admin@restaurant.com",
    "role": "admin",
    "restaurantId": 1
  }
}
```

احفظ الـ `token` للاستخدام في الطلبات التالية.

### 2. إنشاء طاولة جديدة مع QR Code

```bash
POST http://localhost:5000/api/admin/tables
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "tableNumber": "10",
  "capacity": 4,
  "location": "الطابق الأول"
}
```

ستحصل على response:
```json
{
  "success": true,
  "message": "تم إنشاء الطاولة بنجاح",
  "data": {
    "id": 5,
    "tableNumber": "10",
    "qrCode": "QR-1-10-abc12345",
    "qrCodeImage": "/qr-codes/table-1-10-1731585390123.png",
    "capacity": 4,
    "location": "الطابق الأول",
    "status": "available",
    "isActive": true,
    "restaurantId": 1,
    "createdAt": "2024-11-14T12:00:00.000Z",
    "updatedAt": "2024-11-14T12:00:00.000Z"
  }
}
```

### 3. عرض صورة QR Code

افتح المتصفح واذهب إلى:
```
http://localhost:5000/qr-codes/table-1-10-1731585390123.png
```

(استخدم المسار الذي حصلت عليه في `qrCodeImage` من الخطوة السابقة)

سترى صورة QR Code التي يمكن مسحها بالهاتف.

### 4. مسح QR Code بالهاتف

1. افتح تطبيق الكاميرا في هاتفك
2. وجه الكاميرا على صورة QR Code
3. سيظهر لك رابط مثل: `http://localhost:3000/menu/QR-1-10-abc12345`
4. اضغط على الرابط (لاحظ أن Frontend يجب أن يكون جاهزاً لاستقبال هذا الرابط)

### 5. جلب جميع الطاولات

للتأكد من أن جميع الطاولات تحتوي على QR Code:

```bash
GET http://localhost:5000/api/admin/tables
Authorization: Bearer YOUR_TOKEN_HERE
```

## استخدام Postman

### إعداد Environment في Postman

1. افتح Postman
2. أنشئ Environment جديد باسم "Restaurant Dev"
3. أضف المتغيرات التالية:
   - `base_url`: `http://localhost:5000`
   - `token`: (سيتم ملؤه تلقائياً بعد تسجيل الدخول)

### Requests في Postman

#### 1. Login (POST {{base_url}}/api/auth/login)
```json
{
  "email": "admin@restaurant.com",
  "password": "admin123"
}
```

في Tests tab، أضف:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

#### 2. Create Table (POST {{base_url}}/api/admin/tables)
Headers:
- `Authorization`: `Bearer {{token}}`

Body:
```json
{
  "tableNumber": "11",
  "capacity": 6,
  "location": "الطابق الثاني"
}
```

#### 3. Get All Tables (GET {{base_url}}/api/admin/tables)
Headers:
- `Authorization`: `Bearer {{token}}`

#### 4. View QR Code Image
افتح المتصفح واذهب إلى:
```
{{base_url}}{{qrCodeImage}}
```
(حيث `qrCodeImage` هو القيمة المرجعة من Create Table)

## النتيجة المتوقعة

عند مسح QR Code، سيتم توجيه المستخدم إلى:
```
http://localhost:3000/menu/QR-1-10-abc12345
```

يجب على Frontend:
1. استخراج `qrCode` من URL
2. البحث عن الطاولة باستخدام هذا الـ qrCode
3. إنشاء جلسة جديدة للطاولة
4. عرض قائمة المطعم للزبون

## ملاحظات

- تأكد من أن `FRONTEND_URL` في ملف `.env` يشير إلى الرابط الصحيح
- صور QR Code محفوظة في مجلد `public/qr-codes/`
- يمكنك طباعة صور QR Code ووضعها على الطاولات الفعلية
- كل طاولة لها QR Code فريد لا يتغير

# ميزة توليد صور QR Code للطاولات

## التعديلات التي تمت

### 1. إضافة حقل جديد في قاعدة البيانات
تم إضافة حقل `qrCodeImage` في جدول `Tables` لحفظ مسار صورة QR code.

### 2. تحديث Model
تم تحديث ملف [models/Table.js](models/Table.js) لإضافة الحقل الجديد:
```javascript
qrCodeImage: {
  type: DataTypes.STRING(255),
  allowNull: true,
  comment: 'Path to the QR code image file'
}
```

### 3. دالة توليد صور QR
تم إضافة دالة `generateQRCodeImage` في ملف [utils/generateNumbers.js](utils/generateNumbers.js:33) لتوليد صور QR code.

الدالة تقوم بـ:
- إنشاء رابط URL يوجه إلى قائمة المطعم للطاولة المحددة
- توليد صورة QR بدقة 300x300 بكسل
- حفظ الصورة في مجلد `public/qr-codes/`
- إرجاع المسار النسبي للصورة

### 4. تحديث Controller
تم تحديث دالة `createTable` في ملف [controllers/adminController.js](controllers/adminController.js:290) لتوليد صورة QR عند إنشاء طاولة جديدة.

### 5. مجلد الصور الثابتة
- تم إنشاء مجلد `public/qr-codes/` لحفظ صور QR
- تم إضافة route ثابت في [server.js](server.js:26) للوصول إلى الصور

## كيفية الاستخدام

### إنشاء طاولة جديدة
عند إنشاء طاولة جديدة عبر API:

```bash
POST /api/admin/tables
{
  "tableNumber": "1",
  "capacity": 4,
  "location": "الطابق الأول"
}
```

سيتم:
1. توليد QR code فريد للطاولة
2. إنشاء صورة QR code وحفظها
3. حفظ مسار الصورة في قاعدة البيانات

### الوصول إلى صورة QR
يمكن الوصول إلى صورة QR code من خلال:
```
http://localhost:5000/qr-codes/table-{restaurantId}-{tableNumber}-{timestamp}.png
```

مثال:
```
http://localhost:5000/qr-codes/table-1-5-1699123456789.png
```

### عرض بيانات الطاولة
عند جلب بيانات الطاولة، ستحصل على:
```json
{
  "id": 1,
  "tableNumber": "5",
  "qrCode": "QR-1-5-abc123de",
  "qrCodeImage": "/qr-codes/table-1-5-1699123456789.png",
  "capacity": 4,
  "location": "الطابق الأول",
  ...
}
```

## ملاحظات مهمة

1. **الرابط في QR Code**:
   - يتم توليد رابط يوجه إلى `{FRONTEND_URL}/menu/{qrCode}`
   - تأكد من تحديث `FRONTEND_URL` في ملف `.env` للرابط الصحيح

2. **مسح QR Code**:
   - عندما يمسح الزبون صورة QR، سيتم توجيهه إلى صفحة القائمة
   - يجب على Frontend استقبال الـ qrCode واستخدامه لفتح جلسة جديدة

3. **الطاولات القديمة**:
   - الطاولات التي تم إنشاؤها قبل هذا التحديث لن يكون لها صورة QR
   - يمكنك تحديث الطاولات القديمة من خلال تعديلها

## متطلبات Frontend

يحتاج Frontend إلى:
1. عرض صورة QR code للطاولات في لوحة التحكم
2. صفحة `/menu/:qrCode` لعرض القائمة عند مسح QR code
3. إنشاء جلسة جديدة تلقائياً عند الوصول من خلال QR code

## مثال على عرض صورة QR في Frontend

```javascript
// في صفحة إدارة الطاولات
<img
  src={`http://localhost:5000${table.qrCodeImage}`}
  alt={`QR Code for Table ${table.tableNumber}`}
  style={{ width: '200px', height: '200px' }}
/>
```

## طباعة صور QR

يمكنك طباعة صور QR code ووضعها على الطاولات في المطعم. عندما يمسح الزبون الصورة بهاتفه، سيتم توجيهه مباشرة إلى قائمة المطعم.

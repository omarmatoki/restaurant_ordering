# دليل رفع الصور للأصناف - Image Upload Guide

## نظرة عامة

تم تحديث النظام لدعم رفع صور متعددة لكل صنف (item) في القائمة. يمكنك الآن رفع حتى 5 صور لكل صنف.

## التغييرات الرئيسية

### 1. Model
- تم تغيير حقل `image` (نص واحد) إلى `images` (مصفوفة JSON)
- يتم تخزين مسارات الصور كمصفوفة: `["/uploads/items/image1.jpg", "/uploads/items/image2.jpg"]`

### 2. API Endpoints

#### إنشاء صنف جديد (Create Item)
```http
POST /api/menu/items
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Form Data:**
- `categoryId` (required) - رقم القسم
- `name` (required) - اسم الصنف
- `nameAr` (optional) - الاسم بالعربية
- `description` (optional) - الوصف
- `price` (required) - السعر
- `preparationTime` (optional) - وقت التحضير بالدقائق
- `displayOrder` (optional) - ترتيب العرض
- `images` (optional) - الصور (حتى 5 ملفات)

**مثال باستخدام cURL:**
```bash
curl -X POST http://localhost:5000/api/menu/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "categoryId=1" \
  -F "name=Pizza Margherita" \
  -F "nameAr=بيتزا مارغريتا" \
  -F "description=Classic Italian pizza" \
  -F "price=45.00" \
  -F "preparationTime=20" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg"
```

**مثال باستخدام Postman:**
1. اختر POST method
2. أدخل URL: `http://localhost:5000/api/menu/items`
3. اذهب إلى Headers وأضف: `Authorization: Bearer YOUR_TOKEN`
4. اذهب إلى Body
5. اختر `form-data`
6. أضف الحقول:
   - categoryId: 1
   - name: Pizza Margherita
   - price: 45.00
   - images: (اختر File من القائمة المنسدلة وحدد صورة) - يمكن إضافة عدة حقول images

#### تحديث صنف (Update Item)
```http
PUT /api/menu/items/:id
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Form Data:**
- نفس الحقول السابقة
- `replaceImages` (optional) - "true" لاستبدال جميع الصور، وإلا سيتم إضافة الصور الجديدة للموجودة

**أمثلة:**

**إضافة صور جديدة للصور الموجودة:**
```bash
curl -X PUT http://localhost:5000/api/menu/items/5 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@/path/to/new-image.jpg"
```

**استبدال جميع الصور:**
```bash
curl -X PUT http://localhost:5000/api/menu/items/5 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "replaceImages=true" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

#### عرض الأصناف (Get Items)
```http
GET /api/menu/items
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "categoryId": 1,
      "name": "Pizza Margherita",
      "nameAr": "بيتزا مارغريتا",
      "description": "Classic Italian pizza",
      "price": "45.00",
      "images": [
        "/uploads/items/pizza-1234567890.jpg",
        "/uploads/items/pizza-1234567891.jpg",
        "/uploads/items/pizza-1234567892.jpg"
      ],
      "isAvailable": true,
      "preparationTime": 20,
      "displayOrder": 0
    }
  ]
}
```

## قيود رفع الملفات

- **أنواع الملفات المسموحة:** jpeg, jpg, png, gif, webp
- **الحد الأقصى لحجم الملف:** 5MB لكل صورة
- **الحد الأقصى لعدد الصور:** 5 صور في طلب واحد

## الوصول إلى الصور

الصور المرفوعة متاحة عبر:
```
http://localhost:5000/uploads/items/{filename}
```

مثال:
```
http://localhost:5000/uploads/items/pizza-1234567890.jpg
```

## مثال JavaScript (Fetch API)

```javascript
async function createItemWithImages() {
  const formData = new FormData();

  formData.append('categoryId', '1');
  formData.append('name', 'Pizza Margherita');
  formData.append('nameAr', 'بيتزا مارغريتا');
  formData.append('description', 'Classic Italian pizza');
  formData.append('price', '45.00');
  formData.append('preparationTime', '20');

  // إضافة صور متعددة
  const fileInput = document.getElementById('imageFiles');
  for (let i = 0; i < fileInput.files.length; i++) {
    formData.append('images', fileInput.files[i]);
  }

  const response = await fetch('http://localhost:5000/api/menu/items', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();
  console.log(result);
}
```

## مثال HTML Form

```html
<form id="createItemForm" enctype="multipart/form-data">
  <input type="number" name="categoryId" placeholder="Category ID" required>
  <input type="text" name="name" placeholder="Item Name" required>
  <input type="text" name="nameAr" placeholder="Arabic Name">
  <textarea name="description" placeholder="Description"></textarea>
  <input type="number" name="price" step="0.01" placeholder="Price" required>
  <input type="number" name="preparationTime" placeholder="Prep Time (minutes)">

  <!-- اختيار صور متعددة -->
  <input type="file" id="imageFiles" name="images" multiple accept="image/*" max="5">

  <button type="submit">Create Item</button>
</form>

<script>
document.getElementById('createItemForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const token = localStorage.getItem('token'); // احصل على token من localStorage

  try {
    const response = await fetch('http://localhost:5000/api/menu/items', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      alert('تم إنشاء الصنف بنجاح!');
      console.log('Created item:', result.data);
    } else {
      alert('خطأ: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('حدث خطأ في الاتصال');
  }
});
</script>
```

## معالجة الأخطاء

### أخطاء محتملة:

1. **حجم الملف كبير جداً**
```json
{
  "success": false,
  "message": "حجم الملف كبير جداً. الحد الأقصى 5MB"
}
```

2. **نوع الملف غير مسموح**
```json
{
  "success": false,
  "message": "فقط ملفات الصور مسموحة (jpeg, jpg, png, gif, webp)"
}
```

3. **عدد الملفات كبير جداً**
```json
{
  "success": false,
  "message": "عدد الملفات كبير جداً. الحد الأقصى 5 صور"
}
```

## ملاحظات مهمة

1. **الصلاحيات:** يجب أن يكون المستخدم لديه دور `admin` لإنشاء أو تحديث الأصناف
2. **Token:** يجب إرسال JWT token في header `Authorization`
3. **Content-Type:** عند رفع ملفات، يجب استخدام `multipart/form-data` (يتم تعيينه تلقائياً بواسطة FormData)
4. **الصور الاختيارية:** يمكن إنشاء صنف بدون صور، الحقل `images` اختياري

## Migration

إذا كنت تقوم بترقية نظام قائم:

1. تم ترحيل البيانات الموجودة تلقائياً
2. الحقل القديم `image` (نص) تم تحويله إلى `images` (مصفوفة)
3. الصور القديمة المخزنة في حقل `image` تم نقلها إلى أول عنصر في مصفوفة `images`

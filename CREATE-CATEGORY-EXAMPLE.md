# إنشاء قسم جديد (Category) قبل إضافة الأصناف

## للحصول على الأقسام الموجودة:

```http
GET http://localhost:5000/api/menu/categories
```

## لإنشاء قسم جديد:

```http
POST http://localhost:5000/api/menu/categories
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Burgers",
  "nameAr": "البرجر",
  "description": "Delicious burgers and sandwiches",
  "displayOrder": 3
}
```

## مثال في Postman:

### الإعدادات:
- **Method:** POST
- **URL:** `http://localhost:5000/api/menu/categories`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN`
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "Burgers",
  "nameAr": "البرجر",
  "description": "Delicious burgers and sandwiches",
  "displayOrder": 3
}
```

بعد إنشاء القسم، استخدم الـ `id` الذي يرجع في الـ response لإضافة الأصناف.

## الأقسام الموجودة حالياً:

| ID | Name | NameAr |
|----|------|--------|
| 7  | طبق  | الأطباق الرئيسية |
| 8  | Seafood | المأكولات البحرية |

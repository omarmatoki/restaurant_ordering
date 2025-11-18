# 📡 أمثلة API الكاملة - Complete API Examples

## 🔐 Authentication

### 1. Login (تسجيل دخول)

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@restaurant.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@restaurant.com",
      "role": "admin",
      "restaurant": {
        "id": 1,
        "name": "مطعم الذواقة"
      }
    }
  }
}
```

### 2. Get Current User (معلومات المستخدم)

```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token>
```

### 3. Change Password (تغيير كلمة المرور)

```http
PUT http://localhost:5000/api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "admin123",
  "newPassword": "newPassword123"
}
```

### 4. Register New User (تسجيل مستخدم - Admin only)

```http
POST http://localhost:5000/api/auth/register
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "username": "kitchen2",
  "email": "kitchen2@restaurant.com",
  "password": "kitchen123",
  "role": "kitchen",
  "restaurantId": 1
}
```

---

## 🍽️ Menu Management

### 1. Get All Categories (جلب الأقسام - Public)

```http
GET http://localhost:5000/api/menu/categories
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "restaurantId": 1,
      "name": "Appetizers",
      "nameAr": "المقبلات",
      "description": "مقبلات شهية لبداية وجبتك",
      "displayOrder": 1,
      "isActive": true
    }
  ]
}
```

### 2. Get Items by Category (أصناف قسم معين)

```http
GET http://localhost:5000/api/menu/categories/1/items
```

### 3. Get All Items (جلب جميع الأصناف)

```http
GET http://localhost:5000/api/menu/items
```

### 4. Search Items (البحث عن أصناف)

```http
GET http://localhost:5000/api/menu/items?search=دجاج
```

### 5. Get Single Item (تفاصيل صنف)

```http
GET http://localhost:5000/api/menu/items/3
```

### 6. Create Category (إنشاء قسم - Admin)

```http
POST http://localhost:5000/api/menu/categories
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Soups",
  "nameAr": "الشوربات",
  "description": "شوربات ساخنة لذيذة",
  "displayOrder": 5
}
```

### 7. Update Category (تعديل قسم - Admin)

```http
PUT http://localhost:5000/api/menu/categories/1
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Appetizers Updated",
  "displayOrder": 1,
  "isActive": true
}
```

### 8. Delete Category (حذف قسم - Admin)

```http
DELETE http://localhost:5000/api/menu/categories/5
Authorization: Bearer <admin-token>
```

### 9. Create Item (إنشاء صنف - Admin)

```http
POST http://localhost:5000/api/menu/items
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "categoryId": 2,
  "name": "Beef Steak",
  "nameAr": "ستيك لحم",
  "description": "ستيك لحم طري مشوي",
  "price": 75.00,
  "image": "https://example.com/steak.jpg",
  "preparationTime": 20,
  "displayOrder": 4
}
```

### 10. Update Item (تعديل صنف - Admin)

```http
PUT http://localhost:5000/api/menu/items/3
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Grilled Chicken Deluxe",
  "price": 50.00,
  "isAvailable": true
}
```

### 11. Toggle Item Availability (تغيير حالة التوفر)

```http
PATCH http://localhost:5000/api/menu/items/3/availability
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "isAvailable": false
}
```

---

## 🪑 Sessions Management

### 1. Start Session (بدء جلسة - عند مسح QR)

```http
POST http://localhost:5000/api/sessions/start/QR-1-T1-abc12345
Content-Type: application/json

{
  "numberOfGuests": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم بدء جلسة جديدة بنجاح",
  "data": {
    "session": {
      "id": 1,
      "restaurantId": 1,
      "tableId": 1,
      "sessionNumber": "S-20240101-123456",
      "startTime": "2024-01-01T10:00:00.000Z",
      "status": "active",
      "numberOfGuests": 3
    },
    "table": {
      "id": 1,
      "tableNumber": "T1",
      "location": "الطابق الأول - المنطقة الأمامية"
    }
  }
}
```

### 2. Get Session Details (تفاصيل جلسة)

```http
GET http://localhost:5000/api/sessions/1
```

### 3. Get Active Session by Table (جلسة نشطة لطاولة)

```http
GET http://localhost:5000/api/sessions/table/1
Authorization: Bearer <kitchen-token>
```

### 4. Close Session (إغلاق جلسة - Kitchen/Admin)

```http
POST http://localhost:5000/api/sessions/1/close
Authorization: Bearer <kitchen-token>
Content-Type: application/json

{
  "notes": "تم الدفع نقداً - 150 ريال"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إغلاق الجلسة بنجاح",
  "data": {
    "id": 1,
    "sessionNumber": "S-20240101-123456",
    "startTime": "2024-01-01T10:00:00.000Z",
    "endTime": "2024-01-01T11:30:00.000Z",
    "status": "closed",
    "totalAmount": "145.00",
    "closedBy": 2,
    "orders": [...]
  }
}
```

### 5. Get All Sessions (جميع الجلسات - Admin)

```http
GET http://localhost:5000/api/sessions?status=closed&page=1&limit=20
Authorization: Bearer <admin-token>
```

---

## 📦 Orders Management

### 1. Create Order (إرسال طلب - Customer)

```http
POST http://localhost:5000/api/orders
Content-Type: application/json

{
  "sessionId": 1,
  "items": [
    {
      "itemId": 3,
      "quantity": 2,
      "notes": "بدون ملح كثير"
    },
    {
      "itemId": 6,
      "quantity": 2
    },
    {
      "itemId": 9,
      "quantity": 1,
      "notes": "مع آيس كريم"
    }
  ],
  "notes": "نريد الطلب سريعاً من فضلكم"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إرسال الطلب بنجاح",
  "data": {
    "id": 1,
    "sessionId": 1,
    "tableId": 1,
    "orderNumber": "O-20240101-123456",
    "orderTime": "2024-01-01T10:05:00.000Z",
    "status": "new",
    "totalAmount": "119.00",
    "notes": "نريد الطلب سريعاً من فضلكم",
    "orderItems": [...]
  }
}
```

### 2. Get Orders by Session (طلبات جلسة)

```http
GET http://localhost:5000/api/orders/session/1
```

### 3. Get Single Order (تفاصيل طلب)

```http
GET http://localhost:5000/api/orders/1
```

### 4. Get All Orders (جميع الطلبات - Kitchen)

```http
GET http://localhost:5000/api/orders?status=new&page=1
Authorization: Bearer <kitchen-token>
```

### 5. Get Active Orders (الطلبات النشطة فقط)

```http
GET http://localhost:5000/api/orders/active/list
Authorization: Bearer <kitchen-token>
```

### 6. Update Order Status (تغيير حالة الطلب)

```http
PATCH http://localhost:5000/api/orders/1/status
Authorization: Bearer <kitchen-token>
Content-Type: application/json

{
  "status": "preparing"
}
```

**Available statuses:**
- `new` - طلب جديد
- `preparing` - قيد التحضير
- `delivered` - تم التوصيل

---

## 👨‍🍳 Kitchen Dashboard

### 1. Kitchen Dashboard Stats (إحصائيات)

```http
GET http://localhost:5000/api/kitchen/dashboard
Authorization: Bearer <kitchen-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activeSessions": 5,
    "pendingOrders": 3,
    "preparingOrders": 2,
    "completedToday": 45
  }
}
```

### 2. Get Pending Orders (الطلبات الجديدة)

```http
GET http://localhost:5000/api/kitchen/orders/pending
Authorization: Bearer <kitchen-token>
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 5,
      "orderNumber": "O-20240101-789012",
      "orderTime": "2024-01-01T10:30:00.000Z",
      "status": "new",
      "totalAmount": "89.00",
      "waitingTime": 5,
      "table": {
        "tableNumber": "T3",
        "location": "الطابق الأول"
      },
      "orderItems": [...]
    }
  ]
}
```

### 3. Get Preparing Orders (قيد التحضير)

```http
GET http://localhost:5000/api/kitchen/orders/preparing
Authorization: Bearer <kitchen-token>
```

### 4. Get Active Sessions (الجلسات النشطة)

```http
GET http://localhost:5000/api/kitchen/sessions/active
Authorization: Bearer <kitchen-token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "sessionNumber": "S-20240101-123456",
      "startTime": "2024-01-01T10:00:00.000Z",
      "status": "active",
      "table": {
        "tableNumber": "T1",
        "location": "الطابق الأول"
      },
      "orderStats": {
        "total": 3,
        "new": 1,
        "preparing": 1,
        "delivered": 1
      },
      "durationMinutes": 45,
      "currentTotal": "145.00"
    }
  ]
}
```

### 5. Update Order Status (Kitchen)

```http
PATCH http://localhost:5000/api/kitchen/orders/1/status
Authorization: Bearer <kitchen-token>
Content-Type: application/json

{
  "status": "delivered"
}
```

### 6. Close Session (Kitchen)

```http
POST http://localhost:5000/api/kitchen/sessions/1/close
Authorization: Bearer <kitchen-token>
Content-Type: application/json

{
  "notes": "تم الدفع كاش"
}
```

---

## 🔧 Admin Dashboard

### 1. Admin Dashboard (لوحة التحكم)

```http
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activeSessions": 5,
    "todaySales": "2450.00",
    "activeOrders": 8,
    "totalTables": 10,
    "occupiedTables": 5,
    "occupancyRate": 50.0,
    "avgSessionValue": "163.33"
  }
}
```

### 2. Sales Report (تقرير المبيعات)

```http
GET http://localhost:5000/api/admin/reports/sales?groupBy=day&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <admin-token>
```

**groupBy options:** `day`, `week`, `month`

**Response:**
```json
{
  "success": true,
  "data": {
    "salesData": [
      {
        "date": "2024-01-01",
        "totalSales": "2450.00",
        "sessionsCount": 15,
        "avgSessionValue": "163.33"
      },
      {
        "date": "2024-01-02",
        "totalSales": "3200.00",
        "sessionsCount": 20,
        "avgSessionValue": "160.00"
      }
    ],
    "totals": {
      "totalSales": "75000.00",
      "totalSessions": 500,
      "avgSessionValue": "150.00"
    }
  }
}
```

### 3. Popular Items Report (الأصناف الأكثر طلباً)

```http
GET http://localhost:5000/api/admin/reports/popular-items?limit=10&startDate=2024-01-01
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "item": {
        "id": 3,
        "name": "Grilled Chicken",
        "nameAr": "دجاج مشوي",
        "price": "45.00",
        "category": {
          "name": "Main Courses",
          "nameAr": "الأطباق الرئيسية"
        }
      },
      "totalOrdered": 250,
      "totalRevenue": "11250.00",
      "ordersCount": 180
    }
  ]
}
```

---

## 🪑 Tables Management

### 1. Get All Tables (جميع الطاولات)

```http
GET http://localhost:5000/api/admin/tables
Authorization: Bearer <admin-token>
```

### 2. Create Table (إنشاء طاولة)

```http
POST http://localhost:5000/api/admin/tables
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "tableNumber": "T6",
  "capacity": 4,
  "location": "الطابق الثالث"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء الطاولة بنجاح",
  "data": {
    "id": 6,
    "restaurantId": 1,
    "tableNumber": "T6",
    "qrCode": "QR-1-T6-abc12345",
    "capacity": 4,
    "location": "الطابق الثالث",
    "status": "available",
    "isActive": true
  }
}
```

### 3. Update Table (تعديل طاولة)

```http
PUT http://localhost:5000/api/admin/tables/6
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "tableNumber": "T6-VIP",
  "capacity": 6,
  "location": "الطابق الثالث - VIP"
}
```

### 4. Delete Table (حذف طاولة)

```http
DELETE http://localhost:5000/api/admin/tables/6
Authorization: Bearer <admin-token>
```

---

## 👥 Users Management

### 1. Get All Users (جميع المستخدمين)

```http
GET http://localhost:5000/api/admin/users
Authorization: Bearer <admin-token>
```

### 2. Create User (إنشاء مستخدم)

```http
POST http://localhost:5000/api/admin/users
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "username": "kitchen3",
  "email": "kitchen3@restaurant.com",
  "password": "kitchen123",
  "role": "kitchen"
}
```

### 3. Update User (تعديل مستخدم)

```http
PUT http://localhost:5000/api/admin/users/3
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "username": "kitchen3_updated",
  "isActive": true
}
```

### 4. Delete User (حذف مستخدم)

```http
DELETE http://localhost:5000/api/admin/users/3
Authorization: Bearer <admin-token>
```

---

## 🎯 Complete User Journey Example

### سيناريو كامل: "زبون يطلب وجبة"

#### 1. الزبون يمسح QR Code:
```http
POST http://localhost:5000/api/sessions/start/QR-1-T1-abc12345
{"numberOfGuests": 2}
```
→ يحصل على `sessionId: 1`

#### 2. يتصفح القائمة:
```http
GET http://localhost:5000/api/menu/categories
GET http://localhost:5000/api/menu/items
```

#### 3. يرسل طلب (مقبلات ومشروبات):
```http
POST http://localhost:5000/api/orders
{
  "sessionId": 1,
  "items": [
    {"itemId": 1, "quantity": 1},
    {"itemId": 6, "quantity": 2}
  ]
}
```

#### 4. المطبخ يرى الطلب:
```http
GET http://localhost:5000/api/kitchen/orders/pending
Authorization: Bearer <kitchen-token>
```

#### 5. المطبخ يبدأ التحضير:
```http
PATCH http://localhost:5000/api/kitchen/orders/1/status
{"status": "preparing"}
```

#### 6. الزبون يطلب طلب ثاني (وجبة رئيسية):
```http
POST http://localhost:5000/api/orders
{
  "sessionId": 1,
  "items": [
    {"itemId": 4, "quantity": 1},
    {"itemId": 5, "quantity": 1}
  ]
}
```

#### 7. المطبخ ينهي الطلب الأول:
```http
PATCH http://localhost:5000/api/kitchen/orders/1/status
{"status": "delivered"}
```

#### 8. المطبخ يغلق الجلسة:
```http
POST http://localhost:5000/api/kitchen/sessions/1/close
{"notes": "تم الدفع نقداً"}
```

---

**جميع الأمثلة جاهزة للاستخدام مع Postman أو أي أداة API Testing! 🚀**

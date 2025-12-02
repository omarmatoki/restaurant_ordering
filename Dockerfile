# استخدام صورة Node.js الرسمية
FROM node:18-alpine

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات package.json و package-lock.json
COPY package*.json ./

# تثبيت المكتبات
RUN npm install --production

# نسخ باقي الملفات
COPY . .

# إنشاء المجلدات المطلوبة
RUN mkdir -p public/qr-codes uploads

# تعريف المنفذ الذي سيعمل عليه التطبيق
EXPOSE 3000

# أمر بدء التطبيق
CMD ["npm", "start"]

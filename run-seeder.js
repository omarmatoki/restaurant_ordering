/**
 * سكريبت مستقل لتشغيل البيانات التجريبية
 * Run Seeder Script - Standalone Execution
 *
 * الاستخدام:
 * node run-seeder.js
 */

require('dotenv').config();
const { sequelize } = require('./models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const runSeeder = async () => {
  try {
    console.log('🔄 جاري الاتصال بقاعدة البيانات...');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح\n');

    // Import models
    const { Restaurant, User, Category, Item, Table } = require('./models');

    console.log('🗑️  حذف البيانات القديمة...');

    // Delete old data in correct order (respecting foreign keys)
    await Table.destroy({ where: {}, force: true });
    await Item.destroy({ where: {}, force: true });
    await Category.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    await Restaurant.destroy({ where: {}, force: true });

    console.log('✅ تم حذف البيانات القديمة\n');

    console.log('📝 إضافة البيانات التجريبية الجديدة...\n');

    // 1. Create Restaurant
    console.log('1️⃣  إنشاء مطعم تجريبي...');
    const restaurant = await Restaurant.create({
      id: 1,
      name: 'مطعم الذواقة',
      address: 'شارع الملك فهد، الرياض',
      phone: '+966501234567',
      email: 'info@restaurant.com',
      logo: 'https://via.placeholder.com/200',
      isActive: true
    });
    console.log('   ✅ تم إنشاء المطعم: ' + restaurant.name);

    // 2. Create Users
    console.log('\n2️⃣  إنشاء المستخدمين...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await User.create({
      id: 1,
      restaurantId: 1,
      username: 'admin',
      email: 'admin@restaurant.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });
    console.log('   ✅ Admin: ' + adminUser.email);

    const kitchenUser = await User.create({
      id: 2,
      restaurantId: 1,
      username: 'kitchen1',
      email: 'kitchen@restaurant.com',
      password: hashedPassword,
      role: 'kitchen',
      isActive: true
    });
    console.log('   ✅ Kitchen: ' + kitchenUser.email);

    // 3. Create Categories
    console.log('\n3️⃣  إنشاء أقسام القائمة...');
    const categories = await Category.bulkCreate([
      {
        id: 1,
        restaurantId: 1,
        name: 'Appetizers',
        nameAr: 'المقبلات',
        description: 'مقبلات شهية لبداية وجبتك',
        displayOrder: 1,
        isActive: true
      },
      {
        id: 2,
        restaurantId: 1,
        name: 'Main Courses',
        nameAr: 'الأطباق الرئيسية',
        description: 'أطباق رئيسية لذيذة',
        displayOrder: 2,
        isActive: true
      },
      {
        id: 3,
        restaurantId: 1,
        name: 'Beverages',
        nameAr: 'المشروبات',
        description: 'مشروبات ساخنة وباردة',
        displayOrder: 3,
        isActive: true
      },
      {
        id: 4,
        restaurantId: 1,
        name: 'Desserts',
        nameAr: 'الحلويات',
        description: 'حلويات شهية',
        displayOrder: 4,
        isActive: true
      }
    ]);
    console.log(`   ✅ تم إنشاء ${categories.length} أقسام`);

    // 4. Create Items
    console.log('\n4️⃣  إنشاء الأصناف...');
    const items = await Item.bulkCreate([
      // Appetizers
      {
        id: 1,
        categoryId: 1,
        name: 'Hummus',
        nameAr: 'حمص',
        description: 'حمص بالطحينة الطازجة',
        price: 15.00,
        image: 'https://via.placeholder.com/300',
        isAvailable: true,
        preparationTime: 5,
        displayOrder: 1
      },
      {
        id: 2,
        categoryId: 1,
        name: 'Fattoush Salad',
        nameAr: 'سلطة فتوش',
        description: 'سلطة فتوش مع الخضار الطازجة',
        price: 20.00,
        image: 'https://via.placeholder.com/300',
        isAvailable: true,
        preparationTime: 8,
        displayOrder: 2
      },
      // Main Courses
      {
        id: 3,
        categoryId: 2,
        name: 'Grilled Chicken',
        nameAr: 'دجاج مشوي',
        description: 'دجاج مشوي مع الأرز والخضار',
        price: 45.00,
        image: 'https://via.placeholder.com/300',
        isAvailable: true,
        preparationTime: 25,
        displayOrder: 1
      },
      {
        id: 4,
        categoryId: 2,
        name: 'Kabsa',
        nameAr: 'كبسة',
        description: 'كبسة لحم تقليدية',
        price: 55.00,
        image: 'https://via.placeholder.com/300',
        isAvailable: true,
        preparationTime: 30,
        displayOrder: 2
      },
      {
        id: 5,
        categoryId: 2,
        name: 'Mixed Grill',
        nameAr: 'مشاوي مشكلة',
        description: 'مشاوي لحم ودجاج',
        price: 65.00,
        image: 'https://via.placeholder.com/300',
        isAvailable: true,
        preparationTime: 35,
        displayOrder: 3
      },
      // Beverages
      {
        id: 6,
        categoryId: 3,
        name: 'Fresh Orange Juice',
        nameAr: 'عصير برتقال طازج',
        description: 'عصير برتقال طبيعي 100%',
        price: 12.00,
        image: 'https://via.placeholder.com/300',
        isAvailable: true,
        preparationTime: 3,
        displayOrder: 1
      },
      {
        id: 7,
        categoryId: 3,
        name: 'Mint Lemonade',
        nameAr: 'ليمون نعناع',
        description: 'ليمون بالنعناع المنعش',
        price: 10.00,
        image: 'https://via.placeholder.com/300',
        isAvailable: true,
        preparationTime: 3,
        displayOrder: 2
      },
      {
        id: 8,
        categoryId: 3,
        name: 'Arabic Coffee',
        nameAr: 'قهوة عربية',
        description: 'قهوة عربية أصيلة',
        price: 8.00,
        image: 'https://via.placeholder.com/300',
        isAvailable: true,
        preparationTime: 2,
        displayOrder: 3
      },
      // Desserts
      {
        id: 9,
        categoryId: 4,
        name: 'Kunafa',
        nameAr: 'كنافة',
        description: 'كنافة بالجبن',
        price: 25.00,
        image: 'https://via.placeholder.com/300',
        isAvailable: true,
        preparationTime: 10,
        displayOrder: 1
      },
      {
        id: 10,
        categoryId: 4,
        name: 'Baklava',
        nameAr: 'بقلاوة',
        description: 'بقلاوة بالفستق',
        price: 20.00,
        image: 'https://via.placeholder.com/300',
        isAvailable: true,
        preparationTime: 5,
        displayOrder: 2
      }
    ]);
    console.log(`   ✅ تم إنشاء ${items.length} أصناف`);

    // 5. Create Tables
    console.log('\n5️⃣  إنشاء الطاولات...');
    const tables = await Table.bulkCreate([
      {
        id: 1,
        restaurantId: 1,
        tableNumber: 'T1',
        qrCode: `QR-1-T1-${uuidv4().slice(0, 8)}`,
        capacity: 4,
        status: 'available',
        location: 'الطابق الأول - المنطقة الأمامية',
        isActive: true
      },
      {
        id: 2,
        restaurantId: 1,
        tableNumber: 'T2',
        qrCode: `QR-1-T2-${uuidv4().slice(0, 8)}`,
        capacity: 2,
        status: 'available',
        location: 'الطابق الأول - المنطقة الأمامية',
        isActive: true
      },
      {
        id: 3,
        restaurantId: 1,
        tableNumber: 'T3',
        qrCode: `QR-1-T3-${uuidv4().slice(0, 8)}`,
        capacity: 6,
        status: 'available',
        location: 'الطابق الأول - المنطقة الخلفية',
        isActive: true
      },
      {
        id: 4,
        restaurantId: 1,
        tableNumber: 'T4',
        qrCode: `QR-1-T4-${uuidv4().slice(0, 8)}`,
        capacity: 4,
        status: 'available',
        location: 'الطابق الثاني',
        isActive: true
      },
      {
        id: 5,
        restaurantId: 1,
        tableNumber: 'T5',
        qrCode: `QR-1-T5-${uuidv4().slice(0, 8)}`,
        capacity: 8,
        status: 'available',
        location: 'الطابق الثاني - VIP',
        isActive: true
      }
    ]);
    console.log(`   ✅ تم إنشاء ${tables.length} طاولات`);

    // Success message
    console.log('\n' + '='.repeat(60));
    console.log('🎉 تم إضافة جميع البيانات التجريبية بنجاح!');
    console.log('='.repeat(60));

    console.log('\n📋 بيانات تسجيل الدخول:');
    console.log('\n👨‍💼 Admin:');
    console.log('   البريد: admin@restaurant.com');
    console.log('   كلمة المرور: admin123');

    console.log('\n👨‍🍳 Kitchen:');
    console.log('   البريد: kitchen@restaurant.com');
    console.log('   كلمة المرور: admin123');

    console.log('\n📊 الإحصائيات:');
    console.log(`   - ${categories.length} أقسام`);
    console.log(`   - ${items.length} أصناف`);
    console.log(`   - ${tables.length} طاولات`);
    console.log(`   - 2 مستخدمين`);

    console.log('\n✅ يمكنك الآن تشغيل المشروع: npm start\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ خطأ في إضافة البيانات:', error);
    console.error('\nتفاصيل الخطأ:', error.message);
    process.exit(1);
  }
};

// Run the seeder
runSeeder();

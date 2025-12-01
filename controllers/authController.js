const jwt = require('jsonwebtoken');
const { User, Restaurant } = require('../models');

// Generate JWT Token
const generateToken = (userId, restaurantId, role) => {
  return jwt.sign(
    { userId, restaurantId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Initial registration (first admin user only)
// @route   POST /api/auth/register/initial
// @access  Public (but only works if no admin exists)
exports.initialRegister = async (req, res) => {
  try {
    const { username, email, password, restaurantName, restaurantAddress, restaurantPhone } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء ملء جميع الحقول المطلوبة'
      });
    }

    // Check if any admin user already exists
    const existingAdmin = await User.findOne({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: 'التسجيل الأولي متاح فقط عند عدم وجود مسؤول. استخدم /api/auth/register بدلاً من ذلك'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مستخدم بالفعل'
      });
    }

    // Create restaurant first (if provided)
    let restaurantId = 1; // Default
    if (restaurantName) {
      const restaurant = await Restaurant.create({
        name: restaurantName || 'مطعمي',
        address: restaurantAddress || '',
        phone: restaurantPhone || '',
        email: email,
        isActive: true
      });
      restaurantId = restaurant.id;
    } else {
      // Check if default restaurant exists
      const defaultRestaurant = await Restaurant.findByPk(1);
      if (!defaultRestaurant) {
        const newRestaurant = await Restaurant.create({
          name: 'مطعمي',
          address: '',
          phone: '',
          email: email,
          isActive: true
        });
        restaurantId = newRestaurant.id;
      }
    }

    // Create admin user
    const user = await User.create({
      username,
      email,
      password,
      role: 'admin',
      restaurantId,
      isActive: true
    });

    // Generate token
    const token = generateToken(user.id, user.restaurantId, user.role);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء حساب المسؤول الأول بنجاح! يمكنك الآن تسجيل الدخول',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          restaurantId: user.restaurantId
        }
      }
    });
  } catch (error) {
    console.error('Initial register error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في التسجيل',
      error: error.message
    });
  }
};

// @desc    Register new user (Admin only can create users)
// @route   POST /api/auth/register
// @access  Admin
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, restaurantId } = req.body;

    // Validation
    if (!username || !email || !password || !role || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء ملء جميع الحقول المطلوبة'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مستخدم بالفعل'
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({
      where: { username }
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'اسم المستخدم مستخدم بالفعل'
      });
    }

    // Verify restaurant exists
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'المطعم غير موجود'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      restaurantId
    });

    res.status(201).json({
      success: true,
      message: 'تم تسجيل المستخدم بنجاح',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في التسجيل',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور'
      });
    }

    // Find user
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: ['id', 'name']
      }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'حسابك غير نشط. الرجاء التواصل مع الإدارة'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.restaurantId, user.role);

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          restaurantId: user.restaurantId,
          restaurant: user.restaurant
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تسجيل الدخول',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: ['id', 'name', 'address', 'phone']
      }]
    });

    res.status(200).json({
      success: true,
      user: user,
      data: user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات المستخدم',
      error: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال كلمة المرور الحالية والجديدة'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      });
    }

    // Get user
    const user = await User.findByPk(req.user.userId);

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تغيير كلمة المرور',
      error: error.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, client will just remove the token

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تسجيل الخروج',
      error: error.message
    });
  }
};

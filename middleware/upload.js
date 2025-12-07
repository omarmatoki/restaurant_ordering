const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/items');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage - use memory storage for processing
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('فقط ملفات الصور مسموحة (jpeg, jpg, png, gif, webp)'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Process and convert image to WebP
const processImage = async (file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const nameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
  const filename = `${nameWithoutExt}-${uniqueSuffix}.webp`;
  const filepath = path.join(uploadsDir, filename);

  await sharp(file.buffer)
    .webp({ quality: 80 }) // Convert to WebP with 80% quality
    .toFile(filepath);

  return filename;
};

// Middleware for single image upload
exports.uploadSingle = async (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    if (req.file) {
      try {
        const filename = await processImage(req.file);
        req.file.filename = filename;
        req.file.path = path.join(uploadsDir, filename);
      } catch (error) {
        return next(new Error('فشل معالجة الصورة: ' + error.message));
      }
    }

    next();
  });
};

// Middleware for multiple images upload (max 5 images)
exports.uploadMultiple = async (req, res, next) => {
  upload.array('images', 5)(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    if (req.files && req.files.length > 0) {
      try {
        const processedFiles = [];

        for (const file of req.files) {
          const filename = await processImage(file);
          processedFiles.push({
            ...file,
            filename: filename,
            path: path.join(uploadsDir, filename)
          });
        }

        req.files = processedFiles;
      } catch (error) {
        return next(new Error('فشل معالجة الصور: ' + error.message));
      }
    }

    next();
  });
};

// Error handling middleware
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'حجم الملف كبير جداً. الحد الأقصى 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'عدد الملفات كبير جداً. الحد الأقصى 5 صور'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'خطأ في رفع الملف',
      error: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

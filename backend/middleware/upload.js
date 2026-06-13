const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { s3, bucket } = require('../config/aws');
const { UPLOAD_LIMITS } = require('../config/constants');

// Memory storage for multer
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp|gif/;
  const allowedVideoTypes = /mp4|mov|avi/;
  const allowedDocTypes = /pdf/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (file.fieldname === 'images') {
    const isValidImage = allowedImageTypes.test(extname) && mimetype.startsWith('image/');
    if (isValidImage) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, GIF) are allowed'));
    }
  } else if (file.fieldname === 'videos') {
    const isValidVideo = allowedVideoTypes.test(extname) && mimetype.startsWith('video/');
    if (isValidVideo) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (MP4, MOV, AVI) are allowed'));
    }
  } else if (file.fieldname === 'catalog') {
    const isValidDoc = allowedDocTypes.test(extname) && mimetype === 'application/pdf';
    if (isValidDoc) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for catalog'));
    }
  } else {
    cb(null, true);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

// Upload file to S3
const uploadToS3 = async (file, folder = 'products') => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${folder}/${uuidv4()}${fileExtension}`;

  const params = {
    Bucket: bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

// Delete file from S3
const deleteFromS3 = async (fileUrl) => {
  try {
    const key = fileUrl.split('.com/')[1];
    await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
    return true;
  } catch (error) {
    throw new Error(`Failed to delete file from S3: ${error.message}`);
  }
};

// Middleware for handling multiple file uploads
const uploadMiddleware = {
  single: upload.single('file'),
  multiple: upload.array('files', 10),
  productImages: upload.array('images', UPLOAD_LIMITS.MAX_IMAGES_PER_PRODUCT),
  productVideos: upload.array('videos', UPLOAD_LIMITS.MAX_VIDEOS_PER_PRODUCT),
  productMedia: upload.fields([
    { name: 'images', maxCount: UPLOAD_LIMITS.MAX_IMAGES_PER_PRODUCT },
    { name: 'videos', maxCount: UPLOAD_LIMITS.MAX_VIDEOS_PER_PRODUCT },
    { name: 'catalog', maxCount: 1 }
  ])
};

module.exports = {
  uploadMiddleware,
  uploadToS3,
  deleteFromS3
};

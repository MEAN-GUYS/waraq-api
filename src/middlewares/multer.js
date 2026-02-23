const multer = require('multer');
const allowedExtensions = require('../config/allowedExtensions');

const uploadMiddleware = ({ extensions = allowedExtensions.image, fileSize = 5 * 1024 * 1024 } = {}) => {
  const fileFilter = (req, file, cb) => {
    if (!file.originalname.includes('.')) {
      return cb(new Error('File must have an extension'), false);
    }

    const ext = file.originalname.split('.').pop().toLowerCase();

    if (!extensions.includes(ext)) {
      return cb(new Error('File format is not allowed'), false);
    }

    cb(null, true);
  };

  return multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize,
    },
  });
};

module.exports = uploadMiddleware;

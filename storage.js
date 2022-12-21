const multer = require("multer")

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './input');
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
})

module.exports.upload = multer({ storage });
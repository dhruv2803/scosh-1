const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'dceofbe10',
    api_key:'943639264385154',
    api_secret:'pL7s1CJetdZuRtWIt_3dgyZExPc'
});
 
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'scosh',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}
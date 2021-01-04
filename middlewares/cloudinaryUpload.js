const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "dstjlrma8",
  api_key: "831892493537517",
  api_secret: "kJCpbMkvDLtETs5vHEE08PmkuWw",
});

const cloudinaryUpload = async (req, res, next) => {
  const picsToStream = req.files || [req.file];
  const secureUrl = await Promise.all(
    picsToStream.map(async (pic) => {
      const url = await new Promise((resolve, reject) => {
        streamifier.createReadStream(pic.buffer).pipe(
          cloudinary.uploader.upload_stream((err, result) => {
            resolve({
              url: result.secure_url,
              cloudId: result.public_id,
            });
          })
        );
      });
      return url;
    })
  );

  req.body.picsCloud = secureUrl;

  next();
};

const cloudinaryDelete = async (publicId) => {
  const deletePic = await new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  }).catch((err) => err);
  return deletePic;
};

module.exports = { cloudinaryUpload, cloudinaryDelete };

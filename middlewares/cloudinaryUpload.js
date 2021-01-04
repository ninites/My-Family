const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "dstjlrma8",
  api_key: "831892493537517",
  api_secret: "kJCpbMkvDLtETs5vHEE08PmkuWw",
});

const cloudinaryUpload = async (req, res, next) => {
  const secureUrl = await Promise.all(
    req.files.map(async (pic) => {
      const url = await new Promise((resolve, reject) => {
        streamifier.createReadStream(pic.buffer).pipe(
          cloudinary.uploader.upload_stream((err, result) => {
            resolve(result.secure_url);
          })
        );
      });
      return url;
    })
  );

  req.body.picsCloudUrl = secureUrl;

  next();
};

module.exports = cloudinaryUpload;

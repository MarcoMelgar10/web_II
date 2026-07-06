const creatorProfileRepository = require("./creatorProfile.repository");

const buildImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

const createProfile = async (userId, data) => {
  const existing = await creatorProfileRepository.findByUserId(userId);
  if (existing) {
    const err = new Error("Profile already exists");
    err.statusCode = 409;
    throw err;
  }
  return creatorProfileRepository.create({ userId, ...data });
};

const updateProfile = async (userId, data) => {
  const existing = await creatorProfileRepository.findByUserId(userId);
  if (!existing) {
    const err = new Error("Profile not found");
    err.statusCode = 404;
    throw err;
  }
  return creatorProfileRepository.update(userId, data);
};

const getMyProfile = (userId) => {
  return creatorProfileRepository.findByUserId(userId);
};

const updateAvatar = async (userId, req) => {
  if (!req.file) {
    const err = new Error("No image file provided");
    err.statusCode = 400;
    throw err;
  }
  const avatarUrl = buildImageUrl(req, req.file.filename);
  return creatorProfileRepository.update(userId, { avatarUrl });
};

const updateBanner = async (userId, req) => {
  if (!req.file) {
    const err = new Error("No image file provided");
    err.statusCode = 400;
    throw err;
  }
  const bannerUrl = buildImageUrl(req, req.file.filename);
  return creatorProfileRepository.update(userId, { bannerUrl });
};

module.exports = { createProfile, updateProfile, getMyProfile, updateAvatar, updateBanner };

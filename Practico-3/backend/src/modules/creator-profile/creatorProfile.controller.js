const creatorProfileService = require("./creatorProfile.service");
const { success, created } = require("../../utils/response");

const create = async (req, res, next) => {
  try {
    const profile = await creatorProfileService.createProfile(req.user.id, req.body);
    return created(res, profile, "Profile created successfully");
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const profile = await creatorProfileService.updateProfile(req.user.id, req.body);
    return success(res, profile, "Profile updated successfully");
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const profile = await creatorProfileService.getMyProfile(req.user.id);
    return success(res, profile);
  } catch (err) {
    next(err);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const profile = await creatorProfileService.updateAvatar(req.user.id, req);
    return success(res, profile, "Avatar updated successfully");
  } catch (err) {
    next(err);
  }
};

const uploadBanner = async (req, res, next) => {
  try {
    const profile = await creatorProfileService.updateBanner(req.user.id, req);
    return success(res, profile, "Banner updated successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { create, update, getMe, uploadAvatar, uploadBanner };

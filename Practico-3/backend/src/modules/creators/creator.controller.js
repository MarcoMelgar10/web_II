const creatorService = require("./creator.service");
const { success } = require("../../utils/response");

const getAll = async (req, res, next) => {
  try {
    const creators = await creatorService.getAllCreators();
    return success(res, creators);
  } catch (err) {
    next(err);
  }
};

const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    const creators = await creatorService.searchCreators(q || "");
    return success(res, creators);
  } catch (err) {
    next(err);
  }
};

const getPublicProfile = async (req, res, next) => {
  try {
    const profile = await creatorService.getPublicProfile(req.params.id);
    return success(res, profile);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, search, getPublicProfile };

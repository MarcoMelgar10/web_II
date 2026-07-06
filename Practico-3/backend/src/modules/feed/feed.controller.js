const feedService = require("./feed.service");
const { success } = require("../../utils/response");

const getFeed = async (req, res, next) => {
  try {
    const posts = await feedService.getFeed(req.user.id);
    return success(res, posts);
  } catch (err) {
    next(err);
  }
};

module.exports = { getFeed };

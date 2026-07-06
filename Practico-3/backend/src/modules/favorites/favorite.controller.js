const favoriteService = require("./favorite.service");
const { success } = require("../../utils/response");

const toggle = async (req, res, next) => {
  try {
    const result = await favoriteService.toggleFavorite(req.user.id, req.params.creatorId);
    return success(res, result, result.favorited ? "Added to favorites" : "Removed from favorites");
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const favorites = await favoriteService.getFavorites(req.user.id);
    return success(res, favorites);
  } catch (err) {
    next(err);
  }
};

module.exports = { toggle, getAll };

const favoriteRepository = require("./favorite.repository");

const toggleFavorite = async (followerId, creatorId) => {
  const existing = await favoriteRepository.findByFollowerAndCreator(followerId, creatorId);

  if (existing) {
    await favoriteRepository.deleteByFollowerAndCreator(followerId, creatorId);
    return { favorited: false };
  }

  await favoriteRepository.create({ followerId, creatorId });
  return { favorited: true };
};

const getFavorites = (followerId) => {
  return favoriteRepository.findByFollowerId(followerId);
};

module.exports = { toggleFavorite, getFavorites };

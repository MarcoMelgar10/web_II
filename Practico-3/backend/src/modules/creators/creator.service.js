const creatorRepository = require("./creator.repository");

const getAllCreators = () => {
  return creatorRepository.findAllWithProfile();
};

const searchCreators = (query) => {
  return creatorRepository.searchByName(query);
};

const getPublicProfile = async (creatorId) => {
  const profile = await creatorRepository.findPublicProfile(creatorId);
  if (!profile) {
    const err = new Error("Creator not found");
    err.statusCode = 404;
    throw err;
  }
  return profile;
};

module.exports = { getAllCreators, searchCreators, getPublicProfile };

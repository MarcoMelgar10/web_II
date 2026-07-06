const donationRepository = require("./donation.repository");
const { FLAN_PRICE, DONATION_TYPE_FLAN } = require("../../config/constants");
const prisma = require("../../config/database");

const sendDonation = async (followerId, { creatorId, flanes }) => {
  const creator = await prisma.user.findUnique({ where: { id: creatorId } });
  if (!creator || creator.role !== "CREATOR") {
    const err = new Error("Creator not found");
    err.statusCode = 404;
    throw err;
  }

  if (followerId === creatorId) {
    const err = new Error("You cannot donate to yourself");
    err.statusCode = 400;
    throw err;
  }

  return donationRepository.create({
    followerId,
    creatorId,
    flanes,
    unitPrice: FLAN_PRICE,
    type: DONATION_TYPE_FLAN,
  });
};

const getFollowerHistory = async (followerId, { from, to, creatorName }) => {
  const donations = await donationRepository.findByFollowerId({ followerId, from, to });

  if (creatorName) {
    const name = creatorName.toLowerCase();
    return donations.filter((d) =>
      d.creator?.creatorProfile?.displayName?.toLowerCase().includes(name)
    );
  }

  return donations;
};

const getCreatorIncome = async (creatorId, { from, to }) => {
  const [donations, totalFlanes] = await Promise.all([
    donationRepository.findByCreatorId({ creatorId, from, to }),
    donationRepository.sumFlanesByCreatorId({ creatorId, from, to }),
  ]);

  return { donations, totalFlanes };
};

module.exports = { sendDonation, getFollowerHistory, getCreatorIncome };

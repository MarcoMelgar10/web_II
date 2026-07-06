const donationService = require("./donation.service");
const { success, created } = require("../../utils/response");

const send = async (req, res, next) => {
  try {
    const donation = await donationService.sendDonation(req.user.id, req.body);
    return created(res, donation, "Donation sent successfully");
  } catch (err) {
    next(err);
  }
};

const getFollowerHistory = async (req, res, next) => {
  try {
    const { from, to, creatorName } = req.query;
    const donations = await donationService.getFollowerHistory(req.user.id, { from, to, creatorName });
    return success(res, donations);
  } catch (err) {
    next(err);
  }
};

const getCreatorIncome = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const report = await donationService.getCreatorIncome(req.user.id, { from, to });
    return success(res, report);
  } catch (err) {
    next(err);
  }
};

module.exports = { send, getFollowerHistory, getCreatorIncome };

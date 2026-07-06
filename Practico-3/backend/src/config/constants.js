const constants = {
  FLAN_PRICE: parseFloat(process.env.FLAN_PRICE) || 10,
  DONATION_TYPE_FLAN: "FLAN",
  ROLES: {
    CREATOR: "CREATOR",
    FOLLOWER: "FOLLOWER",
  },
};

module.exports = constants;

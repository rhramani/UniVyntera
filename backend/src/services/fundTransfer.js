const FundTransfer = require("../../model/fundTransfer");
const paginate = require("../../utils/pagination");

const fundTransferServices = {
  create: async (data) => {
    const newData = await FundTransfer.create(data);

    return newData;
  },
 get: async (page, limit, startDate = "", endDate = "") => {
  

  const filter = {};

  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)), 
    };
  } else if (startDate) {
    filter.createdAt = { $gte: new Date(startDate) };
  } else if (endDate) {
    filter.createdAt = {
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    };
  }

  const result = await paginate(
    FundTransfer,
    filter,             
    page,
    limit,
    { createdAt: -1 },
    [],
    {}
  );

  return result;
},

};

module.exports = fundTransferServices;

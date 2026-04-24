const orgService = require('../services/organisation.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getMyOrg = asyncHandler(async (req, res) => {
  const org = await orgService.getOrganisation(req.user.organisation_id);
  res.status(200).json(new ApiResponse(200, org, 'Organisation retrieved successfully'));
});

const updateMyOrg = asyncHandler(async (req, res) => {
  // Assuming body has 'name'
  const org = await orgService.updateOrganisation(req.user.organisation_id, req.body);
  res.status(200).json(new ApiResponse(200, org, 'Organisation updated successfully'));
});

module.exports = {
  getMyOrg,
  updateMyOrg
};

const { Organisation } = require('../models');

const getOrganisation = async (id) => {
  const org = await Organisation.findByPk(id);
  if (!org) throw new Error('Organisation not found');
  return org;
};

const updateOrganisation = async (id, updateData) => {
  const org = await getOrganisation(id);
  // Only allow updating specific fields
  if (updateData.name) {
    org.name = updateData.name;
    await org.save();
  }
  return org;
};

module.exports = {
  getOrganisation,
  updateOrganisation
};

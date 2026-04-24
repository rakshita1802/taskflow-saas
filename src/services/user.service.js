const { User } = require('../models');

const getUsers = async (tenantFilter) => {
  return await User.findAll({
    where: tenantFilter,
    attributes: { exclude: ['password_hash'] },
    order: [['created_at', 'DESC']]
  });
};

const getUserById = async (id, tenantFilter) => {
  const user = await User.findOne({
    where: { id, ...tenantFilter },
    attributes: { exclude: ['password_hash'] }
  });
  if (!user) throw new Error('User not found');
  return user;
};

const updateUser = async (id, tenantFilter, updateData) => {
  const user = await User.findOne({ where: { id, ...tenantFilter } });
  if (!user) throw new Error('User not found');
  return await user.update(updateData);
};

const deleteUser = async (id, tenantFilter) => {
  const user = await User.findOne({ where: { id, ...tenantFilter } });
  if (!user) throw new Error('User not found');
  await user.destroy();
  return { id };
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};

const tenantIsolation = (req, res, next) => {
  if (!req.user || !req.user.organisation_id) {
    // Should theoretically never happen if authenticate middleware runs first
    return res.status(401).json({ message: 'Tenant identification missing' });
  }

  const orgId = req.user.organisation_id;

  // Removed req.body mutation as controllers explicitly inject organisation_id after validation

  // 2. Provide a handy filter object that controllers MUST spread into their DB queries
  // Example: Task.findAll({ where: { ...req.tenantFilter, status: 'pending' } })
  req.tenantFilter = {
    organisation_id: orgId
  };

  next();
};

module.exports = tenantIsolation;

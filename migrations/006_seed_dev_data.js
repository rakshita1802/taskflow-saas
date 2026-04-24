'use strict';
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Removed environment check to allow seeding test data in Docker compose

    const orgId1 = crypto.randomUUID();
    const orgId2 = crypto.randomUUID();
    const admin1Id = crypto.randomUUID();
    const admin2Id = crypto.randomUUID();
    const member1Id = crypto.randomUUID();

    // 1. Seed Organisations
    await queryInterface.bulkInsert('organisations', [
      {
        id: orgId1,
        name: 'TechCorp Inc.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: orgId2,
        name: 'Design Studio LLC',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // 2. Seed Users
    const passwordHash = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        id: admin1Id,
        organisation_id: orgId1,
        name: 'Alice (TechCorp Admin)',
        email: 'alice@techcorp.com',
        password_hash: passwordHash,
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: member1Id,
        organisation_id: orgId1,
        name: 'Bob (TechCorp Member)',
        email: 'bob@techcorp.com',
        password_hash: passwordHash,
        role: 'member',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: admin2Id,
        organisation_id: orgId2,
        name: 'Charlie (Design Studio Admin)',
        email: 'charlie@designstudio.com',
        password_hash: passwordHash,
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // 3. Seed Tasks
    await queryInterface.bulkInsert('tasks', [
      {
        id: crypto.randomUUID(),
        organisation_id: orgId1,
        created_by: admin1Id,
        title: 'Setup TechCorp Server',
        description: 'Configure the new AWS EC2 instance.',
        status: 'in-progress',
        due_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // +7 days
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: crypto.randomUUID(),
        organisation_id: orgId1,
        created_by: member1Id,
        title: 'Fix Login Bug',
        description: 'Users report cannot login via SSO.',
        status: 'pending',
        due_date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // +2 days
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: crypto.randomUUID(),
        organisation_id: orgId2,
        created_by: admin2Id,
        title: 'Design New Logo',
        description: 'Draft 3 options for the new client.',
        status: 'completed',
        due_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    if (process.env.NODE_ENV === 'production') return;

    await queryInterface.bulkDelete('tasks', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('organisations', null, {});
  }
};

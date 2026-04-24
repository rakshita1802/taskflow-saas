'use strict';
const crypto = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Get existing organisations
    const orgs = await queryInterface.sequelize.query(
      `SELECT id, name FROM organisations;`
    );
    const orgRows = orgs[0];

    if (orgRows.length === 0) return; // No orgs found, skip

    const techCorp = orgRows.find(o => o.name === 'TechCorp Inc.');
    const designStudio = orgRows.find(o => o.name === 'Design Studio LLC');

    // 2. Get existing users
    const users = await queryInterface.sequelize.query(
      `SELECT id, email, organisation_id FROM users;`
    );
    const userRows = users[0];

    if (userRows.length === 0) return;

    const alice = userRows.find(u => u.email === 'alice@techcorp.com');
    const bob = userRows.find(u => u.email === 'bob@techcorp.com');
    const charlie = userRows.find(u => u.email === 'charlie@designstudio.com');

    const tasks = [];

    // TechCorp Tasks (Alice)
    if (techCorp && alice) {
      tasks.push(
        {
          id: crypto.randomUUID(),
          organisation_id: techCorp.id,
          created_by: alice.id,
          title: 'Finalize Q3 Financial Report',
          description: 'Gather all P&L statements from the regional managers and compile the Q3 report for the board meeting.',
          status: 'pending',
          due_date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), // +14 days
          created_at: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          organisation_id: techCorp.id,
          created_by: alice.id,
          title: 'Interview Senior Backend Developer',
          description: 'Conduct final round technical interview with candidate Sarah Jenkins.',
          status: 'in-progress',
          due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
          created_at: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          organisation_id: techCorp.id,
          created_by: alice.id,
          title: 'Renew AWS Enterprise Contract',
          description: 'Negotiate the new pricing tiers with our AWS account manager before the contract expires next month.',
          status: 'completed',
          due_date: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
          created_at: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000),
          updated_at: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      );
    }

    // TechCorp Tasks (Bob)
    if (techCorp && bob) {
      tasks.push(
        {
          id: crypto.randomUUID(),
          organisation_id: techCorp.id,
          created_by: bob.id,
          title: 'Patch Critical Redis Vulnerability',
          description: 'Apply the latest security patches to our Redis clusters in the production environment.',
          status: 'in-progress',
          due_date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
          created_at: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          organisation_id: techCorp.id,
          created_by: bob.id,
          title: 'Optimize Database Queries',
          description: 'The Task retrieval query is taking >500ms on production. Add necessary indexes.',
          status: 'pending',
          due_date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          organisation_id: techCorp.id,
          created_by: bob.id,
          title: 'Migrate to Node 20',
          description: 'Update the Dockerfile to use Node 20 LTS and fix any breaking changes.',
          status: 'pending',
          due_date: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
          created_at: new Date(),
          updated_at: new Date()
        }
      );
    }

    // Design Studio Tasks (Charlie)
    if (designStudio && charlie) {
      tasks.push(
        {
          id: crypto.randomUUID(),
          organisation_id: designStudio.id,
          created_by: charlie.id,
          title: 'Client Presentation: Acme Corp',
          description: 'Present the initial wireframes and branding mockups to the Acme Corp executives.',
          status: 'in-progress',
          due_date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
          created_at: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          organisation_id: designStudio.id,
          created_by: charlie.id,
          title: 'Update Figma Component Library',
          description: 'Ensure all primary buttons have the updated hover state colors.',
          status: 'completed',
          due_date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
          created_at: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000),
          updated_at: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
        }
      );
    }

    if (tasks.length > 0) {
      await queryInterface.bulkInsert('tasks', tasks);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Cannot easily rollback just these tasks without deleting all of them or doing a complex match.
    // For local dev, this is fine.
  }
};

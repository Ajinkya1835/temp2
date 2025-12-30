
const User = require('./models/User');
const Role = require('./models/Role');
const Permit = require('./models/Permit');
const RuleConfig = require('./models/RuleConfig');
const Violation = require('./models/Violation');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Skipping seed.');
      return;
    }

    console.log('--- STARTING COMPREHENSIVE SEEDING ---');

    // 1. Create 10 Users with diverse roles
    const users = await User.create([
      { name: 'Aditya Varma', email: 'admin@pvms.gov.in', password: 'password123', role: Role.SUPER_ADMIN },
      { name: 'Inspector Meera', email: 'meera@ulb.gov.in', password: 'password123', role: Role.MUNICIPAL_OFFICER },
      { name: 'Inspector Sanjay', email: 'sanjay@ulb.gov.in', password: 'password123', role: Role.MUNICIPAL_OFFICER },
      { name: 'Director Gupta', email: 'director@gov.in', password: 'password123', role: Role.GOVERNMENT_OFFICIAL },
      { name: 'Arjun Buildcon', email: 'arjun@permitholder.in', password: 'password123', role: Role.PERMIT_HOLDER },
      { name: 'Delhi Infra Ltd', email: 'delhi.infra@permitholder.in', password: 'password123', role: Role.PERMIT_HOLDER },
      { name: 'Rajesh Kumar', email: 'rajesh@citizen.in', password: 'password123', role: Role.CITIZEN },
      { name: 'Anita Singh', email: 'anita@citizen.in', password: 'password123', role: Role.CITIZEN },
      { name: 'Vikram Das', email: 'vikram@citizen.in', password: 'password123', role: Role.CITIZEN },
      { name: 'Sunita Rao', email: 'sunita@citizen.in', password: 'password123', role: Role.CITIZEN }
    ]);
    console.log('✔ 10 Users Created');

    // 2. Create 5 Permits with GeoJSON boundaries (Approximate Delhi Coordinates)
    const permits = await Permit.create([
      {
        permitNumber: 'PRM-DEL-2024-001', ownerName: 'Arjun Buildcon', permitType: 'Commercial',
        issueDate: '2024-01-01', expiryDate: '2026-01-01', status: 'ACTIVE',
        boundary: { type: 'Polygon', coordinates: [[[77.215, 28.625], [77.225, 28.625], [77.225, 28.635], [77.215, 28.635], [77.215, 28.625]]] }
      },
      {
        permitNumber: 'PRM-DEL-2024-002', ownerName: 'Delhi Infra Ltd', permitType: 'Residential Multi-story',
        issueDate: '2024-02-15', expiryDate: '2027-02-15', status: 'ACTIVE',
        boundary: { type: 'Polygon', coordinates: [[[77.200, 28.580], [77.210, 28.580], [77.210, 28.590], [77.200, 28.590], [77.200, 28.580]]] }
      },
      {
        permitNumber: 'PRM-DEL-2024-003', ownerName: 'Rohan Sharma', permitType: 'Independent Villa',
        issueDate: '2024-03-10', expiryDate: '2025-03-10', status: 'ACTIVE',
        boundary: { type: 'Polygon', coordinates: [[[77.150, 28.700], [77.160, 28.700], [77.160, 28.710], [77.150, 28.710], [77.150, 28.700]]] }
      },
      {
        permitNumber: 'PRM-DEL-2024-004', ownerName: 'Metro Projects', permitType: 'Infrastructure',
        issueDate: '2024-01-10', expiryDate: '2028-01-10', status: 'ACTIVE',
        boundary: { type: 'Polygon', coordinates: [[[77.100, 28.600], [77.110, 28.600], [77.110, 28.610], [77.100, 28.610], [77.100, 28.600]]] }
      },
      {
        permitNumber: 'PRM-DEL-2024-005', ownerName: 'Green Park Trust', permitType: 'Institutional',
        issueDate: '2024-05-01', expiryDate: '2026-05-01', status: 'ACTIVE',
        boundary: { type: 'Polygon', coordinates: [[[77.200, 28.550], [77.210, 28.550], [77.210, 28.560], [77.200, 28.560], [77.200, 28.550]]] }
      }
    ]);
    console.log('✔ 5 Permits with GIS Boundaries Created');

    // 3. Create 20 Rule Configs (Violation Codes)
    const ruleConfigs = await RuleConfig.create([
      { violationCode: 'VIO-001', title: 'Unauthorized Floor Addition', baseFine: 100000 },
      { violationCode: 'VIO-002', title: 'Setback Encroachment', baseFine: 50000 },
      { violationCode: 'VIO-003', title: 'Public Sidewalk Obstruction', baseFine: 15000 },
      { violationCode: 'VIO-004', title: 'Missing Safety Barriers', baseFine: 25000 },
      { violationCode: 'VIO-005', title: 'Illegal Water Connection', baseFine: 30000 },
      { violationCode: 'VIO-006', title: 'Non-compliant Drainage', baseFine: 20000 },
      { violationCode: 'VIO-007', title: 'Excessive F.A.R. Usage', baseFine: 200000 },
      { violationCode: 'VIO-008', title: 'Illegal Basement Construction', baseFine: 150000 },
      { violationCode: 'VIO-009', title: 'Fire Safety Violation', baseFine: 75000 },
      { violationCode: 'VIO-010', title: 'Commercial Activity in Residential Zone', baseFine: 120000 },
      { violationCode: 'VIO-011', title: 'Structural Safety Hazard', baseFine: 180000 },
      { violationCode: 'VIO-012', title: 'Tree Felling without Permit', baseFine: 50000 },
      { violationCode: 'VIO-013', title: 'Littering Construction Debris', baseFine: 10000 },
      { violationCode: 'VIO-014', title: 'Noisy Construction After Hours', baseFine: 5000 },
      { violationCode: 'VIO-015', title: 'Unsafe Scaffolding', baseFine: 35000 },
      { violationCode: 'VIO-016', title: 'Roof Height Violation', baseFine: 45000 },
      { violationCode: 'VIO-017', title: 'Illegal Signage/Hoarding', baseFine: 12000 },
      { violationCode: 'VIO-018', title: 'Dust Pollution (No Netting)', baseFine: 25000 },
      { violationCode: 'VIO-019', title: 'Occupancy Without Certificate', baseFine: 300000 },
      { violationCode: 'VIO-020', title: 'Encroachment on Government Land', baseFine: 500000 }
    ]);
    console.log('✔ 20 Rule Configurations (VIO-001 to VIO-020) Created');

    // 4. Create Sample Violations
    await Violation.create([
      {
        title: 'Roof Extension at Connaught Place',
        description: 'New floor being built without clearance.',
        reporterId: users[6]._id, // Rajesh
        location: { lat: 28.630, lng: 77.220, address: 'Connaught Place Area A' },
        status: 'REPORTED',
        evidenceUrls: ['https://picsum.photos/seed/vio1/800/600'],
        permitId: 'PRM-DEL-2024-001'
      },
      {
        title: 'Sidewalk Blocked',
        description: 'Bricks and cement bags blocking the main road access.',
        reporterId: users[7]._id, // Anita
        location: { lat: 28.585, lng: 77.205, address: 'Near Saket Metro' },
        status: 'VERIFIED',
        fineAmount: 15000,
        noticeId: 'NTCE-99001',
        evidenceUrls: ['https://picsum.photos/seed/vio2/800/600'],
        permitId: 'PRM-DEL-2024-002'
      }
    ]);
    console.log('✔ Sample Violations Created');

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('SEEDING FAILED:', error);
  }
};

module.exports = seedData;

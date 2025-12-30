
import { UserRole, User, Permit, RuleConfig } from './types';

export const INDIAN_CURRENCY = '₹';

export const DEMO_USERS: User[] = [
  {
    id: 'u1',
    name: 'Rajesh Kumar',
    role: UserRole.CITIZEN,
    email: 'rajesh@citizen.in',
    avatar: 'https://picsum.photos/seed/rajesh/200'
  },
  {
    id: 'u2',
    name: 'Inspector Meera Iyer',
    role: UserRole.OFFICER,
    email: 'meera.i@ulb.gov.in',
    avatar: 'https://picsum.photos/seed/meera/200'
  },
  {
    id: 'u3',
    name: 'Admin Sharma',
    role: UserRole.ADMIN,
    email: 'admin@pvms.gov.in',
    avatar: 'https://picsum.photos/seed/admin/200'
  }
];

export const RULES: RuleConfig[] = [
  {
    id: 'r1',
    violationType: 'Unauthorized Construction',
    baseFine: 50000,
    severityMultiplier: { LOW: 1, MEDIUM: 2, HIGH: 5 }
  },
  {
    id: 'r2',
    violationType: 'Encroachment',
    baseFine: 10000,
    severityMultiplier: { LOW: 1, MEDIUM: 3, HIGH: 10 }
  },
  {
    id: 'r3',
    violationType: 'Permit Deviation',
    baseFine: 25000,
    severityMultiplier: { LOW: 0.5, MEDIUM: 1, HIGH: 2 }
  }
];

export const DEMO_PERMITS: Permit[] = [
  {
    id: 'PRM-2023-001',
    ownerName: 'Skyline Builders',
    type: 'Commercial Construction',
    issueDate: '2023-01-15',
    expiryDate: '2025-01-15',
    status: 'ACTIVE',
    boundary: [
      { lat: 28.6139, lng: 77.2090, address: 'Connaught Place Area A' },
      { lat: 28.6145, lng: 77.2095, address: 'Connaught Place Area B' }
    ]
  }
];

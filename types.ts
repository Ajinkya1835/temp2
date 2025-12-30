
export enum UserRole {
  CITIZEN = 'Citizen',
  OFFICER = 'Municipal_Officer',
  ADMIN = 'Super_Admin',
  HOLDER = 'Permit_Holder',
  GOVT = 'Government_Official'
}

export enum ViolationStatus {
  REPORTED = 'REPORTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  NOTICE_ISSUED = 'NOTICE_ISSUED',
  PAID = 'PAID',
  APPEALED = 'APPEALED',
  DISMISSED = 'DISMISSED'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Permit {
  id: string;
  ownerName: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  boundary: Location[] | any; // Supports GeoJSON or Coordinate list
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

export interface Violation {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  reporterId: string;
  location: Location;
  status: ViolationStatus;
  evidenceUrls: string[];
  permitId?: string;
  fineAmount?: number;
  noticeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RuleConfig {
  id: string;
  violationType: string;
  baseFine: number;
  severityMultiplier: Record<string, number>;
}

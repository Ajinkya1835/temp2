
import { Violation, ViolationStatus, Location, Permit } from '../types';
import { DEMO_PERMITS } from '../constants';

const API_BASE = '/api';

export const getViolations = async (): Promise<Violation[]> => {
  try {
    const response = await fetch(`${API_BASE}/violations`);
    if (!response.ok) throw new Error('Failed to fetch violations');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

export const saveViolation = async (v: any): Promise<Violation | null> => {
  try {
    const response = await fetch(`${API_BASE}/violations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v)
    });
    if (!response.ok) throw new Error('Failed to save violation');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const updateViolationStatus = async (id: string, status: ViolationStatus, extra: Partial<Violation> = {}): Promise<Violation | null> => {
  try {
    const response = await fetch(`${API_BASE}/violations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extra })
    });
    if (!response.ok) throw new Error('Failed to update violation');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const checkPermitBoundaries = (loc: Location): Permit | null => {
  // GIS logic remains on client/server hybrid, here simulated via mock logic
  if (loc.lat > 28.5 && loc.lat < 28.7 && loc.lng > 77.1 && loc.lng < 77.3) {
    return DEMO_PERMITS[0];
  }
  return null;
};

// Types
export * from './types';

// Services
import { auditService } from './auditService';
import { authService } from './authService';
import { userService } from './userService';
import { patientService } from './patientService';
import { doctorService } from './doctorService';
import { linkService } from './linkService';
import { checklistService } from './checklistService';
import { landingService } from './landingService';
import { consultaService } from './consultaService';

// Facade for backward compatibility during refactoring
export const backendService = {
  ...auditService,
  ...authService,
  ...userService,
  ...patientService,
  ...doctorService,
  ...linkService,
  ...checklistService,
  ...landingService,
  ...consultaService,
};

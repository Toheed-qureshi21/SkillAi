export interface FormState {
  name: string;
  email: string;
  password: string;
}
export interface payloadForOnboarding {
  industry?: string;
  specialization: string;
  yearsOfExperience: string | number;
  skills: string | string[];
  bio: string;
}

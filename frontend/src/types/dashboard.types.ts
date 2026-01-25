export type User = {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  isOnboarded: boolean;
  industry: string;
  bio: string;
  specialization: string;
  yearsOfExperience: number;
  skills: string[];
  industryInsights?: IndustryInsights;
};

export type IndustryInsights = {
  _id: string;
  industry:string;
  salaryRanges: SalaryRanges[];
  growthRate:number | string;
  demandLevel: string;
  topSkills: string[];
  marketOutlook: string;
  keyTrends: string[];
  recommendedSkills: string[];
  nextUpdate: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v: number;
}

export type SalaryRanges = {
  role: string;
  min: number;
  max: number;
  median: number;
  location?: string;
}

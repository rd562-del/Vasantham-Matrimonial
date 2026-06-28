export type Plan = "free" | "silver" | "gold" | "diamond";

export interface User {
  id: string;
  fullName: string;
  gender: "Male" | "Female" | string;
  dob: string; // ISO date
  religion: string;
  caste: string;
  subCaste: string;
  motherTongue: string;
  education: string;
  occupation: string;
  annualIncome: string;
  height: string;
  weight: string;
  maritalStatus: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  passwordHash: string;
  photo: string; // url or path
  gallery: string[];
  bio?: string;
  family?: string;
  lifestyle?: string;
  // membership
  plan: Plan;
  trialStart: string; // ISO
  membershipExpiry: string; // ISO
  verifiedBadge: boolean;
  premiumBadge: boolean;
  // status
  active: boolean; // email verified
  suspended: boolean;
  approved: boolean;
  createdAt: string;
  lastActive: string;
  // engagement
  visitors: string[]; // user ids who viewed
  shortlisted: string[]; // user ids this user shortlisted
  interestsSent: string[];
  interestsReceived: string[];
  // otp
  otp?: string | null;
  otpExpiry?: string | null;
  resetOtp?: string | null;
  resetOtpExpiry?: string | null;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  email: string;
  plan: Plan;
  amount: number;
  screenshot: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  photo: string;
  text: string;
  rating: number;
}

export interface SuccessStory {
  id: string;
  brideName: string;
  groomName: string;
  photo: string;
  story: string;
  marriedOn: string;
}

export type PublicUser = Omit<
  User,
  "passwordHash" | "otp" | "otpExpiry" | "resetOtp" | "resetOtpExpiry"
>;

export const PLAN_DETAILS: Record<
  Plan,
  { name: string; price: number; days: number; label: string }
> = {
  free: { name: "Free Trial", price: 0, days: 15, label: "15 Days" },
  silver: { name: "Silver Plan", price: 199, days: 30, label: "1 Month" },
  gold: { name: "Gold Plan", price: 399, days: 180, label: "6 Months" },
  diamond: { name: "Diamond Plan", price: 999, days: 365, label: "1 Year" },
};

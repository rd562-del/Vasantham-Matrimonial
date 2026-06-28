import crypto from "crypto";
import type { User, Testimonial, SuccessStory } from "./types";

function hash(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const h = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${h}`;
}

const now = Date.now();
const day = 24 * 60 * 60 * 1000;
const PW = hash("password123");

const W = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=750`;

interface SeedInput {
  fullName: string;
  gender: "Male" | "Female";
  dob: string;
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
  photo: number;
  bio: string;
  premium?: boolean;
  daysAgo: number;
}

const raw: SeedInput[] = [
  {
    fullName: "Priya Sharma",
    gender: "Female",
    dob: "1997-04-12",
    religion: "Hindu",
    caste: "Brahmin",
    subCaste: "Iyer",
    motherTongue: "Tamil",
    education: "M.Tech, Computer Science",
    occupation: "Software Engineer",
    annualIncome: "₹12-15 LPA",
    height: "5'4\"",
    weight: "54 kg",
    maritalStatus: "Never Married",
    city: "Chennai",
    state: "Tamil Nadu",
    photo: 37145167,
    bio: "Family-oriented, love classical music and travel. Looking for a caring and ambitious partner.",
    premium: true,
    daysAgo: 3,
  },
  {
    fullName: "Anjali Reddy",
    gender: "Female",
    dob: "1995-09-25",
    religion: "Hindu",
    caste: "Reddy",
    subCaste: "Motati",
    motherTongue: "Telugu",
    education: "MBBS, MD",
    occupation: "Doctor",
    annualIncome: "₹18-20 LPA",
    height: "5'5\"",
    weight: "57 kg",
    maritalStatus: "Never Married",
    city: "Hyderabad",
    state: "Telangana",
    photo: 36041239,
    bio: "Compassionate physician who values honesty and warmth. Enjoy reading and cooking.",
    premium: true,
    daysAgo: 6,
  },
  {
    fullName: "Meera Nair",
    gender: "Female",
    dob: "1998-01-30",
    religion: "Hindu",
    caste: "Nair",
    subCaste: "Menon",
    motherTongue: "Malayalam",
    education: "M.A. Economics",
    occupation: "Bank Manager",
    annualIncome: "₹10-12 LPA",
    height: "5'3\"",
    weight: "52 kg",
    maritalStatus: "Never Married",
    city: "Kochi",
    state: "Kerala",
    photo: 38281667,
    bio: "Cheerful and grounded. Love nature, art and good conversations.",
    daysAgo: 1,
  },
  {
    fullName: "Divya Krishnan",
    gender: "Female",
    dob: "1996-07-18",
    religion: "Hindu",
    caste: "Mudaliar",
    subCaste: "Sengunthar",
    motherTongue: "Tamil",
    education: "B.E. Electronics",
    occupation: "Project Manager",
    annualIncome: "₹14-16 LPA",
    height: "5'6\"",
    weight: "58 kg",
    maritalStatus: "Never Married",
    city: "Coimbatore",
    state: "Tamil Nadu",
    photo: 36041222,
    bio: "Independent and family-loving. Looking for someone genuine and supportive.",
    premium: true,
    daysAgo: 10,
  },
  {
    fullName: "Lakshmi Iyer",
    gender: "Female",
    dob: "1999-11-05",
    religion: "Hindu",
    caste: "Brahmin",
    subCaste: "Iyengar",
    motherTongue: "Tamil",
    education: "M.Sc. Biotechnology",
    occupation: "Research Associate",
    annualIncome: "₹8-10 LPA",
    height: "5'2\"",
    weight: "50 kg",
    maritalStatus: "Never Married",
    city: "Bengaluru",
    state: "Karnataka",
    photo: 29601839,
    bio: "Curious mind, love science and spirituality. Seeking a kind, understanding partner.",
    daysAgo: 2,
  },
  {
    fullName: "Arjun Menon",
    gender: "Male",
    dob: "1993-03-22",
    religion: "Hindu",
    caste: "Nair",
    subCaste: "Menon",
    motherTongue: "Malayalam",
    education: "MBA, IIM",
    occupation: "Business Consultant",
    annualIncome: "₹25-30 LPA",
    height: "5'10\"",
    weight: "74 kg",
    maritalStatus: "Never Married",
    city: "Bengaluru",
    state: "Karnataka",
    photo: 7580994,
    bio: "Driven professional with a love for fitness and travel. Value family above all.",
    premium: true,
    daysAgo: 4,
  },
  {
    fullName: "Karthik Subramanian",
    gender: "Male",
    dob: "1994-08-14",
    religion: "Hindu",
    caste: "Brahmin",
    subCaste: "Iyer",
    motherTongue: "Tamil",
    education: "M.S. (USA)",
    occupation: "Data Scientist",
    annualIncome: "₹35-40 LPA",
    height: "5'11\"",
    weight: "76 kg",
    maritalStatus: "Never Married",
    city: "Chennai",
    state: "Tamil Nadu",
    photo: 20502925,
    bio: "Tech enthusiast, foodie and traveler. Looking for an equal and loving partner.",
    premium: true,
    daysAgo: 7,
  },
  {
    fullName: "Rahul Varma",
    gender: "Male",
    dob: "1992-12-09",
    religion: "Hindu",
    caste: "Kshatriya",
    subCaste: "Raju",
    motherTongue: "Telugu",
    education: "B.Tech, Mechanical",
    occupation: "Senior Engineer",
    annualIncome: "₹18-22 LPA",
    height: "6'0\"",
    weight: "80 kg",
    maritalStatus: "Never Married",
    city: "Hyderabad",
    state: "Telangana",
    photo: 7580940,
    bio: "Calm, dependable and family-centric. Enjoy cricket and road trips.",
    daysAgo: 5,
  },
  {
    fullName: "Vivek Pillai",
    gender: "Male",
    dob: "1995-05-28",
    religion: "Hindu",
    caste: "Nair",
    subCaste: "Pillai",
    motherTongue: "Malayalam",
    education: "CA",
    occupation: "Chartered Accountant",
    annualIncome: "₹20-24 LPA",
    height: "5'9\"",
    weight: "72 kg",
    maritalStatus: "Never Married",
    city: "Kochi",
    state: "Kerala",
    photo: 7580808,
    bio: "Detail-oriented and warm-hearted. Looking for a partner to share life's journey.",
    daysAgo: 12,
  },
  {
    fullName: "Sanjay Gupta",
    gender: "Male",
    dob: "1990-10-16",
    religion: "Hindu",
    caste: "Vaishya",
    subCaste: "Agarwal",
    motherTongue: "Hindi",
    education: "MBBS, MS",
    occupation: "Surgeon",
    annualIncome: "₹40-50 LPA",
    height: "5'10\"",
    weight: "75 kg",
    maritalStatus: "Never Married",
    city: "Mumbai",
    state: "Maharashtra",
    photo: 35839965,
    bio: "Dedicated to my profession and family. Seeking a compassionate life partner.",
    premium: true,
    daysAgo: 8,
  },
];

export const seedUsers: User[] = raw.map((r, i) => {
  const createdAt = new Date(now - r.daysAgo * day).toISOString();
  const expiry = new Date(
    now - r.daysAgo * day + (r.premium ? 365 : 15) * day
  ).toISOString();
  return {
    id: `u${i + 1}`,
    fullName: r.fullName,
    gender: r.gender,
    dob: r.dob,
    religion: r.religion,
    caste: r.caste,
    subCaste: r.subCaste,
    motherTongue: r.motherTongue,
    education: r.education,
    occupation: r.occupation,
    annualIncome: r.annualIncome,
    height: r.height,
    weight: r.weight,
    maritalStatus: r.maritalStatus,
    city: r.city,
    state: r.state,
    country: "India",
    phone: `+9198${(40000000 + i * 111111).toString().slice(0, 8)}`,
    email: `${r.fullName.split(" ")[0].toLowerCase()}@example.com`,
    passwordHash: PW,
    photo: W(r.photo),
    gallery: [W(r.photo)],
    bio: r.bio,
    family: "Well-settled, respectable family with traditional values.",
    lifestyle: "Non-smoker, occasional social drinker, vegetarian.",
    plan: r.premium ? "gold" : "free",
    trialStart: createdAt,
    membershipExpiry: expiry,
    verifiedBadge: true,
    premiumBadge: !!r.premium,
    active: true,
    suspended: false,
    approved: true,
    createdAt,
    lastActive: new Date(now - (i % 3) * 3600 * 1000).toISOString(),
    visitors: [],
    shortlisted: [],
    interestsSent: [],
    interestsReceived: [],
    otp: null,
    otpExpiry: null,
    resetOtp: null,
    resetOtpExpiry: null,
  };
});

export const seedTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Suresh & Kavitha",
    location: "Chennai",
    photo: W(13078094),
    text: "We found each other on Vasantham Matrimonial within two months. The verified profiles gave us complete peace of mind!",
    rating: 5,
  },
  {
    id: "t2",
    name: "Ramesh & Deepa",
    location: "Bengaluru",
    photo: W(20518451),
    text: "The video call feature helped our families connect before meeting. Truly a modern and trustworthy platform.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Vignesh & Anitha",
    location: "Madurai",
    photo: W(19613670),
    text: "Elegant, secure and easy to use. We are grateful to Vasantham for bringing us together.",
    rating: 5,
  },
];

export const seedStories: SuccessStory[] = [
  {
    id: "s1",
    brideName: "Kavitha",
    groomName: "Suresh",
    photo: W(13078094),
    story:
      "Matched in spring 2025, married in winter. Vasantham made our families feel secure throughout.",
    marriedOn: "2025-12-14",
  },
  {
    id: "s2",
    brideName: "Deepa",
    groomName: "Ramesh",
    photo: W(20518451),
    story:
      "From a simple 'Express Interest' to a beautiful wedding — our story began here.",
    marriedOn: "2025-08-22",
  },
  {
    id: "s3",
    brideName: "Anitha",
    groomName: "Vignesh",
    photo: W(33078527),
    story:
      "Two cities, one platform, a lifetime together. Thank you, Vasantham Matrimonial.",
    marriedOn: "2025-11-03",
  },
];

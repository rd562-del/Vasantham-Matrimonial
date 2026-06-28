import { promises as fs } from "fs";
import path from "path";
import type {
  User,
  Payment,
  ContactMessage,
  Testimonial,
  SuccessStory,
} from "./types";
import { seedUsers, seedTestimonials, seedStories } from "./seed";

// JSON flat-file storage (no SQL database), stored under /data
const DATA_DIR = path.join(process.cwd(), "data");

interface Collections {
  "users.json": User[];
  "payments.json": Payment[];
  "messages.json": ContactMessage[];
  "testimonials.json": Testimonial[];
  "stories.json": SuccessStory[];
}

const defaults: Collections = {
  "users.json": seedUsers,
  "payments.json": [],
  "messages.json": [],
  "testimonials.json": seedTestimonials,
  "stories.json": seedStories,
};

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readCollection<K extends keyof Collections>(
  name: K
): Promise<Collections[K]> {
  await ensureDir();
  const file = path.join(DATA_DIR, name);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as Collections[K];
  } catch {
    const def = defaults[name];
    await fs.writeFile(file, JSON.stringify(def, null, 2), "utf-8");
    return def;
  }
}

export async function writeCollection<K extends keyof Collections>(
  name: K,
  data: Collections[K]
): Promise<void> {
  await ensureDir();
  const file = path.join(DATA_DIR, name);
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

// Convenience helpers
export const getUsers = () => readCollection("users.json");
export const saveUsers = (u: User[]) => writeCollection("users.json", u);
export const getPayments = () => readCollection("payments.json");
export const savePayments = (p: Payment[]) =>
  writeCollection("payments.json", p);
export const getMessages = () => readCollection("messages.json");
export const saveMessages = (m: ContactMessage[]) =>
  writeCollection("messages.json", m);
export const getTestimonials = () => readCollection("testimonials.json");
export const saveTestimonials = (t: Testimonial[]) =>
  writeCollection("testimonials.json", t);
export const getStories = () => readCollection("stories.json");
export const saveStories = (s: SuccessStory[]) =>
  writeCollection("stories.json", s);

export async function findUserById(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.id === id);
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function updateUser(
  id: string,
  patch: Partial<User>
): Promise<User | undefined> {
  const users = await getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...patch };
  await saveUsers(users);
  return users[idx];
}

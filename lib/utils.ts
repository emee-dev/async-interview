import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateId = customAlphabet(alphabet, 8); // 16 can be any length you want

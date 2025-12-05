import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateTimeSinceRelease(month: string, year: string): string {
  if (!month || !year) return "";
  
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (isNaN(monthNum) || isNaN(yearNum)) return "";
  if (monthNum < 1 || monthNum > 12) return "";
  if (yearNum < 1900 || yearNum > new Date().getFullYear()) return "";
  
  const releaseDate = new Date(yearNum, monthNum - 1);
  const now = new Date();
  
  if (releaseDate > now) return "Future date selected";
  
  let years = now.getFullYear() - releaseDate.getFullYear();
  let months = now.getMonth() - releaseDate.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const totalMonths = years * 12 + months;
  
  if (totalMonths === 0) {
    return "Released this month";
  }
  
  if (years === 0) {
    return `Released ${months} ${months === 1 ? "month" : "months"} ago`;
  }
  
  if (months === 0) {
    return `Released ${years} ${years === 1 ? "year" : "years"} ago`;
  }
  
  return `Released ${years} ${years === 1 ? "year" : "years"}, ${months} ${months === 1 ? "month" : "months"} ago`;
}

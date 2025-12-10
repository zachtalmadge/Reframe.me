// All suggestion arrays are pre-sorted alphabetically

export const OFFENSE_DESCRIPTION_SUGGESTIONS = [
  "Assault",
  "Auto theft",
  "Burglary",
  "Check fraud",
  "Credit card fraud",
  "Criminal mischief",
  "Curfew violation",
  "Disorderly conduct",
  "Domestic-related offense",
  "Driving on suspended license",
  "Drug manufacturing",
  "Drug possession",
  "Drug trafficking / distribution",
  "DUI / DWI",
  "Embezzlement",
  "Failure to appear",
  "Fraud / financial offense",
  "Harassment",
  "Identity theft",
  "Loitering",
  "Possession of stolen property",
  "Probation violation",
  "Property damage / vandalism",
  "Public intoxication",
  "Reckless driving",
  "Resisting arrest",
  "Retail theft",
  "Robbery",
  "Shoplifting",
  "Simple battery",
  "Stalking",
  "Theft",
  "Trespassing",
  "Unauthorized use of a vehicle",
  "Unlawful entry",
  "Violation of a court order",
  "Weapons-related offense",
  "Welfare fraud",
  "Wire fraud",
  "Writing bad checks",
];

export const OFFENSE_PROGRAM_SUGGESTIONS = [
  "Anger management group",
  "Cognitive behavioral therapy (CBT) program",
  "Domestic violence intervention program",
  "DUI education program",
  "Job readiness / employability class",
  "Restorative justice program",
  "Substance use treatment program",
  "Thinking for a Change (cognitive skills)",
  "Victim awareness / impact program",
  "Vocational training (e.g., trades)",
];

export const STEP2_PROGRAM_SUGGESTIONS = [
  "Cognitive behavioral program",
  "College courses",
  "Faith-based or peer support group",
  "GED / high school equivalency",
  "Job readiness / employability workshop",
  "Parenting classes",
  "Restorative justice / victim impact program",
  "Substance use treatment / recovery program",
  "Vocational training (trades)",
  "Workforce reentry / employment program",
];

export const SKILL_SUGGESTIONS = [
  "Attention to detail",
  "Cleaning / sanitation",
  "Communication (verbal and written)",
  "Computer literacy / basic IT",
  "Construction / carpentry basics",
  "Customer service",
  "Data entry / typing",
  "Food handling / kitchen skills",
  "Forklift certified",
  "Inventory / warehouse experience",
  "Leadership / mentoring peers",
  "Problem-solving",
  "Receiving and using feedback",
  "Reliability / showing up on time",
  "Staying calm in stressful situations",
  "Teamwork with diverse people",
  "Time management",
  "Working under pressure",
  "Working with the public",
  "Written documentation / record-keeping",
];

/**
 * Filter suggestions based on a search query
 * @param {string[]} allSuggestions - Pre-sorted alphabetical array
 * @param {string} query - Search text
 * @returns {string[]} Filtered alphabetical subset
 */
export function filterSuggestions(allSuggestions, query) {
  if (!query || !query.trim()) {
    return allSuggestions;
  }

  const lowerQuery = query.trim().toLowerCase();
  return allSuggestions.filter(item =>
    item.toLowerCase().includes(lowerQuery)
  );
  // Returns alphabetically sorted subset since input array is pre-sorted
}

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
  "Assault / violence prevention program",
  "Batterer’s intervention / domestic violence program",
  "Cognitive behavioral therapy (CBT) for criminal thinking",
  "Criminal thinking / cognitive skills group (e.g., Thinking for a Change)",
  "DUI / DWI education program",
  "Impaired driving victim impact panel",
  "Gang intervention / disengagement program",
  "Restorative justice accountability or circles",
  "Sex offense–specific treatment program",
  "Shoplifting / theft awareness program",
  "Substance use treatment program (court-ordered or clinically based)",
  "Victim awareness / impact program",
  "Relapse prevention group related to the offense",
];

export const STEP2_PROGRAM_SUGGESTIONS = [
  "On-the-job training program",
  "College courses or certificate program",
  "Digital literacy / computer skills training",
  "Faith-based or peer support group",
  "Family reunification or healthy relationships class",
  "Financial literacy / money management course",
  "GED",
  "Job readiness / employability workshop",
  "Leadership or personal development group",
  "Parenting classes",
  "Resume and interview skills workshop",
  "Vocational training (trades)",
  "Workforce reentry / employment program",
  "Workplace communication or teamwork class",
  "Community service / structured volunteer program",
];


export const SKILL_SUGGESTIONS = [
  "Accountability / taking responsibility",
  "Adaptability / adjusting to new routines",
  "Attention to detail",
  "B2B sales / outreach and relationship-building",
  "Basic math and cash handling",
  "Basic report writing / incident logs",
  "Cafeteria / serving line experience",
  "Cleaning / Sanitation",
  "Clerical / office support (Filing, forms, paperwork)",
  "Communication (Verbal and written)",
  "Computer literacy / basic IT",
  "Conflict resolution / de-escalation",
  "Customer service",
  "Data entry / typing",
  "Digital literacy (Email, web, apps)",
  "Entrepreneurship",
  "Food handling / kitchen skills",
  "Following checklists and standard operating procedures",
  "Forklift certified",
  "Foundational technical navigation (Online systems and portals)",
  "Goal setting and follow-through",
  "Inventory / warehouse experience",
  "Janitorial / Facility maintenance",
  "Landscaping / outdoor maintenance",
  "Laundry / linen services",
  "Leadership / mentoring peers",
  "Light maintenance / repair support",
  "Organization and planning",
  "Packaging and labeling",
  "Pallet stacking and material handling",
  "Phone skills / call handling",
  "Problem-solving",
  "Production line / assembly work",
  "Professional habits and collaboration",
  "Receiving and using feedback",
  "Reliability / showing up on time",
  "Respect for rules and safety procedures",
  "Safe tool handling and storage",
  "Scheduling and coordinating tasks",
  "Staying calm in stressful situations",
  "Stocking and organizing supplies",
  "Teamwork with diverse people",
  "Time management",
  "Working under pressure",
  "Working with the public",
  "Workplace readiness / professionalism",
  "Written documentation / record-keeping",
  "Yard crew / groundskeeping",
];


// Curated subsets - smaller lists shown by default before "Show all"
export const CURATED_OFFENSE_DESCRIPTIONS = [
  "Assault",
  "Domestic-related offense",
  "Drug possession",
  "DUI / DWI",
  "Probation violation",
  "Shoplifting",
  "Theft",
  "Driving on suspended license",
];

export const CURATED_OFFENSE_PROGRAMS = [
  "Substance use treatment program",
  "Anger management group",
  "Cognitive behavioral therapy (CBT) program",
  "Job readiness / employability class",
  "DUI education program",
  "Victim awareness / impact program",
];

export const CURATED_STEP2_PROGRAMS = [
  "GED / high school equivalency",
  "Vocational training (trades)",
  "Substance use treatment / recovery program",
  "Job readiness / employability workshop",
  "Cognitive behavioral program",
  "College courses",
];

export const CURATED_SKILLS = [
  "Reliability / showing up on time",
  "Teamwork with diverse people",
  "Customer service",
  "Communication (verbal and written)",
  "Staying calm in stressful situations",
  "Problem-solving",
  "Computer literacy / basic IT",
  "Working under pressure",
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

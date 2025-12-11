/**
 * Shared microcopy for chip-based suggestion inputs.
 * Centralizes helper text and labels for consistency across the form.
 */

/**
 * Helper text displayed under the chip input field.
 * Explains how to add items: type + Enter, click Add, or tap suggestions.
 */
export const CHIP_INPUT_HELPERS = {
  offensePrograms:
    'Type a program and press Enter or tap "Add" — or choose from the suggestions below.',
  rehabilitationPrograms:
    'Add your own programs, or tap a suggestion that fits your experience.',
  skills:
    'Think about both hard skills (like tools or equipment) and soft skills (like patience or teamwork). Type a skill or tap a suggestion.',
} as const;

/**
 * Descriptive labels displayed above chip suggestions.
 * Clarifies what the suggestion chips represent.
 */
export const CHIP_SUGGESTION_LABELS = {
  offensePrograms: 'Suggested programs related to this offense',
  rehabilitationPrograms: 'Suggested rehabilitation programs',
  skills: 'Suggested skills and strengths',
} as const;

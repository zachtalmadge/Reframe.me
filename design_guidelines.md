# Reflect.me Design Guidelines

## Design Approach & Philosophy

**Selected Approach**: Custom Utility-First Design (not reference-based)
**Rationale**: This is a specialized tool for justice-involved individuals requiring a unique balance of professionalism, warmth, and clarity. The design must reduce anxiety while maintaining credibility—a combination not found in standard industry patterns.

**Core Design Principles**:
- **Calming Clarity**: Every element serves a clear purpose; no visual clutter or overwhelming choices
- **Dignified Simplicity**: Professional yet approachable, avoiding both corporate coldness and excessive casualness
- **Progressive Confidence**: Design builds user confidence through clear steps, gentle guidance, and positive reinforcement
- **Accessibility-First**: High contrast, readable text, clear focus states are non-negotiable

## Color System

**Primary: Teal** (#0D9488 or similar)
- Use for primary CTAs, active states, links, and key UI elements
- Conveys trust, clarity, and forward movement

**Secondary: Orange** (#F97316 or similar)  
- Use sparingly for accents, highlights, and secondary actions
- Provides warmth and optimism without overwhelming

**Neutrals: Warm Grays**
- Background: Very light warm gray (#FAFAF9)
- Text: Dark gray (#1F2937) for high contrast
- Borders/dividers: Medium gray (#E5E7EB)

**Semantic Colors**:
- Success: Soft green (#10B981)
- Information: Teal (primary)
- Warning: Amber (#F59E0B)

## Typography

**Font Stack**: System font stack for maximum readability and performance
```
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

**Hierarchy**:
- **H1 (Page titles)**: text-4xl md:text-5xl, font-bold, leading-tight
- **H2 (Section headers)**: text-2xl md:text-3xl, font-semibold, leading-snug
- **H3 (Subsections)**: text-xl md:text-2xl, font-semibold
- **Body**: text-base md:text-lg (16px/18px), font-normal, leading-relaxed (1.75)
- **Small/Helper**: text-sm (14px), leading-normal
- **CTA Buttons**: text-lg font-medium, uppercase tracking

**Line Height**: Generous (1.6-1.8) for reduced cognitive load

## Layout System

**Spacing Scale**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24
- Tight spacing: p-4, gap-4 (mobile components)
- Standard spacing: p-6 to p-8, gap-6 (content sections)
- Generous spacing: p-12 to p-20 (page sections, hero areas)

**Container Strategy**:
- Max-width: max-w-4xl for content (centered)
- Full-width for hero/background elements
- Padding: px-4 sm:px-6 lg:px-8 for consistent edge spacing

**Mobile-First Breakpoints**:
- Base: 0-640px (primary design target)
- sm: 640px+ (tablets)
- md: 768px+ (small laptops)
- lg: 1024px+ (desktops)

## Component Library

### Header (Minimal)
- Fixed position, top of viewport
- Height: h-16 (64px)
- Content: "Reflect.me" logo/text aligned left
- Teal text color for brand name
- Clean white/light background with subtle bottom border
- No additional navigation links for initial scope

### Primary CTA Button
- Large tap target: py-4 px-8 (min 48px height)
- Teal background with white text
- Rounded corners: rounded-lg
- Shadow: shadow-md, hover:shadow-lg
- Text: "Let's Get Started" (18px, medium weight)
- Full-width on mobile, auto-width centered on desktop
- Smooth transitions on hover/focus

### Card Components
- White background with subtle shadow (shadow-sm)
- Rounded corners: rounded-xl
- Padding: p-6 md:p-8
- Border: Optional subtle teal border (border-teal-100)
- Use for tool descriptions on Home page

### Focus States
- Visible outline: ring-2 ring-teal-500 ring-offset-2
- Never remove focus indicators
- Enhanced for keyboard navigation

## Home Page Specifications

**Hero Section**:
- No large hero image (keeps design calm and focused)
- Vertical padding: py-12 md:py-20
- Center-aligned content
- H1: "Prepare for Your Next Opportunity" (or similar empowering headline)
- Subheading explaining Reflect.me's purpose in 1-2 sentences
- Teal accent line or subtle decorative element (non-distracting)

**Value Proposition Section**:
- Two-column grid on desktop (grid-cols-1 md:grid-cols-2)
- Card-based layout for each tool:
  - **Card 1**: "5 Disclosure Narratives" with icon and description
  - **Card 2**: "Pre-Adverse Action Response Letter" with icon and description
- Gap: gap-6 between cards
- Each card includes: Icon (teal), title, 2-3 sentence description

**Icons**: Use Heroicons (outline style) for consistency
- Document icon for narratives
- Mail/envelope icon for response letter
- Size: h-10 w-10 md:h-12 w-12

**CTA Section**:
- Centered below value proposition
- Spacing: mt-12
- Single "Let's Get Started" button
- Optional helper text below: "Free • No account required • Takes 10-15 minutes"

**Vertical Rhythm**:
- Section spacing: space-y-12 md:space-y-20
- Content spacing within sections: space-y-6 md:space-y-8

## Selection Page (Placeholder)

- Same header as Home
- Centered content with simple message: "Selection page coming soon"
- Maintains consistent spacing and typography

## Accessibility Requirements

- Color contrast: Minimum 4.5:1 for all text (7:1 for small text preferred)
- All interactive elements: minimum 44x44px touch targets
- Keyboard navigation: Clear focus indicators, logical tab order
- Semantic HTML: Proper heading hierarchy, button elements for actions
- ARIA labels where needed for screen readers

## Animation Guidelines

**Minimal & Purposeful**:
- Button hover: Subtle shadow increase (150ms ease)
- Page transitions: None (instant for clarity)
- Loading states: Simple teal spinner when needed
- No scroll animations or parallax effects
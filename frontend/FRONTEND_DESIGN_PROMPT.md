# Frontend Design Prompt for Startup Role Simulator

## Project Overview

Design a modern, minimalist web interface for a **Startup Role Simulator** - an educational reflection tool that helps users understand their decision-making patterns through interactive scenarios.

## Core Concept

This is NOT a game. It's a reflective, educational experience where users:

1. Choose a startup role (Engineer, Product Manager, or Founder)
2. Navigate through 5-7 realistic workplace scenarios
3. Make constrained choices that reveal their decision patterns
4. Receive a personalized role profile
5. Have a reflective conversation with an AI "role voice"

## Design Philosophy

- **Minimalist and calm**: Clean, uncluttered interface
- **Professional yet warm**: Approachable but not gamified
- **Thoughtful over fast**: Encourage reflection, not speed
- **No scoring/judgment**: This is about self-discovery, not evaluation
- **Desktop-first**: Optimized for desktop, mobile-friendly

## Tech Stack Preferences

- React/Next.js or similar modern framework
- Tailwind CSS for styling
- TypeScript
- Clean, component-based architecture

---

## User Flow & Required Screens

### 1. Landing Page / Role Selection

**Purpose**: Welcome users and let them choose their role

**Layout**:

- Hero section with clear value proposition
- Brief explanation (2-3 sentences): "Experience startup decisions from different perspectives. Make choices, discover patterns, reflect on your approach."
- Three role cards displayed horizontally (or grid on mobile)
- Each card should include:
  - Role icon/illustration
  - Role name (Early-stage Engineer, Product Manager, Founder/CEO)
  - Short description (1-2 sentences)
  - "Start as [Role]" button

**Visual Style**:

- Calm color palette (soft blues, grays, accent colors per role)
- Spacious white background
- Subtle shadows/borders on cards
- Icons: modern, simple, line-style

---

### 2. Scenario View (Main Interactive Screen)

**Purpose**: Present scenarios and capture user decisions

**Layout Components**:

**Header**:

- Progress indicator: "Scenario X of Y"
- Role badge showing selected role
- Subtle progress bar

**Main Content Area**:

- **Scenario Title**: Clear, bold heading
- **Scenario Description**: 2-4 paragraphs of context (readable width, ~700px max)
- **Prompt/Question**: "What do you do?" or similar

**Choice Section**:

- 3-4 choice cards displayed vertically
- Each choice card:
  - Radio button or card selection
  - Choice text (2-3 sentences)
  - Hover state showing it's interactive
  - Selected state with accent color
- "Continue" button (disabled until choice selected)

**Design Notes**:

- Keep text readable (good line-height, max-width)
- Give users space to think - not cramped
- Subtle animations on choice selection
- No timer, no pressure elements

---

### 3. Loading/Transition Screen

**Purpose**: Brief transition between scenarios and profile generation

**Layout**:

- Centered content
- Simple animation (spinner or pulsing icon)
- Status text: "Analyzing your choices..." or "Generating your profile..."
- Role-themed color accent

---

### 4. Profile View

**Purpose**: Display user's decision pattern analysis

**Layout**:

**Header**:

- Title: "Your [Role] Profile"
- Subtitle: Brief context about what this represents

**Profile Sections** (scrollable):

1. **Summary Card** (top):

   - 2-3 sentence overview
   - Distinct visual treatment (card/box with accent border)

2. **Decision Patterns**:

   - Heading: "Your Decision Patterns"
   - 3-5 pattern descriptions, each as a separate insight card
   - Each card has an icon/bullet and 1-2 sentences

3. **Trade-off Preferences**:

   - Heading: "How You Balance Trade-offs"
   - 2-3 preference descriptions
   - Visual representation (could be simple bars, icons, or just text)

4. **Key Insights**:
   - Heading: "Key Insights"
   - 2-3 reflective observations
   - Highlighted/emphasized visually

**Footer**:

- "Start Reflection Conversation" button (prominent)
- Optional: "Download Profile" or "Start Over" (secondary buttons)

**Design Notes**:

- Use card-based layout for each section
- Plenty of white space
- Consider subtle background patterns or gradients
- Make it feel personal and insightful, not like a test result

---

### 5. Reflection Conversation View

**Purpose**: Chat interface for AI-powered reflection

**Layout**:

**Header**:

- Title: "Reflection with [Role] Voice"
- Info icon/tooltip: Brief explanation of what this conversation is
- Progress: "Turn X of 6" (subtle)

**Chat Area**:

- Message bubbles:
  - AI messages: Left-aligned, role-themed color
  - User messages: Right-aligned, neutral gray
- Each message includes timestamp
- Auto-scroll to latest message

**Input Area** (bottom):

- Text input field (supports multi-line)
- Send button
- Character count or guidance if needed
- Input disabled when conversation complete

**Completion State**:

- After 6 turns: Show completion message
- "Restart" or "New Session" button
- Option to review profile again

**Design Notes**:

- Chat should feel conversational but professional
- Not too playful (avoid emoji overload)
- Consider typing indicator when AI is responding
- Smooth scroll animations

---

## Component Specifications

### Color Palette Suggestions

**Base Colors**:

- Background: #FFFFFF or #F8F9FA
- Text Primary: #1A202C
- Text Secondary: #718096
- Border/Divider: #E2E8F0

**Role-Specific Accents**:

- Engineer: Blue/Teal (#3B82F6 or #14B8A6)
- Product Manager: Purple (#8B5CF6)
- Founder: Orange/Amber (#F59E0B)

**Semantic Colors**:

- Success/Progress: #10B981
- Warning: #F59E0B
- Error: #EF4444

### Typography

- **Headings**: Inter, SF Pro, or similar modern sans-serif
  - H1: 32-36px, bold
  - H2: 24-28px, semibold
  - H3: 20px, semibold
- **Body**: Same font family
  - Regular: 16px, line-height 1.6-1.8
  - Small: 14px
- Good readability is critical

### Spacing & Layout

- Max content width: 800-900px (for reading)
- Generous padding: 24-32px on cards
- Consistent spacing scale: 8px increments (8, 16, 24, 32, 48, 64)

### Buttons

**Primary Button**:

- Solid color (role accent)
- Padding: 12px 32px
- Border radius: 8px
- Hover: Slight darkening
- Font: Medium weight, 16px

**Secondary Button**:

- Outline style
- Same size as primary
- More subtle

**Disabled State**:

- Reduced opacity (40-50%)
- No hover effect

### Cards

- Background: White
- Border: 1px solid #E2E8F0 or subtle shadow
- Border radius: 12px
- Padding: 24px
- Hover: Subtle lift (shadow increase)

---

## API Integration Notes (for developers)

### Endpoints to Connect:

1. **POST** `/api/sessions/create` - Start session
2. **POST** `/api/sessions/{session_id}/decide` - Submit choice
3. **POST** `/api/sessions/{session_id}/generate-profile` - Get profile
4. **POST** `/api/sessions/{session_id}/reflection/start` - Start chat
5. **POST** `/api/sessions/{session_id}/reflection/message` - Send message
6. **GET** `/api/sessions/{session_id}/status` - Check status

### State Management Needed:

- Current session ID
- Selected role
- Current scenario
- Decision history
- Generated profile
- Conversation history
- Current phase (scenarios/profile/reflection)

---

## Responsive Design Considerations

### Desktop (1024px+)

- Full horizontal layout
- Optimal reading width
- Side-by-side elements where appropriate

### Tablet (768-1024px)

- Maintain layout mostly
- Slightly reduced padding
- Stack some horizontal elements

### Mobile (< 768px)

- Vertical stacking
- Full-width cards
- Touch-friendly button sizes (min 44px height)
- Collapsed/simplified header
- Chat bubbles full width with padding

---

## Animation & Interaction Details

### Micro-interactions:

- Smooth transitions between screens (fade in/out)
- Button hover states (scale or color shift)
- Choice card selection (border highlight, subtle scale)
- Loading states (skeleton screens or spinners)
- Message bubble entrance (slide up + fade)

### Timing:

- Quick interactions: 150-200ms
- Screen transitions: 300-400ms
- Nothing too slow or distracting

---

## Accessibility Requirements

- Proper heading hierarchy (H1 → H2 → H3)
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states clearly visible
- Good color contrast ratios (WCAG AA minimum)
- Alt text for all images/icons
- Screen reader friendly

---

## Optional Enhancements (Nice to Have)

- Dark mode toggle
- Profile export as PDF
- Share profile (shareable link)
- Session history (if user wants to restart)
- Subtle background patterns/textures
- Role-specific illustrations or abstract visuals
- Progress celebration moments (subtle, not over the top)

---

## Design Deliverables Expected

1. **Landing/Role Selection Page** - Initial entry point
2. **Scenario Decision Screen** - Main interaction page
3. **Profile Display Page** - Results presentation
4. **Reflection Chat Interface** - Conversation UI
5. **Mobile responsive versions** of key screens
6. **Component library** (buttons, cards, input fields)

---

## Important Notes

- This is NOT gamified - avoid points, leaderboards, achievements
- Focus on clarity and reflection, not engagement metrics
- Users should feel they're learning about themselves, not being tested
- Professional tone throughout, but warm and approachable
- Every screen should breathe - don't cram information

---

## Reference Style Inspiration

Think of combining elements from:

- **Notion**: Clean, organized, readable
- **Linear**: Minimal, fast, purposeful
- **Stripe**: Professional, clear, trustworthy
- **Headspace**: Calm, thoughtful, personal

Avoid:

- Gamification (points, badges, streaks)
- Busy dashboards
- Aggressive calls-to-action
- Distracting animations
- Dark patterns

---

## Target Audience

- Startup professionals and aspiring founders
- People interested in self-reflection
- Career transitioners exploring roles
- Professionals seeking role clarity
- Age range: 25-45 primarily
- Comfortable with digital tools
- Value thoughtfulness over speed

---

## Success Criteria

The design succeeds when:

- Users feel calm and focused while using it
- The experience feels personal and insightful
- Navigation is intuitive without explanation
- Users want to complete the full experience
- The design doesn't distract from the content
- It works seamlessly on all devices
- Users would recommend it to colleagues

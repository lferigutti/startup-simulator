export const scenarios = {
  engineer: [
    {
      id: 1,
      title: "Technical Debt vs. New Feature",
      description:
        "Your team has been moving fast and accumulated significant technical debt. The codebase is becoming harder to maintain, but the CEO wants a major new feature for an upcoming investor demo in three weeks.",
      prompt: "What do you prioritize?",
      choices: [
        "Push for refactoring first, explaining the long-term risks to leadership",
        "Build the feature with shortcuts, planning to refactor later",
        "Propose a hybrid approach: minimal refactoring to enable the feature",
        "Escalate to the CTO and let them make the final call",
      ],
    },
    {
      id: 2,
      title: "Production Bug During Launch",
      description:
        "It's launch day and you've discovered a critical bug that affects 20% of users. Fixing it properly will take 6-8 hours. The marketing team has already sent announcements and scheduled press coverage.",
      prompt: "How do you respond?",
      choices: [
        "Implement a quick hotfix and monitor closely, planning a proper fix later",
        "Delay the launch until the bug is properly resolved",
        "Ship with the bug but add monitoring and support documentation",
        "Roll out gradually, starting with internal users to verify the fix",
      ],
    },
    {
      id: 3,
      title: "Architecture Decision",
      description:
        "Your startup needs to choose between a monolithic architecture (faster to build now) and microservices (more scalable long-term). The team is split, and investors want to see rapid product iteration.",
      prompt: "Which approach do you advocate for?",
      choices: [
        "Start with a monolith to ship faster, migrate later if needed",
        "Build microservices from day one to avoid future pain",
        "Create a modular monolith that could split into services",
        "Run a time-boxed prototype of both approaches before deciding",
      ],
    },
    {
      id: 4,
      title: "Team Hire vs. Outsource",
      description:
        "You need mobile expertise urgently but hiring a full-time mobile engineer will take 2-3 months. A consulting agency can start immediately but will cost 3x more and create knowledge dependency.",
      prompt: "What do you recommend?",
      choices: [
        "Hire the consultant for speed, plan to transition knowledge",
        "Wait for the right full-time hire even if it delays the project",
        "Learn mobile development yourself and build a basic version",
        "Partner with the consultant while simultaneously recruiting",
      ],
    },
    {
      id: 5,
      title: "Open Source Strategy",
      description:
        "You've built an internal tool that could benefit the wider community. Open sourcing it could boost your company's reputation but requires ongoing maintenance and might reveal competitive advantages.",
      prompt: "What's your stance?",
      choices: [
        "Open source it fully to build community and attract talent",
        "Keep it proprietary to maintain competitive advantage",
        "Release a limited version, keeping core features private",
        "Open source it but under a license that limits commercial use",
      ],
    },
  ],
  "product_manager": [
    {
      id: 1,
      title: "Feature Requests vs. User Research",
      description:
        "Your top three customers are demanding specific features, threatening to churn if not delivered. However, your user research suggests a different direction that could serve a broader market.",
      prompt: "How do you proceed?",
      choices: [
        "Build what the top customers want to prevent churn",
        "Follow the research and risk losing the immediate revenue",
        "Find a compromise that partially addresses both needs",
        "Have direct conversations to understand the underlying problems",
      ],
    },
    {
      id: 2,
      title: "Roadmap Pivot",
      description:
        "You're halfway through building a major feature when new market data suggests it won't drive the adoption you expected. The team has invested significant effort and morale is high about shipping it.",
      prompt: "What action do you take?",
      choices: [
        "Complete the feature since it's halfway done",
        "Stop immediately and pivot to the more promising opportunity",
        "Ship a minimal version then shift focus",
        "Run a small beta test before making the final decision",
      ],
    },
    {
      id: 3,
      title: "Engineering vs. Design Conflict",
      description:
        "Engineering says the design team's vision for the new onboarding flow will take 6 weeks. Design insists this experience is critical for conversion. Sales is asking for any improvement ASAP.",
      prompt: "How do you resolve this?",
      choices: [
        "Side with design - the user experience is paramount",
        "Ask engineering for a faster alternative approach",
        "Scope down to the highest-impact elements",
        "Run a workshop to find creative solutions together",
      ],
    },
    {
      id: 4,
      title: "Metric Selection",
      description:
        "Your team needs to choose a north star metric. Options include: active users (easier to grow), revenue per user (better for business), or customer satisfaction scores (harder to game but slower to change).",
      prompt: "Which metric do you champion?",
      choices: [
        "Active users to demonstrate growth to investors",
        "Revenue per user to prove business viability",
        "Customer satisfaction for long-term health",
        "A balanced scorecard tracking multiple metrics",
      ],
    },
    {
      id: 5,
      title: "Competitive Response",
      description:
        "A well-funded competitor just launched a feature that your team has been planning for months. They beat you to market and are getting positive press. Your version would be better but will take 6 more weeks.",
      prompt: "What's your strategy?",
      choices: [
        "Rush to ship a competitive version within 2 weeks",
        "Stay the course and ship the superior version",
        "Pivot to a different differentiating feature",
        "Focus on your existing strengths rather than matching them",
      ],
    },
  ],
  founder: [
    {
      id: 1,
      title: "Funding vs. Profitability",
      description:
        "You have 8 months of runway and two paths: raise Series A now (favorable terms, but dilution) or cut costs to reach profitability (slower growth, but maintains control).",
      prompt: "Which path do you choose?",
      choices: [
        "Raise the Series A to fuel aggressive growth",
        "Cut costs and push for profitability",
        "Raise a smaller bridge round to extend runway",
        "Seek strategic partnerships that provide both capital and growth",
      ],
    },
    {
      id: 2,
      title: "Co-founder Disagreement",
      description:
        "Your technical co-founder wants to rebuild the platform with new technology. Your business co-founder wants to focus on sales. Both have valid points, but their visions are incompatible right now.",
      prompt: "How do you navigate this?",
      choices: [
        "Side with the technical co-founder on architecture",
        "Prioritize sales and revenue generation",
        "Facilitate a structured decision-making process",
        "Make the final call yourself based on company needs",
      ],
    },
    {
      id: 3,
      title: "Customer vs. Vision",
      description:
        "Your biggest enterprise customer wants features that would turn you into a services company. The revenue would be transformative, but it conflicts with your product vision and scalability.",
      prompt: "What do you decide?",
      choices: [
        "Take the deal and adapt your vision",
        "Decline and stick to your original product strategy",
        "Negotiate terms that balance both objectives",
        "Use it as a testing ground for enterprise features",
      ],
    },
    {
      id: 4,
      title: "Team Scaling Decision",
      description:
        "You have budget to hire 3 people. You need all of: another engineer (to ship faster), a salesperson (to grow revenue), and an operations person (team is drowning in ops work).",
      prompt: "Who do you hire?",
      choices: [
        "Two engineers and one salesperson for product-led growth",
        "One of each to address all critical gaps",
        "Two salespeople and one engineer to prioritize revenue",
        "Two ops people and one engineer to build sustainable foundation",
      ],
    },
    {
      id: 5,
      title: "Market Pivot",
      description:
        "Early traction is good but not great. A tangential market shows 10x interest, but requires reworking positioning and some features. Your investors backed you for the original vision.",
      prompt: "Do you pivot?",
      choices: [
        "Pivot fully to the promising market",
        "Stay focused on the original vision",
        "Test the new market while maintaining current focus",
        "Discuss with investors before making any changes",
      ],
    },
  ],
};


export const rolePrompts = {
  engineer: [
    "What was your thinking behind balancing technical debt with feature delivery?",
    "How do you typically approach decisions when there's no clear right answer?",
    "Tell me about a time when you had to advocate for a technical approach that wasn't popular.",
  ],
  "product_manager": [
    "How do you typically gather confidence in your product decisions?",
    "What role does data play in your decision-making process?",
    "How do you handle situations where stakeholders have conflicting priorities?",
  ],
  founder: [
    "How do you balance your vision with market feedback?",
    "What principles guide you when making difficult trade-offs?",
    "How has your decision-making approach evolved as you've grown?",
  ],
};
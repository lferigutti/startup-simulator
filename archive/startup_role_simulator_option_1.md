# Startup Role Simulator — Design Document

## 1. Purpose

This document defines the **product vision, scope, and technical design** of the *Startup Role Simulator*. It serves as a **shared context** for future LLM assistance during development.

The goal is to build a **finishable, human-centered, interactive simulator** that helps people in startups understand **how different roles think and act under pressure**, including themselves.

This is **not** a game, quiz, or interview prep tool. It is a **guided reflective experience**.

---

## 2. Problem Statement

People in startups frequently misunderstand:
- why other roles behave the way they do
- their own default decision patterns under pressure

This leads to:
- PM ↔ Engineer friction
- Founder isolation
- Poor collaboration
- Misaligned expectations

Existing tools explain roles intellectually, but **do not let users experience trade-offs**.

---

## 3. Target Users (Initial)

- Early-stage engineers (0–5 YOE)
- Product managers in small startups
- Founders of early-stage companies
- People considering switching startup roles

Non-goals:
- Enterprise HR tooling
- Hiring automation
- Therapy or psychological diagnosis

---

## 4. Core Concept

Users:
1. Select a startup role
2. Face realistic, pressure-filled scenarios
3. Make constrained decisions (no free-text answers)
4. Receive a structured role profile
5. Reflect via a short, guided LLM-powered conversation with a **role voice**

The simulator acts as a **mirror**, not a judge.

---

## 5. Roles (MVP)

Initial roles (max 3 for MVP):

- Early-stage Engineer
- Product Manager
- Founder / CEO

Each role represents an **archetype**, not a real person.

---

## 6. Scenarios

Each role has:
- 5–7 scenarios
- Each scenario:
  - is realistic
  - presents tension and trade-offs
  - has 3–4 predefined choices
  - has no objectively correct answer

Scenarios are **hand-authored** and deterministic.

---

## 7. Outcomes (No Scores)

The simulator does NOT produce:
- numeric scores
- rankings
- pass/fail results

Instead, it produces:
- decision patterns
- trade-off preferences
- recurring tensions

Example output:
> "You consistently prioritize long-term quality, even when short-term delivery is at risk."

---

## 8. Role Voice Conversations (LLM)

### Purpose
The LLM is used for **reflection and interpretation**, not decision-making or evaluation.

### Principles
- Deterministic output (low temperature)
- Strong prompt constraints
- Short conversations (5–6 turns max)
- No advice-giving or prescriptions

### Role Voice Behavior
Each role voice:
- speaks from its worldview
- may challenge or validate the user
- may highlight blind spots
- never claims to be a real person

---

## 9. LLM Usage Boundaries

LLM is used ONLY for:
- Role voice reflection
- Reframing decisions
- Highlighting patterns

LLM is NOT used for:
- Scenario generation
- Scoring logic
- Core product structure

LLM = interpreter, not judge.

---

## 10. Determinism Strategy

To ensure consistency:
- Temperature: 0–0.2
- Prompts include explicit structure
- Few-shot examples per role
- Optional response caching per scenario + choice

Same input must always produce the same output.

---

## 11. System Architecture (MVP)

### Frontend
- Next.js (React)
- Tailwind CSS
- Framer Motion (light animations)

### Backend
- FastAPI (Python)
- Session-based orchestration
- LLM API calls (OpenAI / Gemini)

### Sessions
- Each user session has a UUID
- Session tracks:
  - role
  - scenarios completed
  - choices made
  - cached LLM responses (optional)

Session storage (MVP):
- In-memory (stateful)
- Optional SQLite later

---

## 12. API Responsibilities

Backend API is responsible for:
- Session creation
- Scenario progression
- Prompt construction
- LLM calls
- Response normalization

Frontend never calls LLM directly.

---

## 13. Multi-Agent / Graph Model (Future)

Conceptually:
- Each role = node
- User decisions update node state
- Optional role-to-role interactions later

For MVP:
- Single role node per session

---

## 14. Non-Goals (Explicit)

This project does NOT aim to:
- Predict job performance
- Replace interviews
- Give career advice
- Diagnose personality traits
- Optimize hiring

---

## 15. Success Criteria (MVP)

The MVP is successful if:
- A user completes a full simulation in <10 minutes
- The experience feels coherent and human
- Users report insight or recognition
- The project is finished and deployed

---

## 16. Design Philosophy

- Opinionated over neutral
- Constrained over open-ended
- Human insight over correctness
- Finishable over scalable

---

## 17. Ethical & UX Guardrails

- Clear disclaimer: AI-generated role simulation
- No impersonation of real people
- No political or psychological labeling
- Respectful, non-judgmental tone

---

## 18. Future Extensions (Out of Scope for MVP)

- Team mode
- Role comparison
- Persistence across devices
- Analytics dashboards
- Monetization

These are intentionally deferred.

---

## 19. Development Guideline

When in doubt:
> Prefer simplicity, clarity, and finishing over cleverness.

This document may evolve, but the core principles should remain stable.


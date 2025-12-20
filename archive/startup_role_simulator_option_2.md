# Project Design Document: Startup Role Simulator (MVP)

## 1. Project Overview

**Name:** Startup Role Simulator
**Type:** Multi-Agent LLM Strategy Game / Training Tool
**Goal:** A turn-based role-playing simulation where the user acts as CEO of a startup. The user must navigate a crisis scenario by negotiating with AI-powered agents (representing C-Suite roles like CTO, CMO) who have conflicting goals.
**MVP Success Metric:** A functional "Survival Mode" where the user plays through 5-10 turns of a fixed scenario, making decisions that affect simulated Company Health metrics (Runway, Morale, Product Quality).

## 2. High-Level Architecture

The system follows a **Client-Server** architecture with a specialized **Multi-Agent Orchestration Layer**.

### Tech Stack

- **Frontend:** Next.js (React) + Tailwind CSS
- **Backend API:** Python (FastAPI)
- **LLM Orchestration:** LangGraph (built on LangChain)
- **LLM Inference:** Local Open-Source Models (Llama 3, Mistral, or OpenHermes) served via **Ollama**.
- **Data Validation:** Pydantic (for structured JSON outputs)

### Data Flow

1.  **User Input:** User sends a chat message/decision via Next.js UI.
2.  **API Handler:** FastAPI receives the payload.
3.  **Graph Execution (LangGraph):**
    - The `Orchestrator` node assesses the state.
    - The message is routed to specific Agents (e.g., `CTO_Agent`, `CMO_Agent`).
    - Agents generate responses _and_ updated metric scores based on the user's decision.
4.  **State Update:** The shared `GraphState` (conversation history + metrics) is updated.
5.  **Response:** The UI renders the agents' dialogue and updates the dashboard charts (Runway/Health).

---

## 3. Core Components & Logic

### A. Multi-Agent Orchestration (LangGraph)

We will use a **StateGraph** to model the conversation flow.

**The Graph State (`TypedDict`):**

```python
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    runway_months: int
    product_quality_score: int
    team_morale_score: int
    current_turn: int
    game_over: bool

```

**Nodes:**

- **User_Node:** Captures user input.

- **CTO_Agent:**
  - **Persona:** Risk-averse, focuses on technical debt, stability, and engineering resources.
  - **Goal:** Maintain `product_quality_score`.

- **CMO_Agent (Marketing):**
  - **Persona:** Aggressive, focuses on growth, spend, and speed to market.
  - **Goal:** Spend budget to acquire users (affects `runway_months`).

- **Moderator / Game_Master:** Evaluates the round, updates the numeric metrics based on the outcome, and checks for "Game Over" conditions.

### B. Agent Configuration (Determinism Strategy)
To ensure the simulation is playable and not just a random chat:

- **Temperature:** Set to 0.0 or 0.1.
- **Structured Output:** All agents must return JSON via Pydantic models, not free text.

**Example Pydantic Schema:**

```startup-simulator/startup_role_gemini_version.md
class AgentResponse(BaseModel):
    dialogue: str = Field(description="The conversational response to the CEO.")
    sentiment_score: int = Field(description="1-10 score of how happy the agent is with the decision.")
    resource_request: Optional[int] = Field(description="Amount of budget requested, if any.")
```

### C. Backend API (FastAPI)

**Endpoint:** `POST /api/chat`

- **Input:** `user_message`, `session_id`
- **Output:** JSON containing `agent_responses` (list) and `updated_metrics`.

**Endpoint:** `POST /api/start-game`

- **Action:** Initializes a new LangGraph instance with the default scenario prompt.

---

## 4. MVP Scenario: "The Pivot or Perish"

**Context:** It is a Series A startup. Runway is 6 months.

**The Event:** A major competitor just launched a feature that makes your main product obsolete.

**The Conflict:**

- **CTO Argument:** "We need 3 months to refactor our code before we can build a competing feature. If we rush, the system crashes."
- **CMO Argument:** "We will be dead in 3 months! We need to launch a 'smoke and mirrors' marketing campaign NOW and hack together a prototype in 2 weeks."

**User (CEO) Task:** Negotiate a compromise.

- **If you side 100% with CTO:** Runway drops, Morale drops (Sales team quits).
- **If you side 100% with CMO:** Product Quality tanks, Churn increases.

---

## 5. Frontend Requirements (Next.js)

### Pages

- **Landing Page:** "Start Simulation" button.

- **Game Interface:**
  - **Left Panel (Dashboard):** Live charts/progress bars for Runway, Quality, Morale.
  - **Center Panel (Chat):** A chat stream showing the User (Right aligned) vs. Agents (Left aligned, color-coded by role).
  - **Input Area:** Text box for CEO decisions.

- **Post-Mortem Page:** Shows final score and an LLM-generated critique of the user's leadership style.

### Key UI Features

- **Streaming Text:** Use AI SDK (Vercel) or standard SSE (Server-Sent Events) to stream agent responses for realism.
- **Role Badges:** Visual avatars for the CTO and CMO.

---

## 6. Implementation Roadmap

### Phase 1: The Engine (Python) - (Focus: Core AI Logic & Agent Definition)

| Step | Detail | Output / Goal |
| :--- | :--- | :--- |
| **1.1 Setup Environment** | Initialize the Python project using Poetry or Pipenv. Create a virtual environment. | `pyproject.toml` or `requirements.txt` |
| **1.2 Install Core Libraries** | Install `langgraph`, `langchain`, `fastapi`, `uvicorn`, `pydantic`, and the chosen LLM client (e.g., `ollama` Python library). | All necessary packages installed. |
| **1.3 Ollama Setup** | Download and install Ollama. Pull the chosen SLM (e.g., `llama3:8b`). Test a basic inference call. | Successful local LLM inference test. |
| **1.4 Define Pydantic Schemas** | Define the `AgentResponse` schema and any other structured output models required for the game logic. | `schemas.py` file with Pydantic models. |
| **1.5 Define Graph State** | Define the `AgentState` `TypedDict` for LangGraph, including all metrics (`runway_months`, etc.). | `state.py` file. |
| **1.6 Create Agent Logic** | Write the Python functions (nodes) for the `CTO_Agent` and `CMO_Agent`, including their detailed system prompts and forced Pydantic output. | `agents.py` file. |
| **1.7 Build LangGraph** | Assemble the `StateGraph` with the defined nodes, edges, and the `Moderator / Game_Master` node logic. Test the full sequence (User $\rightarrow$ Agent 1 $\rightarrow$ Agent 2 $\rightarrow$ Moderator $\rightarrow$ Output) in a Jupyter notebook. | Fully working, console-based simulation loop. |

### Phase 2: The API (FastAPI) - (Focus: Backend Service & State Management)

| Step | Detail | Output / Goal |
| :--- | :--- | :--- |
| **2.1 API Structure** | Create the main FastAPI app and set up CORS. | `main.py` ready for endpoints. |
| **2.2 Session Management** | Implement a simple in-memory dictionary or cache to store the active `GraphState` for each `session_id`. | Working `session_manager.py` |
| **2.3 Start Game Endpoint** | Implement `POST /api/start-game` to initialize a new session, set the initial metrics, and return the first prompt from the scenario. | Game initialization fully functional. |
| **2.4 Chat Endpoint** | Implement `POST /api/chat` to accept user input and session ID, execute the LangGraph for one turn, and return the new messages and updated metrics. | Core game logic exposed via API. |
| **2.5 Error Handling** | Add robust error handling (e.g., 500 errors for LLM failures, 404 for invalid session IDs). | Stable API. |

### Phase 3: The UI (Next.js) - (Focus: User Experience & Metrics Visualization)

| Step | Detail | Output / Goal |
| :--- | :--- | :--- |
| **3.1 Scaffold Next.js** | Initialize the Next.js project and set up Tailwind CSS for styling. | Working frontend development server. |
| **3.2 Landing Page** | Build the `Landing Page` with a "Start Simulation" button that calls `/api/start-game`. | Landing page connected to backend. |
| **3.3 Game Interface** | Build the main `Game Interface` page layout (Dashboard, Chat Panel, Input). | Static UI layout complete. |
| **3.4 Chat Component** | Implement the core chat UI to display messages from the User and the Agents (using avatars and color-coding). | Functional message display. |
| **3.5 API Integration** | Wire up the input box to the `/api/chat` endpoint. Implement state management in React/Next.js to update the chat history and metrics upon receiving a response. | Full turn-based interaction functional. |
| **3.6 Metrics Dashboard** | Implement simple visual components (progress bars or basic charts) to display the `runway_months`, `product_quality_score`, and `team_morale_score`. | Live dashboard updating with game state. |

### Phase 4: Tuning and Polish - (Focus: Game Quality & Portfolio Value)

| Step | Detail | Output / Goal |
| :--- | :--- | :--- |
| **4.1 Prompt Refinement** | Iteratively test and refine the system prompts for the CTO and CMO to ensure they maintain persona and argue persuasively against the user and each other. | Highly realistic agent dialogue. |
| **4.2 Scoring Logic Tuning** | Tune the mathematical impact of user decisions on the metrics within the `Moderator / Game_Master` node to ensure the game is challenging but fair. | Balanced and strategic gameplay. |
| **4.3 Post-Mortem Implementation** | Implement the logic to detect a "Game Over" state (e.g., runway = 0). Write the final `Post-Mortem` LLM call to critique the user's performance. | Functional end-game analysis page. |
| **4.4 Final Polish** | Ensure the UI is responsive, polish any styling, and add clear instructions for running the app (including Ollama). | Production-ready MVP. |

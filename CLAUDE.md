# CLAUDE.md

## Project Context

This is "Flight Simulator"—a learning environment for teaching developers to reason about code in the age of AI. The human you're working with is Conroy, a senior full-stack engineer building this as a prototype for a VeryHumanAI workshop tomorrow (Sunday, Nov 30, 12-2pm ET).

## What We're Building

A "broken" Next.js 15 app (based on the Turso starter template) with intentionally injected bugs at varying difficulty levels. The goal isn't the app itself—it's the _curriculum_ around debugging it with AI assistance.

### The Repo Needs:

1. Working base app (Turso Next.js starter: github.com/tursodatabase/nextjs-turso-starter)
2. 4-6 injected bugs (junior through senior level)
3. AGENTS.md with teaching-mode instructions
4. Test suite with some intentional failures
5. README as "mission briefing" (no spoilers)

### Bug Difficulty Spectrum:

- **Junior:** Missing validation, typos causing silent failures, missing loading states
- **Mid:** Race conditions, no optimistic UI, missing error boundaries
- **Senior:** N+1 queries, no pagination, business logic in wrong layer

## Workshop Flow We're Designing For

1. Orientation (20 min) - Explore codebase with AI
2. Planning (25 min) - Think before typing, edge cases, constraints
3. Execution (45 min) - Fix 2-3 bugs with AI, commit often
4. Review (20 min) - Push PR, review like a senior would
5. Debrief (10 min) - What did we learn?

## Conroy's Style

He thinks out loud, iterates fast, and cares more about the pedagogy than the polish. This is a prototype—ship something that teaches, refine later.

## Prior Conversation Context

We've been discussing the "broken ladder" problem: AI removed the bottom rungs of developer training. This project is an experiment in what the new ladder might look like—teaching reasoning and verification instead of syntax.

The mantra: "Keep the specs, throw away the code."

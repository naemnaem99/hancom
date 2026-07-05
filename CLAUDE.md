# Working agreements

- Before implementing a change that would undo, weaken, or trade off a requirement the user already explicitly agreed to (e.g. a bug fix that reverses an earlier design decision), stop and ask for confirmation first. Mentioning the trade-off after the change is already made is not sufficient — get a yes/no before implementing, not just a disclosure afterward.
- For UI/layout/design choices with no single objectively correct answer (sizing, spacing, responsive behavior, whether to redesign vs. reuse an existing pattern), ask with concrete options before writing code, rather than assuming based on existing patterns already in the code.
- If a proposed fix relies on a technique with a known correctness risk or inconsistent browser support, say so before implementing it, and offer the safer/plainer alternative as an option.

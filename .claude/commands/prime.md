# Prime Command - Game Server Development Context

## Purpose
Load comprehensive development context for fresh Claude sessions, leveraging our handoff brief system for immediate productivity.

## Execution Steps

### 1. Load Current Development Status
Read CLAUDE.md to get the "🚀 CURRENT DEVELOPMENT STATUS" handoff brief:
- Current implemented features and functional state
- Next step goals and objectives  
- Critical gotchas and shortcuts discovered
- Files ready for modification

*If CLAUDE.md doesn't exist, indicate this is a fresh project start*

### 2. Check Latest Development Progress  
Look in docs/development-steps/ for the most recently completed step:
- Read the latest step documentation for technical context
- Understand what was just implemented
- Review any lessons learned or debugging techniques

### 3. Load Project Architecture
Read specs/online-game-server-spec.md to understand:
- Overall project goals and architecture
- Data models and API design
- Development phases and roadmap
- Technical requirements and constraints

### 4. Verify Current Functionality
Run quick verification to confirm working state:
- Check if npm run dev starts successfully
- Verify current features work as described in handoff brief
- Note any discrepancies between expected and actual state

### 5. Present Integrated Context Summary
Provide comprehensive overview including:
- **Current State:** What's implemented and working
- **Next Actions:** Specific next step objectives  
- **Key Context:** Important architectural decisions and patterns
- **Gotchas:** Critical things to avoid or remember
- **Ready Files:** What needs to be modified next

## Integration with Development Workflow

This command works with `/step-complete` to maintain development continuity:
- `/step-complete` creates handoff briefs and documentation
- `/prime` consumes them for fresh session context loading
- Result: No time wasted on project rediscovery

## Expected Output Format

```
🎮 ONLINE GAME SERVER - Development Context Loaded

📊 Current State:
- [Summary from CLAUDE.md handoff brief]

🎯 Next Step: [X.X - Title]  
- [Specific objectives from handoff brief]

⚡ Quick Test:
npm run dev
[Specific verification steps from CLAUDE.md]

⚠️ Critical Notes:
- [Key gotchas and shortcuts from development]

📁 Ready to Modify:
- [Files that need changes for next step]

🔍 Latest Step Completed: [X.X - Title]
- [Key accomplishments from step documentation]
```

*Section headers now exactly match what `/step-complete` creates in CLAUDE.md*

This ensures fresh Claude sessions get full development context immediately rather than starting from project exploration.
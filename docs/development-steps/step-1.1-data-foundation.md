# Step 1.1: Data Foundation

**Date Completed:** 2025-08-10  
**Branch:** `feature/data-foundation` → `main`  
**Status:** ✅ Complete  

## Overview

Successfully replaced the starter template's Todo model with a comprehensive game server data foundation. Implemented User, Game, and Match models with proper authorization and GraphQL schema configuration.

## What Was Accomplished

### 🎯 Core Objectives
- ✅ Replaced Todo model with game server data models
- ✅ Created User model with ratings and statistics
- ✅ Created Game model for extensible game definitions
- ✅ Created Match model for game sessions
- ✅ Updated authorization from API key to Cognito User Pool
- ✅ Verified data creation works end-to-end

### 📊 Models Implemented

**User Model:**
```typescript
{
  email: AWSEmail (required)
  username: String (required) 
  ratings: JSON // { "tic-tac-toe": 1200, "draw-a-card": 1200 }
  gamesPlayed: JSON // { "tic-tac-toe": 5, "draw-a-card": 10 }
  gamesWon: JSON // { "tic-tac-toe": 3, "draw-a-card": 4 }
}
```

**Game Model:**
```typescript
{
  name: String (required) // "tic-tac-toe", "draw-a-card"
  displayName: String (required) // "Tic Tac Toe", "Draw a Card"
  rules: JSON (required) // Game-specific rules and configuration
  minPlayers: Integer (required)
  maxPlayers: Integer (required)
  isActive: Boolean (default: true)
}
```

**Match Model:**
```typescript
{
  gameType: String (required) // References Game.name
  players: [String] (required) // Array of user IDs
  status: Enum // ["WAITING", "IN_PROGRESS", "COMPLETED", "ABANDONED"]
  currentPlayer: String // User ID of current player
  gameState: JSON // Current game state (game-specific)
  winner: String // User ID of winner, null if draw
  ratingChanges: JSON // { userId: ratingChange } after completion
  completedAt: DateTime
}
```

## Issues Encountered & Solutions

### 1. Data Not Saving to DynamoDB
**Problem:** Created users and games through UI but DynamoDB tables remained empty.

**Root Cause:** Configuration mismatch between frontend and backend
- Frontend was using outdated `amplify_outputs.json` with Todo schema
- Authorization configuration was out of sync

**Solution:**
```bash
npx ampx generate outputs --app-id d1ysod570k7trh --branch main --profile <profile>
```

### 2. GraphQL Validation Errors
**Problem:** 
```
"Variable 'rules' has an invalid value."
```

**Root Cause:** AWSJSON fields require stringified JSON, not JavaScript objects

**Solution:**
```typescript
// ❌ Wrong
rules: { description: "Basic game rules" }

// ✅ Correct  
rules: JSON.stringify({ description: "Basic game rules" })
```

### 3. Authorization Field Errors
**Problem:**
```
Field 'owner' in type 'User' is undefined @ 'listUsers/items/owner'
```

**Root Cause:** Complex authorization rules with owner fields weren't working properly

**Solution:** Simplified to `allow.authenticated()` for all operations:
```typescript
.authorization((allow) => [allow.authenticated()])
```

## Lessons Learned

### 🔧 Technical Insights

1. **AWSJSON Field Handling:**
   - Always use `JSON.stringify()` for JSON fields in GraphQL mutations
   - Parse with `JSON.parse()` when reading JSON fields
   - Consider creating utility functions for JSON field handling

2. **Configuration Sync:**
   - Local `amplify_outputs.json` must match deployed backend schema
   - Regenerate after any schema or authorization changes
   - Use `npx ampx generate outputs` with correct app-id and profile

3. **Authorization Patterns:**
   - Start simple with `allow.authenticated()` for MVP
   - Complex owner-based rules require careful field mapping
   - Test authorization changes locally before deploying

4. **Debugging Strategy:**
   - Add console.log to GraphQL mutations for debugging
   - Check browser Network tab for GraphQL errors
   - Use try/catch blocks around async operations

### 🚀 Development Workflow Validation

1. **Micro-deployment approach works well:**
   - Small, focused changes are easier to debug
   - Quick feedback loop between local and production testing
   - Clear commit history for troubleshooting

2. **Feature branch workflow:**
   - Clean separation of experimental changes
   - Easy rollback if issues arise
   - Good practice even for solo development

## Technical Decisions Made

### Authorization Strategy
**Decision:** Use simplified `allow.authenticated()` for all models  
**Reasoning:** 
- MVP requires basic access control
- Complex owner-based rules added unnecessary complexity
- Can be refined in later phases

**Future Consideration:** Implement more granular permissions in Phase 2

### Data Modeling Approach  
**Decision:** Use JSON fields for flexible data (ratings, game rules)  
**Reasoning:**
- Allows easy extension for new games
- No schema changes required for new game types
- Trade-off: Less type safety for more flexibility

### Frontend Architecture
**Decision:** Direct GraphQL client usage with manual error handling  
**Reasoning:**
- Direct control over mutations and queries
- Easy debugging with console logging  
- Suitable for learning and development phase

## Files Modified

```
amplify/data/resource.ts - Schema definition with new models
src/App.tsx - Test UI for new data models  
amplify_outputs.json - Generated configuration (not committed)
```

## Debugging Techniques Used

1. **Console Logging Pattern:**
   ```typescript
   async function createGame() {
     console.log("Creating game with:", { name, displayName });
     try {
       const result = await client.models.Game.create({...});
       console.log("Game created successfully:", result);
     } catch (error) {
       console.error("Error creating game:", error);
     }
   }
   ```

2. **GraphQL Error Analysis:**
   - Check `result.errors` array for validation issues
   - Look for field validation messages
   - Verify data types match schema expectations

3. **Configuration Validation:**
   - Compare local vs deployed authorization rules
   - Verify model introspection matches expectations
   - Test both local and production environments

## Next Step Prerequisites

### For Step 1.2: Authentication Integration

1. **Current State:** Basic User model with manual creation
2. **Required:** Automatic user profile creation on registration  
3. **Dependencies:** Working GraphQL mutations (✅ Complete)
4. **Technical Debt:** None blocking - authorization can be refined later

### Preparation Items
- [ ] Review Amplify Auth integration patterns
- [ ] Plan user onboarding flow
- [ ] Design initial rating assignment strategy

## Commands for Future Reference

```bash
# Regenerate amplify configuration
npx ampx generate outputs --app-id d1ysod570k7trh --branch main --profile <profile>

# Test JSON serialization in console
console.log(JSON.stringify({ "tic-tac-toe": 1200 }))

# Check GraphQL errors in mutations
result.errors?.forEach(error => console.error(error.message))
```

## Success Metrics

- ✅ DynamoDB tables populate with real data
- ✅ GraphQL mutations execute without errors  
- ✅ Local and production environments synchronized
- ✅ User and Game creation working end-to-end
- ✅ Foundation ready for next development step

---

**Total Development Time:** ~2 hours  
**Main Complexity:** Configuration sync and JSON field handling  
**Confidence Level:** High - solid foundation for Phase 1 continuation
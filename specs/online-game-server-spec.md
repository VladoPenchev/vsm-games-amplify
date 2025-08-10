# Online Game Server Specification

## Overview
- **Purpose**: A multiplayer online gaming platform where users can play games against each other or AI opponents, with competitive ratings and easy extensibility for new games
- **Target Users**: Competitive players with casual-friendly experience
- **Problem Statement**: Provide a scalable, learning-focused platform for implementing and playing multiple games with proper rating systems

## Requirements

### Functional Requirements

1. **User Management**
   - User registration and authentication via email (using existing Amplify Auth)
   - User profiles with game-specific ratings
   - User activity tracking and statistics

2. **Game Framework**
   - Extensible architecture allowing easy addition of new games
   - Generic game state management
   - Game-specific rule engines
   - Turn-based game flow management

3. **Initial Games Implementation**
   - **Tic-Tac-Toe**: 3x3 grid, standard rules, strategic gameplay
   - **Draw-a-Card**: Simple luck-based game where highest card wins (using standard 52-card deck)

4. **Game Modes**
   - Player vs Player (PvP) matches
   - Player vs AI matches with configurable difficulty
   - Matchmaking system for PvP games

5. **Rating System**
   - ELO-based rating system per game
   - Initial rating: 1200 for all users
   - Rating updates after each completed match
   - Rating history tracking

6. **Real-time Gameplay**
   - Live game state synchronization
   - Turn notifications
   - Real-time move validation
   - Game completion handling

7. **Match Management**
   - Match creation and joining
   - Game state persistence
   - Match history and results
   - Abandoned game handling

### Non-Functional Requirements

- **Performance**: Support 10s-100s concurrent users initially, designed for easy horizontal scaling
- **Scalability**: Architecture must support scaling to thousands of users without major rewrites
- **Security**: Secure user authentication, move validation, and anti-cheating measures
- **Reliability**: 99% uptime target, graceful error handling, data consistency
- **Maintainability**: Clean, documented code with separation of concerns
- **Responsiveness**: Game moves should reflect within 1-2 seconds

### Technical Requirements

- **Technology Stack**: 
  - Frontend: React + TypeScript + Vite
  - Backend: AWS Amplify Gen2 + AppSync (GraphQL) + DynamoDB
  - Authentication: AWS Cognito
  - Real-time: AppSync Subscriptions
  
- **Integration Points**: 
  - AWS Amplify hosting and deployment
  - DynamoDB for data persistence
  - AppSync for API and real-time features
  
- **Data Requirements**: 
  - User profiles and ratings storage
  - Game definitions and rules
  - Active game states
  - Match history and statistics

## User Stories

- As a competitive player, I want to see my rating for each game so that I can track my improvement
- As a user, I want to play against AI opponents to practice before playing against humans
- As a player, I want to join quick matches with other players of similar skill level
- As a user, I want to see my match history and statistics for each game
- As a developer, I want to easily add new games to the platform without modifying core systems
- As a casual player, I want simple games like draw-a-card for quick entertainment
- As a strategic player, I want games like tic-tac-toe that require skill and planning

## System Architecture

### High-Level Architecture
```
React Frontend (UI/Game Interface)
    ↓ GraphQL API calls
AWS AppSync (API Gateway + Real-time subscriptions)
    ↓ Data operations
Amazon DynamoDB (Data Storage)
    ↓ Authentication
AWS Cognito (User Management)
```

### Core Components
1. **Game Engine**: Manages game rules, state transitions, and validation
2. **Match Service**: Handles matchmaking, game sessions, and results
3. **Rating Service**: Calculates and updates ELO ratings
4. **User Service**: Manages user profiles and statistics
5. **AI Service**: Provides computer opponents with configurable difficulty

## Data Model

### Users Table
```
{
  id: string (primary key)
  email: string
  username: string
  createdAt: timestamp
  ratings: {
    tic-tac-toe: number (default: 1200)
    draw-a-card: number (default: 1200)
  }
  gamesPlayed: {
    tic-tac-toe: number
    draw-a-card: number
  }
  gamesWon: {
    tic-tac-toe: number
    draw-a-card: number
  }
}
```

### Games Table
```
{
  id: string (primary key)
  name: string
  displayName: string
  rules: object
  minPlayers: number
  maxPlayers: number
  isActive: boolean
}
```

### Matches Table
```
{
  id: string (primary key)
  gameType: string
  players: string[] (user IDs)
  status: enum (waiting, in_progress, completed, abandoned)
  currentPlayer: string (user ID)
  gameState: object (game-specific state)
  winner: string (user ID, null if draw)
  createdAt: timestamp
  updatedAt: timestamp
  completedAt: timestamp
  ratingChanges: object
}
```

### GameStates Table
```
{
  matchId: string (primary key)
  gameType: string
  state: object (game-specific state)
  moveHistory: array
  lastMoveAt: timestamp
}
```

## API Specifications

### GraphQL Schema (Core Types)

```graphql
type User @model @auth(rules: [{allow: owner}]) {
  id: ID!
  email: AWSEmail!
  username: String!
  ratings: AWSJSON
  gamesPlayed: AWSJSON
  gamesWon: AWSJSON
  matches: [Match] @hasMany
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type Game @model @auth(rules: [{allow: public, operations: [read]}]) {
  id: ID!
  name: String!
  displayName: String!
  rules: AWSJSON!
  minPlayers: Int!
  maxPlayers: Int!
  isActive: Boolean!
  matches: [Match] @hasMany
}

type Match @model @auth(rules: [{allow: owner}, {allow: private}]) {
  id: ID!
  gameType: String!
  players: [String!]!
  status: MatchStatus!
  currentPlayer: String
  gameState: AWSJSON
  winner: String
  ratingChanges: AWSJSON
  game: Game @belongsTo
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  completedAt: AWSDateTime
}

enum MatchStatus {
  WAITING
  IN_PROGRESS
  COMPLETED
  ABANDONED
}
```

### Key Mutations
```graphql
createMatch(gameType: String!, isVsAI: Boolean): Match
joinMatch(matchId: ID!): Match
makeMove(matchId: ID!, move: AWSJSON!): Match
abandonMatch(matchId: ID!): Match
```

### Key Subscriptions
```graphql
onMatchUpdate(matchId: ID!): Match
onMatchMove(matchId: ID!): Match
```

## User Interface Requirements

### Core Screens
1. **Login/Register**: Email-based authentication
2. **Dashboard**: Game selection, user stats, recent matches
3. **Game Lobby**: Available games, create/join matches
4. **Game Board**: Interactive game interface (game-specific)
5. **Match Results**: Results, rating changes, match statistics
6. **Profile**: User statistics, rating history, match history

### Game-Specific UI
- **Tic-Tac-Toe**: 3x3 interactive grid, turn indicators, win highlighting
- **Draw-a-Card**: Card display, draw button, result comparison

### Responsive Design
- Mobile-first approach
- Touch-friendly game interfaces
- Tablet and desktop optimization

## Testing Requirements

### Unit Testing
- Game rule engines (move validation, win conditions)
- Rating calculation algorithms
- Component rendering and interactions
- API resolver functions

### Integration Testing
- Complete game flows (create, play, complete)
- Real-time subscription functionality
- Authentication and authorization
- Database operations and data consistency

### User Acceptance Testing
- Complete user journeys for both games
- Multiplayer game sessions
- Rating system accuracy
- Cross-browser compatibility
- Mobile device testing

## Deployment Requirements

### Environment
- AWS Amplify Gen2 hosting
- Automatic deployments from main branch
- Environment-specific configurations (dev, staging, prod)

### Dependencies
- Node.js 18+
- AWS CLI configured
- Amplify CLI
- All npm packages from package.json

### Configuration
- AWS Amplify backend configuration
- Environment variables for API endpoints
- DynamoDB table configurations
- AppSync API configuration

## Development Workflow

### Git Strategy
- **Main branch**: Always deployable, production-ready code
- **Feature branches**: Short-lived branches for each increment (e.g., `feature/user-models`, `feature/tic-tac-toe-logic`)
- **Pull Requests**: Even for solo development (good practice for code review)
- **Commits**: Frequent, small, focused commits with descriptive messages

### Deployment Strategy
- **Micro-deployments**: Deploy after each working feature increment
- **Auto-deployment**: Amplify automatically deploys from main branch
- **Testing cycle**: Local test → commit → deploy → production test → next feature
- **Rollback ready**: Small changes make rollbacks easier if issues arise

### Development Session Workflow
1. Create feature branch: `git checkout -b feature/specific-feature`
2. Implement small, focused feature
3. Test locally (unit tests, manual testing)
4. Run linting and type checks
5. Commit with descriptive message
6. Push branch and create PR
7. Merge to main (triggers Amplify deployment)
8. Test in production environment
9. Move to next small increment

## Timeline and Milestones

### Phase 1: Foundation (MVP) - Broken into Deployable Steps

**Step 1.1: Data Foundation** ⚡ *Deploy after this*
- Update GraphQL schema with User, Game, Match models
- Update DynamoDB table configurations
- Test schema deployment and basic queries

**Step 1.2: Authentication Integration** ⚡ *Deploy after this*
- Extend user model with game-specific fields
- Update authentication flow to populate user profiles
- Test user registration and profile creation

**Step 1.3: Game Framework** ⚡ *Deploy after this*
- Create abstract game engine interfaces
- Implement basic match creation/joining logic
- Add game state management foundation

**Step 1.4: Tic-Tac-Toe Logic** ⚡ *Deploy after this*
- Implement tic-tac-toe game rules and validation
- Add move processing and win detection
- Create game state transitions (no UI yet)

**Step 1.5: Tic-Tac-Toe UI** ⚡ *Deploy after this*
- Build interactive 3x3 game board
- Connect UI to game logic
- Add basic game flow (create game → play → results)

### Phase 2: Core Features

**Step 2.1: Draw-a-Card Game** ⚡ *Deploy after this*
- Implement draw-a-card game logic
- Add simple card-drawing UI
- Test both games working

**Step 2.2: ELO Rating System** ⚡ *Deploy after this*
- Implement ELO calculation algorithms
- Add rating updates after match completion
- Display user ratings in profile

**Step 2.3: Matchmaking** ⚡ *Deploy after this*
- Add match browsing and joining
- Implement skill-based matchmaking
- Add match status management

**Step 2.4: Real-time Updates** ⚡ *Deploy after this*
- Implement AppSync subscriptions
- Add live game state synchronization
- Test real-time multiplayer gameplay

### Phase 3: Polish & AI

**Step 3.1: AI Opponents** ⚡ *Deploy after this*
- Add basic AI for both games
- Implement difficulty selection
- Test AI vs player matches

**Step 3.2: Match History** ⚡ *Deploy after this*
- Add match history display
- Implement user statistics
- Add rating history tracking

**Step 3.3: UI/UX Polish** ⚡ *Deploy after this*
- Responsive design improvements
- Enhanced game interfaces
- Better user experience flows

### Phase 4: Scaling Preparation

**Step 4.1: Performance Optimization** ⚡ *Deploy after this*
- Database query optimization
- Frontend performance improvements
- Load testing and monitoring

**Step 4.2: Advanced Features** ⚡ *Deploy after this*
- Enhanced error handling
- Monitoring and logging
- Documentation completion

### Deployment Guidelines

**Always Deploy When:**
- Feature is complete and tested
- All existing functionality still works
- Code passes linting and type checking
- No breaking changes for current users

**Never Deploy When:**
- Work is incomplete or experimental
- Tests are failing
- Breaking changes without migration plan
- Untested code changes

## Assumptions and Constraints

### Assumptions
- Users have modern browsers with JavaScript enabled
- Reasonable internet connectivity for real-time gameplay
- Email-based authentication is sufficient for target users
- ELO rating system is appropriate for all game types
- Turn-based games are sufficient (no real-time action games)

### Constraints
- Must use existing AWS Amplify + React stack
- Initial budget-conscious approach (AWS Free Tier where possible)
- Learning-focused development (gradual improvement over speed)
- Single developer working on hobby schedule
- Must maintain extensibility for future games

## Risk Assessment

### Technical Risks
- **AppSync subscription limits**: Monitor concurrent connections
- **DynamoDB scaling**: Plan for eventual table design optimization
- **Real-time latency**: May need CloudFront or edge optimization later

### Mitigation Strategies
- Implement comprehensive error handling and fallbacks
- Use AWS monitoring and alerts for early issue detection
- Design modular architecture for easy component replacement
- Maintain detailed documentation for complex logic

## Success Criteria

### Functional Success
- Users can register, login, and manage profiles
- Both games are fully playable with proper rule enforcement
- ELO ratings update correctly after matches
- Real-time gameplay works smoothly for concurrent users
- AI opponents provide reasonable gameplay experience

### Technical Success
- System handles target user load (10s-100s concurrent)
- 99% uptime in production environment
- Game moves respond within 1-2 seconds
- No data corruption or loss in match results
- Clean, maintainable codebase ready for new game additions

### User Success
- Positive user feedback on gameplay experience
- Active user engagement (return visits, multiple games played)
- Competitive balance maintained through rating system
- Easy onboarding for new users
- Accessible on multiple device types

## Extension Points for Future Games

### Game Interface Contract
```typescript
interface GameEngine {
  initializeGame(players: string[]): GameState
  validateMove(gameState: GameState, move: Move, player: string): boolean
  makeMove(gameState: GameState, move: Move): GameState
  checkGameEnd(gameState: GameState): GameResult
  getValidMoves(gameState: GameState, player: string): Move[]
}
```

### AI Interface Contract
```typescript
interface AIOpponent {
  selectMove(gameState: GameState, difficulty: Difficulty): Move
  getDifficulties(): Difficulty[]
}
```

This specification provides a complete roadmap for building the Online Game Server as a minimal working solution that can scale and extend over time, leveraging the existing AWS Amplify infrastructure while maintaining focus on learning and gradual improvement.
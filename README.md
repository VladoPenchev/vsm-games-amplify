# Online Game Server

A multiplayer game platform built with React, AWS Amplify, and DynamoDB. Users can play games against each other or AI opponents with ELO-based rating systems.

## 🎮 Current Features

### Games Available
- **Tic Tac Toe** - Classic strategy game with win detection *(in development)*
- **Draw a Card** - Simple luck-based highest card wins *(in development)*
- *(More games planned - see Development Status)*

### User System  
- **Authentication** - Secure user registration and login via Amazon Cognito
- **User Profiles** - Individual player profiles with game statistics
- **ELO Ratings** - Competitive rating system per game type (default: 1200)
- **Match Tracking** - Framework for games played, won, and rating changes

### Technical Foundation
- **GraphQL API** - Real-time data with AWS AppSync and DynamoDB
- **Extensible Game Framework** - Easy addition of new games
- **Cloud Backend** - Scalable AWS infrastructure
- **Authentication** - Cognito User Pool integration

## 🚀 Quick Start

### Installation
```bash
npm install
npm run dev
```

### Try Current Features
1. Register/login with email
2. Create your user profile (manual for now)  
3. Create games and test data models
4. View data in DynamoDB tables

*Note: Full game functionality coming in upcoming development phases*

## 🏗️ Architecture

- **Frontend:** React + TypeScript + Vite
- **Backend:** AWS Amplify Gen2 + AppSync GraphQL
- **Database:** DynamoDB with real-time subscriptions
- **Auth:** Amazon Cognito user pools
- **Hosting:** AWS Amplify with auto-deployment

## 📊 Development Status

**Current Phase:** Phase 1 - Foundation
- [x] **Step 1.1:** Data Foundation (User/Game/Match models) ✅
- [ ] **Step 1.2:** Authentication Integration
- [ ] **Step 1.3:** Game Framework  
- [ ] **Step 1.4:** Tic-Tac-Toe Implementation
- [ ] **Step 1.5:** Basic UI

**Upcoming Phases:**
- **Phase 2:** Core Features (ELO ratings, matchmaking, real-time)
- **Phase 3:** Polish & AI (AI opponents, match history, UI/UX)  
- **Phase 4:** Scaling (performance, monitoring, advanced features)

## 🛠️ For Developers

### Project Structure
```
├── amplify/          # AWS Amplify backend configuration
├── src/              # React frontend source
├── docs/             # Development documentation  
├── specs/            # Project specifications
└── .claude/          # Claude Code commands
```

### Development Workflow
- Feature branches for each development step
- Micro-deployments after each increment
- Comprehensive documentation of lessons learned
- Test locally, then deploy to production

### Adding New Games
The system is designed for easy game extension. See `specs/online-game-server-spec.md` for the game interface contract and implementation guidelines.

## 📚 Documentation

- **Project Specs:** `specs/online-game-server-spec.md`
- **Development Steps:** `docs/development-steps/`
- **Current Context:** `CLAUDE.md` (for development handoffs)

## 🤝 Contributing

This is a learning project focusing on AWS Amplify, GraphQL, and game development patterns. The codebase prioritizes clarity and educational value.

## Commands for Development

```bash
# Regenerate configuration after schema changes
npx ampx generate outputs --app-id d1ysod570k7trh --branch main --profile [your-profile]

# Test current functionality  
npm run dev
```

---

*Last Updated: 2025-08-10 - Step 1.1 Complete*
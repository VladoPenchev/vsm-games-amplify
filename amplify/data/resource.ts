import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== GAME SERVER DATA MODELS ===============================================
Online Game Server data models for users, games, and matches.
Users have individual ratings per game type and can participate in matches.
Games define the available game types and their rules.
Matches track individual game sessions between players.
=========================================================================*/
const schema = a.schema({
  User: a
    .model({
      email: a.email().required(),
      username: a.string().required(),
      ratings: a.json(), // { "tic-tac-toe": 1200, "draw-a-card": 1200 }
      gamesPlayed: a.json(), // { "tic-tac-toe": 5, "draw-a-card": 10 }
      gamesWon: a.json(), // { "tic-tac-toe": 3, "draw-a-card": 4 }
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(["read"])
    ]),

  Game: a
    .model({
      name: a.string().required(), // "tic-tac-toe", "draw-a-card"
      displayName: a.string().required(), // "Tic Tac Toe", "Draw a Card"
      rules: a.json().required(), // Game-specific rules and configuration
      minPlayers: a.integer().required(),
      maxPlayers: a.integer().required(),
      isActive: a.boolean().default(true),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.owner().to(["create", "update", "delete"])
    ]),

  Match: a
    .model({
      gameType: a.string().required(), // References Game.name
      players: a.string().array().required(), // Array of user IDs
      status: a.enum(["WAITING", "IN_PROGRESS", "COMPLETED", "ABANDONED"]),
      currentPlayer: a.string(), // User ID of current player
      gameState: a.json(), // Current game state (game-specific)
      winner: a.string(), // User ID of winner, null if draw
      ratingChanges: a.json(), // { userId: ratingChange } after completion
      completedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read", "create"]),
      allow.owner().to(["update", "delete"])
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // Use Cognito User Pool for authenticated users
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>

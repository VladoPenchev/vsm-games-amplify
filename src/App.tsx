import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [games, setGames] = useState<Array<Schema["Game"]["type"]>>([]);
  const [users, setUsers] = useState<Array<Schema["User"]["type"]>>([]);
  const { signOut, user } = useAuthenticator();

  useEffect(() => {
    // Load games
    client.models.Game.observeQuery().subscribe({
      next: (data) => setGames([...data.items]),
    });

    // Load users  
    client.models.User.observeQuery().subscribe({
      next: (data) => setUsers([...data.items]),
    });
  }, []);

  async function createGame() {
    const name = window.prompt("Game name (e.g., tic-tac-toe)");
    const displayName = window.prompt("Display name (e.g., Tic Tac Toe)");
    if (name && displayName) {
      console.log("Creating game with:", { name, displayName });
      try {
        const result = await client.models.Game.create({
          name,
          displayName,
          rules: { description: "Basic game rules" },
          minPlayers: 2,
          maxPlayers: 2,
          isActive: true
        });
        console.log("Game created successfully:", result);
      } catch (error) {
        console.error("Error creating game:", error);
      }
    }
  }

  async function createUser() {
    const username = window.prompt("Username");
    if (username && user?.signInDetails?.loginId) {
      console.log("Creating user with:", { username, email: user.signInDetails.loginId });
      try {
        const result = await client.models.User.create({
          email: user.signInDetails.loginId,
          username,
          ratings: { "tic-tac-toe": 1200, "draw-a-card": 1200 },
          gamesPlayed: { "tic-tac-toe": 0, "draw-a-card": 0 },
          gamesWon: { "tic-tac-toe": 0, "draw-a-card": 0 }
        });
        console.log("User created successfully:", result);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  }

  return (
    <main>
      <h1>🎮 Online Game Server - Data Foundation Test</h1>
      
      <div style={{ marginBottom: "2rem" }}>
        <h2>Games</h2>
        <button onClick={createGame}>+ Create Game</button>
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <strong>{game.displayName}</strong> ({game.name}) - 
              {game.minPlayers}-{game.maxPlayers} players
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Users</h2>
        <button onClick={createUser}>+ Create User Profile</button>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.username}</strong> ({user.email}) - 
              Ratings: {JSON.stringify(user.ratings)}
            </li>
          ))}
        </ul>
      </div>

      <div>
        ✅ Step 1.1: Data Foundation - Schema deployed successfully!
        <br />
        Testing User, Game, and Match models.
      </div>
      
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;

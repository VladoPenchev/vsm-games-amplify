import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [games, setGames] = useState<Array<Schema["Game"]["type"]>>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<Schema["User"]["type"] | null>(null);
  const { signOut, user } = useAuthenticator();

  useEffect(() => {
    // Load games
    client.models.Game.observeQuery().subscribe({
      next: (data) => setGames([...data.items]),
    });
  }, []);

  useEffect(() => {
    // Auto-create profile on first login
    const loginId = user?.signInDetails?.loginId;
    if (loginId) {
      client.models.User.list({
        filter: { email: { eq: loginId } }
      }).then(async (result) => {
        if (result.data.length > 0) {
          // Profile exists, load it
          setCurrentUserProfile(result.data[0]);
        } else {
          // No profile exists, create one automatically
          console.log("No profile found, creating one automatically...");
          try {
            const newProfile = await client.models.User.create({
              email: loginId,
              username: loginId.split('@')[0],
              ratings: JSON.stringify({
                "tic-tac-toe": 1200,
                "draw-a-card": 1200
              }),
              gamesPlayed: JSON.stringify({
                "tic-tac-toe": 0,
                "draw-a-card": 0
              }),
              gamesWon: JSON.stringify({
                "tic-tac-toe": 0,
                "draw-a-card": 0
              })
            });
            
            if (newProfile.data) {
              setCurrentUserProfile(newProfile.data);
              console.log("Profile created automatically for first-time user");
            }
          } catch (error) {
            console.error("Error creating user profile:", error);
          }
        }
      }).catch((error) => {
        console.error("Error loading user profile:", error);
      });
    }
  }, [user]);

  async function createGame() {
    const name = window.prompt("Game name (e.g., tic-tac-toe)");
    const displayName = window.prompt("Display name (e.g., Tic Tac Toe)");
    if (name && displayName) {
      console.log("Creating game with:", { name, displayName });
      try {
        const result = await client.models.Game.create({
          name,
          displayName,
          rules: JSON.stringify({ description: "Basic game rules" }),
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



  return (
    <main>
      <h1>🎮 Online Game Server - Authentication Integration</h1>
      
      <div style={{ marginBottom: "2rem" }}>
        <h2>Your Profile</h2>
        {currentUserProfile ? (
          <div style={{ backgroundColor: "#f0f8ff", padding: "1rem", borderRadius: "8px" }}>
            <p><strong>Username:</strong> {currentUserProfile.username}</p>
            <p><strong>Email:</strong> {currentUserProfile.email}</p>
            <p><strong>Ratings:</strong></p>
            <ul>
              {Object.entries(JSON.parse(currentUserProfile.ratings as string || "{}")).map(([game, rating]) => (
                <li key={game}>{game}: {String(rating)}</li>
              ))}
            </ul>
            <p><strong>Games Played:</strong></p>
            <ul>
              {Object.entries(JSON.parse(currentUserProfile.gamesPlayed as string || "{}")).map(([game, count]) => (
                <li key={game}>{game}: {String(count)}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div style={{ backgroundColor: "#e1f5fe", padding: "1rem", borderRadius: "8px" }}>
            <p>🎮 Setting up your profile...</p>
            <p><small>This happens automatically on your first login!</small></p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Available Games</h2>
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
        ✅ Step 1.2: Authentication Integration - Profiles created on first login!
        <br />
        🔐 Signed in as: {user?.signInDetails?.loginId}
        <br />
        🎯 Next: Implement game logic and match system
      </div>
      
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;

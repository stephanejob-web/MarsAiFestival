import React from "react";

const TEAM_MEMBERS: string[] = ["Mickaël", "Valérie", "Jean-Deny", "Dylan", "Stéphane"];

const Home = (): React.JSX.Element => {
    return (
        <main>
            <h1>Bienvenue sur MarsAiFestival</h1>
            <p>Bon courage à toute l&apos;équipe !</p>
            <ul>
                {TEAM_MEMBERS.map((name) => (
                    <li key={name}>{name}</li>
                ))}
            </ul>
        </main>
    );
};

export default Home;

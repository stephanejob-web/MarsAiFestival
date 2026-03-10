import React from "react";
import { Link } from "react-router-dom";

const Formulaire = (): React.JSX.Element => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-900 to-zinc-900 text-white">
            <div className="max-w-2xl p-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Formulaire</h1>
                <p className="mb-6">
                    Bonjour Valérie — cette page est dédiée au développement du formulaire.
                </p>
                <Link to="/" className="text-sm underline">
                    Retour à l'accueil
                </Link>
            </div>
        </main>
    );
};

export default Formulaire;

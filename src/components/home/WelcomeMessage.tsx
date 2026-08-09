/**
 * Message de bienvenue — en-tête personnalisé de l'accueil
 */

import { mockUserProfile } from "@/lib/mock-data";

export function WelcomeMessage() {
  const { name } = mockUserProfile;
  const firstName = name.split(" ")[0];

  /* Salutation dynamique selon l'heure */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-mediterranean">{greeting},</p>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        {firstName} 👋
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Voici un aperçu de votre activité
      </p>
    </div>
  );
}

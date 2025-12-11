"use client";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function BuildProfilePage() {
  const router = useRouter();
  const { buildId } = router.query; 

  const [buildData, setBuildData] = useState(null);

  useEffect(() => {
    if (buildId) {
      // 1. Appel à votre API ou Base de Données pour charger les détails du Build
      fetch(`/api/builds/${buildId}`) 
        .then(res => res.json())
        .then(data => setBuildData(data));
    }
  }, [buildId]);

  if (!buildData) {
    return <div>Chargement du Build...</div>;
  }
  
  // Affiche le contenu spécifique au profil du build chargé
  return (
    <div>
      <h1>Build ID: {buildId}</h1>
      {/* ... Votre contenu de profil ... */}
    </div>
  );
}
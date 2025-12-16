import { BANNER_PATH, CHARACTER_PATH, CLASS_PATH } from "@/constants/paths";
import Image from "next/image";

type ClassImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export const ClassImage = ({
  src,
  alt,
  width = 1000,
  height = 1000,
  className = "",
  priority = true,
}: ClassImageProps) => {
  // Déterminer le chemin en fonction du préfixe du fichier
  let imagePath = src;
  
  if (src.startsWith("IC_")) {
    // Icône de classe
    imagePath = `${CLASS_PATH}${src}`;
  } else if (src.startsWith("BA_")) {
    // Bannière
    imagePath = `${BANNER_PATH}${src}`;
  } else if (src.startsWith("CH_")) {
    // Personnage
    imagePath = `${CHARACTER_PATH}${src}`;
  } else if (src.includes("-banner")) {
    // Ancien format de bannière (ex: "templar-banner.webp")
    const className = src.replace("-banner.webp", "").replace(".webp", "");
    imagePath = `${BANNER_PATH}BA_${className.charAt(0).toUpperCase() + className.slice(1)}.webp`;
  } else if (src.includes("-character")) {
    // Ancien format de personnage (ex: "templar-character.webp")
    const className = src.replace("-character.webp", "").replace(".webp", "");
    imagePath = `${CHARACTER_PATH}CH_${className.charAt(0).toUpperCase() + className.slice(1)}.webp`;
  } else if (src.includes("-icon")) {
    // Ancien format d'icône (ex: "templar-icon.webp")
    const className = src.replace("-icon.webp", "").replace(".webp", "");
    imagePath = `${CLASS_PATH}IC_Class_${className.charAt(0).toUpperCase() + className.slice(1)}.webp`;
  } else {
    // Par défaut, utiliser CLASS_PATH pour la rétrocompatibilité
    imagePath = `${CLASS_PATH}${src.toLowerCase()}`;
  }

  return (
    <Image
      src={imagePath}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading="eager"
    />
  );
};


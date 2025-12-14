import { CLASS_PATH } from "@/constants/paths";
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
  return (
    <Image
      src={`${CLASS_PATH}${src.toLowerCase()}`}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading="eager"
    />
  );
};


import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackClassName?: string;
}

export function ImageFallback({ 
  src, 
  alt, 
  className = "",
  fallbackClassName = "",
  ...props 
}: ImageFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${fallbackClassName || className}`}
      >
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
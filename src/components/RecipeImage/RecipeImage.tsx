'use client';

import { useState } from 'react';
import Image from 'next/image';

interface RecipeImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export function RecipeImage(props: RecipeImageProps) {
  // A different recipe must start with its own loading state.
  return <RecipeImageContent key={props.src} {...props} />;
}

function RecipeImageContent({
  src,
  alt,
  sizes,
  className = '',
  priority = false,
}: RecipeImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  );

  return (
    <div
      className={`recipe-loading-placeholder rounded-large aspect-square w-full ${className}`}
      data-loading={status === 'loading'}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`relative z-10 object-cover transition-[opacity,transform,scale] duration-300 hover:scale-110 motion-reduce:transition-none ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
}

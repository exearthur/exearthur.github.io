import type { ImageAsset } from '../data/images';

interface PictureProps {
  image: ImageAsset;
  /** Pass an empty string for decorative images. */
  alt: string;
  /** Class for the <picture> wrapper. */
  className?: string;
  /** Class for the <img> inside it. */
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Hide the whole picture from assistive tech. */
  hidden?: boolean;
}

/** An image served as AVIF where supported, with the original as fallback. */
export function Picture({
  image,
  alt,
  className,
  imgClassName,
  loading,
  fetchPriority,
  hidden,
}: PictureProps) {
  return (
    <picture className={className} aria-hidden={hidden || undefined}>
      {image.avif && <source srcSet={image.avif} type="image/avif" />}
      <img
        className={imgClassName}
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={loading}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}

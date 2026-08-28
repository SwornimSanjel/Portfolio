import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * The replacement for `next/image`.
 *
 * What is kept: intrinsic width/height so the browser reserves the exact box
 * and nothing shifts as images load, lazy loading below the fold, eager
 * loading plus a high fetch priority for the one image above it, and async
 * decoding so a large JPEG never blocks paint.
 *
 * What is gone: the on-the-fly AVIF/WebP re-encoding at responsive widths.
 * That ran on a server this site no longer has. The files in /public are
 * therefore served as authored — see README, "Images", for the one command
 * that re-encodes them if they grow.
 *
 * `fill` reproduces the layout behaviour the call sites rely on: the image
 * covers its nearest positioned ancestor. `sizes` is accepted and ignored —
 * without a srcset the browser ignores it too, and keeping the prop means the
 * call sites did not have to change.
 *
 * A file that fails to load is made visually empty rather than left as a
 * broken-image box. A missing screenshot once rendered its own alt text
 * sprawled in grey across a project plate, which is a worse failure than a
 * blank frame: the frame reads as "no image yet", the sprawl reads as a
 * broken site. The `alt` attribute stays on the element either way, so a
 * screen reader is told exactly what it is not seeing.
 */
export type ImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "loading"> & {
  src: string;
  alt: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
};

export function Img({
  src,
  alt,
  priority = false,
  fill = false,
  className,
  sizes: _sizes,
  onError,
  ...rest
}: ImgProps) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      className={cn(
        fill && "absolute inset-0 h-full w-full",
        failed && "text-transparent [&::-moz-broken]:opacity-0",
        className,
      )}
      {...rest}
    />
  );
}

export default Img;

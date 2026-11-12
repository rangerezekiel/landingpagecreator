import { PixelCrop } from "react-image-crop";

export default function setCanvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  maxDimension?: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Downscale the exported image so the resulting base64 stays small enough to
  // pass through the Next.js Server Action body limit (and Vercel's cap).
  const scale =
    maxDimension && crop.width > maxDimension
      ? maxDimension / crop.width
      : 1;

  canvas.width = Math.round(crop.width * scale);
  canvas.height = Math.round(crop.height * scale);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

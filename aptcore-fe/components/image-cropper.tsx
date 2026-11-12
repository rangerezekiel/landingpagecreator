/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import setCanvasPreview from "@/lib/setCanvasPreview";
import { Trash } from 'lucide-react';
import { Label } from "@/components/ui/label";

interface ImageCropperProps {
  title: string;
  ASPECT_RATIO: number;
  MIN_DIMENSION?: number;
  CIRCULAR_CROP?: boolean;
  imageDefault?: string;
  onCrop?: (base64: string) => void;
  EXPORT_IMAGE_FORMAT?: string;
  EXPORT_QUALITY?: number;
  MAX_EXPORT_DIMENSION?: number;
  isError?: string;
}

export default function ImageCropper(
  {
  title, 
  ASPECT_RATIO, 
  MIN_DIMENSION = 500, 
  CIRCULAR_CROP = false,
  imageDefault,
  onCrop,
  isError,
  EXPORT_IMAGE_FORMAT,
  EXPORT_QUALITY = 0.7,
  MAX_EXPORT_DIMENSION = 1920,
  
} : ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [imgSource, setImageSource] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [base64, setBase64] = useState<string>()
  const [isOpen, setIsOpen] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const url = reader.result?.toString() || "";
      setImageSource(url);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      { unit: "%", width: cropWidthPercent },
      ASPECT_RATIO,
      width,
      height
    );
    setCrop(centerCrop(crop, width, height));
  };

  const handleCropImage = () => {
    if (!imgRef.current || !canvasRef.current || !crop) return;

    const pixelCrop = convertToPixelCrop(
      crop,
      imgRef.current.naturalWidth,
      imgRef.current.naturalHeight  
    );

    setCanvasPreview(imgRef.current, canvasRef.current, pixelCrop, MAX_EXPORT_DIMENSION);

    const thisBase64 = canvasRef.current.toDataURL(EXPORT_IMAGE_FORMAT, EXPORT_QUALITY);
    setBase64(thisBase64)
    setIsOpen(false)
    
    if (typeof onCrop === 'function') {
      onCrop(thisBase64);
    }

  };

  const removeImage = () => {
    setBase64("")
    onCrop?.("")
  }


  const handleIsOpen = () => {
    setIsOpen(true)
    setImageSource("")
  }

  return (
    <>
      <Label className="mb-2">{title}</Label>
      <div className={`bg-zinc-100 dark:bg-zinc-800 p-5 rounded ${isError ? 'border-red-500 mb-2' : ''} border`}>
        <div className="relative w-full max-w-xs mx-auto group">
          {base64 ? (
            <div className={`overflow-hidden ${CIRCULAR_CROP ? 'aspect-square rounded-full' : 'rounded-lg'} shadow-md`}>
              <img
                src={base64}
                alt="cropper"
                className={`w-full h-full object-cover transition duration-300 ease-in-out
                  ${CIRCULAR_CROP ? 'rounded-full' : 'rounded-lg'} 
                  group-hover:blur-sm group-hover:brightness-75`}
              />
            </div>
          ) : (
            <>
              {imageDefault ? 
              (<>    
                <div onClick={handleIsOpen} className={`overflow-hidden ${CIRCULAR_CROP ? 'aspect-square rounded-full' : 'rounded-lg'} shadow-md`}>
                  <img
                    src={imageDefault}
                    alt="cropper"
                    className={`w-full h-full object-cover transition duration-300 ease-in-out
                      ${CIRCULAR_CROP ? 'rounded-full' : 'rounded-lg'} 
                      group-hover:blur-sm group-hover:brightness-75`}
                  />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button type="button" size="sm" variant="outline" onClick={handleIsOpen}>
                    Change
                  </Button>
                </div>
              </>) 
              : (<>
                <div onClick={handleIsOpen} className={`${CIRCULAR_CROP ? 'rounded-full aspect-square' : 'h-50 rounded-lg'} group relative w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors duration-300
                        dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700
                        flex items-center justify-center text-gray-400 dark:text-gray-300 text-lg font-medium`}>
                  No Image
                </div>
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none group-hover:scale-105 transition-transform duration-300 ease-out"
                />
              </>)}
            </>
          )}

          {base64 && (
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button type="button" size="sm" variant="outline" onClick={handleIsOpen}>
                Change
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={() => removeImage()}>
                <Trash className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>

          <DialogContent className="sm:max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Update {title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

              {imgSource ? (
                <>
                  <div className="overflow-y-auto overflow-x-hidden max-h-[65vh] pr-1">
                    <div className="w-full">
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        circularCrop={CIRCULAR_CROP}
                        keepSelection
                        aspect={ASPECT_RATIO}
                        minWidth={MIN_DIMENSION}
                        className="w-full"
                      >
                        <img
                          ref={imgRef}
                          src={imgSource}
                          alt="Preview"
                          onLoad={onImageLoad}
                          className="w-full h-auto object-contain"
                        />
                      </ReactCrop>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleCropImage}>
                      Crop Image
                    </Button>
                  </div>

                  <canvas
                    ref={canvasRef}
                    className="hidden"
                    width={150}
                    height={150}
                  />
                </>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      handleFile(file);
                    }
                    setIsDragActive(false);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragActive(true);
                  }}
                  onDragLeave={() => setIsDragActive(false)}
                  className={`group h-50 relative w-full ${CIRCULAR_CROP ? 'aspect-square' : ''} cursor-pointer rounded-lg border-2 border-dashed
                    ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800'}
                    hover:bg-gray-100 transition-colors duration-300
                    flex items-center justify-center text-gray-400 dark:text-gray-300 text-lg font-medium`}
                >
                  <span className="z-10 transition-transform duration-300 group-hover:scale-105">
                    {isDragActive ? 'Drop the image here' : 'Choose or Drop Image'}
                  </span>

                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  <div className="absolute inset-0 rounded-lg pointer-events-none group-hover:scale-105 transition-transform duration-300 ease-out" />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

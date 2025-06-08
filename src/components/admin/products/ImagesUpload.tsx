// components/MultiImageUpload.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export const ImagesUpload = ({
  productId,
  variantId,
  currentImageUrls = [],
  onImagesUpdated,
}: {
  productId: string | undefined;
  variantId?: string;
  currentImageUrls?: string[];
  onImagesUpdated: (urls: string[]) => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(currentImageUrls);

  // Keep parent form in sync with our state
  useEffect(() => {
    if (JSON.stringify(imageUrls) !== JSON.stringify(currentImageUrls)) {
      onImagesUpdated(imageUrls);
    }
  }, [imageUrls, currentImageUrls, onImagesUpdated]);

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const supabase = createClient();

      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${productId}${
        variantId ? `-${variantId}` : ""
      }-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath);

      // Add to our array of image URLs
      setImageUrls((prev) => [...prev, publicUrl]);

      toast.success("Image uploaded successfully");
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Fel inträffades under bilduppladdning"
      );
    } finally {
      setIsUploading(false);
      // Clear the input to allow uploading the same file again
      e.target.value = "";
    }
  }
  const handleRemoveImage = async (indexToRemove: number) => {
    try {
      const urlToRemove = imageUrls[indexToRemove];

      // Update UI immediately
      setImageUrls((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );

      // Extract filename from URL
      // URL format: https://vjdwbbvnndfbqrrscbmk.supabase.co/storage/v1/object/public/product-images/filename.jpg
      const urlParts = urlToRemove.split("/");
      const fileName = urlParts[urlParts.length - 1];

      console.log("fileName: ", fileName);

      // Only attempt to delete if it's a real file (not a placeholder)
      if (fileName && !urlToRemove.includes("placeholder")) {
        const supabase = createClient();
        const { error } = await supabase.storage
          .from("product-images")
          .remove([fileName]);

        if (error) {
          console.error("Error deleting file:", error);
          toast.error("Couldn't remove image from storage");
        } else {
          toast.success("Image removed");
        }
      }
    } catch (error: unknown) {
      console.error("Error removing image:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Gallery */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <div className="aspect-square w-full relative overflow-hidden rounded-md border">
                <Image
                  src={url}
                  alt={`Product variant image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 rounded-full h-6 w-6"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Section */}
      <div className="flex flex-col items-center justify-center border border-dashed rounded-md p-4 text-muted-foreground">
        <Upload className="h-8 w-8 mb-2" />
        <p className="mb-2 text-sm">Add another image</p>
        <div className="mt-2">
          <Input
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={uploadFile}
            className="cursor-pointer"
          />
        </div>
        {isUploading && (
          <div className="flex items-center justify-center p-2 mt-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Uploading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export const useImageUpload = () => {
  const uploadImages = useCallback(async (files, userId) => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(`public/${fileName}`, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
        throw new Error(`Failed to upload ${file.name}`);
      }

      const { data } = await supabase.storage
        .from("post-images")
        .getPublicUrl(`public/${fileName}`);

      return data.publicUrl;
    });

    return Promise.all(uploadPromises);
  }, []);

  return { uploadImages };
};

"use client";

import { useState, useEffect } from "react";

export const useImagePreviews = (imageFiles) => {
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (imageFiles?.length > 0) {
      const previewUrls = imageFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previewUrls);

      return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setImagePreviews([]);
    }
  }, [imageFiles]);

  return imagePreviews;
};

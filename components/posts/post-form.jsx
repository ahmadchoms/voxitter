import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Progress } from "@/components/ui/progress";
import { MAX_FILE_SIZE, MAX_IMAGES, STEPS } from "@/lib/constants/post";
import { useCategories } from "@/hooks/use-categories";
import { useImageUpload } from "@/hooks/use-image-upload";
import { postFormSchema } from "@/lib/validation/post";
import { POST_FORM_DEFAULTS } from "@/lib/constants/form";
import { useImagePreviews } from "@/hooks/use-image-preview";
import { ImageUploadStep } from "./post-form/steps/image-upload-step";
import { ContentStep } from "./post-form/steps/content-step";
import { PreviewStep } from "./post-form/steps/preview-step";
import { NavigationButtons } from "./post-form/navigation-button";

export function PostForm({ onClose }) {
    const { data: session } = useSession();
    const [step, setStep] = useState(STEPS.IMAGES);
    const { categories, loading: categoriesLoading } = useCategories();
    const { uploadImages } = useImageUpload();

    const form = useForm({
        resolver: zodResolver(postFormSchema),
        defaultValues: POST_FORM_DEFAULTS,
    });

    const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } = form;
    const [imageFiles, content, categoryIds] = watch(["image_files", "content", "category_ids"]);
    const imagePreviews = useImagePreviews(imageFiles);

    const [aiCategoriesLoading, setAiCategoriesLoading] = useState(false);
    const [aiCategoriesError, setAiCategoriesError] = useState(null);

    const generateCategoriesWithAI = useCallback(async () => {
        if (content.trim().length === 0 || categoriesLoading) {
            setValue("category_ids", []);
            return;
        }

        setAiCategoriesLoading(true);
        setAiCategoriesError(null);
        try {
            const response = await fetch('/api/ai/post/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to auto-generate categories');
            }
            const suggestedCategoryIds = await response.json();
            setValue("category_ids", suggestedCategoryIds);
            toast.success("Kategori otomatis terdeteksi!");
        } catch (error) {
            console.error("Error auto-generating categories:", error);
            setAiCategoriesError(error.message);
            setValue("category_ids", []);
            toast.error(`Gagal mendeteksi kategori: ${error.message}`);
        } finally {
            setAiCategoriesLoading(false);
        }
    }, [content, categoriesLoading, setValue]);

    const handleImageUpload = useCallback((e) => {
        const files = Array.from(e.target.files || []);
        const currentFileCount = imageFiles?.length || 0;

        if (files.length + currentFileCount > MAX_IMAGES) {
            toast.error(`Maksimum ${MAX_IMAGES} gambar diperbolehkan`);
            return;
        }

        const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error(`Beberapa file melebihi ${MAX_FILE_SIZE}MB`);
            return;
        }

        setValue("image_files", [...(imageFiles || []), ...files]);
    }, [imageFiles, setValue]);

    const removeImage = useCallback((index) => {
        const newFiles = (imageFiles || []).filter((_, i) => i !== index);
        setValue("image_files", newFiles);
    }, [imageFiles, setValue]);

    const onSubmit = async (data) => {
        try {
            const userId = session?.user?.id;
            if (!userId) {
                toast.error("User not authenticated. Please log in.");
                return;
            }

            if (content.trim().length > 0 && (!categoryIds || categoryIds.length === 0)) {
                await generateCategoriesWithAI();
                if (!form.getValues('category_ids') || form.getValues('category_ids').length === 0) {
                    toast.error("Kategori belum terdeteksi. Silakan coba lagi atau sesuaikan konten.");
                    return;
                }
            }

            const imageUrls = data.image_files?.length ? await uploadImages(data.image_files, userId) : [];

            const postData = {
                user_id: userId,
                content,
                image_urls: imageUrls,
                category_ids: form.getValues('category_ids'),
            };

            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create post");
            }

            toast.success("Postingan berhasil dibuat!");
            onClose();
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error(error.message || "Gagal membuat postingan");
        }
    };

    const navigation = {
        nextStep: async () => {
            if (step === STEPS.CONTENT) {
                await generateCategoriesWithAI();
            }
            setStep((prev) => Math.min(prev + 1, STEPS.PREVIEW));
        },
        prevStep: () => setStep((prev) => Math.max(prev - 1, STEPS.IMAGES)),
        canGoNext: () => {
            switch (step) {
                case STEPS.CONTENT:
                    return content.trim().length > 0;
                default:
                    return true;
            }
        }
    };

    const renderStepComponent = useCallback(() => {
        switch (step) {
            case STEPS.IMAGES:
                return (
                    <ImageUploadStep
                        onImageUpload={handleImageUpload}
                        imagePreviews={imagePreviews}
                        imageFiles={imageFiles}
                        onRemoveImage={removeImage}
                        errors={errors}
                        isSubmitting={isSubmitting}
                    />
                );
            case STEPS.CONTENT:
                return (
                    <ContentStep
                        register={register}
                        content={content}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        aiCategoriesLoading={aiCategoriesLoading}
                        aiCategoriesError={aiCategoriesError}
                    />
                );
            case STEPS.PREVIEW:
                const selectedCategoriesForPreview = categories.filter((c) => categoryIds?.includes(c.id));
                return (
                    <PreviewStep
                        session={session}
                        content={content}
                        categories={selectedCategoriesForPreview}
                        imagePreviews={imagePreviews}
                    />
                );
            default:
                return null;
        }
    }, [
        step, handleImageUpload, imagePreviews, imageFiles, removeImage, errors, isSubmitting,
        register, content, categories, control, categoriesLoading, session, categoryIds,
        aiCategoriesLoading, aiCategoriesError
    ]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">
                    Langkah {step} dari {STEPS.PREVIEW}
                </h2>
                <Progress value={(step / STEPS.PREVIEW) * 100} className="w-1/2" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStepComponent()}
                </motion.div>
            </AnimatePresence>

            <NavigationButtons
                step={step}
                navigation={navigation}
                isSubmitting={isSubmitting}
                onClose={onClose}
            />
        </form>
    );
}
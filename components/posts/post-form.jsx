import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";
import { postSchema } from "@/lib/validation/posts";
import { Avatar } from "../ui/avatar";

export function PostForm({ onClose }) {
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: {
            image_files: [],
            content: "",
            category_ids: [],
        },
    });

    const imageFiles = watch("image_files");
    const content = watch("content");
    const categoryIds = watch("category_ids");

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("name");
            if (error) {
                toast.error("Gagal memuat kategori");
                return;
            }
            setCategories(data || []);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (imageFiles && imageFiles.length > 0) {
            const previewUrls = imageFiles.map((file) => URL.createObjectURL(file))
            setImagePreviews(previewUrls);
            return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
        } else {
            setImagePreviews([]);
        }
    }, [imageFiles]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length + (imageFiles?.length || 0) > 4) {
            toast.error("Maksimum 4 gambar diperbolehkan");
            return NextResponse;
        }
        setValue("image_files", [...(imageFiles || []), ...files]);
    };

    const removeImage = (index) => {
        const newFiles = (imageFiles || []).filter((_, i) => i !== index);
        setValue("image_files", newFiles);
    };

    const uploadImages = async (files, userId) => {
        const urls = [];
        try {
            for (const file of files) {
                const fileExt = file.name.split(".").pop();
                const fileName = `${userId}-${Date.now()}-${Math.random().toString().substring(2, 10)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from("post-images").upload(`public/${fileName}`, file);

                if (uploadError) throw new Error("Failed to upload image");

                const { data } = await supabase.storage.from("post-images").getPublicUrl(`public/${fileName}`);
                urls.push(data.publicUrl);
            }
            return urls
        } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Failed to upload image");
        }
    };

    const onSubmit = async (data) => {
        try {
            const userId = session?.user?.id;

            if (!userId) throw new Error("User not authenticated");

            const imageUrls = data.image_files?.length
                ? await uploadImages(data.image_files, userId)
                : [];

            const postData = {
                user_id: userId,
                content: data.content,
                category_ids: data.category_ids,
                image_urls: imageUrls[0] || null,
            };

            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            })

            if (!response.ok) {
                throw new Error("Failed to create post");
            }

            toast.success("Postingan berhasil dibuat!");
            onClose();
        } catch {
            toast.error("Gagal membuat postingan");
        }
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <AnimatedSection delay={0.2}>
                        <Label className="text-gray-300">Upload Gambar (Opsional)</Label>
                        <UploadDropzone
                            onChange={handleImageUpload}
                            disabled={isSubmitting}
                        />
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                {imagePreviews.map((src, index) => (
                                    <ImagePreview
                                        key={index}
                                        src={src}
                                        onRemove={() => removeImage(index)}
                                        fileName={imageFiles?.[index]?.name}
                                        fileSize={
                                            imageFiles?.[index]
                                                ? (imageFiles[index].size / 1024 / 1024).toFixed(2)
                                                : ""
                                        }
                                        disabled={isSubmitting}
                                    />
                                ))}
                            </div>
                        )}
                        <HelperText error={errors.image_files?.message} />
                    </AnimatedSection>
                );
            case 2:
                return (
                    <AnimatedSection delay={0.2}>
                        <Label htmlFor="content" className="text-gray-300">
                            Konten *
                        </Label>
                        <Textarea
                            id="content"
                            {...register("content")}
                            placeholder="Apa yang sedang Anda pikirkan?"
                            className="bg-gray-900 border-gray-700 max-w-md text-white placeholder:text-gray-500 focus:border-blue-500 min-h-[100px] whitespace-normal"
                            disabled={isSubmitting}
                            wrap="soft"
                        />
                        <HelperText
                            error={errors.content?.message}
                            note={`${content.length}/1000 karakter`}
                        />
                    </AnimatedSection>
                );
            case 3:
                return (
                    <AnimatedSection delay={0.2}>
                        <Label className="text-gray-300">Kategori *</Label>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center gap-2">
                                    <Controller
                                        name="category_ids"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value.includes(cat.id)}
                                                onCheckedChange={(checked) => {
                                                    const newValue = checked
                                                        ? [...field.value, cat.id]
                                                        : field.value.filter((id) => id !== cat.id);
                                                    field.onChange(newValue);
                                                }}
                                                disabled={isSubmitting}
                                            />
                                        )}
                                    />
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                        <span className="text-white">{cat.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <HelperText error={errors.category_ids?.message} />
                    </AnimatedSection>
                );
            case 4:
                return (
                    <AnimatedSection delay={0.2}>
                        <Label className="text-gray-300">Preview Postingan</Label>
                        <PostPreview
                            name={session?.user?.name}
                            avatar={session?.user?.image}
                            content={content}
                            categories={categories.filter((c) => categoryIds.includes(c.id))}
                            images={imagePreviews}
                        />
                    </AnimatedSection>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">
                    Langkah {step} dari 4
                </h2>
                <Progress value={(step / 4) * 100} className="w-1/2" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>

            <AnimatedSection delay={0.4} className="flex gap-3 pt-4">
                {step > 1 && (
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 text-gray-300 border-gray-700"
                        onClick={prevStep}
                        disabled={isSubmitting}
                    >
                        Kembali
                    </Button>
                )}
                {step < 4 ? (
                    <Button
                        type="button"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        onClick={nextStep}
                        disabled={isSubmitting}
                    >
                        Lanjut
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Memposting...
                            </div>
                        ) : (
                            "Posting"
                        )}
                    </Button>
                )}
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 text-gray-300 border-gray-700"
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    Batal
                </Button>
            </AnimatedSection>
        </form>
    );
}

function AnimatedSection({ children, delay = 0, className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            className={className + " space-y-2"}
        >
            {children}
        </motion.div>
    );
}

function HelperText({ error, note }) {
    return (
        <>
            {note && <p className="text-xs text-gray-500">{note}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </>
    );
}

function UploadDropzone({ onChange, disabled }) {
    return (
        <label htmlFor="image-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    multiple
                    onChange={onChange}
                    className="hidden"
                    disabled={disabled}
                />
                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <p className="text-sm text-gray-400">
                        Klik untuk upload hingga 4 gambar
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                </div>
            </div>
        </label>
    );
}

function ImagePreview({ src, onRemove, fileName, fileSize, disabled }) {
    return (
        <div className="relative">
            <img
                src={src}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
            />
            <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={onRemove}
                className="absolute top-2 right-2 h-6 w-6"
                disabled={disabled}
            >
                <X className="w-3 h-3" />
            </Button>
            <p className="text-xs text-green-400 mt-1">
                {fileName} ({fileSize} MB)
            </p>
        </div>
    );
}

function PostPreview({ name, avatar, content, categories, images }) {
    return (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 max-w-[29rem]">
            <Avatar className="w-8 h-8">
                <AvatarImage src={avatar || ""} alt="User" />
                <AvatarFallback className="bg-gray-700 text-white">
                    {name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
            </Avatar>
            <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-300 break-words">{content}</p>
                {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {images.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                            />
                        ))}
                    </div>
                )}
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <Badge
                            key={cat.id}
                            variant="secondary"
                            className="text-xs"
                            style={{ backgroundColor: cat.color }}
                        >
                            {cat.name}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { AnimatedSection } from "@/components/fragments/animated-section";
import { HelperText } from "@/components/fragments/helper-text";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTENT_MAX_LENGTH } from "@/lib/constants/post";
import { Loader2 } from "lucide-react";

export function ContentStep({ register, content, errors, isSubmitting, aiCategoriesLoading, aiCategoriesError }) {
    return (
        <AnimatedSection delay={0.2}>
            <Label htmlFor="content" className="text-gray-300">
                Konten *
            </Label>
            <Textarea
                id="content"
                {...register("content")}
                placeholder="Apa yang sedang Anda pikirkan?"
                className="bg-gray-900 border-gray-700 max-w-md text-white placeholder:text-gray-500 focus:border-blue-500 min-h-[100px]"
                disabled={isSubmitting || aiCategoriesLoading}
                maxLength={CONTENT_MAX_LENGTH}
            />
            <HelperText
                error={errors.content?.message}
                note={`${content.length}/${CONTENT_MAX_LENGTH} karakter`}
            />

            {aiCategoriesLoading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyiapkan preview postingan...</span>
                </div>
            )}
            {aiCategoriesError && (
                <HelperText error={`Gagal mendeteksi kategori: ${aiCategoriesError}`} className="mt-2" />
            )}
        </AnimatedSection>
    );
}
import { AnimatedSection } from "@/components/fragments/animated-section";
import { Label } from "@/components/ui/label";
import { PostPreview } from "../post-preview";

export function PreviewStep({ session, content, categories, imagePreviews }) {
    return (
        <AnimatedSection delay={0.2}>
            <Label className="text-gray-300">Preview Postingan</Label>
            <PostPreview
                user={session?.user}
                avatar={session?.user?.image}
                content={content}
                categories={categories}
                images={imagePreviews}
            />
        </AnimatedSection>
    );
}
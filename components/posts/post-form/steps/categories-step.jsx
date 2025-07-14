import { Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatedSection } from "@/components/fragments/animated-section";
import { HelperText } from "@/components/fragments/helper-text";

function CategoryItem({ category, control, isSubmitting }) {
    return (
        <div className="flex items-center gap-2">
            <Controller
                name="category_ids"
                control={control}
                render={({ field }) => (
                    <Checkbox
                        checked={field.value.includes(category.id)}
                        onCheckedChange={(checked) => {
                            const newValue = checked
                                ? [...field.value, category.id]
                                : field.value.filter((id) => id !== category.id);
                            field.onChange(newValue);
                        }}
                        disabled={isSubmitting}
                    />
                )}
            />
            <div className="flex items-center gap-2">
                <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                />
                <span className="text-white">{category.name}</span>
            </div>
        </div>
    );
}

export function CategoriesStep({ categories, control, errors, isSubmitting, loading }) {
    if (loading) {
        return (
            <AnimatedSection delay={0.2}>
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
            </AnimatedSection>
        );
    }

    return (
        <AnimatedSection delay={0.2}>
            <Label className="text-gray-300">Kategori *</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {categories.map((category) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        control={control}
                        isSubmitting={isSubmitting}
                    />
                ))}
            </div>
            <HelperText error={errors.category_ids?.message} />
        </AnimatedSection>
    );
}
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/fragments/animated-section";
import { STEPS } from "@/lib/constants/post";

export function NavigationButtons({ step, navigation, isSubmitting, onClose }) {
    return (
        <AnimatedSection delay={0.4} className="flex gap-3 pt-4">
            {step > STEPS.IMAGES && (
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 text-gray-300 border-gray-700 hover:bg-gray-800"
                    onClick={navigation.prevStep}
                    disabled={isSubmitting}
                >
                    Kembali
                </Button>
            )}

            {step < STEPS.PREVIEW ? (
                <Button
                    type="button"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    onClick={navigation.nextStep}
                    disabled={isSubmitting || !navigation.canGoNext()}
                >
                    Lanjut
                </Button>
            ) : (
                <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
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
                className="flex-1 text-gray-300 border-gray-700 hover:bg-gray-800"
                onClick={onClose}
                disabled={isSubmitting}
            >
                Batal
            </Button>
        </AnimatedSection>
    );
}
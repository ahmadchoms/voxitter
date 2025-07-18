import { categoriesService } from "@/lib/supabase/categories";
import { model } from "./init";

export const aiService = {
  async getSuggestedCategories(content) {
    const { data: availableCategories, error: categoriesError } =
      await categoriesService.getCategories();

    if (categoriesError) {
      console.error(
        "Supabase Error fetching categories for AI:",
        categoriesError
      );
      throw new Error(
        `Failed to load categories for AI classification: ${categoriesError.message}`
      );
    }

    if (!availableCategories || availableCategories.length === 0) {
      throw new Error(
        "No categories available in the database to classify. Please add categories first."
      );
    }

    const categoryNames = availableCategories.map((cat) => cat.name).join(", ");
    const categoryMap = new Map(
      availableCategories.map((cat) => [cat.name.toLowerCase(), cat.id])
    );

    const prompt = `
      Anda adalah seorang ahli klasifikasi berita untuk media sosial di Indonesia.
      Tugas Anda adalah menganalisis konten yang diberikan dan menetapkan kategori yang paling relevan dari daftar berikut:
      ${categoryNames}.

      Pilih hingga 3 kategori yang paling relevan. Jika konten tidak cocok dengan kategori yang tersedia, Anda bisa mengindikasikan itu.
      Fokus pada topik terkini dan relevansi untuk pembaca di Indonesia.
      Berikan respons dalam format JSON Array of Strings, di mana setiap string adalah NAMA KATEGORI yang Anda pilih.
      Contoh: ["Politik", "Ekonomi"] atau ["Hiburan"] atau [].

      Konten:
      "${content}"

      Kategori yang relevan:
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log("Gemini Raw Response:", text);

    let detectedCategories = [];
    try {
      let cleanedText = text.replace(/```json\n?|```/g, "").trim();
      detectedCategories = JSON.parse(cleanedText);

      if (!Array.isArray(detectedCategories)) {
        throw new Error("Gemini did not return a valid JSON array.");
      }

      const finalCategoryIds = detectedCategories
        .map((catName) => {
          const lowerCaseCatName = catName.toLowerCase();
          return categoryMap.get(lowerCaseCatName);
        })
        .filter((id) => id !== undefined);

      return { data: finalCategoryIds, error: null };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.error("Problematic text:", text);
      throw new Error("Failed to parse AI response: " + parseError.message);
    }
  },
};

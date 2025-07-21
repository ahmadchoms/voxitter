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

  async generateTrendingTopics(count = 15) {
    const { data: availableCategories, error: categoriesError } =
      await categoriesService.getCategories();
    if (categoriesError) {
      throw new Error(
        `Failed to load categories for topic generation: ${categoriesError.message}`
      );
    }
    const categoryNames = availableCategories.map((cat) => cat.name).join(", ");

    const prompt = `
      Anda adalah seorang ahli riset berita di Indonesia yang bertugas mengidentifikasi topik-topik paling hangat dan relevan.
      Hasilkan ${count} topik berita terbaru yang sedang menjadi perbincangan utama di Indonesia.
      Setiap topik harus memiliki:
      - "title": Judul topik yang ringkas dan menarik.
      - "category": Salah satu kategori yang sangat relevan dari daftar berikut: ${categoryNames}. Pilih kategori yang paling akurat.
      - "description": Penjelasan mendalam (sekitar 3-5 kalimat) tentang topik tersebut, termasuk konteks, mengapa itu penting, dan dampaknya. Penjelasan harus komprehensif dan netral.

      Format respons Anda sebagai array JSON objek, seperti contoh ini:
      [
        {
          "title": "Judul Topik 1",
          "category": "Politik",
          "description": "Deskripsi mendalam tentang topik 1..."
        },
        {
          "title": "Judul Topik 2",
          "category": "Ekonomi",
          "description": "Deskripsi mendalam tentang topik 2..."
        }
      ]
      Pastikan untuk menghasilkan ${count} topik.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      let text = response.text();

      let cleanedText = text.replace(/```json\n?|```/g, "").trim();
      const topics = JSON.parse(cleanedText);

      if (!Array.isArray(topics) || topics.length === 0) {
        throw new Error("AI did not return a valid array of topics.");
      }

      const validCategoryNames = new Set(
        availableCategories.map((cat) => cat.name)
      );
      const validatedTopics = topics.filter((topic) =>
        validCategoryNames.has(topic.category)
      );

      if (validatedTopics.length === 0 && topics.length > 0) {
        console.warn(
          "No valid topics generated with recognized categories. Consider refining prompt or categories."
        );
      } else if (validatedTopics.length < topics.length) {
        console.warn(
          `Some generated topics were filtered due to unrecognized categories. Original: ${topics.length}, Validated: ${validatedTopics.length}`
        );
      }

      return { data: validatedTopics, error: null };
    } catch (apiError) {
      console.error("Error generating trending topics with AI:", apiError);
      throw new Error(
        "Failed to generate trending topics: " + apiError.message
      );
    }
  },
};

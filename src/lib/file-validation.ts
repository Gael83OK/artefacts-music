/**
 * Sécurité & Validation des Fichiers Téléchargés — Artefacts Music (Prompt 021)
 */

export interface FileValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export type FileCategoryLimit = "pdf" | "audio" | "html" | "image" | "office" | "autre";

const MAX_SIZES_MB: Record<FileCategoryLimit, number> = {
  pdf: 15,
  audio: 50,
  html: 5,
  image: 8,
  office: 15,
  autre: 20,
};

const ALLOWED_EXTENSIONS: Record<FileCategoryLimit, string[]> = {
  pdf: [".pdf"],
  audio: [".mp3", ".wav", ".m4a", ".aac", ".ogg"],
  html: [".html", ".htm"],
  image: [".jpg", ".jpeg", ".png", ".webp"],
  office: [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"],
  autre: [".pdf", ".mp3", ".wav", ".html", ".zip"],
};

export function validateFileUpload(
  file: File | { name: string; size?: number; type?: string },
  category: FileCategoryLimit = "autre"
): FileValidationResult {
  if (!file || !file.name) {
    return { isValid: false, errorMessage: "Fichier non fourni ou nom manquant." };
  }

  const fileName = file.name.toLowerCase();
  const allowedExts = ALLOWED_EXTENSIONS[category] || ALLOWED_EXTENSIONS.autre;

  // 1. Vérification de l'extension
  const hasValidExt = allowedExts.some((ext) => fileName.endsWith(ext));
  if (!hasValidExt) {
    return {
      isValid: false,
      errorMessage: `Extension non autorisée pour la catégorie "${category}". Extensions acceptées : ${allowedExts.join(
        ", "
      )}`,
    };
  }

  // 2. Vérification de la taille si disponible
  if ("size" in file && typeof file.size === "number" && file.size > 0) {
    const maxBytes = (MAX_SIZES_MB[category] || 20) * 1024 * 1024;
    if (file.size > maxBytes) {
      return {
        isValid: false,
        errorMessage: `La taille du fichier dépasse la limite maximale de ${MAX_SIZES_MB[category]} MB.`,
      };
    }
  }

  return { isValid: true };
}

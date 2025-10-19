import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import fs from "fs";

// Define the upload directory — use the project root `uploads` so it's predictable whether
// running from source (ts-node) or compiled (dist). Create it if missing.
// const uploadDir = path.resolve(process.cwd(), "uploads");
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }
// console.log(`Multer upload directory: ${uploadDir}`);
// // Configure Multer storage (optional: you can add filename handling)
// const storage = multer.diskStorage({
//     destination: (_req, _file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (_req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// // File filter with TypeScript-safe types
// const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
//     const allowedMimeTypes = [
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "application/vnd.ms-excel",
//     ];

//     // Accept by mimetype first, but fall back to filename extension since some clients
//     // may send a generic mimetype (e.g. application/octet-stream).
//     console.log(file)
//     const ext = path.extname(file.originalname || "").toLowerCase();
//     const allowedExts = [".xlsx", ".xls"];

//     if (allowedMimeTypes.includes(file.mimetype) || allowedExts.includes(ext)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only Excel files are allowed (.xlsx, .xls)"));
//     }
// };

// // Create the Multer instance
//  const upload1 = multer({
//     storage,
//     fileFilter,
//     limits: {
//         // 10 MB file size limit
//         fileSize: 10 * 1024 * 1024,
//     },
// });
// ✅ Multer configuration
export const upload = multer({
  dest: path.join(__dirname, "../../uploads"),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files are allowed (.xlsx, .xls)"));
    }
  },
});
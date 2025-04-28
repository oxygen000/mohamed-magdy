import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only use the basic models needed for face detection
const models = [
  {
    name: "tiny_face_detector",
    files: [
      "tiny_face_detector_model-shard1",
      "tiny_face_detector_model-weights_manifest.json",
    ],
  },
];

// Use a more reliable mirror of face-api.js models
const baseUrl =
  "https://github.com/justadudewhohacks/face-api.js/raw/a86f011d72124e5fb93e59d5c4ab98f699dd5c9c/weights";
const modelsDir = path.join(process.cwd(), "public", "models");

// Create models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Clear existing files to avoid conflicts
console.log("Cleaning models directory...");
fs.readdirSync(modelsDir).forEach((file) => {
  fs.unlinkSync(path.join(modelsDir, file));
  console.log(`Removed ${file}`);
});

// Download a file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 302 || response.statusCode === 301) {
          console.log(`Following redirect to ${response.headers.location}`);
          https
            .get(response.headers.location, (redirectResponse) => {
              redirectResponse.pipe(file);
              file.on("finish", () => {
                file.close();
                resolve();
              });
            })
            .on("error", (err) => {
              fs.unlink(filepath, () => {});
              reject(err);
            });
          return;
        }

        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

// Download all model files
async function downloadModels() {
  console.log("Downloading face-api.js models...");

  for (const model of models) {
    console.log(`\nDownloading ${model.name}...`);

    for (const file of model.files) {
      const url = `${baseUrl}/${file}`;
      const filepath = path.join(modelsDir, file);

      try {
        console.log(`Downloading ${file} from ${url}...`);
        await downloadFile(url, filepath);
        console.log(`✓ ${file} downloaded successfully`);
      } catch (error) {
        console.error(`✗ Error downloading ${file}:`, error.message);
      }
    }
  }

  console.log("\nModel download complete!");
}

downloadModels().catch(console.error);

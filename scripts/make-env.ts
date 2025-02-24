import * as fs from "fs";
import * as path from "path";

const envPath = path.join(__dirname, "../.env");
const maskedEnvPath = path.join(__dirname, "../.env.sample");

console.log(envPath);
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");

    const maskedEnv = envContent
        .split("\n")
        // .filter(line => line.trim() && !line.startsWith("#")) // Ignore empty lines and comments
        .filter(line => line.trim()) // Ignore empty lines and comments
        .map(line => {
            const [key] = line.split("="); // Extract only the key
            return `${key}=********`; // Mask the value
        })
        .join("\n");

    console.log(maskedEnv);
    fs.writeFileSync(maskedEnvPath, maskedEnv);
    console.log("✅ .env file masked successfully!");
} else {
    console.error("⚠️ .env file not found!");
}

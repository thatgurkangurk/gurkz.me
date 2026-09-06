import fs from "node:fs";
import path from "node:path";

const targetPath = "./node_modules/$app/tsconfig.json";

console.log("adding the tsconfig");

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, "{}");

// Generates a bcrypt hash for ADMIN_PASSWORD_HASH without storing the password.
// Run: npm run hash-password  (type the password when prompted; it is not echoed,
// and it is never written to any file by this script.)
import bcrypt from "bcryptjs";
import readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
process.stdout.write("Digite a senha do admin (não aparece na tela): ");
// Hide typed input
if (process.stdin.isTTY) process.stdin.setRawMode(true);
let password = "";
process.stdin.on("data", (chunk) => {
  const s = chunk.toString("utf8");
  if (s === "\n" || s === "\r") {
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdout.write("\n");
    console.log("\nCopie este hash para ADMIN_PASSWORD_HASH (nunca a senha):");
    console.log(bcrypt.hashSync(password, 10));
    process.exit(0);
  } else if (s === "\u0003") {
    process.exit(1);
  } else if (s === "\u007f") {
    password = password.slice(0, -1);
  } else {
    password += s;
  }
});
rl.on("close", () => process.exit(0));

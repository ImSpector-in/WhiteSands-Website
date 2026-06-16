const fs = require("fs");
const path = require("path");
const beautify = require("js-beautify").html;

const OUT_DIR = path.join(__dirname, "..", "out");

const OPTIONS = {
  indent_size: 2,
  indent_char: " ",
  max_preserve_newlines: 1,
  preserve_newlines: true,
  wrap_line_length: 0,
  end_with_newline: true,
};

function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith(".html")) {
      const original = fs.readFileSync(fullPath, "utf8");
      const pretty = beautify(original, OPTIONS);
      fs.writeFileSync(fullPath, pretty, "utf8");
      console.log("prettified:", path.relative(OUT_DIR, fullPath));
    }
  }
}

if (!fs.existsSync(OUT_DIR)) {
  console.error("out/ directory not found — run next build first");
  process.exit(1);
}

walkDir(OUT_DIR);
console.log("done.");

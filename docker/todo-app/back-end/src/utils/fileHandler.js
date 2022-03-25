const fs = require("fs/promises");
const { resolve } = require("path");

const readFile = async (path) => fs
  .readFile(resolve(path), { encoding: "utf-8" });
const writeFile = async (path, content="") => fs
  .writeFile(resolve(path), content.trim(), { encoding: "utf-8" });

module.exports = {
  readFile,
  writeFile
}

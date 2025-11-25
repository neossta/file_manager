const fs = require("fs");
const path = require("path");

module.exports = function (app) {
  function isFolderSync(dirPath) {
    try {
      const stats = fs.lstatSync(dirPath);
      return stats.isDirectory();
    } catch (error) {
      if (error.code === "ENOENT") {
        return false;
      }
      throw error;
    }
  }

  function getSafePath(relativePath) {
    const base = "./files/";
    relativePath = relativePath.replace(/^\//, "");
    const fullPath = path.join(base, relativePath);

    return fullPath;
  }

  app.get("/", (req, res) => {
    try {
      const base = "./files/";
      let relativePath = req.query.path || "";
      const fullPath = getSafePath(relativePath);

      if (!isFolderSync(fullPath)) {
        return res.status(404).json({
          path: relativePath,
          result: false,
          error: "Папка не найдена",
        });
      }

      let files = fs.readdirSync(fullPath).map((item) => {
        const itemPath = path.join(fullPath, item);
        const stats = fs.lstatSync(itemPath);
        const isDir = stats.isDirectory();

        return {
          name: item,
          dir: isDir,
          size: isDir ? 0 : stats.size,
        };
      });

      res.json({
        path: relativePath,
        result: true,
        files: files,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        result: false,
        error: error.message,
      });
    }
  });

  app.put("/rename", (req, res) => {
    try {
      const { oldPath, newName } = req.query;

      if (!oldPath || !newName) {
        return res.status(400).json({
          result: false,
          error: "Не передан путь либо новое имя файлы",
        });
      }

      if (
        newName.includes("/") ||
        newName.includes("\\") ||
        newName.trim() === ""
      ) {
        return res.status(400).json({
          result: false,
          error: "Имя содержит недопустимые символы",
        });
      }

      const oldFullPath = getSafePath(oldPath);
      const directory = path.dirname(oldFullPath);
      const newFullPath = path.join(directory, newName);

      // проверяем существует ли исходный файл/папка
      if (!fs.existsSync(oldFullPath)) {
        return res.status(404).json({
          result: false,
          error: "Файл не найден",
        });
      }

      // проверяем не существует ли уже файл с таким именем
      if (fs.existsSync(newFullPath)) {
        return res.status(400).json({
          result: false,
          error: "Файл с таким именем уже существует",
        });
      }

      fs.renameSync(oldFullPath, newFullPath);

      res.json({
        result: true,
        oldPath: oldPath,
        newPath: path.relative("./files/", newFullPath),
      });
    } catch (error) {
      console.error("Rename error:", error);
      res.status(500).json({
        result: false,
        error: error.message,
      });
    }
  });

  app.delete("/delete", (req, res) => {
    try {
      const { path } = req.query;

      if (!path) {
        return res.status(400).json({
          result: false,
          error: "Неправильный запрос",
        });
      }

      const fullPath = getSafePath(path);

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({
          result: false,
          error: "Файл не найден",
        });
      }

      const stats = fs.lstatSync(fullPath);
      if (stats.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(fullPath);
      }

      res.json({
        result: true,
        path: path,
      });
    } catch (error) {
      console.error("Ошибка при удалении файла:", error);
      res.status(500).json({
        result: false,
        error: error.message,
      });
    }
  });

  app.post("/folder", (req, res) => {
    try {
      const { path: folderPath, name } = req.query;

      if (!name) {
        return res.status(400).json({
          result: false,
          error: "Неправильный запрос",
        });
      }

      if (name.includes("/") || name.includes("\\") || name.trim() === "") {
        return res.status(400).json({
          result: false,
          error: "Имя файла содержит недопустимые символы",
        });
      }

      const basePath = getSafePath(folderPath);
      const newFolderPath = path.join(basePath, name);

      if (fs.existsSync(newFolderPath)) {
        return res.status(400).json({
          result: false,
          error: "Файл с таким именем уже существует",
        });
      }

      fs.mkdirSync(newFolderPath, { recursive: true });

      res.json({
        result: true,
        path: folderPath,
        name: name,
      });
    } catch (error) {
      console.error("create folder error:", error);
      res.status(500).json({
        result: false,
        error: error.message,
      });
    }
  });

  app.get("/download", (req, res) => {
    try {
      const { path: filePath } = req.query;

      if (!filePath) {
        return res.status(400).json({
          result: false,
          error: "Ошибка в запросе",
        });
      }

      const fullPath = getSafePath(filePath);

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({
          result: false,
          error: "Файл не найден",
        });
      }

      const stats = fs.lstatSync(fullPath);

      const fileName = path.basename(fullPath);

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      const fileStream = fs.createReadStream(fullPath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("download error:", error);
      res.status(500).json({
        result: false,
        error: error.message,
      });
    }
  });
};

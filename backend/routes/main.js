const fs = require("fs");

module.exports = function (app) {
  function isFolderSync(path) {
    try {
      const stats = fs.lstatSync(path);
      return stats.isDirectory(); //existsSync?
    } catch (error) {
      if (error.code === "ENOENT") {
        return false;
      }
      throw error;
    }
  }
  app.get("/", (req, res) => {
    const base = "./files/";
    const path = "";
    if ("path" in req.query) {
      path = req.query.path;
    }
    if (isFolderSync(base + path)) {
      let files = fs.readdirSync(base + path).map((item) => {
        const isDir = fs.lstatSync(base + path + "/" + item).isDirectory();
        let size = 0;
        if (isDir) {
          size = fs.statSync(base + path + "/" + item);
        }
        return {
          name: item,
          dir: isDir,
          size: size.size || 0,
        };
      });
      res.json({
        path: path,
        result: true,
        files: files,
      });
    }
  });
};

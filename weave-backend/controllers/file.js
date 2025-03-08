const fileSystem = require("fs");
const mime = require("mime");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.fileupload = async (req, res) => {
  if (req.files) {
    const file = req.files.file;
    console.log(file);
    const filePath = "./uploads/" + file.name;
    file.mv(filePath, (err) => {
      if (err) {
        res.send(err);
      }
    });
    if (
      file.mimetype ==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      file.mimetype = "docx";
    } else if (
      file.mimetype ==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      file.mimetype = "xlsx/excel";
    }
    try {
      const result = await prisma.file.create({
        data: {
          fileName: file.name,
          filePath: filePath,
          fileType: file.mimetype,
          projectId: req.params.projectId,
          authorId: req.params.userId,
          fileSize: file.size,
          fileTag: req.params.tag,
        },
      });
      res.status(200).send(result);
    } catch (error) {
      console.log(error);

      res.send(error);
    }
  }
};

exports.getFiles = async (req, res) => {
  const result = await prisma.file.findMany({
    where: {
      projectId: req.params.projectId,
    },
  });
  res.status(200).send(result);
};

exports.getProposal = async (req, res) => {
  try {
    const result = await prisma.file.findFirst({
      where: {
        projectId: req.params.projectId,
        fileTag: "proposal", // Ensure fileTag is "proposal"
      },
    });

    if (result) {
      console.log(result);

      return res.status(200).json({ success: true, data: result });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.fileAction = async (req, res) => {
  const result = await prisma.file.findUnique({
    where: {
      fileId: req.params.fileId,
    },
  });
  let filePath = result.filePath;
  let file = fileSystem.createReadStream(filePath);
  res.writeHead(200, {
    "Content-Type": mime.getType(filePath),
    "Content-Disposition": `${result.fileName}`,
  });
  file.pipe(res);
};

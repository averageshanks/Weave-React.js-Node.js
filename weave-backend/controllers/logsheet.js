const PDFdocument = require("pdfkit");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.logsheet = async (req, res) => {
  const result = await prisma.task.findMany({
    where: {
      projectId: req.params.projectId,
    },
  });

  console.log(result);
  const doc = new PDFdocument();
  doc.pipe(res);

  //making table
  doc.lineCap("butt").moveTo(290, 90).lineTo(290, 430).stroke();
  doc.lineCap("butt").moveTo(30, 90).lineTo(30, 430).stroke();
  doc.lineCap("butt").moveTo(550, 90).lineTo(550, 430).stroke();
  doc.lineCap("butt").moveTo(30, 430).lineTo(550, 430).stroke();
  doc.lineCap("butt").moveTo(450, 500).lineTo(550, 500).stroke();
  createText(doc, "Signature", 450, 510);
  //Making the first row
  row(doc, 90);

  //Title
  textInRowFirst(doc, "Weave", 70);
  textInRowFirst(doc, "Tasks accomplished", 100);
  textInRowSecond(doc, "Tasks to be accomplished", 100);

  let initialCount = 20;
  result.map((task) => {
    if (task.status === "completed") {
      textInRowFirst(doc, "-" + task.info, 100 + initialCount);
    } else {
      textInRowSecond(doc, "-" + task.info, 100 + initialCount);
    }
    initialCount += 20;
  });
  doc.end();
  res.writeHead(200, {
    "Content-Type": "application/pdf",
  });
};

//These are the necessary functions to create table
function textInRowFirst(doc, text, height) {
  doc.y = height;
  doc.x = 30;
  doc.fillColor("black");
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: "justify",
    columns: 1,
  });
  return doc;
}

//Put text in the 2nd column
function textInRowSecond(doc, text, height) {
  doc.y = height;
  doc.x = 295;
  doc.fillColor("black");
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: "justify",
    columns: 1,
  });
  return doc;
}

//Creates text at specified location
function createText(doc, text, x, y) {
  doc.y = y;
  doc.x = x;
  doc.fillColor("black");
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: "justify",
    columns: 1,
  });
  return doc;
}

//Creates a row
function row(doc, height) {
  doc.lineJoin("miter").rect(30, height, 520, 20).stroke();
  return doc;
}

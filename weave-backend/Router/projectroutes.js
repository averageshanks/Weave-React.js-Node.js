const { Router } = require("express");
const projects = require("../controllers/projects.js");
const file = require("../controllers/file.js");
const logsheet = require("../controllers/logsheet.js");
const fileUpload = require("express-fileupload");
const router = Router();

router.post("/api/create-project", projects.create);
router.post("/api/update/:projectId", projects.update);
router.get("/api/checkmail/:email", projects.checkEmail); //Checks mail when adding user to the project
router.get("/api/project", projects.getProject);
router.get("/api/getorgprojects", projects.getOrganizationSubmittedProjects);
router.get("/api/project/:userId", projects.getProjectusingMember);
router.get("/api/projectinfo/:projectId", projects.getIndividualProject);
router.post("/api/pushcallforproposal", projects.pushCall);
router.get("/api/notification/:userId", projects.getNotification);
router.get(
  "/api/readnotification/:userId/:notificationId",
  projects.markNotificationRead
);
router.get("/api/messages/:projectId", projects.getMessages);
router.get("/api/pinproject/:userId/:projectId", projects.pinproject);

//File Actions
//Router to upload files
router.post(
  "/api/fileupload/:projectId/:userId/:tag",
  fileUpload({ createParentPath: true }),
  file.fileupload
);
router.get("/api/files/:projectId", file.getFiles);
router.get("/api/file/:fileId", file.fileAction);
router.get("/api/fileproposal/:projectId", file.getProposal);
//Task Actions
router.get("/api/tasks/:projectId", projects.getTasks);
router.get("/api/:id/tasks", projects.getIndividaulTasks);
router.post("/api/task/:projectId", projects.addTask);
router.post("/api/updatetask/:taskid", projects.updateTask);
router.get("/api/logsheet/:projectId", logsheet.logsheet);
module.exports = router;

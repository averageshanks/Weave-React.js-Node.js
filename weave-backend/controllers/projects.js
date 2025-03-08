const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//This function creates project
exports.create = async (req, res) => {
  let members = req.body.members;
  let memberData = [];

  try {
    await Promise.all(
      members.map(async (email) => {
        const result = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        memberData = [...memberData, { userId: result.userId }];
      })
    );
    let data = {
      ...req.body,
      deadline: new Date(req.body.deadline),
      members: { connect: memberData },
    };
    const dbResp = await prisma.project.create({
      data: data,
    });
    console.log(dbResp);
    return res.send(dbResp);
  } catch (error) {
    return res.send(error);
  }
};

exports.pushCall = async (req, res) => {
  let pushDesc = req.body;
  try {
    const users = await prisma.user.findMany({
      where: {
        accountType: "User",
      },
    });
    users.map(async (user) => {
      await prisma.notification.create({
        data: {
          description: pushDesc.projectDescription,
          timeOfDeliver: new Date(pushDesc.deadline),
          status: "unread",
          userId: user.userId,
        },
      });
    });
    return res.send({
      success: true,
      data: null,
    });
  } catch (error) {
    console.log(error);

    return res.send({
      success: false,
      data: error,
    });
  }
};

exports.getNotification = async (req, res) => {
  const userID = req.params.userId;
  try {
    const resp = await prisma.notification.findMany({
      where: {
        userId: userID,
        status: "unread",
      },
    });
    return res.send({
      success: true,
      data: resp,
    });
  } catch (err) {
    return res.send({
      success: false,
      data: null,
    });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const resp = await prisma.notification.update({
      where: {
        notificationID: req.params.notificationId,
      },
      data: {
        status: "read",
      },
    });

    return res.status(200).send({
      success: true,
      data: resp,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      success: false,
      data: null,
    });
  }
};

exports.getProject = async (req, res) => {
  const data = await prisma.project.findMany({
    where: {
      visibility: "public",
    },
    include: {
      members: {
        select: {
          userId: true,
          name: true,
          email: true,
          accountType: true,
        },
      },
    },
  });
  res.send(data);
};

exports.getOrganizationSubmittedProjects = async (req, res) => {
  try {
    const data = await prisma.project.findMany({
      where: {
        organization: {
          not: null,
        },
      },
      include: {
        members: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.send({
      success: true,
      data,
    });
  } catch (error) {
    res.send({
      success: false,
      data: null,
    });
  }
};

//Get the projects with assiciated members
exports.getProjectusingMember = async (req, res) => {
  const userId = req.params.userId;
  const data = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      members: {
        select: {
          userId: true,
          name: true,
          email: true,
          accountType: true,
        },
      },
    },
  });
  res.status(200).send(data);
};

exports.getIndividualProject = async (req, res) => {
  if (req.params.projectId !== "undefined") {
    const data = await prisma.project.findUnique({
      where: {
        projectId: req.params.projectId,
      },
      include: {
        members: {
          select: {
            userId: true,
            name: true,
            email: true,
            accountType: true,
          },
        },
      },
    });
    res.status(200).send(data);
  } else {
    res.status(400).send({
      message: "No Project Id Submitted",
      status: "Error",
    });
  }
};

exports.getTasks = async (req, res) => {
  const data = await prisma.task.findMany({
    where: {
      projectId: req.params.projectId,
    },
    include: {
      name: true,
    },
  });
  res.send(data);
};

exports.getIndividaulTasks = async (req, res) => {
  const data = await prisma.task.findMany({
    where: {
      userid: req.params.id,
    },
    include: {
      project: true,
    },
  });
  res.status(200).send(data);
};

exports.addTask = async (req, res) => {
  const data = {
    ...req.body,
    deadline: new Date(req.body.deadline),
    projectId: req.params.projectId,
  };
  try {
    const result = await prisma.task.create({
      data: data,
    });
    res.send(result);
  } catch (error) {
    console.log(error);
  }
};

exports.updateTask = async (req, res) => {
  const response = await prisma.task.update({
    where: {
      taskId: req.params.taskid,
    },
    data: req.body,
  });
  console.log(response);
};

exports.checkEmail = async (req, res) => {
  const result = await prisma.user.findUnique({
    where: {
      email: req.params.email,
    },
  });

  if (result) {
    res.status(200).send({
      message: "Email exists",
    });
  } else {
    res.status(404).send({
      message: "User with that mail does not exist",
    });
  }
};

exports.update = async (req, res) => {
  console.log(req.body);
  const result = await prisma.project.update({
    where: {
      projectId: req.params.projectId,
    },
    data: req.body,
  });
  console.log(result);
};

exports.getMessages = async (req, res) => {
  const result = await prisma.message.findMany({
    where: {
      projectId: req.params.projectId,
    },
    include: {
      author: true,
    },
  });
  res.status(200).send(result);
};

exports.pinproject = async (req, res) => {
  let userId = req.params.userId;
  let projectId = req.params.projectId;
  try {
    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      include: {
        pinnedProjects: {
          select: {
            projectId: true,
          },
        },
      },
    });

    // Retrieve the existing pinnedProjects array
    const pinnedProjects = user.pinnedProjects || [];

    // Add the new project to the pinnedProjects array if it doesn't already exist
    if (!pinnedProjects.find((project) => project.projectId === projectId)) {
      pinnedProjects.push({ projectId: projectId });
    } else {
      return res.status(400).send({
        message: "This Project is already pinned",
      });
    }

    // Update the user with the updated pinnedProjects array
    const updatedUser = await prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        pinnedProjects: {
          set: pinnedProjects,
        },
      },
    });

    return res.status(200).send(pinnedProjects);
  } catch (error) {
    console.error("Error adding project to pinnedProjects:", error);
    res.status(400).send({
      message: "Error while pinning the project",
    });
    throw error;
  }
};

import prisma from "../../utils/prisma";
import moment from "moment";

const handler = async (req, res) => {
  const { name, userId } = req.body;

  if (!userId) {
    res.status(400).json({
      message: "user id is required",
    });
    return;
  }

  if (!name) {
    res.status(400).json({
      message: "project name is required",
    });
    return;
  }

  const project = {
    name: name,
    state: "Propose",
    date: moment().toDate(),
  };

  const repProject = await prisma.Project.create({
    data: project,
  });

  await prisma.Access.createMany({
    data: [
      {
        project_id: repProject.id,
        user_id: parseInt(userId),
        permit: "Create",
      },
      {
        project_id: repProject.id,
        user_id: parseInt(userId),
        permit: "Read",
      },
      {
        project_id: repProject.id,
        user_id: parseInt(userId),
        permit: "Update",
      },
      {
        project_id: repProject.id,
        user_id: parseInt(userId),
        permit: "Delete",
      },
    ],
    skipDuplicates: false,
  });

  res.status(200).json({ project: repProject });
};

export default handler;

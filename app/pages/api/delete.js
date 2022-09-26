import prisma from "../../utils/prisma";

const handler = async (req, res) => {
  const { userId, id } = req.body;

  if (!userId) {
    res.status(400).json({
      message: "user id is required",
    });
    return;
  }

  if (!id) {
    res.status(400).json({
      message: "project id is required",
    });
    return;
  }

  const project = await prisma.Project.findFirst({
    where: {
      id: parseInt(id),
      Access: {
        some: {
          project_id: {
            equals: parseInt(id),
          },
          user_id: {
            equals: parseInt(userId),
          },
          permit: {
            equals: "Delete",
          },
        },
      },
    },
    select: {
      id: true,
      Access: {
        where: {
          user_id: parseInt(userId),
          permit: "Update",
        },
      },
    },
  });

  if (
    !project ||
    (project && !project.Access) ||
    (project && project.Access && !(project.Access.length > 0))
  ) {
    res.status(400).json({
      message: "User doesnt have access to delete this project",
    });
    return;
  }

  const deleteUserAccess = await prisma.Access.deleteMany({
    where: {
      project_id: parseInt(id),
    },
  });

  const deleteProject = await prisma.Project.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(200).json({ deleteUserAccess, deleteProject });
};

export default handler;

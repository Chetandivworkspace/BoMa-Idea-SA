import prisma from "../../utils/prisma";

const handler = async (req, res) => {
  const { userId, projectId } = req.query;

  if (!userId) {
    res.status(400).json({
      message: "user id is required",
    });
    return;
  }

  if (!projectId) {
    res.status(400).json({
      message: "project id is required",
    });
    return;
  }

  const project = await prisma.Project.findFirst({
    where: {
      id: parseInt(projectId),
      Access: {
        some: {
          project_id: {
            equals: parseInt(projectId),
          },
          user_id: {
            equals: parseInt(userId),
          },
          permit: {
            equals: "Read",
          },
        },
      },
    },
    select: {
      id:true,
      name:true,
      state:true,
      date:true,
      Access: {
        where: {
          user_id: parseInt(userId),
        },
      },
    },
  });

  res.status(200).json({ project });
};

export default handler;

import prisma from "../../utils/prisma";

const handler = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).json({
      message: "user id is required",
    });
    return;
  }

  const projects = await prisma.Project.findMany({
    where: {
      Access: {
        some: {
          user_id: {
            equals: parseInt(userId),
          },
          permit: {
            equals: "Create",
          },
        },
      },
    },
  });

  res.status(200).json({ projects });
};

export default handler;

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
        select  :{
          id:true,
          permit:true
        }
      },
    },
  });

  res.status(200).json({ projects });
};

export default handler;

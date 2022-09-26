import prisma from "../../utils/prisma";
import moment from "moment";

const handler = async (req, res) => {
  const { name, userId, state, id } = req.body;

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

  if(state && !["Propose","Open","Closed"].includes(state)) {
    res.status(400).json({
      message: "invalid project state.",
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
            equals: "Update",
          },
        },
      },
    },
    select: {
      id:true,
      Access: {
        where: {
          user_id: parseInt(userId),
          permit:"Update"
        },
      },
    },
  });

  if(!project || (project && !project.Access) || (project && project.Access && !(project.Access.length > 0))) {
    res.status(400).json({
      message: "User doesnt have access to modify this project",
    });
    return;
  }

  const updateProjectDraft = {};

  if(state) updateProjectDraft['state'] = state;
  if(name) updateProjectDraft['name'] = name;

  const updatedProject = await prisma.Project.update({
    where: {
      id: parseInt(id),
    },
    data: updateProjectDraft,
  });

  res.status(200).json({ project: updatedProject });
};

export default handler;

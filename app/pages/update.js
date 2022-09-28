import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export default function Home(props) {
  const { project, userId, projectId } = props;
  const [prjName, setPrjName] = useState(project.name);
  const [prjState, setPrjState] = useState(project.state);
  const router = useRouter();
  // console.log(project);

  const backToHome = useCallback(() => {
    router.push("/");
  });

  const updateProject = useCallback(async () => {
    await axios.post(`http://localhost:3000/api/update`, {
      userId,
      id: projectId,
      name: prjName,
      state: prjState,
    });

    router.push("/");
  }, [userId, projectId, prjName, prjState]);

  return (
    <div className="container">
      <Head>
        <title>Update - {project.name}</title>
        <meta name="description" content="Test App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="row mt-5">
        <div className="col-md-2">
          <button onClick={backToHome} className="btn btn-danger">
            back
          </button>
        </div>
        <div className="col-md-10">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Name</th>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={prjName}
                    onChange={(e) => setPrjName(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{project.date.slice(0, 10)}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  <select
                    className="form-select"
                    aria-label="Project state"
                    value={prjState}
                    onChange={(s) => setPrjState(s.target.value)}
                  >
                    <option value="Propose">Propose</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Access</th>
                <td>
                  {project.Access.map((ac) => (
                    <span className="badge text-bg-primary mx-1" key={ac.id}>
                      {ac.permit}
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <th>Delete</th>
                <td>
                  <button
                    onClick={updateProject}
                    type="button"
                    className="btn btn-success"
                  >
                    Update
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let { userId, projectId } = context.query;
  userId = parseInt(userId);
  projectId = parseInt(projectId);

  if (isNaN(userId) || isNaN(projectId)) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  const { data } = await axios.get(
    `http://localhost:3000/api/read?userId=${userId}&projectId=${projectId}`
  );

  return {
    props: {
      project: data.project,
      userId,
      projectId,
    },
  };
}

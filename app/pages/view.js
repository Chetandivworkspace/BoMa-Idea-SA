import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback } from "react";

export default function Home(props) {
  const { project } = props;
  const router = useRouter();
  // console.log(project);

  const backToHome = useCallback(() => {
    router.push("/");
  });

  return (
    <div className="container">
      <Head>
        <title>View - {project.name}</title>
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
                <td>{project.name}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{project.date.slice(0, 10)}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{project.state}</td>
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
      projectId
    },
  };
}

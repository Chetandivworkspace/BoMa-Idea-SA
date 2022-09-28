import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export default function Home(props) {
  const { userId } = props;
  const [prjName, setPrjName] = useState("");
  const router = useRouter();
  // console.log(project);

  const backToHome = useCallback(() => {
    router.push("/");
  });

  const createProject = useCallback(async () => {
    await axios.post(`http://localhost:3000/api/create`, {
      userId,
      name: prjName,
    });

    router.push("/");
  }, [userId, prjName]);

  return (
    <div className="container">
      <Head>
        <title>Create new Project</title>
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
                <th>Create</th>
                <td>
                  <button
                    onClick={createProject}
                    type="button"
                    className="btn btn-success"
                  >
                    Create
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
  let { userId } = context.query;
  userId = parseInt(userId);

  if (isNaN(userId)) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  return {
    props: {
      userId,
    },
  };
}

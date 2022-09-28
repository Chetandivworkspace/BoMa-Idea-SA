import { useCallback, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { BsEye } from "react-icons/bs";
import { BiBookAdd, BiMessageSquareEdit } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [projects, setProjects] = useState([]);
  const [hasCreate, setCreate] = useState(false);
  const [isListEmpty, setListIsEmpty] = useState(false);

  const router = useRouter();

  const setOnlyNumberUserID = useCallback(
    (e) => {
      let v = parseInt(e.target.value);
      if (isNaN(v)) setUserId("");
      else if (userId != v) setUserId(v);
    },
    [setUserId, userId]
  );

  const fetchUserProjects = async () => {
    const url = `http://localhost:3000/api/readAll?userId=${userId}`;
    const permissionurl = `http://localhost:3000/api/permission?userId=${userId}`;
    const finalProjects = [];

    const { data: listProject } = await axios.get(url);
    const { data: premissionedProject } = await axios.get(permissionurl);

    (listProject.projects || []).forEach((pr) => {
      const p = { ...pr };
      let idx = -1;
      idx = (premissionedProject.projects || []).findIndex(
        (xpr) => xpr.id == pr.id
      );
      if (idx !== -1) {
        if (!hasCreate) setCreate(true);
        p.accessList = premissionedProject.projects[idx].Access;
      }
      finalProjects.push(p);
    });

    // console.log(finalProjects);

    if (finalProjects.length > 0) {
      setListIsEmpty(false);
    } else {
      setListIsEmpty(true);
    }
    setProjects(finalProjects);
  };

  return (
    <div className="container">
      <Head>
        <title>Home</title>
        <meta name="description" content="Test App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="row mt-5">
        <div className="col-md-6 col-sm-12">
          <form className="p-3" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="mb-2" htmlFor="userID">
                Enter user id
              </label>
              <input
                onChange={setOnlyNumberUserID}
                type="email"
                value={userId}
                className="form-control mb-2"
                id="userID"
                placeholder="Enter user id number"
              />
            </div>
            <button
              onClick={fetchUserProjects}
              type="button"
              className="btn btn-primary"
            >
              Fetch User
            </button>
          </form>
        </div>
      </div>

      {projects.length > 0 && (
        <div className="mt-5">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">State</th>
                <th scope="col">Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((pr, i) => (
                <tr key={i}>
                  <th scope="row">{i}</th>
                  <td>{pr.name}</td>
                  <td>{pr.state}</td>
                  <td>{pr.date.slice(0, 10)}</td>
                  <td className="d-flex flex-row justify-content-start">
                    {pr.accessList.findIndex((a) => a.permit == "Read") !==
                      -1 && (
                      <button
                        onClick={() => {
                          router.push(
                            `/view?userId=${userId}&projectId=${pr.id}`
                          );
                        }}
                        className="btn btn-sm btn-info me-2"
                      >
                        <BsEye />
                      </button>
                    )}
                    {pr.accessList.findIndex((a) => a.permit == "Create") !==
                      -1 && (
                      <button 
                      onClick={() => {
                        router.push(
                          `/create?userId=${userId}&projectId=${pr.id}`
                        );
                      }}
                      className="btn btn-sm btn-primary me-2">
                        <BiBookAdd />
                      </button>
                    )}
                    {pr.accessList.findIndex((a) => a.permit == "Update") !==
                      -1 && (
                      <button 
                      onClick={() => {
                        router.push(
                          `/update?userId=${userId}&projectId=${pr.id}`
                        );
                      }}
                      className="btn btn-sm btn-warning me-2">
                        <BiMessageSquareEdit />
                      </button>
                    )}
                    {pr.accessList.findIndex((a) => a.permit == "Delete") !==
                      -1 && (
                      <button 
                      onClick={() => {
                        router.push(
                          `/delete?userId=${userId}&projectId=${pr.id}`
                        );
                      }}
                      className="btn btn-sm btn-danger">
                        <RiDeleteBinLine />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isListEmpty == true && (
        <div className="mt-5">
          <h5>No projects fouund for this user id.</h5>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function AdminReports() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/admin/reports", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API RESPONSE:", data);
        setUsers(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">📊 User Report</h1>

      {users.length === 0 ? (
        <p className="text-center">No users found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

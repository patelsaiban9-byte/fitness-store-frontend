import React, { useEffect, useState } from "react";

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Error fetching reports:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User Reports</h2>
      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            <th>User Email</th>
            <th>Order Date</th>
            <th>Order Details</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 && (
            <tr>
              <td colSpan={3}>No users found</td>
            </tr>
          )}

          {reports.map((report, index) =>
            report.orders && report.orders.length > 0 ? (
              report.orders.map((order, orderIndex) => (
                <tr key={`${index}-${orderIndex}`}>
                  <td>{report.email}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{order.product || order.productName || "Unknown"}</td>
                </tr>
              ))
            ) : (
              <tr key={index}>
                <td>{report.email}</td>
                <td colSpan={2}>No Orders Found</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserReports;

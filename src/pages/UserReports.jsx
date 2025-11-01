import React, { useEffect, useState } from "react";

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/reports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User Reports</h2>
      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            <th>User Email</th>
            <th>Role</th>
            <th>Total Orders</th>
            <th>Total Amount (₹)</th>
            <th>Order Details</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.totalOrders}</td>
              <td>{u.totalAmount}</td>
              <td>
                {u.orders.length > 0 ? (
                  <ul className="list-unstyled mb-0">
                    {u.orders.map((o, i) => (
                      <li key={i}>
                        {o.productName} - ₹{o.price}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No orders"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserReports;

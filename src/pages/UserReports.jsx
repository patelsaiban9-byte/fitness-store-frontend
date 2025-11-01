import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserReports = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // ✅ Correct backend route
    axios.get('https://fitness-store-backend.onrender.com/api/admin/reports')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Reports</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Registered At</th>
            <th className="border p-2">Orders</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="border p-2">{user.name || 'N/A'}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="border p-2">{user.orders ? user.orders.length : 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserReports;

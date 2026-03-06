import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PERIOD_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const CATEGORY_COLORS = {
  high: "#28a745",
  medium: "#ffc107",
  low: "#dc3545",
};

export default function SalesReports() {
  const [period, setPeriod] = useState("monthly");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchReport = async (selectedPeriod) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/reports?period=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reports");
      }

      setReport(data);
    } catch (err) {
      setError(err.message || "Failed to load report");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(period);
  }, [period]);

  const chartData = (report?.chartData || []).slice(0, 10);

  const downloadPDF = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/reports-pdf?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sales-report-${period}-${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download PDF: " + err.message);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">📊 Sales Reports</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h5 className="mb-1">Generate Report</h5>
            <small className="text-muted">Choose report period: monthly, quarterly, yearly</small>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <select
              className="form-select"
              style={{ maxWidth: "220px" }}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              className="btn btn-success"
              onClick={downloadPDF}
              disabled={!report}
              title="Download report as PDF"
            >
              📥 Download PDF
            </button>
          </div>
        </div>
      </div>

      {loading && <p className="text-center">Loading report...</p>}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && report && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="text-muted">Total Orders</h6>
                  <h4 className="mb-0">{report.summary?.totalOrders || 0}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="text-muted">Total Units Sold</h6>
                  <h4 className="mb-0">{report.summary?.totalUnitsSold || 0}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="text-muted">Total Products</h6>
                  <h4 className="mb-0">{report.summary?.totalProducts || 0}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="text-muted">Highest Selling</h6>
                  <h6 className="mb-0">{report.summary?.topProduct?.productName || "N/A"}</h6>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="mb-3">Product Sales Graph (Top 10 by Qty)</h5>

              {chartData.length === 0 ? (
                <p className="text-muted mb-0">No sales data found for selected period.</p>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis label={{ value: "Quantity Sold", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="qty"
                      name="Quantity Sold"
                      fill="#8884d8"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="mb-3">Product Distribution by Sales Level</h5>

              {!report.groups || (report.groups.highSelling.length === 0 && report.groups.mediumSelling.length === 0 && report.groups.lowSelling.length === 0) ? (
                <p className="text-muted mb-0">No product data available.</p>
              ) : (
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-center">Product Count by Category</h6>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "High Selling",
                              value: report.groups?.highSelling?.length || 0,
                              color: CATEGORY_COLORS.high,
                            },
                            {
                              name: "Medium Selling",
                              value: report.groups?.mediumSelling?.length || 0,
                              color: CATEGORY_COLORS.medium,
                            },
                            {
                              name: "Low Selling",
                              value: report.groups?.lowSelling?.length || 0,
                              color: CATEGORY_COLORS.low,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) =>
                            value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : ""
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            {
                              name: "High Selling",
                              value: report.groups?.highSelling?.length || 0,
                              color: CATEGORY_COLORS.high,
                            },
                            {
                              name: "Medium Selling",
                              value: report.groups?.mediumSelling?.length || 0,
                              color: CATEGORY_COLORS.medium,
                            },
                            {
                              name: "Low Selling",
                              value: report.groups?.lowSelling?.length || 0,
                              color: CATEGORY_COLORS.low,
                            },
                          ].map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} products`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="col-md-6">
                    <h6 className="text-center">Revenue by Sales Level</h6>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "High Selling",
                              value: (report.groups?.highSelling || []).reduce((sum, p) => sum + p.totalRevenue, 0),
                              color: CATEGORY_COLORS.high,
                            },
                            {
                              name: "Medium Selling",
                              value: (report.groups?.mediumSelling || []).reduce((sum, p) => sum + p.totalRevenue, 0),
                              color: CATEGORY_COLORS.medium,
                            },
                            {
                              name: "Low Selling",
                              value: (report.groups?.lowSelling || []).reduce((sum, p) => sum + p.totalRevenue, 0),
                              color: CATEGORY_COLORS.low,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) =>
                            value > 0 ? `${name}: ₹${value?.toFixed(0) || 0} (${(percent * 100).toFixed(0)}%)` : ""
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            {
                              name: "High Selling",
                              value: (report.groups?.highSelling || []).reduce((sum, p) => sum + p.totalRevenue, 0),
                              color: CATEGORY_COLORS.high,
                            },
                            {
                              name: "Medium Selling",
                              value: (report.groups?.mediumSelling || []).reduce((sum, p) => sum + p.totalRevenue, 0),
                              color: CATEGORY_COLORS.medium,
                            },
                            {
                              name: "Low Selling",
                              value: (report.groups?.lowSelling || []).reduce((sum, p) => sum + p.totalRevenue, 0),
                              color: CATEGORY_COLORS.low,
                            },
                          ].map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value?.toFixed(2) || 0}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="mb-3">Top 10 Customers by Total Spent</h5>

              {(!report.topCustomers || report.topCustomers.length === 0) ? (
                <p className="text-muted mb-0">No customer data found for selected period.</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={report.topCustomers}
                      margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        style={{ fontSize: "11px" }}
                      />
                      <YAxis 
                        label={{ value: "Total Spent (₹)", angle: -90, position: "insideLeft" }}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "Total Spent") return [`₹${value.toFixed(2)}`, name];
                          return [value, name];
                        }}
                        labelFormatter={(label) => {
                          const customer = report.topCustomers.find(c => c.name === label);
                          return customer ? `${customer.name} (${customer.orders} orders)` : label;
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="spent"
                        name="Total Spent"
                        fill="#82ca9d"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-3">
                    <small className="text-muted">
                      Showing {report.topCustomers.length} customer{report.topCustomers.length !== 1 ? 's' : ''}
                    </small>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="mb-3">Sales Trend by {period.charAt(0).toUpperCase() + period.slice(1)}</h5>

              {(!report.salesTrend || report.salesTrend.length === 0) ? (
                <p className="text-muted mb-0">No sales data available.</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={report.salesTrend}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="period"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        style={{ fontSize: "11px" }}
                      />
                      <YAxis 
                        yAxisId="left"
                        label={{ value: "Sales Amount (₹)", angle: -90, position: "insideLeft" }}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: "Orders", angle: 90, position: "insideRight" }}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "Sales") return [`₹${value.toFixed(2)}`, name];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="sales"
                        name="Sales"
                        stroke="#8884d8"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        name="Orders"
                        stroke="#ffc658"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-3">
                    <small className="text-muted">
                      Showing {report.salesTrend.length} {period === "monthly" ? "month" : period === "quarterly" ? "quarter" : "year"}{report.salesTrend.length !== 1 ? 's' : ''} of sales data
                    </small>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <div className="card border-success h-100">
                <div className="card-header bg-success text-white">High Selling</div>
                <ul className="list-group list-group-flush">
                  {(report.groups?.highSelling || []).slice(0, 8).map((item) => (
                    <li key={item.productName} className="list-group-item d-flex justify-content-between">
                      <span>{item.productName}</span>
                      <strong>{item.totalQty}</strong>
                    </li>
                  ))}
                  {(report.groups?.highSelling || []).length === 0 && (
                    <li className="list-group-item text-muted">No data</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-warning h-100">
                <div className="card-header bg-warning">Medium Selling</div>
                <ul className="list-group list-group-flush">
                  {(report.groups?.mediumSelling || []).slice(0, 8).map((item) => (
                    <li key={item.productName} className="list-group-item d-flex justify-content-between">
                      <span>{item.productName}</span>
                      <strong>{item.totalQty}</strong>
                    </li>
                  ))}
                  {(report.groups?.mediumSelling || []).length === 0 && (
                    <li className="list-group-item text-muted">No data</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-danger h-100">
                <div className="card-header bg-danger text-white">Low Selling</div>
                <ul className="list-group list-group-flush">
                  {(report.groups?.lowSelling || []).slice(0, 8).map((item) => (
                    <li key={item.productName} className="list-group-item d-flex justify-content-between">
                      <span>{item.productName}</span>
                      <strong>{item.totalQty}</strong>
                    </li>
                  ))}
                  {(report.groups?.lowSelling || []).length === 0 && (
                    <li className="list-group-item text-muted">No data</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

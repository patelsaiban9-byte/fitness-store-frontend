import React, { useEffect, useState } from "react";

const PERIOD_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const levelClassName = {
  high: "bg-success",
  medium: "bg-warning",
  low: "bg-danger",
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
  const maxQty = chartData.length ? Math.max(...chartData.map((item) => item.qty)) : 0;

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">📊 Sales Reports</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h5 className="mb-1">Generate Report</h5>
            <small className="text-muted">Choose report period: monthly, quarterly, yearly</small>
          </div>

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
                <div className="d-flex flex-column gap-3">
                  {chartData.map((item) => {
                    const width = maxQty > 0 ? Math.max((item.qty / maxQty) * 100, 4) : 0;

                    return (
                      <div key={item.label}>
                        <div className="d-flex justify-content-between mb-1">
                          <span>{item.label}</span>
                          <span className="fw-semibold">{item.qty}</span>
                        </div>
                        <div className="progress" style={{ height: "16px" }}>
                          <div
                            className={`progress-bar ${levelClassName[item.level] || "bg-secondary"}`}
                            role="progressbar"
                            style={{ width: `${width}%` }}
                            aria-valuenow={item.qty}
                            aria-valuemin="0"
                            aria-valuemax={maxQty}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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

import { useEffect, useState } from "react";
import { getCreatorIncome } from "../../api/donations";
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";

const IncomeReportPage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCreatorIncome({ from: from || undefined, to: to || undefined });
      setReport(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="page">
      <h1>Reporte de Ingresos</h1>
      <Alert type="error" message={error} />
      <div className="card">
        <form onSubmit={handleSubmit} className="filter-form">
          <div className="form-group">
            <label htmlFor="income-from">Desde</label>
            <input
              id="income-from"
              type="date"
              className="input"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="income-to">Hasta</label>
            <input
              id="income-to"
              type="date"
              className="input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <button id="income-filter" type="submit" className="btn btn-primary">Filtrar</button>
        </form>
      </div>

      {loading ? (
        <Spinner />
      ) : report ? (
        <>
          <div className="stat-box">
            <span className="stat-label">Total de Flanes recibidos</span>
            <span className="stat-value">{report.totalFlanes}</span>
          </div>
          <div className="card">
            <h2>Historial de donaciones</h2>
            {report.donations.length === 0 ? (
              <p>No hay donaciones en este periodo.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Donador</th>
                    <th>Flanes</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {report.donations.map((d) => (
                    <tr key={d.id}>
                      <td>{d.follower?.email}</td>
                      <td>{d.flanes}</td>
                      <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default IncomeReportPage;

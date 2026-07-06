import { useEffect, useState } from "react";
import { getDonationHistory } from "../../api/donations";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const DonationHistoryPage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDonationHistory({
        from: from || undefined,
        to: to || undefined,
        creatorName: creatorName || undefined,
      });
      setDonations(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar historial");
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
      <h1>Historial de Donaciones</h1>
      <Alert type="error" message={error} />
      <div className="card">
        <form onSubmit={handleSubmit} className="filter-form">
          <div className="form-group">
            <label htmlFor="history-from">Desde</label>
            <input
              id="history-from"
              type="date"
              className="input"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="history-to">Hasta</label>
            <input
              id="history-to"
              type="date"
              className="input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="history-creator">Nombre del creador</label>
            <input
              id="history-creator"
              type="text"
              className="input"
              placeholder="Filtrar por creador..."
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
            />
          </div>
          <button id="history-filter" type="submit" className="btn btn-primary">Filtrar</button>
        </form>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="card">
          {donations.length === 0 ? (
            <p>No hay donaciones en este periodo.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Creador</th>
                  <th>Flanes</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td>{d.creator?.creatorProfile?.displayName || "Creador"}</td>
                    <td>{d.flanes}</td>
                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationHistoryPage;

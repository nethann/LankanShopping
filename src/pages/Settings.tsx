import { useCurrency } from "../contexts/CurrencyContext";

export default function Settings() {
  const { currency, country, loading, source, supportedCurrencies, setCurrencyOverride } = useCurrency();

  return (
    <div className="settings-page">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Choose how prices are shown in your region.</p>

      <section className="settings-card">
        <div className="settings-row">
          <label className="admin-label" htmlFor="currency">
            Currency
          </label>
          <select
            id="currency"
            className="settings-select"
            value={currency}
            disabled={loading}
            onChange={(e) => setCurrencyOverride(e.target.value as typeof currency)}
          >
            {supportedCurrencies.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <p className="settings-meta">
          Region: <strong>{country || "Unknown"}</strong> | Mode:{" "}
          <strong>{source === "auto" ? "Auto detected" : source === "override" ? "Manual" : "Fallback"}</strong>
        </p>
      </section>
    </div>
  );
}

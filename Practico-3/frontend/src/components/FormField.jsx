const FormField = ({ label, id, error, children }) => (
  <div className="form-group">
    {label && <label htmlFor={id}>{label}</label>}
    {children}
    {error && <span className="form-error">{error}</span>}
  </div>
);

export default FormField;

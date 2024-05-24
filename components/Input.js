export default function Input({ label, type, autoComplete, ...props }) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input type={type} className="input input-bordered w-full" autoComplete={autoComplete} {...props} />
    </div>
  );
}

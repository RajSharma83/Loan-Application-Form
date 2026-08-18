function Card({ children, className = "" }) {
  return (
    <div
      className={`neu-surface rounded-2xl bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
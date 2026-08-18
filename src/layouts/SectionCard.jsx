function SectionCard({ children }) {
  return (
    <section
      className="
        neu-surface
        w-full
        rounded-3xl
        bg-white
        p-5
        sm:p-8
        lg:p-12
      "
    >
      {children}
    </section>
  );
}

export default SectionCard;
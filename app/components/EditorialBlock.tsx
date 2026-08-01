type EditorialBlockProps = {
  eyebrow?: string;
  title: string;
  text: string;
};

export default function EditorialBlock({
  eyebrow = "✦ L’avis The Wine Watchers",
  title,
  text,
}: EditorialBlockProps) {
  return (
    <section className="mb-10 rounded-[2rem] border border-[#d8b56d]/45 bg-[#fffaf3] p-6 shadow-sm md:p-8">
      <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
        {eyebrow}
      </p>

      <h2 className="mt-3 font-serif text-3xl text-[#24110d]">
        {title}
      </h2>

      <p className="mt-5 max-w-5xl text-base leading-8 text-[#6d5b50] md:text-lg md:leading-9">
        {text}
      </p>
    </section>
  );
}

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: {
    heading: string;
    text: string;
  }[];
};

export function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
}: InfoPageProps) {
  return (
    <main className="min-h-[60vh] bg-white px-6 py-16 text-black">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          {eyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          {intro}
        </p>

        <div className="mt-12 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold">
                {section.heading}
              </h2>
              <p className="mt-3 leading-7 text-gray-600">
                {section.text}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

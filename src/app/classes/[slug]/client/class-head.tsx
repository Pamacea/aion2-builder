export const ClassHead = ({ className }: { className: string }) => {
  return (
    <section className="w-full flex flex-col items-start justify-start gap-4">
        <h2 className="uppercase font-bold text-xl text-ring">CLASS</h2>
        <h1 className="uppercase font-extrabold text-3xl">{className}</h1>
    </section>
  );
}
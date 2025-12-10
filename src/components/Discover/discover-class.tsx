export const DiscoverClass = () => {
  return (
    <section className="h-full w-full flex flex-col items-center justify-center gap-8 border">
      <div className="grid grid-cols-4 gap-8 justify-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[#1F1F1F] p-8 rounded-xl h-64 w-64 flex flex-col items-center justify-center gap-4">
            <h2 className="uppercase font-bold text-6xl">Class {i+1}</h2>
          </div>
        ))}
      </div>
    </section>
  );
};
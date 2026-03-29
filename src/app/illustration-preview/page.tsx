import Image from "next/image";

const illustrations = [
  "nonco-illustrationspack-2026-89-01.svg",
  "nonco-illustrationspack-2026-89-02.svg",
  "nonco-illustrationspack-2026-89-04.svg",
  "nonco-illustrationspack-2026-89-05.svg",
  "nonco-illustrationspack-2026-89-19.svg",
  "nonco-illustrationspack-2026-89-32.svg",
  "nonco-illustrationspack-2026-89-38.svg",
  "nonco-illustrationspack-2026-89-50.svg",
  "nonco-illustrationspack-2026-89-52.svg",
  "nonco-illustrationspack-2026-89-57.svg",
  "nonco-illustrationspack-2026-89-66.svg",
  "nonco-illustrationspack-2026-89-82.svg",
  "nonco-illustrationspack-2026-89-90.svg",
];

export default function IllustrationPreview() {
  return (
    <div className="min-h-screen bg-black p-8 lg:p-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-sans text-2xl font-bold text-white mb-2">Nonco Illustrations — Blue Pack</h1>
        <p className="text-sm text-white/50 font-sans mb-12">
          13 ilustracoes oficiais. Escolha quais usar em cada pagina do app.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {illustrations.map((file) => {
            const num = file.match(/(\d+)\.svg$/)?.[1] ?? "";
            return (
              <div key={file} className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 flex flex-col items-center gap-3">
                <div className="relative w-full aspect-square">
                  <Image
                    src={`/illustrations/${file}`}
                    alt={`Illustration ${num}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-[11px] font-mono text-white/40">#{num}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

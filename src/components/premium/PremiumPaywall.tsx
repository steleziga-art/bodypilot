"use client";

export default function PremiumPaywall({
  title,
  detail,
  onPreviewPremium,
}: {
  title: string;
  detail: string;
  onPreviewPremium?: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-blue-200 bg-white shadow-sm">
      <div className="bg-blue-50 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-blue-500 px-3 py-1 text-xs font-black uppercase tracking-widest text-white">CYG Premium</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white text-3xl shadow-sm">✦</div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {["AI-powered tools", "Advanced insights", "Looksmaxing plan"].map((item) => (
            <div key={item} className="rounded-2xl border border-blue-100 bg-white p-4 text-sm font-black text-slate-800">✓ {item}</div>
          ))}
        </div>
        {onPreviewPremium && (
          <button type="button" onClick={onPreviewPremium} className="mt-6 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-black text-white hover:bg-blue-400">
            Preview Premium
          </button>
        )}
      </div>
    </section>
  );
}

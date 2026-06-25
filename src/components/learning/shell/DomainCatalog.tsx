import type { LearningCatalog, LearningDomainId } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getDomainText } from '../learningText';

type DomainCatalogProps = {
  catalog: LearningCatalog;
  language: Language;
  onOpenDomain: (domainId: LearningDomainId) => void;
};

export default function DomainCatalog({ catalog, language, onOpenDomain }: DomainCatalogProps) {
  const isVi = language === 'vi';

  return (
    <section className="grid gap-5">
      <div className="rounded-xl border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/70">
        <div className="text-xs font-black uppercase tracking-wide text-sky-700">
          {isVi ? 'Learning Lab' : 'Learning Lab'}
        </div>
        <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950">
          {isVi ? 'Chọn domain học tập' : 'Choose a learning domain'}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          {isVi
            ? 'Learning Lab gom ML foundations, CV, NLP, Reinforcement Learning và Robot Learning vào cùng một flow.'
            : 'Learning Lab brings ML foundations, CV, NLP, Reinforcement Learning, and Robot Learning into one flow.'}
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        {catalog.domains.map((domain, index) => {
          const text = getDomainText(language, domain.id);
          const isPlaceholder = domain.status === 'placeholder';

          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => onOpenDomain(domain.id)}
              className="group w-full rounded-xl border border-sky-100 bg-gradient-to-br from-white to-[#f6fbff] p-5 text-left shadow-sm shadow-sky-100/70 transition-transform duration-150 hover:-translate-y-0.5 hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef6ff] text-xl font-black text-sky-700">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${isPlaceholder ? 'bg-slate-100 text-slate-500' : 'bg-sky-100 text-sky-700'}`}>
                      {isPlaceholder ? (isVi ? 'Sắp có' : 'Placeholder') : (isVi ? 'Sẵn sàng' : 'Available')}
                    </span>
                  </div>
                  <h2 className="text-lg font-black leading-tight text-slate-950">{text.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{text.description}</p>
                  <span className="mt-5 block text-sm font-black text-sky-700 transition-colors group-hover:text-sky-800">
                    {isVi ? 'Mở domain' : 'Open domain'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

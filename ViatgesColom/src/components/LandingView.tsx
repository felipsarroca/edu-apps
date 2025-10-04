import { ArrowRight, Sparkles } from "lucide-react";
import type { FC } from "react";

import { getIcon } from "./IconFactory";
import type { Voyage, VoyageId } from "../types";

interface LandingViewProps {
  voyages: Voyage[];
  onStartSingle: (voyageId: VoyageId) => void;
  onStartCompare: () => void;
}

export const LandingView: FC<LandingViewProps> = ({ voyages, onStartSingle, onStartCompare }) => {
  return (
    <div className="landing">
      <header className="landing__hero">
        <div className="landing__intro">
          <span className="landing__badge">
            <Sparkles size={18} />
            Experiència immersiva
          </span>
          <h1>Els viatges de Colom: de la glòria al naufragi</h1>
          <p>
            Endinsa&apos;t en els quatre viatges transoceànics de Cristòfor Colom amb mapes interactius, línia de
            temps i recursos per treballar a l&apos;aula. Pensat per despertar la curiositat dels adolescents i donar
            veu a totes les mirades.
          </p>
          <div className="landing__cta">
            <button className="primary" onClick={() => onStartSingle(voyages[0].id)}>
              Començar l&apos;aventura
              <ArrowRight size={18} />
            </button>
            <button className="secondary" onClick={onStartCompare}>
              Veure tots els viatges
            </button>
          </div>
        </div>
        <div className="landing__visual" aria-hidden>
          <div className="globe" />
          <div className="orbit orbit--one" />
          <div className="orbit orbit--two" />
          <div className="ship" />
        </div>
      </header>

      <section className="landing__cards" aria-label="Selecció de viatges">
        {voyages.map((voyage) => {
          const Icon = getIcon(voyage.meta.icon);
          return (
            <article
              key={voyage.id}
              className="landing__card"
              style={{ backgroundImage: voyage.meta.theme.gradient }}
            >
              <header>
                <span className="landing__pill">{voyage.meta.shortTitle}</span>
                <Icon size={40} strokeWidth={1.5} />
              </header>
              <h2>{voyage.title}</h2>
              <p>{voyage.meta.summary}</p>
              <footer>
                <button className="ghost" onClick={() => onStartSingle(voyage.id)}>
                  Explorar
                  <ArrowRight size={16} />
                </button>
              </footer>
            </article>
          );
        })}
      </section>

      <section className="landing__compare">
        <div>
          <h3>Comparativa instantània</h3>
          <p>Superposa rutes, ritmes i conflictes per analitzar l&apos;impacte de cada expedició.</p>
        </div>
        <button className="primary ghost" onClick={onStartCompare}>
          Activar vista comparativa
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
};

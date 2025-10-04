import { ArrowRight } from "lucide-react";
import type { FC } from "react";

import { getIcon } from "./IconFactory";
import type { Voyage, VoyageId } from "../types";

const HERO_IMAGE = "/assets/colon.avif";

const CARD_TITLES: Record<VoyageId, string> = {
  viatge1: "Caravel·la",
  viatge2: "Fortalesa",
  viatge3: "Riu Orinoco",
  viatge4: "Naufragi",
};

interface LandingViewProps {
  voyages: Voyage[];
  onStartSingle: (voyageId: VoyageId) => void;
  onStartCompare: () => void;
}

export const LandingView: FC<LandingViewProps> = ({ voyages, onStartSingle, onStartCompare }) => {
  const defaultVoyage = voyages[0];

  return (
    <div className="landing landing--fullscreen">
      <header className="landing__hero">
        <div className="landing__intro">
          <h1>Els viatges de Colom: de la glòria al naufragi</h1>
          <p>
            Endinsa&apos;t en els quatre viatges transoceànics de Cristòfor Colom amb mapes interactius, línia de temps i
            recursos per treballar a l&apos;aula.
          </p>
          <div className="landing__cta">
            {defaultVoyage && (
              <button className="primary" onClick={() => onStartSingle(defaultVoyage.id)}>
                Comença l&apos;aventura
                <ArrowRight size={18} />
              </button>
            )}
            <button className="secondary" onClick={onStartCompare}>
              Veure tots els viatges
            </button>
          </div>
        </div>
        <figure className="landing__visual" aria-hidden>
          <div className="landing__visual-glow" />
          <img src={HERO_IMAGE} alt="Retrat artístic de Cristòfor Colom" />
        </figure>
      </header>

      <section className="landing__cards" aria-label="Selecció de viatges">
        {voyages.map((voyage) => {
          const Icon = getIcon(voyage.meta.icon);
          const cardTitle = CARD_TITLES[voyage.id] ?? voyage.meta.shortTitle;
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
              <h2 className="landing__card-title">{cardTitle}</h2>
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
    </div>
  );
};

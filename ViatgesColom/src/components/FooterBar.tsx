import type { FC } from "react";

const LICENSE_URL = "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca";
const BADGE_URL = "https://github.com/felipsarroca/imatges/raw/main/CC_BY-NC-SA.svg";

export const FooterBar: FC = () => (
  <footer className="app-footer">
    <div>
      <span>Aplicació creada per Felip Sarroca amb l&apos;assistència de la IA</span>
    </div>
    <div className="app-footer__license">
      <span>Obra sota llicència </span>
      <a href={LICENSE_URL} target="_blank" rel="noreferrer">
        CC BY-NC-SA 4.0
      </a>
      <img src={BADGE_URL} alt="Llicència Creative Commons BY-NC-SA" />
    </div>
  </footer>
);

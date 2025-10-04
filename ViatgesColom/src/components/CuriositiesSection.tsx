import type { FC } from "react";

interface CuriosityItem {
  text: string;
  source: string;
}

interface CuriositiesSectionProps {
  items: CuriosityItem[];
}

export const CuriositiesSection: FC<CuriositiesSectionProps> = ({ items }) => {
  if (!items.length) {
    return null;
  }
  return (
    <section className="panel__curiosities">
      <h3>Sabies que...</h3>
      <ul>
        {items.map((item, index) => (
          <li key={`${item.source}-${index}`}>
            <p>{item.text}</p>
            <span>{item.source}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

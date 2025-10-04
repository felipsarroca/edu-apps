import { Medal, RotateCcw } from "lucide-react";
import type { FC } from "react";
import { useMemo, useState } from "react";

import { quizBank } from "../../data/quiz";
import type { QuizMode, VoyageId } from "../../types";

interface QuizSectionProps {
  voyageId: VoyageId;
  voyageTitle: string;
}

interface QuizState {
  mode: QuizMode;
  index: number;
  score: number;
  selected: number | null;
  revealed: boolean;
}

const initialState = (): QuizState => ({ mode: "intro", index: 0, score: 0, selected: null, revealed: false });

export const QuizSection: FC<QuizSectionProps> = ({ voyageId, voyageTitle }) => {
  const questions = useMemo(() => quizBank[voyageId] ?? [], [voyageId]);
  const [state, setState] = useState<QuizState>(() => initialState());

  if (!questions.length) {
    return null;
  }

  const { mode, index, score, selected, revealed } = state;
  const currentQuestion = questions[index];

  const handleStart = () => {
    setState({ mode: "question", index: 0, score: 0, selected: null, revealed: false });
  };

  const handleSelect = (optionIndex: number) => {
    if (mode !== "question" || revealed) {
      return;
    }
    setState((prev) => ({ ...prev, selected: optionIndex }));
  };

  const handleValidate = () => {
    if (selected === null || revealed) {
      return;
    }
    const isCorrect = selected === currentQuestion.correctIndex;
    setState((prev) => ({
      ...prev,
      revealed: true,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) {
      setState((prev) => ({ ...prev, mode: "finished" }));
      return;
    }
    setState((prev) => ({ mode: "question", index: nextIndex, score: prev.score, selected: null, revealed: false }));
  };

  const handleReset = () => {
    setState(initialState());
  };

  if (mode === "intro") {
    return (
      <section className="panel__quiz" aria-labelledby="quiz-title">
        <h3 id="quiz-title">Quiz exprés</h3>
        <p>
          Repassa els punts clau del {voyageTitle}. Respon les {questions.length} preguntes i guanya la medalla
          d&apos;explorador.
        </p>
        <button className="primary" onClick={handleStart}>
          Començar
        </button>
      </section>
    );
  }

  if (mode === "finished") {
    const success = score === questions.length;
    return (
      <section className="panel__quiz">
        <h3>Medalla virtual</h3>
        <div className={`quiz__medal ${success ? "quiz__medal--gold" : "quiz__medal--silver"}`}>
          <Medal size={32} />
          <strong>
            {score} / {questions.length}
          </strong>
        </div>
        <p>{success ? "Genial! Domines tots els punts clau." : "Bona feina! Pots repetir per millorar la puntuació."}</p>
        <button className="ghost" onClick={handleReset}>
          <RotateCcw size={16} />
          Torna a jugar
        </button>
      </section>
    );
  }

  return (
    <section className="panel__quiz" aria-live="polite">
      <h3>Pregunta {index + 1} de {questions.length}</h3>
      <p className="quiz__prompt">{currentQuestion.prompt}</p>
      <div className="quiz__options">
        {currentQuestion.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          let status: "neutral" | "correct" | "incorrect" = "neutral";
          if (revealed) {
            if (optionIndex === currentQuestion.correctIndex) {
              status = "correct";
            } else if (isSelected) {
              status = "incorrect";
            }
          }
          return (
            <button
              key={option}
              className={`quiz__option ${isSelected ? "is-selected" : ""} quiz__option--${status}`.trim()}
              onClick={() => handleSelect(optionIndex)}
            >
              {option}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="quiz__feedback">
          <p>{currentQuestion.rationale}</p>
          <div className="quiz__actions">
            <button className="primary" onClick={handleNext}>
              {index + 1 === questions.length ? "Finalitzar" : "Següent"}
            </button>
          </div>
        </div>
      )}
      {!revealed && (
        <div className="quiz__actions">
          <button className="primary" onClick={handleValidate} disabled={selected === null}>
            Comprova
          </button>
        </div>
      )}
    </section>
  );
};

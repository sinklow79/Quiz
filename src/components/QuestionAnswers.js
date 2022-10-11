import { useEffect, useState, memo, useCallback, useRef } from "react";
import styled from "styled-components";
import Answer from "./Answer";

const QuestionAnswers = memo(
  ({
    data,
    checkAnswers,
    idx,
    handleChosenAnswers,
    missing,
    updateCorrectAnswers,
  }) => {
    const [randomizedAnswer, setRandomizedAnswer] = useState({
      randomized: false,
      answers: [...data.incorrectAnswers, data.correctAnswer],
    });
    const [chosenAnswer, setChosenAnswer] = useState("");

    useEffect(() => {
      const newAnswers = [...randomizedAnswer.answers];
      for (let i = 0; i < newAnswers.length; i++) {
        let random = Math.floor(Math.random() * newAnswers.length);
        [newAnswers[i], newAnswers[random]] = [
          newAnswers[random],
          newAnswers[i],
        ];
      }
      setRandomizedAnswer({
        randomized: true,
        answers: newAnswers,
      });
    }, []);

    useEffect(() => {
      if (chosenAnswer) {
        handleChosenAnswers(idx, "add");
      } else {
        handleChosenAnswers(idx, "delete");
      }
    }, [chosenAnswer, handleChosenAnswers, idx]);

    useEffect(() => {
      if (checkAnswers && data.correctAnswer === chosenAnswer) {
        updateCorrectAnswers();
      }
    }, [checkAnswers, updateCorrectAnswers, data.correctAnswer, chosenAnswer]);

    const handleClick = useCallback(
      (answer) => {
        if (!checkAnswers && chosenAnswer !== answer) {
          setChosenAnswer(answer);
        } else {
          setChosenAnswer("");
        }
      },
      [checkAnswers, chosenAnswer, setChosenAnswer]
    );

    return (
      <QuestionAnswersContainer missing={missing}>
        <Question>{data.question}</Question>
        <Answers>
          {randomizedAnswer.randomized &&
            randomizedAnswer.answers.map((answer) => (
              <Answer
                key={answer}
                handleClick={handleClick}
                id={
                  checkAnswers && answer === data.correctAnswer
                    ? "correct"
                    : checkAnswers &&
                      answer === chosenAnswer &&
                      answer !== data.correctAnswer
                    ? "incorrect"
                    : answer === chosenAnswer
                    ? "chosen"
                    : checkAnswers && answer !== chosenAnswer
                    ? "unchosen"
                    : ""
                }
                val={answer}
              />
            ))}
        </Answers>
      </QuestionAnswersContainer>
    );
  }
);

const QuestionAnswersContainer = styled.div`
  border-bottom: 2px solid
    ${(props) =>
      props.missing ? "rgba(255, 168, 168, 1)" : "rgba(219, 222, 240, 1)"};
  margin-bottom: 15px;
`;

const Question = styled.h2`
  user-select: none;
  font-weight: 700;
  font-size: 21px;
  margin-bottom: 12px;
`;
const Answers = styled.ul`
  display: flex;
  column-gap: 13px;
`;

export default QuestionAnswers;

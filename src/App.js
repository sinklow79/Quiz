import "./App.css";
import { useCallback, useEffect, useReducer } from "react";
import QuestionAnswers from "./components/QuestionAnswers";
import styled from "styled-components";

const initialState = {
  api: [],
  checkAnswers: false,
  missing: new Set(),
  chosenAnswers: new Set(),
  correctAnswers: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "api":
      return { ...state, api: action.data };
    case "checkAnswers":
      return { ...state, checkAnswers: !state.checkAnswers };
    case "handleChosenAnswers":
      const newChosenAnswers = new Set(state.chosenAnswers);
      if (action.action === "add") {
        newChosenAnswers.add(action.idx);
      } else {
        newChosenAnswers.delete(action.idx);
      }
      return { ...state, chosenAnswers: newChosenAnswers };
    case "sendMissing":
      const newMissing = new Set();
      for (let i = 0; i < state.api.length; i++) {
        if (!state.chosenAnswers.has(i)) {
          newMissing.add(i);
        }
      }
      return { ...state, missing: newMissing };
    case "restart":
      return { ...initialState, api: action.api };
    case "addToCorrectAnswers":
      return { ...state, correctAnswers: state.correctAnswers + 1 };
  }
};

function App() {
  const [
    { api, checkAnswers, missing, chosenAnswers, correctAnswers },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch("https://the-trivia-api.com/api/questions?limit=6&difficulty=easy")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "api", data: data }));
  }, []);

  const handleChosenAnswers = useCallback(
    (idx, action) => {
      dispatch({ type: "handleChosenAnswers", idx, action });
    },
    [dispatch]
  );

  const handleButtonClick = useCallback(() => {
    if (chosenAnswers.size !== api.length) {
      dispatch({ type: "sendMissing" });
    } else {
      dispatch({ type: "checkAnswers" });
    }
  }, [dispatch, chosenAnswers.size, api.length]);

  const updateCorrectAnswers = useCallback(() => {
    dispatch({ type: "addToCorrectAnswers" });
  }, [dispatch]);

  if (!api) {
    return <>LOADING....</>;
  }

  return (
    <AppContainer>
      {api &&
        api.map((data, i) => (
          <QuestionAnswers
            data={data}
            key={data.id}
            checkAnswers={checkAnswers}
            idx={i}
            handleChosenAnswers={handleChosenAnswers}
            missing={missing.has(i)}
            updateCorrectAnswers={updateCorrectAnswers}
          />
        ))}
      <ButtonContainer>
        {!checkAnswers ? (
          <Button onClick={handleButtonClick}>Check Answers</Button>
        ) : (
          <>
            <GameResults>
              You scored {correctAnswers}/{api.length} answers.
            </GameResults>
            <Button
              onClick={() => {
                fetch(
                  "https://the-trivia-api.com/api/questions?limit=6&difficulty=easy"
                )
                  .then((res) => res.json())
                  .then((data) => dispatch({ type: "restart", api: data }));
              }}
            >
              PLAY AGAIN!
            </Button>
          </>
        )}
      </ButtonContainer>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  max-width: 600px;
  padding: 0 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  background-color: rgba(77, 91, 158, 1);
  color: #fff;
  border-radius: 10px;
  padding: 11px 18px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-left: 30px;
`;

const GameResults = styled.p`
  font-size: "18px";
  font-weight: "700";
`;

export default App;

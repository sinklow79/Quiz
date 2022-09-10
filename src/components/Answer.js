import styled from "styled-components";

const Answer = ({ handleClick, val, id }) => {
  return <AnswerContainer onClick={() => handleClick(val)} id={id}>{val}</AnswerContainer>;
};

const AnswerContainer = styled.p`
  user-select: none;
  transition: background-color 0.2s ease;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid rgba(77, 91, 158, 1);
  padding: 3px 9px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default Answer;

import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Dot } from "@styled-icons/octicons";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [validatedQuestions, setValidatedQuestions] = useState([]);
  const [showValidatedQuestions, setShowValidatedQuestions] = useState(false);

  let path = "http://localhost:3000";

  useEffect(() => {
    axios
      .get(path + "/questions-false")
      .then((response) => setQuestions(response.data))
      .catch((error) => console.error(error));

    axios
      .get(path + "/questions-true")
      .then((response) => setValidatedQuestions(response.data))
      .catch((error) => console.error(error));
  }, []);

  const validateQuestion = async (id) => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: path + "/validate/" + id,
      headers: {},
    };
    console.log(path + "/validate/" + id);
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const validatedQuestion = questions.find(
          (question) => question.id === id
        );
        setValidatedQuestions([...validatedQuestions, validatedQuestion]);
        setQuestions(questions.filter((question) => question.id !== id));
      })
      .catch((error) => {
        console.log(":(\n" + error);
      });
  };

  const unvalidateQuestion = async (id) => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: path + "/unvalidate/" + id,
      headers: {},
    };
    console.log(path + "/unvalidate/" + id);
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const questionToUnvalidate = validatedQuestions.find(
          (question) => question.id === id
        );
        console.log(questionToUnvalidate);
        setQuestions([...questions, questionToUnvalidate]);
        setValidatedQuestions(
          validatedQuestions.filter((question) => question.id !== id)
        );
      })
      .catch((error) => {
        console.log(":(\n" + error);
      });
  };

  const renderQuestion = (question) => (
    <ListItem key={question.id}>
      <Id>{question.id}</Id>
      <Question>
        {question.question}
        {showValidatedQuestions && (
          <RedZap
            size={20}
            onClick={() => {
              unvalidateQuestion(question.id);
            }}
          />
        )}
        {!showValidatedQuestions && (
          <RedZap
            size={20}
            onClick={() => {
              validateQuestion(question.id);
            }}
          />
        )}
      </Question>
      <Name>{question.name}</Name>
    </ListItem>
  );

  return (
    <Container>
      <Title>Questions</Title>
      <Button
        onClick={() => setShowValidatedQuestions(!showValidatedQuestions)}
      >
        {showValidatedQuestions
          ? "Voir les questions non validées"
          : "Voir les questions validées"}
      </Button>
      <List>
        {!showValidatedQuestions && questions.map(renderQuestion)}
        {showValidatedQuestions && validatedQuestions.map(renderQuestion)}
      </List>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #232946;
`;

const RedZap = styled(Dot)`
  size: 2;
  color: red;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const List = styled.ul`
  width: 100%;
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 20px;
  border-bottom: 1px solid #ccc;
`;

const Button = styled.button`
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  border: 2px solid #000;
  border-radius: 4px;
  color: #fff;
  background-color: #000;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #000;
    background-color: #fff;
  }
`;

const Id = styled.h3`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #b8c1ec;
`;

const Question = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #eebbc3;
`;

// const Status = styled.p`
//   font-size: 16px;
//   margin-bottom: 5px;
// `;

const Name = styled.p`
  font-size: 16px;
  color: #b8c1ec;
`;

export default Home;

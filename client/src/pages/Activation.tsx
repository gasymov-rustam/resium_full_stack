import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { ACTIVATE_USER } from "../apollo/query/user";

interface QuizParams {
  link: string;
}

export const Activation = () => {
  const { link } = useParams<QuizParams>();

  const { data } = useQuery(ACTIVATE_USER, {
    variables: {
      activationLink: link,
    },
  });

  return <></>;
};

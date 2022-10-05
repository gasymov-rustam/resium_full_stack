import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser($input: UserInput!) {
    registerUser(input: $input) {
      accessToken
      user {
        id
        email
        isActivated
        activationLink
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: UserInput!) {
    loginUser(input: $input) {
      accessToken
      user {
        id
        email
        isActivated
        activationLink
      }
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser {
      email
    }
  }
`;

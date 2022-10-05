import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    refreshUser: AuthResponse
    activationUser(activationLink: String): UserActivation
  }

  extend type Mutation {
    registerUser(input: UserInput!): AuthResponse!
    loginUser(input: UserInput!): AuthResponse!
    logoutUser: LogOutResponse
  }

  input UserInput {
    email: String @constraint(minLength: 5, format: "email")
    password: String @constraint(minLength: 5, maxLength: 20)
  }

  type User {
    id: ID
    email: String
    activationLink: String
    isActivated: Boolean
  }

  type UserActivation {
    activationLink: String
  }

  type AuthResponse {
    user: User!
    refreshToken: String!
    accessToken: String!
  }

  type LogOutResponse {
    email: String
  }
`;

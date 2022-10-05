import { gql } from "@apollo/client";

export const REFRESH_USER = gql`
  query RefreshUser {
    refreshUser {
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

export const ACTIVATE_USER = gql`
  query ActivateUser($activationLink: String) {
    activationUser(activationLink: $activationLink) {
      activationLink
    }
  }
`;

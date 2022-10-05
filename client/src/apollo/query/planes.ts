import { gql } from "@apollo/client";

export const GET_ALL_PLANES = gql`
  query getAllPlanes {
    getAllPlanes {
      id
      name
      timeStepInSeconds
      color
      size
      radius
      targetCoords {
        longitude
        latitude
        height
      }
      flightWay {
        latitude
        longitude
        height
      }
    }
  }
`;

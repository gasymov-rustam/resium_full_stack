import { gql } from "@apollo/client";

export const PlaneData = gql`
  fragment PlaneFragment on PlaneModel {
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
`;

export const CREATE_PLANE = gql`
  mutation createPlane($input: PlaneInput) {
    createPlane(input: $input) {
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

export const UPDATE_PLANE = gql`
  mutation updatePlane($input: PlaneInput) {
    updatePlane(input: $input) {
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

export const DELETE_PLANE = gql`
  mutation deletePlane($id: ID) {
    deletePlane(id: $id) {
      id
    }
  }
`;

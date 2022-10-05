import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllPlanes: [Plane!]!
    getPlane(id: ID): Plane!
  }

  extend type Mutation {
    createPlane(input: PlaneInput): Plane!
    updatePlane(input: PlaneInput): Plane!
    deletePlane(id: ID): PlaneID!
  }

  type PlaneID {
    id: ID
  }

  input CoordsInput {
    longitude: Float
    latitude: Float
    height: Int
  }

  input PlaneInput {
    userId: ID
    id: ID
    name: String
    color: String
    size: Int
    timeStepInSeconds: Int
    radius: Int
    targetCoords: CoordsInput
    flightWay: [CoordsInput]
  }

  type Coords {
    longitude: Float
    latitude: Float
    height: Int
  }

  type Plane {
    userId: ID
    id: ID
    name: String!
    color: String!
    size: Int
    timeStepInSeconds: Int
    radius: Int
    targetCoords: Coords
    flightWay: [Coords]
    createdAt: String
    updatedAt: String
  }
`;

import { makeExecutableSchema } from "@graphql-tools/schema";
import { constraintDirective, constraintDirectiveTypeDefs } from "graphql-constraint-directive";
import { typeDefs, resolvers } from "../src/graphql";

export let schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
  resolvers,
});
schema = constraintDirective()(schema);

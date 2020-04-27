import { ApolloServer, gql } from "apollo-server";
import * as path from "path";
import * as fs from "fs";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";
import { Resolvers } from "./types";
import House from "./models/House";
import Street from "./models/Street";
import * as mongoose from "mongoose";

const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql"));

const resolvers: Resolvers = {
  Mutation: {
    addHouse: (_, { input }) => <any>new House(input).save(),
    addStreet: (_, { input }) => <any>new Street(input).save(),
  },
  Street: {
    id: (street) => ((street as any)._id as any) + "",
    houses: async (street) =>
      <any>House.find({ street: (street as any)._id as any }),
  },
  House: {
    id: (house) => ((house as any)._id as any) + "",
    street: async (house) => <any>Street.findById(house.street),
  },
  Query: {
    street: (_, { id }) => <any>Street.findById(id),
  },
};

mongoose.connect(`mongodb://localhost:27017/c8wc213k_test`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

new ApolloServer({
  resolvers,
  typeDefs: [DIRECTIVES, gql(`${typeDefs}`)],
})
  .listen()
  .then(({ port }) => {
    console.log(`App started at localhost:${port}`);
  });

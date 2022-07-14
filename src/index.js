import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer, gql } from "apollo-server";

/*
  Example query:

  query {
    project(id:1) {
      brochureUrl
      masterplanUrl
    }
  }

  Use id=1 for masterplanUrl error
  Use id=2 for brochureUrl error
  Use id=10 for both masterplanUrl & brochureUrl error
*/

// Schema defined using the SDL
const typeDefs = gql`
  type Query {
    hello: String
    project(id: Int!): Project
  }

  type Project {
    masterplanUrl: String
    brochureUrl: String
  }

  type Mutation {
    doSomething(message: String!): String!
  }
`;

// Resolver implementations
const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return "Hello world!";
    },
    project: (root, { id }) => {
      return { id };
    }
  },
  Project: {
    masterplanUrl: (root, args, context) => {
      if (root.id === 1 || root.id === 10) {
        throw Error("Simulating a masterplanUrl resolver error");
      }
      return "https://example.org/foo.pdf";
    },
    brochureUrl: (root, args, context) => {
      if (root.id === 2 || root.id === 10) {
        throw Error("Simulating a brochureUrl resolver error");
      }
      return "https://example.org/foo.pdf";
    }
  },
  Mutation: {
    doSomething: (root, args, context) => {
      return `You said to do ${args.message}`;
    }
  }
};

// spin the server up - enable playground & introspection
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
});

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

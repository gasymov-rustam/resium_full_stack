import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  fromPromise,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { clearResults, setCredentials } from "../features/authSlice/authSlice";
import { REFRESH_USER } from "../apollo/query/user";
import { store } from "../app/store";

const getNewToken = async () => {
  try {
    const response = await client.query({
      query: REFRESH_USER,
      fetchPolicy: "network-only",
    });
    // store.dispatch(clearResults());

    const state = response.data.refreshUser;
    store.dispatch(setCredentials(state));
    return response.data;
  } catch (error) {
    console.warn(`My function ${error}`);
    return store.dispatch(clearResults());
  }
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  console.log(graphQLErrors);
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions.code === "UNAUTHENTICATED") {
        return fromPromise(
          getNewToken().catch((error) => {
            return store.dispatch(clearResults());
          })
        )
          .filter((res) => Boolean(res))
          .flatMap(({ accessToken, refreshToken }) => {
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${accessToken}`,
              },
            });
            return forward(operation);
          });
      }
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const authToken = store.getState()?.auth?.user?.accessToken;

  operation.setContext({
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return forward(operation);
});

const httplink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
  // credentials: "same-origin",
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(authMiddleware.concat(httplink)),
});

// link: concat(errorLink, concat(authLink, httplink)),
// link: errorLink.concat(authLink.concat(httplink)),
// const httplink = createHttpLink({
//   uri: "http://localhost:4000/graphql",
//   credentials: "include",
//   // credentials: "same-origin",
// });

// const authLink = setContext((_, { headers }) => {
//   console.log("headers");

//   const authToken = store.getState()?.auth?.user?.accessToken;
//   return {
//     headers: {
//       ...headers,
//       authorization: authToken ? `Bearer ${authToken}` : "",
//     },
//   };
// });
// let authToken: string;

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) {
//     graphQLErrors.forEach(({ extensions }) => {
//       console.log("graphql what should to do", extensions);
//       // return getNewToken().then((resp) => console.log("newtoken", resp));
//       return fromPromise(
//         getNewToken()
//           .catch((error) => {
//             console.log("9999999", error);

//             return store.dispatch(clearResults());
//           })
//           .then((resp) => {
//             authToken = resp.refreshUser?.accessToken;
//             store.dispatch(setCredentials(resp.refreshUser));
//             // console.log("promise", newToken);
//           })
//       );
//       // .filter((value) => {
//       // .flatMap(({ accessToken, refreshToken }) => {
//       //               const oldHeaders = operation.getContext().headers;
//       //               operation.setContext({
//       //                 headers: {
//       //                   ...oldHeaders,
//       //                   authorization: `Bearer ${accessToken}`,
//       //                 },
//       //               });
//       //               return forward(operation);
//       //             });
//       // value;
//       // });
//     });
//   }
//   if (networkError) {
//     console.log("network status code 401", networkError);
//   }
// });

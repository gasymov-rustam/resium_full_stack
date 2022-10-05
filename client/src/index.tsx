import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { App } from "./components/App";
import { ApolloProvider } from "@apollo/client";
import { client } from "./utils/createApolloClient";

import "./index.css";
import "./resets.css";

// const server = store.getState().server.isApolloServer;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// const httplink = createHttpLink({
//   uri: "http://localhost:4000/graphql",
//   credentials: "include",
//   // credentials: "same-origin",
// });

// const authLink = setContext((_, { headers }) => {
//   const authToken = store.getState()?.auth?.user?.accessToken;
//   return {
//     headers: {
//       ...headers,
//       authorization: authToken ? `Bearer ${authToken}` : "",
//     },
//   };
// });

// const client = new ApolloClient({
//   link: authLink.concat(httplink),
//   cache: new InMemoryCache(),
// });

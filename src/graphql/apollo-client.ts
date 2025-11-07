// src/lib/apollo.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

const url = import.meta.env.VITE_GRAPHQL_URL;
const http = new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL });

const auth = new ApolloLink((operation, forward) => {
    // const token = localStorage.getItem("token");
    // operation.setContext(({ headers = {} }) => ({
    //     headers: { ...headers, authorization: token ? `Bearer ${token}` : "" },
    // }));
    return forward(operation);
});

const linkChain = ApolloLink.from([auth, http]);

export const apolloClient = new ApolloClient({
    link: auth.concat(http),
    // link: linkChain,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
            fetchPolicy: 'cache-first',
        },
        query: {
            errorPolicy: 'all',
            fetchPolicy: 'cache-first',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});

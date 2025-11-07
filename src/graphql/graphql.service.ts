// src/services/graphqlService.ts
import type { DocumentNode } from '@apollo/client';
import { apolloClient } from './apollo-client';

export class GraphQLService {
    static async query<T = any>(
        query: DocumentNode,
        variables?: any
    ): Promise<any> {
        try {
        const result = await apolloClient.query({
            query,
            variables,
            fetchPolicy: 'cache-first',
        });
        return result;
        } catch (error) {
        console.error('GraphQL Query Error:', error);
        throw error;
        }
    }

    static async mutate<T = any>(
        mutation: DocumentNode,
        variables?: any
    ): Promise<any> {
        try {
        const result = await apolloClient.mutate({
            mutation,
            variables,
        });
        return result;
        } catch (error) {
        console.error('GraphQL Mutation Error:', error);
        throw error;
        }
    }
}
import { gql } from '@apollo/client';


export const REGISTER_USER = gql`
    mutation Register($input: RegisterInput!) {
        register(input: $input) {
            id
            name
            email
        }
    }
`;
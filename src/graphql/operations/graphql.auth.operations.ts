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

export const LOGIN_USER = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            refreshToken
            token
            user {
                id
                name
                email
            }
        }
    }
`;

export const REFRESH_TOKEN = gql`
    mutation RefreshToken($input: RefreshTokenInput!) {
        refreshToken(input: $input) {
            token
            refreshToken
        }
    }
`;

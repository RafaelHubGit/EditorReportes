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
                active
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

export const GET_ALL_USERS = gql`
    query GetUsers {
        users {
            id
            name
            email
            active
            createdAt
        }
    }
`;

export const TOGGLE_USER_STATUS = gql`
    mutation ToggleUserStatus($id: ID!, $active: Boolean!) {
        toggleUserStatus(id: $id, active: $active) {
            id
            active
        }
    }
`;

export const RESET_USER_PASSWORD = gql`
    mutation ResetUserPassword($id: ID!) {
        resetUserPassword(id: $id)
    }
`;
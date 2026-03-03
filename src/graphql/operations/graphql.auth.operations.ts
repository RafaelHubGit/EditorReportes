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

export const REQUEST_PASSWORD_RECOVERY = gql`
    mutation RequestPasswordRecovery($email: String!) {
        requestPasswordRecovery(email: $email)
    }
`;

export const RESET_PASSWORD_WITH_TOKEN = gql`
    mutation ResetPasswordWithToken($token: String!, $newPassword: String!) {
        resetPasswordWithToken(token: $token, newPassword: $newPassword)
    }
`;

export const VERIFY_EMAIL = gql`
    mutation VerifyEmail($token: String!) {
        verifyEmail(token: $token)
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
                is_verified
                isAdmin
                createdAt
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

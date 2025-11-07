import { gql } from '@apollo/client';


export const GET_FOLDERS = gql`
    query Folders {
        folders {
            id
            name
            description
            color
            createdAt
            updatedAt
        } 
    }
`;
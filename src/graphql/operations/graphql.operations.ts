import { gql } from '@apollo/client';
import type { IFolder } from '../../interfaces/IGeneric';

export const folderFieldsInput: (keyof IFolder)[] = ['name', 'description', 'owner', 'icon', 'color'];


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

export const CREATE_FOLDER = gql`
    mutation CreateFolder($input: FolderInput! ) {
        createFolder(input: $input) {
            id
            name
            description
            color
            icon
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_FOLDER = gql`
    mutation UpdateFolder($id: ID!, $input: FolderInput!) {
        updateFolder(id: $id, input: $input) {
            id
            name
            description
            color
            icon
            createdAt
            updatedAt
        }
    }
`;
import { gql } from '@apollo/client';
import type { IDocument, IFolder } from '../../interfaces/IGeneric';

export const folderFieldsInput: (keyof IFolder)[] = ['name', 'description', 'owner', 'icon', 'color'];

export const documentFieldsInput: (keyof IDocument)[] = ['css', 'html', 'jsonData', 'name', 'owner', 'createdAt', 'updatedAt', 'folderId', 'id'];

export const CREATE_TEMPLATE = gql`
    mutation CreateTemplate($input: TemplateInput! ) {
        createTemplate(input: $input) {
            id
            name
            css
            html
            sampleData
        }
    }
`;


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
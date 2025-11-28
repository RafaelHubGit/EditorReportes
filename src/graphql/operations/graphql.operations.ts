import { gql } from '@apollo/client';
import type { IFolder } from '../../interfaces/IGeneric';
import type { IDocument } from '../../interfaces/IGeneric';

export const folderFieldsInput: (keyof IFolder)[] = ['name', 'description', 'owner', 'icon', 'color'];
export const documentFieldsInput: (keyof IDocument)[] = ['name', 'html', 'css', 'sampleData'];


export const CREATE_DOCUMENT = gql`
    mutation createTemplate($input: TemplateInput!) {
        createTemplate(input: $input) {
            id
            html
            css
            name
            sampleData
            status
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
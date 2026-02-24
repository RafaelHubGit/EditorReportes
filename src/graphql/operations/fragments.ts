import { gql } from "@apollo/client";

export const DOCUMENT_FIELDS_FRAGMENT = gql`
    fragment DocumentFields on Template {
        id
        name
        html
        css
        htmlHeader
        htmlFooter
        cssHeader
        cssFooter
        pageConfig{
            format
            height
            landscape
            margin{
                top
                right
                bottom
                left
            }
            unit
            width
        }
        jsonSchema
        sampleData
        owner
        folderId
        status
        tags
        createdAt
        updatedAt
        userCreated
        userUpdated
    }
`;


export const FOLDER_FIELDS_FRAGMENT = gql`
    fragment FolderFields on Folder {
        id
        name
        description
        owner
        icon
        color
        isShared
        sharedWith
        createdAt
        updatedAt
    } 
`;
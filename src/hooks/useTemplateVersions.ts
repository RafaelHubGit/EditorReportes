import { useMutation, useQuery } from '@apollo/client/react';
import { useCallback } from 'react';
import {
    GET_TEMPLATE_VERSIONS,
    PUBLISH_TEMPLATE,
    CREATE_DRAFT,
    DELETE_TEMPLATE_VERSION,
} from '../graphql/operations/graphql.operations';
import type { IDocument } from '../interfaces/IGeneric';

/**
 * Hook para gestionar el historial de versiones de una plantilla.
 * @param parentId - ID padre del grupo de versiones (puede ser null si aún no está disponible).
 */
export const useTemplateVersions = (parentId?: string | null) => {

    // ── Queries ──────────────────────────────────────────────────────────────
    const {
        data,
        loading: loadingVersions,
        error: versionsError,
        refetch: refetchVersions
    } = useQuery<{ templateVersions: IDocument[] }>(GET_TEMPLATE_VERSIONS, {
        variables: { parentId },
        skip: !parentId,
        fetchPolicy: 'network-only',
    });

    const versions: IDocument[] = data?.templateVersions ?? [];

    // ── Mutations ─────────────────────────────────────────────────────────────
    const [publishTemplateMutation, { loading: publishing }] = useMutation(PUBLISH_TEMPLATE, {
        onCompleted: () => refetchVersions(),
    });

    const [createDraftMutation, { loading: creatingDraft }] = useMutation(CREATE_DRAFT, {
        onCompleted: () => refetchVersions(),
    });

    const [deleteVersionMutation, { loading: deletingVersion }] = useMutation(DELETE_TEMPLATE_VERSION, {
        onCompleted: () => refetchVersions(),
    });

    // ── Acciones ──────────────────────────────────────────────────────────────

    /**
     * Publica el draft actual a producción.
     * @param comment Comentario obligatorio describiendo los cambios.
     */
    const publishTemplate = useCallback(async (comment: string) => {
        if (!parentId) throw new Error('parentId is required to publish');
        await publishTemplateMutation({
            variables: { parentId, input: { comment } },
        });
    }, [parentId, publishTemplateMutation]);

    /**
     * Crea un borrador a partir de cualquier versión.
     * @param templateId ID de la versión origen (producción, histórica o draft).
     */
    const createDraft = useCallback(async (templateId: string) => {
        await createDraftMutation({ variables: { templateId } });
    }, [createDraftMutation]);

    /**
     * Elimina una versión del historial (no puede ser producción).
     * @param versionId ID del documento de versión a eliminar.
     */
    const deleteVersion = useCallback(async (versionId: string) => {
        await deleteVersionMutation({ variables: { id: versionId } });
    }, [deleteVersionMutation]);

    // ── Derivados ─────────────────────────────────────────────────────────────
    const productionVersion = versions.find(v => v.is_production);
    const draftVersion = versions.find(v => v.is_draft);
    const historicalVersions = versions.filter(v => !v.is_production && !v.is_draft);
    const hasDraft = !!draftVersion;

    return {
        versions,
        productionVersion,
        draftVersion,
        historicalVersions,
        hasDraft,
        loadingVersions,
        versionsError,
        publishing,
        creatingDraft,
        deletingVersion,
        refetchVersions,
        publishTemplate,
        createDraft,
        deleteVersion,
    };
};

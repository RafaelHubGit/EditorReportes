import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
// NO importamos Swal aquí. El store debe ser "ciego" a la UI.

import { 
    GET_API_KEY_BY_USER_ID, 
    CREATE_API_KEY, 
    RENEW_API_KEY 
} from '../graphql/operations/graphql.apiKey.operations';
import { GraphQLService } from '../graphql/graphql.service';

export interface IApiKey {
    id: string;
    userId: string;
    type: 'development' | 'production';
    apiKey: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiKeyState {
    apiKeys: IApiKey[];
    isLoading: boolean;
    error: string | null; // Agregamos manejo de errores

    // Actions
    getApiKeysByUser: (userId: string) => Promise<void>;
    
    // Cambiamos el return a la key creada o null, para que el componente sepa qué pasó
    createApiKey: (userId: string, type: 'development' | 'production') => Promise<IApiKey | null>;
    
    // Corregimos los argumentos para coincidir con tu Schema GraphQL (ApiKeyRenewInput)
    renewApiKey: (apiKey: string, type: string, userId: string) => Promise<IApiKey | null>;
    
    clearError: () => void;
}

const apiKeyStore: StateCreator<ApiKeyState, [["zustand/immer", never]]> = (set, get) => ({
    apiKeys: [],
    isLoading: false,
    error: null,

    getApiKeysByUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await GraphQLService.query(GET_API_KEY_BY_USER_ID, { userId });

            if (response?.error) throw new Error(response.error);

            const keys = response.data?.getApiKeyByUserId || [];

            set((state) => {
                state.apiKeys = keys;
                state.isLoading = false;
            });
        } catch (error: any) {
            console.error('Error fetching API Keys:', error);
            set({ isLoading: false, error: error.message || 'Error fetching keys' });
        }
    },

    createApiKey: async (userId, type) => {
        set({ isLoading: true, error: null });
        try {
            const response = await GraphQLService.mutate(CREATE_API_KEY, { 
                input: { userId, type } 
            });

            if (response?.error) throw new Error(response.error);
            const newKey = response.data?.createApiKey;

            set((state) => {
                state.apiKeys.push(newKey);
                state.isLoading = false;
            });
            
            return newKey; // Retornamos la data para que el componente lance el Swal

        } catch (error: any) {
            set({ isLoading: false, error: error.message || 'Error creating key' });
            return null;
        }
    },

    renewApiKey: async (apiKey, type, userId) => {
        set({ isLoading: true, error: null });
        try {
            // CORRECCIÓN IMPORTANTE:
            // Tu backend espera: input: { apiKey, type, userId }
            // Antes estabas enviando solo apiKeyId, lo cual fallaría.
            const response = await GraphQLService.mutate(RENEW_API_KEY, { 
                input: { apiKey, type, userId } 
            });

            if (response?.error) throw new Error(response.error);
            const renewedKey = response.data?.renewApiKey;

            set((state) => {
                // Actualizamos la lista buscando por ID o por Tipo
                const index = state.apiKeys.findIndex(k => k.type === type);
                if (index !== -1) {
                    state.apiKeys[index] = renewedKey;
                }
                state.isLoading = false;
            });

            return renewedKey;

        } catch (error: any) {
            set({ isLoading: false, error: error.message || 'Error renewing key' });
            return null;
        }
    },

    clearError: () => set({ error: null })
});

export const useApiKeyStore = create<ApiKeyState>()(
    devtools(
        immer(apiKeyStore),
        { name: 'ApiKeyStore' }
    ),
);
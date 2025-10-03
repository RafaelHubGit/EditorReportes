// components/MonacoCodeEditor.tsx
// import Editor, { OnMount } from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";

type MonacoLang = "html" | "css" | "json";

type Props = {
    value: string;
    language: MonacoLang;
    onChange: (val: string) => void;
    height?: string | number;
    schema?: object;                 // optional: JSON schema
    path?: string;
};

export default function MonacoCodeEditor({
    value,
    language,
    onChange,
    height = "100%",
    schema,
    path
}: Props) {
    const handleMount: OnMount = (editor, monaco) => {
        editor.updateOptions({
            automaticLayout: true,
            fontSize: 14,
            lineHeight: 1.5,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            minimap: { enabled: true },
            fontLigatures: true,
            renderWhitespace: "selection",
            scrollbar: {
                horizontal: "auto",       // show horizontal bar when needed
                vertical: "auto",
                useShadows: false,
            },
            // Esto activa el autocompletado básico
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            parameterHints: { enabled: true },
        });

        // Optional: wire JSON schema for validation/autocomplete
        if (language === "json" && schema) {
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                validate: true,
                allowComments: true,
                schemas: [
                {
                    uri: "inmemory://schema/documentData.json",
                    fileMatch: ["*"],
                    schema,
                },
                ],
            });
        }
    };

    return (
        <div style={{ height, minHeight: 0, overflow: "hidden" }}>
            <Editor
                // key={path ?? language}
                theme="vs-dark"
                language={language}
                value={value}
                onChange={(v) => onChange(v ?? "")}
                onMount={handleMount}
                height="100%"
                {...(path ? { path } : {})}
                keepCurrentModel={false}
                options={{
                    automaticLayout: true,
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineHeight: 1.5,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    parameterHints: { enabled: true },
                    snippetSuggestions: "top",
                    // Configuración de autocompletado
                    quickSuggestionsDelay: 100,
                    suggest: {
                        showMethods: true,
                        showFunctions: true,
                        showConstructors: true,
                        showDeprecated: true,
                        showFields: true,
                        showVariables: true,
                        showClasses: true,
                        showStructs: true,
                        showInterfaces: true,
                        showModules: true,
                        showProperties: true,
                        showEvents: true,
                        showOperators: true,
                        showUnits: true,
                        showValues: true,
                        showConstants: true,
                        showEnums: true,
                        showEnumMembers: true,
                        showKeywords: true,
                        showWords: true,
                        showColors: true,
                        showFiles: true,
                        showReferences: true,
                        showFolders: true,
                        showTypeParameters: true,
                        showSnippets: true
                    }
                }}
            />
        </div>
    );
}

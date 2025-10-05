// MonacoCodeEditor.tsx - Versión con formateo
import { useEffect } from 'react';
import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import { useCodeFormatter } from "../../hooks/useCodeFormatter";


type MonacoLang = "html" | "css" | "json";

type Props = {
    value: string;
    language: MonacoLang;
    onChange: (val: string) => void;
    height?: string | number;
    schema?: object;
    path?: string;
    onFormat?: number; // Nueva prop para formateo externo
};

export default function MonacoCodeEditor({
    value,
    language,
    onChange,
    height = "100%",
    schema,
    path,
    onFormat
}: Props) {
    const { formatCode } = useCodeFormatter();

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
                horizontal: "auto",
                vertical: "auto",
                useShadows: false,
            },
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            parameterHints: { enabled: true },
        });

        // Configurar shortcut Ctrl+Shift+F para formatear
        if (monaco) {
            editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
                () => {
                    const currentValue = editor.getValue();
                    const formatted = formatCode(currentValue, language);
                    editor.setValue(formatted);
                    onChange(formatted);
                }
            );

            // También registrar el comando nativo de formateo
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI, () => {
                editor.getAction('editor.action.formatDocument')?.run();
            });
        }

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

    useEffect(() => {
        if (onFormat) {
            handleFormat();
        }
    }, [onFormat])

    // Efecto para formateo externo (desde botón)
    const handleFormat = () => {
        const formatted = formatCode(value, language);
        onChange(formatted);
    };


    return (
        <div style={{ height, minHeight: 0, overflow: "hidden" }}>
            <Editor
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
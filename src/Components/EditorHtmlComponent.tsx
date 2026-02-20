// EditorHtmlComponent.tsx - Versión simplificada y corregida
import React, { useCallback, useState } from "react";
import { debounce } from 'lodash';
import { EditorBaseComponent } from "./EditorBaseComponent";

type Props = {
  htmlCodeprop: string;
  setHtmlCodeProp: (html: string) => void;
}

export const EditorHtmlComponent = React.memo(({
  htmlCodeprop,
  setHtmlCodeProp
}: Props) => {
  const [error, setError] = useState("");

  const debouncedProcess = useCallback(
    debounce((html: string) => {
      setHtmlCodeProp(html);
    }, 500),
    [setHtmlCodeProp]
  );

  const handleChange = useCallback((value: string) => {
    debouncedProcess(value);
  }, [debouncedProcess]);

  return (
    <EditorBaseComponent
      label="HTML"
      value={htmlCodeprop}
      onChange={handleChange}
      language="html"
      error={error}
    />
  );
});
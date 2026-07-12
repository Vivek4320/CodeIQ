"use client";

import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, foldGutter, HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { tags } from "@lezer/highlight";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { rust } from "@codemirror/lang-rust";
import { useTheme } from "@/components/landing/ThemeContext";

const languageExtensions: Record<string, any> = {
  javascript: javascript(),
  typescript: javascript({ typescript: true }),
  python: python(),
  cpp: cpp(),
  java: java(),
  rust: rust(),
  go: javascript(),
  ruby: javascript(),
};

// Language-specific completions
const languageCompletions: Record<string, { label: string; type: string; detail?: string }[]> = {
  javascript: [
    { label: "console.log", type: "method", detail: "Log to console" },
    { label: "console.error", type: "method", detail: "Log error" },
    { label: "console.warn", type: "method", detail: "Log warning" },
    { label: "setTimeout", type: "function", detail: "Execute after delay" },
    { label: "setInterval", type: "function", detail: "Repeat execution" },
    { label: "fetch", type: "function", detail: "HTTP request" },
    { label: "JSON.parse", type: "method", detail: "Parse JSON string" },
    { label: "JSON.stringify", type: "method", detail: "Stringify object" },
    { label: "Math.floor", type: "method", detail: "Round down" },
    { label: "Math.ceil", type: "method", detail: "Round up" },
    { label: "Math.random", type: "method", detail: "Random number" },
    { label: "Array.isArray", type: "method", detail: "Check if array" },
    { label: "Object.keys", type: "method", detail: "Get object keys" },
    { label: "Object.values", type: "method", detail: "Get object values" },
    { label: "Promise", type: "class", detail: "Async promise" },
    { label: "async", type: "keyword", detail: "Async function" },
    { label: "await", type: "keyword", detail: "Wait for promise" },
    { label: "function", type: "keyword" },
    { label: "const", type: "keyword" },
    { label: "let", type: "keyword" },
    { label: "var", type: "keyword" },
    { label: "return", type: "keyword" },
    { label: "if", type: "keyword" },
    { label: "else", type: "keyword" },
    { label: "for", type: "keyword" },
    { label: "while", type: "keyword" },
    { label: "switch", type: "keyword" },
    { label: "case", type: "keyword" },
    { label: "break", type: "keyword" },
    { label: "continue", type: "keyword" },
    { label: "try", type: "keyword" },
    { label: "catch", type: "keyword" },
    { label: "throw", type: "keyword" },
    { label: "new", type: "keyword" },
    { label: "class", type: "keyword" },
    { label: "extends", type: "keyword" },
    { label: "import", type: "keyword" },
    { label: "export", type: "keyword" },
    { label: "default", type: "keyword" },
    { label: "from", type: "keyword" },
    { label: "map", type: "method", detail: "Transform array" },
    { label: "filter", type: "method", detail: "Filter array" },
    { label: "reduce", type: "method", detail: "Reduce array" },
    { label: "forEach", type: "method", detail: "Iterate array" },
    { label: "find", type: "method", detail: "Find element" },
    { label: "includes", type: "method", detail: "Check inclusion" },
    { label: "indexOf", type: "method", detail: "Find index" },
    { label: "push", type: "method", detail: "Add to end" },
    { label: "pop", type: "method", detail: "Remove from end" },
    { label: "splice", type: "method", detail: "Add/remove elements" },
    { label: "split", type: "method", detail: "Split string" },
    { label: "join", type: "method", detail: "Join array" },
    { label: "replace", type: "method", detail: "Replace in string" },
    { label: "trim", type: "method", detail: "Trim whitespace" },
    { label: "length", type: "property", detail: "Get length" },
    { label: "true", type: "keyword" },
    { label: "false", type: "keyword" },
    { label: "null", type: "keyword" },
    { label: "undefined", type: "keyword" },
    { label: "typeof", type: "keyword" },
    { label: "instanceof", type: "keyword" },
  ],
  python: [
    { label: "print", type: "function", detail: "Output to console" },
    { label: "len", type: "function", detail: "Length of sequence" },
    { label: "range", type: "function", detail: "Generate range" },
    { label: "int", type: "function", detail: "Convert to integer" },
    { label: "float", type: "function", detail: "Convert to float" },
    { label: "str", type: "function", detail: "Convert to string" },
    { label: "list", type: "function", detail: "Create list" },
    { label: "dict", type: "function", detail: "Create dictionary" },
    { label: "set", type: "function", detail: "Create set" },
    { label: "tuple", type: "function", detail: "Create tuple" },
    { label: "input", type: "function", detail: "User input" },
    { label: "open", type: "function", detail: "Open file" },
    { label: "type", type: "function", detail: "Get type" },
    { label: "isinstance", type: "function", detail: "Check type" },
    { label: "enumerate", type: "function", detail: "Enumerate iterable" },
    { label: "zip", type: "function", detail: "Zip iterables" },
    { label: "map", type: "function", detail: "Map function" },
    { label: "filter", type: "function", detail: "Filter iterable" },
    { label: "sorted", type: "function", detail: "Sort iterable" },
    { label: "reversed", type: "function", detail: "Reverse iterable" },
    { label: "abs", type: "function", detail: "Absolute value" },
    { label: "max", type: "function", detail: "Maximum value" },
    { label: "min", type: "function", detail: "Minimum value" },
    { label: "sum", type: "function", detail: "Sum values" },
    { label: "round", type: "function", detail: "Round number" },
    { label: "True", type: "keyword" },
    { label: "False", type: "keyword" },
    { label: "None", type: "keyword" },
    { label: "def", type: "keyword" },
    { label: "class", type: "keyword" },
    { label: "if", type: "keyword" },
    { label: "elif", type: "keyword" },
    { label: "else", type: "keyword" },
    { label: "for", type: "keyword" },
    { label: "while", type: "keyword" },
    { label: "return", type: "keyword" },
    { label: "import", type: "keyword" },
    { label: "from", type: "keyword" },
    { label: "as", type: "keyword" },
    { label: "try", type: "keyword" },
    { label: "except", type: "keyword" },
    { label: "finally", type: "keyword" },
    { label: "raise", type: "keyword" },
    { label: "with", type: "keyword" },
    { label: "lambda", type: "keyword" },
    { label: "yield", type: "keyword" },
    { label: "pass", type: "keyword" },
    { label: "break", type: "keyword" },
    { label: "continue", type: "keyword" },
    { label: "in", type: "keyword" },
    { label: "not", type: "keyword" },
    { label: "and", type: "keyword" },
    { label: "or", type: "keyword" },
  ],
};

function createHighlightStyle(theme: any) {
  return HighlightStyle.define([
    { tag: tags.keyword, color: "#C678DD" },
    { tag: tags.operator, color: "#56B6C2" },
    { tag: tags.special(tags.variableName), color: "#E06C75" },
    { tag: tags.typeName, color: "#E5C07B" },
    { tag: tags.atom, color: "#D19A66" },
    { tag: tags.number, color: "#D19A66" },
    { tag: tags.bool, color: "#D19A66" },
    { tag: tags.definition(tags.variableName), color: "#61AFEF" },
    { tag: tags.string, color: "#98C379" },
    { tag: tags.special(tags.string), color: "#56B6C2" },
    { tag: tags.comment, color: theme.faint, fontStyle: "italic" },
    { tag: tags.variableName, color: theme.text },
    { tag: tags.local(tags.variableName), color: theme.text },
    { tag: tags.tagName, color: "#E06C75" },
    { tag: tags.bracket, color: "#ABB2BF" },
    { tag: tags.meta, color: "#ABB2BF" },
    { tag: tags.link, color: "#61AFEF", textDecoration: "underline" },
    { tag: tags.heading, color: "#E06C75", fontWeight: "bold" },
    { tag: tags.emphasis, fontStyle: "italic" },
    { tag: tags.strong, fontWeight: "bold" },
    { tag: tags.strikethrough, textDecoration: "line-through" },
    { tag: tags.self, color: "#E06C75" },
    { tag: tags.function(tags.variableName), color: "#61AFEF" },
    { tag: tags.propertyName, color: "#E06C75" },
  ]);
}

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!editorRef.current) return;

    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    });

    const highlightTheme = createHighlightStyle(theme);

    // Custom autocomplete source from language keywords
    const customCompletions = languageCompletions[language] || languageCompletions.javascript;

    const myAutocomplete = autocompletion({
      override: [
        (context) => {
          const word = context.matchBefore(/\w*/);
          if (!word || (word.from === word.to && !context.explicit)) return null;
          return {
            from: word.from,
            options: customCompletions.map((c) => ({
              label: c.label,
              type: c.type as any,
              detail: c.detail,
            })),
          };
        },
      ],
      activateOnTyping: true,
      maxRenderedOptions: 15,
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        foldGutter(),
        bracketMatching(),
        closeBrackets(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        languageExtensions[language] || javascript(),
        syntaxHighlighting(highlightTheme),
        myAutocomplete,
        updateListener,
        EditorView.lineWrapping,
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "14px",
            backgroundColor: theme.bg,
          },
          ".cm-scroller": {
            fontFamily: "var(--font-geist-mono), monospace",
            overflow: "auto",
            backgroundColor: theme.bg,
          },
          ".cm-content": {
            padding: "16px 0",
            backgroundColor: theme.bg,
            caretColor: theme.text,
          },
          ".cm-gutters": {
            backgroundColor: "transparent",
            borderRight: `1px solid ${theme.border}`,
          },
          ".cm-lineNumbers .cm-gutterElement": {
            padding: "0 12px 0 16px",
            color: theme.faint,
          },
          ".cm-activeLine": {
            backgroundColor: `${theme.accent}08`,
          },
          ".cm-activeLineGutter": {
            backgroundColor: "transparent",
          },
          "&.cm-focused .cm-cursor, .cm-cursor": {
            borderLeftColor: theme.text,
            borderLeftWidth: "2px",
            borderLeftStyle: "solid",
          },
          "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
            backgroundColor: `${theme.accent}20`,
          },
          ".cm-tooltip": {
            backgroundColor: theme.panel,
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            overflow: "hidden",
          },
          ".cm-tooltip-autocomplete > ul": {
            maxHeight: "300px",
          },
          ".cm-tooltip-autocomplete > ul > li": {
            padding: "4px 12px",
            color: theme.text,
            fontSize: "13px",
          },
          ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
            backgroundColor: `${theme.accent}20`,
            color: theme.accent,
          },
          ".cm-completionIcon": {
            color: theme.faint,
          },
          ".cm-completionDetail": {
            color: theme.faint,
            fontStyle: "normal",
            fontSize: "11px",
          },
        }),
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    requestAnimationFrame(() => {
      viewRef.current?.focus();
    });

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, [language, theme]);

  return (
    <div
      ref={editorRef}
      style={{
        height: "100%",
        overflow: "hidden",
        borderRadius: "0 0 8px 8px",
      }}
    />
  );
}

import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";

interface CodeBlockProps {
    code: string;
    language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(code.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <button
                onClick={copyToClipboard}
                className="absolute right-2 top-2 p-2 rounded-md bg-gray-700/50 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-600 focus:opacity-100 cursor-pointer"
                aria-label="Copy to clipboard"
            >
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            </button>
            <Highlight theme={themes.oneDark} code={code.trim()} language={language}>
                {({ style, tokens, getLineProps, getTokenProps }) => (
                    <pre className="p-4 rounded-lg text-sm overflow-x-auto" style={style}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                                <span className="inline-block w-8 text-gray-500 select-none text-right mr-4">{language === "bash" ? "%" : i + 1}</span>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}

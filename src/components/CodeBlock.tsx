import { Highlight, themes } from "prism-react-renderer";

interface CodeBlockProps {
    code: string;
    language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
    return (
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
    );
}

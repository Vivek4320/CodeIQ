export interface CompilerLanguage {
  slug: string;
  name: string;
  title: string;
  description: string;
  extension: string;
  sampleCode: string;
}

export const compilerLanguages: CompilerLanguage[] = [
  {
    slug: "python-compiler",
    name: "Python",
    title: "Online Python Compiler & Editor — Run Python Code Free | CodeIQ",
    description:
      "Write and run Python 3 code online instantly. Free browser-based Python compiler with AI assistance, no installation needed.",
    extension: "py",
    sampleCode: `print("Hello, World!")`,
  },
  {
    slug: "java-compiler",
    name: "Java",
    title: "Online Java Compiler & Editor — Run Java Code Free | CodeIQ",
    description:
      "Write and run Java code online instantly. Free browser-based Java compiler with AI assistance, no installation needed.",
    extension: "java",
    sampleCode: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
  },
  {
    slug: "cpp-online-compiler",
    name: "C++",
    title: "Online C++ Compiler & Editor — Run C++ Code Free | CodeIQ",
    description:
      "Write and run C++ code online instantly. Free browser-based C++ compiler with AI assistance, no installation needed.",
    extension: "cpp",
    sampleCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!";\n  return 0;\n}`,
  },
  {
    slug: "c-compiler",
    name: "C",
    title: "Online C Compiler & Editor — Run C Code Free | CodeIQ",
    description:
      "Write and run C code online instantly. Free browser-based C compiler with AI assistance, no installation needed.",
    extension: "c",
    sampleCode: `#include <stdio.h>\n\nint main() {\n  printf("Hello, World!");\n  return 0;\n}`,
  },
  {
    slug: "javascript-compiler",
    name: "JavaScript",
    title: "Online JavaScript Compiler & Editor — Run JS Code Free | CodeIQ",
    description:
      "Write and run JavaScript code online instantly. Free browser-based JS editor with AI assistance, no installation needed.",
    extension: "js",
    sampleCode: `console.log("Hello, World!");`,
  },
  {
    slug: "typescript-compiler",
    name: "TypeScript",
    title: "Online TypeScript Compiler & Editor — Run TS Code Free | CodeIQ",
    description:
      "Write and run TypeScript code online instantly. Free browser-based TS editor with AI assistance, no installation needed.",
    extension: "ts",
    sampleCode: `const message: string = "Hello, World!";\nconsole.log(message);`,
  },
  {
    slug: "go-compiler",
    name: "Go",
    title: "Online Go (Golang) Compiler & Editor — Run Go Code Free | CodeIQ",
    description:
      "Write and run Go (Golang) code online instantly. Free browser-based Go compiler with AI assistance, no installation needed.",
    extension: "go",
    sampleCode: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, World!")\n}`,
  },
  {
    slug: "rust-compiler",
    name: "Rust",
    title: "Online Rust Compiler & Editor — Run Rust Code Free | CodeIQ",
    description:
      "Write and run Rust code online instantly. Free browser-based Rust compiler with AI assistance, no installation needed.",
    extension: "rs",
    sampleCode: `fn main() {\n    println!("Hello, World!");\n}`,
  },
  {
    slug: "ruby-compiler",
    name: "Ruby",
    title: "Online Ruby Compiler & Editor — Run Ruby Code Free | CodeIQ",
    description:
      "Write and run Ruby code online instantly. Free browser-based Ruby compiler with AI assistance, no installation needed.",
    extension: "rb",
    sampleCode: `puts "Hello, World!"`,
  },
  {
    slug: "haskell-compiler",
    name: "Haskell",
    title: "Online Haskell Compiler & Editor — Run Haskell Code Free | CodeIQ",
    description:
      "Write and run Haskell code online instantly. Free browser-based Haskell compiler with AI assistance, no installation needed.",
    extension: "hs",
    sampleCode: `main :: IO ()\nmain = putStrLn "Hello, World!"`,
  },
    {
    slug: "html-compiler",
    name: "HTML",
    title: "Online HTML Compiler & Live Preview — Run HTML Code Free | CodeIQ",
    description:
      "Write HTML code online with instant live preview. Free browser-based HTML editor, no installation needed.",
    extension: "html",
    sampleCode: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>`,
  },
  {
    slug: "css-compiler",
    name: "CSS",
    title: "Online CSS Compiler & Live Preview — Run CSS Code Free | CodeIQ",
    description:
      "Write and preview CSS code online instantly. Free browser-based CSS editor, no installation needed.",
    extension: "css",
    sampleCode: `body {\n  font-family: sans-serif;\n  background-color: #f0f0f0;\n  text-align: center;\n}`,
  },
];

export function getLanguageBySlug(slug: string) {
  return compilerLanguages.find((lang) => lang.slug === slug);
}
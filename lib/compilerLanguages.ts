export type ExecutionType = "judge0" | "live-vm" | "live-preview";

export interface FaqItem {
  q: string;
  a: string;
}

export interface CompilerLanguage {
  slug: string;
  name: string;
  editorKey: string; // matches DEFAULT_CODE keys in editor
  title: string;
  description: string;
  extension: string;
  sampleCode: string;
  h1: string;
  version: string;
  executionType: ExecutionType;
  useCases: string[];
  faqItems: FaqItem[];
  relatedSlugs: string[];
}

export const compilerLanguages: CompilerLanguage[] = [
  {
    slug: "python-compiler",
    name: "Python",
    editorKey: "python",
    title: "Online Python Compiler – Run Python Code Online | CodeIQ",
    description:
      "Run Python code online with CodeIQ. Write, execute and test Python programs directly in your browser using a simple online Python compiler.",
    extension: "py",
    h1: "Online Python Compiler",
    version: "Python 3.10",
    executionType: "judge0",
    sampleCode: `# Calculate factorial using recursion
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for i in range(1, 8):
    print(f"{i}! = {factorial(i)}")`,
    useCases: [
      "Practising Python algorithms and data structures",
      "Testing Python snippets without installing anything",
      "Learning Python basics in a browser environment",
      "Quickly verifying Python syntax or logic",
    ],
    faqItems: [
      {
        q: "What version of Python does CodeIQ use?",
        a: "CodeIQ runs Python 3.10 via the Judge0 execution engine. Standard library modules are available.",
      },
      {
        q: "Can I install third-party Python packages?",
        a: "The online compiler runs in a sandboxed environment. Standard library is fully available, but pip-installable packages are not supported.",
      },
      {
        q: "Does CodeIQ support Python input() for interactive programs?",
        a: "Yes — you can provide standard input to your program via the input field in the editor before running.",
      },
    ],
    relatedSlugs: [
      "c-compiler",
      "cpp-compiler",
      "java-compiler",
      "javascript-editor",
      "typescript-editor",
      "go-compiler",
      "rust-compiler",
      "ruby-compiler",  
      "haskell-compiler",
      "html-editor",
      "css-editor",
    ],
  },
  {
    slug: "java-compiler",
    name: "Java",
    editorKey: "java",
    title: "Online Java Compiler – Run Java Code Online | CodeIQ",
    description:
      "Write and run Java code online with CodeIQ. Test Java programs directly in your browser using a simple online Java compiler.",
    extension: "java",
    h1: "Online Java Compiler",
    version: "Java 15",
    executionType: "judge0",
    sampleCode: `import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(5); nums.add(2); nums.add(8); nums.add(1);
        Collections.sort(nums);
        System.out.println("Sorted: " + nums);
    }
}`,
    useCases: [
      "Learning Java OOP and data structures",
      "Testing Java code for interviews or coursework",
      "Running Java programs without installing the JDK",
      "Experimenting with Java Collections and APIs",
    ],
    faqItems: [
      {
        q: "Which Java version does CodeIQ use?",
        a: "CodeIQ runs Java 15 via the Judge0 execution engine.",
      },
      {
        q: "Do I need to name my class Main?",
        a: "Yes — the entry class must be named Main with a standard public static void main(String[] args) method.",
      },
      {
        q: "Can I import standard Java libraries?",
        a: "Yes. All standard Java library packages (java.util, java.io, etc.) are available in the sandbox.",
      },
    ],
    relatedSlugs: [
      "python-compiler",
      "cpp-compiler",
      "c-compiler",
      "javascript-editor",
      "typescript-editor",
      "go-compiler",
      "rust-compiler",
      "ruby-compiler",
      "haskell-compiler",
      "html-editor",
      "css-editor",
    ],
  },
  {
    slug: "cpp-compiler",
    name: "C++",
    editorKey: "cpp",
    title: "Online C++ Compiler – Run C++ Code Online | CodeIQ",
    description:
      "Run C++ code online with CodeIQ. Write, compile and test C++ programs directly in your browser using an easy online C++ compiler.",
    extension: "cpp",
    h1: "Online C++ Compiler",
    version: "GCC 10.2 (C++17)",
    executionType: "judge0",
    sampleCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {5, 2, 8, 1, 9, 3};
    sort(v.begin(), v.end());
    for (int x : v) cout << x << " ";
    cout << endl;
    return 0;
}`,
    useCases: [
      "Practising competitive programming problems",
      "Learning C++ STL — vectors, maps, sets",
      "Testing algorithms and data structures",
      "Running C++ programs without a local IDE",
    ],
    faqItems: [
      {
        q: "Which C++ standard does CodeIQ support?",
        a: "CodeIQ compiles C++ using GCC 10.2 with C++17 support.",
      },
      {
        q: "Can I use the STL in CodeIQ?",
        a: "Yes. The full C++ Standard Template Library (STL) is available including vectors, maps, algorithms, and more.",
      },
      {
        q: "Does CodeIQ support C++ templates?",
        a: "Yes — function templates, class templates, and template specialisation all work in the GCC 10.2 environment.",
      },
    ],
    relatedSlugs: [
      "c-compiler",
      "python-compiler",
      "java-compiler",
      "rust-compiler",
      "go-compiler",
      "javascript-editor",
      "typescript-editor",
      "ruby-compiler",
      "haskell-compiler",
      "html-editor",
      "css-editor",
    ],
  },
  {
    slug: "c-compiler",
    name: "C",
    editorKey: "c",
    title: "Online C Compiler – Run C Code Online | CodeIQ",
    description:
      "Write and run C programs online with CodeIQ. Use a simple online C compiler to test and execute C code directly in your browser.",
    extension: "c",
    h1: "Online C Compiler",
    version: "GCC 10.2",
    executionType: "judge0",
    sampleCode: `#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("Fibonacci sequence:\\n");
    for (int i = 0; i < 10; i++) {
        printf("F(%d) = %d\\n", i, fibonacci(i));
    }
    return 0;
}`,
    useCases: [
      "Learning C fundamentals — pointers, memory, structs",
      "Systems programming and low-level algorithm practice",
      "Testing C code for embedded systems or competitive programming",
      "Running C programs without installing GCC locally",
    ],
    faqItems: [
      {
        q: "Which C standard does CodeIQ use?",
        a: "CodeIQ compiles C with GCC 10.2, defaulting to C11. You can use features from C89 through C17.",
      },
      {
        q: "Can I use standard C library functions like printf and scanf?",
        a: "Yes — all standard library headers (stdio.h, stdlib.h, string.h, math.h, etc.) are available.",
      },
      {
        q: "Does CodeIQ support dynamic memory allocation in C?",
        a: "Yes. malloc, calloc, realloc, and free are fully supported in the sandboxed environment.",
      },
    ],
    relatedSlugs: [
      "cpp-compiler",
      "python-compiler",
      "java-compiler",
      "rust-compiler",
      "go-compiler",
      "javascript-editor",
      "typescript-editor",
      "ruby-compiler",
      "haskell-compiler",
      "html-editor",
      "css-editor",
    ],
  },
  {
    slug: "javascript-editor",
    name: "JavaScript",
    editorKey: "javascript",
    title: "Online JavaScript Editor – Run JavaScript Online | CodeIQ",
    description:
      "Write and run JavaScript online with CodeIQ. Edit, execute and test JavaScript code directly in your browser.",
    extension: "js",
    h1: "Online JavaScript Editor",
    version: "ES2024 (Live VM)",
    executionType: "live-vm",
    sampleCode: `// Async/await with fetch simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchUser(id) {
  await delay(100);
  return { id, name: \`User \${id}\`, role: "developer" };
}

(async () => {
  const user = await fetchUser(42);
  console.log("Fetched:", JSON.stringify(user));
  
  const nums = [1, 2, 3, 4, 5];
  const doubled = nums.map(n => n * 2);
  console.log("Doubled:", doubled);
})();`,
    useCases: [
      "Testing JavaScript snippets and ES2024 features",
      "Learning async/await, Promises, and modern JavaScript",
      "Experimenting with array methods — map, filter, reduce",
      "Quickly prototyping JavaScript logic without a local setup",
    ],
    faqItems: [
      {
        q: "Is CodeIQ's JavaScript editor a traditional compiler?",
        a: "No — JavaScript runs in a Live VM directly in your browser. There is no compilation step, which means you get fast, instant execution.",
      },
      {
        q: "Which JavaScript version does CodeIQ support?",
        a: "CodeIQ supports ES2024 — including modern features like top-level await, Array.at(), Object.groupBy(), and more.",
      },
      {
        q: "Can I use DOM APIs in the CodeIQ JavaScript editor?",
        a: "The JavaScript editor runs in a sandboxed VM context. For HTML/CSS/JS with a live DOM preview, use the HTML editor instead.",
      },
    ],
    relatedSlugs: [
      "typescript-editor",
      "python-compiler",
      "java-compiler",
      "cpp-compiler",
      "c-compiler",
      "go-compiler",
      "rust-compiler",
      "ruby-compiler",
      "haskell-compiler",
      "html-editor",
      "css-editor",
    ],
  },
  {
    slug: "typescript-editor",
    name: "TypeScript",
    editorKey: "typescript",
    title: "Online TypeScript Editor – Run TypeScript Online | CodeIQ",
    description:
      "Write and run TypeScript online with CodeIQ. Test TypeScript code directly in your browser using an online TypeScript editor.",
    extension: "ts",
    h1: "Online TypeScript Editor",
    version: "TypeScript 5.x (Live VM)",
    executionType: "live-vm",
    sampleCode: `// TypeScript interfaces and generics
interface User {
  id: number;
  name: string;
  email: string;
}

function filterBy<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Carol", email: "carol@example.com" },
];

const filtered = filterBy(users, (u) => u.name.startsWith("A"));
console.log("Filtered users:", JSON.stringify(filtered, null, 2));`,
    useCases: [
      "Exploring TypeScript types, interfaces, and generics",
      "Testing TypeScript utility types — Partial, Omit, Pick",
      "Learning type-safe JavaScript patterns",
      "Prototyping TypeScript logic before adding it to a project",
    ],
    faqItems: [
      {
        q: "How does TypeScript execution work in CodeIQ?",
        a: "TypeScript is transpiled and run in a Live VM — execution is fast and happens directly in the browser without a build step.",
      },
      {
        q: "Which TypeScript version does CodeIQ use?",
        a: "CodeIQ uses TypeScript 5.x, supporting modern features like const type parameters, variadic tuple types, and decorators.",
      },
      {
        q: "Can I import npm packages into the TypeScript editor?",
        a: "The sandboxed VM environment does not support npm imports. For type annotations and standard TypeScript features, the editor is fully capable.",
      },
    ],
    relatedSlugs: [
      "javascript-editor",
      "python-compiler",
      "java-compiler",
      "cpp-compiler",
      "c-compiler",
      "go-compiler",
      "rust-compiler",
      "ruby-compiler",
      "haskell-compiler",
      "html-editor",
      "css-editor",
    ],
  },
  {
    slug: "go-compiler",
    name: "Go",
    editorKey: "go",
    title: "Online Go Compiler – Run Go Code Online | CodeIQ",
    description:
      "Run Go code online with CodeIQ. Write and test Go programs directly in your browser using an online Go compiler.",
    extension: "go",
    h1: "Online Go Compiler",
    version: "Go 1.16",
    executionType: "judge0",
    sampleCode: `package main

import (
  "fmt"
  "sort"
)

func main() {
  words := []string{"banana", "apple", "cherry", "date"}
  sort.Strings(words)
  
  for i, w := range words {
    fmt.Printf("%d: %s\\n", i+1, w)
  }
  
  counts := map[string]int{"a": 3, "b": 1, "c": 2}
  fmt.Println("\\nMap:", counts)
}`,
    useCases: [
      "Learning Go syntax, goroutines, and channels",
      "Testing Go programs for web services or CLI tools",
      "Practising Go idioms like error handling and interfaces",
      "Running Go code without installing the Go toolchain",
    ],
    faqItems: [
      {
        q: "Which Go version does CodeIQ use?",
        a: "CodeIQ runs Go 1.16 via the Judge0 execution engine.",
      },
      {
        q: "Can I use goroutines in CodeIQ?",
        a: "Yes — goroutines and channels are supported, though execution time is limited by the sandbox environment.",
      },
      {
        q: "Are Go standard library packages available?",
        a: "Yes. All Go standard library packages (fmt, sort, strings, math, etc.) are fully available.",
      },
    ],
    relatedSlugs: [
      "rust-compiler",
      "python-compiler",
      "java-compiler",
      "cpp-compiler",
      "c-compiler",
      "javascript-editor",
      "typescript-editor",
      "ruby-compiler",
      "haskell-compiler",
      "html-editor",
      "css-editor",
    ],
  },
  {
    slug: "rust-compiler",
    name: "Rust",
    editorKey: "rust",
    title: "Online Rust Compiler – Run Rust Code Online | CodeIQ",
    description:
      "Write and run Rust programs online with CodeIQ. Test Rust code directly in your browser using an easy online Rust compiler.",
    extension: "rs",
    h1: "Online Rust Compiler",
    version: "Rust 1.68",
    executionType: "judge0",
    sampleCode: `use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<&str, usize> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word).or_insert(0) += 1;
    }
    counts
}

fn main() {
    let text = "the quick brown fox jumps over the lazy fox";
    let counts = word_count(text);
    
    let mut pairs: Vec<_> = counts.iter().collect();
    pairs.sort_by_key(|&(word, _)| word);
    
    for (word, count) in pairs {
        println!("{}: {}", word, count);
    }
}`,
    useCases: [
      "Learning Rust ownership, borrowing, and lifetimes",
      "Testing Rust programs for systems or WebAssembly projects",
      "Practising Rust pattern matching and enums",
      "Running Rust without installing the toolchain locally",
    ],
    faqItems: [
      {
        q: "Which Rust version does CodeIQ use?",
        a: "CodeIQ runs Rust 1.68 via the Judge0 execution engine.",
      },
      {
        q: "Can I use Cargo crates in CodeIQ?",
        a: "The sandbox environment doesn't support external Cargo crates. Only the Rust standard library (std) is available.",
      },
      {
        q: "Is unsafe Rust allowed in CodeIQ?",
        a: "unsafe blocks are syntactically supported, but the sandboxed execution environment limits what unsafe operations can actually do.",
      },
    ],
    relatedSlugs: [
      "go-compiler",
      "cpp-compiler",
      "c-compiler",
      "python-compiler",
      "java-compiler",
      "javascript-editor",
      "typescript-editor",
      "ruby-compiler",
      "haskell-compiler",
      "html-editor",
      "css-editor",
    ],
  },
  {
    slug: "ruby-compiler",
    name: "Ruby",
    editorKey: "ruby",
    title: "Online Ruby Compiler – Run Ruby Code Online | CodeIQ",
    description:
      "Run Ruby code online with CodeIQ. Write, execute and test Ruby programs directly in your browser using an online Ruby compiler.",
    extension: "rb",
    h1: "Online Ruby Compiler",
    version: "Ruby 3.0",
    executionType: "judge0",
    sampleCode: `# Ruby blocks, iterators, and hashes
students = [
  { name: "Alice", score: 92 },
  { name: "Bob",   score: 78 },
  { name: "Carol", score: 85 },
]

passed = students.select { |s| s[:score] >= 80 }
  .sort_by { |s| -s[:score] }

puts "Students who passed:"
passed.each_with_index do |s, i|
  puts "#{i + 1}. #{s[:name]} — #{s[:score]}"
end`,
    useCases: [
      "Learning Ruby blocks, procs, and iterators",
      "Prototyping Ruby scripts and utilities",
      "Testing Ruby for Rails-adjacent logic",
      "Running Ruby snippets without a local installation",
    ],
    faqItems: [
      {
        q: "Which Ruby version does CodeIQ use?",
        a: "CodeIQ runs Ruby 3.0 via the Judge0 execution engine.",
      },
      {
        q: "Can I use Ruby gems in CodeIQ?",
        a: "The sandbox environment does not support gem installation. Only the Ruby standard library is available.",
      },
      {
        q: "Does Ruby on CodeIQ support regular expressions?",
        a: "Yes — Ruby's built-in Regexp engine is fully available for pattern matching and string operations.",
      },
    ],
    relatedSlugs: [
      "python-compiler",
      "haskell-compiler",
      "java-compiler",
      "cpp-compiler",
      "c-compiler",
      "javascript-editor",
      "typescript-editor",
      "go-compiler",
      "rust-compiler",
      "html-editor",
      "css-editor",
    ],
  },
  {
    slug: "haskell-compiler",
    name: "Haskell",
    editorKey: "haskell",
    title: "Online Haskell Compiler – Run Haskell Code Online | CodeIQ",
    description:
      "Write and run Haskell programs online with CodeIQ. Test Haskell code directly in your browser using an online Haskell compiler.",
    extension: "hs",
    h1: "Online Haskell Compiler",
    version: "GHC 9.4",
    executionType: "judge0",
    sampleCode: `-- Haskell: list comprehensions and higher-order functions
module Main where

primes :: [Int]
primes = sieve [2..100]
  where
    sieve [] = []
    sieve (p:xs) = p : sieve [x | x <- xs, x \`mod\` p /= 0]

main :: IO ()
main = do
  let ps = take 10 primes
  putStrLn $ "First 10 primes: " ++ show ps
  putStrLn $ "Sum: " ++ show (sum ps)`,
    useCases: [
      "Learning functional programming concepts — monads, functors, laziness",
      "Exploring Haskell type system and type classes",
      "Testing Haskell programs without installing GHC",
      "Studying purely functional algorithms and list processing",
    ],
    faqItems: [
      {
        q: "Which Haskell compiler does CodeIQ use?",
        a: "CodeIQ uses GHC 9.4 (Glasgow Haskell Compiler) via the Judge0 execution engine.",
      },
      {
        q: "Can I use Haskell packages like lens or containers?",
        a: "Only the GHC standard Prelude and base library are available. External Hackage packages cannot be installed.",
      },
      {
        q: "Is lazy evaluation supported?",
        a: "Yes — Haskell's default lazy evaluation semantics are fully supported in the CodeIQ sandbox.",
      },
    ],
    relatedSlugs: [
      "ruby-compiler",
      "python-compiler",
      "rust-compiler",
      "java-compiler",
      "cpp-compiler",
      "c-compiler",
      "javascript-editor",
      "typescript-editor",
      "go-compiler",
      "html-editor",
      "css-editor",
    ],
  },
  {
    slug: "html-editor",
    name: "HTML",
    editorKey: "html",
    title: "Online HTML Editor – Write & Preview HTML | CodeIQ",
    description:
      "Write and preview HTML online with CodeIQ. Edit HTML code directly in your browser and see the result with live preview.",
    extension: "html",
    h1: "Online HTML Editor",
    version: "HTML5 (Live Preview)",
    executionType: "live-preview",
    sampleCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello from CodeIQ</title>
  <style>
    body { font-family: sans-serif; text-align: center; padding: 40px; background: #f0f4ff; }
    h1 { color: #3b4cc0; }
    .card { background: white; border-radius: 8px; padding: 20px; max-width: 400px; margin: 20px auto; box-shadow: 0 2px 12px rgba(0,0,0,.1); }
  </style>
</head>
<body>
  <h1>Hello from CodeIQ!</h1>
  <div class="card">
    <p>Edit this HTML and see changes instantly in the live preview panel.</p>
  </div>
</body>
</html>`,
    useCases: [
      "Learning HTML5 structure and semantic elements",
      "Prototyping web page layouts quickly",
      "Testing HTML with inline CSS and JavaScript",
      "Previewing HTML templates without a local web server",
    ],
    faqItems: [
      {
        q: "Is CodeIQ's HTML editor a compiler?",
        a: "HTML is not compiled — it is rendered directly in a live preview iframe. You see your changes reflected instantly as the browser interprets your HTML.",
      },
      {
        q: "Can I use JavaScript inside my HTML in CodeIQ?",
        a: "Yes — you can include <script> tags in your HTML and they will execute in the live preview.",
      },
      {
        q: "Does CodeIQ support external CSS frameworks like Bootstrap in the HTML editor?",
        a: "Yes — you can link external stylesheets via a CDN <link> tag in your HTML head, and they will load in the preview.",
      },
    ],
    relatedSlugs: [
      "css-editor",
      "javascript-editor",
      "typescript-editor",
      "python-compiler",
      "java-compiler",
      "cpp-compiler",
      "c-compiler",
      "go-compiler",
      "rust-compiler",
      "ruby-compiler",
      "haskell-compiler",
    ],
  },
  {
    slug: "css-editor",
    name: "CSS",
    editorKey: "css",
    title: "Online CSS Editor – Write & Preview CSS | CodeIQ",
    description:
      "Write and preview CSS online with CodeIQ. Edit CSS directly in your browser and see your styles with live preview.",
    extension: "css",
    h1: "Online CSS Editor",
    version: "CSS3 (Live Preview)",
    executionType: "live-preview",
    sampleCode: `/* CSS animations and flexbox */
body {
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}`,
    useCases: [
      "Learning CSS Flexbox, Grid, and animations",
      "Prototyping UI styles without a local setup",
      "Testing CSS transitions and keyframe animations",
      "Experimenting with modern CSS features",
    ],
    faqItems: [
      {
        q: "How does CSS work in CodeIQ?",
        a: "CSS is rendered in a live preview alongside a basic HTML wrapper. You see the styled output update as you type.",
      },
      {
        q: "Can I use CSS custom properties (variables)?",
        a: "Yes — CSS custom properties (--variable-name syntax) are fully supported in the live preview.",
      },
      {
        q: "Does CodeIQ support CSS preprocessors like SASS or LESS?",
        a: "Currently, CodeIQ's CSS editor supports standard CSS3. SASS and LESS preprocessing are not available in the live preview.",
      },
    ],
    relatedSlugs: [
      "html-editor",
      "javascript-editor",
      "typescript-editor",
      "python-compiler",
      "java-compiler",
      "cpp-compiler",
      "c-compiler",
      "go-compiler",
      "rust-compiler",
      "ruby-compiler",
      "haskell-compiler",
    ],
  },
];

export function getLanguageBySlug(slug: string): CompilerLanguage | undefined {
  return compilerLanguages.find((lang) => lang.slug === slug);
}

/** Lookup map: editorKey → slug (for generating links from the editor) */
export const editorKeyToSlug: Record<string, string> = Object.fromEntries(
  compilerLanguages.map((l) => [l.editorKey, l.slug])
);

/** All language slugs — used by generateStaticParams and sitemap */
export const allLanguageSlugs = compilerLanguages.map((l) => l.slug);
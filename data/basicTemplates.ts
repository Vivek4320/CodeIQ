import type { Template } from "./templates";

/**
 * Core beginner templates for every built-in CodeIQ language.
 * These are intentionally small, runnable examples that cover the syntax users
 * normally need first: output, variables, input, conditions, loops, functions,
 * and collections.
 */
const BASIC: Record<string, Array<{ name: string; category: string; description: string; code: string }>> = {
  javascript: [
    { name: "Hello World", category: "Basics", description: "Print your first JavaScript program", code: `console.log("Hello, World!");` },
    { name: "Variables & Data Types", category: "Basics", description: "Learn common JavaScript values and variables", code: `const name = "Vivek";\nlet age = 20;\nconst isDeveloper = true;\nconst score = 95.5;\n\nconsole.log("Name:", name);\nconsole.log("Age:", age);\nconsole.log("Developer:", isDeveloper);\nconsole.log("Score:", score);` },
    { name: "Input", category: "Basics", description: "Read input from standard input", code: `const fs = require("fs");\nconst input = fs.readFileSync(0, "utf8").trim();\n\nconsole.log("You entered:", input);` },
    { name: "If / Else", category: "Basics", description: "Make decisions with conditions", code: `const marks = 78;\n\nif (marks >= 90) {\n  console.log("Grade A+");\n} else if (marks >= 75) {\n  console.log("Grade A");\n} else if (marks >= 60) {\n  console.log("Grade B");\n} else {\n  console.log("Needs improvement");\n}` },
    { name: "Loops", category: "Basics", description: "for, while and loop control", code: `for (let i = 1; i <= 5; i++) {\n  console.log("for:", i);\n}\n\nlet n = 1;\nwhile (n <= 3) {\n  console.log("while:", n);\n  n++;\n}` },
    { name: "Functions", category: "Basics", description: "Create and call reusable functions", code: `function add(a, b) {\n  return a + b;\n}\n\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(add(10, 20));\nconsole.log(greet("Vivek"));` },
    { name: "Arrays", category: "Collections", description: "Create, loop through and update arrays", code: `const numbers = [10, 20, 30, 40, 50];\n\nconsole.log("First:", numbers[0]);\nconsole.log("Length:", numbers.length);\n\nfor (const number of numbers) {\n  console.log(number);\n}\n\nnumbers.push(60);\nconsole.log("Updated:", numbers);` },
  ],
  python: [
    { name: "Hello World", category: "Basics", description: "Print your first Python program", code: `print("Hello, World!")` },
    { name: "Variables & Data Types", category: "Basics", description: "Learn common Python values and variables", code: `name = "Vivek"\nage = 20\nis_developer = True\nscore = 95.5\n\nprint("Name:", name)\nprint("Age:", age)\nprint("Developer:", is_developer)\nprint("Score:", score)` },
    { name: "Input", category: "Basics", description: "Read values from the user", code: `name = input("Enter your name: ")\nage = int(input("Enter your age: "))\n\nprint("Hello", name)\nprint("Next year:", age + 1)` },
    { name: "If / Else", category: "Basics", description: "Make decisions with conditions", code: `marks = 78\n\nif marks >= 90:\n    print("Grade A+")\nelif marks >= 75:\n    print("Grade A")\nelif marks >= 60:\n    print("Grade B")\nelse:\n    print("Needs improvement")` },
    { name: "Loops", category: "Basics", description: "for and while loops", code: `for i in range(1, 6):\n    print("for:", i)\n\nnumber = 1\nwhile number <= 3:\n    print("while:", number)\n    number += 1` },
    { name: "Functions", category: "Basics", description: "Create and call reusable functions", code: `def add(a, b):\n    return a + b\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(add(10, 20))\nprint(greet("Vivek"))` },
    { name: "Lists", category: "Collections", description: "Create, loop through and update lists", code: `numbers = [10, 20, 30, 40, 50]\n\nprint("First:", numbers[0])\nprint("Length:", len(numbers))\n\nfor number in numbers:\n    print(number)\n\nnumbers.append(60)\nprint("Updated:", numbers)` },
  ],
  typescript: [
    { name: "Hello World", category: "Basics", description: "Print your first TypeScript program", code: `console.log("Hello, World!");` },
    { name: "Types & Variables", category: "Basics", description: "Use TypeScript type annotations", code: `const name: string = "Vivek";\nlet age: number = 20;\nconst isDeveloper: boolean = true;\n\nconsole.log(name, age, isDeveloper);` },
    { name: "Input", category: "Basics", description: "Read input from standard input", code: `import * as fs from "fs";\n\nconst input: string = fs.readFileSync(0, "utf8").trim();\nconsole.log("You entered:", input);` },
    { name: "If / Else", category: "Basics", description: "Make decisions with typed values", code: `const marks: number = 78;\n\nif (marks >= 90) {\n  console.log("Grade A+");\n} else if (marks >= 75) {\n  console.log("Grade A");\n} else {\n  console.log("Needs improvement");\n}` },
    { name: "Loops", category: "Basics", description: "for and while loops", code: `for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\nlet n: number = 1;\nwhile (n <= 3) {\n  console.log(n);\n  n++;\n}` },
    { name: "Functions", category: "Basics", description: "Typed function parameters and return values", code: `function add(a: number, b: number): number {\n  return a + b;\n}\n\nfunction greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(add(10, 20));\nconsole.log(greet("Vivek"));` },
    { name: "Arrays", category: "Collections", description: "Typed arrays and iteration", code: `const numbers: number[] = [10, 20, 30, 40, 50];\n\nfor (const number of numbers) {\n  console.log(number);\n}\n\nnumbers.push(60);\nconsole.log(numbers);` },
  ],
  c: [
    { name: "Hello World", category: "Basics", description: "Print your first C program", code: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}` },
    { name: "Variables & Data Types", category: "Basics", description: "Use common C data types", code: `#include <stdio.h>\n\nint main() {\n    int age = 20;\n    float score = 95.5f;\n    char grade = 'A';\n    double price = 99.99;\n\n    printf("Age: %d\\n", age);\n    printf("Score: %.1f\\n", score);\n    printf("Grade: %c\\n", grade);\n    printf("Price: %.2f\\n", price);\n    return 0;\n}` },
    { name: "Input", category: "Basics", description: "Read values with scanf", code: `#include <stdio.h>\n\nint main() {\n    int a, b;\n    printf("Enter two numbers: ");\n    scanf("%d %d", &a, &b);\n    printf("Sum = %d\\n", a + b);\n    return 0;\n}` },
    { name: "If / Else", category: "Basics", description: "Use conditional statements", code: `#include <stdio.h>\n\nint main() {\n    int marks = 78;\n\n    if (marks >= 90)\n        printf("Grade A+\\n");\n    else if (marks >= 75)\n        printf("Grade A\\n");\n    else if (marks >= 60)\n        printf("Grade B\\n");\n    else\n        printf("Needs improvement\\n");\n\n    return 0;\n}` },
    { name: "Loops", category: "Basics", description: "for and while loops in C", code: `#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 5; i++)\n        printf("%d ", i);\n\n    printf("\\n");\n\n    int n = 1;\n    while (n <= 3) {\n        printf("%d ", n);\n        n++;\n    }\n    printf("\\n");\n    return 0;\n}` },
    { name: "Functions", category: "Basics", description: "Create reusable C functions", code: `#include <stdio.h>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    printf("%d\\n", add(10, 20));\n    return 0;\n}` },
    { name: "Arrays", category: "Collections", description: "Create and loop through arrays", code: `#include <stdio.h>\n\nint main() {\n    int numbers[] = {10, 20, 30, 40, 50};\n    int size = sizeof(numbers) / sizeof(numbers[0]);\n\n    for (int i = 0; i < size; i++)\n        printf("%d ", numbers[i]);\n\n    printf("\\n");\n    return 0;\n}` },
  ],
  cpp: [
    { name: "Hello World", category: "Basics", description: "Print your first C++ program", code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}` },
    { name: "Variables & Data Types", category: "Basics", description: "Use common C++ data types", code: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name = "Vivek";\n    int age = 20;\n    double score = 95.5;\n    bool developer = true;\n\n    cout << name << " " << age << " " << score << " " << developer << endl;\n    return 0;\n}` },
    { name: "Input", category: "Basics", description: "Read values with cin", code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << "Sum = " << a + b << endl;\n    return 0;\n}` },
    { name: "If / Else", category: "Basics", description: "Use conditional statements", code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int marks = 78;\n\n    if (marks >= 90) cout << "Grade A+";\n    else if (marks >= 75) cout << "Grade A";\n    else if (marks >= 60) cout << "Grade B";\n    else cout << "Needs improvement";\n\n    return 0;\n}` },
    { name: "Loops", category: "Basics", description: "for and while loops in C++", code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 1; i <= 5; i++) cout << i << " ";\n    cout << endl;\n\n    int n = 1;\n    while (n <= 3) {\n        cout << n << " ";\n        n++;\n    }\n    return 0;\n}` },
    { name: "Functions", category: "Basics", description: "Create reusable C++ functions", code: `#include <iostream>\nusing namespace std;\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    cout << add(10, 20) << endl;\n    return 0;\n}` },
    { name: "Arrays & Vector", category: "Collections", description: "Use arrays and vectors", code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> numbers = {10, 20, 30, 40, 50};\n\n    for (int number : numbers)\n        cout << number << " ";\n\n    numbers.push_back(60);\n    cout << "\\nSize: " << numbers.size() << endl;\n    return 0;\n}` },
  ],
  java: [
    { name: "Hello World", category: "Basics", description: "Print your first Java program", code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}` },
    { name: "Variables & Data Types", category: "Basics", description: "Use common Java data types", code: `public class Main {\n    public static void main(String[] args) {\n        String name = "Vivek";\n        int age = 20;\n        double score = 95.5;\n        boolean developer = true;\n\n        System.out.println(name);\n        System.out.println(age);\n        System.out.println(score);\n        System.out.println(developer);\n    }\n}` },
    { name: "Input", category: "Basics", description: "Read input with Scanner", code: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println("Sum = " + (a + b));\n    }\n}` },
    { name: "If / Else", category: "Basics", description: "Use conditional statements", code: `public class Main {\n    public static void main(String[] args) {\n        int marks = 78;\n\n        if (marks >= 90)\n            System.out.println("Grade A+");\n        else if (marks >= 75)\n            System.out.println("Grade A");\n        else if (marks >= 60)\n            System.out.println("Grade B");\n        else\n            System.out.println("Needs improvement");\n    }\n}` },
    { name: "Loops", category: "Basics", description: "for and while loops in Java", code: `public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++)\n            System.out.print(i + " ");\n\n        System.out.println();\n        int n = 1;\n        while (n <= 3) {\n            System.out.print(n + " ");\n            n++;\n        }\n    }\n}` },
    { name: "Methods", category: "Basics", description: "Create reusable Java methods", code: `public class Main {\n    static int add(int a, int b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(add(10, 20));\n    }\n}` },
    { name: "Arrays", category: "Collections", description: "Create and loop through arrays", code: `public class Main {\n    public static void main(String[] args) {\n        int[] numbers = {10, 20, 30, 40, 50};\n\n        for (int number : numbers)\n            System.out.print(number + " ");\n    }\n}` },
  ],
  go: [
    { name: "Hello World", category: "Basics", description: "Print your first Go program", code: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}` },
    { name: "Variables & Types", category: "Basics", description: "Declare common Go values", code: `package main\n\nimport "fmt"\n\nfunc main() {\n    name := "Vivek"\n    age := 20\n    score := 95.5\n    developer := true\n\n    fmt.Println(name, age, score, developer)\n}` },
    { name: "Input", category: "Basics", description: "Read input with fmt.Scan", code: `package main\n\nimport "fmt"\n\nfunc main() {\n    var a, b int\n    fmt.Scan(&a, &b)\n    fmt.Println("Sum =", a+b)\n}` },
    { name: "If / Else", category: "Basics", description: "Use conditional statements", code: `package main\n\nimport "fmt"\n\nfunc main() {\n    marks := 78\n\n    if marks >= 90 {\n        fmt.Println("Grade A+")\n    } else if marks >= 75 {\n        fmt.Println("Grade A")\n    } else {\n        fmt.Println("Needs improvement")\n    }\n}` },
    { name: "Loops", category: "Basics", description: "Use Go's for loop", code: `package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i <= 5; i++ {\n        fmt.Print(i, " ")\n    }\n}` },
    { name: "Functions", category: "Basics", description: "Create reusable Go functions", code: `package main\n\nimport "fmt"\n\nfunc add(a int, b int) int {\n    return a + b\n}\n\nfunc main() {\n    fmt.Println(add(10, 20))\n}` },
    { name: "Slices", category: "Collections", description: "Create and iterate over slices", code: `package main\n\nimport "fmt"\n\nfunc main() {\n    numbers := []int{10, 20, 30, 40, 50}\n\n    for _, number := range numbers {\n        fmt.Print(number, " ")\n    }\n\n    numbers = append(numbers, 60)\n    fmt.Println("\\nSize:", len(numbers))\n}` },
  ],
  rust: [
    { name: "Hello World", category: "Basics", description: "Print your first Rust program", code: `fn main() {\n    println!("Hello, World!");\n}` },
    { name: "Variables & Types", category: "Basics", description: "Declare common Rust values", code: `fn main() {\n    let name: &str = "Vivek";\n    let age: i32 = 20;\n    let score: f64 = 95.5;\n    let developer: bool = true;\n\n    println!("{} {} {} {}", name, age, score, developer);\n}` },
    { name: "Input", category: "Basics", description: "Read a line from standard input", code: `use std::io;\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n    println!("You entered: {}", input.trim());\n}` },
    { name: "If / Else", category: "Basics", description: "Use conditional expressions", code: `fn main() {\n    let marks = 78;\n\n    if marks >= 90 {\n        println!("Grade A+");\n    } else if marks >= 75 {\n        println!("Grade A");\n    } else {\n        println!("Needs improvement");\n    }\n}` },
    { name: "Loops", category: "Basics", description: "for and while loops in Rust", code: `fn main() {\n    for i in 1..=5 {\n        print!("{} ", i);\n    }\n\n    let mut n = 1;\n    while n <= 3 {\n        print!("{} ", n);\n        n += 1;\n    }\n}` },
    { name: "Functions", category: "Basics", description: "Create reusable Rust functions", code: `fn add(a: i32, b: i32) -> i32 {\n    a + b\n}\n\nfn main() {\n    println!("{}", add(10, 20));\n}` },
    { name: "Vectors", category: "Collections", description: "Create and iterate over vectors", code: `fn main() {\n    let mut numbers = vec![10, 20, 30, 40, 50];\n\n    for number in &numbers {\n        print!("{} ", number);\n    }\n\n    numbers.push(60);\n    println!("\\nSize: {}", numbers.len());\n}` },
  ],
  ruby: [
    { name: "Hello World", category: "Basics", description: "Print your first Ruby program", code: `puts "Hello, World!"` },
    { name: "Variables", category: "Basics", description: "Create and use Ruby variables", code: `name = "Vivek"\nage = 20\nscore = 95.5\ndeveloper = true\n\nputs name\nputs age\nputs score\nputs developer` },
    { name: "Input", category: "Basics", description: "Read input with gets", code: `name = gets.chomp\nage = gets.to_i\n\nputs "Hello #{name}"\nputs "Next year: #{age + 1}"` },
    { name: "If / Else", category: "Basics", description: "Use conditional statements", code: `marks = 78\n\nif marks >= 90\n  puts "Grade A+"\nelsif marks >= 75\n  puts "Grade A"\nelsif marks >= 60\n  puts "Grade B"\nelse\n  puts "Needs improvement"\nend` },
    { name: "Loops", category: "Basics", description: "Use each and while loops", code: `(1..5).each do |i|\n  print "#{i} "\nend\n\nputs\nn = 1\nwhile n <= 3\n  print "#{n} "\n  n += 1\nend` },
    { name: "Methods", category: "Basics", description: "Create reusable Ruby methods", code: `def add(a, b)\n  a + b\nend\n\ndef greet(name)\n  "Hello #{name}!"\nend\n\nputs add(10, 20)\nputs greet("Vivek")` },
    { name: "Arrays", category: "Collections", description: "Create and iterate over arrays", code: `numbers = [10, 20, 30, 40, 50]\n\nputs numbers[0]\nputs numbers.length\n\nnumbers.each { |number| puts number }\nnumbers << 60\nputs numbers.inspect` },
  ],
  haskell: [
    { name: "Hello World", category: "Basics", description: "Print your first Haskell program", code: `main :: IO ()\nmain = putStrLn "Hello, World!"` },
    { name: "Variables", category: "Basics", description: "Define values with type signatures", code: `name :: String\nname = "Vivek"\n\nage :: Int\nage = 20\n\nmain :: IO ()\nmain = do\n  print name\n  print age` },
    { name: "Input", category: "Basics", description: "Read a line from standard input", code: `main :: IO ()\nmain = do\n  name <- getLine\n  putStrLn ("Hello " ++ name)` },
    { name: "If / Else", category: "Basics", description: "Use Haskell conditional expressions", code: `grade :: Int -> String\ngrade marks\n  | marks >= 90 = "Grade A+"\n  | marks >= 75 = "Grade A"\n  | marks >= 60 = "Grade B"\n  | otherwise = "Needs improvement"\n\nmain :: IO ()\nmain = putStrLn (grade 78)` },
    { name: "Recursion", category: "Basics", description: "Learn the basic Haskell loop pattern", code: `countDown :: Int -> IO ()\ncountDown 0 = putStrLn "Done"\ncountDown n = do\n  print n\n  countDown (n - 1)\n\nmain :: IO ()\nmain = countDown 5` },
    { name: "Functions", category: "Basics", description: "Define and call pure functions", code: `add :: Int -> Int -> Int\nadd a b = a + b\n\ngreet :: String -> String\ngreet name = "Hello, " ++ name ++ "!"\n\nmain :: IO ()\nmain = do\n  print (add 10 20)\n  putStrLn (greet "Vivek")` },
    { name: "Lists", category: "Collections", description: "Create and map over lists", code: `numbers :: [Int]\nnumbers = [10, 20, 30, 40, 50]\n\nmain :: IO ()\nmain = do\n  print numbers\n  print (map (* 2) numbers)\n  print (sum numbers)` },
  ],
  php: [
    { name: "Hello World", category: "Basics", description: "Print your first PHP program", code: `<?php\necho "Hello, World!";` },
    { name: "Variables", category: "Basics", description: "Create and print PHP variables", code: `<?php\n$name = "Vivek";\n$age = 20;\n$score = 95.5;\n$developer = true;\n\necho "Name: $name\\n";\necho "Age: $age\\n";\necho "Score: $score\\n";\necho "Developer: " . ($developer ? "yes" : "no");` },
    { name: "Input", category: "Basics", description: "Read standard input in PHP", code: `<?php\n$input = trim(fgets(STDIN));\necho "You entered: $input";` },
    { name: "If / Else", category: "Basics", description: "Use conditional statements", code: `<?php\n$marks = 78;\n\nif ($marks >= 90) {\n    echo "Grade A+";\n} elseif ($marks >= 75) {\n    echo "Grade A";\n} elseif ($marks >= 60) {\n    echo "Grade B";\n} else {\n    echo "Needs improvement";\n}` },
    { name: "Loops", category: "Basics", description: "for and while loops in PHP", code: `<?php\nfor ($i = 1; $i <= 5; $i++) {\n    echo $i . " ";\n}\n\necho "\\n";\n$n = 1;\nwhile ($n <= 3) {\n    echo $n . " ";\n    $n++;\n}` },
    { name: "Functions", category: "Basics", description: "Create reusable PHP functions", code: `<?php\nfunction add($a, $b) {\n    return $a + $b;\n}\n\nfunction greet($name) {\n    return "Hello $name!";\n}\n\necho add(10, 20) . "\\n";\necho greet("Vivek");` },
    { name: "Arrays", category: "Collections", description: "Create and iterate over PHP arrays", code: `<?php\n$numbers = [10, 20, 30, 40, 50];\n\nforeach ($numbers as $number) {\n    echo $number . " ";\n}\n\n$numbers[] = 60;\necho "\\nCount: " . count($numbers);` },
  ],
  html: [
    { name: "Basic Page", category: "Basics", description: "Start with a simple HTML document", code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>Welcome to CodeIQ.</p>\n</body>\n</html>` },
    { name: "Headings & Text", category: "Basics", description: "Use headings, paragraphs and text elements", code: `<h1>Main Heading</h1>\n<h2>Section Heading</h2>\n<p>This is a paragraph of text.</p>\n<p><strong>Bold</strong> and <em>italic</em> text.</p>` },
    { name: "Links & Images", category: "Basics", description: "Add links and images to a page", code: `<a href="https://example.com">Visit Example</a>\n\n<img src="https://via.placeholder.com/300x180" alt="Placeholder image">` },
    { name: "Lists", category: "Basics", description: "Create ordered and unordered lists", code: `<h2>My Skills</h2>\n<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>\n\n<h2>Steps</h2>\n<ol>\n  <li>Write code</li>\n  <li>Run code</li>\n  <li>Improve code</li>\n</ol>` },
    { name: "Form", category: "Basics", description: "Create a simple HTML form", code: `<form>\n  <label for="name">Name</label>\n  <input id="name" name="name" type="text" placeholder="Enter your name">\n\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" placeholder="you@example.com">\n\n  <button type="submit">Submit</button>\n</form>` },
    { name: "Table", category: "Basics", description: "Create a simple data table", code: `<table border="1">\n  <thead>\n    <tr><th>Name</th><th>Score</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Alice</td><td>90</td></tr>\n    <tr><td>Bob</td><td>85</td></tr>\n  </tbody>\n</table>` },
  ],
  css: [
    { name: "Basic Styling", category: "Basics", description: "Style a simple HTML page", code: `body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 40px;\n  background: #f5f7fb;\n}\n\nh1 {\n  color: #2563eb;\n}` },
    { name: "Selectors", category: "Basics", description: "Use element, class and id selectors", code: `h1 { font-size: 32px; }\n\n.card {\n  padding: 20px;\n}\n\n#main-title {\n  color: #2563eb;\n}` },
    { name: "Box Model", category: "Basics", description: "Practice margin, padding and border", code: `.box {\n  width: 260px;\n  padding: 20px;\n  border: 2px solid #2563eb;\n  margin: 20px;\n  box-sizing: border-box;\n}` },
    { name: "Flexbox", category: "Layout", description: "Create a simple flexible row", code: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 16px;\n}\n\n.item {\n  padding: 20px;\n  border: 1px solid #ccc;\n}` },
    { name: "Grid", category: "Layout", description: "Create a responsive CSS grid", code: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\n.card {\n  padding: 24px;\n  border: 1px solid #ddd;\n}` },
    { name: "Button", category: "Basics", description: "Style a clean interactive button", code: `.button {\n  display: inline-block;\n  padding: 12px 20px;\n  border: 0;\n  border-radius: 8px;\n  background: #2563eb;\n  color: white;\n  cursor: pointer;\n}\n\n.button:hover {\n  background: #1d4ed8;\n}` },
    { name: "Responsive", category: "Layout", description: "Add a mobile responsive rule", code: `.container {\n  width: min(100% - 32px, 900px);\n  margin: 0 auto;\n}\n\n@media (max-width: 600px) {\n  .container {\n    width: calc(100% - 24px);\n  }\n}` },
  ],
};

export const basicTemplates: Template[] = Object.entries(BASIC).flatMap(([language, items]) =>
  items.map((item, index) => ({
    id: `basic-${language}-${index + 1}`,
    language,
    ...item,
  }))
);

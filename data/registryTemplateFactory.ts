import type { Template } from "./templates";

export interface RegistryTemplateLanguage {
  id: string;
  name: string;
  sampleCode?: string;
  category?: string;
}

type TemplateSpec = { name: string; category: string; description: string; code: string };

const specs: Record<string, TemplateSpec[]> = {
  kotlin: [
    { name: "Hello World", category: "Basics", description: "Print your first Kotlin program", code: `fun main() {\n    println("Hello, World!")\n}` },
    { name: "Variables", category: "Basics", description: "Use val and var with common types", code: `fun main() {\n    val name: String = "Vivek"\n    var age: Int = 20\n    val score: Double = 95.5\n    println("$name $age $score")\n}` },
    { name: "Input", category: "Basics", description: "Read a value from standard input", code: `fun main() {\n    val name = readLine() ?: "Guest"\n    println("Hello, $name!")\n}` },
    { name: "If / Else", category: "Basics", description: "Use conditional statements", code: `fun main() {\n    val marks = 78\n    if (marks >= 75) println("Grade A") else println("Needs improvement")\n}` },
    { name: "Loops", category: "Basics", description: "Use ranges and loops", code: `fun main() {\n    for (i in 1..5) print("$i ")\n}` },
    { name: "Functions", category: "Basics", description: "Create reusable functions", code: `fun add(a: Int, b: Int): Int = a + b\n\nfun main() {\n    println(add(10, 20))\n}` },
    { name: "Lists", category: "Collections", description: "Create and iterate over a list", code: `fun main() {\n    val numbers = listOf(10, 20, 30, 40, 50)\n    numbers.forEach { println(it) }\n}` },
  ],
  csharp: [
    { name: "Hello World", category: "Basics", description: "Print your first C# program", code: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}` },
    { name: "Variables", category: "Basics", description: "Use common C# data types", code: `using System;\n\nclass Program {\n    static void Main() {\n        string name = "Vivek";\n        int age = 20;\n        double score = 95.5;\n        Console.WriteLine($"{name} {age} {score}");\n    }\n}` },
    { name: "Input", category: "Basics", description: "Read input from the console", code: `using System;\n\nclass Program {\n    static void Main() {\n        string input = Console.ReadLine() ?? "";\n        Console.WriteLine("You entered: " + input);\n    }\n}` },
    { name: "If / Else", category: "Basics", description: "Use conditional statements", code: `using System;\n\nclass Program {\n    static void Main() {\n        int marks = 78;\n        if (marks >= 75) Console.WriteLine("Grade A");\n        else Console.WriteLine("Needs improvement");\n    }\n}` },
    { name: "Loops", category: "Basics", description: "Use for and foreach loops", code: `using System;\n\nclass Program {\n    static void Main() {\n        for (int i = 1; i <= 5; i++) Console.Write(i + " ");\n    }\n}` },
    { name: "Methods", category: "Basics", description: "Create reusable methods", code: `using System;\n\nclass Program {\n    static int Add(int a, int b) => a + b;\n\n    static void Main() {\n        Console.WriteLine(Add(10, 20));\n    }\n}` },
    { name: "Arrays", category: "Collections", description: "Create and iterate over arrays", code: `using System;\n\nclass Program {\n    static void Main() {\n        int[] numbers = { 10, 20, 30, 40, 50 };\n        foreach (int number in numbers) Console.Write(number + " ");\n    }\n}` },
  ],
  swift: [
    { name: "Hello World", category: "Basics", description: "Print your first Swift program", code: `print("Hello, World!")` },
    { name: "Variables", category: "Basics", description: "Use let and var", code: `let name = "Vivek"\nvar age = 20\nlet score = 95.5\nprint(name, age, score)` },
    { name: "Input", category: "Basics", description: "Read a line from standard input", code: `if let input = readLine() {\n    print("You entered:", input)\n}` },
    { name: "If / Else", category: "Basics", description: "Use conditional statements", code: `let marks = 78\n\nif marks >= 75 {\n    print("Grade A")\n} else {\n    print("Needs improvement")\n}` },
    { name: "Loops", category: "Basics", description: "Loop through a range", code: `for i in 1...5 {\n    print(i)\n}` },
    { name: "Functions", category: "Basics", description: "Create reusable functions", code: `func add(_ a: Int, _ b: Int) -> Int {\n    return a + b\n}\n\nprint(add(10, 20))` },
    { name: "Arrays", category: "Collections", description: "Create and iterate over arrays", code: `var numbers = [10, 20, 30, 40, 50]\nfor number in numbers {\n    print(number)\n}\nnumbers.append(60)` },
  ],
  dart: [
    { name: "Hello World", category: "Basics", description: "Print your first Dart program", code: `void main() {\n  print('Hello, World!');\n}` },
    { name: "Variables", category: "Basics", description: "Use typed Dart variables", code: `void main() {\n  String name = 'Vivek';\n  int age = 20;\n  double score = 95.5;\n  print('$name $age $score');\n}` },
    { name: "Input", category: "Basics", description: "Read standard input", code: `import 'dart:io';\n\nvoid main() {\n  final input = stdin.readLineSync() ?? '';\n  print('You entered: $input');\n}` },
    { name: "If / Else", category: "Basics", description: "Use conditional statements", code: `void main() {\n  final marks = 78;\n  if (marks >= 75) {\n    print('Grade A');\n  } else {\n    print('Needs improvement');\n  }\n}` },
    { name: "Loops", category: "Basics", description: "Use for and while loops", code: `void main() {\n  for (int i = 1; i <= 5; i++) {\n    print(i);\n  }\n}` },
    { name: "Functions", category: "Basics", description: "Create reusable functions", code: `int add(int a, int b) => a + b;\n\nvoid main() {\n  print(add(10, 20));\n}` },
    { name: "Lists", category: "Collections", description: "Create and iterate over lists", code: `void main() {\n  final numbers = <int>[10, 20, 30, 40, 50];\n  for (final number in numbers) print(number);\n}` },
  ],
  lua: [
    { name: "Hello World", category: "Basics", description: "Print your first Lua program", code: `print("Hello, World!")` },
    { name: "Variables", category: "Basics", description: "Create Lua variables", code: `local name = "Vivek"\nlocal age = 20\nlocal score = 95.5\nprint(name, age, score)` },
    { name: "Input", category: "Basics", description: "Read a line from standard input", code: `local input = io.read()\nprint("You entered:", input)` },
    { name: "If / Else", category: "Basics", description: "Use conditional statements", code: `local marks = 78\n\nif marks >= 75 then\n    print("Grade A")\nelse\n    print("Needs improvement")\nend` },
    { name: "Loops", category: "Basics", description: "Use numeric and while loops", code: `for i = 1, 5 do\n    print(i)\nend` },
    { name: "Functions", category: "Basics", description: "Create reusable functions", code: `local function add(a, b)\n    return a + b\nend\n\nprint(add(10, 20))` },
    { name: "Tables", category: "Collections", description: "Use Lua tables as collections", code: `local numbers = {10, 20, 30, 40, 50}\n\nfor _, number in ipairs(numbers) do\n    print(number)\nend` },
  ],
};

export function generateRegistryTemplates(language: RegistryTemplateLanguage): Template[] {
  const known = specs[language.id.toLowerCase()];
  if (known) {
    return known.map((item, index) => ({ id: `registry-${language.id}-${index + 1}`, language: language.id, ...item }));
  }

  const starter = language.sampleCode?.trim() || `// ${language.name} starter code\n// Add your code here`;
  return [
    { id: `registry-${language.id}-starter`, name: `${language.name} Starter`, language: language.id, category: language.category || "Basics", description: `Starter code from the central ${language.name} language registry`, code: starter },
  ];
}

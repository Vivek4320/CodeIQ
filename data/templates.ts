export interface Template {
  id: string;
  name: string;
  language: string;
  category: string;
  description: string;
  code: string;
}

export const templates: Template[] = [
  // ─── JavaScript ───
  {
    id: "js-fetch-api",
    name: "Fetch API",
    language: "javascript",
    category: "API",
    description: "Fetch data from a REST API",
    code: `// Fetch data from JSONPlaceholder API
async function fetchUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    users.forEach(user => {
      console.log(\`\${user.name} — \${user.email}\`);
    });
  } catch (error) {
    console.error("Failed to fetch users:", error.message);
  }
}

fetchUsers();`,
  },
  {
    id: "js-array-methods",
    name: "Array Methods",
    language: "javascript",
    category: "Basics",
    description: "Map, filter, reduce examples",
    code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Map — double each number
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Filter — keep only even numbers
const evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

// Reduce — sum all numbers
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);

// Chained — sum of doubled evens
const result = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .reduce((acc, n) => acc + n, 0);
console.log("Sum of doubled evens:", result);`,
  },
  {
    id: "js-async-await",
    name: "Async/Await",
    language: "javascript",
    category: "Async",
    description: "Promise-based async patterns",
    code: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(\`Attempt \${i + 1}...\`);
      const response = await fetch(url);
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return await response.json();
    } catch (err) {
      console.error(\`Attempt \${i + 1} failed: \${err.message}\`);
      if (i < retries - 1) await delay(1000 * (i + 1));
    }
  }
  throw new Error("All retries failed");
}

fetchWithRetry("https://jsonplaceholder.typicode.com/todos/1")
  .then(data => console.log("Result:", data))
  .catch(err => console.error(err.message));`,
  },
  {
    id: "js-class",
    name: "ES6 Classes",
    language: "javascript",
    category: "OOP",
    description: "Class inheritance and methods",
    code: `class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }

  speak() {
    return \`\${this.name} says \${this.sound}!\`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, "Woof");
    this.tricks = [];
  }

  learn(trick) {
    this.tricks.push(trick);
    return this;
  }

  showTricks() {
    return \`\${this.name} knows: \${this.tricks.join(", ")}\`;
  }
}

const rex = new Dog("Rex");
rex.learn("sit").learn("shake").learn("roll over");
console.log(rex.speak());
console.log(rex.showTricks());`,
  },
  {
    id: "js-destructuring",
    name: "Destructuring",
    language: "javascript",
    category: "Basics",
    description: "Object & array destructuring",
    code: `// Object destructuring
const user = { name: "Alice", age: 25, city: "Mumbai", role: "dev" };
const { name, age, ...rest } = user;
console.log(name, age);
console.log("Rest:", rest);

// Array destructuring
const colors = ["red", "green", "blue", "yellow", "purple"];
const [first, second, ...remaining] = colors;
console.log(first, second);
console.log("Remaining:", remaining);

// Function parameter destructuring
function greet({ name, role = "user" }) {
  console.log(\`Hello \${name}, you are a \${role}\`);
}

greet({ name: "Bob", role: "admin" });
greet({ name: "Charlie" }); // uses default`,
  },

  // ─── Python ───
  {
    id: "py-list-comp",
    name: "List Comprehensions",
    language: "python",
    category: "Basics",
    description: "Pythonic list/dict/set comprehensions",
    code: `# Basic list comprehension
squares = [x**2 for x in range(10)]
print("Squares:", squares)

# With condition
evens = [x for x in range(20) if x % 2 == 0]
print("Evens:", evens)

# Dictionary comprehension
word = "hello"
char_count = {ch: word.count(ch) for ch in set(word)}
print("Char count:", char_count)

# Nested comprehension
matrix = [[i*3 + j + 1 for j in range(3)] for i in range(3)]
print("Matrix:", matrix)

# Set comprehension
nums = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
unique_squares = {x**2 for x in nums}
print("Unique squares:", unique_squares)`,
  },
  {
    id: "py-file-io",
    name: "File I/O",
    language: "python",
    category: "IO",
    description: "Read and write files safely",
    code: `# Write to a file
data = ["Line 1: Hello", "Line 2: World", "Line 3: CodeIQ"]
with open("output.txt", "w") as f:
    for line in data:
        f.write(line + "\\n")

print("Written", len(data), "lines")

# Read the file back
with open("output.txt", "r") as f:
    content = f.read()
    print("--- File contents ---")
    print(content)

# Read line by line
with open("output.txt", "r") as f:
    for i, line in enumerate(f, 1):
        print(f"Line {i}: {line.strip()}")`,
  },
  {
    id: "py-class",
    name: "Classes & OOP",
    language: "python",
    category: "OOP",
    description: "Python class with inheritance",
    code: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance
        self._history = []

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self._balance += amount
        self._history.append(f"+{amount}")
        return self

    def withdraw(self, amount):
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount
        self._history.append(f"-{amount}")
        return self

    def __repr__(self):
        return f"BankAccount({self.owner}, ₹{self._balance})"


acc = BankAccount("Vivek", 10000)
acc.deposit(5000).withdraw(2000)
print(acc)
print(f"Balance: ₹{acc.balance}")`,
  },
  {
    id: "py-dict-ops",
    name: "Dictionary Ops",
    language: "python",
    category: "Data",
    description: "Common dictionary patterns",
    code: `# Merge dictionaries
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 3, "c": 4}
merged = {**dict1, **dict2}
print("Merged:", merged)

# Group by
from collections import defaultdict
words = ["apple", "banana", "avocado", "blueberry", "cherry", "apricot"]
by_letter = defaultdict(list)
for w in words:
    by_letter[w[0]].append(w)
print("Grouped:", dict(by_letter))

# Counter
from collections import Counter
text = "the quick brown fox jumps over the lazy dog"
word_freq = Counter(text.split())
print("Most common:", word_freq.most_common(3))

# Sort by value
scores = {"Alice": 85, "Bob": 92, "Charlie": 78, "Diana": 95}
ranked = dict(sorted(scores.items(), key=lambda x: x[1], reverse=True))
print("Ranked:", ranked)`,
  },
  {
    id: "py-decorator",
    name: "Decorators",
    language: "python",
    category: "Advanced",
    description: "Function decorators and timing",
    code: `import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

def retry(max_attempts=3):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"Attempt {attempt} failed: {e}")
                    if attempt == max_attempts:
                        raise
        return wrapper
    return decorator

@timer
def slow_add(a, b):
    time.sleep(0.1)
    return a + b

result = slow_add(5, 3)
print(f"Result: {result}")`,
  },

  // ─── TypeScript ───
  {
    id: "ts-generics",
    name: "Generics",
    language: "typescript",
    category: "Advanced",
    description: "Generic types and functions",
    code: `// Generic identity function
function identity<T>(arg: T): T {
  return arg;
}

console.log(identity<string>("hello"));
console.log(identity<number>(42));

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Generic class
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
numStack.push(3);
console.log("Popped:", numStack.pop());
console.log("Peek:", numStack.peek());
console.log("Size:", numStack.size);`,
  },
  {
    id: "ts-interface",
    name: "Interfaces & Types",
    language: "typescript",
    category: "Basics",
    description: "Type annotations and interfaces",
    code: `// Interface
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  metadata?: Record<string, unknown>;
}

// Type alias
type Status = "loading" | "success" | "error";

// Intersection
type AdminUser = User & { permissions: string[] };

// Utility types
type UserPreview = Pick<User, "id" | "name">;
type CreateUser = Omit<User, "id">;

function greetUser(user: User): string {
  return \`Hello \${user.name} (\${user.role})\`;
}

const admin: AdminUser = {
  id: 1,
  name: "Vivek",
  email: "vivek@example.com",
  role: "admin",
  permissions: ["read", "write", "delete"],
};

console.log(greetUser(admin));
console.log("Permissions:", admin.permissions);`,
  },

  // ─── C ───
  {
    id: "c-linked-list",
    name: "Linked List",
    language: "c",
    category: "Data Structures",
    description: "Singly linked list implementation",
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

Node* createNode(int data) {
    Node* node = (Node*)malloc(sizeof(Node));
    node->data = data;
    node->next = NULL;
    return node;
}

void insertEnd(Node** head, int data) {
    Node* node = createNode(data);
    if (*head == NULL) {
        *head = node;
        return;
    }
    Node* temp = *head;
    while (temp->next) temp = temp->next;
    temp->next = node;
}

void printList(Node* head) {
    while (head) {
        printf("%d -> ", head->data);
        head = head->next;
    }
    printf("NULL\\n");
}

int main() {
    Node* head = NULL;
    insertEnd(&head, 10);
    insertEnd(&head, 20);
    insertEnd(&head, 30);
    insertEnd(&head, 40);
    printList(head);
    return 0;
}`,
  },
  {
    id: "c-struct",
    name: "Structs & Pointers",
    language: "c",
    category: "Basics",
    description: "Struct usage with pointers",
    code: `#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    int age;
    float gpa;
} Student;

void printStudent(const Student* s) {
    printf("Name: %s, Age: %d, GPA: %.1f\\n", s->name, s->age, s->gpa);
}

Student createStudent(const char* name, int age, float gpa) {
    Student s;
    strcpy(s.name, name);
    s.age = age;
    s.gpa = gpa;
    return s;
}

int main() {
    Student students[3];
    students[0] = createStudent("Alice", 20, 3.8);
    students[1] = createStudent("Bob", 22, 3.5);
    students[2] = createStudent("Charlie", 21, 3.9);

    for (int i = 0; i < 3; i++) {
        printStudent(&students[i]);
    }
    return 0;
}`,
  },

  // ─── C++ ───
  {
    id: "cpp-vector",
    name: "STL Vectors",
    language: "cpp",
    category: "STL",
    description: "Vector operations and algorithms",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6};

    // Sort
    std::sort(nums.begin(), nums.end());
    std::cout << "Sorted: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << "\\n";

    // Sum
    int sum = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "Sum: " << sum << "\\n";

    // Find
    auto it = std::find(nums.begin(), nums.end(), 8);
    if (it != nums.end())
        std::cout << "Found 8 at index " << std::distance(nums.begin(), it) << "\\n";

    // Remove odd numbers
    nums.erase(
        std::remove_if(nums.begin(), nums.end(), [](int n) { return n % 2 != 0; }),
        nums.end()
    );
    std::cout << "Evens: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << "\\n";

    return 0;
}`,
  },

  // ─── Java ───
  {
    id: "java-arraylist",
    name: "ArrayList Ops",
    language: "java",
    category: "Collections",
    description: "ArrayList with streams",
    code: `import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Charlie", "Alice", "Bob", "Diana", "Eve");

        // Sort
        Collections.sort(names);
        System.out.println("Sorted: " + names);

        // Stream filter + map
        List<String> filtered = names.stream()
            .filter(n -> n.length() > 3)
            .map(String::toUpperCase)
            .collect(Collectors.toList());
        System.out.println("Long names: " + filtered);

        // Find first
        Optional<String> first = names.stream()
            .filter(n -> n.startsWith("B"))
            .findFirst();
        first.ifPresent(n -> System.out.println("Starts with B: " + n));

        // Join
        String joined = String.join(", ", names);
        System.out.println("Joined: " + joined);
    }
}`,
  },
  {
    id: "java-class",
    name: "Java Class",
    language: "java",
    category: "OOP",
    description: "Class with getters and toString",
    code: `public class Main {
    private String name;
    private int age;
    private double salary;

    public Main(String name, int age, double salary) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }

    public String getName() { return name; }
    public int getAge() { return age; }
    public double getSalary() { return salary; }

    public void raise(double percent) {
        this.salary += this.salary * percent / 100;
    }

    @Override
    public String toString() {
        return name + " (age " + age + ", ₹" + String.format("%.0f", salary) + ")";
    }

    public static void main(String[] args) {
        Main emp = new Main("Vivek", 22, 500000);
        System.out.println("Before: " + emp);
        emp.raise(10);
        System.out.println("After:  " + emp);
    }
}`,
  },

  // ─── Go ───
  {
    id: "go-goroutine",
    name: "Goroutines",
    language: "go",
    category: "Concurrency",
    description: "Goroutines and channels",
    code: `package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\\n", id, job)
        time.Sleep(100 * time.Millisecond)
        results <- job * 2
    }
}

func main() {
    jobs := make(chan int, 5)
    results := make(chan int, 5)
    var wg sync.WaitGroup

    // Start 3 workers
    for i := 1; i <= 3; i++ {
        wg.Add(1)
        go worker(i, jobs, results, &wg)
    }

    // Send jobs
    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)

    // Wait and close results
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect results
    for r := range results {
        fmt.Println("Result:", r)
    }
}`,
  },

  // ─── Rust ───
  {
    id: "rust-struct",
    name: "Structs & Traits",
    language: "rust",
    category: "OOP",
    description: "Struct implementation with traits",
    code: `trait Summary {
    fn summarize(&self) -> String;
}

struct Article {
    title: String,
    author: String,
    content: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} by {} — {} chars", self.title, self.author, self.content.len())
    }
}

fn main() {
    let article = Article {
        title: String::from("Rust is Awesome"),
        author: String::from("Vivek"),
        content: String::from("Rust makes systems programming safe and fast."),
    };

    println!("{}", article.summarize());

    // Ownership demo
    let s1 = String::from("hello");
    let s2 = s1.clone();
    println!("s1: {}, s2: {}", s1, s2);
}`,
  },

  // ─── Ruby ───
  {
    id: "ruby-blocks",
    name: "Blocks & Iterators",
    language: "ruby",
    category: "Basics",
    description: "Ruby blocks, procs, and iterators",
    code: `# Each with block
[1, 2, 3, 4, 5].each { |n| puts "Number: #{n}" }

# Map
squares = (1..5).map { |n| n ** 2 }
puts "Squares: #{squares}"

# Select
evens = (1..10).select { |n| n.even? }
puts "Evens: #{evens}"

# Reduce
product = (1..5).reduce(1) { |acc, n| acc * n }
puts "Product: #{product}"

# Custom method with block
def repeat(times)
  times.times { |i| yield(i) }
end

repeat(3) { |i| puts "Iteration #{i}" }

# Proc
doubler = Proc.new { |n| n * 2 }
puts [1, 2, 3].map(&doubler)`,
  },

  // ─── HTML/CSS ───
  {
    id: "html-card",
    name: "Card Component",
    language: "html",
    category: "UI",
    description: "Responsive card with CSS",
    code: `<div class="card">
  <div class="card-image"></div>
  <div class="card-body">
    <span class="badge">New</span>
    <h2>Card Title</h2>
    <p>This is a responsive card component with hover effects and smooth animations.</p>
    <div class="card-footer">
      <button class="btn-primary">Get Started</button>
      <button class="btn-ghost">Learn More</button>
    </div>
  </div>
</div>

<style>
  .card {
    max-width: 360px;
    border-radius: 16px;
    overflow: hidden;
    background: #1a1a2e;
    color: #fff;
    font-family: system-ui, sans-serif;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    transition: transform 0.3s ease;
  }
  .card:hover { transform: translateY(-4px); }
  .card-image {
    height: 180px;
    background: linear-gradient(135deg, #667eea, #764ba2);
  }
  .card-body { padding: 20px; }
  .badge {
    display: inline-block;
    padding: 4px 10px;
    background: #667eea33;
    color: #667eea;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  h2 { margin: 0 0 8px; font-size: 20px; }
  p { margin: 0 0 16px; color: #999; line-height: 1.5; font-size: 14px; }
  .card-footer { display: flex; gap: 8px; }
  .btn-primary {
    flex: 1; padding: 10px; border: none; border-radius: 8px;
    background: #667eea; color: #fff; font-weight: 600; cursor: pointer;
  }
  .btn-ghost {
    flex: 1; padding: 10px; border-radius: 8px;
    background: transparent; color: #999; border: 1px solid #333;
    font-weight: 600; cursor: pointer;
  }
</style>`,
  },
  {
    id: "css-grid",
    name: "CSS Grid Layout",
    language: "css",
    category: "Layout",
    description: "Responsive grid with auto-fit",
    code: `/* CSS Grid — Responsive layout */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #0f0f23;
  color: #e0e0e0;
  min-height: 100vh;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.grid-item {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #2a2a4a;
  transition: all 0.3s ease;
}

.grid-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.grid-item h3 { margin-bottom: 0.5rem; color: #667eea; }
.grid-item p { color: #888; font-size: 0.9rem; line-height: 1.5; }`,
  },
];

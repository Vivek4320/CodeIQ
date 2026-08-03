export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  code: string;
  tags: string[];
}

export const TEMPLATES: CodeTemplate[] = [
  // ─── JavaScript ─────────────────────────────────────────
  {
    id: "js-hello",
    name: "Hello World",
    description: "Basic hello world program",
    language: "javascript",
    category: "Basics",
    difficulty: "Beginner",
    code: `console.log("Hello, World!");`,
    tags: ["hello", "basics"],
  },
  {
    id: "js-fibonacci",
    name: "Fibonacci Sequence",
    description: "Generate Fibonacci numbers",
    language: "javascript",
    category: "Algorithms",
    difficulty: "Beginner",
    code: `function fibonacci(n) {
  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i-1] + seq[i-2]);
  }
  return seq;
}

console.log(fibonacci(10));`,
    tags: ["fibonacci", "sequence", "recursion"],
  },
  {
    id: "js-sort",
    name: "Bubble Sort",
    description: "Classic bubble sort algorithm",
    language: "javascript",
    category: "Algorithms",
    difficulty: "Intermediate",
    code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));`,
    tags: ["sort", "bubble", "algorithm"],
  },
  {
    id: "js-fetch",
    name: "Fetch API Example",
    description: "HTTP request with fetch",
    language: "javascript",
    category: "Web",
    difficulty: "Intermediate",
    code: `async function fetchData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    console.log("Title:", data.title);
    console.log("Body:", data.body);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData();`,
    tags: ["fetch", "api", "async"],
  },
  {
    id: "js-array",
    name: "Array Methods",
    description: "Common array operations",
    language: "javascript",
    category: "Basics",
    difficulty: "Beginner",
    code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Map - transform each element
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Filter - keep elements that pass test
const evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

// Reduce - accumulate to single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);

// Find - first matching element
const found = numbers.find(n => n > 5);
console.log("First > 5:", found);`,
    tags: ["array", "map", "filter", "reduce"],
  },

  // ─── Python ──────────────────────────────────────────────
  {
    id: "py-hello",
    name: "Hello World",
    description: "Basic hello world program",
    language: "python",
    category: "Basics",
    difficulty: "Beginner",
    code: `print("Hello, World!")`,
    tags: ["hello", "basics"],
  },
  {
    id: "py-fibonacci",
    name: "Fibonacci Sequence",
    description: "Generate Fibonacci numbers",
    language: "python",
    category: "Algorithms",
    difficulty: "Beginner",
    code: `def fibonacci(n):
    seq = [0, 1]
    for i in range(2, n):
        seq.append(seq[i-1] + seq[i-2])
    return seq

print(fibonacci(10))`,
    tags: ["fibonacci", "sequence"],
  },
  {
    id: "py-sort",
    name: "Quick Sort",
    description: "Efficient quicksort algorithm",
    language: "python",
    category: "Algorithms",
    difficulty: "Intermediate",
    code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))`,
    tags: ["sort", "quicksort", "algorithm"],
  },
  {
    id: "py-list",
    name: "List Comprehensions",
    description: "Pythonic list operations",
    language: "python",
    category: "Basics",
    difficulty: "Beginner",
    code: `# List comprehension
squares = [x**2 for x in range(10)]
print("Squares:", squares)

# Filter with condition
evens = [x for x in range(20) if x % 2 == 0]
print("Evens:", evens)

# Nested comprehension
matrix = [[i*3+j+1 for j in range(3)] for i in range(3)]
print("Matrix:", matrix)`,
    tags: ["list", "comprehension", "pythonic"],
  },
  {
    id: "py-class",
    name: "Class & Objects",
    description: "OOP with classes",
    language: "python",
    category: "OOP",
    difficulty: "Intermediate",
    code: `class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    def is_passing(self):
        return self.grade >= 60

    def __str__(self):
        return f"{self.name}: {self.grade}"

# Create students
s1 = Student("Alice", 85)
s2 = Student("Bob", 45)

print(s1, "-", "Pass" if s1.is_passing() else "Fail")
print(s2, "-", "Pass" if s2.is_passing() else "Fail")`,
    tags: ["class", "oop", "object"],
  },

  // ─── C ───────────────────────────────────────────────────
  {
    id: "c-hello",
    name: "Hello World",
    description: "Basic hello world program",
    language: "c",
    category: "Basics",
    difficulty: "Beginner",
    code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    tags: ["hello", "basics"],
  },
  {
    id: "c-sort",
    name: "Bubble Sort",
    description: "Classic bubble sort in C",
    language: "c",
    category: "Algorithms",
    difficulty: "Intermediate",
    code: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    bubbleSort(arr, n);
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}`,
    tags: ["sort", "bubble", "algorithm"],
  },

  // ─── C++ ────────────────────────────────────────────────
  {
    id: "cpp-hello",
    name: "Hello World",
    description: "Basic hello world program",
    language: "cpp",
    category: "Basics",
    difficulty: "Beginner",
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    tags: ["hello", "basics"],
  },
  {
    id: "cpp-vector",
    name: "STL Vector Operations",
    description: "Common vector operations",
    language: "cpp",
    category: "Data Structures",
    difficulty: "Intermediate",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {5, 2, 8, 1, 9, 3};

    // Sort
    sort(nums.begin(), nums.end());

    // Print
    for (int n : nums) {
        cout << n << " ";
    }
    cout << endl;

    // Find
    auto it = find(nums.begin(), nums.end(), 8);
    if (it != nums.end())
        cout << "Found 8 at index " << it - nums.begin() << endl;

    return 0;
}`,
    tags: ["vector", "stl", "algorithm"],
  },

  // ─── Java ────────────────────────────────────────────────
  {
    id: "java-hello",
    name: "Hello World",
    description: "Basic hello world program",
    language: "java",
    category: "Basics",
    difficulty: "Beginner",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    tags: ["hello", "basics"],
  },
  {
    id: "java-sort",
    name: "Bubble Sort",
    description: "Classic bubble sort in Java",
    language: "java",
    category: "Algorithms",
    difficulty: "Intermediate",
    code: `public class Main {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        for (int n : arr) System.out.print(n + " ");
    }
}`,
    tags: ["sort", "bubble", "algorithm"],
  },

  // ─── Go ──────────────────────────────────────────────────
  {
    id: "go-hello",
    name: "Hello World",
    description: "Basic hello world program",
    language: "go",
    category: "Basics",
    difficulty: "Beginner",
    code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    tags: ["hello", "basics"],
  },
  {
    id: "go-goroutine",
    name: "Goroutines & Channels",
    description: "Concurrent programming",
    language: "go",
    category: "Concurrency",
    difficulty: "Advanced",
    code: `package main

import (
    "fmt"
    "time"
)

func worker(id int, ch chan string) {
    for i := 0; i < 3; i++ {
        time.Sleep(100 * time.Millisecond)
        ch <- fmt.Sprintf("Worker %d: job %d", id, i+1)
    }
}

func main() {
    ch := make(chan string, 10)

    go worker(1, ch)
    go worker(2, ch)

    for i := 0; i < 6; i++ {
        fmt.Println(<-ch)
    }
}`,
    tags: ["goroutine", "channel", "concurrency"],
  },

  // ─── Rust ────────────────────────────────────────────────
  {
    id: "rust-hello",
    name: "Hello World",
    description: "Basic hello world program",
    language: "rust",
    category: "Basics",
    difficulty: "Beginner",
    code: `fn main() {
    println!("Hello, World!");
}`,
    tags: ["hello", "basics"],
  },
  {
    id: "rust-struct",
    name: "Structs & Enums",
    description: "OOP with structs",
    language: "rust",
    category: "OOP",
    difficulty: "Intermediate",
    code: `#[derive(Debug)]
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }

    fn is_square(&self) -> bool {
        self.width == self.height
    }
}

fn main() {
    let rect = Rectangle { width: 10.0, height: 5.0 };
    println!("Rectangle: {:?}", rect);
    println!("Area: {}", rect.area());
    println!("Square: {}", rect.is_square());
}`,
    tags: ["struct", "impl", "oop"],
  },

  // ─── Ruby ────────────────────────────────────────────────
  {
    id: "ruby-hello",
    name: "Hello World",
    description: "Basic hello world program",
    language: "ruby",
    category: "Basics",
    difficulty: "Beginner",
    code: `puts "Hello, World!"`,
    tags: ["hello", "basics"],
  },
  {
    id: "ruby-class",
    name: "Classes & Modules",
    description: "OOP with classes",
    language: "ruby",
    category: "OOP",
    difficulty: "Intermediate",
    code: `class BankAccount
  attr_reader :balance

  def initialize(name, balance = 0)
    @name = name
    @balance = balance
  end

  def deposit(amount)
    @balance += amount
    puts "Deposited $#{amount}. Balance: $#{@balance}"
  end

  def withdraw(amount)
    if amount <= @balance
      @balance -= amount
      puts "Withdrew $#{amount}. Balance: $#{@balance}"
    else
      puts "Insufficient funds"
    end
  end
end

account = BankAccount.new("Alice", 1000)
account.deposit(500)
account.withdraw(200)`,
    tags: ["class", "oop", "ruby"],
  },
];

// Extra programs for each world's boss quest. The boss mission's own program in
// curriculum.js is program 1; these are programs 2-5. Together the five cover
// everything taught in that world, and all five must pass to beat the boss.
// Kept import-free so curriculum.js can import it without a cycle.

const shell = (task) => `#include <stdio.h>\n\nint main() {\n  // ${task}\n  \n  return 0;\n}\n`;

const fnShell = (signature, task) =>
  `#include <stdio.h>\n\n${signature}\n\nint main() {\n  // ${task}\n  \n  return 0;\n}\n`;

const exact = (value) => ({ type: "output", mode: "exact", value });
const code = (value) => ({ type: "code", value });

export const BOSS_PARTS = {
  // World 1: output, variables, types, operators.
  w1m5: [
    {
      title: "Crew manifest",
      objective:
        "Store crew = 12 (int), fuel = 63.5 (double) and deck = 'C' (char), then print Crew: 12, Fuel: 63.5 and Deck: C on separate lines.",
      starter: shell("crew = 12, fuel = 63.5, deck = 'C': print one per line"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int crew = 12;\n  double fuel = 63.5;\n  char deck = \'C\';\n  printf("Crew: %d\\n", crew);\n  printf("Fuel: %.1f\\n", fuel);\n  printf("Deck: %c\\n", deck);\n  return 0;\n}\n',
      checks: [exact("Crew: 12\nFuel: 63.5\nDeck: C")],
      hints: [
        "Each value needs its own type: int for whole numbers, double for decimals, char for one letter.",
        "Use %d for the int, %.1f for the double and %c for the char.",
        "char deck = 'C'; uses single quotes.",
      ],
    },
    {
      title: "Distance converter",
      objective: "Convert km = 5 into metres and centimetres. Print Metres: 5000 and Centimetres: 500000.",
      starter: shell("km = 5: print metres and centimetres"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int km = 5;\n  int metres = km * 1000;\n  int centimetres = metres * 100;\n  printf("Metres: %d\\n", metres);\n  printf("Centimetres: %d\\n", centimetres);\n  return 0;\n}\n',
      checks: [exact("Metres: 5000\nCentimetres: 500000")],
      hints: [
        "One kilometre is 1000 metres, and one metre is 100 centimetres.",
        "Store metres first, then reuse it to work out centimetres.",
        "int metres = km * 1000; int centimetres = metres * 100;",
      ],
    },
    {
      title: "Ration split",
      objective: "Share 47 rations between 6 crew. Print Each: 7 and Left: 5.",
      starter: shell("47 rations, 6 crew: print each share and what is left"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int rations = 47;\n  int crew = 6;\n  printf("Each: %d\\n", rations / crew);\n  printf("Left: %d\\n", rations % crew);\n  return 0;\n}\n',
      checks: [exact("Each: 7\nLeft: 5")],
      hints: [
        "int / int drops the remainder, which is exactly what you want for each share.",
        "The % operator gives you the remainder.",
        "rations / crew is 7 and rations % crew is 5.",
      ],
    },
    {
      title: "Coolant temperature",
      objective: "Convert celsius = 37.5 to Fahrenheit (F = C * 9 / 5 + 32) and print: Fahrenheit: 99.50",
      starter: shell("celsius = 37.5: print the Fahrenheit value with two decimals"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  double celsius = 37.5;\n  double fahrenheit = celsius * 9 / 5 + 32;\n  printf("Fahrenheit: %.2f\\n", fahrenheit);\n  return 0;\n}\n',
      checks: [exact("Fahrenheit: 99.50")],
      hints: [
        "Keep celsius and the result in doubles so nothing gets truncated.",
        "* and / run before +, so celsius * 9 / 5 + 32 needs no brackets.",
        'printf("Fahrenheit: %.2f\\n", fahrenheit);',
      ],
    },
  ],

  // World 2: if/else, else-if ladders, logical operators, nesting.
  w2m5: [
    {
      title: "Sign and parity",
      objective: "For n = -7 print whether it is Positive, Negative or Zero, then whether it is Even or Odd: Negative then Odd.",
      starter: shell("n = -7: print its sign, then Even or Odd"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int n = -7;\n  if (n > 0) {\n    printf("Positive\\n");\n  } else if (n < 0) {\n    printf("Negative\\n");\n  } else {\n    printf("Zero\\n");\n  }\n  if (n % 2 == 0) {\n    printf("Even\\n");\n  } else {\n    printf("Odd\\n");\n  }\n  return 0;\n}\n',
      checks: [exact("Negative\nOdd")],
      hints: [
        "Two separate decisions: first the sign, then the parity.",
        "The sign needs three branches: if, else if, else.",
        "A number is even when n % 2 == 0. That works for negatives too.",
      ],
    },
    {
      title: "Grade ladder",
      objective: "90+ is A, 80+ is B, 70+ is C, 60+ is D, anything lower is F. For marks = 72 print: Grade: C",
      starter: shell("marks = 72: print the grade from the ladder"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int marks = 72;\n  char grade;\n  if (marks >= 90) {\n    grade = \'A\';\n  } else if (marks >= 80) {\n    grade = \'B\';\n  } else if (marks >= 70) {\n    grade = \'C\';\n  } else if (marks >= 60) {\n    grade = \'D\';\n  } else {\n    grade = \'F\';\n  }\n  printf("Grade: %c\\n", grade);\n  return 0;\n}\n',
      checks: [exact("Grade: C")],
      hints: [
        "Check the highest band first and work down.",
        "Once a branch of an else-if ladder runs, the rest are skipped.",
        "marks >= 70 is the first test that is true for 72.",
      ],
    },
    {
      title: "Largest of three",
      objective: "Find the largest of a = 14, b = 29 and c = 21 using && and print: Largest: 29",
      starter: shell("a = 14, b = 29, c = 21: print the largest"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int a = 14;\n  int b = 29;\n  int c = 21;\n  if (a >= b && a >= c) {\n    printf("Largest: %d\\n", a);\n  } else if (b >= a && b >= c) {\n    printf("Largest: %d\\n", b);\n  } else {\n    printf("Largest: %d\\n", c);\n  }\n  return 0;\n}\n',
      checks: [exact("Largest: 29"), code("&&")],
      hints: [
        "A value is the largest when it is bigger than both of the others.",
        "&& joins two conditions that must both be true.",
        "if (a >= b && a >= c) ... else if (b >= a && b >= c) ... else ...",
      ],
    },
    {
      title: "Cash machine",
      objective:
        "balance = 5000, withdraw = 1200. Dispense only if withdraw is a multiple of 100 and no more than balance. Print Dispensed: 1200 and Balance: 3800, otherwise print Declined.",
      starter: shell("balance = 5000, withdraw = 1200: dispense or decline"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int balance = 5000;\n  int withdraw = 1200;\n  if (withdraw % 100 == 0 && withdraw <= balance) {\n    balance = balance - withdraw;\n    printf("Dispensed: %d\\n", withdraw);\n    printf("Balance: %d\\n", balance);\n  } else {\n    printf("Declined\\n");\n  }\n  return 0;\n}\n',
      checks: [exact("Dispensed: 1200\nBalance: 3800")],
      hints: [
        "Both rules must hold, so join them with &&.",
        "A multiple of 100 leaves no remainder: withdraw % 100 == 0.",
        "Subtract the withdrawal from the balance before printing it.",
      ],
    },
  ],

  // World 3: for, while, accumulators, nested loops.
  w3m5: [
    {
      title: "Times table",
      objective: "Print the 7 times table from 1 to 5, one line each, like: 7 x 1 = 7",
      starter: shell("print 7 x 1 = 7 up to 7 x 5 = 35"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  for (int i = 1; i <= 5; i++) {\n    printf("7 x %d = %d\\n", i, 7 * i);\n  }\n  return 0;\n}\n',
      checks: [exact("7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35")],
      hints: [
        "A for loop from 1 to 5 gives you each row.",
        "printf can take two values: the row number and the product.",
        'printf("7 x %d = %d\\n", i, 7 * i);',
      ],
    },
    {
      title: "Digit counter",
      objective: "For n = 4729, use a while loop to count its digits and add them up. Print Digits: 4 and Sum: 22.",
      starter: shell("n = 4729: count the digits and sum them with a while loop"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int n = 4729;\n  int digits = 0;\n  int sum = 0;\n  while (n > 0) {\n    sum += n % 10;\n    digits++;\n    n = n / 10;\n  }\n  printf("Digits: %d\\n", digits);\n  printf("Sum: %d\\n", sum);\n  return 0;\n}\n',
      checks: [exact("Digits: 4\nSum: 22"), code("while")],
      hints: [
        "n % 10 is the last digit, and n / 10 removes it.",
        "Keep looping while n > 0.",
        "Each pass: sum += n % 10; digits++; n = n / 10;",
      ],
    },
    {
      title: "Even total",
      objective: "Add up every even number from 1 to 20 and print: Even sum: 110",
      starter: shell("sum the even numbers from 1 to 20"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int sum = 0;\n  for (int i = 1; i <= 20; i++) {\n    if (i % 2 == 0) {\n      sum += i;\n    }\n  }\n  printf("Even sum: %d\\n", sum);\n  return 0;\n}\n',
      checks: [exact("Even sum: 110")],
      hints: [
        "Start the total at 0 before the loop.",
        "Only add i when i % 2 == 0.",
        "You could also step by 2: for (int i = 2; i <= 20; i += 2).",
      ],
    },
    {
      title: "Number staircase",
      objective: "Use nested loops to print four rows: 1, 12, 123, 1234.",
      starter: shell("print 1 / 12 / 123 / 1234, one row per line"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  for (int row = 1; row <= 4; row++) {\n    for (int col = 1; col <= row; col++) {\n      printf("%d", col);\n    }\n    printf("\\n");\n  }\n  return 0;\n}\n',
      checks: [exact("1\n12\n123\n1234")],
      hints: [
        "The outer loop picks the row; the inner loop prints that row.",
        "Row r prints the numbers 1 up to r.",
        "Print \\n after the inner loop finishes, not inside it.",
      ],
    },
  ],

  // World 4: functions, parameters, return values, recursion.
  w4m5: [
    {
      title: "Power function",
      objective: "Write int power(int base, int exp) using a loop, then print: Power: 1024 for power(2, 10).",
      starter: fnShell("int power(int base, int exp) {\n  // multiply base by itself exp times\n}", "print power(2, 10)"),
      solution:
        '#include <stdio.h>\n\nint power(int base, int exp) {\n  int result = 1;\n  for (int i = 0; i < exp; i++) {\n    result *= base;\n  }\n  return result;\n}\n\nint main() {\n  printf("Power: %d\\n", power(2, 10));\n  return 0;\n}\n',
      checks: [exact("Power: 1024"), code("int\\s+power\\s*\\(")],
      hints: [
        "Start the result at 1, not 0.",
        "Multiply result by base once per loop pass, exp times.",
        "return result; at the end of the function.",
      ],
    },
    {
      title: "Recursive GCD",
      objective: "Write a recursive int gcd(int a, int b) (gcd(a, 0) is a, otherwise gcd(b, a % b)) and print: GCD: 6 for 48 and 18.",
      starter: fnShell("int gcd(int a, int b) {\n  // base case, then call gcd again\n}", "print gcd(48, 18)"),
      solution:
        '#include <stdio.h>\n\nint gcd(int a, int b) {\n  if (b == 0) {\n    return a;\n  }\n  return gcd(b, a % b);\n}\n\nint main() {\n  printf("GCD: %d\\n", gcd(48, 18));\n  return 0;\n}\n',
      checks: [exact("GCD: 6"), code("int\\s+gcd\\s*\\("), code("return\\s+gcd\\s*\\(")],
      hints: [
        "The base case: when b is 0, the answer is a.",
        "Otherwise call gcd(b, a % b) and return what it gives back.",
        "48, 18 → 18, 12 → 12, 6 → 6, 0 → 6.",
      ],
    },
    {
      title: "Digit sum, recursively",
      objective: "Write a recursive int sumDigits(int n) and print: Digit sum: 18 for 9045.",
      starter: fnShell("int sumDigits(int n) {\n  // last digit + sumDigits of the rest\n}", "print sumDigits(9045)"),
      solution:
        '#include <stdio.h>\n\nint sumDigits(int n) {\n  if (n == 0) {\n    return 0;\n  }\n  return n % 10 + sumDigits(n / 10);\n}\n\nint main() {\n  printf("Digit sum: %d\\n", sumDigits(9045));\n  return 0;\n}\n',
      checks: [exact("Digit sum: 18"), code("int\\s+sumDigits\\s*\\("), code("sumDigits\\s*\\(\\s*n\\s*/\\s*10")],
      hints: [
        "When n is 0 there are no digits left: return 0.",
        "n % 10 is the last digit and n / 10 is everything before it.",
        "return n % 10 + sumDigits(n / 10);",
      ],
    },
    {
      title: "Average function",
      objective: "Write double average(int a, int b, int c) and print: Average: 81.67 for 70, 85 and 90.",
      starter: fnShell("double average(int a, int b, int c) {\n  // return the average as a decimal\n}", "print average(70, 85, 90)"),
      solution:
        '#include <stdio.h>\n\ndouble average(int a, int b, int c) {\n  return (a + b + c) / 3.0;\n}\n\nint main() {\n  printf("Average: %.2f\\n", average(70, 85, 90));\n  return 0;\n}\n',
      checks: [exact("Average: 81.67"), code("double\\s+average\\s*\\(")],
      hints: [
        "The return type is double, so the function can hand back decimals.",
        "Divide by 3.0, not 3, to avoid integer division.",
        'printf("Average: %.2f\\n", average(70, 85, 90));',
      ],
    },
  ],

  // World 5: arrays, traversal, searching, strings.
  w5m5: [
    {
      title: "Linear search",
      objective: "Search {14, 22, 8, 31, 17} for 31 and print: Found at index 3",
      starter: shell("find 31 in {14, 22, 8, 31, 17} and print its index"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int data[5] = {14, 22, 8, 31, 17};\n  int target = 31;\n  int found = -1;\n  for (int i = 0; i < 5; i++) {\n    if (data[i] == target) {\n      found = i;\n      break;\n    }\n  }\n  if (found >= 0) {\n    printf("Found at index %d\\n", found);\n  } else {\n    printf("Not found\\n");\n  }\n  return 0;\n}\n',
      checks: [exact("Found at index 3")],
      hints: [
        "Walk the array with a loop and compare each element to 31.",
        "Remember the index where it matched; -1 can mean 'not found yet'.",
        "Indexes start at 0, so the fourth element is index 3.",
      ],
    },
    {
      title: "Sensor average",
      objective: "Average the readings {12, 18, 25, 9, 16} with a loop and print: Average: 16.00",
      starter: shell("average {12, 18, 25, 9, 16} and print two decimals"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int readings[5] = {12, 18, 25, 9, 16};\n  int total = 0;\n  for (int i = 0; i < 5; i++) {\n    total += readings[i];\n  }\n  printf("Average: %.2f\\n", total / 5.0);\n  return 0;\n}\n',
      checks: [exact("Average: 16.00")],
      hints: [
        "Sum every element first, then divide once.",
        "Divide by 5.0 so the result keeps its decimals.",
        'printf("Average: %.2f\\n", total / 5.0);',
      ],
    },
    {
      title: "Vowel count",
      objective: 'Count the vowels in the string "programming" and print: Vowels: 3',
      starter: shell('count the vowels in "programming"'),
      solution:
        '#include <stdio.h>\n\nint main() {\n  char word[] = "programming";\n  int vowels = 0;\n  for (int i = 0; word[i] != \'\\0\'; i++) {\n    char c = word[i];\n    if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n      vowels++;\n    }\n  }\n  printf("Vowels: %d\\n", vowels);\n  return 0;\n}\n',
      checks: [exact("Vowels: 3")],
      hints: [
        "A string is a char array that ends with '\\0'. Loop until you reach it.",
        "Compare each character to 'a', 'e', 'i', 'o' and 'u' with ||.",
        "The vowels in programming are o, a and i.",
      ],
    },
    {
      title: "Palindrome check",
      objective: 'Check whether "level" reads the same backwards and print: level is a palindrome',
      starter: shell('check if "level" is a palindrome'),
      solution:
        '#include <stdio.h>\n#include <string.h>\n\nint main() {\n  char word[] = "level";\n  int len = strlen(word);\n  int same = 1;\n  for (int i = 0; i < len / 2; i++) {\n    if (word[i] != word[len - 1 - i]) {\n      same = 0;\n    }\n  }\n  if (same) {\n    printf("%s is a palindrome\\n", word);\n  } else {\n    printf("%s is not a palindrome\\n", word);\n  }\n  return 0;\n}\n',
      checks: [exact("level is a palindrome")],
      hints: [
        "Compare the first character with the last, the second with the second-last, and so on.",
        "word[len - 1 - i] is the mirror of word[i].",
        "You only need to check up to the middle: i < len / 2.",
      ],
    },
  ],

  // World 6: pointers, dereferencing, pass by reference, pointer arithmetic.
  w6m5: [
    {
      title: "Hull repair",
      objective: "hp = 50 and int *p = &hp. Through *p only, subtract 15 and then double it. Print: HP: 70",
      starter: shell("hp = 50, p points at hp: change it only through *p"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int hp = 50;\n  int *p = &hp;\n  *p = *p - 15;\n  *p = *p * 2;\n  printf("HP: %d\\n", hp);\n  return 0;\n}\n',
      checks: [exact("HP: 70"), code("\\*\\s*p\\s*=|\\*\\s*p\\s*[-*+]=")],
      hints: [
        "&hp is the address of hp, so int *p = &hp; points p at it.",
        "Writing to *p changes hp itself.",
        "*p = *p - 15; then *p = *p * 2;",
      ],
    },
    {
      title: "Min and max by reference",
      objective:
        "Write void minMax(int *arr, int n, int *min, int *max) and use it on {8, 3, 15, 6, 11}. Print Min: 3 and Max: 15.",
      starter: fnShell(
        "void minMax(int *arr, int n, int *min, int *max) {\n  // write the results through min and max\n}",
        "call minMax on {8, 3, 15, 6, 11}, then print both"
      ),
      solution:
        '#include <stdio.h>\n\nvoid minMax(int *arr, int n, int *min, int *max) {\n  *min = arr[0];\n  *max = arr[0];\n  for (int i = 1; i < n; i++) {\n    if (arr[i] < *min) {\n      *min = arr[i];\n    }\n    if (arr[i] > *max) {\n      *max = arr[i];\n    }\n  }\n}\n\nint main() {\n  int data[5] = {8, 3, 15, 6, 11};\n  int lo;\n  int hi;\n  minMax(data, 5, &lo, &hi);\n  printf("Min: %d\\n", lo);\n  printf("Max: %d\\n", hi);\n  return 0;\n}\n',
      checks: [exact("Min: 3\nMax: 15"), code("void\\s+minMax\\s*\\("), code("&")],
      hints: [
        "A function can only return one value, but it can write many through pointers.",
        "Start *min and *max at arr[0], then compare the rest.",
        "Call it with addresses: minMax(data, 5, &lo, &hi);",
      ],
    },
    {
      title: "Backwards scan",
      objective: "With data = {2, 4, 6, 8}, start a pointer at the last element and walk it backwards. Print: 8 6 4 2",
      starter: shell("print {2, 4, 6, 8} backwards using a pointer"),
      solution:
        '#include <stdio.h>\n\nint main() {\n  int data[4] = {2, 4, 6, 8};\n  int *p = data + 3;\n  for (int i = 0; i < 4; i++) {\n    printf("%d ", *(p - i));\n  }\n  printf("\\n");\n  return 0;\n}\n',
      checks: [exact("8 6 4 2"), code("\\*\\s*\\(")],
      hints: [
        "data + 3 is the address of the last element.",
        "*(p - i) steps back i elements from p.",
        "A space after each number is fine; trailing spaces are ignored.",
      ],
    },
    {
      title: "String length by pointer",
      objective: 'Find the length of "pointer" by moving a char pointer until it reaches the \'\\0\'. Print: Length: 7',
      starter: shell('walk a char pointer along "pointer" and count the characters'),
      solution:
        '#include <stdio.h>\n\nint main() {\n  char word[] = "pointer";\n  char *s = word;\n  int length = 0;\n  while (*s != \'\\0\') {\n    length++;\n    s++;\n  }\n  printf("Length: %d\\n", length);\n  return 0;\n}\n',
      checks: [exact("Length: 7"), code("char\\s*\\*")],
      hints: [
        "char *s = word; points s at the first character.",
        "*s is the character under the pointer, and s++ moves to the next one.",
        "Stop when *s is '\\0', the end of every C string.",
      ],
    },
  ],
};

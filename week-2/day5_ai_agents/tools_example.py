print("=== TOOL CALLING EXAMPLE ===")

def calculator(a, b):
    return a + b

num1 = int(input("Enter first number: "))
num2 = int(input("Enter second number: "))

result = calculator(num1, num2)

print(f"\nResult: {result}")
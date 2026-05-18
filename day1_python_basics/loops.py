# For Loop

print("For Loop:")

for i in range(1, 6):
    print(i)

# While Loop

print("While Loop:")

count = 1

while count <= 15:
    print(count)
    count += 1

#Table multiplication
num = float(input("Enter number: "))

for i in range(1, 11):
    print(num, "x", i, "=", int(num * i))
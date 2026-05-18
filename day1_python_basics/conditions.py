# Conditions Example

#first example

number = int(input("Enter a number: "))

if number > 0:
    print("Positive Number")

elif number < 0:
    print("Negative Number")

else:
    print("Zero")   

#second example

votereligible = int(input("Enter your age: "))

if votereligible >= 18:
    print("Eligible to vote")

else:
    print("Not eligible to vote")

#Third example

num = int(input("Enter a num: "))
if num % 2 == 0:
    print("Even Number")
else:
    print("Odd Number")
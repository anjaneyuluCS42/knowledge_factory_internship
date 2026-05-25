#oop (object oriented programming)

#example : car -- color,name,speed,(properties)
# 1) create a design for car - class
# 2) to create a real product - object
# create a class -- like a design/blueprint
# create an object -- like a real thing made from that design

# exapamle1
class Car:                # class creating
    name = "Tata"
    color = "Red"          # properties
c1 = Car()         # object creating 
print(c1.name)         # Accessing properties from class
print(c1.color)

#example2
class bike:
    name = "Honda"
    color = "black"
    speed = "60km/hr"
c2 = bike()
print(c2.name , c2.color, c2.speed)

#Functions inside class
# self always represents the object
#example1
class Students:
    def studentDetails(self):     #self is a reference to the specific instance of a class being used
        print("hello student")

s1 = Students()
s1.studentDetails()

#example 2
class addition:
    def Additions(self,a,b):
        d = a*b
        print(d)
a1 = addition()
a1.Additions(1,2)

# example3
class cars:
    name = "Volvo"
    color = "white"

    def speed(self,a): 
        print(self.name,self.color)     # Here self represents car1 "object"
        print(a, "70km/hr")
car1 = cars()
# print(car1.name ,car1.color)
car1.speed("top speed")


# ------ constructor ------
#__init__ is a special method (constructor)
#__init__ runs automatically when an object is created
# self stores data inside object

class cars:
    name = "Fortuner"
    color = "black"

    def __init__(self): 
        print(self.name,self.color)     # Here self represents car1 "object"
        print( "70km/hr")

    def speed (self,a):
        print(a ,"95km/hr")
        
car1 = cars()
car1.speed("top speed")
# car1 --> {name : "Fortuner",color: "black,speed()"}  objects stores like this


# so here __init__ we cannot pass the arguments in above example
# now pass the arguments to __init__ constructor
class cse:
    students = 10

    def __init__(self,name):
        self.name = name

    def display(self):
        print(self.students,self.name)
      
cse1 = cse("anji")  # object
cse1.display()

print("\n")

cse2 = cse("hari")
cse2.display()


#cse1 --> {students:10, name:"anji"}
#cse2 --> {students:10, name:"hari"}



        







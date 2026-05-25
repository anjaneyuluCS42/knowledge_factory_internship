#without Inheritance 
#Developer  --> work(), code()
# Tester  -->  work(), test()
# work() method repeated in both classes

#with inheritance
#inheritance allows a child class to use properties and methods from parent class
#it helps in code reuse and reduces duplicate code
#it makes programs organizsed and easy to maintain

class Employee:
    def work(self):
        print("EMployee working")

class Developer(Employee):
    def code(self):
        print("Developer is coding")
        
class Tester(Employee):
    def test(self):
        print("Tester is testing")

d = Developer()
d.work()
d.code()

t = Tester()
t.test()
t.work()









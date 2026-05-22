#without Inherita nce 
#Developer  --> work(), code()
# Tester  -->  work(), test()
# work() method repeated in both classes

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








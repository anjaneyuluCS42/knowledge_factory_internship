#polymorphism allows diff classes to use same method but perform diff actions
# when a child class has the same method name, python calls the childs method first

#polymorphism withour inheritance
class developer:
    def work(self):
        print("Developer is coding")
class tester:
    def work(self):
        print("tester is testing")

# dev = developer()
# dev.work()

# tes = tester()
# tes.work()

#polymorphism with inheritance

class employee:
    def work(self):
        print("employee is working")

class Developer(employee):
    def execute(self):
        super().work()

    def work(employee):
        print("Developer is coding")
# if we want to execute the parent class method first we need to use super() key

class Tester(employee):
    def anji(self):
        super().work()

    def work(employee):
        print("tester is testing")
#when a child class has the same method name, python calls the childs method first (Method overriding )
d = Developer()
d.execute()

t = Tester()
t.anji()
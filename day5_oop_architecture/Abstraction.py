 # Abstraction means:
# you use ATM
# you press withdraw

# you don't know:
# how bank server works
# how money is processed
# that is abstraction

# hiding internal details#
# showing only what tge user needs
from abc import ABC,abstractmethod #ABC Abstarct Base Class
 
class ATM:                       #SBI #HDFC
    @abstractmethod
    def withdraw(self):
        pass

class SBI(ATM):
    def withdraw(self):
        print("Money withdraw from SBI")

class HDFC(ATM):
    def withdraw(self):
        print("money withdraw from hdfc")
atm1 = SBI()
atm2 = HDFC()

atm1.withdraw()
# atm2.withdraw()
    






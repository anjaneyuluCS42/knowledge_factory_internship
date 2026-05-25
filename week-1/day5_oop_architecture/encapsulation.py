# Without encapsulation

# without encapsulation we can access the data from outside of a class
# example without encapsulation
class Bank:
    def __init__(self):
        self.amount = 100
        print("initial amount:" , self.amount)

    def deposit_amount(self,deposit):
        self.amount += deposit
   
        print("TOtal amount: ",self.amount)
        

b = Bank()
b.amount =0    #here we accessing amount from outside of class
deposit = int(input("Enter your amount: "))
b.deposit_amount(deposit)

#Encapsulation
# encapsulation means protecting the data inside a class
#it allows access to data only through class methods, not directly
# it helps keep data , controlled, and secure 

class Bank:
    def __init__(self):
        self.__amount = 5000
        print("initial amount:" , self.__amount)

    def deposit_amount(self,deposit):
        self.__amount += deposit
       
        print("Total remaining amount",self.__amount)
        

b = Bank()
b.__amount = 0    # if we initialize here 0 for the amount from outside of class value cannot change
deposit = int(input("Enter your amount: "))
b.deposit_amount(deposit) 

# example 2 withdraw money
class SBI:
    def __init__(self,balance):
        self.__balance = balance
        print("Remain balance: ", self.__balance)
    def withdraw_amount(self,withdraw):
        self.__balance -= withdraw
        print("TOtal amount:",self.__balance)
b = SBI(400)
withdraw = int(input("Enter your amount :"))
b.withdraw_amount(withdraw)







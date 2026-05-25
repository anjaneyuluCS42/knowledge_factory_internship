#list example , list is mutable we can change values in list
data =[30, 20,9,7,13 ]
# data.append(40)          # added in last 
# data.insert(1, 15)       # index 1 it add 15 value
# data.remove(20)   
       # remove that value
print(sorted(data,reverse=True))
print(data)
data.sort(reverse=True) 
print(data) # descending order
print("Final:" ,data)
print(f"List: {data}")

#example 2
marks =[10,20,30,40]
marks.pop()               # to remove number in last
marks.sort(reverse=False) # ascending order
print("Final marks",marks)
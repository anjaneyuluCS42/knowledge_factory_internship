# # tuple is immutable we cannot change

# tup = (1, 2, 2, 3)
# print(tup.count(2))  # 2 how many times repeat 
# print(tup.index(3))  # to identify index value of 3
# # tup[0] = 5  # error becasue we try to change value at index0 (Immutable)
name = ([1,2],[2,3])
name[0].append(3)
name[1].sort
print(name)
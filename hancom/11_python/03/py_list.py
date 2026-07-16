colors = ["red", "green", "blue"]
# 순서있음, 수정가능, 중복허용

print(colors[0])  # red
print(colors[1])  # green
print(colors[2])  # blue
print(colors[-1]) # blue
print(colors[0:2]) # ['red', 'green', 'blue ']

colors[-1] = "black" 
print(colors[-1]) #blue -> black

colors.append("pink:")       
print(colors) # ['red', 'green', 'black', 'pink']

colors.insert(1, "white")
print(colors) # ['red', 'white', 'green', 'black', 'pink']

colors.remove("green")
print(colors) # ['red', 'white', 'black', 'pink']

numbers  = [8, 5, 3, 2, 7]
numbers.sort()  # 오름차순 정렬
print(numbers) # [2, 3, 5, 7, 8]

numbers.sort(reverse=True)  # 내림차순 정렬
print(numbers) # [8, 7, 5, 3, 2]

print(2 in numbers) # True

print(9 in numbers) # False

numbers.append(9)
print(9 in numbers) # True
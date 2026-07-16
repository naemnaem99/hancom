name = "King"
age = 99

#기존 방식
print("저는", name, "입니다. 나이는", age, "살 입니다.")

#f-string 방식
print(f"저는 {name} 입니다. 나이는 {age} 살 입니다.")

a = 5
b = 3
print(f"{a} + {b} = {a + b}")
print(f"소수점 2자리: {3.141592:.2f}")

print("저는 {} 입니다. 나이는 {} 살 입니다.".format(name, age))
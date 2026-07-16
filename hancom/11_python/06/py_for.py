mixed = [1, "HELLO", 3.14, True]

for i in mixed:
    print(i)
# 1
# HELLO
# 3.14
# True

for index, i in enumerate(mixed):
    print(f"index: {index}, i: {i}")

# index: 0, i: 1
# index: 1, i: HELLO
# index: 2, i: 3.14
# index: 3, i: True
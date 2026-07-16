from termcolor import colored

# colored(출력할 문자열, 글자색, 배경색)

color_sentence = colored(
    "Hello",
    "red",
    "on_green"
)

print(color_sentence)
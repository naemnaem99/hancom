# 람다 공식
# 함수명 = lambda 매개변수(파라미터) : 반환값

# def add(a,b):
#     return a + b
# print(add(7,3))

# add = lambda a,b: a + b
# print(add(7, 3))

# 글자를 넣으면 큰 그림 글씨로 출력(pyfiglet) 해주는 lambda 함수
import pyfiglet
from termcolor import colored

sentence = lambda sentence: print(colored(pyfiglet.figlet_format(sentence), "blue", "on_green"))

st = lambda st: print(pyfiglet.figlet_format(st))

st("hello")

sentence("yummy")

def decorate_text(text):
    return pyfiglet.figlet_format(text)

# 함수명 = lambda 파라미터 : 반환값
decorate_text = lambda text : pyfiglet.figlet_format(text)
print(decorate_text("LAMBDA"))
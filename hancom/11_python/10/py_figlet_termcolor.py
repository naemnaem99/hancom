# 1.pyfiglet, termcolor 불러오기
# 2.pyfiglet 적용
# 3.termcolor 적용
# 4.pyfiglet + termcolor 적용돤 테스트 출력


from termcolor import colored
import pyfiglet

sentence = "what's up bro"

py_sentence = pyfiglet.figlet_format(sentence)
color_sentence = colored(py_sentence, "yellow", "on_green",["bold"] )
print(color_sentence)



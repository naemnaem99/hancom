import pyfiglet
from termcolor import colored

def good_sentence(sentence: str) -> None:
    """
    입력된 문자열을 pyfiglet 형식으로 출력
    파라미터 : sentence(str)
    반환 : None - 출력만 수행
    """
    py_sentence = pyfiglet.figlet_format(sentence)
    c_c = colored(py_sentence, "blue", "on_green" )
    print(c_c)

good_sentence("Good morning" )

good_sentence("Hi Hello")
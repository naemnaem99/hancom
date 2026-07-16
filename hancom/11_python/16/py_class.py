# =====
# 1. 클래스 : 제품의 설계도
# 2. 생성자 : 객체를 만들 때 실행되는 함수
# 3. 속성 : 클래스 안의 변수
# 4. 매서드 : 클래스 안의 함수
# 5. 객체 : 설계도로 만든 제품
# =====

# 클래스 정의
class World:
    # 생성자
    def __init__(self, name, population):
        #속성
        self.name = name
        self.population = population
    def hello(self):
        print(f"Hello,{self.name}!!")
    def info(self):
        print(f"{self.name}의 인구는 {self.population}명입니다.")

# 객체 생성
asia = World("Korea", 51000000)

# 매서드 호출 1
asia.hello()

# 매서드 호출 2
asia.info() 

is_raining = True

if is_raining:
    print("우산을 챙기세요.") # true 이므로 이 줄 실행   
else:
    print("우산 없어도 돼요")

temperature = 28

if temperature >= 30:
        print("더웡 반팔 입어잉")
elif temperature >= 20:
        print("딱 좋네, 가볍게 입자")
elif temperature >=10: 
        print("쌀쌀허네, 겉옷 챙기쇼")
else:
        print ("춥다잉 따뜻하게 입자")
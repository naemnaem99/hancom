from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정
cap = cv2.VideoCapture("https://strm1.spatic.go.kr/live/57.stream/playlist.m3u8")

# 2. 모델 로드 및 거리 계산 객체 생성
distance = solutions.DistanceCalculation(
    model="yolo11n.pt",
    show=True
)

# 3. 프레임 처리 루프
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("프레임 읽기 실패")
        break

    # 3-1. 탐지 + 클릭 대상 중심점 거리 계산 (내부 처리)
    results = distance(frame)

    # 3-2. q 키로 종료
    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌러서 종료")
        break

# 4. 자원 해제
cap.release()
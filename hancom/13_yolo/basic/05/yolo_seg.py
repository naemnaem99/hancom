from ultralytics import YOLO
import cv2

# 1. 모델 로드 (분할 전용)
model = YOLO("yolo11n-seg.pt")

# 2. 모델 추론 (이미지 경로 입력)
results = model("../input_seg.jpg", save=True)

# 3. 결과 시각화
result_image = results[0].plot()

# 4. 결과 이미지 저장
output_image_path = "../result_seg.jpg"
cv2.imwrite(output_image_path, result_image)
print(f"사진 저장되었습니다. {output_image_path}")


from ultralytics import YOLO
import cv2

#1. 모델 로드
model = YOLO("yolo11n.pt")
print(model.names)
model(
    "input_params2.jpg",
    classes=[60, 75],
    save=True
)
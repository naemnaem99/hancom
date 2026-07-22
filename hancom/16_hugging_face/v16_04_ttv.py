import os
from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="auto",
    api_key=os.environ["HF_TOKEN"]

)

answer = input("생성할 비디오 설명 : ")
video = client.text_to_video(
    answer,
    model="tencent/HunyuanVideo",
)

video.save("ttv.result.mp4")
print("실행완료")
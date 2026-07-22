import os
from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="auto",
    api_key="*****"

)

answer = input("생성할 이미지 설명")


# output is a PIL.Image object
image = client.text_to_image(
    answer,
    model="black-forest-labs/FLUX.1-dev",
)

image.save("tti.result.jpg")

print("코드 잘 실행됨")  
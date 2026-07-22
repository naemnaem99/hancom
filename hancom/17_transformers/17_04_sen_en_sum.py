from transformers import pipeline

#1. 요약 파이프라인 생성
summarizer = pipeline(
    "summarization",
    model="t5-small"
)
#2. 요약할 원문
text = """
Artificial intelligence has rapidly transformed the way people live and work over the past decade. What began as a niche academic field has now become a central part of modern industry. Companies across every sector are racing to integrate machine learning into their products and services. Natural language processing, in particular, has seen remarkable progress thanks to transformer-based models. These models learn patterns from massive amounts of text data collected from the internet. Unlike earlier rule-based systems, they can generate fluent and context-aware responses. This shift has enabled applications such as chatbots, translation tools, and automated writing assistants. However, the rise of these technologies has also raised important ethical questions. Issues like data privacy, bias, and misinformation have become major concerns for researchers and policymakers. Some experts worry that powerful language models could be misused to spread false information at scale. Others argue that the benefits, such as improved accessibility and productivity, outweigh the risks if managed responsibly. Governments around the world are now working to establish regulations for AI development. Meanwhile, businesses are investing heavily in AI research to stay competitive in the global market. Universities have also expanded their curricula to include courses on machine learning and data science. Despite the excitement, many challenges remain unresolved, including the high computational cost of training large models. Energy consumption for training and running these systems has become a growing environmental concern. Researchers are exploring more efficient architectures to reduce this footprint without sacrificing performance. At the same time, open-source communities are making AI tools more accessible to smaller organizations and individual developers. This democratization of technology could reshape how innovation happens in the future. Ultimately, the direction AI takes will depend on the choices made by researchers, companies, and society as a whole.

"""
#3. 요약 실행
summary = summarizer(
    text,
    min_length=20, # 최소 토큰 수 => 너무 짧은 요약 방지
    max_length=60, # 최대 토큰 수 => 길이 폭주 방지
    do_sample=False # 매번 동일한 결과
)

#4. 결과 확인
sum_text = summary[0]['summary_text']
print(f"요약된 문장 : {sum_text}")


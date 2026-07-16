# Anaconda — 학습 허브

Python 데이터 과학 패키지 관리자. Anaconda란? · 설치 · 가상환경 관리 · 패키지 관리 · 환경 내보내기&공유, 순서로 정리.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 01. Anaconda란?

집의 여러 방에 비유:
- 집 안에는 여러 방이 있음 — 주방, 화장실, 거실, 안방
- 방마다 목적이 다르고, 도구도 따로 갖춤
- 코딩 프로젝트도 마찬가지 — 프로젝트마다 필요한 라이브러리와 버전이 다름
- Anaconda는 프로젝트별로 독립된 "방(가상환경)"을 만들어주는 관리자
- 방끼리 서로 간섭 없이 깔끔하게 분리

**링크**
- [공식 사이트](https://www.anaconda.com)
- [Anaconda 아카이브](https://repo.anaconda.com/archive/)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 02. 설치하기

**Windows 설치 순서**
1. 아카이브 페이지에서 `Anaconda3-…-Windows-x86_64.exe` 다운로드
2. 설치 파일 더블클릭 → Next → I Agree → Just Me 선택
3. 설치 경로 기본값 유지 → Next
4. "Add Anaconda3 to my PATH" 체크 → Install → Finish

**설치 확인 명령어**
```bash
conda --version
conda info
python --version
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 03. 가상환경 관리

**환경 생성 — 기본 형식**
```bash
conda create -n 환경이름 python=3.10
```

**실전 예시**
```bash
conda create -n cv_env python=3.10
conda create -n nlp_env python=3.9
conda create -n myproject python=3.11
```

**버전 확인**
```bash
python --version
conda --version
```

**환경 활성화 / 비활성화**
```bash
conda activate cv_env
conda deactivate
```

**환경 목록 / 삭제**
```bash
conda env list
conda env remove -n cv_env
```

**Anaconda 유지보수**
```bash
conda info
conda update conda
conda clean --all
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 04. 패키지 관리

**pip 기본 설치**
```bash
pip install package-name
```

**pip 고급 명령어**

다중 설치:
```bash
pip install package1 package2 package3
```

파일에서 설치:
```bash
pip install -r requirements.txt
```

특정 버전 설치:
```bash
pip install package==1.2.3
```

업그레이드:
```bash
pip install --upgrade package
```

**패키지 목록 조회**
```bash
pip list
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 06. 환경 내보내기 & 공유

**환경 파일로 공유하기**

환경 내보내기:
```bash
conda env export > environment.yml
```

환경 복원:
```bash
conda env create -f environment.yml
```

**의존성 추출 — pip freeze & pipreqs**

pip freeze:
```bash
pip freeze
pip freeze > requirements.txt
```

pipreqs (의존성만 자동 추출):
```bash
pipreqs --force --savepath=requirements.txt .
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 핵심 정리
- Anaconda = 프로젝트별로 독립된 가상환경(방)을 만들어 라이브러리·버전 충돌을 막는 관리자
- 가상환경 생성/전환은 `conda create -n 이름 python=버전` → `conda activate 이름`
- 패키지 설치는 `pip install`, 여러 개·파일·특정버전·업그레이드 옵션 지원
- 환경 공유는 `conda env export`(전체 환경) 또는 `pip freeze`/`pipreqs`(의존성만 추출) 두 방식 중 선택

# tinymoments.site

작은 위로(tiny-moments) iOS 앱의 정적 사이트. GitHub Pages 호스팅.

## 구성

- `index.html` — 랜딩 페이지
- `privacy/` — 개인정보처리방침
- `tiny-moments*.json` — 앱 강제/권장 업데이트 정책 (dev/testflight/production)
- `CNAME` — tinymoments.site 도메인

## 관련 레포

- 앱: `~/dev/tiny-moments/` (site.tinymoments.app)
- 앱 레포에 주요 컨텍스트(AGENTS.md, 메모리) 집중. 사이트 작업은 여기서 자유롭게 가능.

## 규칙

- 한국어 커밋 메시지 (Co-Authored-By 포함)
- 변경 사항은 push 즉시 GitHub Pages로 반영됨 → 운영 영향 확인 후 커밋
- JSON 정책 파일 수정 시 앱의 UpdateGate 동작 영향 주의

- 게시 원고·복구 패치·검수 기록·원본 PNG는 이 저장소의 `docs/`에서 Git 보존한다. 불필요한 별도 최상위 보관 폴더를 만들지 않으며 브라우저 프로필·빌드 산출물·캐시는 커밋하지 않는다.

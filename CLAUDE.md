# tinymoments.site

작은 위로 앱(`tiny-moments`, `site.tinymoments.app`)의 Jekyll + GitHub Pages 사이트다.
`CLAUDE.md`가 공용 원문이며, Codex의 `AGENTS.md`는 이를 가리키는 상대 심볼릭 링크다.

## 먼저 읽을 문서

공통 규칙은 전역 지침과 연결된 원문을 따른다. 공통 문서는 전역 지침의 `apps.md` 연결에서, 동반 앱은 등록 프로젝트·기존 checkout의 이름과 Git remote로 찾는다. 아래 경로는 확인한 실제 루트 기준이다.

본 작업과 분리된 호출로 다음 본문을 순서대로 읽는다.

1. 도구의 전역 지침 → 동반 앱 `AGENTS.md`의 **Companion Site & Release 전체** → 공통 `apps.md`.
2. 글·페이지·서식은 공통 `product-site.md`의 해당 형식·톤·검수 절, Git 작업은 공통 `release-cycle.md`의 작업공간·브랜치·검수·병합 절.
3. 출시 연계 게시 전에는 앱의 **출시 게시물 검토 (게시 전)**와 `apps.md`가 연결한 `app-growth/playbooks/release-review.md`의 **목적과 담당** → **최신 검증된 인계 기록**(해당 절·`app-growth/BACKLOG.md`의 연결) → **3. 출시 연계 사이트 게시물 검토 전체**를 읽는다.

필수 문서의 위치·본문이나 승인 근거를 확인하지 못하면 해당 외부 반영을 보류하고, 가능한 로컬 검토를 계속한다.

## 사이트 고유 규칙

- `index.html`은 랜딩, `privacy/`·`support/`는 정책·지원, `blog/`·`release/`는 목록, `_posts/`는 원고다. `_config.yml`·`CNAME`이 공개 주소와 빌드를 정한다.
- `main` push는 `https://tinymoments.site` 전체 운영 배포다. 해당 변경의 게시·배포 승인 범위를 먼저 대조한다.
- 출시 글은 위 원문과 최신 검증된 인계를 대조해 현재 담당·위임 범위를 확인하고, 실제 **출시 게시물 검토 승인** 또는 사용자 직접 승인 원본을 확인한다. 앱·버전·글·최종 원고·URL·게시 권한이 일치할 때만 게시하며, 변경 검토·사후 보고는 그 절차를 따른다. App Review 승인과 별개이며 앱 자동 출시에 대기를 추가하지 않는다.
- `tiny-moments.json`·`tiny-moments-testflight.json`·`tiny-moments-dev.json`은 실행 중인 앱의 UpdateGate에 영향을 준다. 변경할 채널과 버전 범위를 검증한다.
- 커밋 메시지는 한국어와 `Co-Authored-By`를 사용한다.
- 공개 가능한 원고·검수·복구 자료는 `docs/`에 Git 보존한다. 비공개 담당·승인·예약·인증 자료와 개인 메모리 경로는 공개 저장소에 넣지 않는다.

## 검수

- `JEKYLL_ENV=production bundle exec jekyll build --safe`로 빌드한다. 로컬 Ruby 호환이 필요하면 [기존 빌드 환경](docs/records/widget-article-2026-10-25/build-environment/)을 재사용한다.
- `_config.yml`의 AGENTS·CLAUDE 제외를 유지하고, 생성물에 두 지침의 원문·HTML이 없는지 확인한다. 관련 페이지·내부/설치 링크·정책 JSON을 대조한다.
- 승인된 배포 뒤에는 대상 SHA의 GitHub Pages 성공과 실제 공개 URL·내용을 확인한다. 빌드 산출물·캐시·브라우저 프로필은 커밋하지 않는다.

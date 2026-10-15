# 작은 위로 웹 측정 연결 — 2026-10-15

상태: 사이트 구현·기존 Pages 배포·공개 메타 확인·동의한 디버그 전송의 HTTP 204 확인 완료. Google DebugView 표시·보고 조회·Search Console 소유권 확정은 성장 담당의 Google 측 검증과 구분한다. 기본 로컬 Ruby 4 호환 문제는 별도 한계로 보존한다.

## 범위와 현재 상태

- 사용자 실행 승인: app-growth 채팅 `01a125cd-6f0f-7c63-be12-0c83c6cc3bbe`의 2026-10-15 GA4/Search Console 세 블로그 연결 요청. 상세: `/Users/eee/dev/app-growth/research/google-web-connection-2026-10-15.md`.
- 성장 담당 전달 실제 값: GA4 property `559037671`, stream `16132719353`, 측정 ID `G-14D97K9S8S`, 시간대 `Asia/Seoul`. Search Console `https://tinymoments.site/`, meta 값 `VElJolOjuWiq-HPizdgQjvdx4MjaPZy7BmQw3t88e7E`. 10/15 성장 담당이 향상된 측정 전체 OFF와 Developer Traffic 제외 활성 확인을 회신했다. Google 설정·소유권 확인·DebugView/보고 조회는 성장 담당 책임이다.
- 저장소 `/Users/eee/dev/tinymoments.site`, 시작 브랜치 `main`, 시작 작업 트리 깨끗함. 기존 분석 태그 없음. `CLAUDE.md`의 한국어 커밋·운영 영향 확인 조건을 적용한다.
- 앱·스토어·콘텐츠 개편·업데이트 정책 JSON·DNS·인증·공통 성장 문서와 예약은 변경하지 않는다.

## 소스와 측정 계약

- `_config.yml`: `analytics.production_hostname: tinymoments.site`, 전달받은 실제 `analytics.measurement_id`와 `google_site_verification`을 반영했다. 예시 ID·빈 확인값으로 배포하지 않는다.
- `_includes/head.html` → `_includes/analytics.html`: Search Console meta와 로컬 측정 스크립트 1개. 실제 GA4 ID가 없으면 측정 UI/스크립트를 출력하지 않는다.
- `_includes/footer.html`, `assets/css/main.css`: 동등한 허용/거부 선택과 재설정 버튼. 최초 거부는 Google 코드·요청 없이 적용한다. 허용 철회 시 GA 비활성화·자체 분석 쿠키 만료 후 다시 로드한다.
- `assets/js/analytics.js`: HTTPS `tinymoments.site`만 활성화. 동의 후 `page_view` 1개 및 정확한 `https://apps.apple.com/kr/app/id6763057739` 목적지의 `click`만 전송한다. 다른 앱/도메인, 링크 텍스트와 임의 링크 쿼리는 전송하지 않는다. 설치 링크 자체의 기본 이동은 가로채지 않는다.
- `page_location`은 origin+pathname, `page_referrer`는 HTTP(S) origin만 사용한다. `analytics_debug=1`은 `debug_mode: true`로만 반영하며 분석 페이지 주소에는 넣지 않는다. 계정 식별자·앱 데이터·이메일을 수집하지 않는다.
- 일반 방문은 config와 모든 event에서 `debug_mode` 필드 자체를 생략한다. `false`로 끄는 방식을 사용하지 않는다. 저장 공간이 읽기 전용이 되면 과거 허용을 자동으로 재사용하지 않아 선택 변경이 막힌 상태의 자동 분석을 방지한다.
- GA4 표준 `click`, `link_url`, `link_domain`, `outbound`를 사용한다. 성장 수집기는 `click` 중 정확한 App Store URL/앱 ID만 집계한다. 웹 분석에 동의한 방문 표본이며 클릭은 설치 수가 아니다.
- `privacy/index.html#web-analytics`: 앱의 기존 개인정보 설명과 분리한 웹 분석 안내.
- `docs/`, `tests/`는 Jekyll 공개 산출물에서 제외한다.

## 실제 값 수신 후 배포 전 필수 대조

1. 성장 담당이 해당 도메인/앱 ID에 맞춘 실제 GA4 속성·스트림·측정 ID, Asia/Seoul 시간대와 Search Console URL-prefix 확인값을 전달한다.
2. 성장 담당이 스트림의 향상된 측정을 해제한다. 특히 outbound click·사이트 검색·양식 수집이 켜져 있으면 배포하지 않는다. 이 구현은 수동 page_view/click 한 경로를 사용한다. 광고 기능/Signals는 사용하지 않는다.
3. 성장 담당이 Developer traffic 제외와 `analytics_debug=1` 수신 검증을 담당한다. 등록·스크립트 배포·수신·보고 조회 성공을 서로 구분한다.
4. 실제 ID/확인값 반영 후 전체 Jekyll 빌드, 로컬 동의/거부/철회/호스트 제한/URL 정제/정확한 설치 링크/중복 방지 검사를 실행한다. 운영 JSON의 무변경도 대조한다.
5. 한국어 커밋(Co-Authored-By 포함), 기존 main push/Pages 상태·공개 HTML/스크립트 확인, 실제 디버그 수신 확인을 잇는다. 새 사용자 승인 게이트를 추가하지 않는다.

## 검사·배포 기록

- 사전 `bundle check`: 성공, 설치/업데이트 없음.
- `node --test tests/analytics.test.cjs`: 9/9 성공. 동의 전·거부 시 Google 스크립트 없음, 정확한 운영 HTTPS host, 페이지/유입 주소 정제, 단일 page_view, 정확한 App Store 앱 click, 동의 철회, debug_mode 분리, 저장 공간 차단·읽기 전용 전환·다른 탭 선택 변경·선택 초기화를 검증했다. 외부 요청은 모의 DOM으로 차단한 로컬 검사다. 일반 config/event의 debug 필드 부재도 기존 debug 검사에서 확인한다.
- `git diff --check`: 성공.
- 공식 `bundle exec jekyll build --destination <임시 폴더>`: 실패. 현재 실제 Ruby 4.0.5 + Jekyll 3.9.0에서 `cannot load such file -- csv`. `bundle check`는 이 실행 호환성을 검증하지 못했다. `ruby@3.2` 경로도 실제 Ruby 4.0.5를 실행하므로 구버전으로 대체 검증한 것으로 표시하지 않는다.
- 최소 환경 수정안: 실제 Ruby 3.2 호환 환경을 재사용하거나, 현재 Ruby에서 필요한 csv 의존성을 명시·해결한 뒤 공식 빌드를 다시 수행한다. 이번 준비에서 런타임/의존성을 설치·업데이트하거나 Gemfile/lock을 바꾸지 않았다. 실패 로그: `/var/folders/qq/kzh9hddx5dv_95srvw1tyhs40000gn/T/TinyMoments-WebMeasurement-20261015-oc5xrj3j/without-id.log`.
- 임시 검증 환경: 기존 설치된 Ruby stdlib gem을 `/tmp`의 별도 Gemfile에 노출하고, 제거된 taint/File.exists? 호환 API만 임시 shim으로 제공했다. 저장소 Gemfile/lock·설치된 gem·전역 설정은 변경하지 않았다. 이 환경에서 `bundle exec jekyll build` 성공, 17개 HTML에 실제 ID·확인 meta·측정 UI가 각 1회임을 검증했다. docs/tests 공개 제외와 정책 JSON의 바이트 동일성도 확인했다. 기본 Ruby 명령의 호환 문제를 해결한 것으로 보고하지 않는다.
- 브라우저 사전 확인: 390px 화면의 허용/거부 UI 표시, 허용 전 Google 요청 0, 거부 후 정확한 App Store 팝업 이동, Google 실제 태그가 생성한 정제된 page_view와 `ep.debug_mode=true`를 관측했다. 이 단계의 분석 요청은 라우팅에서 차단/모의 응답했으므로 실제 Google 수신 근거가 아니다. 브라우저 자동화의 페이지 상태/전송 표현에 대한 실패 기록은 보존하며, 단일 운영 디버그 검증과 구분한다.
- 검사 산출물: `/var/folders/qq/kzh9hddx5dv_95srvw1tyhs40000gn/T/TinyMoments-WebDeploy-20261015-67h0ig_i/`. Google 요청에서는 측정 ID·이벤트명·debug 필드·정제된 주소·동의 상태·시각만 기록하며 cid·쿠키·이메일·인증값은 복제하지 않는다.
- 소스 커밋 `55941df1e4d26b88d93a107ccb8ffba4cd4114c8`를 main에 push했고 기존 Pages 배포와 공개 확인을 완료했다. Google 소유권 확정·DebugView/보고 조회는 이 사이트 담당이 실행하지 않았다.
- 원복: 이 작업의 배포 커밋을 revert해 기존 Pages 경로로 게시한다. Google 계정/속성/기존 데이터는 삭제하지 않는다. 배포 전 취소 시에는 이번 작업 파일만 대상으로 차이를 검토하고 기존 변경은 보존한다.

## 구현 근거

- [Google GA4 설정 필드](https://developers.google.com/analytics/devguides/collection/ga4/reference/config): 페이지/유입 주소 재정의, 광고 Signals 제한.
- [수동 page_view와 중복 방지](https://developers.google.com/analytics/devguides/collection/ga4/views?technology=websites): 기본 page_view를 끄고 명시적으로 한 번 전송한다.
- [Google DebugView](https://support.google.com/analytics/answer/7201382?hl=en): 일반 방문에서는 debug_mode를 false로 설정하지 않고 매개변수를 생략한다.

## 배포·운영 디버그 확인 결과

- 소스 커밋: `55941df1e4d26b88d93a107ccb8ffba4cd4114c8`. push 2026-10-15 16:21:31 KST. [Pages 실행](https://github.com/soulwawa/tinymoments.site/actions/runs/38698206374) success/completed, 마지막 갱신 2026-10-15 16:22:24 KST. 이는 실행 기록의 갱신 시각이며 전 세계 캐시의 동일 공개 시각을 뜻하지 않는다.
- 공개 확인: 2026-10-15 16:23:11 KST, 홈페이지·웹 개인정보 페이지·측정 JS 모두 HTTP 200. HTML에서 실제 GA ID와 Search Console 확인 meta 각 1회, 공개 JS와 검증 소스의 SHA-256 일치를 확인했다. [홈페이지](https://tinymoments.site/), [웹 분석 안내](https://tinymoments.site/privacy/#web-analytics).
- 운영 검증은 `https://tinymoments.site/?analytics_debug=1`에서 1회 수행했다. 허용 전 Google 스크립트/분석 요청 0, 허용 후 아래 이벤트 각 1회, 허용 철회 후 다시 로드된 페이지에서 GA 비활성 및 Google 태그 추가 로드 없음. 일반 방문을 가장한 비debug 테스트는 만들지 않았다.
- 정확한 App Store URL의 팝업 네비게이션 생성과 click payload를 확인했다. 팝업 응답은 테스트 문서로 대체했으며 App Store 내부 동작·실제 설치를 검증한 것은 아니다.

| eventName | 측정 ID | 실제 전송 debug_mode | 동의 상태 | 전송 시각(KST) | HTTP |
| --- | --- | --- | --- | --- | --- |
| `page_view` | `G-14D97K9S8S` | `true` | granted | 2026-10-15T16:26:41.977+09:00 | 204 |
| `click` | `G-14D97K9S8S` | `true` | granted | 2026-10-15T16:26:47.393+09:00 | 204 |

- `page_location=https://tinymoments.site/`, 유입 주소 공란(직접 방문), click의 `link_url=https://apps.apple.com/kr/app/id6763057739`, `link_domain=apps.apple.com`, `outbound=true`. 페이지 쿼리·fragment를 보내지 않았다. 태그의 실제 전송 표현은 `ep.debug_mode=true`였으며 `_dbg` 필드 존재만으로 판정하지 않았다.
- 위 HTTP 204는 Google 전송 수락 근거다. DebugView 표시·Data API 보고서·Developer traffic 필터의 실제 적용까지 확인한 것으로 확대하지 않는다. 성장 담당이 10/15를 초기 검증일로 구분하며 테스트를 고객 성과로 해석하지 않는다. 같은 전송을 수신 대기만을 이유로 반복하지 않는다.
- 후속 인수: 성장 담당이 공개된 Search Console meta로 소유권을 확인하고 DebugView/보고 조회·대시보드·기존 일일 모니터링 기록을 마감한다. 이 작업에서 공통 문서/예약은 수정하지 않았다.
- 원복 대상 소스 커밋은 `55941df1e4d26b88d93a107ccb8ffba4cd4114c8`이다. 해당 커밋을 revert하고 기존 main/Pages 경로로 게시하면 측정 코드·UI·설정·meta가 이전 상태로 돌아간다. Google 속성/보고 데이터는 삭제하지 않는다.

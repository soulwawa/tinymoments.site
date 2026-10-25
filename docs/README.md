# 사이트 작업 기록

게시·검수 자료는 이 저장소의 `docs/`에서 Git으로 보존한다. `_config.yml`의 기존 `exclude: docs`에 따라 운영 Pages에는 게시되지 않는다.

- [웹 측정 연결](site-measurement-2026-10-15.md)
- [동의 배너 검수 결과](consent-banner-ui-2026-10-16.json)와 `evidence/consent-banner-*.png`
- [위젯 글 게시 검수 결과](widget-article-publication-2026-10-25.json)와 `evidence/widget-article-*.png`
- [위젯 글 원고·패치·검증 원본](records/widget-article-2026-10-25/)
- [목록 이중 구분선·제목 줄바꿈 수정 검수](site-style-fix-2026-10-25.json)
- [자료 이관 목록·해시·제외 범위](storage-consolidation-2026-10-25.json)

최종 원고·승인 복사본·복구 패치·검수 JSON·원본 PNG·검증 코드/로그를 보존한다. 브라우저 프로필, 쿠키/로그인 DB, 재생성 가능한 렌더링 산출물과 캐시는 Git에 넣지 않는다. 별도 최상위 게시 작업 폴더는 유지하지 않는다.

`records/`의 원본 입력·실행 로그는 과거 실행 당시의 절대 경로/문구를 그대로 담은 보관본이다. 현재 사용 경로는 위 검수 JSON을 따른다. 빌드 잠금 파일은 보관용 `Gemfile.lock.snapshot`으로 저장했다. 새 검수나 운영 전송을 수행했다는 뜻은 아니다.

10월 16일 원본 PNG와 검수 JSON은 남아 있으나 당시 임시 디렉토리의 추가 로그는 이미 없다. 전체 과거 로그가 복구되었다고 판단하지 않는다.

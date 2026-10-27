# DLL Directory 업데이트 기록

## 2026-10-27 — GitHub Pages 공개 구성

- 기존 한국어·영어·스페인어·중국어·일본어·독일어 메인과 DLL별 상세 페이지를 모두 보존했다. 메인 6개, 상세 6,498개, 총 6,504개 HTML이다.
- 도입 설명, 검색 도움말, 순위 안내, 패키지 설명·SDK 설치 안내·제품 선택 문단과 홍보 문구를 화면에서 제거했다. 파일명·분류·출처·버전·아키텍처·공식 다운로드 링크·검색 오류 피드백은 유지했다.
- 1,083개 DLL과 5,121개 패키지 대응의 카탈로그 바이트는 변경하지 않았다. 기존 감사 SHA-256 및 원시 자료 3종의 해시 일치를 재확인했다.
- GitHub Pages 주소 `https://nanalab.kr/dll-directory/` 기준으로 canonical·상호 hreflang·x-default·사이트맵을 재생성했다. 사이트맵은 중복 없는 6,504 URL을 포함한다.
- 공개 빌드에 `index,follow`와 robots `Allow: /`를 적용했다. 기존 Sites 비공개 배포본의 공유 범위는 변경하지 않았다.
- 검색 코어 테스트 4개 그룹, 전체 HTML·링크/자산 189,720건의 정적 구조 검증을 통과했다. GitHub Actions도 같은 테스트·빌드·검증과 생성물 재현 검사를 실행한 뒤 배포한다.
- 실제 브라우저 검사는 실행되지 않았다. 브라우저 제어 제공자가 없었고 설치된 Chrome의 Computer Use 실행 승인이 시간 초과됐다. 모바일 레이아웃·실제 Clipboard 권한·광고 게재·분석 수신 성공을 확인했다고 주장하지 않는다. 자세한 범위는 `BROWSER_QA.json`에 기록했다.
- GTM·GA4·AdSense·Cloudflare 코드와 작은 회색 More Apps 링크를 유지했다. DLL·설치 바이너리·외부 문서 본문·도판을 호스팅하지 않는다.

## 공개 주소와 후속 연결

- 사이트: https://nanalab.kr/dll-directory/
- 저장소: https://github.com/NaNaCompany/dll-directory
- 사이트맵: https://nanalab.kr/dll-directory/sitemap.xml
- 6개 메인: `/`, `/en/`, `/es/`, `/zh/`, `/ja/`, `/de/`.
- 각 메인의 `dll/<파일명>/` 상세 경로와 같은 DLL의 6개 언어 이동을 유지한다.
- 최종 배포 커밋·GitHub Actions·Pages 배포 및 공개 대표 페이지 대조 결과는 워크스페이스의 배포 증거와 `UpdateQue.md`에 기록한다. 공개 목록에는 한국어 대표 카드 1개, 루트 sitemapindex에는 위 사이트맵 1개 연결 대상으로 정리한다.

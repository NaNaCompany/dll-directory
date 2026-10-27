# DLL Directory

Microsoft DLL 파일명에서 해당 파일을 포함한 공식 패키지로 연결하는 NaNa Lab의 독립적인 정적 자료실입니다. Microsoft 운영·보증 사이트가 아닙니다.

## 페이지와 기능

- 한국어 루트와 `/en/`, `/es/`, `/zh/`, `/ja/`, `/de/`를 유지합니다.
- 메인 6개와 DLL별 상세 6,498개, 총 6,504개 HTML 페이지입니다. 기존 언어별 다운로드 경로를 축소하거나 제거하지 않습니다.
- 각 언어 메뉴는 같은 DLL의 번역 페이지로 연결합니다. 다운로드 링크는 Microsoft 공식 패키지 또는 공식 제품 안내 페이지입니다.
- 검색은 대소문자·전각 문자를 정규화하고 오류 메시지에서 DLL 이름을 추출합니다. 런타임·SDK 필터, 파일명 복사, 파일 포함 근거를 제공합니다.
- 도입 설명, 검색 안내, 순위 해설, 패키지 설명·SDK 안내·제품 선택 안내와 홍보 문구는 화면에서 제거했습니다. 검색·다운로드 동작과 출처·버전·아키텍처 정보는 유지합니다.

## 데이터와 권리

1,083개 DLL 이름과 5,121개 DLL–패키지 대응을 동결한 `src/catalog.json`으로 빌드합니다. 런타임 676개, SDK·개발 도구 전용 407개입니다. 카탈로그 SHA-256은 `e42952744695eb9f1934ca7f12b81745f5a94c417dcc14fbb524a754bb1aedbd`입니다.

실제 ZIP·MSI·CAB·NuGet·MSIX 내부 파일 목록을 사용한 기존 감사를 보존했습니다. 불명확한 `marshal.dll`과 참조 DLL 매핑은 제외했습니다. 패키지에 파일이 들어 있다는 사실이 임의 앱의 오류 해결을 보장하지는 않습니다.

DLL·설치 파일·외부 문서 본문·도판·폰트 파일을 호스팅하거나 재배포하지 않습니다. UI·코드·설명·SVG는 자체 제작입니다. Microsoft 등 제품명은 사실 정보 식별용이며 권리는 해당 권리자에게 있습니다. 출처와 기존 감사 범위는 `PROVENANCE.json`·`SOURCE_AUDIT.json`에 기록했습니다.

## GitHub Pages

- 저장소: https://github.com/NaNaCompany/dll-directory
- 사이트: https://nanalab.kr/dll-directory/
- 사이트맵: https://nanalab.kr/dll-directory/sitemap.xml
- `APP.json`의 공개 origin으로 canonical·상호 hreflang·x-default·robots·사이트맵을 생성합니다.
- GitHub Actions가 테스트·빌드·전체 정적 검증 후 `dist/`를 Pages로 배포합니다. 기존 비공개 검토본의 공유 설정은 변경하지 않습니다.

```text
node --test scripts/core.test.mjs
node scripts/build.mjs
python scripts/validate.py
```

기존 동결 카탈로그로 재빌드할 때 외부 수집 작업이나 추가 패키지 설치는 필요 없습니다. 원시 자료를 갱신할 때만 같은 워크스페이스의 `dll-portal-research/{dotnet,legacy,packages}/entries.json`을 사용하는 `scripts/merge-sources.py`를 별도로 실행합니다. 기존 감사는 동결된 입력의 검증 기록이며 변경된 데이터에 자동으로 적용되지 않습니다.

## 광고와 분석

NaNa Lab의 GTM·GA4·AdSense·Cloudflare 설정과 작은 회색 `More Apps` 링크를 유지합니다. 코드 삽입, 실제 광고 게재, 분석 이벤트 수집은 서로 다른 검증 범위입니다.

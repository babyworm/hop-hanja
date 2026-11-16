# HOP Hanja

**한글·한자 변환 기능을 추가한 HOP 포크입니다.**

HOP Hanja는 [HOP](https://github.com/golbin/hop)를 기반으로 독립적으로 유지하는 프로젝트입니다.
원본 HOP의 변경을 받아오며, 한자 변환은 이 저장소에서 개발합니다. 원본 소스와 포크 수정분에는
[MIT 라이선스](LICENSE)를 적용하며, 한자 사전 데이터의 별도 조건은
[Third-Party Licenses](THIRD_PARTY_LICENSES.md)를 따릅니다.

HOP는 HWP/HWPX 문서를 보고 편집할 수 있는 오픈소스 macOS, Windows, Linux용 데스크탑 앱입니다.

문서 파싱과 렌더링의 기반은 [rhwp](https://github.com/edwardkim/rhwp)를 사용합니다. HOP는 그 위에 얇게 껍데기를 씌운 앱입니다. rhwp가 제공하는 기능을 바탕으로 파일 열기, 저장, PDF 내보내기, 인쇄, 파일 연결 같은 OS 통합 기능을 제공합니다.

![HOP editor](assets/screenshots/hop-editor.webp)

## 할 수 있는 일

현재 HOP는 다음 흐름을 지원합니다.

* HWP/HWPX 문서 열기
* HWP 문서 저장, 다른 이름으로 저장
* PDF로 내보내기
* 인쇄 다이얼로그 열기
* 파일 드래그 앤 드롭으로 열기
* `.hwp`, `.hwpx` 파일 연결
* 여러 창에서 문서 열기
* macOS Finder의 Quick Look 미리보기·썸네일
* 글꼴·글자색 팔레트, 최근 사용한 색, 여러 쪽 모아 보기
* F9 한글→한자 변환과 Alt/Option+F9 한자→한글 변환

## 다운로드

포크 배포본은 [HOP Hanja Releases](https://github.com/babyworm/hop-hanja/releases)에서 제공합니다.
현재 배포 대상은 Windows x64이며, macOS와 Linux는 필요할 때 별도로 빌드합니다.

* [Windows x64 설치 파일 (.exe)](https://github.com/babyworm/hop-hanja/releases/latest/download/HOP-windows-x64.exe)

포크의 자동 업데이트는 꺼져 있습니다. 새 버전은 이 저장소의 릴리스에서 직접 설치합니다.
원본 HOP의 Homebrew·AUR 패키지는 이 포크의 배포본이 아닙니다.

## 설치 유의사항

### Windows

Windows 빌드는 아직 서명되지 않아 Edge나 Windows SmartScreen에서 "일반적으로 다운로드되지 않습니다" 또는 실행 경고가 뜰 수 있습니다. 다운로드 항목의 `...` 메뉴에서 `유지`를 선택한 뒤 다운로드할 수 있습니다.

Windows에서는 `HOP Hanja`라는 별도 앱으로 설치합니다. 원본 HOP와 함께 설치할 수 있으며,
기존 HOP의 설정은 자동으로 옮겨지지 않습니다.

### Linux

Linux에서는 배포판에 맞는 네이티브 패키지를 우선 사용해 주세요. arm64 Linux는 Ubuntu/Debian 계열 `.deb`를 먼저 지원합니다.

0.5.2부터 AppImage는 시스템의 **WebKitGTK 4.1 런타임**을 우선 사용해 배포판의 입력기·그래픽 드라이버와 호환되도록 합니다. 시스템 런타임이 없으면 기존 번들 런타임으로 실행합니다. 한글 입력기 호환성 문제가 있다면 Ubuntu/Debian에서는 `sudo apt install libwebkit2gtk-4.1-0`으로 시스템 런타임을 준비해 주세요. AppImage와 KDE Wayland에서는 XWayland를 사용할 수 있을 때 X11을 기본으로 선택합니다. Wayland를 직접 사용하려면 `GDK_BACKEND=wayland`를 지정할 수 있습니다.

## 개발하기

개발 환경 준비, 실행 명령, 프로젝트 구조, `rhwp`와의 관계는 [개발 문서](docs/DEVELOPMENT.md)에 정리해 두었습니다.
이 포크의 upstream 수신·배포 정책은 [포크 유지보수 문서](docs/operations/HOP_HANJA.md)를 참고하세요.

## Credits

HOP Hanja는 Edward Kim이 만든 [HOP](https://github.com/golbin/hop)에서 포크했습니다.
문서 엔진은 [rhwp](https://github.com/edwardkim/rhwp)를 사용합니다.

HOP 소스 코드의 라이선스는 [MIT](LICENSE)입니다. 번들된 구성 요소와 데이터의 별도 조건은
[Third-Party Licenses](THIRD_PARTY_LICENSES.md)를 참고하세요.

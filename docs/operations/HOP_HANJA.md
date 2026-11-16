# HOP Hanja 포크 유지보수

이 저장소는 [HOP](https://github.com/golbin/hop)의 MIT 라이선스 포크다.
원저작권·MIT 전문과 한자 데이터의 별도 조건은 `LICENSE`와 `THIRD_PARTY_LICENSES.md`에 보존한다.

## Git 원격 저장소

`origin`은 이 포크이고, `upstream`은 원본 HOP다. upstream에서는 변경만 받아오며 push하지 않는다.
새 clone에서도 다음과 같이 설정한다.

```sh
git clone --recurse-submodules git@github.com:babyworm/hop-hanja.git
cd hop-hanja
git remote add upstream https://github.com/golbin/hop.git
git remote set-url --push upstream no_push://golbin/hop
git config remote.pushDefault origin
gh repo set-default babyworm/hop-hanja
```

로컬 push 차단은 실수 방지 설정이다. GitHub의 포크 관계와 upstream fetch 기능은 유지한다.
원본 변경은 별도 브랜치에서 `git fetch upstream`으로 가져와 검토하고, 포크 테스트를 거쳐 통합한다.
`third_party/rhwp`의 갱신은 기존 `RHWP_UPDATE.md` 절차를 따른다.

## 배포와 업데이트

포크의 자동 업데이트 endpoint는 비워 둔다. endpoint가 없으면 시작 시 업데이트 검사도 실행하지 않는다.
원본 HOP의 업데이트나 서명 키로 포크를 갱신하지 않는다. 자동 업데이트를 다시 켜려면
이 포크 전용 endpoint·서명 키와 설치된 버전의 호환성을 먼저 검증해야 한다.

현재 릴리스 대상은 Windows x64다. macOS와 Linux는 필요한 경우에만 별도로 빌드한다.
Windows 설치 파일은 Authenticode 서명을 적용하지 않으므로 Windows 보안 경고가 표시될 수 있다.
`tauri.windows.conf.json`이 Windows 제품 이름을 `HOP Hanja`, 앱 식별자를
`io.github.babyworm.hop-hanja`로 정하므로 원본 HOP와 별도로 설치하고 설정도 분리한다.

1. `main`에서 upstream·한자 데이터 계약, 테스트, Rust Clippy와 Studio 빌드를 검증한다.
2. 버전 메타데이터와 일치하는 새 태그를 생성한다. 기존 태그는 이동하지 않는다.
3. `HOP Desktop Release` workflow를 해당 태그에서 실행한다. `windows_x64=true`,
   macOS·Linux 선택은 모두 `false`, `run_tests=true`, `create_release=false`로 지정한다.
4. 이 workflow의 artifact 생성은 기존 upstream 릴리스의 macOS·updater 서명 요구와 별개다.
   성공한 Windows artifact의 MSI/EXE를 검증하고 SHA-256 목록과 릴리스 노트를 준비한다.
5. 이 포크의 GitHub Release에 `HOP-windows-x64.msi`와 생성된 `HOP-windows-x64.exe`,
   `SHA256SUMS.txt`, `LICENSE.txt`, `THIRD_PARTY_LICENSES.md`, `HANJA_THIRD_PARTY_NOTICES.md`를 올린다.
   바이너리에도 라이선스 파일과 한자 고지가 포함되어야 한다.
6. 업로드한 파일을 다시 내려받아 해시를 확인하고, 검증한 설치 범위를 릴리스 노트에 기록한다.

기존 `DESKTOP_RELEASE.md`의 원본 HOP 릴리스 정책은 참고용이다. 이 포크에서 macOS 산출물이나
자동 업데이트용 `latest.json`을 만들기 위한 목적으로 원본 workflow의 release 모드를 사용하지 않는다.

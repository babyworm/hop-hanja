# Third-Party Licenses

HOP Hanja source code is licensed under the repository's [MIT license](LICENSE).
Bundled third-party components and data remain subject to their respective
licenses and notices below.

## HOP upstream

HOP Hanja is a fork of [HOP](https://github.com/golbin/hop), originally created
by Edward Kim. The upstream copyright notice and complete MIT terms are retained
in [LICENSE](LICENSE), alongside the copyright for the fork's modifications.
The fork is maintained at <https://github.com/babyworm/hop-hanja>.

## rhwp

HOP is based on the read-only `rhwp` upstream component.

- License: [MIT](third_party/rhwp/LICENSE)
- Dependency and resource notices:
  [third_party/rhwp/THIRD_PARTY_LICENSES.md](third_party/rhwp/THIRD_PARTY_LICENSES.md)

## Bundled fonts

Bundled font families and their license identifiers are listed in
[assets/fonts/FONTS.md](assets/fonts/FONTS.md).

## Hanja database

The Hanja feature incorporates the following four data sources. It does not link
the libhangul library; the separately licensed `hanja.txt` data is used.

| Source | Pinned version or revision | License and use |
| --- | --- | --- |
| [libhangul `hanja.txt`](https://github.com/libhangul/libhangul/blob/a34aef73378c0992316861bbf13fc914ee7577d9/data/hanja/hanja.txt) | `a34aef73378c0992316861bbf13fc914ee7577d9` | BSD-3-Clause; word mappings, character readings and meanings |
| [Unicode Unihan](https://www.unicode.org/Public/17.0.0/ucd/Unihan.zip) | 17.0.0 | Unicode-3.0; character metadata |
| [Korean Basic Dictionary](https://krdict.korean.go.kr/kor/kboardPolicy/copyRightTermsInfo) | 2026-07-19 | CC-BY-SA-2.0-KR; word candidates and selected metadata |
| [Standard Korean Language Dictionary](https://stdict.korean.go.kr/join/copyrightPolicy.do) | 2026-06-05; [mirror `42c0d01`](https://github.com/spellcheck-ko/korean-dict-nikl/tree/42c0d01889f34536e9cf94fe57f62bd2055b1bde/stdict) | CC-BY-SA-2.0-KR; compact word-to-Hanja supplement |

The generated Hanja database has separate data licenses:

| Distributed data | Sources | License |
| --- | --- | --- |
| `characters.json`, `readings.json` | libhangul `hanja.txt`, Unicode Unihan 17.0.0 | BSD-3-Clause AND Unicode-3.0 |
| `words-*.json` | libhangul `hanja.txt`, Korean Basic Dictionary, Standard Korean Language Dictionary | CC-BY-SA-2.0-KR; the libhangul-derived portions retain the BSD-3-Clause notice |
| `stdict-20260605.json` | Standard Korean Language Dictionary | CC-BY-SA-2.0-KR |

The complete copyright notices, permission terms, source versions, attribution,
and modification disclosures are in
[apps/studio-host/public/dictionaries/hanja/THIRD_PARTY_NOTICES.md](apps/studio-host/public/dictionaries/hanja/THIRD_PARTY_NOTICES.md).
The generated manifest records the source revisions, hashes, and license
identifiers in
[apps/studio-host/public/dictionaries/hanja/manifest.json](apps/studio-host/public/dictionaries/hanja/manifest.json).

## 한국어 이용 조건 안내

다음 내용은 이해를 돕기 위한 요약입니다. 적용 조건의 전문은 각 라이선스와 저작권 고지를
따릅니다.

### HOP 원본과 포크 수정분: MIT

원본 HOP와 HOP Hanja 수정분은 사용·수정·재배포할 수 있습니다. 배포할 때는
`LICENSE`에 있는 원저작권 표시와 MIT 허가 문구·면책 조항을 보존해야 합니다.
변경한 소스를 원본 HOP 프로젝트에 제출할 의무는 없습니다.

### libhangul 한자 사전: BSD-3-Clause

사용한 `hanja.txt` 데이터의 저작권자는 Choe Hwanjin입니다. 원본 및 수정 데이터를 소스나
바이너리에 포함하여 배포할 때는 저작권 표시·세 가지 조건·면책 조항을 보존해야 합니다.
저작자나 기여자의 이름을 사전 허락 없이 제품 보증이나 홍보에 사용할 수 없습니다.
해당 데이터의 전문은 위의 한자 사전 고지 파일에 포함되어 있습니다.

### Unicode Unihan: Unicode License v3

Unihan 데이터와 이를 수정한 데이터를 배포할 때는 Unicode의 저작권 표시와 허가 문구를
데이터 또는 함께 배포하는 문서에 포함해야 합니다. 보증·홍보에 저작권자의 이름을 사용할 때도
라이선스의 제한을 따라야 합니다. 전문은 [Unicode License v3](https://www.unicode.org/license.txt)를
참고하세요.

### 국립국어원 사전 두 종류: CC BY-SA 2.0 KR

한국어기초사전과 표준국어대사전 자료에는 국립국어원 출처와 라이선스 링크를 표시하고,
추출·병합·정규화·분할 등의 변경 내용을 고지해야 합니다. 이 자료를 수정한 데이터베이스를
공유할 때는 동일한 CC BY-SA 2.0 KR 조건으로 배포해야 합니다. `words-*.json`과
`stdict-20260605.json`이 이 조건을 따르며, 앱 소스 코드의 MIT 라이선스와 구분하여 제공합니다.
전문은 [CC BY-SA 2.0 KR 이용허락규약](https://creativecommons.org/licenses/by-sa/2.0/kr/legalcode)을
참고하세요.

배포 앱의 **도움말 → HOP 정보**에서도 한자 사전의 저작권·라이선스 전문과 출처를 확인할 수 있습니다.

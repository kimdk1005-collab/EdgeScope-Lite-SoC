# 슬라이드 14 «Functional Verification» 제작 가이드

대상 파일: [src/14-functional-verification.html](src/14-functional-verification.html)
디자인 시스템: [src/deck.css](src/deck.css) · 배경: [src/deco.js](src/deco.js)
렌더러: [render.ps1](render.ps1) → `png/14-functional-verification.png`

---

## 0. 이 페이지가 해야 할 일

> **"설계가 맞다"가 아니라 "맞다는 것을 어떻게 증명했는가"를 보여주는 페이지.**

목차 4장(SoC 통합 및 검증)의 증명 슬라이드다. 심사자가 이 한 장에서 얻어야 하는 답은 4개다.

| 질문 | 답을 주는 카드 |
|---|---|
| 무엇을 몇 개나 검증했나 | ① Regression Test Results |
| 그 검증이 실제로 돌았다는 증거는 | ② RTL Simulation Evidence |
| 설계에서 가장 틀리기 쉬운 지점은 무엇이고 어떻게 막았나 | ③ Mandatory ARM Order |
| 하드웨어까지 실제로 나왔나 | ④ Implementation Sign-off |

**하지 말 것**: 아키텍처 재설명(13번 슬라이드 역할), 자원/성능 비교(15번 역할), RTL 코드 스니펫.
이 페이지는 *결과와 증거*만 담는다.

---

## 1. 가장 중요한 규칙 — 근거 원장(Evidence Ledger)

**이 페이지의 모든 숫자·문구는 저장소의 원본 파일에서 그대로 옮긴 것이어야 한다.**
기억이나 요약본에서 옮겨 쓰지 않는다. 값을 고칠 때는 반드시 아래 표의 출처를 다시 열어 대조한다.

### 1.1 Regression 카드

| 슬라이드 항목 | 출처 |
|---|---|
| 실행 명령 `./scripts/run_regression.sh --waves` | `scripts/run_regression.sh` (11행 `--waves` 처리) |
| 8개 테스트 행 · "핵심 검증 항목" 문구 | `docs/verification_report.md` 회귀 테스트 표 |
| 전부 PASS · 7 SV test + C check | `scripts/run_regression.sh` 마지막 `echo` |
| "원본 VCD 6개" | `artifacts/waves/*.vcd` 실제 개수 |
| "1 ps resolution" | 각 TB 첫 줄 `` `timescale 1ns/1ps `` |
| "Icarus Verilog" | 스크립트가 iverilog 우선, 없으면 xsim fallback |

### 1.2 ARM Order 카드

| 슬라이드 항목 | 출처 |
|---|---|
| 1~8단계 전체 | `docs/day1_common_spec.md` **§4.1 시스템 ARM 순서** |
| 레지스터/비트 이름 | `sw/include/logic_analyzer_regs.h` |
| "Frozen v2.1" | 같은 헤더의 `EDGE_SCOPE_SPEC_VERSION_MAJOR/MINOR = 2/1` |
| P0 감사 문구 | `docs/verification_report.md` 감사 표 P0 행 + §4.1 근거 문단 |

> 레지스터 이름은 **헤더에 있는 철자 그대로** 쓴다. `ABORT`/`CLEAR_DONE`/`PRE_READY`/`DONE`은
> 각각 `TRACE_CONTROL_ABORT`, `TRACE_CONTROL_CLEAR_DONE`, `TRACE_STATUS_PRE_READY`,
> `TRACE_STATUS_DONE`에서 온 것이다. 임의 축약(`CLR`, `RDY`)은 금지.

### 1.3 Implementation Sign-off 카드

| 슬라이드 항목 | 출처 | **스코프** |
|---|---|---|
| Block Design validation PASS | `comparison/edgescope_lite/hw/block_design.tcl` `validate_bd_design` | Design B |
| WNS `+0.832` / WHS `+0.028` | `comparison/edgescope_lite/reports/timing_summary.rpt` Design Timing Summary | Design B |
| TNS / THS `0.000` | 같은 표 | Design B |
| Failing endpoints `0 / 9,845` | 같은 표 (전 클럭 합산 총 endpoint) | Design B **design-wide** |
| Bitstream DRC error `0` | `comparison/edgescope_lite/reports/drc.rpt` (5 check 전부 Warning) | Design B |
| RAMB36E1 `33 / 50` | `comparison/edgescope_lite/reports/utilization.rpt` | Design B |
| Trace IP routed nets `140 / 140` | `docs/trace_buffer_implementation_result.md` | **Trace IP standalone OOC** |
| "RAMB36E1 정확히 1개" Tcl assert | `scripts/validate_packaged_ip_bd.tcl` | **packaged 서브시스템** |

---

## 2. 스코프 표기 규칙 (이 페이지에서 실제로 사고가 났던 지점)

카드 제목의 `<small>`이 "Design B · full SoC"라면, **그 카드 안의 모든 값은 Design B 전체 SoC
implementation 결과여야 한다.** 다른 빌드에서 온 값을 섞으려면 반드시 행마다 스코프를 표기한다.

현재 페이지에는 서로 다른 3개 빌드의 숫자가 라벨 없이 섞여 있다.

| 빌드 | 무엇 | 이 카드에 섞여 있는 값 |
|---|---|---|
| A. Trace IP standalone OOC | Custom IP 단독 합성 | routed nets 140/140 (WNS는 +4.978이라 다름) |
| B. packaged 서브시스템 | Trace IP + BMG + AXI BRAM Ctrl | RAMB36E1 Tcl assert "정확히 1개" |
| C. **Design B 전체 SoC** | MicroBlaze + 전체 | WNS/WHS/TNS/THS/DRC/endpoint |

### 적용된 패치 (2026-08-08 반영 완료)

`<head>`의 `<style>`에 스코프 태그 + 각주 + **표 압축** 스타일을 추가한다.

```css
.sc { font-size:12.5px; letter-spacing:.12em; text-transform:uppercase;
      color:rgba(255,255,255,.34); margin-left:8px; }
.note { margin-top:auto; padding-top:8px; font-size:13px;
        color:rgba(255,255,255,.5); line-height:1.3; }
/* 7행 + 각주는 기본 .micro 여백으로는 카드에 안 들어간다 */
.signoff { padding:24px 28px 22px; }
.signoff table.t.micro tbody td { padding:1.5px 10px; }
.signoff .rule { margin:10px 0 12px; }
```

Sign-off 카드에 `class="card signoff"`를 붙인다.

> **실측 근거**: 하단 row 카드의 내부 가용 높이는 약 199 px다.
> `.t.micro` 기본 여백(td padding 4px)으로 7행을 그리면 약 193 px를 먹어서
> 각주 24 px가 그대로 잘린다(`.card`의 `overflow:hidden`). 위 3줄로 약 26 px를
> 회수해야 각주가 들어간다. **행을 8개로 늘리면 다시 넘친다.**

Sign-off 표를 아래로 교체한다 (전체 SoC 값을 위로 모으고, OOC 값은 맨 아래 1행 + 각주로 격리).

```html
<tr><td>Block Design validation</td><td class="n"><span class="badge">PASS</span></td></tr>
<tr><td>100 MHz Setup WNS / Hold WHS</td><td class="n cy">+0.832 ns / +0.028 ns</td></tr>
<tr><td>TNS / THS</td><td class="n cy">0.000 ns / 0.000 ns</td></tr>
<tr><td>Failing endpoints <span class="sc">design-wide</span></td><td class="n cy">0 / 9,845</td></tr>
<tr><td>Bitstream DRC error</td><td class="n cy">0</td></tr>
<tr><td>RAMB36E1 <span class="sc">32 LMB + 1 capture</span></td><td class="n cy">33 / 50</td></tr>
<tr><td>Trace IP routed nets <span class="sc">OOC</span></td><td class="n cy">140 / 140 · error 0</td></tr>
```

표 뒤에 각주를 붙인다 (`.card`가 flex column이라 `margin-top:auto`로 바닥에 붙는다).

```html
<div style="margin-top:auto; padding-top:6px; font-size:14px;
            color:rgba(255,255,255,.5); line-height:1.3">
  마지막 행만 Trace IP standalone OOC · capture BRAM 1개는
  <span class="mono">validate_packaged_ip_bd.tcl</span> assert로 검사
</div>
```

**왜 이렇게까지 하나**: "full SoC"라고 써 놓고 OOC 값을 넣으면, 질의응답에서 "그 140개가 전체
SoC 네트 수입니까?"라는 질문 한 번에 페이지 전체 신뢰도가 무너진다. 반대로 스코프를 명시하면
"IP 단독과 시스템 통합을 각각 sign-off했다"는 더 강한 주장이 된다.

---

## 3. 레이아웃 규격

캔버스는 **1920 × 1080 고정**(`deck.css`가 `html, body`에 하드코딩). 스크롤·오버플로 없음.

```
┌─ .head.tight ───────────────────────────────────────────┐  eyebrow / h1 / sub
├─ .body (flex-direction:column) ─────────────────────────┤
│  .row  flex:1.45                                        │
│  ┌── .card       flex:1     ── Regression (cyan)  ────┐ │
│  └── .card.mag   flex:1.06  ── Waveform   (magenta)  ─┘ │
│  .row  flex:1.0  margin-top:26px                        │
│  ┌── .card.vio   flex:1.25  ── ARM Order  (violet)  ──┐ │
│  └── .card       flex:1     ── Sign-off   (cyan)   ───┘ │
└─────────────────────────────────────────────────────────┘
```

### 지켜야 할 값

- `.row` 간격은 `deck.css`의 `gap:26px`를 쓰고 개별 override하지 않는다.
- 카드 폭은 `flex` 비율로만 조절한다. `width` 고정 금지.
- 상단 row가 하단보다 큰(1.45 : 1.0) 이유는 **증거(표+파형)가 주장(순서+수치)보다 무거워야**
  하기 때문이다. 이 위계는 유지한다.
- 파형 카드가 `flex:1.06`으로 살짝 넓은 건 이미지 가로세로비 때문이다. 이미지를 교체하면
  이 값을 다시 맞춘다.

### 색 배정 규칙

| 클래스 | 색 | 이 덱에서의 의미 |
|---|---|---|
| `.card` (기본) | cyan | 사실·측정값 |
| `.card.mag` | magenta | 시각 증거 / 파형 |
| `.card.vio` | violet | 절차·규약 |
| `.card.plain` | 무채색 | 보조 정보 |

한 슬라이드에 accent 3색까지. 4색 이상 쓰면 강조가 사라진다.

---

## 4. 컴포넌트 사전 (deck.css에 이미 있는 것만 쓴다)

새 CSS를 만들기 전에 아래에 해당하는 게 있는지 먼저 확인한다.
페이지 로컬 `<style>`은 `.wave`처럼 **이 페이지에만 있는 것**에 한해 추가한다.

### 카드 골격 (모든 카드 공통)

```html
<div class="card">
  <div class="card-title" style="font-size:24px">
    <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">…</svg>
    카드 제목<small>우측 메타 정보</small>
  </div>
  <div class="rule"></div>
  <!-- 본문 -->
</div>
```

- `.card-title small`은 `margin-left:auto`라 자동으로 우측 정렬된다. **출처·명령어·스코프를
  넣는 자리**다. (`./scripts/run_regression.sh --waves`, `Frozen v2.1 §4.1`, `Design B · full SoC`)
- 아이콘은 24×24 viewBox, `stroke-width:1.7`, `fill:none`, `stroke="currentColor"` 고정.
  `currentColor`라서 카드 accent 색을 자동으로 따라간다.
- `.rule`은 카드 색에 맞는 그라데이션 구분선. 제목 아래 항상 1개.

### 표

| 클래스 | 용도 | 폰트 |
|---|---|---|
| `table.t` | 기본 | 18.5px |
| `.t.dense` | 행 많을 때 | 17px |
| `.t.tight` | ARM Order처럼 8행 2열 | 16.5px |
| `.t.micro` | Regression·Sign-off처럼 7~8행 + 긴 설명 | 15.5px |

셀 modifier: `.mono`(식별자) `.n`(우측정렬 = 수치) `.c`(중앙 = 배지) `.hi`(흰색 강조)
`.cy`/`.mg`/`.vi`(accent 색 수치)

```html
<td class="mono hi">tb_common_pkg</td>        <!-- 테스트 이름 -->
<td class="n cy">+0.832 ns / +0.028 ns</td>   <!-- 측정 수치 -->
<td class="c"><span class="badge">PASS</span></td>
```

### 배지

`.badge`(green, 기본 = PASS) · `.badge.cy` · `.badge.mg` · `.badge.am`(amber = 경고/감사 지적)

P0 감사 노트처럼 **"우리가 스스로 찾아 고친 결함"** 은 `.badge.am`으로 표시한다.

---

## 5. 카피(문구) 규칙

1. **원문 축약은 허용, 창작은 금지.** `verification_report.md`가 "reset, ARM, valid gating,
   exact prefill, early trigger ignore"라면 슬라이드에서 앞 4개만 남기는 건 된다.
   원문에 없는 항목을 넣는 건 안 된다.
2. **테스트 이름은 `..._trace_buffer_axi` 형태로 앞을 자른다.** 열 폭이 266px이라
   `tb_circular_trace_buffer_axi` 전체는 안 들어간다. 다만 `tb_common_pkg`처럼 짧으면 그대로.
3. **식별자는 `mono`, 산문은 일반체.** 레지스터·파일·경로·명령어는 전부 `.mono` 또는 `<b class="mono">`.
4. **숫자 서식**: 4자리 이상 천 단위 콤마(`1,024` `9,845`), 타이밍은 부호 + 소수 3자리 + 단위
   (`+0.832 ns`), 비율은 `현재 / 전체`(`140 / 140`, `33 / 50`).
   `table.t`에 `font-variant-numeric: tabular-nums`가 걸려 있어 자릿수가 자동 정렬된다.
5. **한/영 혼용 기준**: 고유명사·툴·신호명은 영문 그대로, 서술은 한국어. 억지 번역
   ("순환 추적 버퍼") 금지.
6. **문장은 카드 각주에서만.** 표 셀에는 명사구만 넣는다.

---

## 6. 파형 이미지 (RTL Simulation Evidence)

```html
<div class="wave">
  <img src="../../EdgeScope-Lite-SoC-main/docs/circular_trace_buffer_waveform.png" alt="…">
</div>
```

- 이미지는 `docs/circular_trace_buffer_waveform.png`이고, 원본은
  `scripts/render_waveform_evidence.py`가 `artifacts/waves/*.vcd`에서 직접 생성한 것이다.
  **GTKWave 스크린샷을 손으로 캡처해 넣지 않는다** — 재생성 경로가 끊긴다.
- 3단 구성(PREFILL→ARMED / ARMED→POST / POST→DONE)은 `day1_common_spec.md` §5의 상태 전이와
  1:1로 맞춘다. 슬라이드 본문의 상태 이름과 이미지 안 라벨이 달라지면 안 된다.
- `object-fit:contain`이라 잘리지는 않지만, 원본이 가로로 길면 위아래 여백이 생긴다.
  이미지 비율을 바꿨다면 파형 카드의 `flex` 값을 다시 잡는다.
- **경로 주의**: `../../EdgeScope-Lite-SoC-main/`은 리포지토리가 한 번 더 중첩된
  현재 폴더 구조(`Downloads/EdgeScope-Lite-SoC-main/EdgeScope-Lite-SoC-main/`) 기준이다.
  폴더를 평탄화하면 `../../docs/`로 고쳐야 한다.

---

## 7. 렌더 & 검수

```powershell
powershell -File slides\render.ps1 14
```

- Headless Chrome, `--force-device-scale-factor=1.5` → **2880 × 1620** PNG
- Google Fonts(Poppins / Chakra Petch / Noto Sans KR)를 렌더 시점에 받으므로 **인터넷 필요**.
  오프라인에서 뽑으면 폰트가 폴백되어 줄바꿈 위치가 전부 달라진다.
- `.deco`의 `data-seed="103"`, `data-side="right"`는 배경 메시 패턴을 결정한다.
  **인접 슬라이드와 seed가 겹치지 않게** 하고, 한번 정하면 바꾸지 않는다.

### 출고 전 체크리스트

- [ ] 표의 모든 숫자를 §1 원장의 출처 파일에서 **직접 다시 읽어** 대조했다
- [ ] 서로 다른 빌드의 값이 스코프 라벨 없이 한 카드에 섞이지 않았다 (§2)
- [ ] 레지스터·신호 이름이 `logic_analyzer_regs.h` 철자와 일치한다
- [ ] ARM 순서 8단계가 `day1_common_spec.md` §4.1과 단계 수·순서까지 일치한다
- [ ] PNG에서 카드 밖으로 넘친 텍스트나 잘린 행이 없다 (`.card`가 `overflow:hidden`이라
      **넘치면 조용히 잘린다** — 육안 확인 필수)
- [ ] 파형 이미지가 깨지지 않고 로드됐다 (경로 오류 시 alt 텍스트만 보인다)
- [ ] 페이지 번호 `.pnum`이 실제 덱 순서와 맞다
- [ ] 배지 색이 의미와 맞다 (green = PASS, amber = 감사 지적)

---

## 8. 발표 시 방어 논리

이 페이지에서 나올 법한 질문과, 슬라이드가 이미 답을 갖고 있는지:

| 예상 질문 | 슬라이드의 답 | 보강 필요 |
|---|---|---|
| 회귀를 지금 재현할 수 있나 | 카드 제목의 실행 명령 한 줄 | — |
| PASS 근거가 로그뿐인가 | VCD 6개 + 파형 이미지 | — |
| 왜 그 ARM 순서인가 | P0 감사 각주(one-shot pulse 소진) | — |
| 140/140이 전체 SoC 네트인가 | `OOC` 태그 + 각주 | 해결됨 |
| RAMB 33개 중 캡처용은 몇 개인가 | `RAMB36E1 33 / 50 · 32 LMB + 1 capture` | 해결됨 |
| Front-end IP는 회귀에 왜 없나 | 각주 "Front-end **AXI** TB는 XSim으로 별도 실행" | 해결됨 (XSim 스크립트는 `run_frontend_axi_xsim.sh` 하나뿐이라 "AXI TB"로 정정) |
| 보드 실측인가 합성 결과인가 | 없음 | Design B는 구현까지만이고 실측은 A뿐 — 필요하면 각주 1줄 추가 |

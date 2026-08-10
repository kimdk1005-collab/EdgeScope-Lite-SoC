# EdgeScope-Lite — 추가 발표 슬라이드

`EdgeScope_Lite.pdf`의 목차(`Project Contents`) 기준으로, 아직 만들어지지 않았던
슬라이드 8장을 기존 슬라이드와 같은 디자인으로 제작했다.

- 해상도: **2880 × 1620** (16:9, 1920×1080 논리 해상도를 1.5× 렌더)
- 위치: [png/](png/)

## 최종 슬라이드 순서

| # | 슬라이드 | 목차 | 상태 |
|---:|---|---|---|
| 1 | EdgeScope Logic Analyzer (표지) | — | 기존 (PDF p.1) |
| 2 | Project Contents | — | 기존 (PDF p.2) |
| 3 | The Challenge | 1. 프로젝트 배경 및 목표 | 기존 (PDF p.3) |
| 4 | Project Goals | 1. 프로젝트 배경 및 목표 | 기존 (PDF p.4) |
| 5 | Roles | 1. 프로젝트 배경 및 목표 | 기존 (PDF p.5) |
| 6 | Project Timeline | 1. 프로젝트 배경 및 목표 | 기존 (PDF p.6) |
| 7 | System Specification | 2. System Architecture | 기존 (PDF p.7) |
| **8** | **System Configuration** | 2. System Architecture — System Config. | **신규** |
| **9** | **IP Configuration** | 2. System Architecture — IP Config. | **신규** |
| 10 | Probe Sampler IP | 3. Custom IP 설계 | 기존 (PDF p.8) |
| **11** | **Basic Trigger Engine IP** | 3. Custom IP 설계 | **신규** |
| **12** | **Circular Trace Buffer IP** | 3. Custom IP 설계 | **신규** |
| **13** | **SoC Architecture** | 4. SoC 통합 및 검증 | **신규** |
| **14** | **Functional Verification** | 4. SoC 통합 및 검증 | **신규** |
| **15** | **Resource Comparison** | 5. 결과 및 결론 | **신규** |
| **16** | **Conclusion** | 5. 결과 및 결론 | **신규** |

기존 PDF p.8(Probe Sampler IP)은 신규 08·09번 뒤로 이동해 10번 자리에 놓으면
목차 순서와 일치한다.

## 슬라이드별 근거 자료

| 슬라이드 | 출처 |
|---|---|
| 08 System Configuration | `comparison/common/base_soc.tcl`, `comparison/edgescope_lite/README.md`, `docs/day1_common_spec.md` |
| 09 IP Configuration | `docs/day1_common_spec.md` §2·§6, `comparison/edgescope_lite/hw/block_design.tcl`, `ip_repo/` |
| 11 Basic Trigger Engine IP | `rtl/core/basic_trigger_engine.v`, `docs/day1_common_spec.md` §3.2·§4·§6.2 |
| 12 Circular Trace Buffer IP | `docs/circular_trace_buffer_datasheet.md`, `docs/day1_common_spec.md` §5·§6.3, `docs/verification_report.md` |
| 13 SoC Architecture | `comparison/common/base_soc.tcl`, `comparison/edgescope_lite/hw/block_design.tcl`, `docs/bram_integration.md` |
| 14 Functional Verification | `docs/verification_report.md`, `scripts/run_regression.sh`, `docs/circular_trace_buffer_waveform.png`, `comparison/edgescope_lite/reports/` |
| 15 Resource Comparison | `comparison/{cpu_polling,edgescope_lite,vivado_ila}/reports/{utilization,timing_summary}.rpt` |
| 16 Conclusion | 위 전부 + `comparison/cpu_polling/README.md` (A 비교군 실측값) |

수치는 모두 저장소의 리포트 원본에서 직접 읽어 옮겼다. 보드 실측이 확보된
비교군은 A(CPU Polling)뿐이라 B/C는 합성·구현 결과로만 표기했다.

## 다시 렌더링하기

원본은 HTML이라 텍스트를 고치고 다시 뽑을 수 있다.

```powershell
# 전체
powershell -File slides\render.ps1

# 한 장만
powershell -File slides\render.ps1 13
```

- 소스: [src/](src/) — 슬라이드별 `.html` + 공용 `deck.css`, `deco.js`
- 렌더러: Headless Chrome (`--force-device-scale-factor=1.5`)
- 폰트는 Google Fonts(Poppins, Chakra Petch, Noto Sans KR)를 렌더 시점에
  내려받으므로 인터넷 연결이 필요하다.

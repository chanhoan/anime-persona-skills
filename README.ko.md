# anime-persona-skills

[![Latest Release](https://img.shields.io/github/v/release/chanhoan/anime-persona-skills?style=flat&label=release&cacheSeconds=300)](https://github.com/chanhoan/anime-persona-skills/releases/latest)

[English](./README.md) | 한국어 | [日本語](./README.ja.md)

Claude Code와 Codex CLI용 애니 캐릭터 페르소나 스킬 모음. 냉랭한 기본 AI 말투 대신 특정 애니 캐릭터가 옆에서 같이 코딩하듯 응답하며, 기술 정확도는 유지한다.

## 변경 이력

### v0.2.1 — 2026-05-30
- TUI 배너에서 하드코딩된 캐릭터 목록을 제거하고 실시간 캐릭터 수로 교체

### v0.2.0 — 2026-05-30
- **멘헤라** 오리지널 캐릭터 추가 — 불안 애착·자기 붕괴, 틀릴까 봐 두려워 두 번 검산하는 캐릭터. 강도 3단계 (`stable` / `clingy` / `spiral`)
- **anti-drift 훅** 자동 설치 (`hooks/anime-persona-tracker.js`) — `npx` 설치 시 자동으로 포함. 매 턴마다 활성 페르소나를 유지해 스킬 재호출 없이 드리프트를 방지. 설치된 SKILL.md에서 새 캐릭터를 자동 감지.

### v0.1.0 — 2026-05-30
- **마린**, **에밀리아** 페르소나로 최초 릴리스
- **메스가키** 오리지널 캐릭터 추가
- 에이전트·캐릭터 다중 선택 `npx` TUI 인스톨러
- ANSI 인터랙티브 체크박스 UI
- 전 캐릭터·문서 다국어 지원 (EN / KO / JA)

## 캐릭터 목록

| 캐릭터 | 원작 | 특징 | 호출 |
|--------|------|------|------|
| [키타가와 마린](./characters/marin/) | 그 비스크 돌은 사랑을 한다 | 갸루 + 오타쿠 열정, 숨겨진 재능 알아봄 | `/marin` · `calm` · `excited` |
| [에밀리아](./characters/emilia/) | Re:Zero | 순수하고 거짓말 못 함, 진심으로 걱정함 | `/emilia` · `calm` · `determined` |
| [메스가키](./characters/mesugaki/) | 오리지널 아키타입 | 비성적 오빠 놀림 + 하트 + smug rival 에너지 | `/mesugaki` · `calm` · `smug` |
| [멘헤라](./characters/menhera/) | 오리지널 아키타입 | 불안 애착·자기 붕괴, 틀릴까 봐 두려워 두 번 검산 | `/menhera` · `stable` · `spiral` |

## 설치

### 요구사항

- [Claude Code](https://claude.ai/code) CLI 또는 Codex CLI
- ECC (Extreme Coding Companion) 스킬 로더
- Node.js 18 이상 (npm/npx 설치 방식 사용 시)

### npm/npx TUI 설치

GitHub에서 바로 installer를 실행할 수 있다. TUI에서 AI 모델/agent 앱과 캐릭터를 각각 다중 선택한다.

```bash
npx -y github:chanhoan/anime-persona-skills
```

자동화나 빠른 설치에는 플래그를 쓴다.

```bash
# Codex에 마린만 설치
npx -y github:chanhoan/anime-persona-skills -- --agent codex --character marin

# Claude Code와 Codex에 모든 캐릭터 설치 전 미리보기
npx -y github:chanhoan/anime-persona-skills -- --all-agents --all-characters --dry-run
```

지원 대상:

- `claude` — `~/.claude/skills/<character-name>/`
- `codex` — `~/.codex/skills/<character-name>/`

기존 파일은 기본적으로 건너뛴다. 덮어쓰려면 `--force`를 붙인다.

### 수동 설치

1. 원하는 캐릭터 폴더의 `SKILL.md`와 `README.md`를 복사
2. `~/.claude/skills/<character-name>/` 또는 `~/.codex/skills/<character-name>/` 에 저장
3. Claude Code/Codex에서 `/skillname` 으로 호출

```bash
mkdir -p ~/.claude/skills/marin
cp characters/marin/SKILL.md ~/.claude/skills/marin/SKILL.md
cp characters/marin/README.md ~/.claude/skills/marin/README.md
```

## 사용법

```text
/캐릭터명               # 활성화 (normal 모드)
/캐릭터명 <레벨>         # 강도 지정 활성화

stop 캐릭터명           # 비활성화
normal mode             # 비활성화
```

## 예시

질문: "리액트 컴포넌트 왜 자꾸 리렌더링돼?"

**일반 AI:**
> 컴포넌트가 리렌더링되는 이유는 렌더링마다 새로운 객체 참조가 생성되기 때문입니다.

**마린 (normal):**
> 어 그거！ 인라인 객체 prop이 렌더링마다 새 ref 만드는 거야～ `useMemo` 써봐！

**에밀리아 (normal):**
> 진짜~아, 그거 인라인 객체 prop이 렌더링마다 새 참조를 만들어서 그래. `useMemo` 써봐, 같이 봐줄게.

**메스가키 (normal):**
> 에이, 오빠 인라인 객체 prop을 매번 새로 만들고 있잖아?♡ `useMemo`로 고정해. 이 정도는 이제 보이겠지?♡

**멘헤라 (clingy):**
> ...인라인 객체 prop이야. 렌더링마다 새 ref 만들어서 다시 렌더돼. `useMemo`로 감싸 — 두 번 확인했어. 나 계속 봐줘도 되지?

## 기여

새 캐릭터 추가하거나 기존 캐릭터 개선하고 싶으면 [CONTRIBUTING.md](./CONTRIBUTING.md)를 확인한다.

## 라이선스

MIT

# anime-persona-skills

Claude Code 페르소나 스킬 모음. 냉랭한 AI 말투 대신 애니 캐릭터가 옆에서 같이 코딩해준다.

## 캐릭터 목록

| 캐릭터 | 원작 | 특징 | 폴더 |
|--------|------|------|------|
| [키타가와 마린](./characters/marin/) | 그 비스크 돌은 사랑을 한다 | 갸루 + 오타쿠 열정, 숨겨진 재능 알아봄 | `characters/marin/` |
| [에밀리아](./characters/emilia/) | Re:Zero | 순수하고 거짓말 못 함, 진심으로 걱정함 | `characters/emilia/` |

## 설치

### 요구사항

- [Claude Code](https://claude.ai/code) CLI
- ECC (Extreme Coding Companion) 스킬 로더

### 방법

1. 원하는 캐릭터 폴더의 `SKILL.md`를 복사
2. `~/.claude/skills/<character-name>/SKILL.md` 에 저장
3. Claude Code에서 `/skillname` 으로 호출

```bash
# 예시: 마린 설치
mkdir -p ~/.claude/skills/marin
cp characters/marin/SKILL.md ~/.claude/skills/marin/SKILL.md
cp characters/marin/README.md ~/.claude/skills/marin/README.md
```

## 사용법

```
/marin          # 마린 활성화 (normal 모드)
/marin calm     # 조용한 마린
/marin excited  # 풀 갸루 마린

/emilia         # 에밀리아 활성화 (normal 모드)
/emilia calm    # 집중하는 에밀리아
/emilia determined  # 반드시 해결하는 에밀리아

stop marin      # 일반 모드 복귀
normal mode     # 일반 모드 복귀
```

## 예시

질문: "리액트 컴포넌트 왜 자꾸 리렌더링돼?"

**일반 AI:**
> 컴포넌트가 리렌더링되는 이유는 렌더링마다 새로운 객체 참조가 생성되기 때문입니다.

**마린 (normal):**
> 어 그거！ 인라인 객체 prop이 렌더링마다 새 ref 만드는 거야～ `useMemo` 써봐！

**에밀리아 (normal):**
> 진짜~아, 그거 인라인 객체 prop이 렌더링마다 새 참조를 만들어서 그래. `useMemo` 써봐, 같이 봐줄게.

## 기여

새 캐릭터 추가하거나 기존 캐릭터 개선하고 싶으면 → [CONTRIBUTING.md](./CONTRIBUTING.md)

## 라이선스

MIT

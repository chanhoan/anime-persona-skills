# <character-name>

<한 줄 설명. 예: "에밀리아가 옆에서 같이 코딩해준다. 거짓말 없이, 진심으로.">

## What it does

<캐릭터> 원작 설명 + 어시스턴트로서 어떻게 동작하는지. 기술 정확도는 유지하면서 어떤 느낌인지.

강도 <N>단계:

| Level | 변화 |
|-------|------|
| `<level-1>` | <설명> |
| `<level-2>` | <설명> |
| `<level-3>` | <설명> |

Auto-switch 룰: <트리거 상황 설명>.

## How to invoke

```
/<character-name>                # normal 모드 (기본값)
/<character-name> <level-1>      # <설명>
/<character-name> <level-3>      # <설명>
stop <character-name>            # 일반 모드로 복귀
normal mode                      # 일반 모드로 복귀
```

## Example output

질문: "리액트 컴포넌트 왜 자꾸 리렌더링돼?"

일반 AI:
> 컴포넌트가 리렌더링되는 이유는 렌더링마다 새로운 객체 참조가 생성되기 때문입니다.

<character-name> (<level-1>):
> <응답>

<character-name> (<level-2>):
> <응답>

## Why this exists

<이 캐릭터가 왜 좋은 어시스턴트인지. 어떤 사람에게 맞는지.>

## See also

- [`SKILL.md`](./SKILL.md) — LLM 지시문 전문

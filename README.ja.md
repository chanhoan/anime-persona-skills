# anime-persona-skills

[![Latest Release](https://img.shields.io/github/v/release/chanhoan/anime-persona-skills?style=flat&label=release)](https://github.com/chanhoan/anime-persona-skills/releases/latest)

[English](./README.md) | [한국어](./README.ko.md) | 日本語

Claude Code と Codex CLI 向けのアニメキャラクター・ペルソナスキル集です。冷たい標準 AI 口調の代わりに、特定のアニメキャラクターらしい声で一緒にコーディングします。技術的な正確さは維持します。

## キャラクター

| キャラクター | 原作 | 特徴 | 呼び出し |
|--------------|------|------|----------|
| [喜多川海夢](./characters/marin/) | その着せ替え人形は恋をする | ギャル + オタク熱量、隠れた才能を見つけて喜ぶ | `/marin` · `calm` · `excited` |
| [エミリア](./characters/emilia/) | Re:Zero | 純粋で誠実、嘘がつけず、本気で心配する | `/emilia` · `calm` · `determined` |
| [メスガキ](./characters/mesugaki/) | オリジナル・アーキタイプ | 非性的ないじわる teasing + smug rival エネルギー | `/mesugaki` · `calm` · `smug` |
| [メンヘラ](./characters/menhera/) | オリジナル・アーキタイプ | 不安型の依存・自己崩壊、間違いを恐れて二重確認 | `/menhera` · `stable` · `spiral` |

## インストール

### 必要条件

- [Claude Code](https://claude.ai/code) CLI または Codex CLI
- ECC (Extreme Coding Companion) スキルローダー
- npm/npx インストールを使う場合は Node.js 18 以上

### npm/npx TUI インストール

GitHub からインストーラーを直接実行できます。TUI で AI モデル/agent アプリとキャラクターをそれぞれ複数選択できます。

```bash
npx -y github:chanhoan/anime-persona-skills
```

自動化や高速インストールにはフラグを使います。

```bash
# Codex に Marin だけインストール
npx -y github:chanhoan/anime-persona-skills -- --agent codex --character marin

# Claude Code と Codex に全キャラクターを入れる前に確認
npx -y github:chanhoan/anime-persona-skills -- --all-agents --all-characters --dry-run
```

対応先:

- `claude` — `~/.claude/skills/<character-name>/`
- `codex` — `~/.codex/skills/<character-name>/`

既存ファイルはデフォルトでスキップします。上書きする場合は `--force` を付けます。

### 手動インストール

1. キャラクターの `SKILL.md` と `README.md` をコピーします。
2. `~/.claude/skills/<character-name>/` または `~/.codex/skills/<character-name>/` に配置します。
3. Claude Code または Codex で `/skillname` を呼び出します。

```bash
mkdir -p ~/.claude/skills/marin
cp characters/marin/SKILL.md ~/.claude/skills/marin/SKILL.md
cp characters/marin/README.md ~/.claude/skills/marin/README.md
```

## 使い方

```text
/キャラクター名              # 有効化 (normal モード)
/キャラクター名 <レベル>      # 強度指定で有効化

stop キャラクター名          # 無効化
normal mode                 # 無効化
```

## 例

質問: "React コンポーネントが何度も再レンダーされるのはなぜ？"

**通常の AI:**
> コンポーネントは、レンダーごとに新しいオブジェクト参照が作られるため再レンダーされます。

**Marin (normal):**
> あ、それだ！インラインのオブジェクト prop がレンダーのたびに新しい ref 作ってるんだよ～ `useMemo` 使ってみて！

**Emilia (normal):**
> ほんと~に、それはインラインのオブジェクト prop がレンダーのたびに新しい参照を作っているからだよ。`useMemo` を使ってみて、一緒に見るね。

**Mesugaki (normal):**
> ほら、お兄さん、インラインの object prop がレンダーのたびに新しい ref 作ってるじゃん♡ `useMemo` で固定して。次は見えるよね？♡

**Menhera (clingy):**
> ...インラインの object prop だよ。レンダーごとに新しい ref 作るから再レンダーされるの。`useMemo` で包んで — 二回確認したから。まだ私に見てほしいよね？

## 変更履歴

### v0.2.0 — 2026-05-30
- **メンヘラ** オリジナルキャラクター追加 — 不安型の依存・自己崩壊、間違いを恐れて二重確認する性格。強度3段階 (`stable` / `clingy` / `spiral`)
- **anti-drift フック** 自動インストール (`hooks/anime-persona-tracker.js`) — `npx` インストール時に自動で含まれる。毎ターンアクティブなペルソナを維持し、スキル再呼び出し不要でドリフトを防止。インストール済みの SKILL.md から新キャラクターを自動検出。

### v0.1.0 — 2026-05-30
- **マリン**・**エミリア** ペルソナで初回リリース
- **メスガキ** オリジナルキャラクター追加
- エージェント・キャラクター複数選択対応 `npx` TUI インストーラー
- ANSI インタラクティブチェックボックス UI
- 全ペルソナ・ドキュメントの多言語対応 (EN / KO / JA)

## コントリビューション

新しいキャラクターの追加や既存キャラクターの改善は [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## ライセンス

MIT

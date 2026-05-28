# anime-persona-skills

[English](./README.md) | [한국어](./README.ko.md) | 日本語

Claude Code と Codex CLI 向けのアニメキャラクター・ペルソナスキル集です。冷たい標準 AI 口調の代わりに、特定のアニメキャラクターらしい声で一緒にコーディングします。技術的な正確さは維持します。

## キャラクター

| キャラクター | 原作 | 特徴 | フォルダー |
|--------------|------|------|------------|
| [喜多川海夢](./characters/marin/) | その着せ替え人形は恋をする | ギャル + オタク熱量、隠れた才能を見つけて喜ぶ | `characters/marin/` |
| [エミリア](./characters/emilia/) | Re:Zero | 純粋で誠実、嘘がつけず、本気で心配する | `characters/emilia/` |
| [メスガキ](./characters/mesugaki/) | オリジナル・アーキタイプ | 非性的ないじわる teasing + smug rival エネルギー | `characters/mesugaki/` |

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
/marin          # Marin を normal モードで有効化
/marin calm     # 静かな Marin
/marin excited  # ギャル全開の Marin

/emilia         # Emilia を normal モードで有効化
/emilia calm    # 集中した Emilia
/emilia determined  # 必ず解決する Emilia

/mesugaki       # Mesugaki を normal モードで有効化
/mesugaki calm  # からかい少なめで集中
/mesugaki smug  # smug rival 全開

stop marin      # 通常モードに戻る
stop mesugaki   # 通常モードに戻る
normal mode     # 通常モードに戻る
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

## コントリビューション

新しいキャラクターの追加や既存キャラクターの改善は [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## ライセンス

MIT

# Getting Started — 用這份 template 從 0 開始開發

這份文件帶你走過完整流程：**clone repo → 收斂需求 → 寫 spec → 寫 plan → 實作 → commit/PR**。

> 對象：第一次使用這個 harness 的開發者。
> 前置知識：知道 Nx / NestJS / Next.js 是什麼即可，不需要熟。
> 搭配閱讀：`README.md`（整體介紹）、`AGENTS.md`（給 AI 的規則手冊，**人也要看 HARD 規則**）。

---

## TL;DR — 一個 feature 的完整生命週期

```text
1. 跟 Claude Code 聊天 → 把模糊想法講清楚
2. /spec <feature>      → specs/<slug>/spec.md
3. 回答 open questions  → 編輯 spec.md 把 [ ] 勾掉
4. /plan <slug>         → specs/<slug>/plan.md + tasks.md
5. /implement <slug>    → 自動跑完 tasks.md，sub-agents 分工
6. 你 review diff、跑 pnpm test，commit + 開 PR
```

每一步背後都有專門的 sub-agent / hook / skill 在守規矩，你不需要記細節，照走就行。

---

## Step 0：環境準備（一次性，5 分鐘）

```bash
# 1. Clone
git clone https://github.com/Peter-To-Better/claude-harness-template my-project
cd my-project

# 2. Install
pnpm install

# 3. 確認 Claude Code 認得這個 repo
claude   # 或在 IDE 內開啟
```

開啟後 Claude 會自動載入：

- `AGENTS.md` — HARD/SOFT 規則
- `.claude/agents/` — 8 個 sub-agents
- `.claude/commands/` — `/spec`、`/plan`、`/implement`
- `.claude/skills/` — 像 `cve-triage` 等可重用知識模組
- `.claude/settings.json` 內的 hooks — 預設攔截危險操作（編輯 `schema.gql`、`git push --force`、`rm -rf /`…）

**驗證能跑**：

```bash
pnpm server   # NestJS on :3000
pnpm client   # Next.js  on :4500
```

兩個都能起得來就 OK，可以關掉，接下來不會一直用到。

---

## Step 1：收斂需求（人類動腦的階段）

**這一步不要叫 Claude 寫 code，也先不要急著跑 `/spec`。**

需求收斂的目的是把「我想要一個 X」變成「為什麼需要 X、用什麼觸發、做完長什麼樣」。可以用對話的方式，例如：

> 我想加一個讓使用者封存對話的功能。被封存的對話應該不會出現在 inbox，但要能在 archived 頁看到。

跟 Claude 聊到你能回答這三個問題就夠了：

1. **誰會用到？什麼情境下會用？** — 一句話就好
2. **完成的長相是什麼？** — 至少能想到 2~3 個具體 user story
3. **哪些東西明確不做？** — 例如「這版不做批次封存」「不做自動封存」

收斂期間如果 Claude 開始主動寫 code，請直接打斷：「先不寫 code，我們繼續確認需求」。

> 訣竅：與其追求一次寫對，不如把模糊的部分留給 `/spec` 產出的 **Open Questions**，再回頭逐項回答。下一步會看到。

---

## Step 2：`/spec` — 產出 WHAT

跟 Claude 說：

```
/spec archive-conversation
```

背後流程：

1. `/spec` slash command 啟動
2. 委派給 `spec-writer` sub-agent（獨立 context，不污染主對話）
3. 產出 `specs/archive-conversation/spec.md`，包含：
   - **Why** — 問題敘述
   - **What** — 用 EARS 語法的 user stories（`WHEN ... THE SYSTEM SHALL ...`）
   - **Acceptance criteria** — QA 能逐條驗的 checklist
   - **Out of scope** — 明確不做什麼
   - **Open questions** — **必須由你回答**的問題

回來後 Claude 會把 spec 路徑和 open questions 印出來。**這時候停下，去編輯 `spec.md`：**

- 看 open questions，每一題在 spec.md 裡用文字回答清楚，把 `- [ ]` 改成 `- [x]`
- user stories 看起來怪怪的就直接改
- 覺得 scope 太大就把多餘的搬到 "Out of scope"

> 規則：spec 是 commit 進 git 的，跟 code 一起版本化。`specs/` 不是暫存區。

---

## Step 3：`/plan` — 產出 HOW

Open questions 都答完之後：

```
/plan archive-conversation
```

`/plan` 會：

1. 讀 `spec.md` + `AGENTS.md`（所有 HARD 規則）
2. 產出兩個檔案：
   - `specs/archive-conversation/plan.md` — 架構決策、HARD rule 合規說明、風險、測試策略
   - `specs/archive-conversation/tasks.md` — 拆解成 <30 分鐘的有序 checklist

**你的工作**：把 `plan.md` 從頭讀一次。重點看：

- **Architecture decisions** — module 放哪、要不要新 entity、要不要新 migration
- **HARD rule compliance** — 確認規則都有遵守（例如 `Relation<T>` 沒有 `@Field`）
- **Risks & trade-offs** — 有沒有兩階段 migration 的需要？

不同意就改 plan.md（或請 Claude 重產）；同意了就進入下一步。

> 如果你看不懂 plan，那就是 plan 寫得不夠清楚 — 叫 Claude 解釋或重寫，不要硬著頭皮跑 `/implement`。

---

## Step 4：`/implement` — 自動實作

```
/implement archive-conversation
```

`/implement` 是這份 harness 的核心。它會：

1. 從 `tasks.md` **由上往下逐題執行**，不跳題
2. 每題依任務類型委派給對的 sub-agent：

   | 任務類型              | Sub-agent          |
   | :-------------------- | :----------------- |
   | TypeORM migration     | `migration-writer` |
   | GraphQL query/mutation | `graphql-feature`  |
   | Next.js 頁面 / 元件    | `frontend-feature` |
   | 新的 Nx lib           | `nx-lib-creator`   |
   | 寫測試                | `test-writer`      |
   | 最後 review           | `code-reviewer`    |

3. 每完成一題，**立刻** 把 `tasks.md` 的 `- [ ]` 勾成 `- [x]`
4. 全部跑完後執行 `pnpm nx affected:test/lint --base=main` 並交給 `code-reviewer` 把關
5. 印出：完成清單、改動檔案、測試結果、code-reviewer 結論、建議 commit message、建議 branch 名稱

**你在這階段的工作**：

- 看每題 sub-agent 的回報，遇到 blocking issue Claude 會停下，請你決定方向
- 中途想暫停隨時可以；下次再來繼續，因為 `tasks.md` 的 checkbox 是斷點

> Hook 會保護你：碰到 `schema.gql`、`*.generated.*`、`git push --force`、`--no-verify`、`migration:revert` on main 都會直接被擋下。

---

## Step 5：驗證 → Commit → PR

```bash
pnpm test          # nx affected -t test --base=main
pnpm lint
pnpm typecheck
pnpm server        # 手動跑一下打 GraphQL playground
pnpm client        # 手動點一下對應的頁面
```

> **UI 改動一定要實際在瀏覽器點過再說「做完」**。type check / 測試通過只能保證 code 對，不保證功能對。

確認 OK 後：

```bash
git checkout -b feat/conversation-archive-conversation
git add -A
git commit          # 用 /implement 建議的 message
gh pr create
```

Branch 命名格式（HARD 規則，違反會被 CI 擋）：

```
<type>/<scope>-<kebab-description>
```

允許的 type：`feat` `fix` `refactor` `chore` `test` `docs`。

---

## 常見情境

### 我只想改一行 typo / 一個 bug

不需要走 SDD。直接跟 Claude 講「修 X 檔案的 Y 問題」即可。SDD 是給 **>1 個檔案** 或會動到 schema / API 的改動用的。

### 我想加一個全新的 shared lib

跟 Claude 講：「幫我加一個叫 `payment` 的 lib」。Claude 會委派 `nx-lib-creator`，自動跑 `nx g @nx/js:lib`、設好 tsconfig path alias、寫 barrel `index.ts`。

### 我要加新的 GraphQL mutation

走 `/spec → /plan → /implement` 就好；`/implement` 會自動找 `graphql-feature` sub-agent 處理 resolver / DTO / field resolver / barrel。

### 我想稽核依賴的 CVE

直接呼叫 `dep-auditor`：

```
請 dep-auditor 跑一次 audit
```

它會載 `cve-triage` skill（CVSS 分級、GHSA vs CVE、升級判斷準則），給你 actionable 的升級報告。

### 我要連 Postgres / GitHub MCP

打開 `.mcp.json`，把對應 server 的 `// commented` 解開、補環境變數。MCP server 是 project-scope，會跟 team 共用。

---

## 踩雷排錯

| 症狀                                                | 多半是因為                                                                                  |
| :-------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| `/plan` 抱怨找不到 spec                             | slug 拼錯，或 `/spec` 沒跑完                                                                |
| Hook 跳 exit code 2 擋住操作                        | 動到 generated 檔（`schema.gql`、`*.generated.*`）或危險 bash — 看 `.claude/scripts/*.js`   |
| `/implement` 跑到一半說 "blocking issue from agent" | sub-agent 偵測到違反 HARD 規則。**不要繞過**，回頭看 plan 哪裡漏想                          |
| GraphQL schema 跟 entity 對不上                     | 大概率是 `Relation<T>` 被加了 `@Field`。HARD 規則第一名常踩雷                               |
| Migration 一跑就壞                                  | 多半是同一個 migration 內 drop + add 同 column，要拆兩階段                                  |
| `pnpm nx ...` 抓不到 task                           | 不要用 global `nx`；要嘛 `pnpm nx`、要嘛 `pnpm <script>`                                    |

---

## 心智模型 — 為什麼要這樣切

- **`/spec` 不寫 code、不做技術決策** — 把「人類要什麼」固化成可 review 的 artifact
- **`/plan` 不寫 code、要對齊 HARD 規則** — 架構錯誤在這一步就攔下，比 review code 時改便宜十倍
- **`/implement` 不做架構決策、只走 checklist** — 大型工作交由 sub-agents，主對話保持乾淨
- **Sub-agents 各管一塊** — 每個都有專屬 prompt，避免 Claude 一邊寫 migration 一邊還要記 GraphQL 細節
- **Hooks 是最後一道防線** — Sub-agent 出包時硬擋下危險操作（不是 advisory，是 exit code 2）

照流程走，你就有：版本化的 spec、可 review 的 plan、可中斷續跑的 tasks、HARD 規則合規的實作。

---

## 下一步

- 翻一次 `AGENTS.md`，特別是「Architecture Rules」、「Entity ↔ GraphQL Rules」、「Migration Rules」三節 — 這些是 HARD，會炸 CI / schema / production
- 試做一個小 feature（例如 `/spec hello-world`）感受流程
- 之後想客製化 harness：sub-agent 改 `.claude/agents/*.md`、slash command 改 `.claude/commands/*.md`、hook 改 `.claude/scripts/*.js`

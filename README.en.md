# Luo Skills

**Choose Agent Skills by task and install each one independently.**

[中文](README.md) · English

[Website and examples](https://luoqaq.github.io/luo-skills/) · [Detailed installation guide (Chinese)](docs/installation.md) · [Local preview (Chinese)](docs/installation.md#本地预览)

## Available Skills

| Skill / installation name | Use cases | Capabilities |
|---|---|---|
| [task-ui-prototype](skills/task-ui-prototype/SKILL.md) | Desktop and mobile UI prototypes for admin tools, workspaces, lists, detail views, and forms | Compare 2–3 runnable visual directions, expand interactive flows, verify them, and keep scoped design preferences locally |
| [less-talk](skills/less-talk/SKILL.md) | Everyday questions, explanations, advice, progress updates, and result reports | Lead with the conclusion and its supporting evidence; organize concise answers around the question while preserving necessary facts, conditions, and steps |

There are currently **2 Skills**, each in `skills/<name>/`. A Skill includes its `SKILL.md`, references, and assets as one installable directory. UI guidelines, visual presets, and examples are parts of `task-ui-prototype`, not separate Skills.

`task-ui-prototype` delivers runnable web prototypes, source, startup instructions, a design brief, and verification results. Mini program and native app concepts are represented as web prototypes; demo data and simulated host features do not establish real service or platform integration. Marketing landing pages and static art are outside its scope. Missing browser, screenshot, or interaction checks must be reported as unverified.

`less-talk` guides how AI generates answers in a conversation. Simple facts or distinctions default to 1–3 sentences; it stops once answered and does not add an unrequested tutorial. When more detail is needed, it uses “answer or conclusion → key reasons or evidence → necessary additions,” adapted for explanations, choices, procedures, and reports. It avoids repeating the same information in tables or summaries and indents supporting details or examples at most one level. It expands when the user explicitly requests detail. Invoke it for one conversation or [configure it as a default across conversations (Chinese)](docs/installation.md#less-talk-跨对话默认启用); installation alone does not activate it on every turn.

## Install

### Recommended: Ask your Agent

Send this request to an Agent with network, terminal, and file access. Replace the Skill name with `less-talk` to install the concise-answer Skill:

```text
Install task-ui-prototype from https://github.com/luoqaq/luo-skills
into this Agent's personal skills directory. Install only this Skill.
Follow docs/installation.md. If it already exists, inspect its version
and preserve my memory/ directory before updating.
Report the actual installation path and outcome.
```

For project scope, replace “personal skills directory” with “current project's skills directory.” Pasting the repository link alone does not mean installation has completed.

### Alternative: Use the terminal

These commands use the third-party [skills CLI](https://github.com/vercel-labs/skills#readme), requiring Node.js, npm, and Git that meet its [version requirements](https://github.com/vercel-labs/skills/blob/main/package.json). The first `npx` run may download the tool. This example installs for personal use in Codex:

```sh
# List available Skills
npx skills add luoqaq/luo-skills --list

# Install only this Skill; use less-talk for concise answers
npx skills add luoqaq/luo-skills --skill task-ui-prototype --agent codex -g
```

For a project install, run the command in that project's root and omit `-g`. Back up any existing personal `memory/` before updating. See the [detailed guide (Chinese)](docs/installation.md) for multiple Skills, other Agents, manual installation, and updates.

## Usage examples

**Task UI prototype:**

```text
Use task-ui-prototype to design a mobile web prototype for a clothing
store manager. Include only the home page, product list, and product detail.
Treat this as a new design without copying an existing UI.
I have no visual direction yet; start with 2–3 runnable alternatives.
```

A known direction can go straight to a reference page. Say “Choose the visual direction and proceed” to delegate that decision.

**Less Talk — concise answers:**

```text
Use $less-talk to answer: What is the difference between Git commit and push?
```

You can also say: “Follow less-talk for this conversation. Lead with the conclusion, skip preambles and repetition, and keep necessary details.” In Codex, invoke `$task-ui-prototype` or `$less-talk` explicitly; other Agents may use different syntax.

Explore the [website and examples](https://luoqaq.github.io/luo-skills/) or follow the [local preview steps (Chinese)](docs/installation.md#本地预览). Website maintenance and build instructions are in [site/README.md (Chinese)](site/README.md).

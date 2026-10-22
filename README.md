# PLANKA MCP Server

A Model Context Protocol (MCP) server for [PLANKA](https://planka.app) kanban boards, purpose-built for Claude and other AI agents.

## Features

- Full PLANKA 2.0 API support
- Type-safe with Zod validation
- Optimized for agent workflows (combined operations, sensible defaults)
- 16 tools covering cards, tasks, labels, members, comments, and lists

## Team Setup

This fork adds card member support and is not published to npm. Each team member installs it straight from GitHub. It runs locally on their machine (stdio), so there is no server to deploy.

### Prerequisites

- Node.js 18 or later
- Read access to `jorge-mendoza-f/planka-mcp` on GitHub (SSH or HTTPS)
- Your own PLANKA account, added as a member of every board you want to work with

### Claude Code

```bash
claude mcp add planka \
  -e PLANKA_BASE_URL=https://planka.example.com \
  -e PLANKA_AGENT_EMAIL=you@example.com \
  -e PLANKA_AGENT_PASSWORD=your-password \
  -- npx -y github:jorge-mendoza-f/planka-mcp
```

Run `claude mcp list` to check the server shows as connected.

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows), then restart Claude Desktop:

```json
{
  "mcpServers": {
    "planka": {
      "command": "npx",
      "args": ["-y", "github:jorge-mendoza-f/planka-mcp"],
      "env": {
        "PLANKA_BASE_URL": "https://planka.example.com",
        "PLANKA_AGENT_EMAIL": "you@example.com",
        "PLANKA_AGENT_PASSWORD": "your-password"
      }
    }
  }
}
```

The first start takes a little longer because npx downloads and builds the server.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PLANKA_BASE_URL` | Yes | Your PLANKA server URL |
| `PLANKA_AGENT_EMAIL` | Yes | Your PLANKA email or username |
| `PLANKA_AGENT_PASSWORD` | Yes | Your PLANKA password |

Use your own PLANKA account rather than a shared one, so changes are attributed to you. Never commit these values to a repository (for example in a shared `.mcp.json`).

### Updating

npx caches the build. To pick up new changes, clear the npx cache (macOS and Linux) and restart Claude:

```bash
rm -rf ~/.npm/_npx
```

To pin a specific version instead, use `github:jorge-mendoza-f/planka-mcp#<tag-or-commit>`.

### Troubleshooting

- **Server fails to start:** check `node --version` is 18 or later, and that you can clone the repository.
- **Authentication errors:** check the three environment variables, and that you can log in to PLANKA in a browser with the same details.
- **Board or card not found, or cannot assign members:** your PLANKA account must be a member of the board.

## Available Tools

### Navigation

| Tool | Description |
|------|-------------|
| `planka_get_structure` | Get projects, boards, and lists hierarchy |
| `planka_get_board` | Get a board with all cards, lists, labels, and members |

### Cards

| Tool | Description |
|------|-------------|
| `planka_create_card` | Create a card (optionally with tasks) |
| `planka_update_card` | Update card properties |
| `planka_move_card` | Move card to different list/position |
| `planka_get_card` | Get card details with tasks/comments/labels/members |
| `planka_delete_card` | Delete a card |

### Tasks

| Tool | Description |
|------|-------------|
| `planka_create_tasks` | Add tasks (checklist items) to a card |
| `planka_update_task` | Update task name or completion |
| `planka_delete_task` | Delete a task |

### Labels

| Tool | Description |
|------|-------------|
| `planka_manage_labels` | Create/update/delete board labels |
| `planka_set_card_labels` | Add/remove labels from a card |

### Members

| Tool | Description |
|------|-------------|
| `planka_set_card_members` | Add/remove members (users) on a card. Get user IDs from `planka_get_board` |

### Comments

| Tool | Description |
|------|-------------|
| `planka_add_comment` | Add a comment to a card |
| `planka_get_comments` | Get all comments on a card |

### Lists

| Tool | Description |
|------|-------------|
| `planka_manage_lists` | Create/update/delete lists |

## Usage Examples

### Get board structure

```
Use planka_get_structure to see all projects and boards
```

### Create a card with tasks

```
Use planka_create_card with:
- listId: "abc123"
- name: "Implement feature X"
- tasks: ["Research", "Design", "Implement", "Test"]
```

### Move card through workflow

```
Use planka_move_card to move card from "To Do" to "In Progress"
```

## PLANKA 2.0 Compatibility

This server is designed for PLANKA 2.0 and handles the API differences from 1.x:

- Card creation includes required `type` field
- Label endpoints use `/card-labels` path
- Member endpoints use `/card-memberships` path
- Optional fields handled gracefully

## Development

```bash
# Clone
git clone https://github.com/gogogadgetbytes/planka-mcp.git
cd planka-mcp

# Install
npm install

# Build
npm run build

# Test
npm test
```

## License

MIT

## Links

- [PLANKA](https://planka.app) - The kanban board
- [MCP SDK](https://github.com/modelcontextprotocol/sdk) - Model Context Protocol
- [Design Document](./DESIGN.md) - Technical design details

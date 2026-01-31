# Theme Structure

CSS variables for theming, defined in `apps/web/src/index.css`.

## Base

| Variable       | Purpose                              |
| -------------- | ------------------------------------ |
| `--background` | Page background color                |
| `--foreground` | Default text color on `--background` |

## Surfaces

Elevated elements that sit on top of the background.

| Variable               | Purpose                           |
| ---------------------- | --------------------------------- |
| `--card`               | Card backgrounds                  |
| `--card-foreground`    | Text color on cards               |
| `--popover`            | Dropdown menus, tooltips, dialogs |
| `--popover-foreground` | Text color on popovers            |

## Semantic Colors

| Variable                 | Purpose                                                |
| ------------------------ | ------------------------------------------------------ |
| `--primary`              | Primary actions (buttons, links, active states)        |
| `--primary-foreground`   | Text on primary-colored elements                       |
| `--secondary`            | Secondary actions, less prominent than primary         |
| `--secondary-foreground` | Text on secondary-colored elements                     |
| `--accent`               | Highlights, badges, achievements, non-primary emphasis |
| `--accent-foreground`    | Text on accent-colored elements                        |
| `--destructive`          | Errors, warnings, delete actions                       |
| `--muted`                | Subdued backgrounds (disabled states, subtle sections) |
| `--muted-foreground`     | Subdued text (captions, placeholders, secondary info)  |

## Form Elements

| Variable   | Purpose                                          |
| ---------- | ------------------------------------------------ |
| `--border` | Default border color for all elements            |
| `--input`  | Input field borders (can differ from `--border`) |
| `--ring`   | Focus ring color for keyboard navigation         |

## Charts

Sequential palette for data visualization.

| Variable    | Typical Use           |
| ----------- | --------------------- |
| `--chart-1` | Primary data series   |
| `--chart-2` | Secondary data series |
| `--chart-3` | Tertiary data series  |
| `--chart-4` | Fourth data series    |
| `--chart-5` | Fifth data series     |

## Sidebar

Sidebar can have its own color scheme independent of the main UI.

| Variable                       | Purpose                |
| ------------------------------ | ---------------------- |
| `--sidebar`                    | Sidebar background     |
| `--sidebar-foreground`         | Sidebar text           |
| `--sidebar-primary`            | Active/selected items  |
| `--sidebar-primary-foreground` | Text on active items   |
| `--sidebar-accent`             | Hover states, badges   |
| `--sidebar-accent-foreground`  | Text on accent items   |
| `--sidebar-border`             | Sidebar borders        |
| `--sidebar-ring`               | Focus rings in sidebar |

## Dark Mode

All variables should be redefined in `.dark` selector with appropriate values for dark backgrounds. Generally:

- Invert background/foreground relationships
- Desaturate vivid colors for eye comfort
- Increase contrast for borders
- Brighten destructive colors for visibility

import { type ReactNode, useState } from "react"
import { createToaster } from "../behavior/toast.ts"
import type { BannerTone, Tone } from "../contract/index.ts"
import {
  Avatar,
  Badge,
  Banner,
  Button,
  buttonClass,
  Card,
  Checkbox,
  Chip,
  ConfirmDialog,
  DataState,
  Dialog,
  Disclosure,
  EmptyState,
  ErrorMessage,
  Field,
  Inline,
  Input,
  Menu,
  PageHeader,
  Pagination,
  Radio,
  SegmentedControl,
  Select,
  Skeleton,
  SkeletonText,
  Spinner,
  Stack,
  StatusDot,
  Switch,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Textarea,
  ToastStack,
  Toolbar,
  Tooltip,
} from "../react/index.ts"

const TONES: Tone[] = ["neutral", "accent", "success", "warning", "danger", "done"]
const RANGES = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
] as const

function Segmented() {
  const [range, setRange] = useState<(typeof RANGES)[number]["value"]>("week")
  return <SegmentedControl label="Range" options={RANGES} value={range} onChange={setRange} />
}

function Plan() {
  const [plan, setPlan] = useState("free")
  return (
    <>
      {["free", "pro"].map((p) => (
        <Radio
          key={p}
          name="plan-react"
          value={p}
          label={p === "free" ? "Free" : "Pro"}
          checked={plan === p}
          onChange={() => setPlan(p)}
        />
      ))}
    </>
  )
}

const BANNERS: [BannerTone, string][] = [
  ["accent", "Heads up: maintenance at 02:00."],
  ["success", "Saved."],
  ["warning", "Sync is 3 hours behind."],
  ["danger", "Import failed."],
]

function DialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        title="Rename dashboard"
        onClose={() => setOpen(false)}
        onSubmit={() => setOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </>
        }
      >
        <Field label="Name">{({ controlId }) => <Input id={controlId} />}</Field>
      </Dialog>
    </>
  )
}

function ConfirmDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete…
      </Button>
      <ConfirmDialog
        open={open}
        title="Delete dashboard?"
        confirmLabel="Delete"
        onConfirm={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        This removes 12 panels. It cannot be undone.
      </ConfirmDialog>
    </>
  )
}

function ThemeMenu() {
  const [theme, setTheme] = useState("monokai")
  return (
    <Menu
      label="Theme"
      trigger="Theme"
      size="small"
      align="end"
      items={[
        { label: "GitHub", selected: theme === "github", onSelect: () => setTheme("github") },
        { label: "Monokai", selected: theme === "monokai", onSelect: () => setTheme("monokai") },
      ]}
    />
  )
}

const toaster = createToaster()
toaster.push("Saved.", { tone: "success", duration: 0 })

function PagerDemo() {
  const [page, setPage] = useState(5)
  return <Pagination page={page} last={12} onPage={setPage} />
}

function DismissDemo() {
  const [shown, setShown] = useState(true)
  return shown ? (
    <Banner tone="warning" className="gallery__fill" onDismiss={() => setShown(false)}>
      Sync is 3 hours behind.
    </Banner>
  ) : null
}

const DEMOS: Record<string, () => ReactNode> = {
  "btn-variants": () => (
    <>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </>
  ),
  "btn-small": () => (
    <>
      <Button size="small">Default</Button>
      <Button variant="primary" size="small">
        Primary
      </Button>
      <Button variant="ghost" size="small">
        Ghost
      </Button>
      <Button variant="danger" size="small">
        Danger
      </Button>
    </>
  ),
  "btn-disabled": () => (
    <>
      <Button disabled>Default</Button>
      <Button variant="primary" disabled>
        Primary
      </Button>
    </>
  ),
  "btn-link": () => (
    <a className={buttonClass({ variant: "primary" })} href="#btn-link">
      Link as button
    </a>
  ),

  input: () => <Input placeholder="Plain input" />,
  "input-states": () => (
    <>
      <Input invalid defaultValue="not-an-email" />
      <Input disabled placeholder="Disabled" />
    </>
  ),
  select: () => (
    <Select>
      <option>GitHub</option>
      <option>Monokai</option>
    </Select>
  ),
  textarea: () => <Textarea placeholder="Notes" />,

  "field-hint": () => (
    <Field label="Email" hint="We never share it.">
      {({ controlId, describedBy }) => (
        <Input type="email" id={controlId} aria-describedby={describedBy} />
      )}
    </Field>
  ),
  "field-error": () => (
    <Field label="Name" error="Required.">
      {({ controlId, describedBy }) => (
        <Input invalid id={controlId} aria-describedby={describedBy} />
      )}
    </Field>
  ),

  checkbox: () => (
    <>
      <Checkbox label="Email me" />
      <Checkbox label="Subscribed" defaultChecked />
      <Checkbox label="Disabled" disabled />
    </>
  ),
  radio: () => <Plan />,
  switch: () => (
    <>
      <Switch label="Notifications" />
      <Switch label="Dark mode" defaultChecked />
      <Switch label="Locked" disabled />
    </>
  ),

  segmented: () => <Segmented />,

  "badge-tones": () => (
    <>
      {TONES.map((t) => (
        <Badge key={t} tone={t}>
          {t}
        </Badge>
      ))}
    </>
  ),
  "dot-tones": () => (
    <>
      {TONES.map((t) => (
        <StatusDot key={t} tone={t} label={t} showLabel />
      ))}
    </>
  ),
  "dot-pulse": () => <StatusDot tone="success" label="Online" pulse />,

  "card-padded": () => <Card padded>A padded card.</Card>,
  "card-sections": () => (
    <Card>
      <div className="card__header">
        <h3 className="card__title">Balances</h3>
        <Badge tone="success">synced</Badge>
      </div>
      <div className="card__body">Card body.</div>
    </Card>
  ),
  "card-selected": () => (
    <Card padded selected>
      Selected card.
    </Card>
  ),

  table: () => (
    <Table fit>
      <thead>
        <tr>
          <TableHead>Account</TableHead>
          <TableHead num>Balance</TableHead>
        </tr>
      </thead>
      <tbody>
        <TableRow>
          <TableCell>Cash</TableCell>
          <TableCell num>1,200.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Stocks</TableCell>
          <TableCell num>8,450.10</TableCell>
        </TableRow>
        <TableRow muted>
          <TableCell>Closed</TableCell>
          <TableCell num>0.00</TableCell>
        </TableRow>
      </tbody>
    </Table>
  ),

  stack: () => (
    <Stack gap={2}>
      <div className="gallery__box">One</div>
      <div className="gallery__box">Two</div>
      <div className="gallery__box">Three</div>
    </Stack>
  ),
  "inline-between": () => (
    <Inline justify="between" className="gallery__fill">
      <div className="gallery__box">Left</div>
      <div className="gallery__box">Right</div>
    </Inline>
  ),
  "page-header": () => (
    <PageHeader
      className="gallery__fill"
      title="Dashboards"
      meta="12 panels"
      actions={
        <>
          <Button size="small">Edit</Button>
          <Button variant="primary" size="small">
            New
          </Button>
        </>
      }
    />
  ),

  "empty-state": () => (
    <EmptyState className="gallery__fill" title="No dashboards yet">
      Create one to get started.
    </EmptyState>
  ),
  "error-message": () => (
    <>
      <ErrorMessage error={new Error("Could not reach the server.")} />
      <ErrorMessage error="Required." inline />
    </>
  ),
  "banner-tones": () => (
    <>
      {BANNERS.map(([tone, text]) => (
        <Banner key={tone} tone={tone} className="gallery__fill">
          {text}
        </Banner>
      ))}
    </>
  ),
  spinner: () => <Spinner />,

  "ds-loading": () => <ListState isLoading error={null} data={undefined} />,
  "ds-error": () => (
    <ListState isLoading={false} error={new Error("Request failed: 502")} data={undefined} />
  ),
  "ds-empty": () => <ListState isLoading={false} error={null} data={[]} />,
  "ds-data": () => <ListState isLoading={false} error={null} data={["alpha", "beta"]} />,

  dialog: () => <DialogDemo />,
  "confirm-dialog": () => <ConfirmDemo />,
  menu: () => (
    <Menu
      label="Dashboard actions"
      trigger="Actions"
      items={[
        { label: "Duplicate", onSelect: () => undefined },
        { label: "Export CSV", onSelect: () => undefined },
        { label: "Delete", onSelect: () => undefined, disabled: true },
      ]}
    />
  ),
  "menu-radio": () => <ThemeMenu />,
  tooltip: () => (
    <>
      <Tooltip label="Copy to clipboard">
        {({ describedBy }) => <Button aria-describedby={describedBy}>Copy</Button>}
      </Tooltip>
      <Tooltip label="Opens the docs" placement="bottom">
        {({ describedBy }) => (
          <Button variant="ghost" aria-describedby={describedBy}>
            Help
          </Button>
        )}
      </Tooltip>
    </>
  ),

  toast: () => (
    <>
      <Button size="small" onClick={() => toaster.push("Synced 3 accounts.")}>
        Info
      </Button>
      <Button size="small" onClick={() => toaster.push("Saved.", { tone: "success" })}>
        Success
      </Button>
      <Button size="small" onClick={() => toaster.push("Import failed.", { tone: "danger" })}>
        Danger
      </Button>
      <ToastStack toaster={toaster} />
    </>
  ),

  tabs: () => (
    <Tabs
      className="gallery__fill"
      label="Repository"
      items={[
        { label: "Overview", href: "#overview", current: true },
        { label: "Issues", href: "#issues", count: 12 },
        { label: "Settings", href: "#settings" },
      ]}
    />
  ),
  pagination: () => <PagerDemo />,
  toolbar: () => (
    <Toolbar label="Filters" card className="gallery__fill">
      <Chip label="Open" count={4} defaultChecked />
      <Chip label="Closed" count={9} />
      <Button variant="ghost" size="small">
        Clear
      </Button>
    </Toolbar>
  ),

  avatar: () => (
    <>
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Ada Lovelace" />
      <Avatar name="Ada Lovelace" size="lg" />
      <Avatar name="linus" size="lg" />
    </>
  ),
  skeleton: () => (
    <div className="gallery__stack">
      <Skeleton width="40%" />
      <SkeletonText />
      <Skeleton variant="block" />
      <Skeleton variant="circle" />
    </div>
  ),
  disclosure: () => (
    <>
      <Disclosure className="gallery__fill" summary="Advanced options">
        Hidden until opened.
      </Disclosure>
      <Disclosure className="gallery__fill" summary="Details" open>
        Open from the start.
      </Disclosure>
    </>
  ),
  "banner-dismiss": () => <DismissDemo />,
}

function ListState(props: { isLoading: boolean; error: unknown; data: string[] | undefined }) {
  return (
    <DataState {...props} empty={<EmptyState className="gallery__fill" title="Nothing here" />}>
      {(items) => (
        <ul className="gallery__list">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
    </DataState>
  )
}

export const REACT_DEMO_IDS = Object.keys(DEMOS)

export function ReactDemo({ id }: { id: string }) {
  const render = DEMOS[id]
  return render ? render() : null
}

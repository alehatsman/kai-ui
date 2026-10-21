import { type ReactNode, useState } from "react"
import type { BannerTone, Tone } from "../contract/index.ts"
import {
  Badge,
  Banner,
  Button,
  buttonClass,
  Card,
  Checkbox,
  DataState,
  EmptyState,
  ErrorMessage,
  Field,
  Inline,
  Input,
  PageHeader,
  Radio,
  SegmentedControl,
  Select,
  Spinner,
  Stack,
  StatusDot,
  Switch,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Textarea,
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

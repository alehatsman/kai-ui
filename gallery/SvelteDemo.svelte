<script lang="ts" module>
  import { createToaster } from "../behavior/toast.ts"

  const toaster = createToaster()
  toaster.push("Saved.", { tone: "success", duration: 0 })
</script>

<script lang="ts">
  import type { BannerTone, Tone } from "../contract/index.ts"
  import {
    Avatar,
    Badge,
    Banner,
    Button,
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
  } from "../svelte/index.ts"

  let { id }: { id: string } = $props()

  const TONES: Tone[] = ["neutral", "accent", "success", "warning", "danger", "done"]
  const RANGES = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ]
  const BANNERS: [BannerTone, string][] = [
    ["accent", "Heads up: maintenance at 02:00."],
    ["success", "Saved."],
    ["warning", "Sync is 3 hours behind."],
    ["danger", "Import failed."],
  ]

  let range = $state("week")
  let plan = $state("free")
  const failure = new Error("Request failed: 502")

  let dialogOpen = $state(false)
  let confirmOpen = $state(false)
  let theme = $state("monokai")
  let page = $state(5)
  let bannerShown = $state(true)
  const noop = () => undefined
</script>

{#snippet listState(isLoading: boolean, error: unknown, data: string[] | undefined)}
  <DataState {isLoading} {error} {data}>
    {#snippet empty()}<EmptyState class="gallery__fill" title="Nothing here" />{/snippet}
    {#snippet children(items)}
      <ul class="gallery__list">
        {#each items as i (i)}<li>{i}</li>{/each}
      </ul>
    {/snippet}
  </DataState>
{/snippet}

{#if id === "btn-variants"}
  <Button>Default</Button>
  <Button variant="primary">Primary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Danger</Button>
{:else if id === "btn-small"}
  <Button size="small">Default</Button>
  <Button variant="primary" size="small">Primary</Button>
  <Button variant="ghost" size="small">Ghost</Button>
  <Button variant="danger" size="small">Danger</Button>
{:else if id === "btn-disabled"}
  <Button disabled>Default</Button>
  <Button variant="primary" disabled>Primary</Button>
{:else if id === "btn-link"}
  <a class="btn btn--primary" href="#btn-link">Link as button</a>
{:else if id === "input"}
  <Input placeholder="Plain input" />
{:else if id === "input-states"}
  <Input invalid value="not-an-email" />
  <Input disabled placeholder="Disabled" />
{:else if id === "select"}
  <Select>
    <option>GitHub</option>
    <option>Monokai</option>
  </Select>
{:else if id === "textarea"}
  <Textarea placeholder="Notes" />
{:else if id === "field-hint"}
  <Field label="Email" hint="We never share it.">
    {#snippet children({ controlId, describedBy })}
      <Input type="email" id={controlId} aria-describedby={describedBy} />
    {/snippet}
  </Field>
{:else if id === "field-error"}
  <Field label="Name" error="Required.">
    {#snippet children({ controlId, describedBy })}
      <Input invalid id={controlId} aria-describedby={describedBy} />
    {/snippet}
  </Field>
{:else if id === "checkbox"}
  <Checkbox label="Email me" />
  <Checkbox label="Subscribed" checked />
  <Checkbox label="Disabled" disabled />
{:else if id === "radio"}
  <Radio name="plan-svelte" value="free" label="Free" bind:group={plan} />
  <Radio name="plan-svelte" value="pro" label="Pro" bind:group={plan} />
{:else if id === "switch"}
  <Switch label="Notifications" />
  <Switch label="Dark mode" checked />
  <Switch label="Locked" disabled />
{:else if id === "segmented"}
  <SegmentedControl label="Range" options={RANGES} bind:value={range} />
{:else if id === "badge-tones"}
  {#each TONES as t (t)}<Badge tone={t}>{t}</Badge>{/each}
{:else if id === "dot-tones"}
  {#each TONES as t (t)}<StatusDot tone={t} label={t} showLabel />{/each}
{:else if id === "dot-pulse"}
  <StatusDot tone="success" label="Online" pulse />
{:else if id === "card-padded"}
  <Card padded>A padded card.</Card>
{:else if id === "card-sections"}
  <Card>
    <div class="card__header">
      <h3 class="card__title">Balances</h3>
      <Badge tone="success">synced</Badge>
    </div>
    <div class="card__body">Card body.</div>
  </Card>
{:else if id === "card-selected"}
  <Card padded selected>Selected card.</Card>
{:else if id === "table"}
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
{:else if id === "stack"}
  <Stack gap={2}>
    <div class="gallery__box">One</div>
    <div class="gallery__box">Two</div>
    <div class="gallery__box">Three</div>
  </Stack>
{:else if id === "inline-between"}
  <Inline justify="between" class="gallery__fill">
    <div class="gallery__box">Left</div>
    <div class="gallery__box">Right</div>
  </Inline>
{:else if id === "page-header"}
  <PageHeader class="gallery__fill" title="Dashboards" meta="12 panels">
    {#snippet actions()}
      <Button size="small">Edit</Button>
      <Button variant="primary" size="small">New</Button>
    {/snippet}
  </PageHeader>
{:else if id === "empty-state"}
  <EmptyState class="gallery__fill" title="No dashboards yet">Create one to get started.</EmptyState>
{:else if id === "error-message"}
  <ErrorMessage error={new Error("Could not reach the server.")} />
  <ErrorMessage error="Required." inline />
{:else if id === "banner-tones"}
  {#each BANNERS as [tone, text] (tone)}<Banner {tone} class="gallery__fill">{text}</Banner>{/each}
{:else if id === "spinner"}
  <Spinner />
{:else if id === "ds-loading"}
  {@render listState(true, null, undefined)}
{:else if id === "ds-error"}
  {@render listState(false, failure, undefined)}
{:else if id === "ds-empty"}
  {@render listState(false, null, [])}
{:else if id === "ds-data"}
  {@render listState(false, null, ["alpha", "beta"])}
{:else if id === "dialog"}
  <Button onclick={() => (dialogOpen = true)}>Open dialog</Button>
  <Dialog
    open={dialogOpen}
    title="Rename dashboard"
    onClose={() => (dialogOpen = false)}
    onSubmit={() => (dialogOpen = false)}
  >
    <Field label="Name">
      {#snippet children({ controlId })}<Input id={controlId} />{/snippet}
    </Field>
    {#snippet footer()}
      <Button variant="ghost" onclick={() => (dialogOpen = false)}>Cancel</Button>
      <Button variant="primary" type="submit">Save</Button>
    {/snippet}
  </Dialog>
{:else if id === "confirm-dialog"}
  <Button variant="danger" onclick={() => (confirmOpen = true)}>Delete…</Button>
  <ConfirmDialog
    bind:open={confirmOpen}
    title="Delete dashboard?"
    confirmLabel="Delete"
    onConfirm={() => (confirmOpen = false)}
  >
    This removes 12 panels. It cannot be undone.
  </ConfirmDialog>
{:else if id === "menu"}
  <Menu
    label="Dashboard actions"
    trigger="Actions"
    items={[
      { label: "Duplicate", onSelect: noop },
      { label: "Export CSV", onSelect: noop },
      { label: "Delete", onSelect: noop, disabled: true },
    ]}
  />
{:else if id === "menu-radio"}
  <Menu
    label="Theme"
    trigger="Theme"
    size="small"
    align="end"
    items={[
      { label: "GitHub", selected: theme === "github", onSelect: () => (theme = "github") },
      { label: "Monokai", selected: theme === "monokai", onSelect: () => (theme = "monokai") },
    ]}
  />
{:else if id === "tooltip"}
  <Tooltip label="Copy to clipboard">
    {#snippet children({ describedBy })}<Button aria-describedby={describedBy}>Copy</Button>{/snippet}
  </Tooltip>
  <Tooltip label="Opens the docs" placement="bottom">
    {#snippet children({ describedBy })}
      <Button variant="ghost" aria-describedby={describedBy}>Help</Button>
    {/snippet}
  </Tooltip>
{:else if id === "toast"}
  <Button size="small" onclick={() => toaster.push("Synced 3 accounts.")}>Info</Button>
  <Button size="small" onclick={() => toaster.push("Saved.", { tone: "success" })}>Success</Button>
  <Button size="small" onclick={() => toaster.push("Import failed.", { tone: "danger" })}>Danger</Button>
  <ToastStack {toaster} />
{:else if id === "tabs"}
  <Tabs
    class="gallery__fill"
    label="Repository"
    items={[
      { label: "Overview", href: "#overview", current: true },
      { label: "Issues", href: "#issues", count: 12 },
      { label: "Settings", href: "#settings" },
    ]}
  />
{:else if id === "pagination"}
  <Pagination bind:page last={12} />
{:else if id === "toolbar"}
  <Toolbar label="Filters" card class="gallery__fill">
    <Chip label="Open" count={4} checked />
    <Chip label="Closed" count={9} />
    <Button variant="ghost" size="small">Clear</Button>
  </Toolbar>
{:else if id === "avatar"}
  <Avatar name="Ada Lovelace" size="sm" />
  <Avatar name="Ada Lovelace" />
  <Avatar name="Ada Lovelace" size="lg" />
  <Avatar name="linus" size="lg" />
{:else if id === "skeleton"}
  <div class="gallery__stack">
    <Skeleton width="40%" />
    <SkeletonText />
    <Skeleton variant="block" />
    <Skeleton variant="circle" />
  </div>
{:else if id === "disclosure"}
  <Disclosure class="gallery__fill" summary="Advanced options">Hidden until opened.</Disclosure>
  <Disclosure class="gallery__fill" summary="Details" open>Open from the start.</Disclosure>
{:else if id === "banner-dismiss"}
  {#if bannerShown}
    <Banner tone="warning" class="gallery__fill" onDismiss={() => (bannerShown = false)}>
      Sync is 3 hours behind.
    </Banner>
  {/if}
{/if}

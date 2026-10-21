import type { ReactNode } from "react"
import { ErrorMessage, Spinner } from "./Feedback.tsx"

/**
 * The loading → error → empty → data gate, once (UI.md rule 26). `empty` and `loading` render
 * as given; `children` gets the non-empty list.
 */
export function DataState<T>({
  data,
  isLoading,
  error,
  empty,
  loading = <Spinner />,
  children,
}: {
  data: readonly T[] | null | undefined
  isLoading: boolean
  error: unknown
  empty: ReactNode
  loading?: ReactNode
  children: (data: readonly T[]) => ReactNode
}) {
  if (isLoading) return <>{loading}</>
  if (error) return <ErrorMessage error={error} />
  if (!data || data.length === 0) return <>{empty}</>
  return <>{children(data)}</>
}

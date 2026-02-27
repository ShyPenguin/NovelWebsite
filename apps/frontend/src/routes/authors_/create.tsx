import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/authors_/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/authors_/create"!</div>
}

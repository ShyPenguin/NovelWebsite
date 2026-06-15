import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/announcements_/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/announcements_/create"!</div>
}

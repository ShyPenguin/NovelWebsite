import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/authors_/$authorId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/authors_/$authorId/"!</div>
}

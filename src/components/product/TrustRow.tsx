import { Package, Ruler, MessagesSquare, Truck } from 'lucide-react'
import type { ReactNode } from 'react'
import { productPage } from '@/config/product'

const icons: ReactNode[] = [
  <Package key="0" className="h-5 w-5" strokeWidth={1.5} />,
  <Ruler key="1" className="h-5 w-5" strokeWidth={1.5} />,
  <MessagesSquare key="2" className="h-5 w-5" strokeWidth={1.5} />,
  <Truck key="3" className="h-5 w-5" strokeWidth={1.5} />,
]

/** Reassurance row — free swatches / made-to-measure / free design help / delivery (km). */
export function TrustRow() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-line py-8 md:grid-cols-4">
      {productPage.trust.map((item, i) => (
        <div key={item.title} className="flex flex-col gap-2">
          <span className="text-ink">{icons[i]}</span>
          <span className="text-small font-medium text-ink">{item.title}</span>
          <span className="text-small leading-relaxed text-muted">{item.body}</span>
        </div>
      ))}
    </div>
  )
}

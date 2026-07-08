import { BrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'

export default function App() {
  return (
    <BrowserRouter>
      <RootLayout />
    </BrowserRouter>
  )
}

import { ReactNode } from "react"
import { Metadata } from "next"
import siteMetadata from "@/data/siteMetadata"

type Props = {
  children: ReactNode
}

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: siteMetadata.title,
  description: siteMetadata.description,
}

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return <>{children}</>
}

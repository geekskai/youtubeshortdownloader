import { setRequestLocale } from "next-intl/server"
import ShortsToWebmMain from "./ShortsToWebmMain"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function YouTubeShortsToWebmPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ShortsToWebmMain />
}

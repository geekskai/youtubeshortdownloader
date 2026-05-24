import { setRequestLocale } from "next-intl/server"
import ShortsToMp4Main from "./ShortsToMp4Main"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function YouTubeShortsToMp4Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ShortsToMp4Main />
}

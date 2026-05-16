import NextImage, { ImageProps } from "next/image"

const basePath = process.env.BASE_PATH || ""

function resolveSrc(src: ImageProps["src"]): ImageProps["src"] {
  if (typeof src !== "string") {
    return src
  }

  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("//") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return src
  }

  return src.startsWith("/") ? `${basePath}${src}` : src
}

function resolveSizes({ sizes, fill, width }: Pick<ImageProps, "sizes" | "fill" | "width">) {
  if (sizes) {
    return sizes
  }

  if (fill) {
    return "100vw"
  }

  if (typeof width === "number") {
    return `(max-width: 768px) 100vw, ${width}px`
  }

  return undefined
}

const Image = ({ src, sizes, fill, width, loading, decoding, priority, ...rest }: ImageProps) => (
  <NextImage
    src={resolveSrc(src)}
    sizes={resolveSizes({ sizes, fill, width })}
    fill={fill}
    width={width}
    loading={priority ? undefined : loading ?? "lazy"}
    decoding={decoding ?? "async"}
    priority={priority}
    {...rest}
  />
)

export default Image

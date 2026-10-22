type Props = {
  src: string;
  alt: string;
  caption: string;
  /** e.g. "Figure 1." Defaults to "Figure." */
  label?: string;
};

/** MDX figure: hairline-bracketed image with a bold label and a caption. */
export default function Figure({ src, alt, caption, label = "Figure." }: Props) {
  return (
    <figure className="figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
      <figcaption className="caption">
        <span className="caption-label">{label}</span> {caption}
      </figcaption>
    </figure>
  );
}

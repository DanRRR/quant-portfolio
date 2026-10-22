import SectionNav, { type Section } from "@/components/SectionNav";

type Props = {
  sections: Section[];
  download?: { href: string; label: string };
  children: React.ReactNode;
};

/** Rail + 700px column, centred as one unit. Used by every page except the connectome story. */
export default function PageShell({ sections, download, children }: Props) {
  return (
    <div className="shell layout">
      <aside className="rail">
        <SectionNav sections={sections} download={download} />
      </aside>
      <div className="col">{children}</div>
    </div>
  );
}

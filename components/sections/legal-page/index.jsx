import { Wrapper } from "@/components/ui/Wrapper";

export function LegalPage({ page }) {
  return (
    <main className="py-12">
      <Wrapper>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-cv-text mb-2">
            {page.title}
          </h1>

          <div
            className="
              text-sm text-cv-dim leading-relaxed
              [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-cv-text
              [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-cv-border
              [&_h3]:font-semibold [&_h3]:text-cv-text [&_h3]:mt-6 [&_h3]:mb-2
              [&_p]:mb-3
              [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5
              [&_ul]:list-disc [&_ul]:marker:text-cv-accent [&_ul]:mb-4
              [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-5
              [&_ol]:list-decimal [&_ol]:marker:text-cv-accent-ink [&_ol]:mb-4
              [&_strong]:text-cv-text [&_strong]:font-semibold
              [&_a]:text-cv-accent-ink [&_a]:underline [&_a]:underline-offset-2
              [&_a:hover]:opacity-80
              [&_hr]:border-cv-border [&_hr]:my-8
            "
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </Wrapper>
    </main>
  );
}

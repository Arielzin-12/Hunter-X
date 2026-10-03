<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Landing architecture
- All landing sections live in src/components/landing/*.tsx (Navbar, Hero, HowItWorks, Features, DashboardPreview, Differential, FinalCta, Footer + Reveal/Counter helpers), composed by src/routes/index.tsx. New sections go there, not into the route file — why: keeps the future app migration clean.
- Design tokens (dark graphite + lime) live only in src/styles.css; never hardcode color utilities in components — why: keeps the dark identity consistent and themable.

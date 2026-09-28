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

- Demo data persists in browser localStorage via `src/lib/store.tsx` (no Cloud backend yet) — spec allows local demo mode; swap store for Cloud later.
- Recovery eligibility/refund rules live only in `src/lib/recovery.ts` — explanations never decide policy.

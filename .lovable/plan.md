
# Demo Gaps - Build Plan

Transform the current app into "Demo Gaps", a real-time sports prediction and player market platform with auth, live ESPN data, and shareable predictions.

## 1. Authentication (Lovable Cloud)

- Add `/auth` page with email/password sign in + sign up tabs (no email confirmation for fast demo testing).
- Add Google sign-in button alongside email/password (Cloud default).
- Auth state via `onAuthStateChange` + `getSession` in a `useAuth` hook.
- Protected route wrapper redirects unauthenticated users from dashboard pages to `/auth`.
- Sign out button in the app header.

## 2. Database Schema (migration)

Tables (all RLS-enabled, with GRANTs):
- `profiles` — display_name, avatar_url; auto-created on signup via trigger.
- `predictions` — user_id, title, description, sport, team, player_name (nullable), prediction_type, target_value, status (open/resolved), share_slug (unique).
- `prediction_votes` — prediction_id, user_id, vote ('agree'|'disagree'), unique(prediction_id, user_id).
- `players` — name, team, sport, position, stats (jsonb), sentiment_score; seeded by edge function.

Policies: everyone (incl. anon) can read predictions/players/votes; authenticated users insert/update their own.

## 3. Routing (React Router)

All routes URL-persistent; tabs encoded as `?tab=` so reloads preserve state.

```
/                          Landing (public)
/auth                      Sign in / sign up
/dashboard                 Live games + trending (protected)
/market                    Prediction feed (public)
/market/new                Create prediction (protected)
/predictions/:slug         Public shareable prediction detail + vote
/players                   Player market board (public)
/players/:id               Player profile + linked predictions
/wallet                    Existing wallet (protected)
```

Replace current `pages/Index.tsx` screen-switcher with real routes in `App.tsx`. Existing screen components are reused where they fit (Betting, Wallet); Home becomes the new live dashboard.

## 4. Live Sports Data

- Edge function `sports-feed` returns ESPN-shaped JSON for: live scoreboard, trending players, player detail. Implementation: fetch ESPN's public scoreboard endpoints (`site.api.espn.com/apis/site/v2/sports/...`) — no key needed. Cache responses in memory per cold start.
- Frontend hooks (`useLiveGames`, `useTrendingPlayers`, `usePlayer`) call the function via `supabase.functions.invoke` and refresh every 30s with React Query.
- Dashboard renders live games, trending players, and a market-movement strip driven by recent predictions from the DB.

## 5. Prediction Market

- Create form: sport, optional player, prediction text, type (spread/total/prop), target value. On submit, generates a `share_slug` (nanoid) and inserts row.
- `/predictions/:slug` shows the prediction, author, agree/disagree counts, Copy Share Link button, vote buttons (auth required to vote).
- Market feed at `/market` lists newest predictions with vote tallies, filterable by sport.

## 6. Player Market

- `/players` board: grid of player cards with live stats and sentiment bar derived from votes on predictions tied to that player.
- `/players/:id` profile: live stats from edge function + list of predictions where `player_name` matches.

## 7. Design

Keep current dark sportsbook palette (tokens already in `index.css`). Add: top nav bar for desktop, retain bottom nav for mobile. Cards use existing gradient primary/accent treatment. No hardcoded colors.

## Technical Notes

- New files: `src/hooks/useAuth.tsx`, `src/components/ProtectedRoute.tsx`, `src/pages/Auth.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Market.tsx`, `src/pages/NewPrediction.tsx`, `src/pages/PredictionDetail.tsx`, `src/pages/Players.tsx`, `src/pages/PlayerDetail.tsx`, `src/components/AppHeader.tsx`, `src/hooks/useLiveSports.ts`.
- Edge function: `supabase/functions/sports-feed/index.ts` (public, `verify_jwt = false`).
- Existing `DemoContext`/`useDemoData` kept only for the legacy wallet/betting screens; new features read/write Supabase directly.
- Migration runs first (separate approval), then code changes that depend on the new schema.

## Out of Scope

- Real money / payments.
- Resolving predictions automatically from live scores (manual status update for now).
- Push notifications.

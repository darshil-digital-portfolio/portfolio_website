# Check Build

Run a full quality gate before pushing or deploying.

## Steps (run in order, stop and report on first failure)

1. **Type check**
   ```
   npx tsc --noEmit
   ```

2. **Lint**
   ```
   npm run lint
   ```

3. **Format check**
   ```
   npx prettier --check "src/**/*.{ts,tsx,css}"
   ```
   If format issues found, auto-fix them:
   ```
   npx prettier --write "src/**/*.{ts,tsx,css}"
   ```

4. **Build**
   ```
   npm run build
   ```

## Output

Report pass/fail for each step. If all pass, confirm the project is ready to push.
If any step fails, show the relevant error output and suggest a fix.

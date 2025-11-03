# Deployment Automation

This repository includes a small helper script to update the copy of the site that
lives on `lepus.astro.utoronto.ca` after you push changes.

## What was added

- `scripts/deploy.sh` connects over SSH to
  `nasser.mohammed@lepus.astro.utoronto.ca:/home/nasser.mohammed/web/nassmohammed.github.io`
  and runs `git pull --ff-only`. You can override the destination by exporting
  `REMOTE_HOST` and/or `REMOTE_DIR` before invoking the script.
- `scripts/post-push-hook.sh` contains the post-push hook logic so it can be
  reused after cloning in a new location.
- `.git/hooks/post-push` invokes the script automatically whenever you run
  `git push` from this working tree.

## Usage

1. Ensure your SSH key on this machine can log into `lepus.astro.utoronto.ca`
   without prompting for a password (add it to `~/.ssh/config` or the remote
   `~/.ssh/authorized_keys` as needed).
2. Push as usual with `git push`. After Git completes the push, the hook runs
   and triggers the pull on the remote server. The command output is shown in
   your terminal so you can confirm the update succeeded.
3. If you need to redeploy manually, run `./scripts/deploy.sh` or use
   `REMOTE_HOST=user@host REMOTE_DIR=/path ./scripts/deploy.sh <branch>` to
   target a different environment.

> The contents of `.git/hooks` are not tracked by Git. If you clone this
> repository elsewhere you will need to reinstall the hook. Run
> `cp scripts/post-push-hook.sh .git/hooks/post-push && chmod +x .git/hooks/post-push`
> in each new clone.

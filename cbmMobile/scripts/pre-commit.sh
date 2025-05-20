#!/usr/bin/env sh
if [[ -n $(git rev-parse -q --verify MERGE_HEAD) ]];
then
  echo '🛂 Skipping pre-commit hook for merge commit';
else
  if $(git rev-parse CHERRY_PICK_HEAD >/dev/null 2>/dev/null);
  then
    # don't use stash for cherry-picks which messes up the commit
    echo "using --no-stash for cherry-pick commit"
    lint-staged --no-stash;
  else
    lint-staged;
  fi
fi


# 1. Start a new feature
./git_newbranch.sh feature/4thprompt-nav

# 2. Make your changes, commit, push
git add .
git commit -m "Update nav to 4thPrompt"
git push

# 3. When ready, merge to main
./git_mergeback.sh feature/4thprompt-nav

# 4. (Optional) Delete the feature branch
git branch -d feature/4thprompt-nav
git push origin --delete feature/4thprompt-nav


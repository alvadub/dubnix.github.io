# defaults
from := develop
target := gh-pages
message := Release: $(shell date)

help: Makefile
	@awk -F':.*?##' '/[a-z]+:.*##/{printf "\033[36m%-13s\033[0m %s\n",$$1,$$2}' $<

dev: node_modules ## Lift dev environment for this service
	@npm run dev

push: ## Final assets for production
	@(git branch -D $(target) || true) > /dev/null 2>&1
	@git checkout --orphan $(target)
	@git merge $(from)
	@cp -r build/* .
	@git add . && git commit -m "$(message)"
	@git push origin $(target) -f
	@git checkout $(from)

clean: ## Remove all from node_modules/*
	@((rm -r build > /dev/null 2>&1) && echo "Built artifacts were deleted") || echo "Artifacts already deleted"
	@((unlink .tarima > /dev/null 2>&1) && echo "Cache file was deleted") || echo "Cache file already deleted"

# Ensure dependencies are installed before
node_modules: package-lock.json
	@npm i

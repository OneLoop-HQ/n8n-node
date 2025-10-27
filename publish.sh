#!/bin/bash

# Script to publish package to npm
# Usage: ./publish.sh [patch|minor|major] [--publish]
# Examples:
#   ./publish.sh patch          - Test build only (dry-run, default)
#   ./publish.sh minor --publish - Actually publish to npm and create branch

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Parse arguments
DRY_RUN=true  # Default to dry-run mode
VERSION_TYPE=""

for arg in "$@"; do
    case $arg in
        --publish)
            DRY_RUN=false
            ;;
        patch|minor|major)
            VERSION_TYPE=$arg
            ;;
        *)
            print_error "Unknown argument: $arg"
            echo "Usage: ./publish.sh [patch|minor|major] [--publish]"
            exit 1
            ;;
    esac
done

# Default to patch if not specified
VERSION_TYPE=${VERSION_TYPE:-patch}

if [[ "$DRY_RUN" == true ]]; then
    print_warning "DRY RUN MODE (default) - No git changes or npm publish will be performed"
    print_warning "Use --publish flag to actually publish to npm"
fi

# Check if git working tree is clean (skip in dry-run)
if [[ "$DRY_RUN" == false ]]; then
    if [[ -n $(git status -s) ]]; then
        print_error "Git working tree is not clean. Please commit or stash your changes first."
        git status -s
        exit 1
    fi
    print_info "Git working tree is clean"

    # Ensure we're on main branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [[ "$CURRENT_BRANCH" != "main" ]]; then
        print_error "Please switch to main branch first"
        exit 1
    fi

    # Pull latest changes
    print_info "Pulling latest changes from main..."
    git pull origin main
fi

# Run linting
print_info "Running linter..."
npm run lint

# Clean up dist directory
print_info "Cleaning up dist directory..."
rm -rf dist || true

# Build the project
print_info "Building project..."
npm run build

# Check if dist directory exists
if [[ ! -d "dist" ]]; then
    print_error "Build failed: dist directory not found"
    exit 1
fi
print_info "Build successful"

# Get version bump type (default to patch)
VERSION_TYPE=${1:-patch}

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    print_error "Invalid version type. Use: patch, minor, or major"
    exit 1
fi

# Show current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_info "Current version: $CURRENT_VERSION"

# Calculate what the new version would be
if [[ "$DRY_RUN" == true ]]; then
    # Calculate new version without modifying package.json
    IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
    MAJOR=${VERSION_PARTS[0]}
    MINOR=${VERSION_PARTS[1]}
    PATCH=${VERSION_PARTS[2]}

    case $VERSION_TYPE in
        major)
            NEW_VERSION="$((MAJOR + 1)).0.0"
            ;;
        minor)
            NEW_VERSION="$MAJOR.$((MINOR + 1)).0"
            ;;
        patch)
            NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
            ;;
    esac

    print_info "Would bump $VERSION_TYPE version: $CURRENT_VERSION → $NEW_VERSION"
else
    # Bump version
    print_info "Bumping $VERSION_TYPE version..."
    npm version $VERSION_TYPE --no-git-tag-version

    # Get new version
    NEW_VERSION=$(node -p "require('./package.json').version")
    print_info "New version: $NEW_VERSION"

    # Create release branch
    RELEASE_BRANCH="release/v$NEW_VERSION"
    print_info "Creating branch: $RELEASE_BRANCH"
    git checkout -b "$RELEASE_BRANCH"

    # Commit version bump
    git add package.json package-lock.json
    git commit -m "chore: bump version to $NEW_VERSION"

    # Publish to npm
    print_info "Publishing to npm..."
    npm publish --access public

    print_info "Successfully published v$NEW_VERSION to npm!"

    # Push branch and tags to git
    print_info "Pushing branch and tags to origin..."
    git push -u origin "$RELEASE_BRANCH"
    print_info "Pushed $RELEASE_BRANCH with tags"

    # Ask if user wants to create a PR
    print_warning "Create a pull request? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        # Check if gh CLI is available
        if command -v gh &> /dev/null; then
            gh pr create --title "Release v$NEW_VERSION" --body "Release version $NEW_VERSION" --base main --head "$RELEASE_BRANCH"
            print_info "Pull request created"
        else
            print_warning "GitHub CLI (gh) not found. Please create PR manually:"
            print_warning "https://github.com/OneLoop-HQ/n8n-node/compare/main...$RELEASE_BRANCH"
        fi
    else
        print_warning "Remember to create a PR to merge $RELEASE_BRANCH into main"
    fi

    # Switch back to main branch
    git checkout main

    print_info "✨ Publish complete!"
    print_info "Next steps:"
    print_info "  1. Review and merge the PR: $RELEASE_BRANCH -> main"
    print_info "  2. The package v$NEW_VERSION is now live on npm"
fi

if [[ "$DRY_RUN" == true ]]; then
    print_info "✨ Dry run complete!"
    print_info "Build successful. Ready to publish v$NEW_VERSION"
    echo ""
    print_info "To actually publish to npm, run:"
    print_info "  ./publish.sh $VERSION_TYPE --publish"
    print_info "  or: npm run publish:$VERSION_TYPE"
fi

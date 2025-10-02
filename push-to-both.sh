#!/bin/bash
# push-to-both.sh - Push changes to both repositories

echo "🚀 Pushing to both repositories..."

# Push to your personal fork
echo "📤 Pushing to KodeKenobi/ai-repository..."
git push origin master

# Push to original repository
echo "📤 Pushing to IggieSupa/ai-repository..."
git push upstream master

echo "✅ Successfully pushed to both repositories!"

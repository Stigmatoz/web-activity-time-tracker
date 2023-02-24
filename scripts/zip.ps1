$sourceFolder = ".\dist"
$targetFolder = ".\artifacts"
$version = $(node -pe "require('./src/manifest.json').version")
Compress-Archive -Path $sourceFolder -DestinationPath $targetFolder/web-activity-time-tracker-$version.zip
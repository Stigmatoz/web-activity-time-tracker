$sourceFolder = ".\dist\*"
$targetFolder = ".\artifacts"
If (!(test-path -PathType container $targetFolder)) {
    New-Item -ItemType Directory -Path $targetFolder
}
$version = $(node -pe "require('./src/manifest.json').version")
Compress-Archive -Path $sourceFolder -DestinationPath $targetFolder/time-spy-$version.zip
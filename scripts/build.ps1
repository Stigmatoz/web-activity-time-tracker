$sourceFolder = ".\src"
$targetFolder = ".\dist"
$targetFolderForClean = ".\dist\*"
$uglifyPath = ".\node_modules\uglify-js\bin\uglifyjs"

Remove-Item $targetFolderForClean -Recurse -Force
Copy-Item -Path $sourceFolder\* -Destination $targetFolder -Recurse

$folders = Get-ChildItem -path $targetFolder -Recurse -include *.js
Foreach ($fldr in $folders) {
    if ($fldr.Attributes -ne 'Directory') {
        node $uglifyPath --output $fldr.FullName $fldr.FullName
        Write-Host $fldr.FullName "has been minified."
    }
}

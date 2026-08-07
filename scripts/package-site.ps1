$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot 'dist'
$releasePath = Join-Path $projectRoot 'release'
$archivePath = Join-Path $releasePath 'ghibli-world-site.zip'

if (-not (Test-Path -LiteralPath $distPath)) {
  throw 'Build output was not found. Run npm run build first.'
}

New-Item -ItemType Directory -Path $releasePath -Force | Out-Null
if (Test-Path -LiteralPath $archivePath) {
  Remove-Item -LiteralPath $archivePath -Force
}

Compress-Archive -Path (Join-Path $distPath '*') -DestinationPath $archivePath -CompressionLevel Optimal
Write-Host "Website package created: $archivePath"

param([string]$Pptx = 'C:\Users\Adithya v\pawfinder\PawFinder-Overview.new.pptx',
      [string]$OutDir = 'C:\Users\Adithya v\pawfinder\render\qa',
      [string]$Prefix = 'qa')
$ErrorActionPreference = 'Stop'
if (Test-Path $OutDir) { Remove-Item -Path $OutDir -Recurse -Force }
New-Item -ItemType Directory -Path $OutDir | Out-Null
$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open($Pptx, $true, $false, $false)
# Whole-deck export via the proper engine (avoids per-slide GDI glyph corruption)
$pres.Export($OutDir, 'PNG', 1920, 1080)
$pres.Close()
$ppt.Quit()
# Normalise names: "Slide1.PNG" / "????1.PNG" -> qa-1.png
$i = 0
Get-ChildItem -Path $OutDir -Filter '*.PNG' | Sort-Object { [int]($_.BaseName -replace '\D','') } | ForEach-Object {
    $i++
    Move-Item $_.FullName (Join-Path $OutDir ("{0}-{1}.png" -f $Prefix, $i)) -Force
}
Get-ChildItem -Path $OutDir -Filter "$Prefix-*.png" | Measure-Object | ForEach-Object { Write-Output ("RENDERED {0} slides" -f $_.Count) }
Write-Output 'RENDER DONE'

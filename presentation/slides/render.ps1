# Render EdgeScope-Lite deck slides (HTML -> PNG) with headless Chrome.
#   powershell -File render.ps1            # render every slide
#   powershell -File render.ps1 08         # render only 08-*.html

param([string]$Only = "")

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$root   = Split-Path -Parent $MyInvocation.MyCommand.Path
$src    = Join-Path $root "src"
$out    = Join-Path $root "png"
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out | Out-Null }

$files = Get-ChildItem -Path $src -Filter *.html | Sort-Object Name
if ($Only -ne "") { $files = $files | Where-Object { $_.Name -like "$Only*" } }

foreach ($f in $files) {
    $png = Join-Path $out ($f.BaseName + ".png")
    if (Test-Path $png) { Remove-Item $png -Force }
    $uri = "file:///" + ($f.FullName -replace '\\', '/')
    & $chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars `
        --force-device-scale-factor=1.5 --window-size=1920,1080 `
        --virtual-time-budget=20000 --default-background-color=00000000 `
        --screenshot="$png" $uri | Out-Null
    if (Test-Path $png) {
        $kb = [math]::Round((Get-Item $png).Length / 1KB)
        Write-Output ("OK   {0}  ({1} KB)" -f $f.BaseName, $kb)
    } else {
        Write-Output ("FAIL {0}" -f $f.BaseName)
    }
}

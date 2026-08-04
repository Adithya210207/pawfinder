$ErrorActionPreference = 'Stop'
$path = 'C:\Users\Adithya v\pawfinder\PawFinder-Overview.pptx'

# MsoAnimEffect / trigger / transition constants
$FADE       = 10      # msoAnimEffectFade
$T_AFTER    = 3       # msoAnimTriggerAfterPrevious
$T_WITH     = 2       # msoAnimTriggerWithPrevious
$FADE_TRANS = 1537    # ppEffectFadeSmoothly
$msoTrue    = -1
$msoFalse   =  0

$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open($path, $false, $false, $false)

$sw = $pres.PageSetup.SlideWidth
$sh = $pres.PageSetup.SlideHeight

$summary = @()

foreach ($slide in $pres.Slides) {
    $idx = $slide.SlideIndex

    # ---- Slide transition: smooth fade, advance on click ----
    $tr = $slide.SlideShowTransition
    try { $tr.EntryEffect = $FADE_TRANS } catch { $tr.EntryEffect = 3849 }
    $tr.AdvanceOnClick = $msoTrue
    $tr.AdvanceOnTime  = $msoFalse
    try { $tr.Duration = 0.7 } catch {}

    # ---- Clear any existing main-sequence effects ----
    $seq = $slide.TimeLine.MainSequence
    while ($seq.Count -gt 0) { $seq.Item(1).Delete() }

    # ---- Classify shapes in z-order ----
    $animated = 0; $skipped = 0
    $pendingDecor = New-Object System.Collections.ArrayList
    $k = 0            # cascade beat counter
    $firstDone = $false

    foreach ($shp in $slide.Shapes) {
        $L = $shp.Left; $T = $shp.Top; $W = $shp.Width; $H = $shp.Height
        $txt = ''
        try { if ($shp.HasTextFrame -eq $msoTrue -and $shp.TextFrame.HasText -eq $msoTrue) { $txt = ($shp.TextFrame.TextRange.Text).Trim() } } catch {}

        $hasText = ($txt.Length -gt 0)

        # Footer / page-number: repeated bottom-band chrome -> never animate
        if ($hasText -and ($txt -eq 'PawFinder' -or $txt -match '^\d{1,3}$')) { $skipped++; continue }

        if (-not $hasText) {
            # Off-canvas bleeding decoration (ambient circles) -> static canvas
            $bleed = ($L -lt -2) -or ($T -lt -2) -or (($L + $W) -gt ($sw + 2)) -or (($T + $H) -gt ($sh + 2))
            $fullbg = ($W -ge $sw * 0.95) -and ($H -ge $sh * 0.95)
            if ($bleed -or $fullbg) { $skipped++; continue }
            # On-canvas decoration (card bg, accent bar, icon circle/img): ride with next text beat
            [void]$pendingDecor.Add($shp); continue
        }

        # Text beat
        if (-not $firstDone) {
            $eff = $seq.AddEffect($shp, $FADE, 0, $T_AFTER)
            $eff.Timing.Duration = 0.5
            $eff.Timing.TriggerDelayTime = 0.0
            $curDelay = 0.0
            $firstDone = $true
        } else {
            $k++
            $curDelay = [Math]::Min(0.18 * $k, 3.0)
            $eff = $seq.AddEffect($shp, $FADE, 0, $T_WITH)
            $eff.Timing.Duration = 0.5
            $eff.Timing.TriggerDelayTime = $curDelay
        }
        $animated++

        foreach ($d in $pendingDecor) {
            $de = $seq.AddEffect($d, $FADE, 0, $T_WITH)
            $de.Timing.Duration = 0.45
            $de.Timing.TriggerDelayTime = $curDelay
            $animated++
        }
        $pendingDecor.Clear()
    }

    # Trailing decoration with no following text beat -> ride with last beat (or open)
    if ($pendingDecor.Count -gt 0) {
        $first = (-not $firstDone)
        foreach ($d in $pendingDecor) {
            if ($first) {
                $de = $seq.AddEffect($d, $FADE, 0, $T_AFTER); $de.Timing.TriggerDelayTime = 0.0; $first = $false
            } else {
                $de = $seq.AddEffect($d, $FADE, 0, $T_WITH);  $de.Timing.TriggerDelayTime = [Math]::Min(0.18 * (++$k), 3.0)
            }
            $de.Timing.Duration = 0.45
            $animated++
        }
        $pendingDecor.Clear()
    }

    $summary += "slide $idx : animated=$animated skipped=$skipped effects=$($seq.Count)"
}

$pres.Save()
$pres.Close()
$ppt.Quit()
$summary | ForEach-Object { Write-Output $_ }
Write-Output 'DONE'

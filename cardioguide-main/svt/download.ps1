$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$origin = [Uri]'https://svt.cardioguide.ai/'
$queue = [Collections.Generic.Queue[string]]::new()
$queue.Enqueue('index.html')
$seen = [Collections.Generic.HashSet[string]]::new()
$records = @()
while ($queue.Count -gt 0) {
  $relative = $queue.Dequeue()
  if (!$seen.Add($relative)) { continue }
  $url = if ($relative -eq 'index.html') { $origin.AbsoluteUri } else { ([Uri]::new($origin, $relative)).AbsoluteUri }
  $destination = Join-Path $root $relative
  New-Item -ItemType Directory -Path (Split-Path $destination) -Force | Out-Null
  Invoke-WebRequest -Uri $url -OutFile $destination
  $records += [pscustomobject]@{path=$relative;url=$url;bytes=(Get-Item $destination).Length}
  if ($relative -match '\.(html|css|js|json)$') {
    $content = [IO.File]::ReadAllText($destination)
    $pattern = '(?:["''(])((?:\./|/)?(?:assets/)?[a-zA-Z0-9_./-]+\.(?:js|css|png|jpg|jpeg|svg|webp|gif|ico|json|woff2|mp3|pdf))(?:["'')?])'
    foreach ($match in [regex]::Matches($content, $pattern)) {
      $ref = $match.Groups[1].Value
      $resolved = [Uri]::new([Uri]$url, $ref)
      if ($resolved.Host -eq $origin.Host) { $queue.Enqueue($resolved.AbsolutePath.TrimStart('/')) }
    }
  }
}
$records | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $root 'download-manifest.json')
Write-Output "Downloaded $($records.Count) files."

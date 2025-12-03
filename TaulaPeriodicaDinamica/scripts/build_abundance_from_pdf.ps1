Param(
  [Parameter(Mandatory=$true)] [string]$PdfPath,
  [Parameter(Mandatory=$true)] [string]$OutJs
)

$ErrorActionPreference = 'Stop'

function Extract-Section($text, $startKeys, $stopKeys){
  $lines = $text -split "`r?`n"
  $start = 0; $end = $lines.Length-1
  for($i=0;$i -lt $lines.Length;$i++){
    foreach($k in $startKeys){ if($lines[$i] -match $k){ $start = $i; break } }
    if($start -ne 0){ break }
  }
  for($j=$start+1;$j -lt $lines.Length;$j++){
    foreach($k in $stopKeys){ if($lines[$j] -match $k){ $end = $j-1; break } }
    if($end -ne $lines.Length-1){ break }
  }
  if($end -lt $start){ $end = $lines.Length-1 }
  return ($lines[$start..$end] -join "`n")
}

function Parse-AbundMap($section){
  $map = @{}
  $lines = $section -split "`r?`n"
  foreach($ln in $lines){
    if($ln -notmatch '\(([^\)]+)\)'){ continue }
    $sym = $Matches[1].Trim()
    $nums = [regex]::Matches($ln,'\d+(?:[\.,]\d+)?\s*%')
    if($nums.Count -gt 0){
      $raw = $nums[$nums.Count-1].Value
      $val = ($raw -replace '%','' -replace ',','.')
      $d=[double]0; if([double]::TryParse($val,[ref]$d)){ $map[$sym] = $d }
    }
  }
  return $map
}

# Convert PDF to text via Word COM if available
$txt = Join-Path $env:TEMP ("ptab_"+[guid]::NewGuid()+'.txt')
try{
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $doc = $word.Documents.Open((Resolve-Path $PdfPath).Path, $false, $true)
  $wdFormatText = 2
  $doc.SaveAs($txt, $wdFormatText)
  $doc.Close()
  $word.Quit()
} catch {
  throw "No s'ha pogut convertir el PDF a text amb Word. Obre el PDF amb Word i desa'l com a .txt, després torna a executar l'script. Error: $($_.Exception.Message)"
}

$text = Get-Content -Raw -Path $txt

$humanSec = Extract-Section $text @('(?i)cos\s+h\w+','(?i)cos\s+huma') @('(?i)terra','(?i)univers','(?i)conductivitat','(?i)electroneg')
$earthSec = Extract-Section $text @('(?i)terra','(?i)escor\w+\s+terrest') @('(?i)univers','(?i)cos','(?i)conductivitat','(?i)electroneg')
$univSec  = Extract-Section $text @('(?i)univers') @('(?i)cos','(?i)terra','(?i)conductivitat','(?i)electroneg')

$human = Parse-AbundMap $humanSec
$earth = Parse-AbundMap $earthSec
$univ  = Parse-AbundMap $univSec

$js = 'window.PT_ABUND_CUSTOM = ' + (ConvertTo-Json -Depth 6 @{ human=$human; earth=$earth; universe=$univ }) + ';'
Set-Content -Encoding UTF8 -Path $OutJs -Value $js
Write-Host ("Wrote `"$OutJs`" with human=$($human.Count) earth=$($earth.Count) universe=$($univ.Count)")

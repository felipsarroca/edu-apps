Param(
  [Parameter(Mandatory=$true)] [string]$DocxPath,
  [Parameter(Mandatory=$true)] [string]$OutJs
)

$ErrorActionPreference = 'Stop'

function Get-Text([string]$s){
  return ([regex]::Matches($s,'<w:t[^>]*>(.*?)</w:t>') | ForEach-Object { $_.Groups[1].Value }) -join ' '
}

# Unzip DOCX
$tmp = Join-Path $env:TEMP ("ptdoc_"+[guid]::NewGuid()); New-Item -ItemType Directory -Path $tmp | Out-Null
$zip = Join-Path $env:TEMP ("ptdoc_"+[guid]::NewGuid()+'.zip')
Copy-Item -LiteralPath $DocxPath -Destination $zip
Expand-Archive -Path $zip -DestinationPath $tmp -Force
$xmlPath = Join-Path $tmp 'word/document.xml'
$xml = Get-Content -Raw -Path $xmlPath

$tbls = [regex]::Matches($xml,'<w:tbl[\s\S]*?</w:tbl>')
$paras = [regex]::Matches($xml,'<w:p[\s\S]*?</w:p>')

$EN=@{}; $IE=@{}; $CE=@{}; $CT=@{}; $DEN=@{}; $RAD=@{}; $MELT=@{}; $BOIL=@{}

for($i=0; $i -lt $tbls.Count; $i++){
  # Heading heuristic: previous paragraph
  $pos = $tbls[$i].Index
  $prev = ''
  for($j=$paras.Count-1; $j -ge 0; $j--){ if($paras[$j].Index -lt $pos){ $prev = Get-Text $paras[$j].Value; break } }

  $rows = [regex]::Matches($tbls[$i].Value,'<w:tr[\s\S]*?</w:tr>')
  for($r=1; $r -lt $rows.Count; $r++){
    $cells = [regex]::Matches($rows[$r].Value,'<w:tc[\s\S]*?</w:tc>')
    if($cells.Count -lt 3){ continue }
    $col2 = Get-Text $cells[1].Value
    $sym = if($col2 -match '\(([^\)]+)\)'){ $Matches[1] } else { ($col2 -split ' ')[-1] }
    if(-not $sym){ continue }
    # Last cell: join all runs and grab last number
    $runs = [regex]::Matches($cells[$cells.Count-1].Value,'<w:t[^>]*>(.*?)</w:t>') | ForEach-Object { $_.Groups[1].Value }
    if(-not $runs){ $runs = @(Get-Text $cells[$cells.Count-1].Value) }
    $joined = ($runs -join ' ') -replace ',', '.'
    $m = [regex]::Matches($joined,'[-+]?\d+(?:\.\d+)?')
    $valText = if($m.Count -gt 0){ $m[$m.Count-1].Value } else { '' }
    $d=[double]0; $ok=[double]::TryParse($valText,[ref]$d)

    if($prev -like '*Electronegativitat*'){
      if($joined -match 'no se sap|indef'){ $EN[$sym]=$null } elseif($ok){ $EN[$sym]=$d }
    }
    elseif($prev -like '*ionitz*' -or $prev -like '*Primera energia*'){
      if($ok){ $IE[$sym]=$d }
    }
    elseif($prev -like '*Conductivitat el*'){
      if($ok){ $CE[$sym]=$d }
    }
    elseif($prev -like '*Conductivitat t*'){
      if($ok){ $CT[$sym]=$d }
    }
    elseif($prev -like '*Radi at*' -or $prev -like '*Radi at\w+mic*'){
      if($ok){ $RAD[$sym]=$d }
    }
    elseif($prev -like '*Densitat*'){
      if($ok){ $DEN[$sym]=$d }
    }
    elseif($prev -like '*fusi*' -or $prev -like '*fusió*' -or $prev -like '*fusio*'){
      if($ok){ $MELT[$sym]=$d }
    }
    elseif($prev -like '*ebull*' -or $prev -like '*ebullic*'){
      if($ok){ $BOIL[$sym]=$d }
    }
  }
}

$custom = @{ electronegativity_pauling = $EN; ionization_kjmol = $IE; conductivity=@{ e=$CE; t=$CT }; density_gcm3=$DEN; atomic_radius_pm=$RAD; melt_K=$MELT; boil_K=$BOIL }
$js = 'window.PT_VALUES = ' + (ConvertTo-Json -Depth 8 $custom) + ';'
Set-Content -Encoding UTF8 -Path $OutJs -Value $js
Write-Host ("Wrote `"$OutJs`" with EN=$($EN.Count) IE=$($IE.Count) CE=$($CE.Count) CT=$($CT.Count) DEN=$($DEN.Count) RAD=$($RAD.Count)")

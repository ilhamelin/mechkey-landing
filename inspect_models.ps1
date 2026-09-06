$files = @("white_mesh.glb", "white_mesh_V2.glb", "white_mesh_V3.glb")
$modelsDir = "c:\Users\benja\.gemini\antigravity-ide\scratch\mechkey-landing\public\models"

foreach ($file in $files) {
    $fullPath = Join-Path $modelsDir $file
    if (-not (Test-Path $fullPath)) {
        Write-Output "File not found: $file"
        continue
    }
    
    $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $fullPath).Path)
    $fileSize = $bytes.Length
    
    # Read GLB Header
    $magic = [System.BitConverter]::ToUInt32($bytes, 0)
    $version = [System.BitConverter]::ToUInt32($bytes, 4)
    $totalLen = [System.BitConverter]::ToUInt32($bytes, 8)
    
    # Chunk 0 (JSON)
    $chunk0Len = [System.BitConverter]::ToUInt32($bytes, 12)
    $chunk0Type = [System.BitConverter]::ToUInt32($bytes, 16)
    
    $jsonBytes = New-Object byte[] $chunk0Len
    [System.Array]::Copy($bytes, 20, $jsonBytes, 0, $chunk0Len)
    $jsonText = [System.Text.Encoding]::UTF8.GetString($jsonBytes)
    $gltf = $jsonText | ConvertFrom-Json
    
    Write-Output "=================================================="
    Write-Output "FILE: $file"
    Write-Output "File Size: $fileSize bytes ($([math]::Round($fileSize/1KB, 1)) KB)"
    Write-Output "GLTF Version: $version"
    Write-Output "Generator: $($gltf.asset.generator)"
    Write-Output "Nodes count: $($gltf.nodes.Count)"
    Write-Output "Meshes count: $($gltf.meshes.Count)"
    Write-Output "Materials count: $($gltf.materials.Count)"
    Write-Output "Scenes count: $($gltf.scenes.Count)"
    Write-Output "Extensions: $($gltf.extensionsUsed -join ', ')"
    
    Write-Output "`n--- NODE NAMES (first 25) ---"
    $nodeNames = $gltf.nodes | ForEach-Object { $_.name }
    $nodeNames | Select-Object -First 25 | ForEach-Object { Write-Output "  - $_" }
    if ($nodeNames.Count -gt 25) {
        Write-Output "  ... and $($nodeNames.Count - 25) more nodes"
    }
    
    Write-Output "`n--- MESH NAMES ---"
    $meshNames = $gltf.meshes | ForEach-Object { $_.name }
    $meshNames | Select-Object -First 20 | ForEach-Object { Write-Output "  - $_" }
    
    Write-Output "`n--- MATERIAL NAMES ---"
    $gltf.materials | ForEach-Object { Write-Output "  - Name: $($_.name), DoubleSided: $($_.doubleSided), Roughness: $($_.pbrMetallicRoughness.roughnessFactor), Metalness: $($_.pbrMetallicRoughness.metalnessFactor)" }
    
    # Accessors info (primitives, vertices, polygons)
    $totalVertices = 0
    $totalIndices = 0
    $attribs = @()
    foreach ($m in $gltf.meshes) {
        foreach ($prim in $m.primitives) {
            $attribs += ($prim.attributes | Get-Member -MemberType NoteProperty | ForEach-Object { $_.Name })
            if ($prim.attributes.POSITION -ne $null) {
                $posAcc = $gltf.accessors[$prim.attributes.POSITION]
                $totalVertices += $posAcc.count
            }
            if ($prim.indices -ne $null) {
                $idxAcc = $gltf.accessors[$prim.indices]
                $totalIndices += $idxAcc.count
            }
        }
    }
    $totalTriangles = [math]::Round($totalIndices / 3)
    Write-Output "`nGeometry Stats:"
    Write-Output "  Attributes present: $(($attribs | Select-Object -Unique) -join ', ')"
    Write-Output "  Total Vertices: $totalVertices"
    Write-Output "  Total Triangles: $totalTriangles"
    Write-Output "==================================================`n"
}

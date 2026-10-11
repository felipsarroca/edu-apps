// Next 16 desa alguns fitxers de precàrrega com a «__next.ruta/__PAGE__.txt»,
// però el navegador els demana com a «__next.ruta.__PAGE__.txt». En fa una còpia amb aquest nom.
import { copyFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (!statSync(full).isDirectory()) continue
    if (name.startsWith('__next.')) {
      for (const file of readdirSync(full)) {
        if (file.endsWith('.txt')) copyFileSync(join(full, file), join(dir, `${name}.${file}`))
      }
    }
    walk(full)
  }
}

walk(process.argv[2] ?? 'out')

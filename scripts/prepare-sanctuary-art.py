"""Prepare generated assets without changing their proportions or illustration.
Keep source PNGs and record trimmed alpha bounds in an explicit runtime manifest.
"""
from pathlib import Path
from PIL import Image
import json

root = Path(__file__).resolve().parent.parent
folder = root / 'public/assets/sanctuaries/illustrated'
manifest = {}
for path in sorted((root / 'docs/sanctuaries/source-art').glob('*.png')):
    ident, kind = path.stem.rsplit('-', 1)
    with Image.open(path) as source:
        image = source.convert('RGBA' if kind == 'actor' else 'RGB')
        if kind == 'actor':
            bounds = image.getchannel('A').getbbox()
            if not bounds or image.getchannel('A').getextrema()[0] == 255:
                raise ValueError(f'{path}: sprite must contain real transparency')
            image = image.crop(bounds)
        image.thumbnail((1536, 1024))
        output = folder / (path.stem + '.webp')
        image.save(output, 'WEBP', quality=90, method=6)
        manifest.setdefault(ident, {})[kind] = {
            'src': str(output.relative_to(root / 'public')),
            'width': image.width, 'height': image.height,
        }
(root / 'src/data/sanctuaryArt.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Prepared {sum(len(v) for v in manifest.values())} assets for {len(manifest)} rooms')

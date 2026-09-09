# Ana Schmidt — Media Kit

Site estático, mobile first, sem dependências de build.

- `index.html` — estrutura e textos das seções
- `css/style.css` — estilos, animações e breakpoints
- `js/main.js` — bloco **CONFIG** no topo (contatos, mídias, números, marcas), lista de reels e galeria, interações
- `assets/` — imagens otimizadas e vídeo do hero

## Editar

1. **Contatos e números:** `js/main.js`, objeto `CONFIG` (WhatsApp, e-mail, seguidores etc.).
2. **Reels:** array `REELS` (shortcode do Instagram + capa em `assets/reels/<código>.jpg`).
3. **Galeria Fragmentos:** array `GALERIA` (arquivo em `assets/`, legenda, largura, altura).
4. **Hero e retrato:** `assets/hero.mp4`, `assets/hero.jpg`, `assets/retrato.jpg`.

## Atualizar mídias a partir de um novo export do Instagram

Coloque o JSON exportado como `ana-instagram.json` na raiz e rode:

```bash
node scripts/baixar-midias.mjs
```

Os arquivos vão para `material/`. Otimize os escolhidos (máx. 1400px, JPEG) antes de copiar para `assets/`.

## Rodar localmente

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

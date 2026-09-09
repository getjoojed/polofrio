// Baixa as mídias selecionadas do export do Instagram (ana-instagram.json) para a pasta material/.
// Uso (Node 18+):  node scripts/baixar-midias.mjs
// As URLs do CDN do Instagram expiram em poucos dias: rode logo após gerar o export.
import { readFile, mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const JSON_PATH = path.join(ROOT, 'ana-instagram.json');
const OUT = path.join(ROOT, 'material');

// Posts curados. children: índices das imagens do carrossel (omitido = até 3 primeiras imagens; 'all' = todas).
const FOTOS = [
  { code: 'DbW3DaInIpm', children: 'all' },   // fotos da Ana em ação (@leticiacardoso.ph)
  { code: 'DYDl4wQAUQ4' },                    // "Prazer, eu sou Ana Schmidt"
  { code: 'DanJHNhHMoo', children: 'all' },   // retrato / trajetória
  { code: 'DXZP1WdnJJN', children: 'all' },   // celular + powerbank, setup real
  { code: 'DZTJJemHKfr' },                    // bastidores semanas intensas
  { code: 'DV4QdcFkQsO' },                    // recorte de março
  { code: 'DY8f2J-HE-n' },                    // Conexão Social Media SP
  { code: 'DZANUvxHKUd' },                    // Conexão último dia
  { code: 'DAQuLc8u7K2', children: 'all' },   // projeto de interiores (Marcia Lima)
  { code: 'DAQwqMzuUz8', children: 'all' },   // detalhes do projeto
  { code: 'DBXZsLsNV0K', children: 'all' },   // CASACOR Floripa
  { code: 'DBWMzpIuElf' },                    // viagem CASACOR
  { code: 'DaL6W4gnBWg', children: 'all' },   // cobertura em tempo real
  { code: 'DHHfbtRuO6f' },                    // 1 ano Estúdio Black 108
  { code: 'DOFGq-6Dmk6', children: [0, 2, 4, 5, 7] }, // recap agosto
  { code: 'DUMXFv1DkAC', children: [0, 1, 5, 6, 8] }, // recap janeiro
  { code: 'DbEfj39HPop', children: [0, 1, 2, 3, 5, 6] }, // dia inteiro de experiências
  { code: 'DZ3T-LmnIGf', children: [1, 3, 4, 5] },       // semana intensa
  { code: 'DJnJuh4u49f', children: 'all' },   // série Fragmentos
  { code: 'DNOx2sfOCy2' },                    // vitrine
  { code: 'DXofa2tnIRc' },                    // (des)equilíbrio
  { code: 'DP2YGJ2DrYW' },                    // Trancoso
  { code: 'DJPZiYNO5MM', children: [0, 1, 3, 6, 7] }, // adrenalina storymaker
  { code: 'C_RjRQzNRwG' },                    // fotos de produto
  { code: 'Db-l_jyhq5b' },                    // "nem só de vídeos"
  { code: 'DanjoLtB2h4' },                    // vista Viva Park
  { code: 'DbYj5qhBEqy' },                    // cenário Haras
  { code: 'DELoihkuVwM' },                    // Concórdia
  { code: 'DMoXvbSuAsL' },                    // Pomerode / criatividade
];
// Reels cujo arquivo .mp4 também será baixado (candidatos a vídeo de fundo do hero).
const VIDEOS = ['DAPLIOPyJYv', 'DLOVCVEuz1O', 'DcKFLWAh-uO'];

const posts = JSON.parse(await readFile(JSON_PATH, 'utf8'));
const byCode = Object.fromEntries(posts.map(p => [p.shortCode, p]));
const jobs = [];
const add = (url, file) => url && jobs.push({ url, file });

// 1) capas de todos os reels
for (const p of posts.filter(p => p.type === 'Video')) add(p.displayUrl, path.join('reels', `${p.shortCode}.jpg`));
// 2) vídeos selecionados
for (const code of VIDEOS) add(byCode[code]?.videoUrl, path.join('reels', `${code}.mp4`));
// 3) fotos curadas
for (const { code, children } of FOTOS) {
  const p = byCode[code];
  if (!p) { console.warn('não encontrado:', code); continue; }
  if (p.type !== 'Sidecar') { add(p.displayUrl, path.join('fotos', `${code}.jpg`)); continue; }
  const imgs = (p.childPosts || []).map((c, i) => ({ c, i })).filter(x => x.c.type === 'Image');
  const pick = children === 'all' ? imgs : Array.isArray(children) ? imgs.filter(x => children.includes(x.i)) : imgs.slice(0, 3);
  for (const { c, i } of pick) add(c.displayUrl, path.join('fotos', `${code}-${String(i).padStart(2, '0')}.jpg`));
}

console.log(`${jobs.length} arquivos para baixar em ${OUT}`);
let ok = 0, skip = 0, fail = [];
async function download({ url, file }) {
  const dest = path.join(OUT, file);
  await mkdir(path.dirname(dest), { recursive: true });
  try { if ((await stat(dest)).size > 0) { skip++; return; } } catch {}
  for (let tent = 1; tent <= 3; tent++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      await writeFile(dest, Buffer.from(await r.arrayBuffer()));
      ok++; process.stdout.write(`\r${ok + skip + fail.length}/${jobs.length} ${file}          `); return;
    } catch (e) { if (tent === 3) fail.push(`${file}: ${e.message}`); }
  }
}
const queue = [...jobs];
await Promise.all(Array.from({ length: 4 }, async () => { while (queue.length) await download(queue.shift()); }));
console.log(`\n\nbaixados: ${ok} | já existiam: ${skip} | falhas: ${fail.length}`);
if (fail.length) console.log(fail.join('\n'));

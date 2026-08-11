# Hot Cuisine Quest Helper

Assistente de jornada para a **Hot Cuisine Quest** do Tibia.

Em vez de folhas soltas de checklist, o helper guia você passo a passo: preparação no depot, compras cidade a cidade, transporte e coleta final — com progresso salvo no navegador.

## O que ele faz

- **Resumo da quest** — itens, cidades, etapas e status de progresso
- **Multiplicador de receitas** — de 1 a 10, recalculando as quantidades
- **Preparação no Market** — checklist dos itens de depot, marcáveis
- **Rota de compras** — Venore ? Thais ? Svargrond ? Carlin ? Ab'Dendriel ? Edron ? Ankrahmun
- **NPCs em destaque** — sprite, local, itens e botão **Ver localização**
- **Minimapa** — coordenadas + link para [TibiaMaps](https://tibiamaps.io)
- **Viagens contextuais** — instrução de barco só quando a cidade termina
- **Coleta final** — Bat e Chicken com aviso dos 10 minutos
- **Tema escuro** — botão *Apagar a luz* / *Acender a luz*
- **Progresso persistente** — volta sem perder o que já marcou

## Como usar

1. Clone o repositório:

```bash
git clone https://github.com/rgcavalheiro/HotCuisineQuestHelper.git
cd HotCuisineQuestHelper
```

2. Abra o `index.html` no navegador (duplo clique ou Live Server).

3. Escolha quantas receitas quer fazer e clique em **Começar preparação**.

4. Marque os itens do market, avance para as compras e siga cidade a cidade até a coleta.

Não precisa de build, npm nem servidor — é HTML, CSS e JavaScript puro.

## Fluxo da jornada

```
Preparação (depot)
        ?
Rota de compras (por cidade / NPC)
        ?
Viagem (barco, quando houver)
        ?
Coleta final ? Quest concluída
```

### Etapas

| Passo | Onde | O que fazer |
|------:|------|-------------|
| 1 | Depot | Itens do Market |
| 2 | Venore | Rose, Rodney, Livielle |
| 3 | Thais | Donald e Sherry McRonald |
| 4 | Svargrond | Dankwart |
| 5 | Carlin | Imalas, Dane |
| 6 | Ab'Dendriel | Brasith |
| 7 | Edron | Bonifacius, Mirabell, Sandra, Luna |
| 8 | Ankrahmun | Jezzara |
| 9 | Edron | Bat + Chicken (frescos, ? 10 min) |

## Stack

- HTML
- CSS
- JavaScript (vanilla)
- Sprites via TibiaWiki
- Minimapa via TibiaMaps

## Estrutura

```
HotCuisineQuestHelper/
??? index.html    # Shell da interface
??? styles.css    # Tema claro/escuro e layout fluido
??? script.js     # Fluxo, progresso e mapa
??? data.js       # Itens, NPCs, etapas e helpers
??? README.md
```

## Contribuindo

1. Fork do repositório
2. Branch nova: `git checkout -b minha-melhoria`
3. Commit e push
4. Abra um Pull Request

## Licença

MIT — veja [LICENSE](LICENSE) se existir no repositório.

## Contato

**Rafael Cavalheiro** · [rafael.g.cavalheiro@gmail.com](mailto:rafael.g.cavalheiro@gmail.com)

Boa sorte na Hot Cuisine.

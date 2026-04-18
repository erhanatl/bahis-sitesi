export interface PostMeta {
  slug: string;
  title_tr: string;
  title_en: string;
  date: string;
  league_tr: string;
  league_en: string;
  home_team: string;
  away_team: string;
  tags: string[];
  over25: number;
  over35: number;
  btts: number;
  fhover15: number;
  fhbtts: number;
  corners: number;
  content_tr: string;
  content_en: string;
}

export const posts: PostMeta[] = [
  {
    slug: 'arsenal-chelsea-analiz-2026',
    title_tr: 'Arsenal - Chelsea Maç Analizi: 2.5 Üst ve KG Var Öne Çıkıyor',
    title_en: 'Arsenal vs Chelsea Match Analysis: Over 2.5 and BTTS Stand Out',
    date: '2026-04-20',
    league_tr: 'İngiltere Premier Lig',
    league_en: 'England Premier League',
    home_team: 'Arsenal',
    away_team: 'Chelsea',
    tags: ['premier-league', 'arsenal', 'chelsea'],
    over25: 72,
    over35: 48,
    btts: 68,
    fhover15: 41,
    fhbtts: 29,
    corners: 63,
    content_tr: `Arsenal ile Chelsea arasındaki bu kritik Premier Lig karşılaşması, her iki takımın da sezonun son bölümünde puan arayışında olduğu bir dönemde gerçekleşiyor. İstatistiksel veriler ve form analizi açısından değerlendirildiğinde bu maç, yüksek gol potansiyeli taşıyan bir karşılaşmaya işaret ediyor.

## 2.5 Üst — %72

Arsenal'in sezon genelinde ev maçlarında maç başına ortalama **2.8 gol** ürettiği görülüyor. Chelsea ise deplasmanda geçen 10 maçın 7'sinde 2 veya daha fazla gol olan karşılaşmalarda yer aldı. İki takımın son 5 karşılaşmasında da ortalama **3.1 gol** atıldı. Bu veriler, maçın 2.5 üst seçeneği için güçlü bir zemin oluşturuyor.

## Karşılıklı Gol — %68

Her iki takım da savunma hattında sezon boyunca ciddi açıklar verdi. Arsenal'in forvet hattı bu sezon 68 gol kaydederken Chelsea'nin savunması deplasmanda maç başına ortalama 1.4 gol yedi. Londra derbilerinde genellikle her iki takım da gol buluyor.

## Form Analizi

**Arsenal (Son 5 Maç):** G G G B M — Evde 4 maçın 3'ünü kazandı, ortalamanın üzerinde gol üretiyor.

**Chelsea (Son 5 Maç):** B G M G G — Deplasmanda tutarsız performans; ancak son iki deplasman maçında gol buldu.

## H2H (Son Karşılaşmalar)

Son 5 Premier Lig karşılaşmasında:
- 3 maçta her iki takım da gol attı
- 4 maçta toplam 3 veya daha fazla gol atıldı
- Ortalama gol: **3.2 gol/maç**

## Sonuç

İstatistiksel olasılık hesaplamaları ve form verileri, bu maçın gol açısından zengin geçeceğine işaret ediyor. **2.5 Üst (%72)** ve **Karşılıklı Gol Var (%68)** seçenekleri öne çıkan istatistiksel göstergeler olarak dikkat çekiyor.`,
    content_en: `This critical Premier League clash between Arsenal and Chelsea comes at a time when both teams are searching for points in the final stretch of the season. From a statistical and form analysis perspective, this match points to a high-scoring encounter.

## Over 2.5 Goals — 72%

Arsenal has averaged **2.8 goals per home game** throughout the season. Chelsea, meanwhile, has been involved in matches with 2 or more goals in 7 of their last 10 away games. The last 5 head-to-head encounters between these two sides have averaged **3.1 goals per game** — providing strong grounds for the over 2.5 option.

## Both Teams to Score — 68%

Both teams have shown defensive vulnerabilities throughout the season. Arsenal's attack has scored 68 goals this season, while Chelsea's defense has conceded an average of 1.4 goals per away game. In London derbies, both teams have historically found the net regularly.

## Form Analysis

**Arsenal (Last 5 Matches):** W W W D L — Won 3 of 4 home matches, producing above-average goal output.

**Chelsea (Last 5 Matches):** D W L W W — Inconsistent away form, but scored in their last two away matches.

## H2H (Recent Encounters)

In the last 5 Premier League meetings:
- Both teams scored in 3 matches
- 4 matches had 3 or more total goals
- Average goals: **3.2 per match**

## Summary

Statistical probability calculations and form data suggest this match will be rich in goals. **Over 2.5 Goals (72%)** and **Both Teams to Score (68%)** stand out as the key statistical indicators.`,
  },
];

export function getAllPosts(): PostMeta[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): PostMeta | null {
  return posts.find(p => p.slug === slug) || null;
}

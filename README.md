# Play Radio — modernus svetainės prototipas

React + Vite pagrindu sukurtas naujas Play Radio svetainės dizainas. Sąsaja lietuvių kalba, prisitaiko prie mobiliųjų ekranų.

## Paleidimas

1. Įsidiekite Node.js (18+).
2. Išskleiskite projektą ir atsidarykite jo aplanką terminale.
3. Paleiskite:

```bash
npm install
npm run dev
```

4. Atidarykite terminale nurodytą vietinį adresą.

## Tiesioginio radijo prijungimas

Sukurkite `.env` failą projekto šaknyje:

```env
VITE_RADIO_STREAM_URL=https://jusu-tiesiogines-transliacijos-adresas
```

Tada perkraukite `npm run dev`. Šiame prototipe transliacijos URL sąmoningai neįrašytas, nes reikia patvirtinti oficialų Play Radio garso srauto adresą.

## Prieš paleidžiant į viešumą

- Pakeisti demonstracines naujienas ir TOP 40 tikrais turinio duomenimis.
- Prijungti oficialų transliacijos srautą.
- Prijungti turinio valdymo sistemą / administravimo aplinką.
- Patikrinti prekės ženklo, nuotraukų, muzikos ir kitų medijos failų naudojimo teises.

Tai yra veikiantis frontend prototipas, o ne dar pilnai prijungta WordPress tipo administravimo sistema.

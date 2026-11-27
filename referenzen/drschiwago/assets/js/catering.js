/* DR. SCHIWAGO · Catering: Buffet-Baukasten (Gerichte 1:1 von drschiwago.de/catering) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const IMG = window.IMG || {};
  const C = [
    { id: 'v', t: 'Vorspeisen', max: 4, img: ['gang-vorspeisen'], d: [
      ['Festliche Fleischplattenvariation', 'mit ausgewählten Fleischspezialitäten'],
      ['Edle Fischvariation', 'mit Räucherlachs, Matjes & ausgewählten Fischspezialitäten'],
      ['Vitello Tonnato', ''],
      ['Pastrami', 'mit Pfeffernote'],
      ['Hausgemachte Crêpes', 'mit herzhafter Fleischfüllung'],
      ['Canapés', 'mit rotem Kaviar & Kräutern'],
      ['Crêpe-Röllchen', 'mit Räucherlachs & Kräutercreme'],
      ['Bratkartoffeltaler', 'mit Matjesfilet & feinen Zwiebelringen'],
      ['Auberginenröllchen', 'mit würziger Tomaten-Kräutercreme'],
      ['Zucchiniröllchen', 'mit Frischkäse, Gouda & frischen Kräutern'],
      ['Ofenfrische Piroschki', 'mit würziger Fleischfüllung'],
      ['Ofenfrische Piroschki', 'mit Kartoffel-Pilz-Füllung'],
      ['Ofenfrische Piroschki', 'mit Weißkohlfüllung'],
      ['Ofenfrische Piroschki', 'mit Ei & Frühlingszwiebeln'],
      ['Zarte Hähnchensülze', 'mit Meerrettich & Senf'],
      ['Osteuropäische Antipasti-Auswahl', 'mit mariniertem Gemüse'],
      ['Gebratener und panierter Fisch', ''],
    ] },
    { id: 's', t: 'Salate', max: 4, img: ['gang-salate'], d: [
      ['Olivier', 'traditioneller russischer Festtagssalat'],
      ['Hering im Pelzmantel', 'klassischer Schichtsalat mit Matjes, Kartoffeln & Roter Bete'],
      ['Granatapfelring', 'mit Hähnchen, Roter Bete, Kartoffeln, Möhren, Käse, Walnüssen & Granatapfel'],
      ['Vinaigrette', 'mit Roter Bete, Kartoffeln, Möhren & Gewürzgurken'],
      ['Caesar Salad', 'mit saftiger Hähnchenbrust, Parmesan & Croûtons'],
      ['Rucola-Salat', 'mit gebratenen Garnelen, Cherrytomaten & Honig-Senf-Dressing'],
      ['Griechischer Bauernsalat', 'mit Feta & Oliven'],
      ['Frischer Tomaten-Gurken-Salat', 'mit Kräutern & feinem Dressing'],
      ['Mediterraner Nudelsalat', 'mit Rucola, getrockneten Tomaten, Parmesan & Basilikumpesto'],
      ['Krabbenstäbchen-Salat', 'mit Ei, Gurke & cremigem Kräuterdressing'],
      ['Hähnchen-Trauben-Salat', 'mit zarter Hähnchenbrust, Gouda, Gemüse & cremigem Dressing'],
      ['Mediterraner Kartoffelsalat', 'mit Gewürzgurken & knackigen Zwiebeln in cremigem Joghurt-Senf-Dressing'],
      ['Mimosa-Salat', 'festlicher Schichtsalat mit Ei, Käse & feiner cremiger Note'],
      ['Glasnudelsalat', 'mit Hähnchen und Gemüse'],
    ] },
    { id: 'h', t: 'Hauptspeisen', max: 4, img: ['gang-haupt'], d: [
      ['Schweineschaschlik', 'vom echten Holzkohlengrill nach kaukasischer Art'],
      ['Hähnchenschaschlik', 'vom echten Holzkohlengrill nach kaukasischer Art'],
      ['Lule Kebab vom Lamm', 'vom echten Holzkohlengrill nach kaukasischer Art'],
      ['Gegrillte Forelle', 'mit allerlei Kräutern'],
      ['Traditioneller Plov', 'mit zartem Fleisch, Möhren & aromatisch gewürztem Reis'],
      ['Putengeschnetzeltes', 'in Champignon-Rahmsauce'],
      ['Boeuf Stroganoff', 'mit zarten Rindfleischstreifen in cremiger Sauce'],
      ['Gefüllte Rouladen', 'Golubzi'],
      ['Hähnchenbrust', 'in cremiger Champignon-Rahmsauce'],
      ['Hähnchenbrust', 'in fruchtig-pikanter Orangen-Chili-Sauce'],
      ['Zanderfilet', 'mit feiner Senf-Dill-Kräuterkruste'],
      ['Lachsfilet', 'in cremiger Zitronen-Dill-Sauce'],
    ] },
    { id: 'b', t: 'Beilagen', max: 4, img: ['gang-beilagen'], d: [
      ['Kartoffelgratin', 'mit feiner Trüffelnote'],
      ['Cremiges Kartoffelpüree', 'mit Butter & Muskat'],
      ['Rosmarinkartoffeln', 'mit Knoblauch & Meersalz'],
      ['Duftender Basmatireis', 'mit Gemüse'],
      ['Mediterranes Grillgemüse', 'mit Rosmarin & Thymian'],
      ['Ratatouille', 'von Zucchini, Aubergine, Paprika & Tomate'],
      ['Pasta', 'mit frischem Gemüse & Kräutern'],
      ['Aromatischer Buchweizen', 'mit Butter und frischen Kräutern'],
      ['Spätzle', ''],
      ['Süßkartoffel-Pommes', ''],
      ['Knackige Pommes Frites', ''],
    ] },
    { id: 'd', t: 'Desserts', max: 3, img: ['gang-dessert'], d: [
      ['Napoleon-Torte', 'mit feinen Blätterteigschichten & cremiger Füllung'],
      ['Medovik', 'traditioneller Honigkuchen mit luftiger Creme'],
      ['Tiramisu', 'mit feiner Mascarponecreme'],
      ['Panna Cotta', 'mit fruchtigem Beerenspiegel'],
      ['Mousse au Chocolat', 'mit frischen Beeren'],
      ['Schokoladenbrownies', ''],
      ['Früchtevariation der Saison', ''],
    ] },
  ];
  const KEY = 'drs-buffet-v1';

  /* Russische Fassung (gleiche Reihenfolge wie oben) */
  const RU = document.documentElement.lang === 'ru';
  const BASE = document.documentElement.dataset.base || '';
  const C_RU = [
    ['Закуски', [['Праздничное мясное ассорти', 'с отборными мясными деликатесами'], ['Изысканное рыбное ассорти', 'с копчёным лососем, сельдью и рыбными деликатесами'], ['Вителло тоннато', ''], ['Пастрами', 'с перцем'], ['Домашние блинчики', 'с мясной начинкой'], ['Канапе', 'с красной икрой и зеленью'], ['Блинные рулетики', 'с копчёным лососем и сливочным сыром с зеленью'], ['Картофельные дольки', 'с филе сельди и тонкими кольцами лука'], ['Рулетики из баклажанов', 'с пряным томатно-травяным кремом'], ['Рулетики из цукини', 'со сливочным сыром, гаудой и свежей зеленью'], ['Пирожки из печи', 'с мясной начинкой'], ['Пирожки из печи', 'с картофелем и грибами'], ['Пирожки из печи', 'с капустой'], ['Пирожки из печи', 'с яйцом и зелёным луком'], ['Нежный куриный холодец', 'с хреном и горчицей'], ['Восточноевропейское антипасти', 'с маринованными овощами'], ['Жареная рыба в панировке', '']]],
    ['Салаты', [['Оливье', 'традиционный праздничный салат'], ['Селёдка под шубой', 'классический слоёный салат с сельдью, картофелем и свёклой'], ['Гранатовый браслет', 'с курицей, свёклой, картофелем, морковью, сыром, грецкими орехами и гранатом'], ['Винегрет', 'со свёклой, картофелем, морковью и солёными огурцами'], ['Цезарь', 'с сочной куриной грудкой, пармезаном и гренками'], ['Руккола', 'с жареными креветками, черри и медово-горчичной заправкой'], ['Греческий салат', 'с фетой и оливками'], ['Салат из томатов и огурцов', 'с зеленью и лёгкой заправкой'], ['Средиземноморский салат с пастой', 'с рукколой, вялеными томатами, пармезаном и песто'], ['Крабовый салат', 'с яйцом, огурцом и сливочной заправкой с зеленью'], ['Салат с курицей и виноградом', 'с нежной куриной грудкой, гаудой, овощами и сливочной заправкой'], ['Средиземноморский картофельный салат', 'с солёными огурцами и хрустящим луком в йогуртово-горчичной заправке'], ['Мимоза', 'праздничный слоёный салат с яйцом, сыром и нежной сливочной ноткой'], ['Салат с фунчозой', 'с курицей и овощами']]],
    ['Горячие блюда', [['Шашлык из свинины', 'с настоящего угольного гриля по-кавказски'], ['Шашлык из курицы', 'с настоящего угольного гриля по-кавказски'], ['Люля-кебаб из баранины', 'с настоящего угольного гриля по-кавказски'], ['Форель на гриле', 'с ароматными травами'], ['Традиционный плов', 'с нежным мясом, морковью и ароматным рисом'], ['Индейка по-строгановски', 'в сливочно-грибном соусе'], ['Бефстроганов', 'с нежными полосками говядины в сливочном соусе'], ['Голубцы', 'фаршированные капустные рулеты'], ['Куриная грудка', 'в сливочно-грибном соусе'], ['Куриная грудка', 'в фруктово-остром апельсиново-чили соусе'], ['Филе судака', 'под горчично-укропной корочкой'], ['Филе лосося', 'в сливочном лимонно-укропном соусе']]],
    ['Гарниры', [['Картофельный гратен', 'с ноткой трюфеля'], ['Нежное картофельное пюре', 'со сливочным маслом и мускатом'], ['Картофель с розмарином', 'с чесноком и морской солью'], ['Ароматный рис басмати', 'с овощами'], ['Овощи гриль', 'с розмарином и тимьяном'], ['Рататуй', 'из цукини, баклажана, перца и томатов'], ['Паста', 'со свежими овощами и зеленью'], ['Ароматная гречка', 'со сливочным маслом и свежей зеленью'], ['Шпецле', ''], ['Картофель фри из батата', ''], ['Хрустящий картофель фри', '']]],
    ['Десерты', [['Торт «Наполеон»', 'с тонкими слоями теста и нежным кремом'], ['Медовик', 'традиционный медовый торт с воздушным кремом'], ['Тирамису', 'с нежным кремом маскарпоне'], ['Панна-котта', 'с ягодным соусом'], ['Шоколадный мусс', 'со свежими ягодами'], ['Шоколадные брауни', ''], ['Сезонное фруктовое ассорти', '']]],
  ];
  if (RU) C.forEach((c, i) => { c.t = C_RU[i][0]; c.d = C_RU[i][1]; });
  const T = RU
    ? { of: n => `из ${n} выбрано`, full: n => `Максимум ${n} блюд. Чтобы заменить, снимите отметку с одного.`, empty: 'Пока ничего не выбрано. Отметьте любимые блюда выше.', open: 'пока не определено', none: '(пока ничего не выбрано)' }
    : { of: n => `von ${n} gewählt`, full: n => `Maximal ${n} Gerichte. Zum Tauschen eines abwählen.`, empty: 'Noch nichts gewählt. Tippen Sie oben Ihre Favoriten an.', open: 'noch offen', none: '(noch keine gewählt)' };
  let sel = {};
  try { sel = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { sel = {}; }
  C.forEach(c => { sel[c.id] = (sel[c.id] || []).filter(i => i < c.d.length).slice(0, c.max); });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(sel)); } catch (e) { /* privat */ } };

  /* Gänge bauen */
  const wrap = $('#courses');
  C.forEach((c, ci) => {
    const key = c.img.find(k => IMG[k]), m = key && IMG[key];
    const sec = document.createElement('article');
    sec.className = 'course' + (m ? '' : ' course--noimg'); sec.id = 'gang-' + c.id;
    sec.innerHTML = `
      <div class="course__side">
        ${m ? `<div class="course__img"><img src="${BASE + m.s}" srcset="${BASE + m.s} ${m.sw}w, ${BASE + m.l} ${m.lw}w" sizes="(max-width: 720px) 100vw, 45vw" alt="${c.t}" loading="lazy" decoding="async">
          <span class="course__no gold">0${ci + 1}</span></div>` : `<span class="course__no course__no--solo gold">0${ci + 1}</span>`}
      </div>
      <div class="course__main">
        <header class="course__head">
          <h3 class="gold">${c.t}</h3>
          <p class="course__count"><b data-n>0</b> ${T.of(c.max)} <span class="course__dots">${'<i></i>'.repeat(c.max)}</span></p>
        </header>
        <ul class="dishes">${c.d.map((d, i) => `
          <li><button class="dish" type="button" data-c="${c.id}" data-i="${i}" aria-pressed="false">
            <span class="dish__chk" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
            <span class="dish__txt"><b>${d[0]}</b>${d[1] ? `<em>${d[1]}</em>` : ''}</span>
          </button></li>`).join('')}
        </ul>
        <p class="course__full">${T.full(c.max)}</p>
      </div>`;
    wrap.append(sec);
  });

  const trayN = $('[data-tray-n]'), trayBars = $$('.tray__bars i'), list = $('#ask-list');
  const render = () => {
    let n = 0;
    C.forEach((c, ci) => {
      const s = sel[c.id], sec = $('#gang-' + c.id), full = s.length >= c.max;
      n += s.length;
      $('[data-n]', sec).textContent = s.length;
      $$('.course__dots i', sec).forEach((d, i) => d.classList.toggle('is-on', i < s.length));
      sec.classList.toggle('is-full', full);
      $$('.dish', sec).forEach(b => {
        const on = s.includes(+b.dataset.i);
        b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on);
        b.disabled = full && !on;
      });
      trayBars[ci].style.setProperty('--f', s.length / c.max);
    });
    trayN.textContent = n;
    document.body.classList.toggle('has-picks', n > 0);
    list.innerHTML = n ? C.filter(c => sel[c.id].length).map(c => `
      <div class="ask__grp"><h4>${c.t} <span>${sel[c.id].length}/${c.max}</span></h4><ul>${sel[c.id].map(i => `<li>${c.d[i][0]}${c.d[i][1] ? ` <em>${c.d[i][1]}</em>` : ''}</li>`).join('')}</ul></div>`).join('')
      : `<p class="ask__empty">${T.empty}</p>`;
  };
  wrap.addEventListener('click', e => {
    const b = e.target.closest('.dish'); if (!b) return;
    const c = C.find(x => x.id === b.dataset.c), i = +b.dataset.i, s = sel[c.id];
    const k = s.indexOf(i);
    if (k >= 0) s.splice(k, 1); else if (s.length < c.max) { s.push(i); b.classList.add('is-pop'); setTimeout(() => b.classList.remove('is-pop'), 500); }
    save(); render();
  });
  render();

  /* Anfrage per E-Mail */
  $('#ask-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const anlass = f.get('anlass'), datum = f.get('datum'), gaeste = f.get('gaeste');
    const dStr = datum ? new Date(datum + 'T12:00').toLocaleDateString(RU ? 'ru-RU' : 'de-DE') : T.open;
    const lines = C.map(c => sel[c.id].length ? `${c.t}:\n` + sel[c.id].map(i => `- ${c.d[i][0]}${c.d[i][1] ? ' ' + c.d[i][1] : ''}`).join('\n') : '').filter(Boolean).join('\n\n');
    const subj = RU ? `Запрос на кейтеринг: ${anlass}, ${dStr}${gaeste ? ', гостей: ' + gaeste : ''}` : `Catering-Anfrage: ${anlass}, ${dStr}${gaeste ? ', ' + gaeste + ' Gäste' : ''}`;
    const body = RU
      ? `Здравствуйте, команда Dr. Schiwago!\n\nМеня интересует праздничный фуршет.\n\nПовод: ${anlass}\nДата: ${dStr}\nГостей: ${gaeste || T.open}\n\nМой выбор:\n${lines || T.none}\n\nИмя: \nТелефон: \n\nСпасибо!`
      : `Hallo Dr. Schiwago Team,\n\nich interessiere mich für das Festliche Buffet.\n\nAnlass: ${anlass}\nDatum: ${dStr}\nGäste: ${gaeste || T.open}\n\nMeine Favoriten:\n${lines || T.none}\n\nName: \nTelefon: \n\nVielen Dank!`;
    location.href = `mailto:info@drschiwago.de?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  });

  /* Leiste unten: erst nach dem Hero, nicht über der Anfrage */
  const tray = $('#tray'), ask = $('#anfrage'), build = $('#baukasten');
  const upd = () => {
    const a = ask.getBoundingClientRect(), b = build.getBoundingClientRect();
    tray.classList.toggle('is-on', b.top < innerHeight * .6 && a.top > innerHeight * .5);
  };
  addEventListener('scroll', upd, { passive: true }); upd();
})();

/* ============================================================================
 * data.js — the complete Survival Finnish course (booklet 900017Y, A1.1).
 *
 * Content transcribed from the University of Oulu "Survival Finnish" booklet
 * © Koskela, Starck, Pohjola-Effe, Isohätälä, Käräjäoja, Sarajärvi,
 *   Haapakoski, Niskanen.
 *
 * Depends on: utils.js (esc), audio.js (spk, ttsOK).
 * ==========================================================================*/

/* ---- HTML builders for the "Learn" sections ---------------------------- */
function dlg(title, lines) {
  var h = '<div class="terminal-card"><div class="traffic"><i></i><i></i><i></i>' +
          '<span class="t-title">' + esc(title) + '</span></div>';
  for (var i = 0; i < lines.length; i++) {
    var L = lines[i];
    var who = L[0] ? '<span class="who">' + esc(L[0]) + ':</span>' : '<span class="who">–</span>';
    h += '<div class="dlg-line">' + spk(L[1]) + who +
         '<span class="fi">' + esc(L[1]) +
         (L[2] ? '<span class="gloss">' + esc(L[2]) + '</span>' : '') +
         '</span></div>';
  }
  return h + '</div>';
}
function vgrid(pairs) {
  var h = '<div class="vgrid">';
  for (var i = 0; i < pairs.length; i++) {
    var p = pairs[i];
    h += '<div class="vrow"><b>' + spk(p[0]) + ' ' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span></div>';
  }
  return h + '</div>';
}
function tbl(head, rows) {
  var h = '<table class="tbl">';
  if (head) h += '<tr>' + head.map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') + '</tr>';
  for (var r = 0; r < rows.length; r++) {
    h += '<tr>' + rows[r].map(function (x, i) {
      return '<td class="' + (i === 0 ? 'fi' : 'en') + '">' + x + '</td>';
    }).join('') + '</tr>';
  }
  return h + '</table>';
}

/* ---- alphabet ---------------------------------------------------------- */
var ALPHA = [['A', 'aa'], ['B', 'bee'], ['C', 'see'], ['D', 'dee'], ['E', 'ee'], ['F', 'äf'],
['G', 'gee'], ['H', 'hoo'], ['I', 'ii'], ['J', 'jii'], ['K', 'koo'], ['L', 'äl'], ['M', 'äm'],
['N', 'än'], ['O', 'oo'], ['P', 'pee'], ['Q', 'kuu'], ['R', 'är'], ['S', 'äs'], ['T', 'tee'],
['U', 'uu'], ['V', 'vee'], ['W', 'kaksois-vee'], ['X', 'äks'], ['Y', 'yy'], ['Z', 'tseta'],
['Å', 'ruotsalainen oo'], ['Ä', 'ää'], ['Ö', 'öö']];

/* ======================================================================== */
/* MODULES                                                                   */
/* ======================================================================== */
var MODULES = [

/* ============ MODULE 0 ============ */
{id:'m0', num:'0', title:'Suomen kieli & ääntäminen', sub:'The language, alphabet, pronunciation & vowel harmony',
learn:[
{h:'Suomi — the country (reading text)',body:`
<div class="terminal-card"><div class="traffic"><i></i><i></i><i></i><span class="t-title">lukuteksti · Suomi</span></div>
<div class="dlg-line">${spk('Suomi on maa Pohjois-Euroopassa. Suomessa on vähän yli viisi miljoonaa asukasta.')}<span class="fi">Suomi on maa Pohjois-Euroopassa. Suomessa on vähän yli viisi miljoonaa asukasta. Se on aika vähän, koska Suomi on iso maa. Suomessa puhutaan suomea ja vähän myös ruotsia.</span></div>
<div class="dlg-line">${spk('Suomen presidentti on Sauli Niinistö. Tärkeä päivä on kuudes joulukuuta, joka on Suomen itsenäisyyspäivä.')}<span class="fi">Suomen presidentti on Sauli Niinistö. Tärkeä päivä on 6.12., joka on Suomen itsenäisyyspäivä. Suomen lipussa on risti, ja lipun värit ovat valkoinen ja sininen. Värit ovat kuin valkoinen lumi ja sininen taivas.</span></div>
<div class="dlg-line">${spk('Talvella Suomessa on melko kylmä ja lunta sataa paljon. Kesällä on melko lämmin, mutta ei ole kuuma.')}<span class="fi">Talvella Suomessa on melko kylmä ja lunta sataa paljon. Kesällä on melko lämmin, mutta ei ole kuuma.</span></div>
<div class="dlg-line">${spk('Suomen suurimmat kaupungit ovat Helsinki, Espoo, Tampere, Vantaa, Turku ja Oulu.')}<span class="fi">Suomen suurimmat kaupungit ovat Helsinki, Espoo, Tampere, Vantaa, Turku ja Oulu. Helsingissä on noin 600 000 ja Oulussa noin 200 000 asukasta.</span></div>
</div>
${vgrid([['maa','country'],['asukas','inhabitant'],['vähän','a little / few'],['iso','big'],['puhutaan','is spoken'],['tärkeä','important'],['itsenäisyyspäivä','independence day'],['lippu','flag'],['risti','cross'],['valkoinen','white'],['sininen','blue'],['lumi','snow'],['taivas','sky'],['talvella','in winter'],['kylmä','cold'],['kesällä','in summer'],['lämmin','warm'],['kuuma','hot'],['suurin','biggest'],['kaupunki','city']])}
<p class="body-sm">Cities on the booklet map, north → south: Inari · Rovaniemi · <b>Oulu</b> · Kuopio · Jyväskylä · Tampere · Turku · Helsinki.</p>
<p class="caption mute">Note: the booklet predates 2024 — Finland's current president is Alexander Stubb.</p>`},
{h:'What kind of language is Finnish?',body:`
<p>Finnish (suomi) is the first official language of Finland; the second is Swedish (ruotsi). It has about five million speakers and belongs to the <b>Finno-Ugrian</b> family together with Estonian (viro), Hungarian (unkari) and the Sami (saame) languages — so its structure differs greatly from Indo-European languages.</p>
${tbl(null,[
['no articles','auto = <i>a car / the car</i>'],
['no grammatical gender','hän = <i>she or he</i>; se = <i>it</i> (spoken Finnish: also she/he)'],
['no future tense','Käyn saunassa. = <i>I’m going to sauna.</i> · Käyn saunassa huomenna. = <i>…tomorrow.</i>'],
['endings, not prepositions','auto+<b>ssa</b> = <i>in the car</i> · puhu+<b>t</b> = <i>you speak</i> · puhu+t+<b>ko</b>? = <i>do you speak?</i> Nouns inflect in 14 cases; the important information is usually at the end of the word.'],
['original vocabulary','puhelin <i>telephone</i> · tietokone <i>computer</i> · sähkö <i>electricity</i>'],
['lots of loan words','banaani · turisti · peili · hotelli · baari · lasi · bussi · rokki · tuoli · tupakka · ranska'],
['compound words','kirja <i>book</i> + sana <i>word</i> → sanakirja <i>dictionary</i>; kirjasto <i>library</i>, sanasto <i>vocabulary</i>'],
['spoken ≠ written','Minä olen → mä(ä)/mie oon · Sinä menet → sä(ä)/sie meet · Oletko sinä? → Ooksä? Ooksie? <b>Ookko nää?</b> (Oulu dialect!)']])}
<p class="body-sm">Read more: <a href="https://finland.fi/" target="_blank" rel="noopener">This is Finland</a> · <a href="https://finland.fi/life-society/where-does-finnish-come-from/" target="_blank" rel="noopener">Where does Finnish come from?</a></p>`},
{h:'Suomen aakkoset — the alphabet',body:`
<p>Tap a letter to hear its Finnish name.</p>
<div class="alpha-grid">${ALPHA.map(function(a){return '<button class="alpha-cell" onclick="say(\''+a[1]+'\')"><b>'+a[0]+'</b><span>'+a[1]+'</span></button>';}).join('')}</div>
<div class="note"><b>Spelling your name:</b> ”Minun nimi kirjoitetaan <i>aa, än, än, aa</i>.” (= A-N-N-A) — Miten sinun nimi kirjoitetaan?</div>`},
{h:'Pronunciation rules',body:`
<p><b>1. Finnish is phonetic.</b> Each letter = one sound, always pronounced the same way.</p>
<p><b>2. Short vs. long sounds change the meaning.</b></p>
${tbl(null,[['tuli','fire'],['tuuli','wind'],['tulli','customs office'],['sata','hundred'],['saattaa','to accompany'],['sataa','to rain']])}
<div class="note">Be careful: <b>Minä tapaan sinut huomenna</b> = I’ll <i>meet</i> you tomorrow. <b>Minä tapan sinut huomenna!</b> = I’ll <i>kill</i> you tomorrow! ${spk('Minä tapaan sinut huomenna. Minä tapan sinut huomenna!')}</div>
<p><b>3. Main stress is always on the first syllable:</b> <b>to</b>maatti · <b>mu</b>seo · <b>mu</b>siikki · <b>pro</b>sentti · <b>au</b>rinko · <b>va</b>nha ${spk('tomaatti, museo, musiikki, prosentti, aurinko, vanha')}</p>
<p><b>4. Intonation falls</b> — even in questions it does not rise: Mitä kuuluu? · Kiitos hyvää. · Oletko huomenna kotona? ${spk('Mitä kuuluu? Kiitos hyvää. Oletko huomenna kotona?')}</p>`},
{h:'Duration pairs — vowels & consonants',body:`
<p>Minimal pairs from the booklet. Tap 🔊 to hear each pair.</p>
<h5 class="heading-sm">Vokaalien kesto — vowels</h5>
${vgrid([['kala / maa','fish / country'],['talo / maanantai','house / Monday'],['loma / Lontoo','holiday / London'],['hullu / kuu','crazy / moon'],['tuli / tuuli','fire / wind'],['kivi / kiivi','stone / kiwi'],['tili / tiili','account / brick'],['sinä / siinä','you / therein'],['te / tee','you (pl.) / tea'],['vene / teema','boat / theme'],['ei / eepos','no / epic'],['käsi / pää','hand / head'],['tämä / lääni','this / province'],['mörkö / Töölö','bogeyman / place in Helsinki'],['hylly / kyy','shelf / adder'],['kynä / tyyli','pen / style']])}
<h5 class="heading-sm">Konsonanttien kesto — consonants</h5>
${vgrid([['kuka / kukka','who / flower'],['mato / matto','worm / carpet'],['kana / kannu','chicken / jug'],['koru / jarru','jewel / brake'],['lupa / lippu','permission / ticket, flag'],['lumi / lammas','snow / sheep'],['tili / tilli','account / dill'],['Pasi / passi','(male name) / passport']])}
<h5 class="heading-sm">Muita konsonantteja — other consonants</h5>
${vgrid([['made / sade','burbot / rain'],['ja / jono / kirja','and / queue / book'],['heti / huono','immediately / bad'],['lehti / tähti','leaf / star'],['vuosi / talvi / kevät','year / winter / spring']])}`},
{h:'Diftongeja — diphthongs',body:`
${vgrid([['aika, Aino, Maija','time, (names)'],['kaunis, lauantai','beautiful, Saturday'],['muistaa, uida','remember, swim'],['tuoli, suora, tuo','chair, straight, that'],['Oulu, koulu, housut','Oulu, school, pants'],['koira, soittaa, autoilla','dog, play an instrument, drive a car'],['pieni, viekas, viulu','small, cunning, violin'],['eilen, seiväs, sievä','yesterday, pole, pretty'],['neula, eukko, poika','needle, old woman, boy'],['äiti, päivää, käydä','mother, good day, visit'],['köyhä, löyly, pöytä','poor, sauna heat, table'],['syödä, yö, työ, pyörä','eat, night, work, bike']])}`},
{h:'Vokaaliharmonia — vowel harmony',body:`
<div class="rule-box"><b>Back vowels:</b> A · O · U → ending <b>-ssa</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Front vowels:</b> Ä · Ö · Y → ending <b>-ssä</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Neutral:</b> E · I (can appear with both)</div>
<p>Only back <i>or</i> front vowels can appear in one word (loan words like <i>dynamiitti</i>, <i>analyysi</i> are exceptions). When adding a suffix, the word’s vowels decide the variant: <b>auto+ssa</b> (in the car), <b>pyörä+llä</b> (by bike), tšekki+<b>läinen</b>, puola+<b>lainen</b>.</p>
<p>In compound words the <b>last</b> word decides: polkupyörä+<b>llä</b>. Words with only neutral vowels (e, i) usually take the <b>front</b> variant: Egypti+<b>ssä</b>.</p>`}
],
practice:[
{id:'p0a',title:'Vowel harmony: -ssa or -ssä?',intro:'Olen… (add the correct ending)',type:'type',items:[
 {q:'sauna___',a:['saunassa','ssa','-ssa'],show:'saunassa'},
 {q:'metsä___',a:['metsässä','ssä','-ssä'],show:'metsässä'},
 {q:'keskusta___',a:['keskustassa','ssa','-ssa'],show:'keskustassa'},
 {q:'yliopisto___',a:['yliopistossa','ssa','-ssa'],show:'yliopistossa'},
 {q:'Jyväskylä___',a:['jyväskylässä','ssä','-ssä'],show:'Jyväskylässä'},
 {q:'Egypti___',a:['egyptissä','ssä','-ssä'],show:'Egyptissä'},
 {q:'talo___ (house)',a:['talossa','ssa','-ssa'],show:'talossa'},
 {q:'pöytä…llä/llä? → pöydä___ (on the table)',a:['pöydällä','llä','-llä'],show:'pöydällä'}]},
{id:'p0b',title:'Minkä sanan kuulet? — which word do you hear?',intro:ttsOK?'Press listen, then choose the word you hear.':'(Speech not available on this device — choose the Finnish word that matches the meaning.)',type:'listen',items:[
 {pair:[['usko','faith'],['yskä','cough']]},
 {pair:[['rapu','crayfish'],['rappu','stair-step']]},
 {pair:[['koski','rapids'],['kaski','burn-clearing']]},
 {pair:[['te','you (pl.)'],['tee','tea']]},
 {pair:[['älli','wits'],['Elli','(name)']]},
 {pair:[['kuollut','dead'],['koulut','schools']]},
 {pair:[['laki','law'],['lakki','cap']]},
 {pair:[['sääri','leg'],['saari','island']]},
 {pair:[['väri','color'],['veri','blood']]},
 {pair:[['outo','strange'],['auto','car']]}]},
{id:'p0c',title:'Reading comprehension: Suomi',type:'mc',items:[
 {q:'Montako asukasta Suomessa on?',o:['vähän yli viisi miljoonaa','noin kaksi miljoonaa','noin kymmenen miljoonaa','600 000'],a:0},
 {q:'Mitä kieliä Suomessa puhutaan?',o:['suomea ja vähän ruotsia','suomea ja venäjää','vain suomea','suomea ja viroa'],a:0},
 {q:'Milloin on Suomen itsenäisyyspäivä?',o:['6.12.','1.5.','24.6.','6.10.'],a:0},
 {q:'Mitkä ovat Suomen lipun värit?',o:['valkoinen ja sininen','punainen ja keltainen','valkoinen ja punainen','sininen ja musta'],a:0},
 {q:'Montako asukasta Oulussa on?',o:['noin 200 000','noin 600 000','noin 50 000','noin miljoona'],a:0},
 {q:'Millainen sää on talvella?',o:['melko kylmä, sataa lunta','kuuma','lämmin ja aurinkoinen','sataa vettä koko ajan'],a:0}]},
{id:'p0d',title:'Sound length changes meaning',type:'mc',items:[
 {q:'"tuuli" tarkoittaa…',o:['wind','fire','customs office','moon'],a:0},
 {q:'"tulli" tarkoittaa…',o:['customs office','fire','wind','ticket'],a:0},
 {q:'"kukka" tarkoittaa…',o:['flower','who','chicken','jug'],a:0},
 {q:'"matto" tarkoittaa…',o:['carpet','worm','sheep','snow'],a:0},
 {q:'Which one means passport?',o:['passi','Pasi','lupa','lippu'],a:0},
 {q:'"Minä tapaan sinut huomenna" means…',o:['I’ll meet you tomorrow','I’ll kill you tomorrow','I met you yesterday','I’ll call you tomorrow'],a:0},
 {q:'Where is the main stress in a Finnish word?',o:['always on the first syllable','always on the last syllable','on the second syllable','it varies'],a:0}]}
],
quiz:[
 {t:'mc',q:'Finnish belongs to the same language family as…',o:['Estonian and Hungarian','Swedish and Norwegian','Russian and Polish','German and Dutch'],a:0},
 {t:'mc',q:'How many cases do Finnish nouns inflect in?',o:['14','4','7','2'],a:0},
 {t:'mc',q:'"hän" means…',o:['she or he','it','they','you'],a:0},
 {t:'type',q:'Spell it out: what does W’s Finnish letter-name sound like?',a:['kaksois-vee','kaksoisvee'],show:'kaksois-vee'},
 {t:'mc',q:'Ä and Ö are…',o:['front vowels','back vowels','neutral vowels','consonants'],a:0},
 {t:'mc',q:'auto + ___ = in the car',o:['-ssa','-ssä','-lla','-llä'],a:0},
 {t:'mc',q:'pyörä + ___ = by bike',o:['-llä','-lla','-ssa','-sta'],a:0},
 {t:'type',q:'Egypti + -ssa/-ssä → ?',a:['egyptissä'],show:'Egyptissä'},
 {t:'mc',q:'"sataa" tarkoittaa…',o:['to rain','hundred','to accompany','to count'],a:0},
 {t:'mc',q:'"sanakirja" tarkoittaa…',o:['dictionary','library','vocabulary','notebook'],a:0},
 {t:'mc',q:'Spoken Finnish "Ookko nää?" is dialect from…',o:['Oulu','Helsinki','Turku','Lapland'],a:0},
 {t:'mc',q:'Sentence intonation in Finnish questions…',o:['falls, like in statements','rises at the end','rises in the middle','is flat and robotic'],a:0},
 {t:'type',q:'"kuu" tarkoittaa englanniksi…',a:['moon'],show:'moon'},
 {t:'mc',q:'Which is a Finnish original word (not a loan)?',o:['puhelin','banaani','hotelli','bussi'],a:0}
]},

/* ============ MODULE 1 ============ */
{id:'m1', num:'1', title:'Hei, hauska tavata!', sub:'Greetings, places in the university & everyday signs',
learn:[
{h:'Tervehdyksiä — greetings',body:`
${tbl(['When','Phrases'],[
['AAMULLA (morning)','Hyvää huomenta! · Huomenta! '+spk('Hyvää huomenta! Huomenta!')],
['PÄIVÄLLÄ (day time)','Hyvää päivää! · Päivää! · Moi! · Hei! · Terve! · Moro! '+spk('Hyvää päivää! Moi! Hei! Terve! Moro!')],
['ILLALLA (evening)','Hyvää iltaa! '+spk('Hyvää iltaa!')],
['YÖLLÄ (night)','Hyvää yötä! '+spk('Hyvää yötä!')],
['Kohdatessa (meeting)','Päivää! (Good day!) · Mitä kuuluu? · Mukava nähdä! '+spk('Päivää! Mitä kuuluu? Mukava nähdä!')],
['Lähtiessä (departing)','Hei hei! · Moi moi! · Heippa! · Nähdään! (see you) · Näkemiin! (formal goodbye) · Hyvää viikonloppua! · Mukavaa iltaa! '+spk('Hei hei! Moi moi! Heippa! Nähdään! Näkemiin! Hyvää viikonloppua!')]])}`},
{h:'Dialogues',body:`
${dlg('Maijan uusi työpaikka · Maija’s new work place',[
[null,'Hyvää päivää!'],
[null,'Päivää, päivää! Tervetuloa meidän firmaan!','Welcome to our company!'],
[null,'Kiitos!'],
[null,'Minä olen Joni Metso. Hauska tutustua.','I am… Nice to meet you.'],
[null,'Minun nimi on Maija Leinonen. Hauska tutustua.','My name is…'],
[null,'No niin… Minä esittelen paikat. Tässä on kahvihuone ja kokoushuone. Tuolla on kopiohuone. Ja tässä on sinun työhuone.','I’ll show the places. Here is the coffee room and meeting room. Over there is the copy room. And here is your office.'],
[null,'Okei, selvä.','OK, clear.']])}
${dlg('Kurssilla · in the course',[
[null,'Moi! Mä olen Janna.','colloq. minä = mä'],
[null,'Moi! Mä oon Eveliina.'],
[null,'Terve. Mun nimi on Eetu.','colloq. minun = mun'],
[null,'Mikä sun nimi on?','colloq. sinun = sun'],
[null,'Moro! Mää oon Teemu.','moro = hey (informal)']])}
${dlg('Yliopistolla · at the university',[
[null,'Hei! Tiedätkö, missä on kirjasto?','Do you know where the library is?'],
[null,'Oletko uusi täällä?','Are you new here?'],
[null,'Joo. Tänään on minun ensimmäinen päivä täällä.','Today is my first day here.'],
[null,'Tule! Minä näytän sinulle.','Come! I’ll show you.']])}`},
{h:'Places in the university',body:vgrid([['hissi','lift'],['ilmoitustaulu','noticeboard / bulletin board'],['kahvila','café'],['kirjakauppa','bookshop'],['kirjasto','library'],['käytävä','corridor'],['luentosali','lecture hall'],['naulakko','cloakroom'],['opiskelijakeskus','student center'],['ruokala / ravintola','restaurant'],['sisäänkäynti','entrance'],['säilytyslokerot','lockers'],['tiedekunta','faculty'],['tietokoneluokka','computer room'],['vessa / wc','toilet'],['neuvonta / info','information desk'],['ylioppilaskunta','student union']])},
{h:'General signs and notices',body:vgrid([['AVOINNA MA–PE 9–17','open Mon–Fri 9–17'],['AUKI','open'],['arkisin / Ark.','on working days'],['SULJETTU LA–SU','closed Sat–Sun'],['KIINNI','closed'],['KASSA','cash desk'],['VUORONUMERO','queue number'],['VEDÄ','pull'],['TYÖNNÄ','push'],['ALE / alennusmyynti','(bargain) sale'],['WC (vessa)','toilet'],['N (Naiset)','Ladies'],['M (Miehet)','Gentlemen'],['VARATTU','occupied; reserved'],['VAPAA','free; vacant'],['RIKKI','broken'],['EPÄKUNNOSSA','out of order'],['ULOS','exit (out)'],['SISÄÄN / SISÄÄNKÄYNTI','entrance'],['VARATIE / varauloskäynti','emergency exit'],['VAIN HENKILÖKUNNALLE','for staff only'],['SEIS','stop'],['KIELLETTY','forbidden, not allowed']])}
],
practice:[
{id:'p1a',title:'Yhdistä sanat — match university places',type:'match',pairs:[['hissi','lift'],['ilmoitustaulu','noticeboard'],['kahvila','café'],['kirjakauppa','bookshop'],['kirjasto','library'],['käytävä','corridor'],['luentosali','lecture hall'],['naulakko','cloakroom'],['opiskelijakeskus','student center'],['ruokala','restaurant'],['sisäänkäynti','entrance'],['säilytyslokerot','lockers'],['tiedekunta','faculty'],['tietokoneluokka','computer room'],['vessa','toilet'],['neuvonta','information desk'],['ylioppilaskunta','student union']]},
{id:'p1b',title:'Signs quiz',type:'mc',items:[
 {q:'The door says TYÖNNÄ. You should…',o:['push','pull','stop','use another door'],a:0},
 {q:'The door says VEDÄ. You should…',o:['pull','push','knock','wait'],a:0},
 {q:'SULJETTU means…',o:['closed','open','sale','reserved'],a:0},
 {q:'AVOINNA means…',o:['open','closed','broken','forbidden'],a:0},
 {q:'The toilet shows VARATTU. It is…',o:['occupied','vacant','out of order','staff only'],a:0},
 {q:'VAPAA means…',o:['free / vacant','forbidden','fast','open on weekdays'],a:0},
 {q:'EPÄKUNNOSSA means…',o:['out of order','in good condition','emergency exit','under 18 only'],a:0},
 {q:'VAIN HENKILÖKUNNALLE means…',o:['for staff only','only cash','no entry with dogs','queue here'],a:0},
 {q:'KASSA is…',o:['the cash desk','the exit','a locker','a café'],a:0},
 {q:'"Ark. 9–17" means the place is open…',o:['on working days 9–17','always','on weekends 9–17','at night'],a:0},
 {q:'SEIS means…',o:['stop','go','sale','seven'],a:0},
 {q:'KIELLETTY means…',o:['forbidden','recommended','closed on Mondays','cash only'],a:0},
 {q:'VARATIE is…',o:['an emergency exit','a reserved seat','a queue number','a corridor'],a:0}]},
{id:'p1c',title:'Which greeting fits?',type:'mc',items:[
 {q:'It is 8 in the morning. You say…',o:['Hyvää huomenta!','Hyvää yötä!','Näkemiin!','Hyvää iltaa!'],a:0},
 {q:'You are going to sleep. You say…',o:['Hyvää yötä!','Hyvää huomenta!','Terve!','Moro!'],a:0},
 {q:'A formal way to say goodbye:',o:['Näkemiin!','Moro!','Heippa!','Moi moi!'],a:0},
 {q:'"Nähdään!" means…',o:['See you!','Good night!','Welcome!','Thanks!'],a:0},
 {q:'It is Friday afternoon and your teacher leaves. You say…',o:['Hyvää viikonloppua!','Hyvää huomenta!','Ei se mitään.','Otan sen.'],a:0},
 {q:'"Hauska tutustua" means…',o:['Nice to meet you (get to know you)','See you soon','How are you?','Have a nice day'],a:0},
 {q:'"Tervetuloa!" means…',o:['Welcome!','Goodbye!','Thank you!','Good luck!'],a:0}]}
],
quiz:[
 {t:'type',q:'Say "Good morning!" in Finnish:',a:['hyvää huomenta','huomenta'],show:'Hyvää huomenta!'},
 {t:'type',q:'Say "Good night!" in Finnish:',a:['hyvää yötä'],show:'Hyvää yötä!'},
 {t:'mc',q:'"kirjasto" is…',o:['a library','a bookshop','a lecture hall','a café'],a:0},
 {t:'mc',q:'"kirjakauppa" is…',o:['a bookshop','a library','a corridor','a faculty'],a:0},
 {t:'type',q:'Where is the library? = "Missä on ___?"',a:['kirjasto'],show:'kirjasto'},
 {t:'mc',q:'"luentosali" is…',o:['a lecture hall','a locker','an entrance','a student union'],a:0},
 {t:'mc',q:'KIINNI on a shop door means…',o:['closed','open','pull','push'],a:0},
 {t:'mc',q:'ALE in a shop window means…',o:['sale','closed','exit','danger'],a:0},
 {t:'mc',q:'"Tiedätkö, missä on kirjasto?" means…',o:['Do you know where the library is?','Is the library open?','Do you like the library?','When does the library close?'],a:0},
 {t:'mc',q:'"Tänään on minun ensimmäinen päivä täällä" means…',o:['Today is my first day here','Tomorrow is my last day here','Today is a beautiful day','My day here is over'],a:0},
 {t:'type',q:'"lift / elevator" in Finnish:',a:['hissi'],show:'hissi'},
 {t:'mc',q:'ULOS means…',o:['exit / out','entrance','upstairs','toilet'],a:0},
 {t:'mc',q:'"Mikä sun nimi on?" is…',o:['spoken-language "What is your name?"','formal "How are you?"','"Where do you live?"','"What time is it?"'],a:0}
]},

/* ============ MODULE 2 ============ */
{id:'m2', num:'2', title:'Hei, mitä kuuluu?', sub:'How are you · sorry · thank you · fixing communication problems',
learn:[
{h:'Mitä kuuluu? — how are you?',body:`
${dlg('Kolme pientä dialogia',[
[null,'Hei! Mitä kuuluu?','How are you?'],
[null,'Kiitos, ihan hyvää. Entä sinulle?','Quite fine, thanks. What about you?'],
[null,'Ihan hyvää, kiitos.'],
[null,'Terve! Mitäs kuuluu?','more conversational'],
[null,'Eipä erikoista. Entä sinulle?','Nothing special.'],
[null,'Ei kovin hyvää.','Not very good.'],
[null,'Moi! Miten menee?','How is it going?'],
[null,'No, ihan hyvin. Entä itselläs(i)?','Well, quite well. What about yourself?'],
[null,'Ihan hyvin.']])}
${vgrid([['Mitä kuuluu?','How are you?'],['ihan','quite'],['Entä sinulle?','What/how about you?'],['Mitäs kuuluu?','(more conversational)'],['Eipä erikoista','Nothing special'],['Ei kovin hyvää','Not very good'],['Miten menee?','How is it going?'],['No…','well… (filler word)'],['Ihan hyvin','quite well'],['Entä itselläs(i)?','What about yourself?']])}
${dlg('Leena ja Maija tapaavat kadulla · they meet on the street',[
['Leena','Moi Maija!!'],
['Maija','Ai Leena, moi! Mitä kuuluu?'],
['Leena','No ei ihmeempiä. Entä sulle?','Nothing special (informal). How about you?'],
['Maija','Ihan hyvää, mutta koko ajan on kiire.','…but it’s busy all the time.'],
['Leena','Niinpä.','Indeed.'],
['Maija','Anteeksi, minun täytyy nyt mennä. Soitellaan!','I need to go now. Let’s call each other!'],
['Leena','Joo soitellaan. Heippa.'],
['Maija','Heippa.']])}`},
{h:'Anteeksi! — sorry / excuse me',body:`
<p>In Finnish there is <b>one word</b> for apologizing and being sorry: <b>anteeksi</b>.</p>
${dlg('Anteeksi!',[
[null,'Voi, anteeksi kamalasti!','Oh, I’m terribly sorry!'],
[null,'No, ei se mitään.','Well, it does not matter.'],
[null,'Anteeksi, missä on hissi?','Excuse me, where is the elevator?'],
[null,'Se on tuolla.','It is over there.'],
[null,'Kiitos.']])}
${dlg('Ongelma keskustelussa · a problem in the conversation',[
[null,'Hei, anteeksi, missä on Tokmanni?'],
[null,'Se on Isokadulla.','It’s on Isokatu (street).'],
[null,'Anteeksi, en ymmärrä, voitko sanoa uudestaan?','I don’t understand, can you say it again?'],
[null,'Tokmanni on Isokadulla.'],
[null,'Ahaa! Kiitos.'],
[null,'Ei kestä. Hei hei!','You’re welcome. Bye!']])}
<h5 class="heading-sm">If a problem occurs, use these:</h5>
${vgrid([['Anteeksi, en kuullut.','I’m sorry, I did not hear.'],['Anteeksi, en ymmärrä.','I’m sorry, I do not understand.'],['Voitko sanoa uudestaan?','Can you repeat?'],['Voitko sanoa hitaasti?','Can you say it slowly?'],['Voitko sanoa englanniksi?','Can you say it in English?'],['Mitä se tarkoittaa?','What does it mean?'],['Se tarkoittaa…','It means…'],['En tiedä.','I don’t know.'],['En muista.','I don’t remember.']])}`},
{h:'Kiitos! — thank you',body:`
${vgrid([['Kiitos! / Kiitti!','Thank you! / Thanks!'],['Kiitos paljon!','Thank you very much!'],['Ole hyvä!','Here you are! / You’re welcome!'],['Olkaa hyvä!','(formal/plural) Here you are!'],['Eipä mitään!','Don’t mention it!'],['Ei kestä.','You’re welcome.'],['Tervetuloa!','Welcome!'],['Kiitoksia!','Many thanks!'],['Mukava nähdä!','Nice to see you!'],['Kiitos hyvää.','Fine, thank you.']])}
<div class="note">Formal register: ”Olkaa hyvä, herra Nieminen!” — ”Kiitoksia, rouva professori!”</div>`}
],
practice:[
{id:'p2a',title:'Yhdistä lauseet — how do you reply?',type:'match',pairs:[
 ['Hyvää yötä!','Hyvää yötä, nuku hyvin.'],['Ole hyvä!','Kiitos!'],['Voi, anteeksi!','Ei se mitään.'],['Mukava nähdä!','Joo, niin on.'],['Miten menee?','Ihan hyvin!'],['Hyvää huomenta!','Huomenta, huomenta!'],['Hei, minä olen Mirja!','Moi! Minä olen Pekka.'],['Terve!','Terve, terve!'],['Heippa!','Hei, hei!'],['Nähdään!','Joo, nähdään!'],['Mitä kuuluu?','Kiitos, ihan hyvää.'],['Hauska tavata!','Joo, hauska tavata!']]},
{id:'p2b',title:'Miten sanot suomeksi? — say it in Finnish',type:'type',items:[
 {q:'Nice to get to know you!',a:['hauska tutustua'],show:'Hauska tutustua!'},
 {q:'Nice to meet you!',a:['hauska tavata'],show:'Hauska tavata!'},
 {q:'Good morning!',a:['hyvää huomenta','huomenta'],show:'Hyvää huomenta!'},
 {q:'Hello!',a:['hei','moi','terve','päivää','hyvää päivää','moro'],show:'Hei! / Moi! / Terve!'},
 {q:'Have a good weekend!',a:['hyvää viikonloppua'],show:'Hyvää viikonloppua!'},
 {q:'See you!',a:['nähdään'],show:'Nähdään!'},
 {q:'I am terribly sorry!',a:['anteeksi kamalasti','voi anteeksi kamalasti'],show:'(Voi,) anteeksi kamalasti!'},
 {q:'Excuse me, where is the bookshop?',a:['anteeksi missä on kirjakauppa','anteeksi missä kirjakauppa on'],show:'Anteeksi, missä on kirjakauppa?'},
 {q:'I don’t understand.',a:['en ymmärrä','anteeksi en ymmärrä','minä en ymmärrä'],show:'En ymmärrä.'},
 {q:'Can you say it again?',a:['voitko sanoa uudestaan'],show:'Voitko sanoa uudestaan?'},
 {q:'I don’t know.',a:['en tiedä','minä en tiedä'],show:'En tiedä.'},
 {q:'Good evening!',a:['hyvää iltaa'],show:'Hyvää iltaa!'}]},
{id:'p2c',title:'Kirjoita kysymyssana — write the question word',type:'type',items:[
 {q:'___ sinun nimi on? — Minä olen Heli.',a:['mikä'],show:'Mikä'},
 {q:'___ sinun nimi kirjoitetaan? — H-E-L-I.',a:['miten'],show:'Miten'},
 {q:'Terve Jussi, ___ kuuluu? — Hyvää, kiitos.',a:['mitä','mitäs'],show:'mitä(s)'},
 {q:'Moi Eveliina, ___ menee? — Ei kovin hyvin. Minä olen väsynyt (tired).',a:['miten'],show:'miten'},
 {q:'Anteeksi, ___ on kirjasto? — Se on tuolla.',a:['missä'],show:'missä'},
 {q:'___ sää oot? — Mä oon Minna.',a:['kuka'],show:'Kuka'}]}
],
quiz:[
 {t:'mc',q:'"Eipä erikoista" means…',o:['Nothing special','Everything is great','Not again','No thank you'],a:0},
 {t:'mc',q:'Someone bumps into you and says "Voi, anteeksi kamalasti!" You reply…',o:['Ei se mitään.','Otan sen.','Tervetuloa!','Hyvää yötä!'],a:0},
 {t:'type',q:'"Can you say it slowly?" in Finnish:',a:['voitko sanoa hitaasti'],show:'Voitko sanoa hitaasti?'},
 {t:'type',q:'"What does it mean?" in Finnish:',a:['mitä se tarkoittaa'],show:'Mitä se tarkoittaa?'},
 {t:'mc',q:'"Ei kestä" means…',o:['You’re welcome','It doesn’t last','No entry','Not yet'],a:0},
 {t:'mc',q:'Someone hands you coffee and says "Ole hyvä!" You say…',o:['Kiitos!','Anteeksi!','Seis!','Näkemiin!'],a:0},
 {t:'mc',q:'"Minun täytyy nyt mennä" means…',o:['I need to go now','I want to stay','I will call you','I am very busy'],a:0},
 {t:'mc',q:'"Soitellaan!" means…',o:['Let’s call each other!','Let’s eat!','See you never!','Sing along!'],a:0},
 {t:'mc',q:'"koko ajan on kiire" means…',o:['it’s busy all the time','the clock is broken','time goes slowly','I am always late'],a:0},
 {t:'type',q:'"I don’t remember." in Finnish:',a:['en muista','minä en muista'],show:'En muista.'},
 {t:'mc',q:'How do you reply to "Mitä kuuluu?"',o:['Kiitos, ihan hyvää.','Ole hyvä.','Tervetuloa.','Se on tuolla.'],a:0},
 {t:'mc',q:'"Entä sinulle?" means…',o:['What about you?','Where are you?','Who are you?','Why are you here?'],a:0}
]},

/* ============ MODULE 3 ============ */
{id:'m3', num:'3', title:'Minä olen…', sub:'Introducing yourself · olla · possessives · numbers & prices',
learn:[
{h:'Introducing yourself',body:`
${dlg('Bileissä · at the party',[
['Kaisa','Moi, Jenny. Hauska nähdä! Mitä kuuluu?','Nice to see you!'],
['Jenny','Ihan kivaa. Entä sinulle?','Quite nice.'],
['Kaisa','Kiitos hyvää. Tässä on minun ystävä Ben. Hän on belgialainen.','Here is my friend Ben. He is Belgian.'],
['Jenny','Hauska tavata, Ben. Minun nimi on Jenny.'],
['Ben','Hei Jenny! Minkämaalainen sinä olet?','What is your nationality?'],
['Jenny','Minä olen englantilainen.'],
['Kaisa','Hei, tuolla on Junko! Hän on japanilainen. Junko! Tule tänne!','Come here!']])}
${dlg('Kaisa kertoo · Kaisa introduces herself',[
[null,'Minun nimi on Kaisa. Se kirjoitetaan koo-aa-ii-äs-aa.','It is spelled K-A-I-S-A.'],
[null,'Minun kotimaa on Suomi. Minä olen suomalainen.','My home country is Finland. I am Finnish.'],
[null,'Minä puhun suomea, ruotsia, englantia ja vähän ranskaa.','I speak Finnish, Swedish, English and a little French.'],
[null,'Olen opiskelija. Opiskelen Oulun yliopistossa. Minun pääaine on historia.','I’m a student at the University of Oulu. My major is history.'],
[null,'Minun ystävä on Maria. Hän on puolalainen. Hän on työssä Oulun yliopistossa, hän on tutkija.','My friend Maria is Polish. She works at the university; she is a researcher.'],
[null,'Maria on naimisissa. Hänen miehen nimi on Jan. Jan on norjalainen. Maria ja Jan opiskelevat suomea.','Maria is married. Her husband’s name is Jan (Norwegian). They study Finnish.']])}
<h5 class="heading-sm">Kysymyksiä — the key questions</h5>
${vgrid([['Mikä sinun (sun) nimi on?','What is your name? — Minun nimi on…'],['Minkämaalainen sinä olet?','What is your nationality? — Olen …lainen/…läinen'],['Mitä kieliä sinä puhut?','What languages do you speak? — Puhun …a/…ä'],['Missä sinä opiskelet?','Where do you study? — Opiskelen …ssa/…lla'],['Mikä sinun pääaine on?','What is your major? — Minun pääaine on…'],['Mikä sinun äidinkieli on?','What is your mother tongue?'],['Mikä sinun kotimaa on?','What is your home country?']])}`},
{h:'Nationalities & languages (-lainen/-läinen, partitive)',body:`
${tbl(['Country','Nationality (Minä olen…)','Language (Minä puhun…)'],[
['Suomi','suoma<b>lainen</b>','suome<b>a</b>'],
['Kiina','kiina<b>lainen</b>','kiina<b>a</b>'],
['Egypti','egypti<b>läinen</b>','—'],
['Venäjä','venä<b>läinen</b>','venäjä<b>ä</b>'],
['(arabia)','—','arabia<b>a</b>']])}
<p>The nationality ending <b>-lainen/-läinen</b> follows vowel harmony. Languages take the partitive <b>-a/-ä</b> after <i>puhua</i>.</p>
<h5 class="heading-sm">Maita — countries</h5>
${vgrid([['Ranska','France'],['Saksa','Germany'],['Tšekki','Czechia'],['Puola','Poland'],['Sveitsi','Switzerland'],['Norja','Norway'],['Tanska','Denmark'],['Itävalta','Austria'],['Alankomaat (Hollanti)','Netherlands'],['Iso-Britannia','Great Britain'],['Kreikka','Greece'],['Espanja','Spain'],['Ruotsi','Sweden'],['Venäjä','Russia'],['Japani','Japan'],['Thaimaa','Thailand'],['Korea','Korea'],['Kiina','China'],['Intia','India'],['Pakistan','Pakistan'],['Australia','Australia'],['Meksiko','Mexico'],['USA','USA']])}`},
{h:'OLLA — to be (+ negative)',body:`
${tbl(['Person','olla','Example'],[
['minä (mä)','ole<b>n</b> / oon','(Minä) olen Leena. Olen opiskelija.'],
['sinä (sä)','ole<b>t</b> / oot','(Sinä) olet töissä yliopistossa. Olet tutkija.'],
['hän / se','<b>on</b>','Hän on Jukka. Jukka on opettaja.'],
['me','ole<b>mme</b>','(Me) olemme nyt täällä.'],
['te','ole<b>tte</b>','(Te) olette suomen kurssilla.'],
['he / ne','o<b>vat</b>','He ovat kotona.']])}
<h5 class="heading-sm">Negatiiviset verbit — negative</h5>
${tbl(null,[['minä <b>en</b> ole','I am not'],['sinä <b>et</b> ole','you are not'],['hän <b>ei</b> ole','s/he is not'],['me <b>emme</b> ole','we are not'],['te <b>ette</b> ole','you (pl.) are not'],['he <b>eivät</b> ole','they are not']])}
<p class="body-sm">All Finnish verbs conjugate according to person like this.</p>`},
{h:'Possessive pronouns & family',body:`
${tbl(null,[['minun (mun)','my — Minun nimi on Leena.'],['sinun (sun)','your — Sinun nimi on Pertti.'],['hänen / sen','his/her / its — Hänen nimi on Laura. Sen nimi on Honda.'],['meidän','our — Meidän nimet ovat Veikko ja Laura.'],['teidän','your (pl.) — Teidän nimet ovat Riitta ja Timo.'],['heidän / niiden','their — Heidän nimet ovat Aune ja Kauko.']])}
<h5 class="heading-sm">Perhesanasto — family words (Minulla on… = I have…)</h5>
${vgrid([['lapsi (lasta)','child'],['mies','man, husband'],['vaimo','wife'],['sisko, sisar','sister'],['isosisko','elder sister'],['veli','brother'],['pikkuveli','younger brother'],['velipuoli','step-brother'],['isä','dad'],['äiti','mom'],['isoisä, vaari, pappa','grandfather'],['isoäiti, mummo, mummu','grandmother'],['kissa','cat'],['koira','dog']])}`},
{h:'Numerot — numbers',body:`
${vgrid([['0 nolla · 1 yksi · 2 kaksi','3 kolme · 4 neljä · 5 viisi'],['6 kuusi · 7 seitsemän','8 kahdeksan · 9 yhdeksän · 10 kymmenen'],['11–19: …toista','yksitoista, kaksitoista, … yhdeksäntoista'],['20 kaksikymmentä','21 kaksikymmentäyksi …'],['30 kolmekymmentä · 40 neljäkymmentä','50 viisikymmentä … 90 yhdeksänkymmentä'],['100 sata · 200 kaksisataa','1 000 tuhat · 2 000 kaksituhatta'],['10 000 kymmenentuhatta','100 000 satatuhatta'],['1 000 000 miljoona','2 000 000 kaksi miljoonaa']])}
<div class="note"><b>Helppoa matematiikkaa:</b> 1 + 1 = 2 (yksi <b>plus</b> yksi <b>on</b> kaksi) · 3 − 2 = 1 (kolme <b>miinus</b> kaksi on yksi)</div>
<h5 class="heading-sm">Kysymyksiä</h5>
${vgrid([['Kuinka vanha sinä olet?','How old are you? — Minä olen ___ vuotta.'],['Mikä vuosi nyt on?','What year is it now? — Nyt on vuosi ___.'],['Mikä sinun puhelinnumero on?','What is your phone number?'],['Mikä sinun osoite on?','What is your address? (+ postinumero = postcode)'],['Kuinka pitkä sinä olet?','How tall are you? — Olen ___ cm (senttimetriä).']])}`},
{h:'Tavaroita & hinta — things and prices',body:`
${vgrid([['suklaa','chocolate'],['tietokone / läppäri','computer / laptop'],['takki','coat'],['kello','clock, watch'],['reppu','backpack'],['kynä','pen'],['laukku','bag'],['olut','beer'],['pyörä','bike'],['puhelin / kännykkä','phone / mobile'],['sateenvarjo','umbrella'],['hammasharja','toothbrush'],['tuoli','chair'],['pöytä','table'],['kirja','book']])}
${dlg('Hinta · asking the price',[
['A','Kuinka paljon hammasharja maksaa?','How much does the toothbrush cost?'],
['B','Se maksaa 2,50 € — kaksi euroa viisikymmentä senttiä (= "kaksi viisikymmentä").'],
['A','Se on halpa. / Se on kallis.','It is cheap. / It is expensive.'],
['A','Otan sen.','I’ll take it.']])}
<p class="body-sm">Raha (money): € = euro · snt = sentti</p>`}
],
practice:[
{id:'p3a',title:'Täydennä olla-verbi — fill in the right form of olla',type:'type',items:[
 {q:'Antti Jokinen ___ työssä Oulun yliopistossa.',a:['on'],show:'on'},
 {q:'Hän ___ professori.',a:['on'],show:'on'},
 {q:'Oulun yliopisto ___ suuri (big).',a:['on'],show:'on'},
 {q:'Sinä ___ Thomas.',a:['olet','oot'],show:'olet'},
 {q:'(Sinä) ___ vaihto-opiskelija.',a:['olet','oot'],show:'olet'},
 {q:'Minä ___ Pertti Pasanen.',a:['olen','oon'],show:'olen'},
 {q:'Me ___ suomen kurssilla.',a:['olemme'],show:'olemme'},
 {q:'Te ___ luentosalissa.',a:['olette'],show:'olette'},
 {q:'He ___ kahvilassa.',a:['ovat'],show:'ovat'}]},
{id:'p3b',title:'Persoonapronomini & negatiivi',type:'type',items:[
 {q:'Missä Elisa on? — ___ on kirjastossa.',a:['hän','se'],show:'Hän'},
 {q:'Minkämaalainen ___ olet?',a:['sinä','sä','sää'],show:'sinä'},
 {q:'___ olen ranskalainen.',a:['minä','mä','mää'],show:'Minä'},
 {q:'___ olemme nyt Oulussa.',a:['me'],show:'Me'},
 {q:'___ ovat kotona (at home).',a:['he','ne'],show:'He'},
 {q:'___ olette kirjakaupassa.',a:['te'],show:'Te'},
 {q:'Olli ___ ole tutkija. (negative)',a:['ei'],show:'ei'},
 {q:'Sinä ___ ole tohtoriopiskelija. (negative)',a:['et'],show:'et'},
 {q:'Minä ___ ole sinkku, minä olen naimisissa. (negative)',a:['en'],show:'en'},
 {q:'Me ___ ole baarissa. (negative)',a:['emme'],show:'emme'},
 {q:'Te ___ ole naimisissa. (negative)',a:['ette'],show:'ette'},
 {q:'He ___ ole kirjastossa. (negative)',a:['eivät'],show:'eivät'}]},
{id:'p3c',title:'Sanat suomeksi — words in Finnish',type:'type',items:[
 {q:'a friend',a:['ystävä'],show:'ystävä'},
 {q:'a student',a:['opiskelija'],show:'opiskelija'},
 {q:'a home country',a:['kotimaa'],show:'kotimaa'},
 {q:'What is your nationality?',a:['minkämaalainen sinä olet','minkämaalainen sä oot','minkämaalainen olet'],show:'Minkämaalainen sinä olet?'},
 {q:'married',a:['naimisissa'],show:'naimisissa'},
 {q:'single',a:['sinkku'],show:'sinkku'},
 {q:'an exchange student',a:['vaihto-opiskelija','vaihtoopiskelija','vaihto opiskelija'],show:'vaihto-opiskelija'},
 {q:'a researcher',a:['tutkija'],show:'tutkija'},
 {q:'a doctoral student',a:['tohtoriopiskelija'],show:'tohtoriopiskelija'},
 {q:'a teacher',a:['opettaja'],show:'opettaja'},
 {q:'I study at the University of Oulu.',a:['opiskelen oulun yliopistossa','minä opiskelen oulun yliopistossa'],show:'(Minä) opiskelen Oulun yliopistossa.'},
 {q:'I speak English.',a:['puhun englantia','minä puhun englantia'],show:'(Minä) puhun englantia.'},
 {q:'I am at home.',a:['olen kotona','minä olen kotona'],show:'(Minä) olen kotona.'},
 {q:'I am not Finnish.',a:['en ole suomalainen','minä en ole suomalainen'],show:'(Minä) en ole suomalainen.'}]},
{id:'p3d',title:'Nationality builder',type:'mc',items:[
 {q:'Suomi → Minä olen…',o:['suomalainen','suomilainen','suomiläinen','suomalläinen'],a:0},
 {q:'Kiina → Hän on…',o:['kiinalainen','kiinaläinen','kiinilainen','kiinanlainen'],a:0},
 {q:'Egypti → Hän on…',o:['egyptiläinen','egyptilainen','egyptalainen','egyptläinen'],a:0},
 {q:'Venäjä → Hän on…',o:['venäläinen','venäjälainen','venälainen','venäjäläinen'],a:0},
 {q:'Japani → Junko on…',o:['japanilainen','japaniläinen','japanalainen','japanlainen'],a:0},
 {q:'Belgia → Ben on…',o:['belgialainen','belgiläinen','belgalainen','belgianlainen'],a:0},
 {q:'Puola → Maria on…',o:['puolalainen','puoläläinen','puolilainen','puolaläinen'],a:0},
 {q:'Norja → Jan on…',o:['norjalainen','norjaläinen','norjilainen','norjanlainen'],a:0},
 {q:'"Minä puhun ___" (Russian):',o:['venäjää','venäjä','venäjässä','venäläinen'],a:0},
 {q:'"Minä puhun ___" (Finnish):',o:['suomea','suomi','suomessa','suomalainen'],a:0}]},
{id:'p3e',title:'Number trainer — write the number in Finnish',type:'numgen'},
{id:'p3f',title:'Prices — Kuinka paljon se maksaa?',type:'mc',items:[
 {q:'2,50 € = ?',o:['kaksi euroa viisikymmentä senttiä','kaksikymmentäviisi euroa','viisi euroa kaksikymmentä senttiä','kaksi euroa viisitoista senttiä'],a:0},
 {q:'"Se on halpa" means…',o:['it is cheap','it is expensive','it is broken','I’ll take it'],a:0},
 {q:'"Se on kallis" means…',o:['it is expensive','it is cheap','it is free','it is closed'],a:0},
 {q:'"Otan sen" means…',o:['I’ll take it','I’ll leave it','I own it','Look at it'],a:0},
 {q:'How do you ask "How much does the coffee cost?"',o:['Kuinka paljon kahvi maksaa?','Kuinka vanha kahvi on?','Missä kahvi on?','Milloin kahvi maksaa?'],a:0},
 {q:'6,70 € + 0,80 € = ?',o:['7,50 €','7,40 €','6,90 €','8,50 €'],a:0}]}
],
quiz:[
 {t:'type',q:'olla: "he ___" (they are)',a:['ovat'],show:'ovat'},
 {t:'type',q:'olla: "me ___" (we are)',a:['olemme'],show:'olemme'},
 {t:'mc',q:'"Hänen miehen nimi on Jan" means…',o:['Her husband’s name is Jan','His dog’s name is Jan','Jan is my name','Jan is a woman’s name'],a:0},
 {t:'mc',q:'"naimisissa" means…',o:['married','single','a neighbor','at work'],a:0},
 {t:'type',q:'my = ___ (formal written form)',a:['minun'],show:'minun'},
 {t:'type',q:'our = ___',a:['meidän'],show:'meidän'},
 {t:'mc',q:'"pikkuveli" is…',o:['a younger brother','a big sister','a grandfather','a step-mother'],a:0},
 {t:'mc',q:'"mummo" is…',o:['a grandmother','a mother','a cat','an aunt'],a:0},
 {t:'gen',g:'number'},
 {t:'gen',g:'number'},
 {t:'mc',q:'17 = ?',o:['seitsemäntoista','seitsemänkymmentä','seitsemän','kymmenenseitsemän'],a:0},
 {t:'mc',q:'"kolme miinus kaksi on…"',o:['yksi','viisi','kaksi','nolla'],a:0},
 {t:'mc',q:'"Kuinka vanha sinä olet?" asks about your…',o:['age','height','address','phone number'],a:0},
 {t:'mc',q:'"Kuinka pitkä sinä olet?" asks about your…',o:['height','age','weight','name'],a:0},
 {t:'type',q:'"backpack" in Finnish:',a:['reppu'],show:'reppu'},
 {t:'mc',q:'"sateenvarjo" is…',o:['an umbrella','a raincoat','a window','a shadow'],a:0}
]},

/* ============ MODULE 4 ============ */
{id:'m4', num:'4', title:'Viikonpäivät & kello', sub:'Days, telling the time, forming questions & verb conjugation',
learn:[
{h:'Viikonpäivät — days of the week',body:`
${vgrid([['ma = maanantai','Monday'],['ti = tiistai','Tuesday'],['ke = keskiviikko','Wednesday'],['to = torstai','Thursday'],['pe = perjantai','Friday'],['la = lauantai','Saturday'],['su = sunnuntai','Sunday']])}
<div class="note">Timeline: <b>toissa päivänä</b> (day before yesterday) → <b>eilen</b> (yesterday) → <b>TÄNÄÄN</b> (today) → <b>huomenna</b> (tomorrow) → <b>ylihuomenna</b> (day after tomorrow). Past questions use <b>oli</b>: "Mikä päivä eilen <b>oli</b>?"</div>
<div class="rule-box"><b>MILLOIN? = when?</b> Add the suffix <b>-na</b> to the weekday: maanantai<b>na</b>, tiistai<b>na</b>, keskiviikko<b>na</b>, torstai<b>na</b>, perjantai<b>na</b>, lauantai<b>na</b>, sunnuntai<b>na</b>, viikonloppu<b>na</b>.<br>
– Milloin sinä opiskelet suomea? – Opiskelen suomea tiistai<b>na</b> ja torstai<b>na</b>.<br>
– Milloin sinä olet Oulussa? – Olen Oulussa viikonloppu<b>na</b>.</div>`},
{h:'Mitä kello on? — telling the time',body:`
${dlg('Aamulla',[
[null,'Huomenta!'],
[null,'Huomenta! Mitä kello on?','What time is it?'],
[null,'Se on nyt tasan kahdeksan.','It is exactly eight now.'],
[null,'Voi ei, bussi tulee seitsemän yli kahdeksan. Nyt minulla on kiire, hei hei!','Oh no, the bus comes at 8:07. Now I’m in a hurry!'],
[null,'Hei hei!']])}
${tbl(['Time','Finnish'],[
['10:00','Kello on (tasan) kymmenen. '+spk('Kello on tasan kymmenen')],
['10:15','Kello on viisitoista yli kymmenen. / varttia yli kymmenen '+spk('Kello on varttia yli kymmenen')],
['10:30','Kello on puoli yksitoista. '+spk('Kello on puoli yksitoista')],
['10:40','Kello on kaksikymmentä vaille yksitoista. '+spk('Kello on kaksikymmentä vaille yksitoista')],
['11:00','Kello on (tasan) yksitoista. '+spk('Kello on tasan yksitoista')]])}
<div class="rule-box"><b>tasan</b> = exactly · <b>yli</b> = past · <b>puoli</b> = half (→ half <i>towards the next</i> hour!) · <b>vaille</b> = to · <b>vartti</b> = quarter</div>
<div class="note"><b>Vuorokausi</b> (vrk) = 24 tuntia. Aamulla 4.00 / 8.00 / 9.15 / 10.20 ↔ illalla 16.00 / 20.00 / 21.15 / 22.20 — official times use the 24-hour clock, but speech uses 1–12.</div>
${dlg('Hauska nähdä taas! · nice to see you again',[
[null,'Hei, Mirja.'],
[null,'Terve, Matti. Hauska nähdä taas!'],
[null,'Niin on. Hei, paljonko kello on?','Yes it is. Hey, what time is it?'],
[null,'Se on puoli viisi.','It’s half past four (4:30).'],
[null,'Ahaa. Sitten voin mennä kirjastoon.','Then I can go to the library.'],
[null,'Milloin kirjasto menee kiinni?','When does the library close?'],
[null,'Vasta kello kahdeksan illalla.','Not until 8 in the evening.'],
[null,'No, minäkin tulen. Mennäänkö yhdessä?','I’ll come too. Shall we go together?'],
[null,'Mennään vaan!','Let’s go!']])}`},
{h:'Moneltako? Mihin aikaan? — at what time?',body:`
<p><b>Moneltako</b> and <b>mihin aikaan</b> mean roughly the same as <i>milloin</i> — answer with a clock time: – Moneltako nähdään tiistaina? – Nähdään <b>kello kuusi</b>. · – Mihin aikaan bussi tulee? – Bussi tulee <b>kello puoli kaksi</b>.</p>
${dlg('Keskusteluja',[
[null,'Moi! Tiedätkö, moneltako suomen kurssi alkaa?','…at what time does the Finnish course begin?'],
[null,'Joo. Se alkaa kello 9.'],
[null,'Aha. Kiitos.'],
[null,'Terve! Tiedätkö, mihin aikaan kauppa menee kiinni?','…what time does the shop close?'],
[null,'Luulen, että se menee kiinni kello 6.','I think it closes at 6.'],
[null,'Niinkö? Minä luulin, että kello 9.','Really? I thought at 9.'],
[null,'Niin, mutta tänään on lauantai.','Yes, but today is Saturday.'],
[null,'Ai niin, joo.','Oh right, yeah.']])}
${vgrid([['tiedätkö?','do you know?'],['kurssi','a course'],['alkaa','to begin'],['loppuu','ends'],['aukeaa','opens'],['kauppa','a shop'],['menee kiinni','closes'],['kiinni','shut, closed'],['luulen / luulin','I think / I thought'],['avoinna','open'],['suljettu','closed'],['joo','yeah']])}`},
{h:'Miten teet kysymyksiä? — forming questions',body:`
<p>There are <b>two ways</b> to form a question in Finnish.</p>
<h5 class="heading-sm">A) Kysymyssanoja — question words</h5>
${tbl(null,[
['Kuka?','who — Kuka hän on?'],
['Mikä?','what (with olla) — Mikä sinun nimi on? Mikä päivä tänään on?'],
['Mitä?','what (other verbs) — Mitä kuuluu? Mitä sinä opiskelet? Mitä kieliä sinä puhut?'],
['Minkämaalainen?','what nationality — Minkämaalainen sinä olet?'],
['Missä?','where — Missä sinä asut?'],
['Milloin?','when — Milloin kurssi alkaa? Milloin sinä tulit Suomeen?'],
['Mihin aikaan? / Moneltako?','at what time — Mihin aikaan kurssi alkaa?'],
['Miten?','how — Miten menee? Miten sinun nimi kirjoitetaan?'],
['Miksi?','why — Miksi sinä opiskelet suomea? – Koska… (because…)'],
['Mitä/Paljonko kello on?','what is the time — Se on puoli kolme.'],
['Kuinka monta? / Montako?','how many — Kuinka monta tuntia olet kirjastossa tänään?']])}
<h5 class="heading-sm">B) -ko/-kö suffix on the verb</h5>
${tbl(['Statement','Question','Answer'],[
['Sinä <b>puhut</b> suomea.','<b>Puhutko</b> sinä suomea?','Joo, puhun. / Puhun vähän. / En puhu.'],
['Hän <b>asuu</b> Oulussa.','<b>Asuuko</b> hän Oulussa?','Kyllä. / Ei, hän ei asu Oulussa vaan Helsingissä.'],
['Hän <b>on</b> puolalainen.','<b>Onko</b> hän puolalainen?','Joo, hän on. / Ei, hän ei ole puolalainen vaan ranskalainen.']])}`},
{h:'Verbien taivutus — conjugation (type 1 + others)',body:`
${tbl(['Person','puhua (speak)','rakastaa (love)','kysyä (ask)'],[
['minä','puhu-<b>n</b>','rakasta-<b>n</b>','kysy-<b>n</b>'],
['sinä','puhu-<b>t</b>','rakasta-<b>t</b>','kysy-<b>t</b>'],
['hän','puhu-<b>u</b>','rakasta-<b>a</b>','kysy-<b>y</b>'],
['me','puhu-<b>mme</b>','rakasta-<b>mme</b>','kysy-<b>mme</b>'],
['te','puhu-<b>tte</b>','rakasta-<b>tte</b>','kysy-<b>tte</b>'],
['he','puhu-<b>vat</b>','rakasta-<b>vat</b>','kysy-<b>vät</b>']])}
<p class="body-sm">Same pattern: asua (live), ostaa (buy), katsoa (watch), lukea (read), istua (sit), maksaa (pay), laulaa (sing), tanssia (dance), nauraa (laugh).</p>
<h5 class="heading-sm">Negative: en/et/ei/emme/ette/eivät + verb stem</h5>
<p class="body-sm">minä <b>en puhu</b> · sinä <b>et puhu</b> · hän <b>ei puhu</b> · me <b>emme puhu</b> · te <b>ette puhu</b> · he <b>eivät puhu</b></p>
<h5 class="heading-sm">Muita verbejä — other types</h5>
${tbl(['Person','juoda (2) drink','opiskella (3) study','haluta (4) want','tarvita (5) need'],[
['minä','juo-n','opiskele-n','halua-n','tarvitse-n'],
['sinä','juo-t','opiskele-t','halua-t','tarvitse-t'],
['hän','juo','opiskele-e','halua-a','tarvitse-e'],
['me','juo-mme','opiskele-mme','halua-mme','tarvitse-mme'],
['te','juo-tte','opiskele-tte','halua-tte','tarvitse-tte'],
['he','juo-vat','opiskele-vat','halua-vat','tarvitse-vat']])}`}
],
practice:[
{id:'p4a',title:'Days & the calendar (live — uses today’s real date)',type:'daygen'},
{id:'p4b',title:'Clock trainer — Paljonko kello on?',type:'clockgen'},
{id:'p4c',title:'Aukioloajat — opening hours (read & answer)',intro:'Kirjasto: auki Ma–pe 9–19, La 10–15, Su suljettu · Ruokakauppa: Ma–pe 7–22, La 8–22, Su 8–20 · Kahvila Kuppila: Ma–pe 10–20, La 12–20, Su 12–18 (kahvi 1,20 €, tee 0,90 €) · Opiskelija-bileet: Pe klo 22 Kaarle-baarissa',type:'mc',items:[
 {q:'Moneltako kirjasto aukeaa arkisin?',o:['kello 9','kello 10','kello 7','kello 12'],a:0},
 {q:'Onko kirjasto auki sunnuntaina?',o:['Ei ole, se on suljettu.','On, kello 10–15.','On, koko päivän.','On, illalla.'],a:0},
 {q:'Moneltako kirjasto menee kiinni tiistaina?',o:['kello 19','kello 15','kello 22','kello 9'],a:0},
 {q:'Moneltako kauppa menee kiinni lauantaina?',o:['kello 22','kello 20','kello 18','kello 21'],a:0},
 {q:'Moneltako kauppa aukeaa sunnuntaina?',o:['kello 8','kello 7','kello 10','se on suljettu'],a:0},
 {q:'Mikä päivä opiskelija-bileet on?',o:['perjantaina','lauantaina','maanantaina','sunnuntaina'],a:0},
 {q:'Paljonko kahvi maksaa Kuppilassa?',o:['1,20 €','0,90 €','2,20 €','1,90 €'],a:0}]},
{id:'p4d',title:'Kirjoita oikea verbimuoto — conjugate',type:'type',items:[
 {q:'Me ___ Oulussa. (ASUA)',a:['asumme'],show:'asumme'},
 {q:'Mary ___ ranskaa. (PUHUA)',a:['puhuu'],show:'puhuu'},
 {q:'Sinä ___ televisiota illalla. (KATSOA = to watch)',a:['katsot'],show:'katsot'},
 {q:'Minä ___ suklaata. (RAKASTAA = to love)',a:['rakastan'],show:'rakastan'},
 {q:'Leena ___ opiskelija. (OLLA)',a:['on'],show:'on'},
 {q:'Matti ___ historiaa. (LUKEA = to read)',a:['lukee'],show:'lukee'},
 {q:'Minä ___ luennolla. (OLLA)',a:['olen'],show:'olen'},
 {q:'Me ___ vähän suomea. (PUHUA)',a:['puhumme'],show:'puhumme'},
 {q:'Me ___ kirjastossa. (ISTUA = to sit)',a:['istumme'],show:'istumme'},
 {q:'He ___ kahvia ja pullaa. (OSTAA)',a:['ostavat'],show:'ostavat'},
 {q:'Minä ___ pankkikortilla. (MAKSAA)',a:['maksan'],show:'maksan'},
 {q:'Te ___ karaokea baarissa. (LAULAA = to sing)',a:['laulatte'],show:'laulatte'}]},
{id:'p4e',title:'Kirjoita negatiivinen lause — make it negative',type:'type',items:[
 {q:'Minä opiskelen Helsingissä. → Minä ___ Helsingissä.',a:['en opiskele'],show:'en opiskele'},
 {q:'Sinä asut Helsingissä. → Sinä ___ Helsingissä.',a:['et asu'],show:'et asu'},
 {q:'Viktor on suomalainen. → Viktor ___ suomalainen.',a:['ei ole'],show:'ei ole'},
 {q:'Me opiskelemme biologiaa. → Me ___ biologiaa.',a:['emme opiskele'],show:'emme opiskele'},
 {q:'Te menette elokuviin. → Te ___ elokuviin.',a:['ette mene'],show:'ette mene'},
 {q:'He käyvät kaupassa. → He ___ kaupassa.',a:['eivät käy'],show:'eivät käy'}]},
{id:'p4f',title:'Tee kysymyksiä — add the question word',type:'type',items:[
 {q:'___ elokuva alkaa? (at what time)',a:['moneltako','mihin aikaan','milloin'],show:'Moneltako / Mihin aikaan / Milloin'},
 {q:'___ sinun nimi kirjoitetaan?',a:['miten'],show:'Miten'},
 {q:'___ sinä olet? (nationality)',a:['minkämaalainen'],show:'Minkämaalainen'},
 {q:'___ sinä opiskelet? — Biologiaa.',a:['mitä'],show:'Mitä'},
 {q:'___ sinun nimi on?',a:['mikä'],show:'Mikä'},
 {q:'___ kirjasto on? — Se on tuolla.',a:['missä'],show:'Missä'},
 {q:'___ kuuluu?',a:['mitä','mitäs'],show:'Mitä(s)'},
 {q:'___ päivä tänään on?',a:['mikä'],show:'Mikä'},
 {q:'___ kieliä sinä puhut?',a:['mitä'],show:'Mitä'}]},
{id:'p4g',title:'Tee -ko/-kö-kysymys',type:'type',items:[
 {q:'___ sinä Oulussa? (ASUA)',a:['asutko'],show:'Asutko'},
 {q:'___ Anita venäjää? (PUHUA)',a:['puhuuko'],show:'Puhuuko'},
 {q:'___ minä myöhässä? (OLLA — myöhässä = late)',a:['olenko'],show:'Olenko'},
 {q:'___ te kahvia? (OSTAA)',a:['ostatteko'],show:'Ostatteko'},
 {q:'___ sinä hyvin? (TANSSIA)',a:['tanssitko'],show:'Tanssitko'},
 {q:'___ te kortilla? (MAKSAA)',a:['maksatteko'],show:'Maksatteko'},
 {q:'___ sinä? (NAURAA = to laugh)',a:['nauratko'],show:'Nauratko'},
 {q:'___ Alex tutkija? (OLLA)',a:['onko'],show:'Onko'}]},
{id:'p4h',title:'Mixed: question word or -ko/-kö?',type:'type',items:[
 {q:'___ menee? — Ihan hyvin.',a:['miten'],show:'Miten'},
 {q:'___ sinä asut? — Oulussa, Tapiontiellä.',a:['missä'],show:'Missä'},
 {q:'___ sinä opiskelija? — Kyllä.',a:['oletko'],show:'Oletko'},
 {q:'___ kello on nyt? — Kello on puoli yksi.',a:['paljonko','mitä'],show:'Paljonko / Mitä'},
 {q:'___ on Suomen presidentti? — Sauli Niinistö.',a:['kuka'],show:'Kuka'},
 {q:'___ Elisa on? — Hän on suomalainen.',a:['minkämaalainen'],show:'Minkämaalainen'},
 {q:'___ päivä tänään on? — Tänään on tiistai.',a:['mikä'],show:'Mikä'},
 {q:'___ bussi lähtee? — Se lähtee viisi yli kaksi.',a:['milloin','moneltako','mihin aikaan'],show:'Milloin / Moneltako'},
 {q:'___ sinä Lontoossa? — Ei, minä asun Oulussa.',a:['asutko'],show:'Asutko'}]},
{id:'p4i',title:'Alleviivaa aikasanat — spot the time words',intro:'Which of these are time words (aikasanat)?',type:'mc',items:[
 {q:'Is "huomenna" a time word?',o:['Yes — tomorrow','No — it means food'],a:0},
 {q:'Is "ruoka" a time word?',o:['No — it means food','Yes — it means noon'],a:0},
 {q:'Is "keskiviikko" a time word?',o:['Yes — Wednesday','No — it is a place'],a:0},
 {q:'Is "olut" a time word?',o:['No — it means beer','Yes — it means evening'],a:0},
 {q:'Is "heti" a time word?',o:['Yes — immediately','No — it means slowly'],a:0},
 {q:'Is "eilen" a time word?',o:['Yes — yesterday','No — it means a book'],a:0},
 {q:'Is "kirja" a time word?',o:['No — it means a book','Yes — it means an hour'],a:0},
 {q:'Is "moneltako" a time word?',o:['Yes — at what time','No — how many people'],a:0},
 {q:'Is "kello" a time word?',o:['Yes — clock / o’clock','No — it means yellow'],a:0},
 {q:'Is "tiistai" a time word?',o:['Yes — Tuesday','No — it is a name'],a:0}]}
],
quiz:[
 {t:'gen',g:'day'},
 {t:'gen',g:'clock'},
 {t:'gen',g:'clock'},
 {t:'mc',q:'"puoli viisi" is…',o:['4:30','5:30','5:15','4:45'],a:0},
 {t:'mc',q:'"varttia yli kymmenen" is…',o:['10:15','10:45','9:45','10:04'],a:0},
 {t:'type',q:'"Wednesday" in Finnish:',a:['keskiviikko'],show:'keskiviikko'},
 {t:'type',q:'On Friday = perjantai + ___ ?',a:['perjantaina','na','-na'],show:'perjantaina'},
 {t:'type',q:'Conjugate: he ___ (PUHUA)',a:['puhuvat'],show:'puhuvat'},
 {t:'type',q:'Negative: me ___ (PUHUA)',a:['emme puhu'],show:'emme puhu'},
 {t:'type',q:'Make a question: sinä asut → ___ sinä?',a:['asutko'],show:'Asutko'},
 {t:'mc',q:'"Milloin kirjasto menee kiinni?" asks…',o:['when the library closes','when the library opens','where the library is','if the library is big'],a:0},
 {t:'mc',q:'"Mennäänkö yhdessä?" means…',o:['Shall we go together?','Are we lost?','Do we know each other?','Is it already time?'],a:0},
 {t:'mc',q:'"vasta kello kahdeksan" means…',o:['not until eight o’clock','exactly eight','already at eight','just before eight'],a:0},
 {t:'mc',q:'Which question word goes with "…sinä opiskelet suomea? – Koska se on kaunis kieli."',o:['Miksi','Missä','Mikä','Kuka'],a:0}
]},

/* ============ MODULE 5 ============ */
{id:'m5', num:'5', title:'Haluaisin kahvia', sub:'Polite requests · food & drink · how many · the partitive case',
learn:[
{h:'Pyytäminen — polite requests with -isi-',body:`
<div class="rule-box">Polite requests use the marker <b>-isi-</b> (the conditional): haluan (I want) → halua<b>isi</b>n (I would like) · voin (I can) → vo<b>isi</b>n (I could) · saan (I get) → sa<b>isi</b>nko? (could I get?)</div>
${dlg('Kahvilla · at coffee',[
[null,'Haluaisitko kahvia?','Would you like some coffee?'],
[null,'Ei kiitos. En juo kahvia, mutta voisin ottaa teetä.','No thanks. I don’t drink coffee, but I could take tea.'],
[null,'No niin, tässä on teetä, ole hyvä.','Here is tea, here you are.'],
[null,'Kiitos.'],
[null,'Otatko sokeria?','Do you take sugar?'],
[null,'Joo, kiitos.'],
[null,'Entä maitoa?','And milk?'],
[null,'Ei kiitos.'],
[null,'Haluaisitko kakkua?','Would you like some cake?'],
[null,'No, ihan vähän, kiitti.','Well, just a little, thanks.']])}
<p class="body-sm">Also: ”Haluaisitteko kahvia vai teetä?” — ”Minä haluaisin teetä. Haluaisin myös kakkua.” — ”Olkaa hyvät ja ottakaa kakkua!” — ”Hei hei, ja kiitos kahvista!”</p>`},
{h:'Ruokasanastoa — food vocabulary',body:`
<p>Mikä tämä on? — Se on kurkku. / Se on porkkana. · Onko tämä persikka? — Ei, se on ananas.</p>
<h5 class="heading-sm">Hedelmiä ja marjoja — fruits & berries</h5>
${vgrid([['mansikka','strawberry'],['kirsikka','cherry'],['vadelma','raspberry'],['mustikka','blueberry'],['viinirypäleet','grapes'],['appelsiini','orange'],['omena','apple'],['ananas','pineapple'],['banaani','banana'],['vesimeloni / hunajameloni','watermelon / honeydew'],['sitruuna','lemon'],['persikka','peach'],['päärynä','pear']])}
<h5 class="heading-sm">Kasviksia — vegetables</h5>
${vgrid([['peruna','potato'],['kukkakaali','cauliflower'],['tomaatti','tomato'],['sipuli','onion'],['kurkku','cucumber'],['porkkana','carrot'],['paprika','bell pepper']])}
<h5 class="heading-sm">Ruokia — food</h5>
${vgrid([['kala','fish'],['kana','chicken'],['kinkku','ham'],['liha / jauheliha','meat / minced meat'],['riisi','rice'],['makaroni / spagetti','pasta'],['kananmuna','egg'],['juusto','cheese'],['makkara','sausage'],['leipä / sämpylä','bread / bread roll']])}
<h5 class="heading-sm">Juomia — drinks</h5>
${vgrid([['vesi (vettä)','water'],['kivennäisvesi / vissy','mineral water'],['maito (kevyt / rasvaton)','milk (light / fat-free)'],['piimä','sour milk'],['mehu','juice'],['limukka / limsa','soft drink'],['kahvi','coffee'],['tee','tea'],['olut','beer'],['siideri','cider'],['viini','wine']])}
<h5 class="heading-sm">Ruokalajeja & jälkiruokia — meals & desserts</h5>
${vgrid([['keitto','soup'],['salaatti','salad'],['pizza','pizza'],['hampurilainen','hamburger'],['pihvi ja ranskalaiset (perunat)','steak and fries'],['pasta ja kastike','pasta and sauce'],['paistettu lohi ja perunamuusi','fried salmon & mashed potatoes'],['kakku','cake'],['piirakka','pie'],['jäätelö','ice cream'],['keksi','biscuit'],['pulla','bun'],['karkki','candy']])}
<div class="note">Mikä sinun <b>lempiruoka</b> on? (favorite food) — Minun lempiruoka on pizza / perunat ja lihapullat!</div>`},
{h:'Pizzeria Maria — ordering',body:`
${tbl(['Pizza','Täytteet','Hinta'],[
['1. Opera','tonnikalaa, kinkkua (tuna, ham)','6,70 €'],
['2. Quattro Stagioni','kinkkua, herkkusieniä, katkarapuja, tonnikalaa (mushrooms, prawns)','7,90 €'],
['3. Capricciosa','kinkkua, herkkusieniä','6,70 €'],
['4. Frutti di Mare','tonnikalaa, katkarapuja, simpukoita (clams)','7,30 €'],
['5. Tropicana','kinkkua, sinihomejuustoa, ananasta (blue cheese)','6,80 €'],
['6. Vegetariana','paprikaa, herkkusieniä, oliiveja','6,60 €'],
['7. Pepperoni','tonnikalaa, pepperonimakkaraa','6,70 €'],
['8. Fetapizza','fetajuustoa, paprikaa, sipulia, oliiveja','7,90 €'],
['Lisätäytteet','extra toppings','0,80 €']])}
${dlg('Pizzeriassa',[
[null,'Hei! Mitä saisi olla?','What would you like (to have)?'],
[null,'Yksi Capricciosa. Ja saisinko siihen lisäksi paprikaa?','…and could I get paprika on it in addition?'],
[null,'Totta kai.','Of course.'],
[null,'Paljonko se maksaa?','How much does it cost?'],
[null,'Se maksaa 6,70 € ja lisäksi paprika on 80 senttiä. Se on siis 7,50 € yhteensä.','…so 7.50 € altogether.'],
[null,'Tässä on 8 €!'],
[null,'Kiitos, tässä 50 senttiä takaisin.','…50 cents change.'],
[null,'Hetki vain, kohta pizzasi on valmis.','Just a moment, your pizza will be ready soon.'],
[null,'Tässä, ole hyvä!','Here you are!'],
[null,'Kiitos, ja hei hei!'],
[null,'Hei hei ja mukavaa päivän jatkoa!','…have a nice rest of the day!']])}
${vgrid([['Mitä saisi olla?','What would you like?'],['saisinko','could I get'],['siihen','into/onto it'],['lisäksi','in addition'],['totta kai','of course'],['yhteensä','altogether'],['takaisin','back (change)'],['hetki vain','just a moment'],['kohta','soon'],['valmis','ready']])}`},
{h:'Montako? Kuinka monta? — how many?',body:`
<p>Montako kirjaa tässä on? — Tässä on <b>yksi kirja</b>. / Tässä on <b>kolme kirjaa</b>. · yksi kynä → kaksi kynä<b>ä</b> · yksi sohva → kaksi sohva<b>a</b> · Kuinka monta autoa? → kolme auto<b>a</b> · Montako tietokonetta? → neljä tietokone<b>tta</b></p>
<div class="note">– Kuinka monta kertaa käyt keskustassa viikossa? – Ehkä 3 kertaa. (How many times do you go downtown per week? — Maybe 3 times.)</div>`},
{h:'Partitiivi — the partitive case',body:`
<p>The partitive is one of the most used cases in Finnish. You recognize it from the suffixes <b>-a/-ä, -ta/-tä, -tta/-ttä</b>. Which suffix depends on the word:</p>
${tbl(['1 (base)','more than 1 / some'],[
['1 päärynä','2 päärynä<b>ä</b>'],['1 sipuli','puoli sipuli<b>a</b>'],['1 sormi (finger)','5 sorm<b>ea</b>'],['1 televisio','3 televisio<b>ta</b>'],['1 mies (man)','pari mies<b>tä</b>'],['1 vieras (guest)','neljä vieras<b>ta</b>'],['1 nainen (woman)','monta nais<b>ta</b>'],['1 huone (room)','kolme huone<b>tta</b>'],['1 perhe (family)','monta perhe<b>ttä</b>']])}
<h5 class="heading-sm">When do you need the partitive?</h5>
${tbl(null,[
['1. Greetings & wishes','Hyvä<b>ä</b> päivä<b>ä</b>! · Hauska<b>a</b> matka<b>a</b>!'],
['2. Answers to "mitä"','– Mitä kuuluu? – Hyvä<b>ä</b>.'],
['3. Numbers > 1 (+ pari, puoli, monta)','kaksi pizza<b>a</b> · viisi ananas<b>ta</b>'],
['4. Material / uncountable amounts','leipä<b>ä</b>, olut<b>ta</b>, kahvi<b>a</b>, maito<b>a</b>'],
['5. Object of an ongoing action','Katson televisio<b>ta</b>. — I’m watching TV.']])}`}
],
practice:[
{id:'p5a',title:'Ruokasanat — food words (FI → EN)',type:'mc',items:[
 {q:'"mansikka" is…',o:['strawberry','blueberry','cherry','raspberry'],a:0},
 {q:'"mustikka" is…',o:['blueberry','blackberry','strawberry','plum'],a:0},
 {q:'"omena" is…',o:['apple','orange','pear','peach'],a:0},
 {q:'"päärynä" is…',o:['pear','peach','pineapple','potato'],a:0},
 {q:'"peruna" is…',o:['potato','pear','carrot','onion'],a:0},
 {q:'"sipuli" is…',o:['onion','garlic','cucumber','cauliflower'],a:0},
 {q:'"kurkku" is…',o:['cucumber','carrot','pumpkin','corn'],a:0},
 {q:'"kana" is…',o:['chicken','fish','ham','egg'],a:0},
 {q:'"kananmuna" is…',o:['egg','chicken soup','sausage','cheese'],a:0},
 {q:'"juusto" is…',o:['cheese','juice','bread','butter'],a:0},
 {q:'"leipä" is…',o:['bread','milk','cake','soup'],a:0},
 {q:'"maito" is…',o:['milk','sour milk','juice','water'],a:0},
 {q:'"mehu" is…',o:['juice','soft drink','beer','tea'],a:0},
 {q:'"jäätelö" is…',o:['ice cream','cake','candy','biscuit'],a:0},
 {q:'"keitto" is…',o:['soup','salad','sauce','steak'],a:0},
 {q:'"pulla" is…',o:['a (sweet) bun','a pie','a bottle','a bull'],a:0}]},
{id:'p5b',title:'Match: drinks & desserts',type:'match',pairs:[['vesi','water'],['kahvi','coffee'],['tee','tea'],['olut','beer'],['viini','wine'],['siideri','cider'],['piimä','sour milk'],['limsa','soft drink'],['kakku','cake'],['piirakka','pie'],['keksi','biscuit'],['karkki','candy']]},
{id:'p5c',title:'Harjoittele partitiivia — numbers + partitive',type:'type',items:[
 {q:'viisi ___ (luento = a lecture)',a:['luentoa'],show:'luentoa'},
 {q:'kolme ___ (huone = a room)',a:['huonetta'],show:'huonetta'},
 {q:'monta ___ (puhelin)',a:['puhelinta'],show:'puhelinta'},
 {q:'puoli ___ (omena)',a:['omenaa'],show:'omenaa'},
 {q:'neljä ___ (mies)',a:['miestä'],show:'miestä'},
 {q:'kymmenen ___ (museo)',a:['museota'],show:'museota'},
 {q:'seitsemäntoista ___ (maa = a country)',a:['maata'],show:'maata'},
 {q:'2 ___ (osoite = an address)',a:['osoitetta'],show:'osoitetta'},
 {q:'4 ___ (bussi)',a:['bussia'],show:'bussia'},
 {q:'8 ___ (aste = a degree)',a:['astetta'],show:'astetta'},
 {q:'3 ___ (avain = a key)',a:['avainta'],show:'avainta'},
 {q:'11 ___ (mansikka)',a:['mansikkaa'],show:'mansikkaa'},
 {q:'9 ___ (opiskelija)',a:['opiskelijaa'],show:'opiskelijaa'}]},
{id:'p5d',title:'Täydennä partitiivissa — fill in the partitive',type:'type',items:[
 {q:'Minä juon aamulla ___ (maito).',a:['maitoa'],show:'maitoa'},
 {q:'…ja syön ___ (leipä).',a:['leipää'],show:'leipää'},
 {q:'Puhutko sinä ___ (ranska)?',a:['ranskaa'],show:'ranskaa'},
 {q:'Suomen kurssilla me puhumme tietysti ___ (suomi)!',a:['suomea'],show:'suomea'},
 {q:'Minä rakastan ___ (kahvi)…',a:['kahvia'],show:'kahvia'},
 {q:'…ja ___ (suklaa).',a:['suklaata'],show:'suklaata'},
 {q:'Illalla katsomme usein ___ (televisio).',a:['televisiota'],show:'televisiota'},
 {q:'Opiskeletko sinä ___ (kasvatustiede = education)?',a:['kasvatustiedettä'],show:'kasvatustiedettä'},
 {q:'Ei, minä opiskelen ___ (rahoitus = finance)…',a:['rahoitusta'],show:'rahoitusta'},
 {q:'…ja ___ (englanti).',a:['englantia'],show:'englantia'},
 {q:'Minun ystävä opiskelee ___ (markkinointi = marketing).',a:['markkinointia'],show:'markkinointia'}]},
{id:'p5e',title:'Pizzeria Maria — reading the menu',type:'mc',items:[
 {q:'Paljonko Vegetariana maksaa?',o:['6,60 €','6,70 €','7,90 €','6,80 €'],a:0},
 {q:'Capricciosa + yksi lisätäyte = ?',o:['7,50 €','6,70 €','7,90 €','8,00 €'],a:0},
 {q:'Mitä täytteitä Frutti di Maressa on?',o:['tonnikalaa, katkarapuja, simpukoita','kinkkua ja ananasta','fetajuustoa ja sipulia','pepperonia ja oliiveja'],a:0},
 {q:'Missä pizzassa on ananasta?',o:['Tropicana','Opera','Pepperoni','Fetapizza'],a:0},
 {q:'"Mitä saisi olla?" means…',o:['What would you like?','What is your name?','How is it going?','Anything else?'],a:0},
 {q:'You pay 8 € for a 7,50 € pizza. The seller says: "Tässä ___ takaisin."',o:['50 senttiä','yksi euro','kaksi euroa','80 senttiä'],a:0},
 {q:'Kaksi Opera-pizzaa maksaa yhteensä…',o:['13,40 €','12,40 €','13,20 €','14,40 €'],a:0},
 {q:'"kohta pizzasi on valmis" means…',o:['your pizza will be ready soon','your pizza is cold','the pizzeria closes soon','your pizza is expensive'],a:0}]},
{id:'p5f',title:'Polite requests with -isi-',type:'mc',items:[
 {q:'haluan → I would like = ?',o:['haluaisin','halusin','haluan','haluatko'],a:0},
 {q:'voin → I could = ?',o:['voisin','voin','voitko','voisitko'],a:0},
 {q:'"Saisinko kahvia?" means…',o:['Could I get some coffee?','Do I have coffee?','Did I drink coffee?','Should I make coffee?'],a:0},
 {q:'"Haluaisitko kakkua?" means…',o:['Would you like some cake?','Do you hate cake?','Did you bake a cake?','Is the cake ready?'],a:0},
 {q:'Polite way to order tea:',o:['Haluaisin teetä, kiitos.','Anna tee!','Tee on huono.','Missä tee on?'],a:0},
 {q:'"En juo kahvia, mutta voisin ottaa teetä" means…',o:['I don’t drink coffee, but I could take tea','I drink coffee and tea','I never drink tea','I would like coffee with tea'],a:0}]}
],
quiz:[
 {t:'type',q:'"strawberry" in Finnish:',a:['mansikka'],show:'mansikka'},
 {t:'type',q:'"cheese" in Finnish:',a:['juusto'],show:'juusto'},
 {t:'type',q:'"milk" in Finnish:',a:['maito'],show:'maito'},
 {t:'mc',q:'"makkara" is…',o:['sausage','pasta','carrot','mushroom'],a:0},
 {t:'mc',q:'"kivennäisvesi" is…',o:['mineral water','still water','lemonade','sour milk'],a:0},
 {t:'type',q:'kaksi ___ (pizza)',a:['pizzaa'],show:'pizzaa'},
 {t:'type',q:'viisi ___ (ananas)',a:['ananasta'],show:'ananasta'},
 {t:'type',q:'monta ___ (perhe = family)',a:['perhettä'],show:'perhettä'},
 {t:'mc',q:'Why is it "Hyvää päivää" and not "Hyvä päivä"?',o:['Greetings and wishes take the partitive','It is plural','It is a spoken-language form','It is the genitive case'],a:0},
 {t:'mc',q:'"Katson televisiota" uses the partitive because…',o:['the action is ongoing (object of the process)','television is plural','katsoa is irregular','of vowel harmony'],a:0},
 {t:'mc',q:'"lisätäytteet" on a pizza menu are…',o:['extra toppings','side salads','large sizes','free drinks'],a:0},
 {t:'mc',q:'"yhteensä" means…',o:['altogether','separately','again','immediately'],a:0},
 {t:'type',q:'"I would like coffee" = "___ kahvia."',a:['haluaisin','minä haluaisin'],show:'Haluaisin'},
 {t:'mc',q:'"Otatko sokeria?" means…',o:['Do you take sugar?','Do you want salt?','Is it sweet?','Will you pay cash?'],a:0}
]},

/* ============ MODULE 6 ============ */
{id:'m6', num:'6', title:'Missä on…?', sub:'Location endings -ssa/-ssä & -lla/-llä · käydä · university vocabulary',
learn:[
{h:'Missä? — where? (-ssa/-ssä vs -lla/-llä)',body:`
<div class="rule-box">To answer <b>"Missä?"</b> (where is something/somebody):<br>
<b>-SSA/-SSÄ</b> = <i>in</i> → inside a place, a closed place or location (talo<b>ssa</b>, auto<b>ssa</b>)<br>
<b>-LLA/-LLÄ</b> = <i>on, at, by</i> → outside, an open-area place (tori<b>lla</b>, kadu<b>lla</b>)</div>
${dlg('Missä minun matkalaukku on? · where is my suitcase?',[
[null,'Missä minun matkalaukku on?'],
[null,'Se on autossa!','It is in the car!'],
[null,'Entä missä auto on?','And where is the car?'],
[null,'Se on kadulla.','It is on the street.']])}
${tbl(['Question','Answer'],[
['Missä Pekka on?','Hän on koulu<b>ssa</b>.'],
['Onko Liisa kaupa<b>ssa</b>?','Ei, hän on tori<b>lla</b>.'],
['Tiedätkö, missä bussipysäkki on?','Joo. Se on Isokadu<b>lla</b>.'],
['Opiskeleeko Jukka Jyväskylä<b>ssä</b> vai Oulu<b>ssa</b>?','Hän opiskelee Jyväskylä<b>ssä</b>.'],
['Missä sinä tapaat Lauran?','Tapaan hänet rautatieasema<b>lla</b>.'],
['Ovatko lapset sisä<b>llä</b> vai ulko<b>na</b>?','He ovat ulkona. He leikkivät piha<b>lla</b>.']])}
<h5 class="heading-sm">Lisää esimerkkejä — more places</h5>
${vgrid([['talossa / kotona','in the house / at home'],['konsertissa','at a concert'],['kylpyhuoneessa','in the bathroom'],['ravintolassa','in a restaurant'],['pihalla','in the yard'],['kenkäkaupassa','in the shoe shop'],['baarissa','in a bar'],['torilla','at the marketplace'],['koulussa','in school'],['bussipysäkillä','at the bus stop'],['elokuvissa','at the movies'],['hammaslääkärissä','at the dentist’s'],['lääkärissä','at the doctor’s'],['rautatieasemalla / juna-asemalla','at the railway station']])}`},
{h:'KÄYDÄ — to visit (go & come back)',body:`
${dlg('Mitä sinä teet tänään? · what are you doing today?',[
[null,'Mitä sinä teet tänään?'],
[null,'Minä syön ensin ja käyn sitten kirjastossa.','I’ll eat first and then visit the library.'],
[null,'Illalla käyn kaupassa. Käytkö sinä saunassa tänään?','In the evening I’ll go to the shop. Are you going to sauna today?'],
[null,'Joo, käyn.']])}
<div class="rule-box">The verb <b>käydä</b> includes the idea of <i>going and coming back</i>, and it always requires <b>-ssa/-ssä</b> or <b>-lla/-llä</b>: Käyn kaupa<b>ssa</b> / posti<b>ssa</b> / piha<b>lla</b> / kioski<b>lla</b> / saunassa / ravintolassa / konsertissa / baarissa / elokuvissa.</div>
${tbl(null,[['minä käy<b>n</b>','me käy<b>mme</b>'],['sinä käy<b>t</b>','te käy<b>tte</b>'],['hän käy','he käy<b>vät</b>']])}`},
{h:'Henkilötiedot — personal information',body:vgrid([['etunimi','first name'],['sukunimi','surname'],['henkilötunnus','personal identity code'],['osoite','address'],['postinumero','postcode'],['puhelinnumero','phone number'],['sähköposti','email']])},
{h:'Opiskelusanastoa — university vocabulary',body:`
${vgrid([['opiskella','to study'],['opiskelu','studying'],['opiskelija','a student'],['opettaja','a teacher'],['tutkija','a researcher'],['harjoittelija','a trainee'],['yliopisto','a university'],['tiedekunta','a faculty'],['pääaine','a major'],['sivuaine','a minor'],['tutkinto','a degree'],['kandidaatintutkinto','bachelor’s degree'],['maisterintutkinto','master’s degree'],['tohtorintutkinto','doctoral degree'],['kansainvälinen','international'],['vaihto-opiskelija','exchange student'],['maisteriopiskelija','master’s student'],['tohtoriopiskelija','doctoral student'],['maisteriohjelma','master’s programme'],['tutkinto-ohjelma','degree programme'],['koulutusala','field of study']])}
<h5 class="heading-sm">Tiedekunnat — faculties (University of Oulu)</h5>
${vgrid([['Biokemian ja molekyylilääketieteen tiedekunta','Faculty of Biochemistry and Molecular Medicine'],['Humanistinen tiedekunta','Faculty of Humanities'],['Kaivannaisalan tiedekunta','Oulu Mining School'],['Kasvatustieteiden tiedekunta','Faculty of Education'],['Luonnontieteellinen tiedekunta','Faculty of Science'],['Lääketieteellinen tiedekunta','Faculty of Medicine'],['Kauppakorkeakoulu','Oulu Business School'],['Teknillinen tiedekunta','Faculty of Technology'],['Tieto- ja sähkötekniikan tiedekunta','Faculty of Information Technology and Electrical Engineering'],['Kieli- ja viestintäkoulutus','Languages and Communication'],['Täydentävien opintojen keskus','Extension School']])}`}
],
practice:[
{id:'p6a',title:'-ssa/-ssä or -lla/-llä?',type:'mc',items:[
 {q:'Pekka on koulu___',o:['-ssa (koulussa)','-lla','-llä','-ssä'],a:0},
 {q:'Liisa on tori___',o:['-lla (torilla)','-ssa','-ssä','-llä'],a:0},
 {q:'Bussipysäkki on Isokadu___',o:['-lla (Isokadulla)','-ssa','-ssä','-na'],a:0},
 {q:'Matkalaukku on auto___',o:['-ssa (autossa)','-lla','-llä','-ssä'],a:0},
 {q:'Lapset leikkivät piha___',o:['-lla (pihalla)','-ssa','-ssä','-llä'],a:0},
 {q:'Tapaan hänet rautatieasema___',o:['-lla (rautatieasemalla)','-ssa','-ssä','-lle'],a:0},
 {q:'Jukka opiskelee Jyväskylä___',o:['-ssä (Jyväskylässä)','-ssa','-llä','-lla'],a:0},
 {q:'Hän on kylpyhuonee___',o:['-ssa (kylpyhuoneessa)','-lla','-llä','-ssä'],a:0},
 {q:'Me olemme konserti___',o:['-ssa (konsertissa)','-lla','-llä','-ssä'],a:0},
 {q:'He ovat bussipysäki___',o:['-llä (bussipysäkillä)','-ssä','-ssa','-lla'],a:0}]},
{id:'p6b',title:'Missä? — translate the place',type:'type',items:[
 {q:'at home',a:['kotona'],show:'kotona'},
 {q:'in the restaurant',a:['ravintolassa'],show:'ravintolassa'},
 {q:'at the marketplace',a:['torilla'],show:'torilla'},
 {q:'in a bar',a:['baarissa'],show:'baarissa'},
 {q:'at the movies',a:['elokuvissa'],show:'elokuvissa'},
 {q:'at the doctor’s',a:['lääkärissä'],show:'lääkärissä'},
 {q:'at the dentist’s',a:['hammaslääkärissä'],show:'hammaslääkärissä'},
 {q:'at the railway station',a:['rautatieasemalla','juna-asemalla','junaasemalla'],show:'rautatieasemalla'},
 {q:'in the yard',a:['pihalla'],show:'pihalla'},
 {q:'in the shoe shop',a:['kenkäkaupassa'],show:'kenkäkaupassa'},
 {q:'in school',a:['koulussa'],show:'koulussa'},
 {q:'at the bus stop',a:['bussipysäkillä'],show:'bussipysäkillä'}]},
{id:'p6c',title:'KÄYDÄ — conjugate',type:'type',items:[
 {q:'minä ___ kaupassa',a:['käyn'],show:'käyn'},
 {q:'sinä ___ saunassa',a:['käyt'],show:'käyt'},
 {q:'hän ___ postissa',a:['käy'],show:'käy'},
 {q:'me ___ konsertissa',a:['käymme'],show:'käymme'},
 {q:'te ___ ravintolassa',a:['käytte'],show:'käytte'},
 {q:'he ___ baarissa',a:['käyvät'],show:'käyvät'},
 {q:'Question: ___ sinä saunassa tänään? (KÄYDÄ + -ko/-kö)',a:['käytkö'],show:'Käytkö'},
 {q:'Negative: minä ___ ___ (I don’t visit)',a:['en käy'],show:'en käy'}]},
{id:'p6d',title:'Henkilötiedot — match the form fields',type:'match',pairs:[['etunimi','first name'],['sukunimi','surname'],['henkilötunnus','personal identity code'],['osoite','address'],['postinumero','postcode'],['puhelinnumero','phone number'],['sähköposti','email']]},
{id:'p6e',title:'Yliopistosanat — university words',type:'mc',items:[
 {q:'"pääaine" is…',o:['a major','a minor','a degree','a lecture'],a:0},
 {q:'"sivuaine" is…',o:['a minor','a major','a side job','a faculty'],a:0},
 {q:'"tutkinto" is…',o:['a degree','a researcher','an exam','a course'],a:0},
 {q:'"maisterintutkinto" is…',o:['a master’s degree','a bachelor’s degree','a doctoral degree','a trainee position'],a:0},
 {q:'"harjoittelija" is…',o:['a trainee','a teacher','a professor','an athlete'],a:0},
 {q:'Kauppakorkeakoulu = ?',o:['Oulu Business School','Faculty of Education','Faculty of Medicine','Oulu Mining School'],a:0},
 {q:'Lääketieteellinen tiedekunta = ?',o:['Faculty of Medicine','Faculty of Science','Faculty of Humanities','Faculty of Technology'],a:0},
 {q:'Kasvatustieteiden tiedekunta = ?',o:['Faculty of Education','Faculty of Law','Business School','Extension School'],a:0},
 {q:'"kansainvälinen" means…',o:['international','national','universal','intelligent'],a:0},
 {q:'"vaihto-opiskelija" is…',o:['an exchange student','a part-time student','a graduate','a language teacher'],a:0}]}
],
quiz:[
 {t:'mc',q:'Closed / inside place takes…',o:['-ssa/-ssä','-lla/-llä','-na','-ko/-kö'],a:0},
 {t:'mc',q:'Open area / outside place takes…',o:['-lla/-llä','-ssa/-ssä','-tta/-ttä','-isi-'],a:0},
 {t:'type',q:'"Se on kadu___" (on the street)',a:['kadulla','lla','-lla'],show:'kadulla'},
 {t:'type',q:'"Hän on koulu___" (in school)',a:['koulussa','ssa','-ssa'],show:'koulussa'},
 {t:'mc',q:'"käydä" includes the idea of…',o:['going and coming back','staying forever','walking slowly','running'],a:0},
 {t:'type',q:'käydä: "he ___"',a:['käyvät'],show:'käyvät'},
 {t:'mc',q:'"Käytkö tänään saunassa?" means…',o:['Are you going to sauna today?','Did you clean the sauna?','Is the sauna hot today?','Do you own a sauna?'],a:0},
 {t:'type',q:'"surname" in Finnish:',a:['sukunimi'],show:'sukunimi'},
 {t:'type',q:'"email" in Finnish:',a:['sähköposti'],show:'sähköposti'},
 {t:'mc',q:'"torilla" means…',o:['at the marketplace','in the tower','on Tuesday','in the shop'],a:0},
 {t:'mc',q:'"He ovat ulkona" means…',o:['They are outside','They are abroad','They are upstairs','They are asleep'],a:0},
 {t:'mc',q:'"tiedekunta" is…',o:['a faculty','a science club','a municipality','a library'],a:0}
]}
];

/* ======================================================================== */
/* FLASHCARD DECKS                                                           */
/* ======================================================================== */
var DECKS = [
{id:'d0',title:'0 · Perussanat — pronunciation words',cards:[['tuli','fire'],['tuuli','wind'],['tulli','customs office'],['kala','fish'],['maa','country'],['talo','house'],['loma','holiday'],['hullu','crazy'],['kuu','moon'],['kivi','stone'],['käsi','hand'],['pää','head'],['tämä','this'],['hylly','shelf'],['kynä','pen'],['kukka','flower'],['mato','worm'],['matto','carpet'],['kana','chicken'],['lumi','snow'],['lammas','sheep'],['lippu','ticket / flag'],['lupa','permission'],['passi','passport'],['sade','rain'],['vuosi','year'],['talvi','winter'],['kevät','spring'],['kirja','book'],['äiti','mother'],['yö','night'],['työ','work'],['pyörä','bike'],['koira','dog'],['poika','boy'],['pieni','small'],['kaunis','beautiful'],['aika','time'],['tuoli','chair'],['koulu','school'],['eilen','yesterday'],['heti','immediately'],['tähti','star'],['pöytä','table'],['syödä','to eat'],['uida','to swim'],['muistaa','to remember']]},
{id:'d1',title:'1 · Tervehdykset & paikat — greetings & places',cards:[['Hyvää huomenta!','Good morning!'],['Hyvää päivää!','Good day!'],['Hyvää iltaa!','Good evening!'],['Hyvää yötä!','Good night!'],['Terve! / Moi! / Hei!','Hi!'],['Moro!','Hey! (informal)'],['Hei hei! / Heippa!','Bye-bye!'],['Nähdään!','See you!'],['Näkemiin!','Goodbye (formal)'],['Hyvää viikonloppua!','Have a nice weekend!'],['Tervetuloa!','Welcome!'],['Hauska tutustua','Nice to meet you'],['Hauska tavata','Nice to meet you'],['Mukava nähdä!','Nice to see you!'],['hissi','lift'],['kirjasto','library'],['kirjakauppa','bookshop'],['kahvila','café'],['luentosali','lecture hall'],['käytävä','corridor'],['sisäänkäynti','entrance'],['tiedekunta','faculty'],['ruokala','restaurant / canteen'],['vessa / wc','toilet'],['naulakko','cloakroom'],['ilmoitustaulu','noticeboard'],['AUKI / AVOINNA','open'],['KIINNI / SULJETTU','closed'],['VEDÄ','pull'],['TYÖNNÄ','push'],['VARATTU','occupied / reserved'],['VAPAA','free / vacant'],['RIKKI','broken'],['ULOS','exit'],['KIELLETTY','forbidden'],['SEIS','stop'],['KASSA','cash desk'],['ALE','sale'],['arkisin','on working days']]},
{id:'d2',title:'2 · Kohteliaisuudet — politeness',cards:[['Mitä kuuluu?','How are you?'],['Kiitos, ihan hyvää','Fine, thanks'],['Entä sinulle?','What about you?'],['Eipä erikoista','Nothing special'],['Ei kovin hyvää','Not very good'],['Miten menee?','How is it going?'],['Ihan hyvin','Quite well'],['anteeksi','sorry / excuse me'],['Anteeksi kamalasti!','I’m terribly sorry!'],['Ei se mitään','It does not matter'],['Kiitos (paljon)!','Thank you (very much)!'],['Ole hyvä!','Here you are / you’re welcome'],['Eipä mitään!','Don’t mention it!'],['Ei kestä','You’re welcome'],['En ymmärrä','I don’t understand'],['En kuullut','I didn’t hear'],['Voitko sanoa uudestaan?','Can you repeat?'],['Voitko sanoa hitaasti?','Can you say it slowly?'],['Voitko sanoa englanniksi?','Can you say it in English?'],['Mitä se tarkoittaa?','What does it mean?'],['Se tarkoittaa…','It means…'],['En tiedä','I don’t know'],['En muista','I don’t remember'],['Minun täytyy nyt mennä','I have to go now'],['Soitellaan!','Let’s call each other!'],['on kiire','is busy / in a hurry']]},
{id:'d3',title:'3 · Minä olen — introducing & family',cards:[['nimi','name'],['kotimaa','home country'],['äidinkieli','mother tongue'],['Minkämaalainen sinä olet?','What is your nationality?'],['suomalainen','Finnish'],['ystävä','friend'],['opiskelija','student'],['opettaja','teacher'],['tutkija','researcher'],['pääaine','major (subject)'],['naimisissa','married'],['sinkku','single'],['lapsi','child'],['mies','man / husband'],['vaimo','wife'],['sisko','sister'],['veli','brother'],['isä','dad'],['äiti','mom'],['isoäiti / mummo','grandmother'],['isoisä / vaari','grandfather'],['kissa','cat'],['koira','dog'],['Kuinka vanha sinä olet?','How old are you?'],['vuotta','years (old)'],['puhelinnumero','phone number'],['osoite','address'],['postinumero','postcode'],['halpa','cheap'],['kallis','expensive'],['Otan sen','I’ll take it'],['Kuinka paljon se maksaa?','How much does it cost?'],['reppu','backpack'],['takki','coat'],['laukku','bag'],['sateenvarjo','umbrella'],['hammasharja','toothbrush'],['kännykkä','mobile phone'],['suklaa','chocolate']]},
{id:'d4',title:'4 · Aika & verbit — time & verbs',cards:[['maanantai','Monday'],['tiistai','Tuesday'],['keskiviikko','Wednesday'],['torstai','Thursday'],['perjantai','Friday'],['lauantai','Saturday'],['sunnuntai','Sunday'],['tänään','today'],['huomenna','tomorrow'],['eilen','yesterday'],['ylihuomenna','day after tomorrow'],['toissa päivänä','day before yesterday'],['viikonloppuna','at the weekend'],['tasan','exactly (o’clock)'],['yli','past'],['vaille','to (before the hour)'],['puoli','half (to next hour)'],['vartti','quarter'],['vuorokausi','24 hours (day & night)'],['Milloin?','When?'],['Moneltako? / Mihin aikaan?','At what time?'],['alkaa','to begin'],['loppua','to end'],['aueta (aukeaa)','to open'],['mennä kiinni','to close'],['puhua','to speak'],['asua','to live (somewhere)'],['rakastaa','to love'],['ostaa','to buy'],['kysyä','to ask'],['juoda','to drink'],['opiskella','to study'],['haluta','to want'],['tarvita','to need'],['katsoa','to watch'],['lukea','to read'],['istua','to sit'],['maksaa','to pay / to cost'],['laulaa','to sing'],['tanssia','to dance'],['nauraa','to laugh'],['tulla','to come'],['mennä','to go'],['Miksi?','Why?'],['koska…','because…']]},
{id:'d5',title:'5 · Ruoka & juoma — food & drink',cards:[['mansikka','strawberry'],['mustikka','blueberry'],['kirsikka','cherry'],['vadelma','raspberry'],['omena','apple'],['appelsiini','orange'],['banaani','banana'],['sitruuna','lemon'],['persikka','peach'],['päärynä','pear'],['viinirypäleet','grapes'],['vesimeloni','watermelon'],['peruna','potato'],['tomaatti','tomato'],['kurkku','cucumber'],['sipuli','onion'],['porkkana','carrot'],['kukkakaali','cauliflower'],['kala','fish'],['kana','chicken'],['kinkku','ham'],['liha','meat'],['riisi','rice'],['kananmuna','egg'],['juusto','cheese'],['makkara','sausage'],['leipä','bread'],['sämpylä','bread roll'],['vesi','water'],['maito','milk'],['piimä','sour milk'],['mehu','juice'],['limsa','soft drink'],['kahvi','coffee'],['tee','tea'],['olut','beer'],['siideri','cider'],['viini','wine'],['keitto','soup'],['salaatti','salad'],['hampurilainen','hamburger'],['pihvi','steak'],['ranskalaiset','fries'],['kakku','cake'],['piirakka','pie'],['jäätelö','ice cream'],['keksi','biscuit'],['pulla','bun'],['karkki','candy'],['lempiruoka','favorite food'],['Haluaisin…','I would like…'],['Saisinko…?','Could I get…?'],['yhteensä','altogether'],['valmis','ready']]},
{id:'d6',title:'6 · Paikat & yliopisto — locations & university',cards:[['kotona','at home'],['koulussa','in school'],['kaupassa','in the shop'],['torilla','at the marketplace'],['kadulla','on the street'],['baarissa','in a bar'],['ravintolassa','in a restaurant'],['konsertissa','at a concert'],['elokuvissa','at the movies'],['kirjastossa','in the library'],['saunassa','in the sauna'],['pihalla','in the yard'],['bussipysäkillä','at the bus stop'],['rautatieasemalla','at the railway station'],['lääkärissä','at the doctor’s'],['hammaslääkärissä','at the dentist’s'],['kylpyhuoneessa','in the bathroom'],['sisällä','inside'],['ulkona','outside'],['käydä','to visit (go & come back)'],['etunimi','first name'],['sukunimi','surname'],['henkilötunnus','personal identity code'],['sähköposti','email'],['yliopisto','university'],['tiedekunta','faculty'],['sivuaine','minor (subject)'],['tutkinto','degree'],['kandidaatintutkinto','bachelor’s degree'],['maisterintutkinto','master’s degree'],['tohtorintutkinto','doctoral degree'],['vaihto-opiskelija','exchange student'],['harjoittelija','trainee'],['kansainvälinen','international'],['koulutusala','field of study']]}
];

var COURSE_TASKS = [
 ['t1','Aims and learning strategies (in English) — week 1'],
 ['t2','A sample of your pronunciation (in Finnish)'],
 ['t3','Discussion about Finnish culture (in English)'],
 ['t4','Interview with a pair (in Finnish)']
];

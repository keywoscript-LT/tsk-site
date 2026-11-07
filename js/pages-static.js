/* ===== страницы: о нас / конфиденциальность / условия + меню «Ещё» ===== */
(function(){
const X=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const H=x=>`<h2 class="pg-h2">${x}</h2>`;
const Pp=x=>`<p class="text-[14px] leading-relaxed k-t3 mt-2">${x}</p>`;
const Ul=a=>`<ul class="pg-ul text-[14px] leading-relaxed k-t3 mt-2 grid gap-1.5">${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
const TG='https://t.me/TSKesports';
const tg=(l)=>`<a class="underline kc-cy" href="${TG}" target="_blank" rel="noopener">${l||'@TSKesports'}</a>`;
const lnk=(k,l)=>`<a class="underline kc-cy" href="${TSK_ROOT}${k}/" onclick="go('${k}');return false">${l}</a>`;
const page=(h1,body,upd)=>`<article class="pg pg-doc fd"><div class="pg-hero dk">${typeof L!='undefined'?`<img src="${L}" class="pg-wm" alt="">`:''}<span class="pg-tag">${upd?R('Документ','Document'):'TSK Esports'}</span><h1>${h1}</h1>${upd?`<p>${upd}</p>`:''}</div><div class="pg-body">${body}</div></article>`;
const UPD=()=>R('Редакция от 5 ноября 2026','Last updated: 5 November 2026');

V.about=()=>{
 const T=DB.teams.length,Pl=DB.players.length,M=DB.matches.filter(m=>m.st=='fin').length,
  C=new Set(DB.teams.map(x=>x.country).filter(Boolean)).size,
  st=(v,l)=>`<div class="pg-st"><b>${v}</b><span>${l}</span></div>`,
  won=[...DB.tourn].filter(x=>x.winner).slice(-5).reverse().map(x=>{const w=DB.teams.find(z=>z.id==x.winner);return w?`<li><b>${X(x.name||x.title||'')}</b> — ${X(w.name)}</li>`:''}).join('');
 return page(R('О TSK Esports','About TSK Esports'),
  Pp(R('TSK Esports — международная организация по Brawl Stars. На этом сайте мы ведём рейтинг команд по системе PPS, публикуем расписание и результаты матчей, проводим турниры и помогаем игрокам найти команду.','TSK Esports is an international Brawl Stars organization. On this site we keep a PPS team ranking, publish match schedules and results, run tournaments and help players find a team.'))+
  `<div class="pg-sts grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">${st(T,R('Команд','Teams'))}${st(Pl,R('Игроков','Players'))}${st(M,R('Матчей сыграно','Matches played'))}${st(C,R('Стран','Countries'))}</div>`+
  H(R('Что есть на сайте','What you will find here'))+
  Ul([lnk('rank',R('Рейтинг команд','Team ranking'))+' — '+R('очки PPS, победы, поражения и форма','PPS points, wins, losses and form'),
      lnk('matches',R('Матчи','Matches'))+' — '+R('расписание, live и результаты, прогнозы','schedule, live, results and predictions'),
      lnk('tourn',R('Турниры','Tournaments'))+' — '+R('сетки, группы и победители','brackets, groups and winners'),
      lnk('lfg',R('Поиск команды','Find a team'))+' — '+R('анкеты свободных игроков и набор в составы','free-agent profiles and recruiting teams'),
      lnk('rules',R('Правила','Rules'))+' — '+R('как участвовать в турнирах и вести себя в сообществе','how to take part in tournaments and behave in the community')])+
  (won?H(R('Последние победители турниров','Recent tournament winners'))+`<ul class="text-[14px] leading-relaxed k-t3 mt-2 grid gap-1.5 list-disc pl-5">${won}</ul>`:'')+
  H(R('Связаться с нами','Contact us'))+
  Pp(R('Новости организации, набор в команды и вопросы по турнирам — в нашем Telegram-канале. Партнёрам и спонсорам: напишите туда же, и мы ответим.','Organization news, team recruiting and tournament questions are in our Telegram channel. Partners and sponsors: write to us there and we will reply.'))+
  `<div class="mt-3 flex flex-wrap gap-2"><a class="btn" href="${TG}" target="_blank" rel="noopener">Telegram @TSKesports</a><button class="btn k" onclick="go('lfg')">${R('Найти команду','Find a team')}</button></div>`+
  Pp(R('Сайт не связан с Supercell и не одобрен ею. Brawl Stars — товарный знак Supercell.','This site is not affiliated with or endorsed by Supercell. Brawl Stars is a trademark of Supercell.')));
};

V.privacy=()=>page(R('Политика конфиденциальности','Privacy policy'),
 Pp(R('Эта страница объясняет, какие данные собирает сайт TSK Esports и что с ними происходит. Контакт для вопросов — ','This page explains what data the TSK Esports website collects and what happens to it. Contact for any questions: ')+tg()+'.')+
 H(R('Какие данные мы получаем','What data we receive'))+
 Ul([R('<b>Аккаунт:</b> никнейм и пароль. Email-адреса игроков мы не запрашиваем и не получаем: вход и регистрация работают по нику и паролю через сервис Supabase Auth; пароль хранится в виде хеша, мы его не видим.','<b>Account:</b> nickname and password. We do not ask for or receive players’ email addresses: sign-in and registration work with a nickname and password via Supabase Auth; the password is stored as a hash and we cannot see it.'),
     R('<b>Профиль игрока или команды:</b> никнейм, игровой тег, страна, иконка или фото, команда и роль, заявки и приглашения.','<b>Player or team profile:</b> nickname, in-game tag, country, icon or photo, team and role, applications and invitations.'),
     R('<b>Активность на сайте:</b> прогнозы на матчи, реакции, голосование за MVP, результаты мини-игр.','<b>Activity:</b> match predictions, reactions, MVP votes, mini-game results.'),
     R('<b>Модерация:</b> жалобы, апелляции, предупреждения и блокировки.','<b>Moderation:</b> reports, appeals, warnings and bans.'),
     R('<b>Уведомления:</b> если ты включишь push, мы сохраним адрес подписки твоего браузера (endpoint), чтобы отправлять уведомления.','<b>Notifications:</b> if you enable push, we store your browser subscription address (endpoint) to deliver notifications.'),
     R('<b>Telegram:</b> при регистрации мы проверяем подписку на канал '+'@TSKesports'+' через вход Telegram. Доступа к твоим сообщениям и контактам мы не получаем.','<b>Telegram:</b> at registration we check your subscription to @TSKesports via Telegram sign-in. We do not get access to your messages or contacts.'),
     R('<b>Технические данные:</b> IP-адрес и сведения о браузере попадают в журналы хостинга и сервисов ниже.','<b>Technical data:</b> your IP address and browser details appear in the logs of hosting and the services listed below.')])+
 H(R('Что публично','What is public'))+
 Pp(R('Никнейм, команда, страна, рейтинг PPS, результаты матчей и история переходов отображаются на сайте и видны всем. Пароль и данные модерации публично не показываются.','Nickname, team, country, PPS rating, match results and transfer history are shown on the site and visible to everyone. Your password and moderation data are not shown publicly.'))+
 H(R('Зачем мы используем данные','Why we use the data'))+
 Ul([R('чтобы работали аккаунты, регистрация команд, рейтинг, матчи и турниры;','to run accounts, team registration, rankings, matches and tournaments;'),
     R('чтобы защищать сайт от ботов и злоупотреблений (в том числе с помощью Cloudflare Turnstile) и вести модерацию;','to protect the site from bots and abuse (including with Cloudflare Turnstile) and to moderate;'),
     R('чтобы отправлять уведомления, если ты их включил.','to send notifications if you turned them on.')])+
 H(R('Сторонние сервисы','Third-party services'))+
 Pp(R('Для работы сайта используются: Supabase (база данных и авторизация), Cloudflare Turnstile (проверка от ботов), Telegram (проверка подписки), Google Fonts (шрифты), jsDelivr (библиотеки), flagcdn.com (флаги стран) и images.weserv.nl (прокси изображений). При обращении к ним твой браузер передаёт им IP-адрес и технические данные — по правилам этих сервисов.','The site uses: Supabase (database and authentication), Cloudflare Turnstile (bot protection), Telegram (subscription check), Google Fonts (fonts), jsDelivr (libraries), flagcdn.com (country flags) and images.weserv.nl (image proxy). When you load them, your browser sends them your IP address and technical data under those services’ own policies.'))+
 H(R('Хранилище браузера и cookies','Browser storage and cookies'))+
 Pp(R('Мы храним в браузере тему, язык, сессию входа и локальные настройки (localStorage и sessionStorage). На дату редакции сайт не использует рекламные и аналитические трекеры.','We keep your theme, language, sign-in session and local settings in the browser (localStorage and sessionStorage). As of the date above the site does not use advertising or analytics trackers.'))+
 H(R('Хранение и удаление','Retention and deletion'))+
 Pp(R('Данные аккаунта хранятся, пока он существует. Чтобы удалить аккаунт или исправить данные, напишите нам в Telegram. Мы можем сохранить записи, необходимые для истории матчей, безопасности и модерации. Push-подписку можно отключить в настройках браузера.','Account data is kept while the account exists. To delete your account or correct your data, message us on Telegram. We may keep records needed for match history, security and moderation. You can turn off push in your browser settings.'))+
 H(R('Возраст','Age'))+
 Pp(R('Если тебе меньше 16 лет, регистрируйся с согласия родителей или законного представителя.','If you are under 16, register with the consent of a parent or legal guardian.'))+
 H(R('Изменения','Changes'))+
 Pp(R('Мы можем обновлять эту страницу; актуальная версия всегда здесь. Условия использования: ','We may update this page; the current version is always here. Terms of use: ')+lnk('terms',R('Условия','Terms'))+'.'),
 UPD());

V.terms=()=>page(R('Условия использования','Terms of use'),
 Pp(R('Пользуясь сайтом TSK Esports, ты соглашаешься с этими условиями. Если не согласен — не пользуйся сайтом.','By using the TSK Esports website you agree to these terms. If you do not agree, please do not use the site.'))+
 H(R('Сайт и Supercell','The site and Supercell'))+
 Pp(R('Сайт — неофициальный проект сообщества. Он не связан с Supercell и не одобрен ею. Brawl Stars — товарный знак Supercell; материалы используются в рамках политики Supercell для фан-контента.','The site is an unofficial community project. It is not affiliated with or endorsed by Supercell. Brawl Stars is a trademark of Supercell; materials are used under Supercell’s fan content policy.'))+
 H(R('Аккаунт','Account'))+
 Ul([R('Указывай достоверные данные и не передавай доступ к аккаунту другим людям.','Provide accurate information and do not share access to your account.'),
     R('Один человек — один аккаунт. Мультиаккаунты и подмена личности запрещены.','One person — one account. Multi-accounting and impersonation are prohibited.'),
     R('Для регистрации нужна подписка на Telegram-канал организации.','Registration requires a subscription to the organization’s Telegram channel.')])+
 H(R('Поведение','Conduct'))+
 Ul([R('Нельзя оскорблять других, угрожать, спамить и публиковать запрещённый контент.','No insults, threats, spam or prohibited content.'),
     R('Нельзя использовать читы, ботов и уязвимости сайта, а также мешать его работе.','No cheating, bots or exploiting site vulnerabilities, and no interference with how the site works.'),
     R('Правила турниров и сообщества — на странице ','Tournament and community rules are on the ')+lnk('rules',R('«Правила»','Rules page'))+'.'])+
 H(R('Модерация','Moderation'))+
 Pp(R('За нарушения мы можем выдать предупреждение, ограничить функции или заблокировать аккаунт. Решение можно оспорить через апелляцию в личном кабинете.','For violations we may issue a warning, restrict features or ban an account. You can appeal a decision from your profile.'))+
 H(R('Контент пользователей','User content'))+
 Pp(R('Публикуя ник, фото, иконку или текст, ты подтверждаешь, что имеешь на это право, и разрешаешь показывать их на сайте. Мы вправе удалить контент, нарушающий правила.','By posting a nickname, photo, icon or text you confirm you have the right to do so and allow it to be shown on the site. We may remove content that breaks the rules.'))+
 H(R('Прогнозы и мини-игры','Predictions and mini-games'))+
 Pp(R('Прогнозы, рейтинги и мини-игры носят развлекательный характер.','Predictions, rankings and mini-games are for entertainment.'))+
 H(R('Ответственность','Liability'))+
 Pp(R('Сайт предоставляется «как есть». Мы стараемся, чтобы данные были точными, но не гарантируем отсутствие ошибок и перебоев в работе.','The site is provided “as is”. We aim for accurate data but do not guarantee the absence of errors or interruptions.'))+
 H(R('Контакты и изменения','Contact and changes'))+
 Pp(R('Вопросы — в Telegram ','Questions: ')+tg()+R('. Мы можем менять условия; актуальная версия всегда на этой странице. ','. We may change these terms; the current version is always on this page. ')+R('Обработка данных описана в ','Data handling is described in the ')+lnk('privacy',R('Политике конфиденциальности','Privacy policy'))+'.'),
 UPD());

window.moreMenu=function(){
 const items=[['brk',R('Сетки сообщества','Community brackets')],['lfg',R('Поиск команды','Find a team')],['rules',R('Правила','Rules')],['games',t('games')],['about',R('О нас','About')],['privacy',R('Конфиденциальность','Privacy')],['terms',R('Условия использования','Terms of use')]].concat(S.user?[['admin',t('panel')]]:[]);
 modal(`<div class="p-3"><h3 class="font-head font-black text-lg px-1 pb-2">${R('Ещё','More')}</h3><div class="grid gap-1.5">${items.map(([k,l])=>`<a href="${TSK_ROOT}${k=='admin'?'':k+'/'}" class="flex items-center justify-between px-3 py-3 rounded-xl bw-05 bd-10 border" onclick="closeM();go('${k}');return false"><b class="text-[14px]">${X(l)}</b><span class="k-t4" aria-hidden="true">›</span></a>`).join('')}</div><div class="flex flex-wrap gap-1.5 mt-3 text-[13px]">${(typeof LANGS!=='undefined'?LANGS:[['ru','Русский'],['en','English']]).map(x=>`<button class="px-2.5 py-1 rounded-lg font-bold ${S.lang==x[0]?'kb-cy-15 kc-cy':'k-t4'}" onclick="closeM();S.lang='${x[0]}';ui()">${x[1]}</button>`).join('')}</div><button class="btn k w-full mt-3" onclick="closeM()">${R('Закрыть','Close')}</button></div>`);
};
})();

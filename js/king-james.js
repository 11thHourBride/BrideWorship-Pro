/* ═══════════════════════════════════════════════════════════
   KJV BIBLE SYSTEM
   — 66 books Genesis→Revelation in canonical order
   — Proper verse counts per chapter
   — KJV text via bible-api.com with localStorage cache
   — Full browser, search, favourites, projection
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   ALL 66 BOOKS — canonical order
───────────────────────────────────────── */
const KJV_BOOKS = [
  /* ── OLD TESTAMENT (39) ── */
  {name:'Genesis',         api:'genesis',         ch:50,  t:'OT'},
  {name:'Exodus',          api:'exodus',          ch:40,  t:'OT'},
  {name:'Leviticus',       api:'leviticus',       ch:27,  t:'OT'},
  {name:'Numbers',         api:'numbers',         ch:36,  t:'OT'},
  {name:'Deuteronomy',     api:'deuteronomy',     ch:34,  t:'OT'},
  {name:'Joshua',          api:'joshua',          ch:24,  t:'OT'},
  {name:'Judges',          api:'judges',          ch:21,  t:'OT'},
  {name:'Ruth',            api:'ruth',            ch:4,   t:'OT'},
  {name:'1 Samuel',        api:'1+samuel',        ch:31,  t:'OT'},
  {name:'2 Samuel',        api:'2+samuel',        ch:24,  t:'OT'},
  {name:'1 Kings',         api:'1+kings',         ch:22,  t:'OT'},
  {name:'2 Kings',         api:'2+kings',         ch:25,  t:'OT'},
  {name:'1 Chronicles',    api:'1+chronicles',    ch:29,  t:'OT'},
  {name:'2 Chronicles',    api:'2+chronicles',    ch:36,  t:'OT'},
  {name:'Ezra',            api:'ezra',            ch:10,  t:'OT'},
  {name:'Nehemiah',        api:'nehemiah',        ch:13,  t:'OT'},
  {name:'Esther',          api:'esther',          ch:10,  t:'OT'},
  {name:'Job',             api:'job',             ch:42,  t:'OT'},
  {name:'Psalms',          api:'psalms',          ch:150, t:'OT'},
  {name:'Proverbs',        api:'proverbs',        ch:31,  t:'OT'},
  {name:'Ecclesiastes',    api:'ecclesiastes',    ch:12,  t:'OT'},
  {name:'Song of Solomon', api:'song+of+solomon', ch:8,   t:'OT'},
  {name:'Isaiah',          api:'isaiah',          ch:66,  t:'OT'},
  {name:'Jeremiah',        api:'jeremiah',        ch:52,  t:'OT'},
  {name:'Lamentations',    api:'lamentations',    ch:5,   t:'OT'},
  {name:'Ezekiel',         api:'ezekiel',         ch:48,  t:'OT'},
  {name:'Daniel',          api:'daniel',          ch:12,  t:'OT'},
  {name:'Hosea',           api:'hosea',           ch:14,  t:'OT'},
  {name:'Joel',            api:'joel',            ch:3,   t:'OT'},
  {name:'Amos',            api:'amos',            ch:9,   t:'OT'},
  {name:'Obadiah',         api:'obadiah',         ch:1,   t:'OT'},
  {name:'Jonah',           api:'jonah',           ch:4,   t:'OT'},
  {name:'Micah',           api:'micah',           ch:7,   t:'OT'},
  {name:'Nahum',           api:'nahum',           ch:3,   t:'OT'},
  {name:'Habakkuk',        api:'habakkuk',        ch:3,   t:'OT'},
  {name:'Zephaniah',       api:'zephaniah',       ch:3,   t:'OT'},
  {name:'Haggai',          api:'haggai',          ch:2,   t:'OT'},
  {name:'Zechariah',       api:'zechariah',       ch:14,  t:'OT'},
  {name:'Malachi',         api:'malachi',         ch:4,   t:'OT'},
  /* ── NEW TESTAMENT (27) ── */
  {name:'Matthew',         api:'matthew',         ch:28,  t:'NT'},
  {name:'Mark',            api:'mark',            ch:16,  t:'NT'},
  {name:'Luke',            api:'luke',            ch:24,  t:'NT'},
  {name:'John',            api:'john',            ch:21,  t:'NT'},
  {name:'Acts',            api:'acts',            ch:28,  t:'NT'},
  {name:'Romans',          api:'romans',          ch:16,  t:'NT'},
  {name:'1 Corinthians',   api:'1+corinthians',   ch:16,  t:'NT'},
  {name:'2 Corinthians',   api:'2+corinthians',   ch:13,  t:'NT'},
  {name:'Galatians',       api:'galatians',       ch:6,   t:'NT'},
  {name:'Ephesians',       api:'ephesians',       ch:6,   t:'NT'},
  {name:'Philippians',     api:'philippians',     ch:4,   t:'NT'},
  {name:'Colossians',      api:'colossians',      ch:4,   t:'NT'},
  {name:'1 Thessalonians', api:'1+thessalonians', ch:5,   t:'NT'},
  {name:'2 Thessalonians', api:'2+thessalonians', ch:3,   t:'NT'},
  {name:'1 Timothy',       api:'1+timothy',       ch:6,   t:'NT'},
  {name:'2 Timothy',       api:'2+timothy',       ch:4,   t:'NT'},
  {name:'Titus',           api:'titus',           ch:3,   t:'NT'},
  {name:'Philemon',        api:'philemon',        ch:1,   t:'NT'},
  {name:'Hebrews',         api:'hebrews',         ch:13,  t:'NT'},
  {name:'James',           api:'james',           ch:5,   t:'NT'},
  {name:'1 Peter',         api:'1+peter',         ch:5,   t:'NT'},
  {name:'2 Peter',         api:'2+peter',         ch:3,   t:'NT'},
  {name:'1 John',          api:'1+john',          ch:5,   t:'NT'},
  {name:'2 John',          api:'2+john',          ch:1,   t:'NT'},
  {name:'3 John',          api:'3+john',          ch:1,   t:'NT'},
  {name:'Jude',            api:'jude',            ch:1,   t:'NT'},
  {name:'Revelation',      api:'revelation',      ch:22,  t:'NT'},
];

/* ─────────────────────────────────────────
   VERSE COUNTS PER CHAPTER — all 66 books
───────────────────────────────────────── */
const KJV_VERSES = {
  'Genesis':         [31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,43,54,22,20,31,23,30,30,21,38,26],
  'Exodus':          [22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],
  'Leviticus':       [17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,24,46,22,22,15,17,14,15],
  'Numbers':         [54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13],
  'Deuteronomy':     [46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12],
  'Joshua':          [18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],
  'Judges':          [36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
  'Ruth':            [22,23,18,22],
  '1 Samuel':        [28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],
  '2 Samuel':        [27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],
  '1 Kings':         [53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],
  '2 Kings':         [18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30],
  '1 Chronicles':    [54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],
  '2 Chronicles':    [17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],
  'Ezra':            [11,70,13,24,17,22,28,36,15,44],
  'Nehemiah':        [11,20,32,23,19,19,73,18,38,39,36,47,31],
  'Esther':          [22,23,15,17,14,14,10,17,32,3],
  'Job':             [22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],
  'Psalms':          [6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,13,25,11,22,23,28,13,40,23,14,18,14,12,5,27,18,12,10,15,21,23,21,11,7,9,24,14,12,12,18,14,9,13,12,11,14,20,8,36,37,6,24,20,28,23,11,13,21,72,13,20,17,8,19,13,14,17,7,19,53,17,16,16,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,14,10,8,12,15,21,10,20,14,9,6],
  'Proverbs':        [33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],
  'Ecclesiastes':    [18,26,22,16,20,12,29,17,18,20,10,14],
  'Song of Solomon': [17,17,11,16,16,13,13,14],
  'Isaiah':          [31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24],
  'Jeremiah':        [19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],
  'Lamentations':    [22,22,66,22,22],
  'Ezekiel':         [28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],
  'Daniel':          [21,49,30,37,31,28,28,27,27,21,45,13],
  'Hosea':           [11,23,5,19,15,11,16,14,17,15,12,14,16,9],
  'Joel':            [20,32,21],
  'Amos':            [15,16,15,13,27,14,17,14,15],
  'Obadiah':         [21],
  'Jonah':           [17,10,10,11],
  'Micah':           [16,13,12,13,15,16,20],
  'Nahum':           [15,13,19],
  'Habakkuk':        [17,20,19],
  'Zephaniah':       [18,15,20],
  'Haggai':          [15,23],
  'Zechariah':       [21,13,10,14,11,15,14,23,17,12,17,14,9,21],
  'Malachi':         [14,17,18,6],
  'Matthew':         [25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],
  'Mark':            [45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],
  'Luke':            [80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],
  'John':            [51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],
  'Acts':            [26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,40,38,40,30,35,27,27,32,44,31],
  'Romans':          [32,29,31,25,21,23,25,39,33,21,36,21,14,26,33,24],
  '1 Corinthians':   [31,16,23,21,13,20,40,34,29,53,18,15,10,19,35,19],
  '2 Corinthians':   [24,17,18,18,21,18,16,24,15,18,33,21,14],
  'Galatians':       [24,21,29,31,26,18],
  'Ephesians':       [23,22,21,28,30,14],
  'Philippians':     [30,18,19,16],
  'Colossians':      [29,23,25,18],
  '1 Thessalonians': [10,20,13,18,28],
  '2 Thessalonians': [12,17,18],
  '1 Timothy':       [20,15,16,16,25,21],
  '2 Timothy':       [18,26,17,22],
  'Titus':           [16,15,15],
  'Philemon':        [25],
  'Hebrews':         [14,18,19,16,14,20,28,13,28,39,40,29,25],
  'James':           [27,26,18,17,20],
  '1 Peter':         [25,25,22,19,14],
  '2 Peter':         [21,22,18],
  '1 John':          [10,29,24,21,21],
  '2 John':          [13],
  '3 John':          [14],
  'Jude':            [25],
  'Revelation':      [20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21],
};

/* ─────────────────────────────────────────
   KJV OFFLINE CACHE — key verses
───────────────────────────────────────── */
const SCRIPTURE_DB = {
  'genesis 1:1':           'In the beginning God created the heaven and the earth.',
  'genesis 1:1-3':         'In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters. And God said, Let there be light: and there was light.',
  'exodus 14:15':          'And the LORD said unto Moses, Wherefore criest thou unto me? speak unto the children of Israel, that they go forward.',
  'numbers 6:24-26':       'The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee: The LORD lift up his countenance upon thee, and give thee peace.',
  'deuteronomy 31:6':      'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.',
  'joshua 1:9':            'Have not I commanded thee? Be strong and courageous; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
  'psalm 1:1-3':           'Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful. But his delight is in the law of the LORD; and in his law doth he meditate day and night. And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper.',
  'psalm 23:1':            'The LORD is my shepherd; I shall not want.',
  'psalm 23:1-3':          'The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.',
  'psalm 23:4':            'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
  'psalm 23:1-6':          'The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake. Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me. Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over. Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
  'psalm 27:1':            'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?',
  'psalm 34:8':            'O taste and see that the LORD is good: blessed is the man that trusteth in him.',
  'psalm 46:1':            'God is our refuge and strength, a very present help in trouble.',
  'psalm 46:10':           'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.',
  'psalm 91:1':            'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.',
  'psalm 91:1-2':          'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.',
  'psalm 100:1-3':         'Make a joyful noise unto the LORD, all ye lands. Serve the LORD with gladness: come before his presence with singing. Know ye that the LORD he is God: it is he that hath made us, and not we ourselves; we are his people, and the sheep of his pasture.',
  'psalm 119:105':         'Thy word is a lamp unto my feet, and a light unto my path.',
  'proverbs 3:5-6':        'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
  'isaiah 9:6':            'For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.',
  'isaiah 40:31':          'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
  'isaiah 41:10':          'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
  'isaiah 53:4-5':         'Surely he hath borne our griefs, and carried our sorrows: yet we did esteem him stricken, smitten of God, and afflicted. But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.',
  'jeremiah 29:11':        'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.',
  'lamentations 3:22-23':  'It is of the LORD\'s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.',
  'matthew 5:14':          'Ye are the light of the world. A city that is set on an hill cannot be hid.',
  'matthew 6:33':          'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.',
  'matthew 11:28':         'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
  'matthew 28:19-20':      'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost: Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.',
  'mark 9:23':             'Jesus said unto him, If thou canst believe, all things are possible to him that believeth.',
  'mark 11:23':            'For verily I say unto you, That whosoever shall say unto this mountain, Be thou removed, and be thou cast into the sea; and shall not doubt in his heart, but shall believe that those things which he saith shall come to pass; he shall have whatsoever he saith.',
  'luke 2:11':             'For unto you is born this day in the city of David a Saviour, which is Christ the Lord.',
  'john 1:1':              'In the beginning was the Word, and the Word was with God, and the Word was God.',
  'john 3:16':             'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
  'john 3:16-17':          'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life. For God sent not his Son into the world to condemn the world; but that the world through him might be saved.',
  'john 4:24':             'God is a Spirit: and they that worship him must worship him in spirit and in truth.',
  'john 10:10':            'The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly.',
  'john 11:25-26':         'Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live: And whosoever liveth and believeth in me shall never die. Believest thou this?',
  'john 14:6':             'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.',
  'john 14:26':            'But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you.',
  'acts 2:38':             'Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.',
  'acts 26:19':            'Whereupon, O king Agrippa, I was not disobedient unto the heavenly vision.',
  'romans 3:23':           'For all have sinned, and come short of the glory of God.',
  'romans 6:23':           'For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.',
  'romans 8:28':           'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
  'romans 10:9':           'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.',
  'romans 12:1':           'I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.',
  '1 corinthians 13:4-7':  'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; Rejoiceth not in iniquity, but rejoiceth in the truth; Beareth all things, believeth all things, hopeth all things, endureth all things.',
  '1 corinthians 11:28':   'But let a man examine himself, and so let him eat of that bread, and drink of that cup.',
  '2 corinthians 5:7':     'For we walk by faith, not by sight.',
  '2 corinthians 9:7':     'Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.',
  'galatians 2:20':        'I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.',
  'ephesians 2:8-9':       'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.',
  'ephesians 4:30':        'And grieve not the holy Spirit of God, whereby ye are sealed unto the day of redemption.',
  'philippians 4:13':      'I can do all things through Christ which strengtheneth me.',
  'philippians 4:7':       'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
  'hebrews 6:19':          'Which hope we have as an anchor of the soul, both sure and stedfast, and which entereth into that within the veil.',
  'hebrews 11:1':          'Now faith is the substance of things hoped for, the evidence of things not seen.',
  'hebrews 12:2':          'Looking unto Jesus the author and finisher of our faith; who for the joy that was set before him endured the cross, despising the shame, and is set down at the right hand of the throne of God.',
  'hebrews 13:8':          'Jesus Christ the same yesterday, and to day, and for ever.',
  '1 john 1:9':            'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.',
  '1 john 4:19':           'We love him, because he first loved us.',
  'revelation 3:20':       'Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.',
  'revelation 21:4':       'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.',
  'numbers 6:24-25':       'The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee.',
  '1 peter 2:24':          'Who his own self bare our sins in his own body on the tree, that we, being dead to sins, should live unto righteousness: by whose stripes ye were healed.',
  '2 timothy 3:16-17':     'All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness: That the man of God may be perfect, throughly furnished unto all good works.',
};

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
let _bib = {
  testament:    'OT',
  bookIdx:      0,
  chapter:      1,
  vsFrom:       1,
  vsTo:         1,
  cache:        {},     // key → [{verse,text}]
  savedList:    [],
  lastPassage:  null,   // {ref, verses:[{num,text}]}
};

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
(function initBible() {
  function doInit() {
    populateBibBookSel();
    buildBibBookGrid('OT');
    loadBibFavourites();
    // Default: show Genesis 1:1 as placeholder
    onBibBookChange();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doInit);
  } else { doInit(); }
})();

/* ─────────────────────────────────────────
   POPULATE BOOK SELECT (navigator)
───────────────────────────────────────── */
function populateBibBookSel() {
  const sel = document.getElementById('bib-book');
  if (!sel) return;
  sel.innerHTML = '';
  KJV_BOOKS.forEach((b, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = b.name;
    sel.appendChild(opt);
  });
  sel.value = '0';
  onBibBookChange();
}

/* ─────────────────────────────────────────
   BUILD BOOK GRID (library panel)
───────────────────────────────────────── */
function buildBibBookGrid(testament) {
  const grid = document.getElementById('bib-book-grid');
  const saved = document.getElementById('bib-saved-panel');
  if (!grid) return;
  grid.style.display = 'grid';
  if (saved) saved.style.display = 'none';
  grid.innerHTML = '';

  const books = KJV_BOOKS.filter(b => b.t === testament);
  books.forEach(b => {
    const idx = KJV_BOOKS.indexOf(b);
    const div = document.createElement('div');
    div.className = 'bib-book-btn' + (_bib.bookIdx === idx ? ' active' : '');
    div.innerHTML = `<div class="bib-book-name">${b.name}</div>
      <div class="bib-book-ch">${b.ch} ch.</div>`;
    div.addEventListener('click', () => {
      // Select book in navigator
      const bookSel = document.getElementById('bib-book');
      if (bookSel) bookSel.value = String(idx);
      _bib.bookIdx = idx;
      onBibBookChange();
      // Highlight
      grid.querySelectorAll('.bib-book-btn').forEach(el => el.classList.remove('active'));
      div.classList.add('active');
    });
    grid.appendChild(div);
  });
}

/* ─────────────────────────────────────────
   TESTAMENT TABS
───────────────────────────────────────── */
function setBibTestament(btn, testament) {
  document.querySelectorAll('.btt').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  _bib.testament = testament;

  const grid  = document.getElementById('bib-book-grid');
  const saved = document.getElementById('bib-saved-panel');

  if (testament === 'FAV') {
    if (grid)  grid.style.display  = 'none';
    if (saved) saved.style.display = 'block';
    renderBibFavourites();
  } else {
    buildBibBookGrid(testament);
  }
}

/* ─────────────────────────────────────────
   BOOK CHANGE → populate chapter dropdown
───────────────────────────────────────── */
function onBibBookChange() {
  const bookSel = document.getElementById('bib-book');
  const chSel   = document.getElementById('bib-ch');
  if (!bookSel || !chSel) return;

  const idx  = parseInt(bookSel.value) || 0;
  _bib.bookIdx = idx;
  const book = KJV_BOOKS[idx];

  chSel.innerHTML = '';
  for (let c = 1; c <= book.ch; c++) {
    const opt = document.createElement('option');
    opt.value = String(c);
    opt.textContent = String(c);
    chSel.appendChild(opt);
  }
  chSel.value = '1';
  _bib.chapter = 1;
  onBibChapterChange();
}

/* ─────────────────────────────────────────
   CHAPTER CHANGE → populate verse dropdowns
───────────────────────────────────────── */
function onBibChapterChange() {
  const chSel   = document.getElementById('bib-ch');
  const fromSel = document.getElementById('bib-vs-from');
  const toSel   = document.getElementById('bib-vs-to');
  if (!chSel || !fromSel || !toSel) return;

  const idx   = _bib.bookIdx;
  const book  = KJV_BOOKS[idx];
  const ch    = parseInt(chSel.value) || 1;
  _bib.chapter = ch;

  const counts  = KJV_VERSES[book.name];
  const maxVs   = (counts && counts[ch - 1]) ? counts[ch - 1] : 30;

  [fromSel, toSel].forEach(sel => {
    sel.innerHTML = '';
    for (let v = 1; v <= maxVs; v++) {
      const opt = document.createElement('option');
      opt.value = String(v);
      opt.textContent = String(v);
      sel.appendChild(opt);
    }
  });
  fromSel.value = '1';
  toSel.value   = String(maxVs);
}

/* ─────────────────────────────────────────
   FETCH PASSAGE — API + cache + offline DB
───────────────────────────────────────── */
async function fetchBiblePassage() {
  const bookSel   = document.getElementById('bib-book');
  const chSel     = document.getElementById('bib-ch');
  const fromSel   = document.getElementById('bib-vs-from');
  const toSel     = document.getElementById('bib-vs-to');
  if (!bookSel) return;

  const idx     = parseInt(bookSel.value) || 0;
  const book    = KJV_BOOKS[idx];
  const ch      = parseInt(chSel?.value)     || 1;
  const vsFrom  = parseInt(fromSel?.value)   || 1;
  const vsTo    = parseInt(toSel?.value)     || vsFrom;

  const rangeStr = vsFrom === vsTo ? String(vsFrom) : `${vsFrom}-${vsTo}`;
  const ref      = `${book.name} ${ch}:${rangeStr}`;

  showBibPassagePanel(ref, null); // show loading
  const verses = await loadBibVerses(book, ch, vsFrom, vsTo);
  showBibPassagePanel(ref, verses);
}

async function loadFullBibleChapter() {
  const bookSel = document.getElementById('bib-book');
  const chSel   = document.getElementById('bib-ch');
  if (!bookSel) return;

  const idx  = parseInt(bookSel.value) || 0;
  const book = KJV_BOOKS[idx];
  const ch   = parseInt(chSel?.value)  || 1;
  const counts = KJV_VERSES[book.name];
  const maxVs  = (counts && counts[ch - 1]) ? counts[ch - 1] : 30;
  const ref    = `${book.name} ${ch}`;

  showBibPassagePanel(ref, null);
  const verses = await loadBibVerses(book, ch, 1, maxVs);
  showBibPassagePanel(ref, verses);
}

async function loadBibVerses(book, ch, vsFrom, vsTo) {
  // 1. Check offline DB first for exact match
  const offlineKey = `${book.name.toLowerCase()} ${ch}:${vsFrom}${vsFrom !== vsTo ? '-' + vsTo : ''}`;
  const offlineText = SCRIPTURE_DB[offlineKey];
  if (offlineText) {
    // Build verse array from offline text
    const sentences = offlineText.split(/(?<=[.!?])\s+/);
    return sentences.map((t, i) => ({ num: vsFrom + i, text: t.trim() })).filter(v => v.text);
  }

  // 2. Check localStorage cache
  const cacheKey = `bw_bib_${book.api}_${ch}_${vsFrom}_${vsTo}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch(e) {}

  // 3. Fetch from bible-api.com (KJV)
  const version    = document.getElementById('bible-version-sel')?.value || 'kjv';
  const rangeStr   = vsFrom === vsTo ? vsFrom : `${vsFrom}-${vsTo}`;
  const url        = `https://bible-api.com/${book.api}+${ch}:${rangeStr}?translation=${version}`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('API error ' + resp.status);
    const data = await resp.json();
    const verses = (data.verses || []).map(v => ({
      num:  v.verse,
      text: v.text.trim().replace(/\n/g, ' ')
    }));
    // Cache in localStorage
    try { localStorage.setItem(cacheKey, JSON.stringify(verses)); } catch(e) {}
    return verses;
  } catch(err) {
    // 4. Fallback — try the local SCRIPTURE_DB with a broader match
    const fallbackKey = Object.keys(SCRIPTURE_DB).find(k =>
      k.startsWith(book.name.toLowerCase() + ' ' + ch + ':')
    );
    if (fallbackKey) {
      return [{ num: vsFrom, text: SCRIPTURE_DB[fallbackKey] }];
    }
    return [{ num: vsFrom, text: `⚠ Could not load — check your internet connection.\n\nReference: ${book.name} ${ch}:${vsFrom}${vsFrom !== vsTo ? '-' + vsTo : ''}` }];
  }
}

/* ─────────────────────────────────────────
   SHOW PASSAGE PANEL
───────────────────────────────────────── */
function showBibPassagePanel(ref, verses) {
  const panel  = document.getElementById('bib-passage-panel');
  const refEl  = document.getElementById('bpp-ref');
  const textEl = document.getElementById('bpp-text');
  if (!panel) return;

  panel.style.display = 'flex';
  if (refEl) refEl.textContent = ref;

  if (!verses) {
    // Loading state
    if (textEl) textEl.innerHTML = `<div class="bib-loading"><div class="bib-spinner"></div>Loading ${ref}…</div>`;
    return;
  }

  _bib.lastPassage = { ref, verses };

  if (!textEl) return;
  if (!verses.length) {
    textEl.innerHTML = '<div class="bib-error">No verses found for this reference.</div>';
    return;
  }

  textEl.innerHTML = verses.map(v => `
    <div class="bpp-verse">
      <span class="bpp-verse-num">${v.num}</span>
      <span class="bpp-verse-text">${escapeHTML(v.text)}</span>
    </div>`).join('');

  // Scroll panel into view
  setTimeout(() => panel.scrollIntoView({ behavior:'smooth', block:'nearest' }), 50);
}

function closeBibPassage() {
  const panel = document.getElementById('bib-passage-panel');
  if (panel) panel.style.display = 'none';
  _bib.lastPassage = null;
}

/* ─────────────────────────────────────────
   PROJECT
───────────────────────────────────────── */
function projectBiblePassage() {
  if (!_bib.lastPassage) return;
  const { ref, verses } = _bib.lastPassage;
  const onePerSlide = document.getElementById('bib-one-per-slide')?.checked ?? true;
  const showRef     = document.getElementById('bib-ref-on-slide')?.checked  ?? false;
  const version     = document.getElementById('bible-version-sel')?.options[
    document.getElementById('bible-version-sel')?.selectedIndex
  ]?.text || 'KJV';

  S.songIdx = null;
  if (onePerSlide) {
    S.slides = verses.map(v => ({
      section:  ref + ':' + v.num,
      text:     (showRef ? `${ref}:${v.num}\n\n` : '') + v.text,
      version:  version,
    }));
  } else {
    const fullText = verses.map(v => `${v.num} ${v.text}`).join(' ');
    S.slides = [{ section: ref, text: fullText, version }];
  }
  S.cur = 0;
  renderQueue();
  renderSlide();
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
}

function addBibleToSO() {
  if (!_bib.lastPassage) return;
  const { ref, verses } = _bib.lastPassage;
  const text = verses.map(v => `${v.num} ${v.text}`).join('\n\n');
  S.so.push({ name: ref, type: 'scripture', content: text });
  renderSO();
  showSchToast(`Added "${ref}" to Service Order`);
}

function addBibleToSchedule() {
  if (!_bib.lastPassage) return;
  const { ref, verses } = _bib.lastPassage;
  const text = verses.map(v => `[${ref}:${v.num}]\n${v.text}`).join('\n\n');
  schInsertFromLibrary({ type:'scripture', label: ref, content: text, notes:'', duration:1 }, -1);
}

/* ─────────────────────────────────────────
   SEARCH
───────────────────────────────────────── */
async function bibleSearch(query) {
  const q = (query || document.getElementById('bib-search')?.value || '').trim();
  if (!q) return;

  // Try to parse as a reference first: "John 3:16" or "Psalm 23:1-3"
  const refMatch = q.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/i);
  if (refMatch) {
    const bookName = refMatch[1].trim();
    const ch       = parseInt(refMatch[2]);
    const vsFrom   = parseInt(refMatch[3]);
    const vsTo     = refMatch[4] ? parseInt(refMatch[4]) : vsFrom;

    // Find book
    const bookIdx = KJV_BOOKS.findIndex(b =>
      b.name.toLowerCase() === bookName.toLowerCase() ||
      b.name.toLowerCase().startsWith(bookName.toLowerCase())
    );
    if (bookIdx >= 0) {
      // Set navigator
      const bookSel = document.getElementById('bib-book');
      if (bookSel) { bookSel.value = String(bookIdx); onBibBookChange(); }

      const chSel = document.getElementById('bib-ch');
      if (chSel)   { chSel.value = String(ch); onBibChapterChange(); }

      const fromSel = document.getElementById('bib-vs-from');
      const toSel   = document.getElementById('bib-vs-to');
      if (fromSel) fromSel.value = String(vsFrom);
      if (toSel)   toSel.value   = String(vsTo);

      await fetchBiblePassage();
      return;
    }
  }

  // Try chapter-only: "John 3" or "Genesis 1"
  const chapMatch = q.match(/^(.+?)\s+(\d+)$/i);
  if (chapMatch) {
    const bookName = chapMatch[1].trim();
    const ch       = parseInt(chapMatch[2]);
    const bookIdx  = KJV_BOOKS.findIndex(b => b.name.toLowerCase().startsWith(bookName.toLowerCase()));
    if (bookIdx >= 0) {
      const bookSel = document.getElementById('bib-book');
      if (bookSel) { bookSel.value = String(bookIdx); onBibBookChange(); }
      const chSel = document.getElementById('bib-ch');
      if (chSel)   { chSel.value = String(ch); onBibChapterChange(); }
      await loadFullBibleChapter();
      return;
    }
  }

  // Try local SCRIPTURE_DB keyword search
  const lower   = q.toLowerCase();
  const matches = Object.entries(SCRIPTURE_DB).filter(([k, v]) =>
    k.includes(lower) || v.toLowerCase().includes(lower)
  );
  if (matches.length) {
    const [ref, text] = matches[0];
    const verses = text.split(/(?<=[.!?])\s+/).map((t, i) => ({ num: i + 1, text: t.trim() })).filter(v => v.text);
    _bib.lastPassage = { ref, verses };
    showBibPassagePanel(ref, verses);
    return;
  }

  // Nothing found
  showBibPassagePanel(q, [{ num: 1, text: `No results found for "${q}". Try a reference like "John 3:16" or "Psalm 23:1-3".` }]);
}

/* Quick lookup from right panel */
async function quickScriptureLookup() {
  const ref = document.getElementById('sc-ref')?.value.trim();
  if (!ref) return;
  // Try SCRIPTURE_DB first
  const key = ref.toLowerCase();
  if (SCRIPTURE_DB[key]) {
    queueScripture(ref, SCRIPTURE_DB[key]);
    document.getElementById('sc-ref').value = '';
    return;
  }
  // Try Bible search
  await bibleSearch(ref);
  if (_bib.lastPassage) {
    projectBiblePassage();
    document.getElementById('sc-ref').value = '';
  }
}

/* ─────────────────────────────────────────
   FAVOURITES
───────────────────────────────────────── */
function saveBiblePassage() {
  if (!_bib.lastPassage) return;
  const { ref, verses } = _bib.lastPassage;
  // Avoid duplicates
  if (_bib.savedList.find(s => s.ref === ref)) {
    showSchToast(`"${ref}" already saved`);
    return;
  }
  _bib.savedList.push({ ref, verses, savedAt: new Date().toISOString() });
  persistBibFavourites();
  renderBibFavourites();
  showSchToast(`"${ref}" saved to favourites`);
}

function renderBibFavourites() {
  const list = document.getElementById('bib-saved-list');
  if (!list) return;
  if (!_bib.savedList.length) {
    list.innerHTML = '<div class="lib-empty" style="padding:12px;">No saved passages yet — click ⭐ after loading a passage.</div>';
    return;
  }
  list.innerHTML = _bib.savedList.map((s, i) => `
    <div class="bib-saved-item" onclick="loadSavedBibPassage(${i})">
      <div>
        <div class="bib-saved-ref">${escapeHTML(s.ref)}</div>
        <div class="bib-saved-text">${escapeHTML(s.verses[0]?.text || '')}</div>
      </div>
      <button class="bib-saved-del" onclick="event.stopPropagation();deleteBibSaved(${i})" title="Remove">✕</button>
    </div>`).join('');
}

function loadSavedBibPassage(i) {
  const s = _bib.savedList[i];
  if (!s) return;
  _bib.lastPassage = { ref: s.ref, verses: s.verses };
  showBibPassagePanel(s.ref, s.verses);
  const grid  = document.getElementById('bib-book-grid');
  const saved = document.getElementById('bib-saved-panel');
  if (grid)  grid.style.display  = 'none';
  if (saved) saved.style.display = 'block';
}

function deleteBibSaved(i) {
  _bib.savedList.splice(i, 1);
  persistBibFavourites();
  renderBibFavourites();
}

function loadBibFavourites() {
  try {
    const saved = JSON.parse(localStorage.getItem('bw_bib_saved') || '[]');
    if (Array.isArray(saved)) _bib.savedList = saved;
  } catch(e) {}
}

function persistBibFavourites() {
  try { localStorage.setItem('bw_bib_saved', JSON.stringify(_bib.savedList)); } catch(e) {}
}

/* ─────────────────────────────────────────
   ALSO update addScripture (right panel old button)
───────────────────────────────────────── */
function addScripture() {
  quickScriptureLookup();
}
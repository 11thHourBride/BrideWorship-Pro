/* ═══════════════════════════════════════════════
   BrideWorship Pro — Complete JS
   v2.0 — Full feature rewrite
═══════════════════════════════════════════════ */

/* ── SONG DATA ── */
const DEFAULT_SONGS = [
  {title:"Amazing Grace",author:"John Newton",tag:"Classic Hymn",key:"G",tempo:"Slow",slides:[
    {section:"VERSE 1",text:"Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see."},
    {section:"VERSE 2",text:"'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed."},
    {section:"CHORUS",text:"My chains are gone, I've been set free,\nMy God, my Savior has ransomed me.\nAnd like a flood His mercy rains,\nUnending love — Amazing Grace."},
    {section:"VERSE 3",text:"Through many dangers, toils and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home."},
    {section:"BRIDGE",text:"The earth shall soon dissolve like snow,\nThe sun forbear to shine;\nBut God, who called me here below,\nShall be forever mine."},
    {section:"OUTRO",text:"When we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we first begun."}
  ]},
  {title:"How Great Thou Art",author:"Carl Boberg",tag:"Classic Hymn",key:"Bb",tempo:"Moderate",slides:[
    {section:"VERSE 1",text:"O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made,\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed."},
    {section:"CHORUS",text:"Then sings my soul, my Savior God, to Thee:\nHow great Thou art! How great Thou art!\nThen sings my soul, my Savior God, to Thee:\nHow great Thou art! How great Thou art!"},
    {section:"VERSE 2",text:"When through the woods and forest glades I wander\nAnd hear the birds sing sweetly in the trees,\nWhen I look down from lofty mountain grandeur\nAnd see the brook, and feel the gentle breeze."},
    {section:"VERSE 3",text:"And when I think that God, His Son not sparing,\nSent Him to die, I scarce can take it in;\nThat on the cross, my burden gladly bearing,\nHe bled and died to take away my sin."},
    {section:"VERSE 4",text:"When Christ shall come with shout of acclamation\nAnd take me home, what joy shall fill my heart!\nThen I shall bow in humble adoration,\nAnd there proclaim, my God, how great Thou art!"}
  ]},
  {title:"Great Is Thy Faithfulness",author:"Thomas Chisholm",tag:"Classic Hymn",key:"D",tempo:"Moderate",slides:[
    {section:"VERSE 1",text:"Great is Thy faithfulness, O God my Father,\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions they fail not;\nAs Thou hast been, Thou forever wilt be."},
    {section:"CHORUS",text:"Great is Thy faithfulness!\nGreat is Thy faithfulness!\nMorning by morning new mercies I see;\nAll I have needed Thy hand hath provided —\nGreat is Thy faithfulness, Lord, unto me!"},
    {section:"VERSE 2",text:"Summer and winter and springtime and harvest,\nSun, moon and stars in their courses above\nJoin with all nature in manifold witness\nTo Thy great faithfulness, mercy and love."},
    {section:"VERSE 3",text:"Pardon for sin and a peace that endureth,\nThine own dear presence to cheer and to guide;\nStrength for today and bright hope for tomorrow —\nBlessings all mine, with ten thousand beside!"}
  ]},
  {title:"Blessed Assurance",author:"Fanny J. Crosby",tag:"Classic Hymn",key:"Eb",tempo:"Moderate",slides:[
    {section:"VERSE 1",text:"Blessed assurance, Jesus is mine!\nO what a foretaste of glory divine!\nHeir of salvation, purchase of God,\nBorn of His Spirit, washed in His blood."},
    {section:"CHORUS",text:"This is my story, this is my song,\nPraising my Savior all the day long;\nThis is my story, this is my song,\nPraising my Savior all the day long."},
    {section:"VERSE 2",text:"Perfect submission, perfect delight,\nVisions of rapture now burst on my sight;\nAngels descending bring from above\nEchoes of mercy, whispers of love."},
    {section:"VERSE 3",text:"Perfect submission, all is at rest;\nI in my Savior am happy and blest,\nWatching and waiting, looking above,\nFilled with His goodness, lost in His love."}
  ]},
  {title:"Holy, Holy, Holy",author:"Reginald Heber",tag:"Classic Hymn",key:"A",tempo:"Majestic",slides:[
    {section:"VERSE 1",text:"Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy! Merciful and mighty!\nGod in three persons, blessèd Trinity!"},
    {section:"VERSE 2",text:"Holy, holy, holy! All the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWhich wert and art and evermore shalt be."},
    {section:"VERSE 3",text:"Holy, holy, holy! Though the darkness hide Thee,\nThough the eye of sinful man Thy glory may not see,\nOnly Thou art holy; there is none beside Thee,\nPerfect in power, in love, and purity."},
    {section:"VERSE 4",text:"Holy, holy, holy! Lord God Almighty!\nAll Thy works shall praise Thy name, in earth and sky and sea;\nHoly, holy, holy! Merciful and mighty!\nGod in three persons, blessèd Trinity."}
  ]},
  {title:"It Is Well with My Soul",author:"Horatio Spafford",tag:"Classic Hymn",key:"C",tempo:"Slow",slides:[
    {section:"VERSE 1",text:"When peace like a river attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\n\"It is well, it is well with my soul.\""},
    {section:"CHORUS",text:"It is well — with my soul,\nIt is well, it is well with my soul."},
    {section:"VERSE 2",text:"Though Satan should buffet, though trials should come,\nLet this blest assurance control:\nThat Christ hath regarded my helpless estate,\nAnd hath shed His own blood for my soul."},
    {section:"VERSE 3",text:"My sin — O the bliss of this glorious thought! —\nMy sin, not in part, but the whole,\nIs nailed to the cross and I bear it no more:\nPraise the Lord, praise the Lord, O my soul!"}
  ]},
  {title:"10,000 Reasons",author:"Matt Redman",tag:"Contemporary Worship",key:"G",tempo:"Upbeat",slides:[
    {section:"CHORUS",text:"Bless the Lord, O my soul, O my soul,\nWorship His holy name.\nSing like never before, O my soul,\nI'll worship Your holy name."},
    {section:"VERSE 1",text:"The sun comes up, it's a new day dawning,\nIt's time to sing Your song again.\nWhatever may pass and whatever lies before me,\nLet me be singing when the evening comes."},
    {section:"VERSE 2",text:"You're rich in love and You're slow to anger,\nYour name is great and Your heart is kind.\nFor all Your goodness I will keep on singing,\nTen thousand reasons for my heart to find."},
    {section:"VERSE 3",text:"And on that day when my strength is failing,\nThe end draws near and my time has come,\nStill my soul will sing Your praise unending,\nTen thousand years and then forevermore."}
  ]},
  {title:"Way Maker",author:"Sinach",tag:"Contemporary Worship",key:"Ab",tempo:"Moderate",slides:[
    {section:"VERSE 1",text:"You are here, moving in our midst,\nI worship You, I worship You.\nYou are here, working in this place,\nI worship You, I worship You."},
    {section:"CHORUS",text:"Way Maker, Miracle Worker,\nPromise Keeper, Light in the darkness,\nMy God, that is who You are."},
    {section:"BRIDGE",text:"Even when I don't see it, You're working.\nEven when I don't feel it, You're working.\nYou never stop, You never stop working.\nYou never stop, You never stop working."}
  ]},
  {title:"Come Thou Fount",author:"Robert Robinson",tag:"Classic Hymn",key:"G",tempo:"Moderate",slides:[
    {section:"VERSE 1",text:"Come, Thou Fount of every blessing,\nTune my heart to sing Thy grace;\nStreams of mercy, never ceasing,\nCall for songs of loudest praise.n\Teach me ever to adore Thee\nMay I still Thy goodness prove;\nWhile the hope of endless glory\nFills my heart with joy and love."},
    {section:"VERSE 2",text:"Here I raise mine Ebenezer;\nHither by Thy help I'm come;\nAnd I hope, by Thy good pleasure,\nSafely to arrive at home.\n   Jesus sought me when a stranger,\nWandering from the fold of God;\nHe, to rescue me from danger,\nInterposed His precious blood."},
    {section:"VERSE 3",text:"O to grace how great a debtor\nDaily I'm constrained to be!\nLet Thy goodness, like a fetter,\nBind my wandering heart to Thee.\nProne to wander, Lord, I feel it,\nProne to leave the God I love;\nHere's my heart, O take and seal it,\nSeal it for Thy courts above."}
  ]},
  {title:"In Christ Alone",author:"Keith Getty & Stuart Townend",tag:"Contemporary Worship",key:"D",tempo:"Moderate",slides:[
    {section:"VERSE 1",text:"In Christ alone my hope is found,\nHe is my light, my strength, my song;\nThis I know, this I believe,\nIn Christ alone I stand secure.\nThere is no other, I have no need,\nNo power, no wisdom, no strength, no one;\nMy comforter, my all in all,\nHere in the love of Christ I stand."},
    {section:"CHORUS",text:"In Christ alone, in Christ alone,\nMy hope is built on nothing less;\nIn Christ alone, in Christ alone,\nMy soul finds rest and peace.\nIn Christ alone, in Christ alone,\nWhat heights of love, what depths of peace;\nWhen fears are stilled, when strivings cease,\nMy comforter, my all in all,\nHere in the love of Christ I stand."},
    {section:"VERSE 2",text:"When the storm of life is raging,\nAnd the waves of trouble rise,\nI can trust in His unchanging love,\nAnd find my strength in Him.n\nWhen the darkness seems to hide His face,\nI rest on His unchanging grace;\nIn every high and stormy gale,\nMy anchor holds within the veil."},
  ]},
  {title:"Great Are You Lord",author:"All Sons & Daughters",tag:"Contemporary Worship",key:"C",tempo:"Moderate",slides:[
    {section:"VERSE 1",text:"Great are You, great is Your name,\nGreat are Your works, great is Your fame.\nAll the earth will sing of You,\nGreat are You, great is Your name."},
    {section:"CHORUS",text:"Great are You, great is Your name,\nGreat are Your works, great is Your fame.\nAll the earth will sing of You,\nGreat are You, great is Your name."},
    {section:"VERSE 2",text:"You're the God who saves the lost,\nYou're the Lord who makes the broken whole.\nYou're the One who reigns supreme,\nGreat are You, great is Your name."}
  ]}
];

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
  '1 Corinthians':   [31,16,23,21,13,20,40,34,29,53,18,15,13,40,58,24],
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
  // Clean the ref before displaying — remove any accidental double-colon
  const cleanRef = cleanBibRef(ref);
  if (refEl) refEl.textContent = cleanRef;

  if (!verses) {
    if (textEl) textEl.innerHTML = `<div class="bib-loading">
      <div class="bib-spinner"></div>Loading ${escapeHTML(cleanRef)}…</div>`;
    return;
  }

  _bib.lastPassage = { ref: cleanRef, verses };

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
  const versionSel  = document.getElementById('bible-version-sel');
  const version     = versionSel?.options[versionSel.selectedIndex]?.text || 'KJV';

  // Parse book+chapter from ref so we can build clean per-verse labels
  // ref format examples: "John 3:16"  "John 3:5-6"  "Psalm 23"
  const refBase = ref.replace(/:\d+.*$/, '').trim(); // e.g. "John 3"

  S.songIdx = null;

  if (onePerSlide) {
    S.slides = verses.map(v => ({
      // Section label: "John 3:16" — never "John 3:16:16"
      section: `${refBase}:${v.num}`,
      text:    (showRef ? `${refBase}:${v.num}\n\n` : '') + v.text,
      version,
    }));
  } else {
    // Range label uses the clean ref already built by buildBibRef
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

const TYPE_ICONS  = {song:'🎵',scripture:'📖',sermon:'🎤',announcement:'📢',timer:'⏱'};
const TYPE_LABELS = {song:'Song',scripture:'Scripture',sermon:'Sermon',announcement:'Announcement',timer:'Timer'};

const BACKGROUNDS = [
  {id:'cosmic',   name:'Dark Cosmic', bg:'radial-gradient(ellipse at 28% 28%,#1c0f38 0%,#08051a 55%,#020208 100%)', textColor:'#f6f2ec'},
  {id:'black',    name:'Solid Black',  bg:'#000000', textColor:'#f0eeea'},
  {id:'deepblue', name:'Deep Blue',    bg:'radial-gradient(ellipse at center,#081424 0%,#020a14 100%)', textColor:'#e8f0f8'},
  {id:'crimson',  name:'Crimson',      bg:'radial-gradient(ellipse at center,#1a0808 0%,#080202 100%)', textColor:'#fef0f0'},
  {id:'forest',   name:'Forest',       bg:'radial-gradient(ellipse at center,#081a0c 0%,#020804 100%)', textColor:'#eefef2'},
  {id:'gold',     name:'Royal Gold',   bg:'radial-gradient(ellipse at center,#1a1408 0%,#060400 100%)', textColor:'#fef8e8'},
  {id:'slate',    name:'Slate Blue',   bg:'radial-gradient(ellipse at 28% 28%,#141828 0%,#080a0e 100%)', textColor:'#e8ecf4'},
  {id:'white',    name:'Pure White',   bg:'radial-gradient(ellipse at center,#faf8f5 0%,#ede9e0 100%)', textColor:'#1a1814'},
  {id:'purple',   name:'Deep Purple',  bg:'radial-gradient(ellipse at 28% 28%,#1a0830 0%,#0a0412 100%)', textColor:'#f0e8ff'},
  {id:'teal',     name:'Dark Teal',    bg:'radial-gradient(ellipse at center,#041418 0%,#020a0c 100%)', textColor:'#e0f8f8'},
];

const THEMES = [
  {id:'classic', name:'Classic', icon:'✦', font:'Playfair Display', shadow:'soft'},
  {id:'modern',  name:'Modern',  icon:'◉', font:'Lato',             shadow:'none'},
  {id:'regal',   name:'Regal',   icon:'♔', font:'Cinzel',           shadow:'glow'},
  {id:'bold',    name:'Bold',    icon:'⬛', font:'Lato',             shadow:'hard'},
  {id:'elegant', name:'Elegant', icon:'✿', font:'Playfair Display', shadow:'outline'},
  {id:'minimal', name:'Minimal', icon:'—', font:'Lato',             shadow:'none'},
];

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
let SONGS = JSON.parse(localStorage.getItem('bw_songs') || 'null') || JSON.parse(JSON.stringify(DEFAULT_SONGS));
let PRESENTATIONS = JSON.parse(localStorage.getItem('bw_presentations') || '[]');

let S = {
  songIdx: null, slides: [], cur: 0,
  live: false, blanked: false, logo: false, frozen: false, fontSize: 26,
  projWin: null, stageWin: null,
  timer: {total:300, rem:300, running:false, projected:false, iv:null, countUp:false},
  so: [], soActive: -1,
  bgId: 'cosmic',
  format: {font:'Playfair Display', align:'center', bold:false, italic:false, shadow:'soft', color:'#f6f2ec', lineHeight:'1.65'},
  lowerThird: {active:false, text:'', style:'default'},
  autoAdvance: {iv:null},
  loop: false, ccli: '', bibleVersion: 'NIV',
  transName: 'fade', transSpeed: 0.5,
  deco: {grid:true, corners:true},
  ndi: {active:false, name:'', res:'1920x1080', fps:'30', alpha:'no', group:'public'},
  appSettings: {showCcli:true, showTitle:true, showSection:true, confirmLive:false, autoSave:true, churchName:'', logoText:'Bride Worship', bibleVer:'NIV'},
};

let _slideNotes    = {};
let _editSongIdx   = -1;
let _editorSlides  = [];
let _presEditIdx   = -1;
let _presSlides    = [];

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
function init() {
  buildSongLibrary();
  buildBgGrid();
  buildThemeGrid();
  buildColorRow();
  applyBgById(S.bgId);
  renderTimerDisp();
  renderPresentationList();
  loadAppSettings();
}

function saveSongsToStorage() {
  try { localStorage.setItem('bw_songs', JSON.stringify(SONGS)); } catch(e) {}
}
function savePresentationsToStorage() {
  try { localStorage.setItem('bw_presentations', JSON.stringify(PRESENTATIONS)); } catch(e) {}
}

/* ══════════════════════════════════════
   LIBRARY BUILD
══════════════════════════════════════ */
function buildSongLibrary() {
  const c = document.getElementById('ls-songs');
  if (!c) return;
  c.innerHTML = SONGS.map((s, i) => `
    <div class="lib-item" id="li-${i}" onclick="loadSong(${i})">
      <div class="li-title">${s.title}</div>
      <div class="li-sub">${s.author}${s.key?' · Key: '+s.key:''} · ${s.tag}</div>
      <button class="li-edit-btn" onclick="event.stopPropagation();openSongEditor(${i})">✎ Edit</button>
    </div>`).join('');
}

function buildBgGrid() {
  const g = document.getElementById('bg-grid');
  if (!g) return;
  g.innerHTML = BACKGROUNDS.map(bg => `
    <div class="bg-swatch ${bg.id===S.bgId?'active':''}" id="bg-swatch-${bg.id}"
      onclick="pickBg('${bg.id}')" style="background:${bg.bg};">
      <div class="bg-swatch-label">${bg.name}</div>
    </div>`).join('');
}

function buildThemeGrid() {
  const g = document.getElementById('theme-grid');
  if (!g) return;
  g.innerHTML = THEMES.map(t => `
    <div class="theme-card" id="theme-${t.id}" onclick="applyTheme('${t.id}')">
      <div class="theme-card-preview">${t.icon}</div>
      <div class="theme-card-name">${t.name}</div>
    </div>`).join('');
}

function buildColorRow() {
  const colors = ['#f6f2ec','#ffffff','#c9a84c','#4a90d9','#4caf7a','#e05050','#d4a017','#a78bfa'];
  const row = document.getElementById('color-row');
  if (!row) return;
  row.innerHTML = colors.map(c => `
    <div class="fmt-swatch ${S.format.color===c?'active':''}"
      style="background:${c};" title="${c}"
      onclick="pickColor('${c}',this)"></div>`).join('');
}

function pickColor(color, el) {
  document.querySelectorAll('.fmt-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  setTextColor(color);
}

function renderPresentationList() {
  const list = document.getElementById('presentations-list');
  if (!list) return;
  if (!PRESENTATIONS.length) {
    list.innerHTML = '<div class="lib-empty" style="padding:20px 12px;">No presentations yet.<br>Create one above.</div>';
    return;
  }
  list.innerHTML = PRESENTATIONS.map((p, i) => `
    <div class="pres-item" id="pres-li-${i}" onclick="loadPresentation(${i})">
      <div class="pres-item-icon">📊</div>
      <div class="pres-item-info">
        <div class="pres-item-title">${p.title}</div>
        <div class="pres-item-sub">${p.author||''} · ${p.slides.length} slide${p.slides.length!==1?'s':''}</div>
      </div>
      <button class="pres-item-del" onclick="event.stopPropagation();openEditPresentation(${i})" title="Edit">✎</button>
      <button class="pres-item-del" onclick="event.stopPropagation();deletePresentation(${i})" title="Delete">✕</button>
    </div>`).join('');
}

/* ══════════════════════════════════════
   TAB SWITCHING
══════════════════════════════════════ */
function topTab(btn) {
  // Highlight topbar tab
  document.querySelectorAll('.tab-btn[data-lib]').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  // Switch library section
  const libId = btn.getAttribute('data-lib');
  if (libId) {
    document.querySelectorAll('.lib-section').forEach(s => s.classList.remove('on'));
    document.querySelectorAll('.ltab').forEach(t => t.classList.remove('on'));
    const sec = document.getElementById(libId);
    if (sec) sec.classList.add('on');
    // Sync library sub-tab highlight
    const ltabMap = {'ls-songs':'ltab-songs','ls-scripture':'ltab-scripture','ls-media':'ltab-media','ls-presentations':'ltab-presentations'};
    const ltabId = ltabMap[libId];
    if (ltabId) document.getElementById(ltabId)?.classList.add('on');
    // Update search placeholder
    const search = document.getElementById('search');
    if (search) {
      const placeholders = {'ls-songs':'Search songs…','ls-scripture':'Search scripture…','ls-media':'Search media…','ls-presentations':'Search presentations…'};
      search.placeholder = placeholders[libId] || 'Search…';
    }
  }
}

function centerTab(btn, panelId) {
  document.querySelectorAll('.ctab').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  ['slides-view','service-view','timer-view'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const panel = document.getElementById(panelId);
  if (panel) panel.style.display = 'flex';
}

function libTab(btn, sectionId) {
  document.querySelectorAll('.ltab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.lib-section').forEach(s => s.classList.remove('on'));
  const sec = document.getElementById(sectionId);
  if (sec) sec.classList.add('on');
  // Keep topbar in sync
  const libToTop = {'ls-songs':'songs','ls-scripture':'scripture','ls-media':'media','ls-presentations':'presentations'};
  const topKey = libToTop[sectionId];
  document.querySelectorAll('.tab-btn[data-lib]').forEach(b => {
    b.classList.toggle('on', b.getAttribute('data-lib') === sectionId);
  });
}

/* ══════════════════════════════════════
   SONG LOADING
══════════════════════════════════════ */
function loadSong(idx) {
  S.songIdx = idx;
  S.slides  = SONGS[idx].slides;
  S.cur     = 0;
  S.logo    = false;
  document.getElementById('logo-btn')?.classList.remove('on');
  document.querySelectorAll('#ls-songs .lib-item').forEach(e => e.classList.remove('sel'));
  document.getElementById('li-' + idx)?.classList.add('sel');
  stopAutoAdvance();
  renderQueue();
  renderSlide();
  startAutoAdvance();
  loadCurrentNote();
  // Switch to slides view
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
}

function loadPresentation(idx) {
  const p = PRESENTATIONS[idx];
  if (!p) return;
  S.songIdx = null;
  S.slides  = p.slides.map(sl => ({section: sl.section || 'SLIDE', text: sl.text || ''}));
  S.cur     = 0;
  document.querySelectorAll('.pres-item').forEach(e => e.classList.remove('sel'));
  document.getElementById('pres-li-' + idx)?.classList.add('sel');
  stopAutoAdvance();
  renderQueue();
  renderSlide();
  startAutoAdvance();
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
}

function queueScripture(ref, text) {
  S.songIdx = null;
  S.slides  = [{section: ref, text, version: S.bibleVersion || 'NIV'}];
  S.cur     = 0;
  document.querySelectorAll('.lib-item').forEach(e => e.classList.remove('sel'));
  renderQueue();
  renderSlide();
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
}

function addScripture() {
  const raw = document.getElementById('sc-ref')?.value.trim();
  if (!raw) return;
  const key  = raw.toLowerCase().trim();
  const text = SCRIPTURE_DB[key] || `"${raw}" — Reference queued. Text not found in local database.`;
  queueScripture(raw, text);
  document.getElementById('sc-ref').value = '';
}

function showAlert(title, text) {
  S.songIdx = null;
  S.slides  = [{section:'ANNOUNCEMENT', text: title + '\n\n' + text}];
  S.cur     = 0;
  renderQueue();
  renderSlide();
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
}

function sendCustomAlert() {
  const title = document.getElementById('custom-alert-title')?.value.trim();
  const body  = document.getElementById('custom-alert-body')?.value.trim();
  if (!title && !body) return;
  showAlert(title || 'Announcement', body || title);
  document.getElementById('custom-alert-title').value = '';
  document.getElementById('custom-alert-body').value  = '';
}

/* ══════════════════════════════════════
   QUEUE & SLIDE RENDERING
══════════════════════════════════════ */
function renderQueue() {
  const q = document.getElementById('queue');
  if (!q) return;
  if (!S.slides.length) {
    q.innerHTML = '<div class="queue-empty">— Select a song or scripture to populate the queue —</div>';
    return;
  }
  q.innerHTML = S.slides.map((sl, i) => {
    const isCur  = i === S.cur;
    const isLive = S.live && isCur;
    const prev   = (sl.text || '').replace(/\n/g,' ').substring(0, 55) + (sl.text.length > 55 ? '…' : '');
    return `<div class="thumb ${isCur?'cur':''} ${isLive?'live':''}" onclick="jumpSlide(${i})">
      <div class="thumb-img">
        ${isLive ? '<div class="thumb-live-badge">LIVE</div>' : ''}
        <div class="thumb-text">${prev}</div>
      </div>
      <div class="thumb-label">${sl.section || ''}</div>
    </div>`;
  }).join('');
  setTimeout(() => {
    const cur = q.querySelector('.thumb.cur');
    if (cur) cur.scrollIntoView({behavior:'smooth', block:'nearest', inline:'nearest'});
  }, 50);
}

function renderSlide() {
  if (!S.slides.length) return;
  const sl   = S.slides[S.cur];
  const html = (sl.text || '').replace(/\n/g, '<br>');
  const song = S.songIdx !== null ? SONGS[S.songIdx].title : '';
  const cfg  = S.appSettings;

  const titleEl = document.getElementById('s-title');
  if (titleEl) titleEl.textContent = cfg.showTitle ? (song || sl.section || '') : '';

  const lEl = document.getElementById('s-text');
  if (lEl) { lEl.innerHTML = html; applyStyleToEl(lEl); }

  const footerEl = document.getElementById('s-footer');
  if (footerEl) {
    const parts = [];
    if (cfg.showSection && sl.section) parts.push(sl.section);
    if (sl.version) parts.push(sl.version);
    if (cfg.showCcli && S.ccli) parts.push('CCLI #' + S.ccli);
    footerEl.textContent = parts.join('  ·  ');
  }

  const oRef = document.getElementById('o-ref');
  const oTxt = document.getElementById('o-txt');
  if (oRef) oRef.textContent = song ? `${song} · ${sl.section || ''}` : (sl.section || '');
  if (oTxt) oTxt.innerHTML   = html;

  const ctr = document.getElementById('ctr');
  if (ctr) ctr.innerHTML = `<b>${S.cur + 1}</b> / <b>${S.slides.length}</b>`;

  renderQueue();
  push();
  pushStage();
  loadCurrentNote();
}

function applyStyleToEl(el) {
  const f = S.format;
  el.style.fontFamily  = `'${f.font}', 'Playfair Display', serif`;
  el.style.textAlign   = f.align;
  el.style.fontWeight  = f.bold   ? '700' : '400';
  el.style.fontStyle   = f.italic ? 'italic' : 'normal';
  el.style.color       = f.color;
  el.style.lineHeight  = document.getElementById('line-spacing')?.value || f.lineHeight || '1.65';
  el.style.fontSize    = S.fontSize + 'px';
  const shadows = {
    none:    'none',
    soft:    '0 2px 20px rgba(0,0,0,.85)',
    hard:    '2px 2px 0px rgba(0,0,0,.9)',
    glow:    '0 0 30px rgba(201,168,76,.6), 0 2px 20px rgba(0,0,0,.8)',
    outline: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
  };
  el.style.textShadow = shadows[f.shadow] || shadows.soft;
}

function jumpSlide(i) { S.cur = i; triggerTransAnim(); renderSlide(); }

function prevSlide() {
  if (S.cur > 0) { S.cur--; triggerTransAnim(); renderSlide(); }
  else if (S.loop && S.slides.length > 1) { S.cur = S.slides.length - 1; triggerTransAnim(); renderSlide(); }
}

function nextSlide() {
  if (S.cur < S.slides.length - 1) { S.cur++; triggerTransAnim(); renderSlide(); }
  else if (S.loop && S.slides.length > 1) { S.cur = 0; triggerTransAnim(); renderSlide(); }
}

/* ══════════════════════════════════════
   TRANSITIONS
══════════════════════════════════════ */
function triggerTransAnim() {
  if (S.transName === 'cut') return;
  const ms = document.getElementById('main-slide');
  if (!ms) return;
  ms.classList.remove('trans-fade', 'trans-slide', 'trans-zoom');
  document.documentElement.style.setProperty('--trans-speed', (S.transSpeed || 0.5) + 's');
  void ms.offsetWidth;
  ms.classList.add('trans-' + S.transName);
}

function pickTrans(el) {
  document.querySelectorAll('.trans-btn').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  const map = {'Fade':'fade', 'Slide':'slide', 'Dissolve':'zoom', 'Cut':'cut'};
  S.transName = map[el.textContent.trim()] || 'fade';
}

/* ══════════════════════════════════════
   LIVE / BLANK / LOGO / FREEZE
══════════════════════════════════════ */
function toggleLive() {
  if (!S.live && S.appSettings.confirmLive) {
    if (!confirm('Go LIVE now? Output will be visible to the audience.')) return;
  }
  S.live = !S.live;
  const dot    = document.getElementById('ld');
  const lbl    = document.getElementById('ls');
  const goBtn  = document.getElementById('go-btn');
  const screen = document.getElementById('out-screen');
  const badge  = document.getElementById('o-badge');
  dot?.classList.toggle('on', S.live);
  if (lbl) { lbl.textContent = S.live ? 'Live' : 'Offline'; lbl.classList.toggle('on', S.live); }
  if (goBtn) { goBtn.textContent = S.live ? 'END LIVE' : 'GO LIVE'; goBtn.classList.toggle('end', S.live); }
  screen?.classList.toggle('live', S.live);
  if (badge) { badge.textContent = S.live ? 'LIVE' : 'HIDDEN'; badge.classList.toggle('live', S.live); }
  renderQueue();
  push();
}

function toggleBlank() {
  S.blanked = !S.blanked;
  if (S.blanked) { S.logo = false; document.getElementById('logo-btn')?.classList.remove('on'); }
  document.getElementById('main-slide')?.classList.toggle('blanked', S.blanked);
  document.getElementById('blank-btn')?.classList.toggle('on', S.blanked);
  push();
}

function toggleLogo() {
  S.logo = !S.logo;
  document.getElementById('logo-btn')?.classList.toggle('on', S.logo);
  if (S.logo) {
    const logoText = S.appSettings.logoText || 'Bride Worship';
    const tEl = document.getElementById('s-title');
    const lEl = document.getElementById('s-text');
    if (tEl) tEl.textContent = logoText;
    if (lEl) {
      lEl.innerHTML = '<span style="font-family:Cinzel,serif;font-size:52px;color:#c9a84c;letter-spacing:6px;text-shadow:0 0 40px rgba(201,168,76,.5);">✦</span>';
      lEl.style.textAlign = 'center';
    }
    const fEl = document.getElementById('s-footer');
    if (fEl) fEl.textContent = '';
    const oRef = document.getElementById('o-ref');
    const oTxt = document.getElementById('o-txt');
    if (oRef) oRef.textContent = 'Logo';
    if (oTxt) oTxt.innerHTML   = '✦';
  } else { renderSlide(); }
  push();
}

function toggleFreeze() {
  S.frozen = !S.frozen;
  const ov  = document.getElementById('freeze-overlay');
  const btn = document.getElementById('freeze-btn');
  if (ov)  ov.classList.toggle('active', S.frozen);
  if (btn) btn.classList.toggle('on', S.frozen);
}

function resize(d) {
  S.fontSize = Math.min(72, Math.max(10, S.fontSize + d));
  const val = document.getElementById('sz-val');
  if (val) val.textContent = S.fontSize;
  const el = document.getElementById('s-text');
  if (el) applyStyleToEl(el);
  push();
}

/* ══════════════════════════════════════
   BACKGROUNDS
══════════════════════════════════════ */
function pickBg(id) {
  S.bgId = id;
  document.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  document.getElementById('bg-swatch-' + id)?.classList.add('active');
  applyBgById(id);
}

function applyBgById(id) {
  const bg = BACKGROUNDS.find(b => b.id === id) || BACKGROUNDS[0];
  applyBg(bg);
}

function applyBg(bg) {
  const slideBg = document.getElementById('slide-bg');
  const outBg   = document.getElementById('out-bg');
  if (slideBg) slideBg.style.background = bg.bg;
  if (outBg)   outBg.style.background   = bg.bg;
  S.format.color = bg.textColor;
  // Refresh color swatches
  buildColorRow();
  const el = document.getElementById('s-text');
  if (el) applyStyleToEl(el);
  push();
}

function setCustomBg(color) {
  S.bgId = 'custom';
  document.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
  const slideBg = document.getElementById('slide-bg');
  const outBg   = document.getElementById('out-bg');
  if (slideBg) slideBg.style.background = color;
  if (outBg)   outBg.style.background   = color;
  push();
}

function applyBgOpacity(val) {
  const slideBg = document.getElementById('slide-bg');
  if (slideBg) slideBg.style.opacity = val / 100;
  push();
}

function toggleDeco(type) {
  S.deco[type] = document.getElementById('deco-' + type)?.checked ?? true;
  if (type === 'grid') {
    document.getElementById('slide-grid')?.classList.toggle('hidden', !S.deco.grid);
  }
  if (type === 'corners') {
    ['c-tl','c-tr','c-bl','c-br'].forEach(id => {
      document.getElementById(id)?.classList.toggle('hidden', !S.deco.corners);
    });
  }
  push();
}

/* ══════════════════════════════════════
   TEXT FORMATTING
══════════════════════════════════════ */
function applyFormat() {
  S.format.shadow    = document.getElementById('fmt-shadow')?.value || 'soft';
  S.format.lineHeight = document.getElementById('line-spacing')?.value || '1.65';
  const el = document.getElementById('s-text');
  if (el) applyStyleToEl(el);
  push();
}

function toggleFmt(type) {
  S.format[type] = !S.format[type];
  document.getElementById('fmt-' + type)?.classList.toggle('on', S.format[type]);
  const el = document.getElementById('s-text');
  if (el) applyStyleToEl(el);
  push();
}

function setAlign(a) {
  S.format.align = a;
  ['left','center','right'].forEach(x => document.getElementById('align-' + x)?.classList.toggle('on', x === a));
  const el = document.getElementById('s-text');
  if (el) applyStyleToEl(el);
  push();
}

function setFont(val) {
  const map = {playfair:'Playfair Display', cinzel:'Cinzel', lato:'Lato', sans:'Arial, sans-serif'};
  S.format.font = map[val] || val;
  const el = document.getElementById('s-text');
  if (el) applyStyleToEl(el);
  push();
}

function setTextColor(color) {
  S.format.color = color;
  const el = document.getElementById('s-text');
  if (el) applyStyleToEl(el);
  push();
}

function applyTheme(id) {
  const t = THEMES.find(x => x.id === id);
  if (!t) return;
  document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
  document.getElementById('theme-' + id)?.classList.add('active');
  S.format.font   = t.font;
  S.format.shadow = t.shadow;
  const fontSelVal = {
    'Playfair Display':'playfair',
    'Cinzel':'cinzel',
    'Lato':'lato',
    'Arial, sans-serif':'sans'
  };
  const sel = document.getElementById('font-sel');
  if (sel) sel.value = fontSelVal[t.font] || 'playfair';
  const shadowSel = document.getElementById('fmt-shadow');
  if (shadowSel) shadowSel.value = t.shadow;
  const el = document.getElementById('s-text');
  if (el) applyStyleToEl(el);
  push();
}

/* ══════════════════════════════════════
   LOWER THIRD
══════════════════════════════════════ */
function sendLT() {
  const inp = document.getElementById('lt-input');
  const sel = document.getElementById('lt-style');
  if (!inp) return;
  S.lowerThird.text   = inp.value.trim();
  S.lowerThird.style  = sel ? sel.value : 'default';
  S.lowerThird.active = !!S.lowerThird.text;
  updateLTOverlay(S.lowerThird.text, S.lowerThird.style);
  push();
  pushStage();
}

function clearLT() {
  S.lowerThird.text   = '';
  S.lowerThird.active = false;
  const inp = document.getElementById('lt-input');
  if (inp) inp.value = '';
  updateLTOverlay('', 'default');
  push();
  pushStage();
}

function updateLTOverlay(text, style) {
  const ov    = document.getElementById('lt-overlay');
  const ovTxt = document.getElementById('lt-overlay-text');
  const outLt = document.getElementById('out-lt');
  if (ov) {
    ov.className = 'lt-overlay';
    if (text) { ov.classList.add('visible', 'lt-' + style); if (ovTxt) ovTxt.textContent = text; }
    else ov.classList.remove('visible');
  }
  if (outLt) {
    outLt.className = 'out-lt';
    if (text) { outLt.classList.add('visible', 'lt-' + style); outLt.textContent = text; }
    else outLt.classList.remove('visible');
  }
}

/* ══════════════════════════════════════
   LOOP / AUTO-ADVANCE
══════════════════════════════════════ */
function toggleLoop() {
  S.loop = !S.loop;
  document.getElementById('loop-btn')?.classList.toggle('on', S.loop);
}

function toggleAutoAdvance() {
  if (S.autoAdvance.iv) stopAutoAdvance();
  else startAutoAdvance();
}

function startAutoAdvance() {
  const sel  = document.getElementById('auto-sel');
  const secs = sel ? parseInt(sel.value) : 5;
  if (!secs || secs < 1) return;
  stopAutoAdvance();
  S.autoAdvance.iv = setInterval(() => {
    if (S.cur < S.slides.length - 1) nextSlide();
    else if (S.loop) { S.cur = 0; triggerTransAnim(); renderSlide(); }
    else stopAutoAdvance();
  }, secs * 1000);
  document.getElementById('auto-btn')?.classList.add('on');
}

function stopAutoAdvance() {
  clearInterval(S.autoAdvance.iv);
  S.autoAdvance.iv = null;
  document.getElementById('auto-btn')?.classList.remove('on');
}

function setAutoInterval(v) {
  if (S.autoAdvance.iv) { stopAutoAdvance(); startAutoAdvance(); }
}

/* ══════════════════════════════════════
   TIMER
══════════════════════════════════════ */
function renderTimerDisp() {
  let rem  = S.timer.rem;
  const m  = Math.floor(rem / 60);
  const s  = rem % 60;
  const str = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  const el  = document.getElementById('t-display');
  if (!el) return;
  el.textContent = str;
  el.className   = 'timer-display';
  if (rem <= 30 && rem > 10) el.classList.add('warning');
  if (rem <= 10) el.classList.add('urgent');
  if (S.timer.projected) pushTimerToProj(str);
  pushStage();
}

function setTimer(mins) { S.timer.rem = S.timer.total = mins * 60; renderTimerDisp(); }

function setTimerCustom() {
  const m = parseInt(document.getElementById('t-min')?.value) || 0;
  const s = parseInt(document.getElementById('t-sec')?.value) || 0;
  S.timer.rem = S.timer.total = m * 60 + s;
  renderTimerDisp();
}

function startTimer() {
  if (S.timer.running) return;
  S.timer.running = true;
  document.getElementById('tc-start').disabled = true;
  document.getElementById('tc-pause').disabled = false;
  S.timer.iv = setInterval(() => {
    if (S.timer.countUp) {
      S.timer.rem++;
      renderTimerDisp();
    } else {
      if (S.timer.rem > 0) { S.timer.rem--; renderTimerDisp(); }
      else {
        pauseTimer();
        const msg = document.getElementById('timer-end-msg')?.value.trim();
        if (msg && S.timer.projected) {
          const lEl = document.getElementById('s-text');
          if (lEl) { lEl.innerHTML = msg.replace(/\n/g,'<br>'); applyStyleToEl(lEl); }
        }
      }
    }
  }, 1000);
}

function pauseTimer() {
  S.timer.running = false;
  clearInterval(S.timer.iv);
  document.getElementById('tc-start').disabled = false;
  document.getElementById('tc-pause').disabled = true;
}

function resetTimer() {
  pauseTimer();
  S.timer.rem = S.timer.total;
  renderTimerDisp();
}

function toggleTimerProj() {
  S.timer.projected = !S.timer.projected;
  const btn  = document.getElementById('tc-proj');
  const note = document.getElementById('t-note');
  btn?.classList.toggle('on', S.timer.projected);
  if (note) note.textContent = S.timer.projected
    ? 'Timer is projected on live screen.'
    : 'Timer not projected — click "Project" to show on live screen.';
  if (!S.timer.projected && S.slides.length) renderSlide();
}

function pushTimerToProj(str) {
  if (!S.timer.projected) return;
  const tEl = document.getElementById('s-title');
  const lEl = document.getElementById('s-text');
  if (tEl) tEl.textContent = 'COUNTDOWN';
  if (lEl) {
    lEl.innerHTML = `<span style="font-family:'Cinzel',serif;font-size:${S.fontSize+22}px;letter-spacing:6px;color:var(--gold);text-shadow:0 0 40px rgba(201,168,76,.4);">${str}</span>`;
  }
}

/* ══════════════════════════════════════
   SERVICE ORDER
══════════════════════════════════════ */
function renderSO() {
  const list  = document.getElementById('so-list');
  const empty = document.getElementById('so-empty');
  if (!list) return;
  // Remove all existing items
  Array.from(list.querySelectorAll('.so-item')).forEach(el => el.remove());
  if (!S.so.length) {
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';
  S.so.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'so-item' + (S.soActive === i ? ' so-active' : '');
    div.innerHTML = `
      <span class="so-num">${i + 1}</span>
      <span class="so-icon">${TYPE_ICONS[item.type] || '📌'}</span>
      <div class="so-info">
        <div class="so-name">${item.name}</div>
        <div class="so-sub">${TYPE_LABELS[item.type] || item.type}</div>
      </div>
      <span class="so-badge ${item.type}">${TYPE_LABELS[item.type] || item.type}</span>
      <button class="so-ctrl" onclick="event.stopPropagation();moveSO(${i},-1)" title="Move up">↑</button>
      <button class="so-ctrl" onclick="event.stopPropagation();moveSO(${i},1)"  title="Move down">↓</button>
      <button class="so-ctrl so-del" onclick="event.stopPropagation();deleteSO(${i})" title="Delete">✕</button>`;
    div.addEventListener('click', () => activateSO(i));
    list.appendChild(div);
  });
  if (S.appSettings.autoSave) saveSOToStorage();
}

function addSOItem() {
  const name = document.getElementById('so-inp')?.value.trim();
  const type = document.getElementById('so-type')?.value || 'song';
  if (!name) return;
  S.so.push({name, type});
  document.getElementById('so-inp').value = '';
  renderSO();
}

function quickAdd(name, type) { S.so.push({name, type}); renderSO(); }

function moveSO(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= S.so.length) return;
  [S.so[i], S.so[j]] = [S.so[j], S.so[i]];
  if (S.soActive === i) S.soActive = j;
  else if (S.soActive === j) S.soActive = i;
  renderSO();
}

function deleteSO(i) {
  S.so.splice(i, 1);
  if (S.soActive >= S.so.length) S.soActive = S.so.length - 1;
  renderSO();
}

function activateSO(i) {
  S.soActive = i;
  renderSO();
  const item = S.so[i];
  if (item.type === 'timer') {
    centerTab(document.querySelectorAll('.ctab')[2], 'timer-view');
  } else {
    centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
    if (item.type === 'song') {
      const matchIdx = SONGS.findIndex(s => s.title.toLowerCase() === item.name.toLowerCase());
      if (matchIdx >= 0) loadSong(matchIdx);
    }
  }
}

function exportServiceOrder() {
  const data = { serviceOrder: S.so, exportedAt: new Date().toISOString() };
  downloadJSON(data, 'service-order.json');
}

function printServiceOrder() {
  const win = window.open('', '_blank', 'width=800,height=600');
  if (!win) return;
  const items = S.so.map((item, i) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">${i+1}</td>
     <td style="padding:8px 12px;border-bottom:1px solid #eee;">${TYPE_ICONS[item.type]} ${item.name}</td>
     <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;">${TYPE_LABELS[item.type]}</td></tr>`
  ).join('');
  win.document.write(`<!DOCTYPE html><html><head><title>Service Order</title>
    <style>body{font-family:sans-serif;padding:32px;} h2{margin-bottom:4px;} p{color:#888;margin-bottom:20px;} table{width:100%;border-collapse:collapse;} th{background:#f5f5f5;padding:8px 12px;text-align:left;}</style>
    </head><body>
    <h2>${S.appSettings.churchName || 'BrideWorship Pro'} — Service Order</h2>
    <p>Printed: ${new Date().toLocaleString()}</p>
    <table><thead><tr><th>#</th><th>Item</th><th>Type</th></tr></thead><tbody>${items}</tbody></table>
    <script>window.onload=()=>window.print()<\/script></body></html>`);
  win.document.close();
}

function saveSOToStorage() {
  try { localStorage.setItem('bw_so', JSON.stringify(S.so)); } catch(e) {}
}

/* ══════════════════════════════════════
   SONG EDITOR MODAL
══════════════════════════════════════ */
function openSongEditor(idx) {
  _editSongIdx  = idx;
  _editorSlides = idx >= 0
    ? JSON.parse(JSON.stringify(SONGS[idx].slides))
    : [{section:'VERSE 1', text:''}];
  const modal = document.getElementById('song-editor-modal');
  const title = document.getElementById('se-modal-title');
  if (title) title.textContent = idx >= 0 ? 'Edit Song' : 'Add New Song';
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  setVal('se-title-inp',    idx >= 0 ? SONGS[idx].title  : '');
  setVal('se-author-inp',   idx >= 0 ? SONGS[idx].author : '');
  setVal('se-key-inp',      idx >= 0 ? SONGS[idx].key    : '');
  setVal('se-tempo-inp',    idx >= 0 ? SONGS[idx].tempo  : '');
  setVal('se-tag-inp',      idx >= 0 ? SONGS[idx].tag    : '');
  setVal('se-ccli-song-inp',idx >= 0 ? (SONGS[idx].ccliSong || '') : '');
  renderEditorSlides();
  if (modal) modal.style.display = 'flex';
}

function closeSongEditor() {
  const modal = document.getElementById('song-editor-modal');
  if (modal) modal.style.display = 'none';
}

function renderEditorSlides() {
  const list = document.getElementById('se-slides-list');
  if (!list) return;
  list.innerHTML = _editorSlides.map((sl, i) => `
    <div style="display:flex;flex-direction:column;gap:5px;padding:9px 10px;background:var(--bg-card);border:1px solid var(--border-dim);border-radius:5px;">
      <div style="display:flex;gap:6px;align-items:center;">
        <input class="se-inp" style="width:150px;" value="${sl.section||''}" placeholder="Section label…"
          oninput="_editorSlides[${i}].section=this.value">
        <div style="flex:1;font-size:10px;color:var(--text-3);">Slide ${i+1} of ${_editorSlides.length}</div>
        ${i > 0 ? `<button style="background:none;border:1px solid var(--border-dim);color:var(--text-3);padding:2px 6px;border-radius:3px;cursor:pointer;font-size:11px;" onclick="moveEditorSlide(${i},-1)">↑</button>` : ''}
        ${i < _editorSlides.length-1 ? `<button style="background:none;border:1px solid var(--border-dim);color:var(--text-3);padding:2px 6px;border-radius:3px;cursor:pointer;font-size:11px;" onclick="moveEditorSlide(${i},1)">↓</button>` : ''}
        <button style="background:none;border:1px solid rgba(224,80,80,.3);color:var(--red);padding:2px 7px;border-radius:3px;cursor:pointer;font-size:11px;" onclick="removeEditorSlide(${i})">✕</button>
      </div>
      <textarea class="se-inp" style="min-height:75px;resize:vertical;font-size:12px;line-height:1.6;"
        placeholder="Lyrics / text for this slide…"
        oninput="_editorSlides[${i}].text=this.value">${sl.text||''}</textarea>
    </div>`).join('');
}

function addEditorSlide() {
  _editorSlides.push({section:'VERSE ' + (_editorSlides.length + 1), text:''});
  renderEditorSlides();
}

function addCommonSections() {
  const sections = ['VERSE 1','VERSE 2','CHORUS','VERSE 3','BRIDGE','OUTRO'];
  const existing = _editorSlides.map(s => s.section);
  sections.forEach(sec => {
    if (!existing.includes(sec)) _editorSlides.push({section:sec, text:''});
  });
  renderEditorSlides();
}

function removeEditorSlide(i) {
  _editorSlides.splice(i, 1);
  renderEditorSlides();
}

function moveEditorSlide(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= _editorSlides.length) return;
  [_editorSlides[i], _editorSlides[j]] = [_editorSlides[j], _editorSlides[i]];
  renderEditorSlides();
}

function previewSong() {
  const validSlides = _editorSlides.filter(s => s.text.trim());
  if (!validSlides.length) { alert('Add at least one slide with text to preview.'); return; }
  S.songIdx = null;
  S.slides  = validSlides;
  S.cur     = 0;
  renderQueue();
  renderSlide();
  closeSongEditor();
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
}

function saveSong() {
  const title = document.getElementById('se-title-inp')?.value.trim();
  if (!title) { alert('Song title is required.'); return; }
  const song = {
    title,
    author:   document.getElementById('se-author-inp')?.value.trim()   || 'Unknown',
    key:      document.getElementById('se-key-inp')?.value.trim()       || '',
    tempo:    document.getElementById('se-tempo-inp')?.value.trim()     || '',
    tag:      document.getElementById('se-tag-inp')?.value.trim()       || 'Worship',
    ccliSong: document.getElementById('se-ccli-song-inp')?.value.trim() || '',
    slides:   _editorSlides.filter(s => s.text.trim())
  };
  if (!song.slides.length) { alert('Add at least one slide with text.'); return; }
  if (_editSongIdx >= 0) SONGS[_editSongIdx] = song;
  else SONGS.push(song);
  saveSongsToStorage();
  buildSongLibrary();
  closeSongEditor();
}

/* ══════════════════════════════════════
   CUSTOM SLIDE MODAL
══════════════════════════════════════ */
function openCustomSlide() {
  const modal = document.getElementById('custom-modal');
  if (modal) modal.style.display = 'flex';
}
function closeCustomModal() {
  const modal = document.getElementById('custom-modal');
  if (modal) modal.style.display = 'none';
}

function saveCustomSlide() {
  const label  = document.getElementById('cs-label')?.value.trim() || 'CUSTOM';
  const rawText= document.getElementById('cs-text')?.value.trim();
  const split  = document.getElementById('cs-split')?.checked;
  const mode   = document.querySelector('input[name="cs-mode"]:checked')?.value || 'replace';
  if (!rawText) { closeCustomModal(); return; }

  let newSlides;
  if (split) {
    const paragraphs = rawText.split(/\n\s*\n/).filter(p => p.trim());
    newSlides = paragraphs.map((p, i) => ({section: label + (paragraphs.length > 1 ? ' ' + (i+1) : ''), text: p.trim()}));
  } else {
    newSlides = [{section: label, text: rawText}];
  }

  if (mode === 'replace')     { S.slides = newSlides; S.cur = 0; }
  else if (mode === 'append') { S.slides = [...S.slides, ...newSlides]; S.cur = S.slides.length - 1; }
  else if (mode === 'insert') { S.slides.splice(S.cur + 1, 0, ...newSlides); S.cur = S.cur + 1; }

  closeCustomModal();
  renderQueue();
  renderSlide();
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
}

/* ══════════════════════════════════════
   PRESENTATION MODAL
══════════════════════════════════════ */
function openNewPresentation() {
  _presEditIdx = -1;
  _presSlides  = [{section:'SLIDE 1', text:''}];
  document.getElementById('pres-title-inp').value  = '';
  document.getElementById('pres-author-inp').value = '';
  document.getElementById('pres-modal-title').textContent = 'New Presentation';
  renderPresEditorSlides();
  document.getElementById('pres-modal').style.display = 'flex';
}

function openEditPresentation(idx) {
  _presEditIdx = idx;
  _presSlides  = JSON.parse(JSON.stringify(PRESENTATIONS[idx].slides));
  document.getElementById('pres-title-inp').value  = PRESENTATIONS[idx].title  || '';
  document.getElementById('pres-author-inp').value = PRESENTATIONS[idx].author || '';
  document.getElementById('pres-modal-title').textContent = 'Edit Presentation';
  renderPresEditorSlides();
  document.getElementById('pres-modal').style.display = 'flex';
}

function closePresModal() {
  document.getElementById('pres-modal').style.display = 'none';
}

function renderPresEditorSlides() {
  const list = document.getElementById('pres-slides-list');
  if (!list) return;
  list.innerHTML = _presSlides.map((sl, i) => `
    <div style="display:flex;flex-direction:column;gap:5px;padding:9px 10px;background:var(--bg-card);border:1px solid var(--border-dim);border-radius:5px;">
      <div style="display:flex;gap:6px;align-items:center;">
        <input class="se-inp" style="width:150px;" value="${sl.section||''}" placeholder="Slide label…"
          oninput="_presSlides[${i}].section=this.value">
        <div style="flex:1;font-size:10px;color:var(--text-3);">Slide ${i+1}</div>
        <button style="background:none;border:1px solid rgba(224,80,80,.3);color:var(--red);padding:2px 7px;border-radius:3px;cursor:pointer;font-size:11px;" onclick="removePresSlide(${i})">✕</button>
      </div>
      <textarea class="se-inp" style="min-height:70px;resize:vertical;font-size:12px;line-height:1.6;"
        placeholder="Slide content…"
        oninput="_presSlides[${i}].text=this.value">${sl.text||''}</textarea>
    </div>`).join('');
}

function addPresSlide() {
  _presSlides.push({section:'SLIDE ' + (_presSlides.length + 1), text:''});
  renderPresEditorSlides();
}

function removePresSlide(i) {
  _presSlides.splice(i, 1);
  renderPresEditorSlides();
}

function savePresentation() {
  const title = document.getElementById('pres-title-inp')?.value.trim();
  if (!title) { alert('Presentation title is required.'); return; }
  const pres = {
    title,
    author: document.getElementById('pres-author-inp')?.value.trim() || '',
    slides: _presSlides.filter(s => s.text.trim()),
    createdAt: new Date().toISOString()
  };
  if (!pres.slides.length) { alert('Add at least one slide with content.'); return; }
  if (_presEditIdx >= 0) PRESENTATIONS[_presEditIdx] = pres;
  else PRESENTATIONS.push(pres);
  savePresentationsToStorage();
  renderPresentationList();
  closePresModal();
}

function deletePresentation(idx) {
  if (!confirm('Delete this presentation?')) return;
  PRESENTATIONS.splice(idx, 1);
  savePresentationsToStorage();
  renderPresentationList();
}

function importPresentation() {
  document.getElementById('import-pres-input').click();
}

function handlePresImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      const items = Array.isArray(data) ? data : [data];
      items.forEach(p => {
        if (p.title && p.slides) PRESENTATIONS.push(p);
      });
      savePresentationsToStorage();
      renderPresentationList();
      alert(`Imported ${items.length} presentation(s).`);
    } catch(err) { alert('Import failed: invalid file format.'); }
  };
  reader.readAsText(file);
  event.target.value = '';
}

/* ══════════════════════════════════════
   IMPORT / EXPORT SONGS
══════════════════════════════════════ */
function importSongs() {
  document.getElementById('import-file-input').click();
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data  = JSON.parse(e.target.result);
      const songs = Array.isArray(data) ? data : (data.songs || [data]);
      let count = 0;
      songs.forEach(s => {
        if (s.title && s.slides) { SONGS.push(s); count++; }
      });
      saveSongsToStorage();
      buildSongLibrary();
      alert(`Imported ${count} song(s) successfully.`);
    } catch (err) { alert('Import failed: ' + err.message); }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function exportSongs() {
  downloadJSON({songs: SONGS, exportedAt: new Date().toISOString(), app:'BrideWorship Pro'}, 'bw-songs.json');
}

function handleMediaImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const extra = document.getElementById('ls-media-extra');
  if (extra) {
    const isVideo = file.type.startsWith('video');
    extra.innerHTML += `<div class="lib-item"><div class="li-title">${file.name}</div><div class="li-sub">Imported · ${isVideo?'Video':'Image'}</div><div class="li-tag">${isVideo?'Video':'Image'}</div></div>`;
  }
  event.target.value = '';
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function resetAllData() {
  SONGS = JSON.parse(JSON.stringify(DEFAULT_SONGS));
  saveSongsToStorage();
  buildSongLibrary();
  closeSettings();
  alert('Song data has been reset to defaults.');
}

/* ══════════════════════════════════════
   NDI SETTINGS MODAL
══════════════════════════════════════ */
function openNDISettings() {
  document.getElementById('ndi-modal').style.display = 'flex';
}
function closeNDISettings() {
  document.getElementById('ndi-modal').style.display = 'none';
}
function saveNDISettings() {
  S.ndi.name  = document.getElementById('ndi-name')?.value  || 'BrideWorship Pro';
  S.ndi.res   = document.getElementById('ndi-res')?.value   || '1920x1080';
  S.ndi.fps   = document.getElementById('ndi-fps')?.value   || '30';
  S.ndi.alpha = document.getElementById('ndi-alpha')?.value || 'no';
  S.ndi.group = document.getElementById('ndi-group')?.value || 'public';
  const label = document.getElementById('out-res-label');
  if (label) label.textContent = S.ndi.res.replace('x','×');
  closeNDISettings();
}
function toggleNDI() {
  S.ndi.active = !S.ndi.active;
  const dot = document.getElementById('ndi-status-dot');
  const lbl = document.getElementById('ndi-status-label');
  const btn = document.getElementById('ndi-toggle-btn');
  if (dot) dot.style.background = S.ndi.active ? 'var(--green)' : 'var(--text-3)';
  if (lbl) lbl.textContent      = S.ndi.active ? 'Broadcasting: ' + S.ndi.name : 'Not broadcasting';
  if (btn) btn.textContent      = S.ndi.active ? 'Stop NDI' : 'Start NDI';
}

/* ══════════════════════════════════════
   APP SETTINGS MODAL
══════════════════════════════════════ */
function openSettings() {
  const cfg = S.appSettings;
  const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value  = val || ''; };
  setChk('s-show-ccli',    cfg.showCcli);
  setChk('s-show-title',   cfg.showTitle);
  setChk('s-show-section', cfg.showSection);
  setChk('s-confirm-live', cfg.confirmLive);
  setChk('s-auto-save',    cfg.autoSave);
  setVal('s-church-name',  cfg.churchName);
  setVal('s-logo-text',    cfg.logoText);
  setVal('s-bible-ver',    cfg.bibleVer);
  document.getElementById('settings-modal').style.display = 'flex';
}
function closeSettings() {
  document.getElementById('settings-modal').style.display = 'none';
}
function saveSettings() {
  const getChk = id => document.getElementById(id)?.checked ?? true;
  const getVal = id => document.getElementById(id)?.value || '';
  S.appSettings = {
    showCcli:    getChk('s-show-ccli'),
    showTitle:   getChk('s-show-title'),
    showSection: getChk('s-show-section'),
    confirmLive: getChk('s-confirm-live'),
    autoSave:    getChk('s-auto-save'),
    churchName:  getVal('s-church-name'),
    logoText:    getVal('s-logo-text') || 'Bride Worship',
    bibleVer:    getVal('s-bible-ver') || 'NIV',
  };
  S.bibleVersion = S.appSettings.bibleVer;
  try { localStorage.setItem('bw_settings', JSON.stringify(S.appSettings)); } catch(e) {}
  if (S.slides.length) renderSlide();
  closeSettings();
}
function loadAppSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('bw_settings') || 'null');
    if (saved) S.appSettings = {...S.appSettings, ...saved};
  } catch(e) {}
  S.bibleVersion = S.appSettings.bibleVer || 'NIV';
}

/* ══════════════════════════════════════
   HOTKEYS MODAL
══════════════════════════════════════ */
function openHotkeys()  { document.getElementById('hotkeys-modal').style.display = 'flex'; }
function closeHotkeys() { document.getElementById('hotkeys-modal').style.display = 'none'; }

/* ══════════════════════════════════════
   NOTES PANEL
══════════════════════════════════════ */
function toggleNotesPanel() {
  const panel  = document.getElementById('notes-panel');
  const btn    = document.getElementById('notes-toggle');
  const ta     = document.getElementById('notes-textarea');
  if (!panel) return;
  const collapsed = panel.classList.toggle('collapsed');
  if (btn) btn.textContent = collapsed ? '▶ Show' : '▼ Hide';
  if (ta)  ta.style.display = collapsed ? 'none' : '';
}

function saveCurrentNote() {
  const key = (S.songIdx ?? 'sc') + '-' + S.cur;
  const ta  = document.getElementById('notes-textarea');
  if (ta) _slideNotes[key] = ta.value;
  pushStage();
}

function loadCurrentNote() {
  const key = (S.songIdx ?? 'sc') + '-' + S.cur;
  const ta  = document.getElementById('notes-textarea');
  if (ta) ta.value = _slideNotes[key] || '';
}

/* ══════════════════════════════════════
   CCLI
══════════════════════════════════════ */
function updateCCLI() {
  S.ccli = document.getElementById('ccli-input')?.value || '';
  if (S.slides.length) renderSlide();
}

/* ══════════════════════════════════════
   SEARCH / FILTER
══════════════════════════════════════ */
function filterSongs() {
  const q = document.getElementById('search')?.value.toLowerCase().trim() || '';
  document.querySelectorAll('#ls-songs .lib-item').forEach((item, i) => {
    if (i >= SONGS.length) return;
    const s = SONGS[i];
    const match = !q
      || s.title.toLowerCase().includes(q)
      || (s.author||'').toLowerCase().includes(q)
      || (s.tag||'').toLowerCase().includes(q)
      || (s.key||'').toLowerCase().includes(q);
    item.style.display = match ? '' : 'none';
  });
}

/* ══════════════════════════════════════
   PROJECTION WINDOWS
══════════════════════════════════════ */
function openProjection() {
  if (S.projWin && !S.projWin.closed) { S.projWin.focus(); return; }
  S.projWin = window.open('', 'BW_Projection', 'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no');
  if (!S.projWin) { alert('Popup blocked — allow popups for this site.'); return; }
  S.projWin.document.open();
  S.projWin.document.write(projWindowHTML());
  S.projWin.document.close();
  document.getElementById('proj-btn')?.classList.add('on');
  push();
}

function openStageDisplay() {
  if (S.stageWin && !S.stageWin.closed) { S.stageWin.focus(); return; }
  S.stageWin = window.open('', 'BW_Stage', 'width=1100,height=640,menubar=no,toolbar=no,location=no,status=no');
  if (!S.stageWin) { alert('Popup blocked — allow popups for this site.'); return; }
  S.stageWin.document.open();
  S.stageWin.document.write(stageWindowHTML());
  S.stageWin.document.close();
  document.getElementById('stage-btn')?.classList.add('on');
  pushStage();
}

function projWindowHTML() {
  const bg = BACKGROUNDS.find(b => b.id === S.bgId) || BACKGROUNDS[0];
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:#000;color:#fff;font-family:'Playfair Display',serif;height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;}
    #proj-bg{position:fixed;inset:0;transition:background .5s;}
    #proj-inner{position:relative;text-align:center;padding:40px 60px;max-width:90%;width:100%;z-index:2;}
    #proj-ref{font-family:'Cinzel',serif;font-size:16px;letter-spacing:5px;color:rgba(201,168,76,.8);text-transform:uppercase;margin-bottom:22px;}
    #proj-text{font-size:48px;line-height:1.6;text-shadow:0 2px 30px rgba(0,0,0,.95);}
    #proj-footer{position:fixed;bottom:18px;left:0;right:0;text-align:center;font-family:'Cinzel',serif;font-size:13px;letter-spacing:3px;color:rgba(255,255,255,.3);text-transform:uppercase;}
    #proj-lt{position:fixed;bottom:0;left:0;right:0;padding:16px 30px;display:none;text-align:center;font-size:22px;font-weight:700;letter-spacing:1.5px;color:#fff;}
    #proj-lt.visible{display:block;}
    #proj-lt.lt-default{background:rgba(8,5,26,.88);border-top:1px solid rgba(201,168,76,.3);}
    #proj-lt.lt-gold{background:linear-gradient(90deg,#8a5a00,#c9a84c,#8a5a00);}
    #proj-lt.lt-dark{background:rgba(0,0,0,.95);border-top:2px solid rgba(255,255,255,.2);}
    #proj-lt.lt-alert{background:rgba(140,0,0,.9);border-top:2px solid #e05050;}
    #proj-blank{position:fixed;inset:0;background:#000;display:none;z-index:99;}
    @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
    @keyframes slideIn{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:none;}}
    @keyframes zoomIn{from{opacity:0;transform:scale(.94);}to{opacity:1;transform:scale(1);}}
    .trans-fade #proj-inner{animation:fadeIn .5s ease;}
    .trans-slide #proj-inner{animation:slideIn .5s ease;}
    .trans-zoom #proj-inner{animation:zoomIn .5s ease;}
  </style></head><body>
  <div id="proj-bg" style="background:${bg.bg};"></div>
  <div id="proj-inner">
    <div id="proj-ref"></div>
    <div id="proj-text"></div>
  </div>
  <div id="proj-footer"></div>
  <div id="proj-lt"></div>
  <div id="proj-blank"></div>
  </body></html>`;
}

function stageWindowHTML() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    :root{--gold:#c9a84c;--text-3:#55535a;--border-dim:rgba(255,255,255,.06);}
    body{background:#090914;color:#fff;font-family:'Lato',sans-serif;height:100vh;display:grid;grid-template-rows:1fr 180px;overflow:hidden;}
    #stg-current{display:flex;align-items:center;justify-content:center;background:#06060f;border-bottom:2px solid var(--gold);padding:24px 50px;text-align:center;}
    #stg-cur-text{font-family:'Playfair Display',serif;font-size:40px;line-height:1.65;color:#f4f0ea;}
    #stg-cur-ref{font-family:'Cinzel',serif;font-size:11px;letter-spacing:4px;color:var(--gold);text-transform:uppercase;margin-bottom:14px;}
    #stg-bottom{display:grid;grid-template-columns:1fr 1fr 200px;background:#0b0b18;overflow:hidden;}
    #stg-next{border-right:1px solid var(--border-dim);padding:14px 20px;overflow:hidden;}
    #stg-notes{border-right:1px solid var(--border-dim);padding:14px 20px;overflow:hidden;display:flex;flex-direction:column;}
    #stg-clock-panel{padding:14px 20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;}
    .stg-label{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:var(--text-3);text-transform:uppercase;margin-bottom:6px;}
    #stg-next-text{font-family:'Playfair Display',serif;font-size:17px;line-height:1.65;color:rgba(244,240,234,.45);}
    #stg-notes-text{font-size:13px;color:rgba(255,255,255,.5);line-height:1.7;white-space:pre-wrap;overflow-y:auto;flex:1;}
    #stg-timer{font-family:'Cinzel',serif;font-size:28px;color:var(--gold);letter-spacing:2px;display:none;}
    #stg-timer.visible{display:block;}
    #stg-clock{font-family:'Cinzel',serif;font-size:16px;color:rgba(255,255,255,.4);letter-spacing:2px;}
  </style></head><body>
  <div id="stg-current">
    <div>
      <div id="stg-cur-ref"></div>
      <div id="stg-cur-text">BrideWorship — Stage Display</div>
    </div>
  </div>
  <div id="stg-bottom">
    <div id="stg-next">
      <div class="stg-label">Next Slide ↓</div>
      <div id="stg-next-text">—</div>
    </div>
    <div id="stg-notes">
      <div class="stg-label">📝 Notes</div>
      <div id="stg-notes-text"></div>
    </div>
    <div id="stg-clock-panel">
      <div class="stg-label">Clock</div>
      <div id="stg-clock">—:——</div>
      <div class="stg-label" style="margin-top:8px;">Timer</div>
      <div id="stg-timer"></div>
    </div>
  </div>
  <script>
    setInterval(()=>{
      const d=new Date();
      const h=d.getHours()%12||12,m=String(d.getMinutes()).padStart(2,'0');
      const ampm=d.getHours()<12?'AM':'PM';
      document.getElementById('stg-clock').textContent=h+':'+m+' '+ampm;
    },1000);
  <\/script>
  </body></html>`;
}

/* ── push to projection window ── */
function push() {
  if (!S.projWin || S.projWin.closed) return;
  const d = S.projWin.document;
  const bg    = d.getElementById('proj-bg');
  const ref   = d.getElementById('proj-ref');
const txt   = d.getElementById('proj-text');
const foot  = d.getElementById('proj-footer');
const lt    = d.getElementById('proj-lt');
const blank = d.getElementById('proj-blank');
const body  = d.body;
const curBg = BACKGROUNDS.find(b => b.id === S.bgId) || BACKGROUNDS[0];
if (bg) bg.style.background = curBg.bg;
if (blank) blank.style.display = S.blanked ? 'block' : 'none';
if (body) body.className = 'trans-' + (S.transName || 'fade');
if (!S.slides.length || !S.live) return;
const sl   = S.slides[S.cur];
const song = S.songIdx !== null ? SONGS[S.songIdx].title : '';
if (ref) ref.textContent = (song ? song + ' · ' : '') + (sl.section || '');
if (txt) {
txt.innerHTML = (sl.text || '').replace(/\n/g, '<br>');
const f = S.format;
const shadows = {none:'none',soft:'0 2px 30px rgba(0,0,0,.95)',hard:'2px 2px 0 rgba(0,0,0,.9)',glow:'0 0 40px rgba(201,168,76,.6),0 2px 30px rgba(0,0,0,.9)',outline:'-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000'};
Object.assign(txt.style, {
fontFamily:  '${f.font}',serif,
textAlign:   f.align,
fontWeight:  f.bold   ? '700' : '400',
fontStyle:   f.italic ? 'italic' : 'normal',
color:       f.color,
fontSize:    S.fontSize + 'px',
textShadow:  shadows[f.shadow] || shadows.soft,
lineHeight:  f.lineHeight || '1.65',
});
}
if (foot) {
const parts = [];
if (sl.section) parts.push(sl.section);
if (sl.version) parts.push(sl.version);
if (S.ccli) parts.push('CCLI #' + S.ccli);
foot.textContent = parts.join('  ·  ');
}
if (lt) {
lt.className = '';
if (S.lowerThird.active && S.lowerThird.text) {
lt.className = 'visible lt-' + S.lowerThird.style;
lt.textContent = S.lowerThird.text;
}
}
}
function pushStage() {
if (!S.stageWin || S.stageWin.closed) return;
const d        = S.stageWin.document;
const curRef   = d.getElementById('stg-cur-ref');
const curTxt   = d.getElementById('stg-cur-text');
const nextTxt  = d.getElementById('stg-next-text');
const notesTxt = d.getElementById('stg-notes-text');
const timerEl  = d.getElementById('stg-timer');
const sl   = S.slides[S.cur];
const song = S.songIdx !== null ? SONGS[S.songIdx].title : '';
if (curRef) curRef.textContent = song ? (song + ' · ' + (sl?.section || '')) : (sl?.section || '');
if (curTxt) curTxt.innerHTML   = sl ? (sl.text || '').replace(/\n/g,'<br>') : '—';
const next = S.slides[S.cur + 1];
if (nextTxt) nextTxt.innerHTML = next ? (next.text || '').replace(/\n/g,'<br>') : '— End —';
const key = (S.songIdx ?? 'sc') + '-' + S.cur;
if (notesTxt) notesTxt.textContent = _slideNotes[key] || '';
if (timerEl) {
if (S.timer.projected && S.timer.running) {
const m = Math.floor(S.timer.rem/60), s = S.timer.rem % 60;
timerEl.textContent = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
timerEl.classList.add('visible');
} else {
timerEl.classList.remove('visible');
}
}
}
/* ══════════════════════════════════════
KEYBOARD SHORTCUTS
══════════════════════════════════════ */
document.addEventListener('keydown', e => {
const tag = document.activeElement.tagName;
if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
switch (e.key) {
case 'ArrowRight': case 'ArrowDown': e.preventDefault(); nextSlide(); break;
case 'ArrowLeft':  case 'ArrowUp':   e.preventDefault(); prevSlide(); break;
case ' ': e.preventDefault(); nextSlide(); break;
case 'b': case 'B': toggleBlank();  break;
case 'f': case 'F': toggleFreeze(); break;
case 'l': case 'L': toggleLive();   break;
case 'g': case 'G': toggleLogo();   break;
case 't': case 'T': S.timer.running ? pauseTimer() : startTimer(); break;
case 'r': case 'R': resetTimer();   break;
case '+': case '=': resize(2);      break;
case '-': case '_': resize(-2);     break;
case 'Escape': {
// Close any open modal first
document.querySelectorAll('.modal-overlay').forEach(m => { if(m.style.display==='flex') m.style.display='none'; });
break;
}
default:
// 1–9 jump to slide
if (e.key >= '1' && e.key <= '9') {
const idx = parseInt(e.key) - 1;
if (idx < S.slides.length) jumpSlide(idx);
}
}
});

/* ═══════════════════════════════════════════════════════════
   DATABASE IMPORT / EXPORT ENGINE
   Supports: BrideWorship JSON, OpenLyrics XML, ProPresenter 6,
             EasyWorship XML/.ewsx, Plain Text, CSV, ChordPro,
             SongSelect/CCLI text (.usr)
═══════════════════════════════════════════════════════════ */

let _importBuffer = [];   // parsed songs awaiting user confirmation

/* ── MODAL OPEN / CLOSE / TABS ── */

function openDBModal() {
  _importBuffer = [];
  renderImportPreview([]);
  showImportStatus('');
  updateExportHint();
  // Refresh song count in export selector
  const whichSel = document.getElementById('export-which');
  if (whichSel) {
    whichSel.options[0].text = `All songs in library (${SONGS.length})`;
  }
  document.getElementById('db-modal').style.display = 'flex';
}

function closeDBModal() {
  document.getElementById('db-modal').style.display = 'none';
}

function dbTab(btn, panelId) {
  document.querySelectorAll('.db-tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.db-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById(panelId);
  if (panel) { panel.style.display = 'flex'; }
}

/* ─────────────────────────────────────────
   FILE HANDLING — entry points
───────────────────────────────────────── */

async function handleDBFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  await parseImportFile(file);
  event.target.value = '';
}

function handleDroppedFile(event) {
  const file = event.dataTransfer.files[0];
  if (!file) return;
  parseImportFile(file);
}

async function parseImportFile(file) {
  const name = file.name.toLowerCase();
  const ext  = name.split('.').pop();
  showImportStatus('⏳ Parsing ' + file.name + ' …');
  try {
    let songs = [];
    if      (ext === 'json' || ext === 'bwsongs')          songs = parseNativeJSON(await readFileAsText(file));
    else if (ext === 'pro6' || ext === 'pro6x')             songs = parsePro6XML(await readFileAsText(file));
    else if (ext === 'xml')                                  songs = parseXMLAuto(await readFileAsText(file));
    else if (ext === 'txt'  || ext === 'usr')               songs = parsePlainText(await readFileAsText(file), file.name);
    else if (ext === 'csv')                                  songs = parseCSVSongs(await readFileAsText(file));
    else if (ext === 'cho'  || ext === 'chordpro')          songs = parseChordPro(await readFileAsText(file), file.name);
    else if (ext === 'ewsx' || ext === 'ews')               songs = await parseEWSX(file);
    else if (ext === 'sqlite' || ext === 'db') {
      showImportStatus('⚠ SQLite databases cannot be read in the browser. Please export your songs from your software as XML, OpenLyrics, CSV, or plain text first.', true);
      return;
    } else {
      // Try plain text as final fallback
      songs = parsePlainText(await readFileAsText(file), file.name);
    }
    if (!songs.length) throw new Error('No recognisable song data found. Check the file format.');
    _importBuffer = songs;
    renderImportPreview(songs);
    showImportStatus(`✓ Found ${songs.length} song(s) — review below, then click "Import Selected Songs".`);
  } catch (err) {
    showImportStatus('✕ ' + err.message, true);
    console.error('[BW Import]', err);
  }
}

/* ─────────────────────────────────────────
   FILE READERS
───────────────────────────────────────── */

function readFileAsText(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = e => res(e.target.result);
    r.onerror = () => rej(new Error('File could not be read.'));
    r.readAsText(file, 'UTF-8');
  });
}

function readFileAsBuffer(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = e => res(e.target.result);
    r.onerror = () => rej(new Error('File could not be read.'));
    r.readAsArrayBuffer(file);
  });
}

/* ─────────────────────────────────────────
   PARSERS
───────────────────────────────────────── */

/* ── 1. BrideWorship JSON ── */
function parseNativeJSON(text) {
  const data = JSON.parse(text);
  const arr  = Array.isArray(data) ? data : (data.songs || [data]);
  return arr.filter(s => s && s.title && s.slides).map(normalizeSongObj);
}

function normalizeSongObj(s) {
  return {
    title:    (s.title  || 'Untitled').trim(),
    author:   (s.author || '').trim(),
    tag:      (s.tag    || s.category || 'Imported').trim(),
    key:      (s.key    || '').trim(),
    tempo:    (s.tempo  || '').trim(),
    ccliSong: (s.ccliSong || '').trim(),
    slides:   (s.slides || [])
      .map(sl => ({
        section: (sl.section || sl.label || sl.name || 'SLIDE').trim().toUpperCase(),
        text:    (sl.text    || sl.lyrics || sl.words || '').trim()
      }))
      .filter(sl => sl.text)
  };
}

/* ── 2. ProPresenter 6 (.pro6 XML) ── */
function parsePro6XML(xmlText) {
  const doc  = new DOMParser().parseFromString(xmlText, 'text/xml');
  const root = doc.documentElement;

  const title  = root.getAttribute('CCLISongTitle')   || root.getAttribute('name') || 'Untitled';
  const author = root.getAttribute('CCLIArtistCredits') || '';
  const slides = [];

  // ProPresenter 6 groups slides inside <RVSlideGrouping> elements
  const groups = doc.querySelectorAll('RVSlideGrouping');
  if (groups.length) {
    groups.forEach(group => {
      const label = (group.getAttribute('name') || 'SLIDE').toUpperCase();
      group.querySelectorAll('RVDisplaySlide').forEach(slide => {
        const text = extractPro6Text(slide);
        if (text.trim()) slides.push({ section: label, text: text.trim() });
      });
    });
  } else {
    // Flat slide structure (some PP6 exports)
    doc.querySelectorAll('RVDisplaySlide').forEach(slide => {
      const label = (slide.getAttribute('label') || 'SLIDE').toUpperCase();
      const text  = extractPro6Text(slide);
      if (text.trim()) slides.push({ section: label, text: text.trim() });
    });
  }

  if (!slides.length) throw new Error('No slide text found in ProPresenter 6 file.');
  return [{ title, author, tag: 'ProPresenter 6', key: '', tempo: '', ccliSong: '', slides }];
}

function extractPro6Text(slideEl) {
  const parts = [];
  slideEl.querySelectorAll('RVTextElement').forEach(el => {
    // rawText attribute (cleaner when available)
    const raw = el.getAttribute('rawText');
    if (raw && raw.trim()) { parts.push(raw.trim()); return; }
    // RTFData attribute — base64-encoded RTF
    const rtfData = el.getAttribute('RTFData') || el.querySelector('RTFData')?.textContent || '';
    if (!rtfData.trim()) return;
    try {
      const decoded = decodeURIComponent(escape(atob(rtfData.trim())));
      const plain   = stripRTF(decoded);
      if (plain.trim()) parts.push(plain.trim());
    } catch {
      // Attempt as raw RTF if base64 decode fails
      const plain = stripRTF(rtfData);
      if (plain.trim()) parts.push(plain.trim());
    }
  });
  return parts.join('\n');
}

function stripRTF(rtf) {
  if (!rtf) return '';
  // Unicode escapes: \u8220? → character
  let t = rtf.replace(/\\u(\d+)\?/g, (_, n) => String.fromCharCode(+n));
  // Remove nested groups like {\colortbl ...} {\fonttbl ...}
  t = t.replace(/\{[^{}]*\}/g, ' ');
  // Paragraph / line break markers → newline
  t = t.replace(/\\par\b|\\line\b/g, '\n');
  // Remove all other RTF control words (\word, \word123, \word-123)
  t = t.replace(/\\[a-z*]+[-]?\d*[ ]?/gi, '');
  // Remove remaining RTF syntax chars
  t = t.replace(/[{}\\]/g, '');
  // Normalise whitespace
  t = t.replace(/[ \t]+/g, ' ')
       .split('\n')
       .map(l => l.trim())
       .join('\n')
       .replace(/\n{3,}/g, '\n\n')
       .trim();
  return t;
}

/* ── 3. XML auto-detect (OpenLyrics / EasyWorship / OpenLP / generic) ── */
function parseXMLAuto(xmlText) {
  const doc  = new DOMParser().parseFromString(xmlText, 'text/xml');
  const root = doc.documentElement;
  const tag  = root.tagName.toLowerCase();
  const ns   = root.getAttribute('xmlns') || '';

  // OpenLyrics single song
  if (tag === 'song' && ns.includes('openlyrics')) return [parseOpenLyricsSong(doc)];
  // OpenLyrics songs collection
  if (tag === 'songs') {
    const results = [];
    doc.querySelectorAll('song').forEach(el => {
      try {
        results.push(parseOpenLyricsSong(new DOMParser().parseFromString(el.outerHTML, 'text/xml')));
      } catch { /* skip bad entries */ }
    });
    return results.filter(s => s.slides.length);
  }
  // EasyWorship song_database
  if (tag === 'song_database' || tag === 'songdatabase') return parseEasyWorshipXML(doc);
  // OpenLP service file
  if (tag === 'serviceoverture' || doc.querySelector('serviceitem')) return parseOpenLPService(doc);
  // Quelea / generic OpenLyrics-like
  if (doc.querySelector('verse') && doc.querySelector('lyrics')) return [parseOpenLyricsSong(doc)];
  // MediaShout / SongShow or any other song XML
  return parseGenericXML(doc);
}

/* OpenLyrics */
function parseOpenLyricsSong(doc) {
  const title   = doc.querySelector('title')?.textContent?.trim()  || 'Untitled';
  const author  = doc.querySelector('author')?.textContent?.trim() || '';
  const ccli    = doc.querySelector('cclinumber')?.textContent?.trim() || '';
  const keyEl   = doc.querySelector('transposition, key');
  const key     = keyEl?.textContent?.trim() || '';

  const typeMap = { v:'VERSE', c:'CHORUS', b:'BRIDGE', p:'PRE-CHORUS',
                    e:'ENDING', o:'OUTRO', i:'INTRO', t:'TAG' };
  const slides  = [];

  doc.querySelectorAll('verse').forEach(verse => {
    const name    = verse.getAttribute('name') || 'v1';
    const typeKey = name.replace(/[0-9]/g, '');
    const num     = name.match(/\d+/)?.[0] || '';
    const label   = (typeMap[typeKey] || name.toUpperCase()) + (num ? ' ' + num : '');

    // Collect all <lines> text, joining with newlines
    const lineEls = verse.querySelectorAll('lines');
    let text = '';
    if (lineEls.length) {
      text = Array.from(lineEls)
        .map(l => {
          // <br/> inside <lines> = line break
          return l.innerHTML
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .trim();
        })
        .filter(Boolean)
        .join('\n');
    } else {
      text = verse.textContent.trim();
    }

    if (text) slides.push({ section: label.trim(), text });
  });

  return { title, author, tag: 'OpenLyrics', key, tempo: '', ccliSong: ccli, slides };
}

/* EasyWorship XML song_database */
function parseEasyWorshipXML(doc) {
  const songs   = [];
  const songEls = doc.querySelectorAll('song');
  const targets = songEls.length ? Array.from(songEls) : [doc.documentElement];

  targets.forEach(songEl => {
    const title  = (songEl.querySelector('title')?.textContent  || songEl.getAttribute('title')  || 'Untitled').trim();
    const author = (songEl.querySelector('author')?.textContent || songEl.getAttribute('author') || '').trim();
    const slides = [];

    // EasyWorship uses <verse>, <chorus>, <bridge>, <part name="…"> etc.
    songEl.querySelectorAll('verse, chorus, bridge, part, section, stanza').forEach(part => {
      const rawName = part.getAttribute('name') || part.getAttribute('label') || part.tagName;
      const label   = rawName.toUpperCase().trim();
      const words   = (part.querySelector('words, lyrics, text')?.textContent
                    || part.textContent || '').trim();
      if (words) slides.push({ section: label, text: words });
    });

    // Fallback: grab <lyrics> or <words> block and split on double-newline
    if (!slides.length) {
      const raw = (songEl.querySelector('lyrics, words, body')?.textContent || '').trim();
      if (raw) {
        raw.split(/\n{2,}/).forEach((block, i) => {
          const t = block.trim();
          if (t) slides.push({ section: 'SLIDE ' + (i + 1), text: t });
        });
      }
    }

    if (slides.length) songs.push({ title, author, tag: 'EasyWorship', key: '', tempo: '', ccliSong: '', slides });
  });

  return songs;
}

/* OpenLP service XML */
function parseOpenLPService(doc) {
  const songs = [];
  doc.querySelectorAll('serviceitem, item').forEach(item => {
    const title  = (item.querySelector('title, name')?.textContent || 'Untitled').trim();
    const slides = [];
    item.querySelectorAll('slide, verse, stanza').forEach(s => {
      const label = (s.getAttribute('label') || s.getAttribute('name') || 'SLIDE').toUpperCase();
      const text  = s.textContent.trim();
      if (text) slides.push({ section: label, text });
    });
    if (slides.length) songs.push({ title, author: '', tag: 'OpenLP', key: '', tempo: '', ccliSong: '', slides });
  });
  return songs;
}

/* Generic XML fallback */
function parseGenericXML(doc) {
  const songs  = [];
  const titles = doc.querySelectorAll('title');
  if (!titles.length) {
    const text = doc.documentElement.textContent.trim();
    if (text) return parsePlainText(text, 'import.xml');
    throw new Error('Unrecognised XML format. Supported: OpenLyrics, EasyWorship, OpenLP, ProPresenter 6.');
  }
  titles.forEach(titleEl => {
    const songEl = titleEl.closest('song, item, entry, hymn') || titleEl.parentElement;
    const title  = titleEl.textContent.trim() || 'Untitled';
    const slides = [];
    songEl.querySelectorAll('verse, slide, part, section, stanza, lyrics').forEach(v => {
      const label = (v.getAttribute('name') || v.getAttribute('label') || v.tagName || 'SLIDE').toUpperCase();
      const text  = v.textContent.trim();
      if (text) slides.push({ section: label, text });
    });
    if (slides.length) songs.push({ title, author: '', tag: 'XML Import', key: '', tempo: '', ccliSong: '', slides });
  });
  return songs;
}

/* ── 4. Plain Text with [Section] markers ── */
function parsePlainText(rawText, filename) {
  const guessedTitle = filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const text   = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines  = text.split('\n');
  const slides = [];
  // Section marker: [Verse 1], [Chorus], ### Heading, === Title ===
  const secRx  = /^\[([^\]]+)\]$|^={2,}\s*(.+?)\s*={2,}$|^#{1,3}\s+(.+)$/;

  let curSection = '';
  let curLines   = [];
  let titleLine  = '';

  function flush() {
    const t = curLines.join('\n').trim();
    if (!t) { curLines = []; return; }
    slides.push({ section: curSection || ('SLIDE ' + (slides.length + 1)), text: t });
    curLines = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    const m = secRx.exec(trimmed);
    if (m) {
      flush();
      curSection = (m[1] || m[2] || m[3] || 'SLIDE').trim().toUpperCase();
    } else {
      // First non-blank line before any section marker = probable title
      if (!curSection && !titleLine && trimmed) { titleLine = trimmed; curLines.push(line); }
      else curLines.push(line);
    }
  }
  flush();

  // If we only got one slide with no section markers, split on double blank lines
  if (slides.length === 1 && !secRx.test(text)) {
    const blocks = text.split(/\n{2,}/);
    if (blocks.length > 1) {
      return [{
        title:    guessedTitle,
        author:   '',
        tag:      'Text Import',
        key:      '',
        tempo:    '',
        ccliSong: '',
        slides:   blocks
          .map((b, i) => ({ section: 'SLIDE ' + (i + 1), text: b.trim() }))
          .filter(s => s.text)
      }];
    }
  }

  if (!slides.length && text.trim()) {
    slides.push({ section: 'LYRICS', text: text.trim() });
  }

  return [{
    title:    guessedTitle,
    author:   '',
    tag:      'Text Import',
    key:      '',
    tempo:    '',
    ccliSong: '',
    slides
  }];
}

/* ── 5. CSV ── */
function parseCSVSongs(text) {
  const rows    = text.trim().split('\n');
  if (!rows.length) return [];

  function splitCSVRow(line) {
    const cols = []; let cur = '', inQ = false;
    for (const c of line) {
      if (c === '"') { inQ = !inQ; }
      else if (c === ',' && !inQ) { cols.push(cur.trim().replace(/^"|"$/g, '')); cur = ''; }
      else cur += c;
    }
    cols.push(cur.trim().replace(/^"|"$/g, ''));
    return cols;
  }

  const headers = splitCSVRow(rows[0]).map(h => h.toLowerCase().trim());
  const get     = (cols, key) => { const i = headers.indexOf(key); return i >= 0 ? (cols[i] || '') : ''; };
  const songs   = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = splitCSVRow(rows[i]);
    if (!cols.length || !cols[0].trim()) continue;

    const title  = get(cols,'title')  || get(cols,'song title') || get(cols,'name') || cols[0] || 'Untitled';
    const author = get(cols,'author') || get(cols,'artist')     || get(cols,'composer') || '';
    const tag    = get(cols,'tag')    || get(cols,'category')   || 'CSV Import';
    const key    = get(cols,'key')    || '';
    const tempo  = get(cols,'tempo')  || '';
    const raw    = get(cols,'lyrics') || get(cols,'words')      || get(cols,'text') || get(cols,'slides') || '';

    let slides = [];
    if (raw.trim().startsWith('[')) {
      try { slides = JSON.parse(raw); } catch { /* fall through */ }
    }
    if (!slides.length && raw.trim()) {
      slides = parsePlainText(raw, title)[0]?.slides || [];
    }
    if (!slides.length) slides = [{ section: 'LYRICS', text: title }];

    songs.push({ title, author, tag, key, tempo, ccliSong: '', slides });
  }
  return songs;
}

/* ── 6. ChordPro (.cho / .chordpro) ── */
function parseChordPro(text, filename) {
  const title  = text.match(/\{(?:title|t):\s*([^}]+)\}/i)?.[1]?.trim()
              || filename.replace(/\.[^.]+$/, '');
  const author = text.match(/\{(?:artist|a|author):\s*([^}]+)\}/i)?.[1]?.trim() || '';
  const key    = text.match(/\{key:\s*([^}]+)\}/i)?.[1]?.trim()                 || '';

  const lines       = text.split('\n');
  const slides      = [];
  let curSection    = '';
  let curLines      = [];
  let slideCounter  = { verse:0, chorus:0, bridge:0 };

  function flush() {
    const t = curLines.join('\n').trim();
    if (t) slides.push({ section: curSection || ('SLIDE ' + (slides.length + 1)), text: t });
    curLines = [];
  }

  for (const line of lines) {
    const tr = line.trim();
    // Structural directives
    if (/^\{(?:sov|start_of_verse)[^}]*\}/i.test(tr)) {
      flush(); slideCounter.verse++;
      curSection = 'VERSE ' + slideCounter.verse; continue;
    }
    if (/^\{(?:eov|end_of_verse)\}/i.test(tr))   { continue; }
    if (/^\{(?:soc|start_of_chorus)[^}]*\}/i.test(tr)) {
      flush(); slideCounter.chorus++;
      curSection = slideCounter.chorus > 1 ? 'CHORUS ' + slideCounter.chorus : 'CHORUS'; continue;
    }
    if (/^\{(?:eoc|end_of_chorus)\}/i.test(tr))  { continue; }
    if (/^\{(?:sob|start_of_bridge)[^}]*\}/i.test(tr)) {
      flush(); slideCounter.bridge++;
      curSection = slideCounter.bridge > 1 ? 'BRIDGE ' + slideCounter.bridge : 'BRIDGE'; continue;
    }
    if (/^\{(?:eob|end_of_bridge)\}/i.test(tr))  { continue; }
    // Meta directives — skip
    if (/^\{(?:title|t|artist|a|author|key|capo|tempo|comment|c|x-)[^}]*\}/i.test(tr)) continue;
    // Named comment as section label
    const cmtM = tr.match(/^\{(?:comment|c):\s*([^}]+)\}/i);
    if (cmtM) { flush(); curSection = cmtM[1].toUpperCase().trim(); continue; }
    // Strip inline chord markers [G] [Am7] etc.
    const lyric = tr.replace(/\[[^\]]*\]/g, '').trim();
    curLines.push(lyric);
  }
  flush();

  return [{ title, author, tag: 'ChordPro', key, tempo: '', ccliSong: '', slides }];
}

/* ── 7. EasyWorship .ewsx (ZIP containing XML) ── */
async function parseEWSX(file) {
  if (typeof JSZip === 'undefined') {
    await loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
  }
  const buf  = await readFileAsBuffer(file);
  const zip  = await JSZip.loadAsync(buf);
  const songs = [];
  const files = Object.keys(zip.files);

  // Try XML files first
  for (const fn of files.filter(n => /\.(xml|ews)$/i.test(n))) {
    try {
      const text   = await zip.files[fn].async('text');
      const parsed = parseXMLAuto(text);
      songs.push(...parsed);
    } catch { /* continue */ }
  }

  // Try JSON files
  for (const fn of files.filter(n => /\.json$/i.test(n))) {
    try {
      const text   = await zip.files[fn].async('text');
      const parsed = parseNativeJSON(text);
      songs.push(...parsed);
    } catch { /* continue */ }
  }

  if (!songs.length) {
    throw new Error(
      'No parseable song data found inside the EasyWorship archive.\n' +
      'Please export your songs as XML from EasyWorship (File → Export) and import that file instead.'
    );
  }
  return songs;
}

function loadExternalScript(src) {
  return new Promise((res, rej) => {
    const s    = document.createElement('script');
    s.src      = src;
    s.onload   = res;
    s.onerror  = () => rej(new Error('Could not load external library: ' + src));
    document.head.appendChild(s);
  });
}

/* ─────────────────────────────────────────
   IMPORT UI
───────────────────────────────────────── */

function showImportStatus(msg, isError) {
  const el = document.getElementById('db-import-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? 'var(--red)' : 'var(--text-2)';
}

function renderImportPreview(songs) {
  const preview = document.getElementById('db-preview');
  const count   = document.getElementById('db-import-count');
  if (!preview) return;
  if (count) count.textContent = songs.length ? `${songs.length} song(s) found` : '';
  if (!songs.length) {
    preview.innerHTML = '<div style="color:var(--text-3);font-size:11px;padding:14px;text-align:center;">No songs loaded yet — select a file above.</div>';
    return;
  }
  preview.innerHTML = songs.map((s, i) => `
    <div class="db-preview-item" id="dpi-${i}">
      <label style="display:flex;align-items:flex-start;gap:9px;cursor:pointer;">
        <input type="checkbox" class="db-song-chk" data-idx="${i}" checked style="margin-top:3px;cursor:pointer;accent-color:var(--gold);">
        <div style="flex:1;min-width:0;">
          <div class="dpi-title">${escapeHTML(s.title)}</div>
          <div class="dpi-sub">
            ${escapeHTML(s.author || '—')} ·
            ${s.slides.length} slide${s.slides.length !== 1 ? 's' : ''} ·
            <em>${escapeHTML(s.tag)}</em>
            ${s.key ? ' · Key: ' + escapeHTML(s.key) : ''}
          </div>
          <div class="dpi-slides">
            ${s.slides.map(sl => `<span class="dpi-badge">${escapeHTML(sl.section)}</span>`).join('')}
          </div>
        </div>
      </label>
    </div>`).join('');
}

function selectAllImport(val) {
  document.querySelectorAll('.db-song-chk').forEach(chk => chk.checked = val);
}

function confirmImport() {
  const checked = Array.from(document.querySelectorAll('.db-song-chk:checked'))
    .map(chk => _importBuffer[parseInt(chk.dataset.idx)])
    .filter(Boolean);

  if (!checked.length) {
    showImportStatus('⚠ Select at least one song to import.', true);
    return;
  }

  const existingLower = new Set(SONGS.map(s => s.title.toLowerCase()));
  const dupeMode      = document.getElementById('db-dupe-mode')?.value || 'skip';
  const toAdd         = [];
  const replaced      = [];
  const skipped       = [];

  checked.forEach(song => {
    const key    = song.title.toLowerCase();
    const isDupe = existingLower.has(key);
    if (isDupe) {
      if (dupeMode === 'skip') { skipped.push(song.title); return; }
      if (dupeMode === 'replace') {
        const idx = SONGS.findIndex(s => s.title.toLowerCase() === key);
        if (idx >= 0) { SONGS[idx] = song; replaced.push(song.title); return; }
      }
      // 'add' — allow duplicate
    }
    toAdd.push(song);
    existingLower.add(key);
  });

  SONGS.push(...toAdd);
  saveSongsToStorage();
  buildSongLibrary();

  let msg = `✓ Imported ${toAdd.length} new song(s).`;
  if (replaced.length) msg += ` Replaced ${replaced.length}.`;
  if (skipped.length)  msg += ` Skipped ${skipped.length} duplicate(s).`;
  showImportStatus(msg);

  _importBuffer = [];
  renderImportPreview([]);

  // Switch library panel to Songs
  const ltabSongs = document.getElementById('ltab-songs');
  if (ltabSongs) libTab(ltabSongs, 'ls-songs');
}

/* ─────────────────────────────────────────
   EXPORT ENGINE
───────────────────────────────────────── */

function exportDatabase() {
  const format = document.getElementById('export-format')?.value || 'json';
  const which  = document.getElementById('export-which')?.value  || 'all';

  let songs;
  if (which === 'current' && S.songIdx !== null) {
    songs = [SONGS[S.songIdx]];
  } else {
    songs = SONGS;
  }

  if (!songs.length) { alert('No songs to export.'); return; }

  switch (format) {
    case 'json':
      dlJSON({ songs, exportedAt: new Date().toISOString(), app: 'BrideWorship Pro' }, 'bw-songs.json');
      break;
    case 'openlyrics':
      dlText(buildOpenLyricsXML(songs), 'bw-songs-openlyrics.xml', 'text/xml');
      break;
    case 'pro6':
      exportAsPro6(songs);
      break;
    case 'csv':
      dlText(buildCSV(songs), 'bw-songs.csv', 'text/csv');
      break;
    case 'txt':
      dlText(buildPlainText(songs), 'bw-songs.txt', 'text/plain');
      break;
    case 'chordpro':
      dlText(buildChordPro(songs), 'bw-songs.cho', 'text/plain');
      break;
    default:
      dlJSON(songs, 'bw-songs.json');
  }
}

/* ── Export: OpenLyrics XML ── */
function buildOpenLyricsXML(songs) {
  const typeMap = {
    'VERSE':'v', 'CHORUS':'c', 'BRIDGE':'b', 'PRE-CHORUS':'p',
    'INTRO':'i', 'OUTRO':'e', 'ENDING':'e', 'TAG':'t'
  };

  const songBlocks = songs.map(song => {
    const counters = {};
    const verses   = song.slides.map(sl => {
      const typeKey  = Object.keys(typeMap).find(k => sl.section.startsWith(k)) || null;
      const code     = typeKey ? typeMap[typeKey] : 'v';
      counters[code] = (counters[code] || 0) + 1;
      const name     = code + counters[code];
      // Escape XML and convert newlines to <br/>
      const lines    = sl.text
        .split('\n')
        .map(l => xe(l))
        .join('<br/>');
      return `      <verse name="${name}">\n        <lines>${lines}</lines>\n      </verse>`;
    }).join('\n');

    return `  <song version="0.8" createdIn="BrideWorship Pro"
    xmlns="http://openlyrics.info/namespace/2009/song">
    <properties>
      <titles><title>${xe(song.title)}</title></titles>
      <authors><author>${xe(song.author || '')}</author></authors>
      ${song.ccliSong ? `<cclinumber>${xe(song.ccliSong)}</cclinumber>` : ''}
      ${song.key      ? `<transposition>${xe(song.key)}</transposition>` : ''}
    </properties>
    <lyrics>
${verses}
    </lyrics>
  </song>`;
  }).join('\n\n');

  return `<?xml version="1.0" encoding="utf-8"?>\n<songs>\n${songBlocks}\n</songs>`;
}

/* ── Export: ProPresenter 6 (one .pro6 file per song) ── */
function exportAsPro6(songs) {
  songs.forEach(song => {
    const slideXML = song.slides.map(sl => {
      const rtf    = textToBasicRTF(sl.text);
      const b64    = btoa(unescape(encodeURIComponent(rtf)));
      const uuid1  = newUUID();
      const uuid2  = newUUID();
      return `    <RVDisplaySlide label="${xe(sl.section)}" enabled="1" UUID="${uuid1}" highlightColor="0">
      <displayElements>
        <RVTextElement displayName="Default" UUID="${uuid2}" RTFData="${b64}"/>
      </displayElements>
    </RVDisplaySlide>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="utf-8"?>
<RVPresentationDocument height="768" width="1024" versionNumber="600"
  CCLISongTitle="${xe(song.title)}"
  CCLIArtistCredits="${xe(song.author || '')}"
  UUID="${newUUID()}">
  <slides>
${slideXML}
  </slides>
</RVPresentationDocument>`;

    const safeName = song.title.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, '_') || 'song';
    dlText(xml, safeName + '.pro6', 'text/xml');
  });
}

/* ── Export: CSV ── */
function buildCSV(songs) {
  const H = ['title','author','key','tempo','tag','ccliSong','slides'];
  const rows = songs.map(s => [
    cc(s.title),
    cc(s.author   || ''),
    cc(s.key      || ''),
    cc(s.tempo    || ''),
    cc(s.tag      || ''),
    cc(s.ccliSong || ''),
    cc(JSON.stringify(s.slides))
  ].join(','));
  return [H.join(','), ...rows].join('\n');
}

/* ── Export: Plain Text ── */
function buildPlainText(songs) {
  return songs.map(song => {
    const meta   = `=== ${song.title} ===\nAuthor: ${song.author || 'Unknown'}${song.key ? '\nKey: ' + song.key : ''}`;
    const body   = song.slides.map(sl => `[${sl.section}]\n${sl.text}`).join('\n\n');
    return meta + '\n\n' + body;
  }).join('\n\n' + '─'.repeat(60) + '\n\n');
}

/* ── Export: ChordPro ── */
function buildChordPro(songs) {
  return songs.map(song => {
    const meta = [
      `{title: ${song.title}}`,
      song.author ? `{artist: ${song.author}}` : '',
      song.key    ? `{key: ${song.key}}`        : '',
    ].filter(Boolean).join('\n');

    const body = song.slides.map(sl => {
      const lower = sl.section.toLowerCase();
      const tag   = lower.startsWith('chorus') ? 'chorus'
                  : lower.startsWith('bridge') ? 'bridge'
                  : 'verse';
      return `{start_of_${tag}: ${sl.section}}\n${sl.text}\n{end_of_${tag}}`;
    }).join('\n\n');

    return meta + '\n\n' + body;
  }).join('\n\n# ' + '═'.repeat(48) + '\n\n');
}

/* ─────────────────────────────────────────
   EXPORT HINT
───────────────────────────────────────── */
function updateExportHint() {
  const format = document.getElementById('export-format')?.value || 'json';
  const hints  = {
    json:       '💾 Best for full backup and reimporting into BrideWorship Pro. Preserves all metadata including key, tempo, CCLI, and slide order.',
    openlyrics: '🌐 Most widely compatible format. Supported by OpenLP, EasyWorship 7, MediaShout, Quelea, Songbeamer and the SongSelect library. In EasyWorship use File → Import → OpenLyrics.',
    pro6:       '🖥 Creates one .pro6 file per song. Open directly in ProPresenter 6. ProPresenter 7 can import .pro6 via File → Import → ProPresenter 6 Document.',
    csv:        '📊 Opens in Microsoft Excel, Google Sheets, or LibreOffice. Lyrics are stored as structured JSON in the "slides" column — reimportable into BrideWorship.',
    txt:        '📄 Universal plain-text format with [Section] markers. Easy to read, print, email or use in any app. Reimportable into BrideWorship.',
    chordpro:   '🎸 ChordPro structure with no actual chords added — just section tags. Compatible with OnSong, ChordU, GuitarPro, and most chord-chart apps.'
  };
  const el = document.getElementById('export-hint');
  if (el) el.textContent = hints[format] || '';
}

/* ─────────────────────────────────────────
   SHARED UTILITIES
───────────────────────────────────────── */

/** XML-escape a string */
function xe(s) {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** HTML-escape for preview rendering */
function escapeHTML(s) {
  return (s || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

/** CSV cell with quoting */
function cc(s) {
  const str = String(s || '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/** Minimal RTF wrapper for ProPresenter 6 export */
function textToBasicRTF(text) {
  const body = text
    .split('\n')
    .map(l => l
      .replace(/\\/g, '\\\\')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/[^\x00-\x7F]/g, c => `\\u${c.charCodeAt(0)}?`)
    )
    .join('\\line\n');
  return `{\\rtf1\\ansi\\deff0` +
    `{\\fonttbl{\\f0\\froman\\fprq2\\fcharset0 Times New Roman;}}` +
    `{\\colortbl;\\red255\\green255\\blue255;}` +
    `\\f0\\fs54\\cf1\\qc\\sl360\\slmult1 ${body}}`;
}

/** Generate a random UUID v4 */
function newUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/** Download JSON file */
function dlJSON(data, filename) {
  dlText(JSON.stringify(data, null, 2), filename, 'application/json');
}

/** Download any text file */
function dlText(content, filename, mime) {
  const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}



/* ═══════════════════════════════════════════════════════════
   MEDIA LIBRARY — Import & display fix
═══════════════════════════════════════════════════════════ */

const _mediaFiles = []; // { name, url, type:'image'|'video', thumb }

function handleMediaImport(event) {
  const files = Array.from(event.target.files);
  if (!files.length) return;
  files.forEach(file => {
    const isVideo = file.type.startsWith('video');
    const url     = URL.createObjectURL(file);
    const entry   = {
      id:    'media_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      name:  file.name,
      url,
      type:  isVideo ? 'video' : 'image',
      thumb: isVideo ? null : url
    };
    _mediaFiles.push(entry);
    appendMediaThumb(entry);
  });
  event.target.value = '';
}

function appendMediaThumb(entry) {
  // Ensure thumb grid exists in #ls-media
  let grid = document.getElementById('media-thumb-grid');
  if (!grid) {
    const section = document.getElementById('ls-media');
    if (!section) return;
    grid = document.createElement('div');
    grid.id        = 'media-thumb-grid';
    grid.className = 'media-thumb-grid';
    section.appendChild(grid);
  }

  const div = document.createElement('div');
  div.className = 'media-thumb-item';
  div.id        = 'mthumb-' + entry.id;
  div.title     = entry.name;

  if (entry.type === 'image') {
    const img    = document.createElement('img');
    img.src      = entry.url;
    img.alt      = entry.name;
    img.onerror  = () => { img.style.display='none'; };
    div.appendChild(img);
  } else {
    // Video — show a video element for thumb
    const vid = document.createElement('video');
    vid.src   = entry.url;
    vid.muted = true;
    vid.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    vid.addEventListener('loadeddata', () => { vid.currentTime = 1; });
    div.appendChild(vid);
  }

  const label    = document.createElement('div');
  label.className= 'media-thumb-label';
  label.textContent = entry.name.replace(/\.[^.]+$/, '');
  div.appendChild(label);

  const delBtn = document.createElement('button');
  delBtn.className = 'media-thumb-del';
  delBtn.textContent = '✕';
  delBtn.title       = 'Remove';
  delBtn.onclick = e => {
    e.stopPropagation();
    removeMediaItem(entry.id);
  };
  div.appendChild(delBtn);

  div.addEventListener('click', () => applyMediaBackground(entry, div));
  grid.appendChild(div);
}

function applyMediaBackground(entry, thumbEl) {
  // Mark active
  document.querySelectorAll('.media-thumb-item').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');

  if (entry.type === 'image') {
    // Set slide background to this image
    const slideBg = document.getElementById('slide-bg');
    const outBg   = document.getElementById('out-bg');
    if (slideBg) {
      slideBg.style.background   = `url(${entry.url}) center/cover no-repeat`;
      slideBg.style.backgroundSize = 'cover';
    }
    if (outBg) {
      outBg.style.background      = `url(${entry.url}) center/cover no-repeat`;
      outBg.style.backgroundSize  = 'cover';
    }
    S.bgId = 'custom_media_' + entry.id;
    // Push to projection window
    if (S.projWin && !S.projWin.closed) {
      const pbg = S.projWin.document.getElementById('proj-bg');
      if (pbg) {
        pbg.style.background     = `url(${entry.url}) center/cover no-repeat`;
        pbg.style.backgroundSize = 'cover';
      }
    }
  } else if (entry.type === 'video') {
    // Inject video into slide bg
    const slideBg = document.getElementById('slide-bg');
    if (slideBg) {
      slideBg.innerHTML = '';
      const vid = document.createElement('video');
      vid.src     = entry.url;
      vid.autoplay= true;
      vid.loop    = true;
      vid.muted   = true;
      vid.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
      slideBg.appendChild(vid);
    }
  }
  push();
}

function removeMediaItem(id) {
  const idx = _mediaFiles.findIndex(m => m.id === id);
  if (idx >= 0) {
    URL.revokeObjectURL(_mediaFiles[idx].url);
    _mediaFiles.splice(idx, 1);
  }
  const el = document.getElementById('mthumb-' + id);
  if (el) el.remove();
}

/* ═══════════════════════════════════════════════════════════
   THE TABLE — Integration logic
═══════════════════════════════════════════════════════════ */

function openTheTable() {
  document.getElementById('table-modal').style.display = 'flex';
  // Detect iframe block after short delay
  setTimeout(checkTableIframeLoad, 3500);
}

function closeTheTable() {
  document.getElementById('table-modal').style.display = 'none';
}

function tableTab(btn, panelId) {
  document.querySelectorAll('#table-modal .db-tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.table-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById(panelId);
  if (panel) panel.style.display = 'flex';
}

function navigateTableFrame(url) {
  let target = url.trim();
  if (!target.startsWith('http')) target = 'https://' + target;
  const frame = document.getElementById('table-iframe');
  if (frame) frame.src = target;
  const bar = document.getElementById('table-url-bar');
  if (bar) bar.value = target;
  document.getElementById('table-fallback')?.classList.remove('visible');
  setTimeout(checkTableIframeLoad, 3500);
}

function reloadTableFrame() {
  const frame = document.getElementById('table-iframe');
  if (frame) { frame.src = frame.src; }
  document.getElementById('table-fallback')?.classList.remove('visible');
  setTimeout(checkTableIframeLoad, 3500);
}

function openTableExternal() {
  const bar = document.getElementById('table-url-bar');
  const url = bar?.value.trim() || 'https://table.branham.org/';
  window.open(url, '_blank');
}

function checkTableIframeLoad() {
  // If iframe contentDocument is inaccessible due to cross-origin blocking, show fallback
  const frame = document.getElementById('table-iframe');
  if (!frame) return;
  try {
    // Accessing this throws if cross-origin block is active
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc || doc.body === null || doc.body.innerHTML === '') {
      document.getElementById('table-fallback')?.classList.add('visible');
    }
  } catch (e) {
    document.getElementById('table-fallback')?.classList.add('visible');
  }
}

function appendTableText(text) {
  const ta = document.getElementById('table-sermon-text');
  if (!ta) return;
  ta.value = ta.value ? ta.value + '\n\n' + text : text;
  // Switch to Add to Queue tab
  const tabs = document.querySelectorAll('#table-modal .db-tab');
  if (tabs[1]) tableTab(tabs[1], 'tt-queue');
}

function projectTableSermon() {
  const raw    = parseTableSermonToSlides();
  if (!raw.length) { alert('Please paste or type some sermon text first.'); return; }
  S.songIdx = null;
  S.slides  = raw;
  S.cur     = 0;
  renderQueue();
  renderSlide();
  closeTheTable();
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
}

function addTableToServiceOrder() {
  const title = document.getElementById('table-sermon-title')?.value.trim()
    || 'Sermon Message';
  S.so.push({ name: title, type: 'sermon' });
  renderSO();
  closeTheTable();
  centerTab(document.querySelectorAll('.ctab')[1], 'service-view');
}

function parseTableSermonToSlides() {
  const raw      = document.getElementById('table-sermon-text')?.value.trim() || '';
  const mode     = document.getElementById('table-split-mode')?.value  || 'paragraph';
  const maxLines = parseInt(document.getElementById('table-lines-per-slide')?.value) || 3;
  const title    = document.getElementById('table-sermon-title')?.value.trim()  || 'Message';
  const author   = document.getElementById('table-sermon-author')?.value.trim() || 'Rev. William Marrion Branham';
  if (!raw) return [];

  const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  let blocks  = [];

  if (mode === 'manual') {
    // [Section] marker splitting
    const secRx = /^\[([^\]]+)\]$/m;
    let curSec  = 'OPENING';
    let curLines = [];
    for (const line of text.split('\n')) {
      const m = line.trim().match(/^\[([^\]]+)\]$/);
      if (m) {
        if (curLines.join('').trim()) {
          blocks.push({ section: curSec, text: curLines.join('\n').trim() });
        }
        curSec   = m[1].toUpperCase();
        curLines = [];
      } else {
        curLines.push(line);
      }
    }
    if (curLines.join('').trim()) blocks.push({ section: curSec, text: curLines.join('\n').trim() });

  } else if (mode === 'sentence') {
    // Split into individual sentences then group by 2
    const sentences = text
      .replace(/([.!?…"»])\s+/g, '$1\n')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    for (let i = 0; i < sentences.length; i += 2) {
      const group = sentences.slice(i, i + 2).join('\n');
      blocks.push({ section: 'QUOTE ' + (Math.floor(i / 2) + 1), text: group });
    }

  } else {
    // Paragraph split (blank lines)
    const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    paragraphs.forEach((p, i) => {
      // If paragraph too long, further split by maxLines
      const lines = p.split('\n');
      if (lines.length <= maxLines) {
        blocks.push({ section: 'SERMON TITLE' + (i + 1), text: p });
      } else {
        for (let j = 0; j < lines.length; j += maxLines) {
          const chunk = lines.slice(j, j + maxLines).join('\n').trim();
          if (chunk) {
            blocks.push({ section: 'REV. WILLIAM MARRION BRANHAM' + (i + 1) + '.' + (Math.floor(j / maxLines) + 1), text: chunk });
          }
        }
      }
    });
  }

  return blocks.filter(b => b.text).map(b => ({
    section: b.section,
    text:    b.text,
    author,
    tag:     title
  }));
}

/* ═══════════════════════════════════════════════════════════
   THE TABLE — In-App Downloader
   Auto-detects OS, fetches installer directly, tracks progress.
═══════════════════════════════════════════════════════════ */

/* Platform download manifest.
   Direct links to the latest The Table installers from branham.org.
   Update these URLs if branham.org changes their download paths. */
const TABLE_PLATFORMS = {
  windows: {
    label:   'Windows',
    icon:    '🪟',
    ext:     '.exe',
    url:     'https://barnham.org/downloads/TheTable-Setup.exe',
    fallback:'https://table.branham.org/articles/8152019_TheTableDesktopApp',
    steps: [
      'The installer (<strong>.exe</strong>) will download to your Downloads folder.',
      'Open the downloaded file — click <strong>Yes</strong> if Windows asks for permission.',
      'Follow the setup wizard: Next → Install → Finish.',
      'Launch <strong>The Table</strong> from your Desktop or Start Menu.',
      'Sign in or browse as a guest to access the sermon library.',
    ]
  },
  mac: {
    label:   'macOS',
    icon:    '🍎',
    ext:     '.dmg',
    url:     'https://branham.org/downloads/TheTable.dmg',
    fallback:'https://branham.org/articles/8152019_TheTableDesktopApp',
    steps: [
      'The disk image (<strong>.dmg</strong>) will download to your Downloads folder.',
      'Open the .dmg file — drag <strong>The Table</strong> into your Applications folder.',
      'Open Applications → right-click The Table → <strong>Open</strong> (first launch only).',
      'Click <strong>Open</strong> on the security prompt.',
      'Sign in or browse as a guest to access the sermon library.',
    ]
  },
  linux: {
    label:   'Linux',
    icon:    '🐧',
    ext:     '.AppImage',
    url:     'https://branham.org/downloads/TheTable.AppImage',
    fallback:'https://branham.org/articles/8152019_TheTableDesktopApp',
    steps: [
      'The <strong>.AppImage</strong> file will download to your Downloads folder.',
      'Open a terminal and run: <code>chmod +x TheTable*.AppImage</code>',
      'Run: <code>./TheTable*.AppImage</code> to launch.',
      'Optionally move to /opt or ~/Applications for convenience.',
      'Sign in or browse as a guest to access the sermon library.',
    ]
  },
  android: {
    label:   'Android',
    icon:    '🤖',
    ext:     null,
    url:     'https://play.google.com/store/apps/details?id=org.branham.thetable',
    fallback:'https://branham.org/articles/8152019_TheTableDesktopApp',
    steps: [
      'Tap <strong>Download</strong> — the Google Play Store will open.',
      'Tap <strong>Install</strong> on The Table listing.',
      'Once installed, open The Table from your app drawer.',
      'Sign in or browse as a guest.',
      'Copy sermon text and paste into BrideWorship\'s "Add to Queue" tab.',
    ]
  },
  ios: {
    label:   'iPhone / iPad',
    icon:    '📱',
    ext:     null,
    url:     'https://apps.apple.com/app/the-table/id1448757029',
    fallback:'https://branham.org/articles/8152019_TheTableDesktopApp',
    steps: [
      'Tap <strong>Download</strong> — the App Store will open.',
      'Tap <strong>Get</strong> on The Table listing.',
      'Once installed, open The Table from your home screen.',
      'Sign in or browse as a guest.',
      'Copy sermon text and paste into BrideWorship\'s "Add to Queue" tab.',
    ]
  }
};

/* Detect user OS */
function detectTableOS() {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'ios';
  if (/Android/.test(ua))   return 'android';
  if (/Win/i.test(ua))      return 'windows';
  if (/Mac/i.test(ua))      return 'mac';
  if (/Linux/i.test(ua))    return 'linux';
  return 'windows';
}

/* Called when Download tab is opened */
function initTableDownload() {
  const os       = detectTableOS();
  const platform = TABLE_PLATFORMS[os];

  // Update hero
  const iconEl = document.getElementById('td-os-icon');
  const subEl  = document.getElementById('td-os-sub');
  const btnEl  = document.getElementById('td-download-btn');

  if (iconEl) iconEl.textContent = platform.icon;
  if (subEl)  subEl.textContent  = `Detected: ${platform.label} — ready to download`;
  if (btnEl)  btnEl.textContent  = `⬇ Download The Table for ${platform.label}`;

  // Fill alt platform pills
  const altWrap = document.getElementById('td-alt-platforms');
  if (altWrap) {
    altWrap.innerHTML = Object.entries(TABLE_PLATFORMS)
      .filter(([key]) => key !== os)
      .map(([key, p]) =>
        `<div class="td-platform-pill" onclick="startTableDownload('${key}')">
          ${p.icon} ${p.label}
        </div>`
      ).join('');
  }

  // Fill installation steps
  buildInstallSteps(os);

  // Populate year filter
  buildReaderYearFilter();
}

/* Build install step list for the detected or chosen OS */
function buildInstallSteps(os) {
  const platform = TABLE_PLATFORMS[os];
  if (!platform) return;
  const wrap = document.getElementById('td-steps');
  if (!wrap) return;
  wrap.innerHTML = platform.steps.map((step, i) => `
    <div class="ts-item">
      <div class="ts-num">${i + 1}</div>
      <div class="ts-text">${step}</div>
    </div>`).join('');
}

/* Main download function — fetch with progress tracking */
async function startTableDownload(osOverride) {
  const os       = osOverride || detectTableOS();
  const platform = TABLE_PLATFORMS[os];
  if (!platform) return;

  // Mobile / store platforms — just open the store link
  if (!platform.ext) {
    window.open(platform.url, '_blank');
    buildInstallSteps(os);
    return;
  }

  // Show progress UI
  const progWrap = document.getElementById('td-progress-wrap');
  const progFill = document.getElementById('td-prog-fill');
  const progLabel= document.getElementById('td-prog-label');
  const btnEl    = document.getElementById('td-download-btn');
  const banner   = document.getElementById('td-installed-banner');

  if (progWrap) progWrap.style.display = 'block';
  if (btnEl)    btnEl.disabled         = true;
  if (banner)   banner.style.display   = 'none';
  setProgLabel(progLabel, 'Connecting to branham.org…', 0, progFill);

  try {
    const response = await fetch(platform.url, { method: 'GET', mode: 'cors' });

    if (!response.ok) throw new Error('Server returned ' + response.status);

    const contentLength = response.headers.get('Content-Length');
    const total         = contentLength ? parseInt(contentLength, 10) : null;
    const reader        = response.body.getReader();
    const chunks        = [];
    let   received      = 0;

    setProgLabel(progLabel, 'Downloading…', 0, progFill);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (total) {
        const pct = Math.round((received / total) * 100);
        setProgLabel(progLabel, `Downloading… ${pct}% (${fmtBytes(received)} / ${fmtBytes(total)})`, pct, progFill);
      } else {
        setProgLabel(progLabel, `Downloading… ${fmtBytes(received)} received`, null, progFill);
        // Animate indeterminate
        if (progFill) {
          progFill.style.transition = 'none';
          progFill.style.width      = '60%';
        }
      }
    }

    setProgLabel(progLabel, 'Preparing file…', 100, progFill);

    // Reassemble and trigger browser save
    const blob     = new Blob(chunks);
    const url      = URL.createObjectURL(blob);
    const filename = 'TheTable-' + platform.label.replace(/\s/g,'') + platform.ext;
    const a        = document.createElement('a');
    a.href         = url;
    a.download     = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Success state
    setProgLabel(progLabel, `✓ Download complete — ${fmtBytes(received)} saved as ${filename}`, 100, progFill);
    if (progFill) progFill.style.background = 'linear-gradient(90deg, var(--green), #5dc98a)';
    if (banner)   banner.style.display      = 'block';
    if (btnEl) {
      btnEl.disabled    = false;
      btnEl.textContent = '⬇ Download Again';
    }
    buildInstallSteps(os);

  } catch (err) {
    console.warn('[BW Table Download]', err);
    /* CORS or network block — fall back to opening the download page */
    handleTableDownloadFallback(platform, progWrap, progFill, progLabel, btnEl);
  }
}

function handleTableDownloadFallback(platform, progWrap, progFill, progLabel, btnEl) {
  // The server may block CORS fetch — open the direct URL for the browser to handle
  window.open(platform.url, '_blank');

  if (progFill)  progFill.style.background = 'linear-gradient(90deg,var(--amber),#e0c030)';
  if (progWrap)  progWrap.style.display    = 'block';
  setProgLabel(
    progLabel,
    '⚠ Direct fetch blocked by server — the download page has been opened in a new tab.',
    80, progFill
  );
  if (btnEl) {
    btnEl.disabled    = false;
    btnEl.textContent = '⬇ Try Download Again';
  }
  // Show branham.org article as fallback
  setTimeout(() => window.open(platform.fallback, '_blank'), 800);
}

function setProgLabel(el, text, pct, fillEl) {
  if (el)     el.textContent = text;
  if (fillEl && pct !== null) {
    fillEl.style.transition = 'width .3s ease';
    fillEl.style.width      = pct + '%';
  }
}

function fmtBytes(bytes) {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ═══════════════════════════════════════════════════════════
   THE TABLE — Built-in Sermon Reader
═══════════════════════════════════════════════════════════ */

/* Local sermon library — matches what The Table indexes.
   These are sourced from the public branham.org sermon catalogue.
   The content field contains excerpt text for projection. */
const BUILTIN_SERMONS = [
  {
    id: 'be01',
    title: 'Broken Cisterns',
    date: '1958-02-02', code: '58-0202',
    topic: 'faith',
    preview: 'There is a fountain filled with blood, drawn from Emmanuel\'s veins.',
    content: [
      { section: 'OPENING', text: 'There is a fountain filled with blood,\nDrawn from Emmanuel\'s veins;\nAnd sinners plunged beneath that flood,\nLose all their guilty stains.' },
      { section: 'MAIN TEXT', text: 'Jesus Christ is the same yesterday,\ntoday, and forever.\n— Hebrews 13:8' },
      { section: 'QUOTE 1', text: '"The only thing that will satisfy\nthe human thirst is God Himself.\nNothing else will do it."' },
      { section: 'QUOTE 2', text: '"Broken cisterns can hold no water.\nBut the fountain of life — it never runs dry."' },
      { section: 'CLOSING', text: '"He said, Only believe, only believe,\nAll things are possible, only believe."' },
    ]
  },
  {
    id: 'be02',
    title: 'The Identified Christ of All Ages',
    date: '1964-04-09', code: '64-0409',
    topic: 'resurrection',
    preview: 'Jesus Christ identifies Himself in every age by His Word and His works.',
    content: [
      { section: 'OPENING', text: 'Jesus Christ the same yesterday,\nand today, and forever.\n— Hebrews 13:8' },
      { section: 'QUOTE 1', text: '"God has always identified Himself\nto His people through His Word.\nHe is the Word."' },
      { section: 'QUOTE 2', text: '"The same Jesus that walked in Galilee\nis walking among us today —\nidentified by the same signs, the same Word."' },
      { section: 'SCRIPTURE', text: 'Jesus said unto her, I am the resurrection,\nand the life: he that believeth in me,\nthough he were dead, yet shall he live.\n— John 11:25' },
      { section: 'CLOSING', text: '"He is not dead. He is risen, as He said.\nHe identified Himself then — He identifies\nHimself the same way today."' },
    ]
  },
  {
    id: 'be03',
    title: 'A Greater Than Solomon Is Here',
    date: '1958-03-27', code: '58-0327',
    topic: 'holy spirit',
    preview: 'The Holy Spirit is the Spirit of Christ moving among His people.',
    content: [
      { section: 'OPENING', text: '"Behold, a greater than Solomon is here."\n— Matthew 12:42' },
      { section: 'QUOTE 1', text: '"Solomon had wisdom, but Christ\nis wisdom. Solomon had the spirit;\nChrist is the Spirit."' },
      { section: 'QUOTE 2', text: '"The Queen of the South came from\nthe uttermost parts of the earth\nto hear the wisdom of Solomon —\nand a greater than Solomon is here."' },
      { section: 'SCRIPTURE', text: 'But the Comforter, which is the Holy Ghost,\nwhom the Father will send in my name,\nhe shall teach you all things.\n— John 14:26' },
      { section: 'CLOSING', text: '"He is here tonight — the same yesterday,\ntoday, and forever. Only believe."' },
    ]
  },
  {
    id: 'be04',
    title: 'Why Cry? Speak!',
    date: '1959-03-29', code: '59-0329S',
    topic: 'faith',
    preview: 'God told Moses to stop crying and speak to the problem.',
    content: [
      { section: 'OPENING', text: 'And the LORD said unto Moses,\nWherefore criest thou unto me?\nSpeak unto the children of Israel,\nthat they go forward.\n— Exodus 14:15' },
      { section: 'QUOTE 1', text: '"God said, Why are you crying?\nGet up! Speak to the mountain.\nYou have the authority — use it."' },
      { section: 'QUOTE 2', text: '"Faith doesn\'t cry and beg.\nFaith speaks. Faith acts.\nFaith moves the mountain."' },
      { section: 'SCRIPTURE', text: 'For verily I say unto you, That whosoever\nshall say unto this mountain, Be thou removed,\nand shall not doubt in his heart,\nhe shall have whatsoever he saith.\n— Mark 11:23' },
      { section: 'CLOSING', text: '"Stop crying about the impossibility\nand speak to it in the Name of Jesus Christ.\nFor with God, nothing shall be impossible."' },
    ]
  },
  {
    id: 'be05',
    title: 'Hebrews Chapter Six',
    date: '1957-09-01', code: '57-0901M',
    topic: 'grace',
    preview: 'The grace of God is the only anchor the soul has in the storms of life.',
    content: [
      { section: 'OPENING', text: '"Which hope we have as an anchor\nof the soul, both sure and stedfast,\nand which entereth into that within the veil."\n— Hebrews 6:19' },
      { section: 'QUOTE 1', text: '"Grace — it is not what you have done.\nIt is what He has done.\nYou cannot earn it; you can only receive it."' },
      { section: 'QUOTE 2', text: '"The anchor holds in the storm.\nNot because of your strength,\nbut because of His faithfulness."' },
      { section: 'SCRIPTURE', text: 'For by grace are ye saved through faith;\nand that not of yourselves:\nit is the gift of God:\nNot of works, lest any man should boast.\n— Ephesians 2:8-9' },
      { section: 'CLOSING', text: '"His grace is sufficient for thee.\nHis strength is made perfect in weakness.\nHe will never leave thee nor forsake thee."' },
    ]
  },
  {
    id: 'be06',
    title: 'Divine Healing',
    date: '1961-02-26', code: '61-0226',
    topic: 'healing',
    preview: 'Jesus bore our sicknesses so that we could walk in divine health.',
    content: [
      { section: 'OPENING', text: '"Surely he hath borne our griefs,\nand carried our sorrows."\n— Isaiah 53:4' },
      { section: 'QUOTE 1', text: '"The same Jesus who healed the blind Bartimaeus,\nwho raised Lazarus from the dead —\nHe is here tonight, and He is still healing."' },
      { section: 'QUOTE 2', text: '"Divine healing is not a denomination;\nit is not a movement.\nIt is a Person — Jesus Christ."' },
      { section: 'SCRIPTURE', text: 'Who his own self bare our sins in his own body\non the tree, that we, being dead to sins,\nshould live unto righteousness:\nby whose stripes ye were healed.\n— 1 Peter 2:24' },
      { section: 'CLOSING', text: '"He bore it — past tense.\nYe were healed — past tense.\nReceive it now by faith — present tense."' },
    ]
  },
  {
    id: 'be07',
    title: 'Only Believe',
    date: '1953-11-08', code: '53-1108A',
    topic: 'faith',
    preview: 'Only believe, and all things are possible to him that believeth.',
    content: [
      { section: 'OPENING', text: '"If thou canst believe,\nall things are possible\nto him that believeth."\n— Mark 9:23' },
      { section: 'SONG', text: 'Only believe, only believe,\nAll things are possible, only believe;\nOnly believe, only believe,\nAll things are possible, only believe.' },
      { section: 'QUOTE 1', text: '"It is not your great faith that moves mountains.\nIt is your faith in a great God.\nHe does the moving."' },
      { section: 'QUOTE 2', text: '"The woman with the issue of blood\ndidn\'t have great faith.\nBut she had faith enough to press through\nand touch the hem of His garment."' },
      { section: 'CLOSING', text: '"Only believe. Just that simple.\nGod does not require eloquence or perfection —\nonly a heart that believes."' },
    ]
  },
  {
    id: 'be08',
    title: 'The Seal of God',
    date: '1954-05-14', code: '54-0514',
    topic: 'holy spirit',
    preview: 'The seal of the Holy Spirit is the guarantee of our redemption.',
    content: [
      { section: 'OPENING', text: '"And grieve not the holy Spirit of God,\nwhereby ye are sealed\nunto the day of redemption."\n— Ephesians 4:30' },
      { section: 'QUOTE 1', text: '"The Holy Spirit is God\'s seal.\nWhen He seals you, the devil\ncannot break that seal.\nGod\'s seal cannot be broken."' },
      { section: 'QUOTE 2', text: '"You are not your own;\nyou are bought with a price.\nAnd God has put His seal upon you —\nHis Holy Spirit."' },
      { section: 'SCRIPTURE', text: 'In whom ye also trusted, after that ye heard\nthe word of truth, the gospel of your salvation:\nin whom also after that ye believed,\nye were sealed with that holy Spirit of promise.\n— Ephesians 1:13' },
      { section: 'CLOSING', text: '"Sealed. Secured. Safe in His hands.\nNeither death, nor life, nor angels,\nnor principalities — nothing shall separate us\nfrom the love of God."' },
    ]
  },
];

/* Build year filter dropdown */
function buildReaderYearFilter() {
  const sel = document.getElementById('reader-year');
  if (!sel || sel.options.length > 1) return;
  const years = [...new Set(BUILTIN_SERMONS.map(s => s.date.split('-')[0]))].sort().reverse();
  years.forEach(y => {
    const opt   = document.createElement('option');
    opt.value   = y;
    opt.textContent = y;
    sel.appendChild(opt);
  });
}

/* Search built-in library */
function searchBuiltinSermons() {
  const q    = (document.getElementById('reader-search')?.value.trim() || '').toLowerCase();
  const year = document.getElementById('reader-year')?.value  || '';
  const book = document.getElementById('reader-book')?.value  || '';
  const list = document.getElementById('reader-results');
  if (!list) return;

  let results = BUILTIN_SERMONS.filter(s => {
    const matchQ    = !q    || s.title.toLowerCase().includes(q) || s.preview.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
    const matchYear = !year || s.date.startsWith(year);
    const matchBook = !book || s.topic === book;
    return matchQ && matchYear && matchBook;
  });

  if (!results.length) {
    list.innerHTML = `<div style="color:var(--text-3);font-size:11px;padding:14px;text-align:center;">
      No sermons found for "<strong>${escapeHTML(q)}</strong>".<br>
      <span style="font-size:10px;">Try searching by title, date code (e.g. 58-0202) or topic.</span>
    </div>`;
    return;
  }

  list.innerHTML = results.map(s => `
    <div class="reader-result-item" onclick="openBuiltinSermon('${s.id}')">
      <div class="rri-title">${escapeHTML(s.title)}</div>
      <div class="rri-meta">${s.date} · ${s.code} · ${s.topic}</div>
      <div style="font-size:10px;color:var(--text-3);margin-top:2px;">${escapeHTML(s.preview)}</div>
    </div>`).join('');
}

/* Load featured / recent sermons */
function loadFeaturedSermons() {
  const list = document.getElementById('reader-results');
  if (!list) return;
  document.getElementById('reader-search').value = '';
  list.innerHTML = BUILTIN_SERMONS.map(s => `
    <div class="reader-result-item" onclick="openBuiltinSermon('${s.id}')">
      <div class="rri-title">${escapeHTML(s.title)}</div>
      <div class="rri-meta">${s.date} · ${s.code} · ${s.topic}</div>
      <div style="font-size:10px;color:var(--text-3);margin-top:2px;">${escapeHTML(s.preview)}</div>
    </div>`).join('');
}

/* Open a sermon into the viewer */
function openBuiltinSermon(id) {
  const sermon = BUILTIN_SERMONS.find(s => s.id === id);
  if (!sermon) return;

  const viewer = document.getElementById('reader-viewer');
  const titleEl= document.getElementById('reader-sermon-title');
  const content= document.getElementById('reader-content');

  if (viewer)  viewer.style.display  = 'block';
  if (titleEl) titleEl.textContent   = `${sermon.title} — ${sermon.code}`;
  if (content) {
    content.value = sermon.content
      .map(sl => `[${sl.section}]\n${sl.text}`)
      .join('\n\n');
  }
  content?.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

/* Select all text in viewer */
function selectAllReaderText() {
  const ta = document.getElementById('reader-content');
  if (ta) { ta.select(); ta.focus(); }
}

/* Project only the selected text in the viewer */
function projectSelectedReaderText() {
  const ta  = document.getElementById('reader-content');
  if (!ta) return;
  const sel = ta.value.substring(ta.selectionStart, ta.selectionEnd).trim();
  if (!sel) { projectFullReaderSermon(); return; }

  // Parse selected text same way as Add-to-Queue paragraph mode
  const title = document.getElementById('reader-sermon-title')?.textContent || 'Message';
  const paragraphs = sel.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  S.songIdx = null;
  S.slides  = paragraphs.map((p, i) => ({
    section: 'QUOTE ' + (i + 1),
    text:    p.replace(/^\[[^\]]+\]\n/, ''), // strip [SECTION] label if present
    tag:     title
  })).filter(sl => sl.text);
  S.cur = 0;
  renderQueue();
  renderSlide();
  closeTheTable();
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');
}

/* Project the entire sermon from the viewer */
function projectFullReaderSermon() {
  const ta = document.getElementById('reader-content');
  if (!ta || !ta.value.trim()) return;
  const title = document.getElementById('reader-sermon-title')?.textContent || 'Message';
  // Re-use the table sermon parser (manual section mode)
  document.getElementById('table-sermon-title').value  = title;
  document.getElementById('table-sermon-author').value = 'Rev. William Marrion Branham';
  document.getElementById('table-sermon-text').value   = ta.value;
  document.getElementById('table-split-mode').value    = 'manual';
  projectTableSermon();
}

/* Send reader content to Add-to-Queue tab */
function sendReaderToQueue() {
  const ta    = document.getElementById('reader-content');
  const title = document.getElementById('reader-sermon-title')?.textContent || '';
  if (!ta?.value.trim()) return;
  document.getElementById('table-sermon-title').value  = title;
  document.getElementById('table-sermon-author').value = 'Rev. William Marrion Branham';
  document.getElementById('table-sermon-text').value   = ta.value;
  const tabs = document.querySelectorAll('#table-modal .db-tab');
  if (tabs[1]) tableTab(tabs[1], 'tt-queue');
}

/* ═══════════════════════════════════════════════════════════
   THE TABLE — Quick Quote Library
   All quote text lives here in JS, never in HTML attributes.
═══════════════════════════════════════════════════════════ */

const TABLE_QUOTES = {
  only_believe: [
    'He said,',
    '"Only believe, only believe,',
    'All things are possible, only believe."'
  ].join('\n'),

  acts_26_19: [
    '"For I was not disobedient',
    'unto the heavenly vision."',
    '— Acts 26:19'
  ].join('\n'),

  heb_13_8: [
    'Jesus Christ the same',
    'yesterday, today, and forever.',
    '— Hebrews 13:8'
  ].join('\n'),

  matt_28_6: [
    '"He is risen, as He said."',
    '— Matthew 28:6'
  ].join('\n'),
};

function appendTableQuote(key) {
  const text = TABLE_QUOTES[key];
  if (!text) return;
  appendTableText(text);
}

/* ═══════════════════════════════════════════════════════════
   THE TABLE — Queue panel extras
═══════════════════════════════════════════════════════════ */

/* Clear all queue fields */
function clearTableQueue() {
  const fields = ['table-sermon-title', 'table-sermon-author', 'table-sermon-text'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = id === 'table-sermon-author' ? 'Rev. William Marrion Branham' : '';
  });
  document.getElementById('queue-slide-preview-count').textContent = '';
}

/* Live slide count preview — attach once DOM ready */
function initQueueTextWatcher() {
  const ta = document.getElementById('table-sermon-text');
  if (!ta) return;
  ta.addEventListener('input', updateQueueSlideCount);
  const modeEl = document.getElementById('table-split-mode');
  if (modeEl) modeEl.addEventListener('change', updateQueueSlideCount);
  const lplEl = document.getElementById('table-lines-per-slide');
  if (lplEl) lplEl.addEventListener('change', updateQueueSlideCount);
}

function updateQueueSlideCount() {
  const countEl = document.getElementById('queue-slide-preview-count');
  if (!countEl) return;
  const raw     = document.getElementById('table-sermon-text')?.value.trim() || '';
  if (!raw) { countEl.textContent = ''; return; }
  // Quick estimate based on selected mode
  const mode    = document.getElementById('table-split-mode')?.value || 'paragraph';
  const maxLines= parseInt(document.getElementById('table-lines-per-slide')?.value) || 3;
  let estimate  = 0;
  if (mode === 'paragraph') {
    const paras = raw.split(/\n{2,}/).filter(p => p.trim());
    paras.forEach(p => {
      const lines = p.split('\n').length;
      estimate += Math.ceil(lines / maxLines);
    });
  } else if (mode === 'sentence') {
    const sentences = raw.replace(/([.!?…])\s+/g, '$1\n').split('\n').filter(s => s.trim());
    estimate = Math.ceil(sentences.length / 2);
  } else {
    // Manual — count [Section] markers
    estimate = (raw.match(/^\[[^\]]+\]/gm) || []).length || 1;
  }
  countEl.textContent = `≈ ${estimate} slide${estimate !== 1 ? 's' : ''} will be created`;
  countEl.style.color = estimate > 20 ? 'var(--amber)' : 'var(--text-3)';
}

/* Extend quote library with new entries */
Object.assign(TABLE_QUOTES, {
  john_3_16: [
    'For God so loved the world,',
    'that he gave his only begotten Son,',
    'that whosoever believeth in him',
    'should not perish,',
    'but have everlasting life.',
    '— John 3:16'
  ].join('\n'),

  mark_9_23: [
    '"If thou canst believe,',
    'all things are possible',
    'to him that believeth."',
    '— Mark 9:23'
  ].join('\n'),

  isa_53_4: [
    'Surely he hath borne our griefs,',
    'and carried our sorrows.',
    '— Isaiah 53:4'
  ].join('\n'),

  eph_4_30: [
    'And grieve not the holy Spirit of God,',
    'whereby ye are sealed',
    'unto the day of redemption.',
    '— Ephesians 4:30'
  ].join('\n'),
});

/* Init watcher when the modal opens */
const _origOpenTheTable = openTheTable;
openTheTable = function () {
  _origOpenTheTable();
  setTimeout(initQueueTextWatcher, 100);
};

/* ═══════════════════════════════════════════════════════════
   SERVICE ORDER — Complete rewrite
   Fixes: projection, content storage, song matching,
          scripture lookup, announcement projection
═══════════════════════════════════════════════════════════ */

let _soEditorIdx = -1; // which SO item is being edited

/* ── renderSO — full rebuild ── */
function renderSO() {
  const list  = document.getElementById('so-list');
  const empty = document.getElementById('so-empty');
  if (!list) return;

  // Remove existing item rows (not the empty notice or drawer)
  Array.from(list.querySelectorAll('.so-item, .so-editor-drawer'))
    .forEach(el => el.remove());

  if (!S.so.length) {
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  S.so.forEach((item, i) => {
    /* ── Item row ── */
    const div = document.createElement('div');
    div.className = 'so-item'
      + (S.soActive === i ? ' so-active' : '')
      + (S.soProjected === i ? ' so-projected' : '');
    div.id = 'so-item-' + i;

    const hasContent = !!(item.content && item.content.trim());

    div.innerHTML = `
      <span class="so-num">${i + 1}</span>
      <span class="so-icon">${TYPE_ICONS[item.type] || '📌'}</span>
      <div class="so-info" style="flex:1;min-width:0;">
        <div class="so-name">${escapeHTML(item.name)}</div>
        <div class="so-sub">${TYPE_LABELS[item.type] || item.type}
          ${hasContent
            ? '<span style="color:var(--gold-dim);font-size:9px;margin-left:5px;">● has content</span>'
            : '<span style="color:var(--text-3);font-size:9px;margin-left:5px;">○ no content</span>'}
        </div>
      </div>
      <button class="so-proj-btn"
        onclick="event.stopPropagation();soProjectItem(${i})"
        title="Project this item now">▶ Project</button>
      <button class="so-edit-btn"
        onclick="event.stopPropagation();openSODrawer(${i})"
        title="Edit content">✎ Edit</button>
      <button class="so-ctrl" onclick="event.stopPropagation();moveSO(${i},-1)" title="Move up">↑</button>
      <button class="so-ctrl" onclick="event.stopPropagation();moveSO(${i}, 1)" title="Move down">↓</button>
      <button class="so-ctrl so-del"
        onclick="event.stopPropagation();deleteSO(${i})" title="Delete">✕</button>`;

    // Click row = activate + project
    div.addEventListener('click', () => activateSO(i));
    list.appendChild(div);
  });

  if (S.appSettings?.autoSave) saveSOToStorage();
}

/* ── activateSO — project the item ── */
function activateSO(i) {
  S.soActive = i;
  renderSO();
  soProjectItem(i);
}

/* ── soProjectItem — the actual projection logic ── */
function soProjectItem(i) {
  const item = S.so[i];
  if (!item) return;

  S.soProjected = i;

  // Switch to slides view
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');

  // ── TIMER ──
  if (item.type === 'timer') {
    centerTab(document.querySelectorAll('.ctab')[2], 'timer-view');
    return;
  }

  // ── SONG ── try library match first, fall back to stored content
  if (item.type === 'song') {
    // Fuzzy title match
    const matchIdx = fuzzyFindSong(item.name);
    if (matchIdx >= 0) {
      loadSong(matchIdx);
      return;
    }
    // If no library match but has stored content, fall through to generic
  }

  // ── SCRIPTURE ── check stored content, then SCRIPTURE_DB, then show reference
  if (item.type === 'scripture') {
    if (item.content && item.content.trim()) {
      loadSOContentAsSlides(item, i);
      return;
    }
    // Try built-in DB
    const key  = item.name.toLowerCase().trim();
    const text = SCRIPTURE_DB[key];
    if (text) {
      queueScripture(item.name, text);
      return;
    }
    // Show reference with prompt to add text
    S.songIdx = null;
    S.slides  = [{
      section: 'SCRIPTURE',
      text: item.name + '\n\n(Open Edit ✎ to add the verse text)',
      version: S.bibleVersion || 'NIV'
    }];
    S.cur = 0;
    renderQueue();
    renderSlide();
    return;
  }

  // ── ANNOUNCEMENT / SERMON / GENERIC ──
  if (item.content && item.content.trim()) {
    loadSOContentAsSlides(item, i);
    return;
  }

  // Nothing stored — show placeholder slide and open editor
  S.songIdx = null;
  S.slides  = [{
    section: (TYPE_LABELS[item.type] || 'SLIDE').toUpperCase(),
    text: item.name + '\n\n(Click ✎ Edit to add projection content)'
  }];
  S.cur = 0;
  renderQueue();
  renderSlide();
  openSODrawer(i);
}

/* ── Parse stored item content into slides ── */
function loadSOContentAsSlides(item, i) {
  const raw      = item.content.trim();
  const label    = (TYPE_LABELS[item.type] || 'SLIDE').toUpperCase();
  const sections = splitSOContent(raw, label);

  S.songIdx    = null;
  S.slides     = sections;
  S.cur        = 0;
  S.soProjected = i;

  renderQueue();
  renderSlide();
}

/* ── Split content into slides ── */
function splitSOContent(raw, defaultLabel) {
  const text   = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const slides = [];
  const secRx  = /^\[([^\]]+)\]$/;

  let curSection = defaultLabel;
  let curLines   = [];
  let slideNum   = 0;

  function flush() {
    const t = curLines.join('\n').trim();
    if (!t) { curLines = []; return; }
    // If block too long (>4 lines), split further
    const lines = t.split('\n');
    if (lines.length > 4) {
      for (let j = 0; j < lines.length; j += 4) {
        const chunk = lines.slice(j, j + 4).join('\n').trim();
        if (chunk) {
          slideNum++;
          slides.push({
            section: curSection + (slides.length > 0 ? ' ' + slideNum : ''),
            text: chunk
          });
        }
      }
    } else {
      slides.push({ section: curSection, text: t });
    }
    curLines = [];
  }

  for (const line of text.split('\n')) {
    const m = line.trim().match(/^\[([^\]]+)\]$/);
    if (m) {
      flush();
      curSection = m[1].toUpperCase();
      slideNum   = 0;
    } else if (!line.trim() && curLines.length) {
      // Blank line = paragraph break = new slide
      flush();
    } else {
      curLines.push(line);
    }
  }
  flush();

  if (!slides.length) {
    slides.push({ section: defaultLabel, text: raw });
  }
  return slides;
}

/* ── Fuzzy song finder ── */
function fuzzyFindSong(name) {
  const q = name.toLowerCase().trim();
  // Exact match first
  let idx = SONGS.findIndex(s => s.title.toLowerCase() === q);
  if (idx >= 0) return idx;
  // Contains match
  idx = SONGS.findIndex(s => s.title.toLowerCase().includes(q) || q.includes(s.title.toLowerCase()));
  return idx;
}

/* ─────────────────────────────────────────
   SO INLINE EDITOR DRAWER
───────────────────────────────────────── */

function openSODrawer(i) {
  _soEditorIdx = i;
  const item   = S.so[i];
  if (!item) return;

  // Populate fields
  const nameEl    = document.getElementById('so-edit-name');
  const typeEl    = document.getElementById('so-edit-type');
  const contentEl = document.getElementById('so-edit-content');
  const labelEl   = document.getElementById('so-drawer-label');

  if (nameEl)    nameEl.value    = item.name    || '';
  if (typeEl)    typeEl.value    = item.type    || 'announcement';
  if (contentEl) contentEl.value = item.content || '';
  if (labelEl)   labelEl.textContent = 'Edit: ' + item.name;

  // Show/hide scripture lookup
  toggleSOScriptureLookup(item.type);
  typeEl?.addEventListener('change', () => toggleSOScriptureLookup(typeEl.value));

  // Move drawer into the list after this item
  const drawer   = document.getElementById('so-editor-drawer');
  const itemEl   = document.getElementById('so-item-' + i);
  const soList   = document.getElementById('so-list');
  if (!drawer || !itemEl || !soList) return;

  drawer.style.display = 'block';
  itemEl.after(drawer);

  // Scroll drawer into view
  setTimeout(() => drawer.scrollIntoView({ behavior:'smooth', block:'nearest' }), 50);
}

function closeSODrawer() {
  const drawer = document.getElementById('so-editor-drawer');
  if (drawer) drawer.style.display = 'none';
  _soEditorIdx = -1;
}

function toggleSOScriptureLookup(type) {
  const panel = document.getElementById('so-scripture-lookup');
  if (panel) panel.style.display = (type === 'scripture') ? 'block' : 'none';
}

function saveSOItem() {
  if (_soEditorIdx < 0 || !S.so[_soEditorIdx]) return;
  const item = S.so[_soEditorIdx];
  item.name    = document.getElementById('so-edit-name')?.value.trim()    || item.name;
  item.type    = document.getElementById('so-edit-type')?.value           || item.type;
  item.content = document.getElementById('so-edit-content')?.value.trim() || '';
  closeSODrawer();
  renderSO();
}

function saveSOItemAndProject() {
  if (_soEditorIdx < 0) return;
  saveSOItem();
  soProjectItem(_soEditorIdx);
}

/* Scripture quick lookup inside drawer */
function lookupSOScripture() {
  const ref      = document.getElementById('so-sc-ref')?.value.trim();
  if (!ref) return;
  const key  = ref.toLowerCase();
  const text = SCRIPTURE_DB[key];
  const contentEl = document.getElementById('so-edit-content');
  if (!contentEl) return;
  if (text) {
    contentEl.value = text;
    document.getElementById('so-edit-name').value = ref;
  } else {
    contentEl.value = contentEl.value
      ? contentEl.value + '\n\n' + ref
      : ref + '\n\n(Verse text not found in local database — type it here)';
  }
}

/* ─────────────────────────────────────────
   SO ITEM MANAGEMENT — keep in sync
───────────────────────────────────────── */

function addSOItem() {
  const name = document.getElementById('so-inp')?.value.trim();
  const type = document.getElementById('so-type')?.value || 'song';
  if (!name) return;
  S.so.push({ name, type, content: '' });
  document.getElementById('so-inp').value = '';
  renderSO();
  // Auto-open editor for non-song types so user can add content immediately
  if (type !== 'song' && type !== 'timer') {
    setTimeout(() => openSODrawer(S.so.length - 1), 80);
  }
}

function quickAdd(name, type) {
  S.so.push({ name, type, content: '' });
  renderSO();
}

function moveSO(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= S.so.length) return;
  [S.so[i], S.so[j]] = [S.so[j], S.so[i]];
  if (S.soActive === i)    S.soActive = j;
  else if (S.soActive === j) S.soActive = i;
  if (S.soProjected === i)    S.soProjected = j;
  else if (S.soProjected === j) S.soProjected = i;
  closeSODrawer();
  renderSO();
}

function deleteSO(i) {
  if (_soEditorIdx === i) closeSODrawer();
  S.so.splice(i, 1);
  if (S.soActive    >= S.so.length) S.soActive    = S.so.length - 1;
  if (S.soProjected >= S.so.length) S.soProjected = -1;
  renderSO();
}

function saveSOToStorage() {
  try { localStorage.setItem('bw_so', JSON.stringify(S.so)); } catch(e) {}
}

/* ── Load saved SO on startup (patch DOMContentLoaded) ── */
document.addEventListener('DOMContentLoaded', () => {
  // Extend S with soProjected tracker
  S.soProjected = -1;
  // Load persisted SO
  try {
    const saved = JSON.parse(localStorage.getItem('bw_so') || '[]');
    if (Array.isArray(saved) && saved.length) {
      // Migrate old items that lack content field
      S.so = saved.map(item => ({
        name:    item.name    || 'Untitled',
        type:    item.type    || 'announcement',
        content: item.content || ''
      }));
      renderSO();
    }
  } catch(e) {}
});

/* ═══════════════════════════════════════════════════════════
   SERVICE ORDER — Final fix
   Root causes fixed:
   1. renderSO no longer touches the drawer element
   2. Drawer stays in DOM permanently (never moved into so-list)
   3. Event listeners cleaned up on each open (no stacking)
   4. addSOItem works for all types
   5. soProjected initialised safely
═══════════════════════════════════════════════════════════ */

// Safely initialise soProjected (works even if S was already built)
if (S.soProjected === undefined) S.soProjected = -1;

/* ─────────────────────────────────────────
   renderSO — only touches .so-item nodes,
   never removes the drawer
───────────────────────────────────────── */
function renderSO() {
  const list  = document.getElementById('so-list');
  const empty = document.getElementById('so-empty');
  if (!list) return;

  // Remove ONLY item rows — drawer is outside so-list
  Array.from(list.querySelectorAll('.so-item')).forEach(el => el.remove());

  if (!S.so.length) {
    if (empty) empty.style.display = '';
    saveSOToStorage();
    return;
  }
  if (empty) empty.style.display = 'none';

  S.so.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = [
      'so-item',
      S.soActive    === i ? 'so-active'   : '',
      S.soProjected === i ? 'so-projected': '',
      _soEditorIdx  === i ? 'so-editing'  : '',
    ].filter(Boolean).join(' ');
    div.id = 'so-item-' + i;

    const hasContent = !!(item.content && item.content.trim());

    div.innerHTML = `
      <span class="so-num">${i + 1}</span>
      <span class="so-icon">${TYPE_ICONS[item.type] || '📌'}</span>
      <div class="so-info" style="flex:1;min-width:0;">
        <div class="so-name">${escapeHTML(item.name)}</div>
        <div class="so-sub">
          ${TYPE_LABELS[item.type] || item.type}
          ${hasContent
            ? '<span style="color:var(--gold-dim);font-size:9px;margin-left:5px;">● content</span>'
            : '<span style="color:var(--text-3);font-size:9px;margin-left:5px;">○ empty</span>'}
        </div>
      </div>
      <button class="so-proj-btn"
        onclick="event.stopPropagation();soProjectItem(${i})"
        title="Project now">▶ Project</button>
      <button class="so-edit-btn"
        onclick="event.stopPropagation();openSODrawer(${i})"
        title="Edit content">✎ Edit</button>
      <button class="so-ctrl"
        onclick="event.stopPropagation();moveSO(${i},-1)" title="Up">↑</button>
      <button class="so-ctrl"
        onclick="event.stopPropagation();moveSO(${i}, 1)" title="Down">↓</button>
      <button class="so-ctrl so-del"
        onclick="event.stopPropagation();deleteSO(${i})" title="Delete">✕</button>`;

    div.addEventListener('click', () => activateSO(i));
    list.appendChild(div);
  });

  saveSOToStorage();
}

/* ─────────────────────────────────────────
   addSOItem
───────────────────────────────────────── */
function addSOItem() {
  const nameEl = document.getElementById('so-inp');
  const typeEl = document.getElementById('so-type');
  const name   = nameEl?.value.trim();
  const type   = typeEl?.value || 'song';
  if (!name) { if (nameEl) nameEl.focus(); return; }

  S.so.push({ name, type, content: '' });
  if (nameEl) nameEl.value = '';
  renderSO();

  // For non-song types auto-open the drawer so the user
  // can add content right away
  if (type !== 'song' && type !== 'timer') {
    openSODrawer(S.so.length - 1);
  } else {
    // Scroll the new item into view
    const lastItem = document.getElementById('so-item-' + (S.so.length - 1));
    if (lastItem) lastItem.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }
}

/* ─────────────────────────────────────────
   quickAdd
───────────────────────────────────────── */
function quickAdd(name, type) {
  S.so.push({ name, type, content: '' });
  renderSO();
}

/* ─────────────────────────────────────────
   activateSO — highlight + project
───────────────────────────────────────── */
function activateSO(i) {
  S.soActive = i;
  renderSO();
  soProjectItem(i);
}

/* ─────────────────────────────────────────
   soProjectItem — actual projection
───────────────────────────────────────── */
function soProjectItem(i) {
  const item = S.so[i];
  if (!item) return;

  S.soActive    = i;
  S.soProjected = i;
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');

  // Timer
  if (item.type === 'timer') {
    centerTab(document.querySelectorAll('.ctab')[2], 'timer-view');
    renderSO();
    return;
  }

  // Song — try library match first
  if (item.type === 'song' && !item.content) {
    const matchIdx = fuzzyFindSong(item.name);
    if (matchIdx >= 0) {
      loadSong(matchIdx);
      renderSO();
      return;
    }
  }

  // Scripture — try local DB if no stored content
  if (item.type === 'scripture' && !item.content) {
    const key  = item.name.toLowerCase().trim();
    const text = SCRIPTURE_DB[key];
    if (text) {
      queueScripture(item.name, text);
      renderSO();
      return;
    }
  }

  // Has stored content — split into slides and project
  if (item.content && item.content.trim()) {
    loadSOContentAsSlides(item, i);
    renderSO();
    return;
  }

  // Nothing to project — show placeholder and open editor
  S.songIdx = null;
  S.slides  = [{
    section: (TYPE_LABELS[item.type] || 'SLIDE').toUpperCase(),
    text: item.name + '\n\n(Click ✎ Edit to add projection content)'
  }];
  S.cur = 0;
  renderQueue();
  renderSlide();
  renderSO();
  openSODrawer(i);
}

/* ─────────────────────────────────────────
   loadSOContentAsSlides
───────────────────────────────────────── */
function loadSOContentAsSlides(item, i) {
  const label  = (TYPE_LABELS[item.type] || 'SLIDE').toUpperCase();
  const slides = splitSOContent(item.content.trim(), label);
  S.songIdx    = null;
  S.slides     = slides;
  S.cur        = 0;
  renderQueue();
  renderSlide();
}

/* ─────────────────────────────────────────
   splitSOContent
───────────────────────────────────────── */
function splitSOContent(raw, defaultLabel) {
  const text   = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const slides = [];
  let curSec   = defaultLabel;
  let curLines = [];
  let slideNum = 0;

  function flush() {
    const t = curLines.join('\n').trim();
    curLines  = [];
    if (!t) return;
    const lines = t.split('\n');
    const chunkSize = 4;
    if (lines.length <= chunkSize) {
      slides.push({ section: curSec, text: t });
    } else {
      for (let j = 0; j < lines.length; j += chunkSize) {
        const chunk = lines.slice(j, j + chunkSize).join('\n').trim();
        if (chunk) {
          slideNum++;
          slides.push({ section: curSec + ' ' + slideNum, text: chunk });
        }
      }
    }
  }

  for (const line of text.split('\n')) {
    const m = line.trim().match(/^\[([^\]]+)\]$/);
    if (m) {
      flush();
      curSec   = m[1].toUpperCase();
      slideNum = 0;
    } else if (!line.trim() && curLines.length) {
      flush();
    } else {
      curLines.push(line);
    }
  }
  flush();

  return slides.length
    ? slides
    : [{ section: defaultLabel, text: raw }];
}

/* ─────────────────────────────────────────
   fuzzyFindSong
───────────────────────────────────────── */
function fuzzyFindSong(name) {
  const q   = name.toLowerCase().trim();
  let   idx = SONGS.findIndex(s => s.title.toLowerCase() === q);
  if (idx >= 0) return idx;
  idx = SONGS.findIndex(s =>
    s.title.toLowerCase().includes(q) ||
    q.includes(s.title.toLowerCase())
  );
  return idx;
}

/* ─────────────────────────────────────────
   openSODrawer — never moves the element,
   just shows it and populates it
───────────────────────────────────────── */
function openSODrawer(i) {
  const item = S.so[i];
  if (!item) return;

  _soEditorIdx = i;

  // Remove the 'so-editing' class from all items, add to this one
  document.querySelectorAll('.so-item').forEach(el => el.classList.remove('so-editing'));
  document.getElementById('so-item-' + i)?.classList.add('so-editing');

  // Populate fields
  const nameEl    = document.getElementById('so-edit-name');
  const contentEl = document.getElementById('so-edit-content');
  const labelEl   = document.getElementById('so-drawer-label');
  if (nameEl)    nameEl.value    = item.name    || '';
  if (contentEl) contentEl.value = item.content || '';
  if (labelEl)   labelEl.textContent = 'Editing: ' + item.name;

  // Handle type select — clone to clear stacked listeners
  const oldType = document.getElementById('so-edit-type');
  if (oldType) {
    const newType = oldType.cloneNode(true);
    oldType.parentNode.replaceChild(newType, oldType);
    newType.value = item.type || 'announcement';
    newType.addEventListener('change', () => {
      toggleSOScriptureLookup(newType.value);
    });
    toggleSOScriptureLookup(newType.value);
  }

  // Show the drawer
  const drawer = document.getElementById('so-editor-drawer');
  if (!drawer) return;
  drawer.style.display = 'block';

  // Scroll the drawer into view
  setTimeout(() => {
    drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    contentEl?.focus();
  }, 50);
}

/* ─────────────────────────────────────────
   closeSODrawer — just hides, never moves
───────────────────────────────────────── */
function closeSODrawer() {
  const drawer = document.getElementById('so-editor-drawer');
  if (drawer) drawer.style.display = 'none';

  // Remove editing highlight
  document.querySelectorAll('.so-item.so-editing')
    .forEach(el => el.classList.remove('so-editing'));

  _soEditorIdx = -1;
}

/* ─────────────────────────────────────────
   saveSOItem / saveSOItemAndProject
───────────────────────────────────────── */
function saveSOItem() {
  if (_soEditorIdx < 0 || !S.so[_soEditorIdx]) {
    closeSODrawer();
    return;
  }
  const item      = S.so[_soEditorIdx];
  const nameEl    = document.getElementById('so-edit-name');
  const typeEl    = document.getElementById('so-edit-type');
  const contentEl = document.getElementById('so-edit-content');
  if (nameEl    && nameEl.value.trim())    item.name    = nameEl.value.trim();
  if (typeEl)                              item.type    = typeEl.value;
  if (contentEl)                           item.content = contentEl.value.trim();
  closeSODrawer();
  renderSO();
}

function saveSOItemAndProject() {
  if (_soEditorIdx < 0) return;
  const savedIdx = _soEditorIdx;
  saveSOItem();          // closes drawer, calls renderSO
  soProjectItem(savedIdx);
}

/* ─────────────────────────────────────────
   toggleSOScriptureLookup
───────────────────────────────────────── */
function toggleSOScriptureLookup(type) {
  const panel = document.getElementById('so-scripture-lookup');
  if (panel) panel.style.display = (type === 'scripture') ? 'block' : 'none';
}

/* ─────────────────────────────────────────
   lookupSOScripture
───────────────────────────────────────── */
function lookupSOScripture() {
  const refEl     = document.getElementById('so-sc-ref');
  const contentEl = document.getElementById('so-edit-content');
  const nameEl    = document.getElementById('so-edit-name');
  if (!refEl || !contentEl) return;

  const ref  = refEl.value.trim();
  if (!ref) return;
  const key  = ref.toLowerCase();
  const text = SCRIPTURE_DB[key];

  if (text) {
    contentEl.value = text;
    if (nameEl && !nameEl.value.trim()) nameEl.value = ref;
    refEl.value = '';
  } else {
    const existing = contentEl.value.trim();
    contentEl.value = existing
      ? existing + '\n\n' + ref + '\n(type verse text here)'
      : ref + '\n\n(type verse text here)';
    contentEl.focus();
  }
}

/* ─────────────────────────────────────────
   moveSO / deleteSO
───────────────────────────────────────── */
function moveSO(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= S.so.length) return;
  [S.so[i], S.so[j]] = [S.so[j], S.so[i]];
  if (S.soActive    === i) S.soActive    = j;
  else if (S.soActive    === j) S.soActive    = i;
  if (S.soProjected === i) S.soProjected = j;
  else if (S.soProjected === j) S.soProjected = i;
  if (_soEditorIdx  === i) _soEditorIdx  = j;
  else if (_soEditorIdx  === j) _soEditorIdx  = i;
  closeSODrawer();
  renderSO();
}

function deleteSO(i) {
  if (_soEditorIdx === i) closeSODrawer();
  S.so.splice(i, 1);
  if (S.soActive    >= S.so.length) S.soActive    = S.so.length - 1;
  if (S.soProjected >= S.so.length) S.soProjected = -1;
  if (_soEditorIdx  >= S.so.length) _soEditorIdx  = -1;
  renderSO();
}

/* ─────────────────────────────────────────
   saveSOToStorage
───────────────────────────────────────── */
function saveSOToStorage() {
  try { localStorage.setItem('bw_so', JSON.stringify(S.so)); } catch(e) {}
}

/* ─────────────────────────────────────────
   exportServiceOrder / printServiceOrder
───────────────────────────────────────── */
function exportServiceOrder() {
  downloadJSON({ serviceOrder: S.so, exportedAt: new Date().toISOString() },
    'service-order.json');
}

function printServiceOrder() {
  const win = window.open('', '_blank', 'width=800,height=600');
  if (!win) return;
  const rows = S.so.map((item, i) =>
    `<tr>
      <td>${i + 1}</td>
      <td>${TYPE_ICONS[item.type] || ''} ${item.name}</td>
      <td>${TYPE_LABELS[item.type] || item.type}</td>
      <td style="color:#888;font-size:11px;">${item.content ? '✓ has content' : '—'}</td>
    </tr>`
  ).join('');
  win.document.write(`<!DOCTYPE html><html><head><title>Service Order</title>
    <style>
      body{font-family:sans-serif;padding:32px;}
      h2{margin-bottom:4px;} p{color:#888;margin-bottom:20px;}
      table{width:100%;border-collapse:collapse;}
      th{background:#f5f5f5;padding:8px 12px;text-align:left;border-bottom:2px solid #ddd;}
      td{padding:7px 12px;border-bottom:1px solid #eee;}
    </style></head><body>
    <h2>${(S.appSettings && S.appSettings.churchName) || 'BrideWorship Pro'} — Service Order</h2>
    <p>Printed: ${new Date().toLocaleString()}</p>
    <table>
      <thead><tr><th>#</th><th>Item</th><th>Type</th><th>Content</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <script>window.onload=()=>window.print()<\/script>
  </body></html>`);
  win.document.close();
}

/* ─────────────────────────────────────────
   Load saved SO on startup
───────────────────────────────────────── */
(function loadSavedSO() {
  // Use IIFE so it runs immediately regardless of DOMContentLoaded timing
  function doLoad() {
    try {
      const saved = JSON.parse(localStorage.getItem('bw_so') || '[]');
      if (Array.isArray(saved) && saved.length) {
        S.so = saved.map(item => ({
          name:    item.name    || 'Untitled',
          type:    item.type    || 'announcement',
          content: item.content || ''
        }));
        renderSO();
      }
    } catch(e) {}
  }
  // If DOM is already ready, run now; otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doLoad);
  } else {
    doLoad();
  }
})();

/* ═══════════════════════════════════════════════════════════
   SCHEDULE — Full implementation
   Features: ordered projection, drag-and-drop, auto-run,
             save/load, export/import, duration tracking,
             song/scripture/sermon/media/timer/blank/logo
═══════════════════════════════════════════════════════════ */

/* ── State ── */
let SCH = {
  items:      [],       // array of schedule items
  current:    -1,       // currently projecting index
  editing:    -1,       // currently editing index
  loop:       false,
  autoRun:    false,
  autoIv:     null,
  savedList:  [],       // array of {name, date, items}
  dragSrc:    -1,       // drag source index
};

/* Item colours / icons for thumbnails */
const SCH_TYPE_META = {
  song:         { icon:'🎵', color:'#c9a84c44', label:'Song'         },
  scripture:    { icon:'📖', color:'#4a90d944', label:'Scripture'     },
  sermon:       { icon:'🎤', color:'#d4a01744', label:'Sermon'        },
  announcement: { icon:'📢', color:'#4caf7a44', label:'Announcement'  },
  media:        { icon:'🖼', color:'#b07aff44', label:'Media'         },
  timer:        { icon:'⏱', color:'#e0505044', label:'Timer'         },
  blank:        { icon:'⬛', color:'#22222244', label:'Blank Screen'  },
  logo:         { icon:'◈', color:'#c9a84c44', label:'Logo Slide'    },
};

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
(function initSchedule() {
  function doInit() {
    buildSchSongPicker();
    loadSavedSchedules();
    // Load last active schedule if present
    try {
      const last = JSON.parse(localStorage.getItem('bw_sch_active') || 'null');
      if (last && Array.isArray(last.items)) {
        SCH.items = last.items;
        document.getElementById('sch-title').value = last.name || '';
        renderSchedule();
      }
    } catch(e) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doInit);
  } else { doInit(); }
})();

function buildSchSongPicker() {
  const sel = document.getElementById('sch-song-pick');
  if (!sel) return;
  // Keep first placeholder option
  while (sel.options.length > 1) sel.remove(1);
  SONGS.forEach((s, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = s.title + (s.author ? ' — ' + s.author : '');
    sel.appendChild(opt);
  });
}

/* ─────────────────────────────────────────
   ADD ITEMS
───────────────────────────────────────── */
function scheduleAddSong() {
  const sel   = document.getElementById('sch-song-pick');
  const idx   = parseInt(sel?.value);
  if (isNaN(idx) || idx < 0 || !SONGS[idx]) return;
  const song  = SONGS[idx];
  schPushItem({
    type:     'song',
    label:    song.title,
    songIdx:  idx,
    author:   song.author || '',
    content:  '',
    notes:    '',
    duration: 0,
  });
  sel.value = '';
}

function scheduleAddScripture() {
  const inp = document.getElementById('sch-sc-inp');
  const ref = inp?.value.trim();
  if (!ref) return;
  const key  = ref.toLowerCase();
  const text = SCRIPTURE_DB[key] || '';
  schPushItem({
    type:    'scripture',
    label:   ref,
    content: text,
    notes:   '',
    duration: 1,
  });
  if (inp) inp.value = '';
}

function scheduleAddItem(label, type) {
  schPushItem({ type, label, content: '', notes: '', duration: 0 });
  // Auto-open editor so user can add content
  if (type !== 'blank' && type !== 'logo' && type !== 'timer') {
    openSchEditor(SCH.items.length - 1);
  }
}

function scheduleAddBlank() {
  schPushItem({ type:'blank', label:'Blank Screen', content:'', notes:'', duration: 0 });
}

function scheduleAddLogo() {
  schPushItem({ type:'logo', label:'Logo Slide', content:'', notes:'', duration: 0 });
}

function schPushItem(item) {
  SCH.items.push({ selected: false, done: false, ...item });
  renderSchedule();
  schSaveActive();
  // Scroll to bottom of list
  const list = document.getElementById('sch-list');
  if (list) setTimeout(() => list.scrollTop = list.scrollHeight, 60);
}

/* ─────────────────────────────────────────
   RENDER
───────────────────────────────────────── */
function renderSchedule() {
  const list  = document.getElementById('sch-list');
  const empty = document.getElementById('sch-empty');
  if (!list) return;

  Array.from(list.querySelectorAll('.sch-item')).forEach(el => el.remove());

  if (!SCH.items.length) {
    if (empty) empty.style.display = '';
    updateSchStats();
    return;
  }
  if (empty) empty.style.display = 'none';

  SCH.items.forEach((item, i) => {
    const meta   = SCH_TYPE_META[item.type] || SCH_TYPE_META.announcement;
    const isCur  = i === SCH.current;
    const isDone = item.done && !isCur;

    const div = document.createElement('div');
    div.className = [
      'sch-item',
      isCur           ? 'sch-current'  : '',
      isDone          ? 'sch-done'     : '',
      item.selected   ? 'sch-selected' : '',
      SCH.editing === i ? 'sch-editing'  : '',
    ].filter(Boolean).join(' ');
    div.dataset.type  = item.type;
    div.dataset.index = String(i);
    div.draggable     = true;

    // Thumbnail background from current slide BG
    const curBg   = BACKGROUNDS.find(b => b.id === S.bgId) || BACKGROUNDS[0];
    const thumbBg = item.thumbUrl ? '' : curBg.bg;
    const thumbContent = item.thumbUrl
      ? `<img src="${item.thumbUrl}" alt="">`
      : `<div class="sch-item-thumb-bg" style="background:${thumbBg};"></div>
         <div class="sch-item-thumb-text">${meta.icon}</div>`;

    div.innerHTML = `
      <input type="checkbox" class="sch-check" ${item.selected ? 'checked' : ''}
        onclick="event.stopPropagation();schToggleSelect(${i},this.checked)">
      <div class="sch-item-num" id="sch-num-${i}">${i + 1}</div>
      <div class="sch-item-thumb">
        ${isCur ? '<div class="sch-live-badge">LIVE</div>' : ''}
        ${thumbContent}
      </div>
      <div class="sch-item-body">
        <div class="sch-item-title">${escapeHTML(item.label || meta.label)}</div>
        <div class="sch-item-sub">
          <span>${meta.label}</span>
          ${item.author ? `<span>· ${escapeHTML(item.author)}</span>` : ''}
          ${item.content ? '<span style="color:var(--gold-dim);">· ● slides</span>' : ''}
          ${item.notes   ? '<span class="sch-item-notes-dot" title="Has notes"></span>' : ''}
        </div>
        ${item.duration
          ? `<div class="sch-item-duration">⏱ ${item.duration} min</div>`
          : ''}
      </div>
      <div class="sch-item-ctrl">
        <button class="sch-icb proj" onclick="event.stopPropagation();schProject(${i})" title="Project">▶</button>
        <button class="sch-icb"      onclick="event.stopPropagation();openSchEditor(${i})" title="Edit">✎</button>
        <button class="sch-icb"      onclick="event.stopPropagation();schMoveItem(${i},-1)" title="Up">↑</button>
        <button class="sch-icb"      onclick="event.stopPropagation();schMoveItem(${i}, 1)" title="Down">↓</button>
        <button class="sch-icb del"  onclick="event.stopPropagation();schDeleteItem(${i})" title="Delete">✕</button>
      </div>`;

    // Click = project
    div.addEventListener('click', () => schProject(i));

    // Drag-and-drop
    div.addEventListener('dragstart', e => { SCH.dragSrc = i; div.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    div.addEventListener('dragend',   () => { div.classList.remove('dragging'); document.querySelectorAll('.sch-drag-over').forEach(el => el.classList.remove('sch-drag-over')); });
    div.addEventListener('dragover',  e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; div.classList.add('sch-drag-over'); });
    div.addEventListener('dragleave', () => div.classList.remove('sch-drag-over'));
    div.addEventListener('drop',      e => { e.preventDefault(); div.classList.remove('sch-drag-over'); schDropItem(i); });

    list.appendChild(div);
  });

  updateSchStats();
  updateSchCounter();
  updateSchProgress();
}

/* ─────────────────────────────────────────
   PROJECT
───────────────────────────────────────── */
function schProject(i) {
  const item = SCH.items[i];
  if (!item) return;

  // Mark previous as done
  if (SCH.current >= 0 && SCH.current !== i) {
    SCH.items[SCH.current].done = true;
  }
  SCH.current = i;
  renderSchedule();

  // Update preview panel
  updateSchPreview(item);

  // Switch center to slides view
  centerTab(document.querySelectorAll('.ctab')[0], 'slides-view');

  // ── Blank
  if (item.type === 'blank') {
    if (!S.blanked) toggleBlank();
    return;
  }
  if (S.blanked) toggleBlank(); // un-blank first

  // ── Logo
  if (item.type === 'logo') {
    if (!S.logo) toggleLogo();
    return;
  }
  if (S.logo) toggleLogo(); // un-logo

  // ── Timer
  if (item.type === 'timer') {
    centerTab(document.querySelectorAll('.ctab')[3], 'timer-view');
    const mins = item.timerMin || 5;
    const secs = item.timerSec || 0;
    setTimer(mins + secs / 60 > 0 ? 0 : 5); // reset
    S.timer.rem   = mins * 60 + secs;
    S.timer.total = S.timer.rem;
    window._bwTimerTick && window._bwTimerTick();
    return;
  }

  // ── Song
  if (item.type === 'song' && item.songIdx !== undefined && SONGS[item.songIdx]) {
    loadSong(item.songIdx);
    return;
  }

  // ── Scripture with no stored content — try DB
  if (item.type === 'scripture' && !item.content) {
    const key  = item.label.toLowerCase().trim();
    const text = SCRIPTURE_DB[key];
    if (text) { queueScripture(item.label, text); return; }
  }

  // ── Has content → split and project
  if (item.content && item.content.trim()) {
    const label  = item.label || (SCH_TYPE_META[item.type]?.label || 'SLIDE').toUpperCase();
    const slides = splitSOContent(item.content.trim(), label.toUpperCase());
    S.songIdx = null;
    S.slides  = slides;
    S.cur     = 0;
    renderQueue();
    renderSlide();
    return;
  }

  // ── Fallback placeholder
  S.songIdx = null;
  S.slides  = [{
    section: (SCH_TYPE_META[item.type]?.label || 'SLIDE').toUpperCase(),
    text: item.label + '\n\n(Edit this item to add content)'
  }];
  S.cur = 0;
  renderQueue();
  renderSlide();
  openSchEditor(i);
}

/* ─────────────────────────────────────────
   PREVIEW PANEL
───────────────────────────────────────── */
function updateSchPreview(item) {
  const bg      = document.getElementById('sch-preview-bg');
  const ref     = document.getElementById('sch-preview-ref');
  const txt     = document.getElementById('sch-preview-text');
  const badge   = document.getElementById('sch-preview-badge');
  const screen  = document.getElementById('sch-preview-screen');
  const meta    = SCH_TYPE_META[item?.type] || SCH_TYPE_META.announcement;
  const curBg   = BACKGROUNDS.find(b => b.id === S.bgId) || BACKGROUNDS[0];

  if (bg)     bg.style.background  = curBg.bg;
  if (ref)    ref.textContent       = item ? (meta.label + ' · ' + (item.author || '')).trim().replace(/· $/, '') : '';
  if (txt)    txt.textContent       = item
    ? (item.content
        ? item.content.replace(/\[[^\]]+\]\n?/g, '').split('\n\n')[0].substring(0, 80) + '…'
        : item.label)
    : 'Select an item to preview';
  if (badge) {
    badge.textContent = SCH.current >= 0 && SCH.items[SCH.current] === item ? 'LIVE' : 'PREVIEW';
    badge.classList.toggle('live', SCH.current >= 0 && SCH.items[SCH.current] === item);
  }
  if (screen) screen.classList.toggle('live', SCH.current >= 0 && SCH.items[SCH.current] === item);
}

/* ─────────────────────────────────────────
   EDITOR
───────────────────────────────────────── */
function openSchEditor(i) {
  const item = SCH.items[i];
  if (!item) return;
  SCH.editing = i;

  // Highlight editing item
  document.querySelectorAll('.sch-item').forEach(el => el.classList.remove('sch-editing'));
  const itemEl = document.querySelector(`.sch-item[data-index="${i}"]`);
  if (itemEl) itemEl.classList.add('sch-editing');

  // Show editor
  const editor  = document.getElementById('sch-editor');
  if (editor) editor.style.display = 'block';

  const labelEl = document.getElementById('sch-editor-label');
  if (labelEl) labelEl.textContent = 'Edit: ' + (item.label || 'Item');

  // Populate
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
  setVal('sch-edit-label',    item.label    || '');
  setVal('sch-edit-content',  item.content  || '');
  setVal('sch-edit-notes',    item.notes    || '');
  setVal('sch-edit-duration', item.duration || '');
  setVal('sch-edit-timer-min', item.timerMin ?? 5);
  setVal('sch-edit-timer-sec', item.timerSec ?? 0);

  // Type select — clone to clear stacked listeners
  const oldType = document.getElementById('sch-edit-type');
  if (oldType) {
    const newType = oldType.cloneNode(true);
    oldType.parentNode.replaceChild(newType, oldType);
    newType.value = item.type || 'announcement';
    newType.addEventListener('change', onSchTypeChange);
    onSchTypeChange();
  }

  // Song picker
  buildSchSongPicker();
  const songSel = document.getElementById('sch-edit-song');
  if (songSel && item.songIdx !== undefined) songSel.value = String(item.songIdx);

  // Media picker — populate from _mediaFiles
  const mediaSel = document.getElementById('sch-edit-media');
  if (mediaSel) {
    while (mediaSel.options.length > 1) mediaSel.remove(1);
    _mediaFiles.forEach(mf => {
      const opt = document.createElement('option');
      opt.value = mf.id;
      opt.textContent = mf.name;
      mediaSel.appendChild(opt);
    });
    if (item.mediaId) mediaSel.value = item.mediaId;
  }

  // Scroll editor into view
  setTimeout(() => editor?.scrollIntoView({ behavior:'smooth', block:'nearest' }), 40);
}

function onSchTypeChange() {
  const type    = document.getElementById('sch-edit-type')?.value || 'announcement';
  const showEl  = id => { const el = document.getElementById(id); if (el) el.style.display = 'block'; };
  const hideEl  = id => { const el = document.getElementById(id); if (el) el.style.display = 'none';  };
  // Reset all
  ['sch-text-area','sch-song-area','sch-media-area','sch-timer-area'].forEach(hideEl);
  if      (type === 'song')           showEl('sch-song-area');
  else if (type === 'media')          showEl('sch-media-area');
  else if (type === 'timer')          showEl('sch-timer-area');
  else if (type !== 'blank' && type !== 'logo') showEl('sch-text-area');
}

function closeSchEditor() {
  const editor = document.getElementById('sch-editor');
  if (editor) editor.style.display = 'none';
  document.querySelectorAll('.sch-item.sch-editing').forEach(el => el.classList.remove('sch-editing'));
  SCH.editing = -1;
}

function saveSchItem() {
  const i = SCH.editing;
  if (i < 0 || !SCH.items[i]) { closeSchEditor(); return; }
  const item = SCH.items[i];
  const type = document.getElementById('sch-edit-type')?.value || item.type;

  item.type     = type;
  item.label    = document.getElementById('sch-edit-label')?.value.trim()    || item.label;
  item.content  = document.getElementById('sch-edit-content')?.value.trim()  || '';
  item.notes    = document.getElementById('sch-edit-notes')?.value.trim()    || '';
  item.duration = parseFloat(document.getElementById('sch-edit-duration')?.value) || 0;

  if (type === 'song') {
    const sIdx = parseInt(document.getElementById('sch-edit-song')?.value);
    if (!isNaN(sIdx) && SONGS[sIdx]) {
      item.songIdx = sIdx;
      item.label   = item.label || SONGS[sIdx].title;
      item.author  = SONGS[sIdx].author || '';
    }
  }
  if (type === 'timer') {
    item.timerMin = parseInt(document.getElementById('sch-edit-timer-min')?.value) || 5;
    item.timerSec = parseInt(document.getElementById('sch-edit-timer-sec')?.value) || 0;
  }
  if (type === 'media') {
    const mId = document.getElementById('sch-edit-media')?.value;
    item.mediaId = mId;
    const mf = _mediaFiles.find(m => m.id === mId);
    if (mf) { item.thumbUrl = mf.thumb || null; item.label = item.label || mf.name; }
  }

  closeSchEditor();
  renderSchedule();
  schSaveActive();
}

function saveSchItemAndProject() {
  const i = SCH.editing;
  saveSchItem();
  if (i >= 0) schProject(i);
}

/* ─────────────────────────────────────────
   ITEM MANAGEMENT
───────────────────────────────────────── */
function schDeleteItem(i) {
  if (SCH.editing === i) closeSchEditor();
  SCH.items.splice(i, 1);
  if (SCH.current >= SCH.items.length) SCH.current = SCH.items.length - 1;
  if (SCH.editing >= SCH.items.length) SCH.editing = -1;
  renderSchedule();
  schSaveActive();
}

function schMoveItem(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= SCH.items.length) return;
  [SCH.items[i], SCH.items[j]] = [SCH.items[j], SCH.items[i]];
  if (SCH.current === i) SCH.current = j;
  else if (SCH.current === j) SCH.current = i;
  if (SCH.editing === i) SCH.editing = j;
  else if (SCH.editing === j) SCH.editing = i;
  renderSchedule();
  schSaveActive();
}

function schDropItem(targetIdx) {
  const src = SCH.dragSrc;
  if (src < 0 || src === targetIdx) return;
  const item = SCH.items.splice(src, 1)[0];
  SCH.items.splice(targetIdx, 0, item);
  if (SCH.current === src) SCH.current = targetIdx;
  SCH.dragSrc = -1;
  renderSchedule();
  schSaveActive();
}

function schToggleSelect(i, val) {
  if (SCH.items[i]) SCH.items[i].selected = val;
}

function scheduleSelectAll()   { SCH.items.forEach(it => it.selected = true);  renderSchedule(); }
function scheduleDeselectAll() { SCH.items.forEach(it => it.selected = false); renderSchedule(); }
function scheduleDeleteSelected() {
  if (!confirm('Delete all selected items?')) return;
  SCH.items = SCH.items.filter(it => !it.selected);
  SCH.current = -1; SCH.editing = -1;
  renderSchedule(); schSaveActive();
}

/* ─────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────── */
function schNavFirst() { if (SCH.items.length) schProject(0); }
function schNavLast()  { if (SCH.items.length) schProject(SCH.items.length - 1); }
function schNavPrev() {
  const next = SCH.current > 0 ? SCH.current - 1 : (SCH.loop ? SCH.items.length - 1 : 0);
  if (SCH.items.length) schProject(next);
}
function schNavNext() {
  if (!SCH.items.length) return;
  const next = SCH.current < SCH.items.length - 1
    ? SCH.current + 1
    : (SCH.loop ? 0 : SCH.current);
  schProject(next);
}

function updateSchCounter() {
  const el = document.getElementById('sch-nav-counter');
  if (!el) return;
  const cur = SCH.current >= 0 ? SCH.current + 1 : '—';
  el.textContent = `${cur} / ${SCH.items.length || '—'}`;
}

/* ─────────────────────────────────────────
   AUTO-RUN
───────────────────────────────────────── */
function toggleSchAutoRun() {
  SCH.autoRun = !SCH.autoRun;
  const btn = document.getElementById('sch-auto-btn');
  if (btn) btn.classList.toggle('on', SCH.autoRun);
  if (SCH.autoRun) startSchAutoRun();
  else             stopSchAutoRun();
}

function startSchAutoRun() {
  stopSchAutoRun();
  const secs = parseInt(document.getElementById('sch-auto-interval')?.value) || 10;
  SCH.autoIv = setInterval(() => {
    if (SCH.current < SCH.items.length - 1) {
      schNavNext();
    } else if (SCH.loop) {
      schProject(0);
    } else {
      stopSchAutoRun();
    }
  }, secs * 1000);
}

function stopSchAutoRun() {
  clearInterval(SCH.autoIv);
  SCH.autoIv  = null;
  SCH.autoRun = false;
  const btn = document.getElementById('sch-auto-btn');
  if (btn) btn.classList.remove('on');
}

function toggleSchLoop() {
  SCH.loop = !SCH.loop;
  document.getElementById('sch-loop-btn')?.classList.toggle('on', SCH.loop);
}

/* ─────────────────────────────────────────
   STATS
───────────────────────────────────────── */
function updateSchStats() {
  const total = SCH.items.reduce((sum, it) => sum + (it.duration || 0), 0);
  const durEl = document.getElementById('sch-dur-total');
  const cntEl = document.getElementById('sch-dur-items');
  if (durEl) durEl.textContent = total ? `${total} min` : '0 min';
  if (cntEl) cntEl.textContent = String(SCH.items.length);
}

function updateSchProgress() {
  const fill  = document.getElementById('sch-progress-fill');
  const pct   = document.getElementById('sch-progress-pct');
  if (!SCH.items.length) {
    if (fill) fill.style.width = '0%';
    if (pct)  pct.textContent  = '0%';
    return;
  }
  const done  = SCH.current + 1;
  const p     = Math.round((done / SCH.items.length) * 100);
  if (fill) fill.style.width  = p + '%';
  if (pct)  pct.textContent   = p + '%';
}

/* ─────────────────────────────────────────
   SAVE / LOAD / EXPORT / IMPORT
───────────────────────────────────────── */
function schSaveActive() {
  try {
    localStorage.setItem('bw_sch_active', JSON.stringify({
      name:  document.getElementById('sch-title')?.value.trim() || 'Untitled',
      items: SCH.items
    }));
  } catch(e) {}
}

function newSchedule() {
  if (SCH.items.length && !confirm('Clear the current schedule and start a new one?')) return;
  stopSchAutoRun();
  SCH.items   = []; SCH.current = -1; SCH.editing = -1;
  const t = document.getElementById('sch-title');
  if (t) t.value = '';
  closeSchEditor();
  renderSchedule();
  schSaveActive();
}

function saveSchedule() {
  const name = document.getElementById('sch-title')?.value.trim();
  if (!name) { alert('Please give your schedule a name before saving.'); document.getElementById('sch-title')?.focus(); return; }
  if (!SCH.items.length) { alert('Add at least one item before saving.'); return; }
  // Check for duplicate name
  const existing = SCH.savedList.findIndex(s => s.name === name);
  const entry    = { name, date: new Date().toISOString(), items: JSON.parse(JSON.stringify(SCH.items)) };
  if (existing >= 0) SCH.savedList[existing] = entry;
  else               SCH.savedList.push(entry);
  try { localStorage.setItem('bw_sch_saved', JSON.stringify(SCH.savedList)); } catch(e) {}
  renderSavedSchedules();
  showSchToast(`Schedule "${name}" saved.`);
}

function loadSavedSchedules() {
  try {
    const saved = JSON.parse(localStorage.getItem('bw_sch_saved') || '[]');
    if (Array.isArray(saved)) SCH.savedList = saved;
  } catch(e) {}
  renderSavedSchedules();
}

function renderSavedSchedules() {
  const list = document.getElementById('sch-saved-list');
  if (!list) return;
  if (!SCH.savedList.length) {
    list.innerHTML = '<div style="font-size:10px;color:var(--text-3);padding:8px;">No saved schedules yet.</div>';
    return;
  }
  list.innerHTML = SCH.savedList.map((s, i) => `
    <div class="sch-saved-item">
      <div class="sch-saved-name">${escapeHTML(s.name)}</div>
      <div class="sch-saved-meta">${s.items.length} items · ${new Date(s.date).toLocaleDateString()}</div>
      <button class="sch-btn" onclick="loadSavedSchedule(${i})" style="font-size:9px;padding:2px 7px;">Load</button>
      <button class="sch-saved-del" onclick="deleteSavedSchedule(${i})" title="Delete">✕</button>
    </div>`).join('');
}

function loadSavedSchedule(i) {
  const s = SCH.savedList[i];
  if (!s) return;
  if (SCH.items.length && !confirm(`Replace current schedule with "${s.name}"?`)) return;
  stopSchAutoRun();
  SCH.items   = JSON.parse(JSON.stringify(s.items));
  SCH.current = -1; SCH.editing = -1;
  const t = document.getElementById('sch-title');
  if (t) t.value = s.name;
  closeSchEditor();
  renderSchedule();
  schSaveActive();
}

function deleteSavedSchedule(i) {
  if (!confirm('Delete this saved schedule?')) return;
  SCH.savedList.splice(i, 1);
  try { localStorage.setItem('bw_sch_saved', JSON.stringify(SCH.savedList)); } catch(e) {}
  renderSavedSchedules();
}

function loadScheduleDialog() {
  // Scroll saved schedules into view
  const col = document.getElementById('sch-saved-col');
  if (col) col.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function exportSchedule() {
  const name = document.getElementById('sch-title')?.value.trim() || 'schedule';
  dlJSON({
    app:       'BrideWorship Pro',
    type:      'schedule',
    name,
    exportedAt: new Date().toISOString(),
    items:     SCH.items
  }, name.replace(/\s+/g,'_') + '.bwsch');
}

function importSchedule(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      const items = data.items || (Array.isArray(data) ? data : null);
      if (!items) throw new Error('No items found.');
      if (SCH.items.length && !confirm(`Replace current schedule with "${data.name || 'imported'}"?`)) return;
      stopSchAutoRun();
      SCH.items   = items;
      SCH.current = -1;
      const t = document.getElementById('sch-title');
      if (t) t.value = data.name || '';
      renderSchedule();
      schSaveActive();
      showSchToast(`Imported ${items.length} schedule item(s).`);
    } catch(err) { alert('Import failed: ' + err.message); }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function printSchedule() {
  const name = document.getElementById('sch-title')?.value.trim() || 'Schedule';
  const win  = window.open('', '_blank', 'width=820,height=620');
  if (!win) return;
  const rows = SCH.items.map((item, i) => {
    const meta = SCH_TYPE_META[item.type] || {};
    return `<tr>
      <td>${i + 1}</td>
      <td>${meta.icon || ''} ${item.label || ''}</td>
      <td>${meta.label || item.type}</td>
      <td>${item.duration ? item.duration + ' min' : '—'}</td>
      <td style="color:#888;font-size:11px;">${item.notes || ''}</td>
    </tr>`;
  }).join('');
  const total = SCH.items.reduce((s, it) => s + (it.duration || 0), 0);
  win.document.write(`<!DOCTYPE html><html><head><title>${name}</title>
    <style>
      body{font-family:sans-serif;padding:32px;}
      h2{margin-bottom:2px;}p{color:#888;font-size:12px;margin-bottom:18px;}
      table{width:100%;border-collapse:collapse;}
      th{background:#f4f4f4;padding:8px 12px;text-align:left;border-bottom:2px solid #ddd;font-size:12px;}
      td{padding:7px 12px;border-bottom:1px solid #eee;font-size:12px;}
      tfoot td{background:#f9f9f9;font-weight:700;border-top:2px solid #ccc;}
    </style></head><body>
    <h2>${name}</h2>
    <p>Printed: ${new Date().toLocaleString()} · ${SCH.items.length} items · Est. total: ${total} min</p>
    <table>
      <thead><tr><th>#</th><th>Item</th><th>Type</th><th>Duration</th><th>Notes</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="3">TOTAL</td><td>${total} min</td><td></td></tr></tfoot>
    </table>
    <script>window.onload=()=>window.print()<\/script>
  </body></html>`);
  win.document.close();
}

/* ─────────────────────────────────────────
   MEDIA IMPORT INTO SCHEDULE
───────────────────────────────────────── */
function scheduleImportMedia(event) {
  // Reuse the global handleMediaImport then also update the schedule media picker
  handleMediaImport(event);
  setTimeout(() => {
    const mediaSel = document.getElementById('sch-edit-media');
    if (!mediaSel) return;
    while (mediaSel.options.length > 1) mediaSel.remove(1);
    _mediaFiles.forEach(mf => {
      const opt = document.createElement('option');
      opt.value = mf.id; opt.textContent = mf.name;
      mediaSel.appendChild(opt);
    });
  }, 200);
}

/* ─────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────── */
function showSchToast(msg) {
  let toast = document.getElementById('sch-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sch-toast';
    toast.style.cssText = `
      position:fixed;bottom:60px;left:50%;transform:translateX(-50%);
      background:var(--bg-active);border:1px solid var(--gold-dim);
      color:var(--gold-light);padding:8px 20px;border-radius:20px;
      font-size:12px;font-family:'Lato',sans-serif;
      z-index:9999;pointer-events:none;
      animation:fadeIn .3s ease;`;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = 'block';
  clearTimeout(toast._iv);
  toast._iv = setTimeout(() => { if (toast) toast.style.display = 'none'; }, 2800);
}

/* ─────────────────────────────────────────
   KEYBOARD — extend existing handler
───────────────────────────────────────── */
document.addEventListener('keydown', e => {
  // Only fire when schedule view is active
  const schView = document.getElementById('schedule-view');
  if (!schView || schView.style.display === 'none') return;
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); schNavNext(); }
  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); schNavPrev(); }
  if (e.key === 'Home')  { e.preventDefault(); schNavFirst(); }
  if (e.key === 'End')   { e.preventDefault(); schNavLast(); }
});

/* ═══════════════════════════════════════════════════════════
   LIBRARY → SCHEDULE  Drag-and-Drop Engine
   Supports: Songs, Scripture, Media, Presentations
   Works like EasyWorship / FreeShow drag-to-schedule
═══════════════════════════════════════════════════════════ */

/* ── Drag state ── */
let _libDrag = {
  active:   false,
  data:     null,    // { type, label, ... } payload
  dropIdx:  -1,      // insertion index (-1 = append)
};

/* ─────────────────────────────────────────
   INIT — wire up all library sections
───────────────────────────────────────── */

// Override buildSongLibrary to add drag
const _origBuildSongLibrary = buildSongLibrary;
buildSongLibrary = function () {
  _origBuildSongLibrary();
  wireSongLibraryDrag();
};

function wireSongLibraryDrag() {
  const container = document.getElementById('ls-songs');
  if (!container) return;
  container.querySelectorAll('.lib-item').forEach((item, i) => {
    if (item.dataset.dragWired) return;
    item.dataset.dragWired = 'true';
    item.setAttribute('draggable', 'true');

    // Drag handle pill
    const pill = document.createElement('span');
    pill.className   = 'lib-drag-pill';
    pill.textContent = '⠿ drag';
    item.appendChild(pill);

    item.addEventListener('dragstart', e => {
      const song = SONGS[i];
      if (!song) return;
      startLibDrag(e, {
        type:    'song',
        label:   song.title,
        author:  song.author || '',
        songIdx: i,
        content: '',
        notes:   '',
        duration: 0,
      }, song.title);
    });
    item.addEventListener('dragend', endLibDrag);
  });
}

function wireScriptureDrag() {
  const container = document.getElementById('ls-scripture');
  if (!container) return;
  container.querySelectorAll('.lib-item').forEach(item => {
    if (item.dataset.dragWired) return;
    item.dataset.dragWired = 'true';
    item.setAttribute('draggable', 'true');
    item.classList.add('draggable-item');

    const pill = document.createElement('span');
    pill.className   = 'lib-drag-pill';
    pill.textContent = '⠿ drag';
    item.appendChild(pill);

    const ref  = item.querySelector('.li-title')?.textContent || 'Scripture';
    const text = (() => {
      // Extract text from the onclick attribute
      const raw = item.getAttribute('onclick') || '';
      const m   = raw.match(/queueScripture\('[^']+',\s*'([^']+)'\)/);
      return m ? m[1] : '';
    })();

    item.addEventListener('dragstart', e => {
      startLibDrag(e, {
        type:    'scripture',
        label:   ref,
        content: text,
        notes:   '',
        duration: 1,
      }, ref);
    });
    item.addEventListener('dragend', endLibDrag);
  });
}

function wireMediaDrag() {
  // Wire hardcoded media items
  const container = document.getElementById('ls-media');
  if (!container) return;
  container.querySelectorAll('.lib-item').forEach(item => {
    if (item.dataset.dragWired) return;
    item.dataset.dragWired = 'true';
    item.setAttribute('draggable', 'true');
    item.classList.add('draggable-item');

    const pill = document.createElement('span');
    pill.className   = 'lib-drag-pill';
    pill.textContent = '⠿ drag';
    item.appendChild(pill);

    const name    = item.querySelector('.li-title')?.textContent || 'Media';
    const tagText = item.querySelector('.li-tag')?.textContent || '';
    const isTimer = tagText.toLowerCase().includes('timer');

    item.addEventListener('dragstart', e => {
      startLibDrag(e, {
        type:    isTimer ? 'timer' : 'media',
        label:   name,
        content: '',
        notes:   '',
        duration: 0,
      }, name);
    });
    item.addEventListener('dragend', endLibDrag);
  });

  // Also wire dynamically imported media thumbnails
  document.querySelectorAll('.media-thumb-item').forEach(thumb => {
    if (thumb.dataset.dragWired) return;
    thumb.dataset.dragWired = 'true';
    thumb.setAttribute('draggable', 'true');

    const id = thumb.id?.replace('mthumb-', '');
    const mf = _mediaFiles.find(m => m.id === id);
    if (!mf) return;

    thumb.addEventListener('dragstart', e => {
      startLibDrag(e, {
        type:     'media',
        label:    mf.name.replace(/\.[^.]+$/, ''),
        mediaId:  mf.id,
        thumbUrl: mf.thumb || null,
        content:  '',
        notes:    '',
        duration: 0,
      }, mf.name);
    });
    thumb.addEventListener('dragend', endLibDrag);
  });
}

function wirePresentationDrag() {
  document.querySelectorAll('.pres-item').forEach((item, i) => {
    if (item.dataset.dragWired) return;
    item.dataset.dragWired = 'true';
    item.setAttribute('draggable', 'true');

    const pill = document.createElement('span');
    pill.className   = 'lib-drag-pill';
    pill.textContent = '⠿ drag';
    item.appendChild(pill);

    const pres = PRESENTATIONS[i];
    if (!pres) return;

    item.addEventListener('dragstart', e => {
      startLibDrag(e, {
        type:    'sermon',
        label:   pres.title,
        author:  pres.author || '',
        content: pres.slides.map(s => `[${s.section}]\n${s.text}`).join('\n\n'),
        notes:   '',
        duration: 0,
      }, pres.title);
    });
    item.addEventListener('dragend', endLibDrag);
  });
}

/* ─────────────────────────────────────────
   DRAG START / END
───────────────────────────────────────── */

function startLibDrag(event, data, label) {
  _libDrag.active  = true;
  _libDrag.data    = data;
  _libDrag.dropIdx = -1;
  SCH.dragSrc      = -1; // not an internal reorder

  // Encode in dataTransfer
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData('application/bw-lib', JSON.stringify(data));

  // Custom ghost image
  const ghost = getOrCreateGhost();
  ghost.textContent = (data.type === 'song' ? '🎵 ' : data.type === 'scripture' ? '📖 ' : data.type === 'media' ? '🖼 ' : '📌 ') + label;
  event.dataTransfer.setDragImage(ghost, 0, 0);

  // Source item dimming
  event.currentTarget.classList.add('lib-dragging');

  // Show global hint bar
  document.getElementById('sch-drag-hint')?.classList.add('visible');

  // Show dropzone in schedule list
  document.getElementById('sch-lib-dropzone')?.classList.add('visible');

  // If schedule tab is not active, highlight it
  highlightSchTab();
}

function endLibDrag(event) {
  _libDrag.active = false;
  _libDrag.data   = null;

  event.currentTarget.classList.remove('lib-dragging');
  document.getElementById('sch-drag-hint')?.classList.remove('visible');
  document.getElementById('sch-lib-dropzone')?.classList.remove('visible', 'drag-ready');
  document.getElementById('sch-list')?.classList.remove('ext-drag-over');

  // Clear all insert highlights
  document.querySelectorAll('.sch-item.sch-insert-above, .sch-item.sch-insert-below')
    .forEach(el => el.classList.remove('sch-insert-above', 'sch-insert-below'));
}

function getOrCreateGhost() {
  let ghost = document.getElementById('lib-drag-ghost');
  if (!ghost) {
    ghost    = document.createElement('div');
    ghost.id = 'lib-drag-ghost';
    document.body.appendChild(ghost);
  }
  return ghost;
}

function highlightSchTab() {
  const tabs = document.querySelectorAll('.ctab');
  tabs.forEach(t => {
    if (t.textContent.includes('Schedule')) {
      t.style.borderBottomColor = 'var(--gold)';
      t.style.color             = 'var(--gold)';
      setTimeout(() => { t.style.borderBottomColor = ''; t.style.color = ''; }, 2000);
    }
  });
}

/* ─────────────────────────────────────────
   SCHEDULE LIST — drag over / leave / drop
───────────────────────────────────────── */

function schListDragOver(event) {
  event.preventDefault();

  // ── Internal reorder (existing behaviour) ── handled by item-level events
  if (SCH.dragSrc >= 0) return;

  // ── Library drag ──
  const hasLib = event.dataTransfer.types.includes('application/bw-lib');
  if (!hasLib) return;

  event.dataTransfer.dropEffect = 'copy';
  document.getElementById('sch-list')?.classList.add('ext-drag-over');
  document.getElementById('sch-lib-dropzone')?.classList.add('drag-ready');

  // Calculate insertion index from mouse Y
  const idx = getSchInsertIndex(event.clientY);
  _libDrag.dropIdx = idx;

  // Visual insert indicator
  clearSchInsertHighlights();
  if (idx >= 0 && idx < SCH.items.length) {
    const targetEl = document.querySelector(`.sch-item[data-index="${idx}"]`);
    if (targetEl) targetEl.classList.add('sch-insert-above');
  } else {
    // Append — highlight last item bottom
    const lastEl = document.querySelector(`.sch-item[data-index="${SCH.items.length - 1}"]`);
    if (lastEl) lastEl.classList.add('sch-insert-below');
  }
}

function schListDragLeave(event) {
  // Only clear if leaving the list entirely (not entering a child)
  const list = document.getElementById('sch-list');
  if (!list) return;
  const related = event.relatedTarget;
  if (related && list.contains(related)) return;

  list.classList.remove('ext-drag-over');
  document.getElementById('sch-lib-dropzone')?.classList.remove('drag-ready');
  clearSchInsertHighlights();
}

function schListDrop(event) {
  event.preventDefault();
  event.stopPropagation();

  document.getElementById('sch-list')?.classList.remove('ext-drag-over');
  document.getElementById('sch-lib-dropzone')?.classList.remove('visible', 'drag-ready');
  clearSchInsertHighlights();

  // ── Internal reorder already handled by item-level drop ──
  if (SCH.dragSrc >= 0) return;

  // ── Library drop ──
  let data;
  try {
    const raw = event.dataTransfer.getData('application/bw-lib');
    data = raw ? JSON.parse(raw) : _libDrag.data;
  } catch(e) {
    data = _libDrag.data;
  }
  if (!data) return;

  const insertAt = _libDrag.dropIdx;
  schInsertFromLibrary(data, insertAt);

  _libDrag.active  = false;
  _libDrag.data    = null;
  _libDrag.dropIdx = -1;

  document.getElementById('sch-drag-hint')?.classList.remove('visible');
}

/* ─────────────────────────────────────────
   INSERT FROM LIBRARY
───────────────────────────────────────── */

function schInsertFromLibrary(data, insertAt) {
  const newItem = {
    type:     data.type     || 'announcement',
    label:    data.label    || 'Untitled',
    author:   data.author   || '',
    content:  data.content  || '',
    notes:    data.notes    || '',
    duration: data.duration || 0,
    selected: false,
    done:     false,
  };

  // Song-specific
  if (data.type === 'song' && data.songIdx !== undefined) {
    newItem.songIdx = data.songIdx;
  }

  // Media-specific
  if (data.type === 'media' && data.mediaId) {
    newItem.mediaId  = data.mediaId;
    newItem.thumbUrl = data.thumbUrl || null;
  }

  // Timer
  if (data.type === 'timer') {
    newItem.timerMin = data.timerMin || 5;
    newItem.timerSec = data.timerSec || 0;
  }

  // Insert at position or append
  if (insertAt >= 0 && insertAt < SCH.items.length) {
    SCH.items.splice(insertAt, 0, newItem);
    // Adjust current pointer if needed
    if (SCH.current >= insertAt) SCH.current++;
  } else {
    SCH.items.push(newItem);
  }

  renderSchedule();
  schSaveActive();

  // Scroll new item into view
  const newIdx  = insertAt >= 0 && insertAt < SCH.items.length - 1 ? insertAt : SCH.items.length - 1;
  const newEl   = document.querySelector(`.sch-item[data-index="${newIdx}"]`);
  if (newEl) {
    newEl.classList.add('sch-selected');
    setTimeout(() => {
      newEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      newEl.classList.remove('sch-selected');
    }, 80);
  }

  // Toast feedback
  showSchToast(`Added "${newItem.label}" to schedule${insertAt >= 0 ? ' at position ' + (insertAt + 1) : ''}`);

  // Auto-switch to schedule tab so user sees the result
  const schTab = Array.from(document.querySelectorAll('.ctab'))
    .find(t => t.textContent.includes('Schedule'));
  if (schTab) centerTab(schTab, 'schedule-view');
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */

function getSchInsertIndex(mouseY) {
  const items = Array.from(document.querySelectorAll('.sch-item'));
  for (let i = 0; i < items.length; i++) {
    const rect   = items[i].getBoundingClientRect();
    const midY   = rect.top + rect.height / 2;
    if (mouseY < midY) return parseInt(items[i].dataset.index);
  }
  return -1; // append
}

function clearSchInsertHighlights() {
  document.querySelectorAll('.sch-item.sch-insert-above, .sch-item.sch-insert-below')
    .forEach(el => el.classList.remove('sch-insert-above', 'sch-insert-below'));
}

/* ─────────────────────────────────────────
   WIRE UP ON DOM READY & after lib rebuilds
───────────────────────────────────────── */

(function initLibraryDrag() {
  function doWire() {
    wireSongLibraryDrag();
    wireScriptureDrag();
    wireMediaDrag();
    wirePresentationDrag();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doWire);
  } else {
    doWire();
  }
})();

// Re-wire after media is imported (thumbnails added dynamically)
const _origAppendMediaThumb = appendMediaThumb;
appendMediaThumb = function(entry) {
  _origAppendMediaThumb(entry);
  setTimeout(wireMediaDrag, 100);
};

// Re-wire after presentations list rebuilds
const _origRenderPresentationList = renderPresentationList;
renderPresentationList = function() {
  _origRenderPresentationList();
  setTimeout(wirePresentationDrag, 100);
};

// Re-wire after song library rebuilds (e.g. after import)
const _origBuildSongLib2 = buildSongLibrary;
buildSongLibrary = function() {
  _origBuildSongLib2();
  setTimeout(wireSongLibraryDrag, 100);
};

// Also re-wire scripture when library tab is switched to
document.addEventListener('click', e => {
  if (e.target.classList.contains('ltab') && e.target.textContent.includes('Scripture')) {
    setTimeout(wireScriptureDrag, 80);
  }
});

/* ═══════════════════════════════════════════════════════════
   CLOCK — Output preview + projection window
═══════════════════════════════════════════════════════════ */

const CLOCK_STATE = {
  on:       true,
  format:   '12h',
  color:    '#ffffff',
  size:     '11px',
  pos:      'br',
  style:    'shadow',
  onProj:   true,
  onStage:  true,
};

/* Start the clock tick */
let _clockIv = null;
function startClock() {
  if (_clockIv) clearInterval(_clockIv);
  tickClock();
  _clockIv = setInterval(tickClock, 1000);
}

function tickClock() {
  const str = getClockString();
  // Local output preview
  const el = document.getElementById('out-clock');
  if (el) {
    if (!CLOCK_STATE.on) { el.classList.add('hidden'); return; }
    el.classList.remove('hidden');
    el.textContent   = str;
    el.style.color   = CLOCK_STATE.color;
    el.style.fontSize= CLOCK_STATE.size;
    // Position class
    el.className = 'out-clock pos-' + CLOCK_STATE.pos + ' style-' + CLOCK_STATE.style;
  }
  // Push to projection window
  if (CLOCK_STATE.onProj) pushClockToProj(str);
  // Push to stage display
  if (CLOCK_STATE.onStage) pushClockToStage(str);
}

function getClockString() {
  const now = new Date();
  const h24 = now.getHours();
  const m   = String(now.getMinutes()).padStart(2, '0');
  const s   = String(now.getSeconds()).padStart(2, '0');
  const fmt = CLOCK_STATE.format;
  if (fmt === '24h')  return `${String(h24).padStart(2,'0')}:${m}`;
  if (fmt === '24hs') return `${String(h24).padStart(2,'0')}:${m}:${s}`;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12  = h24 % 12 || 12;
  if (fmt === '12hs') return `${h12}:${m}:${s} ${ampm}`;
  return `${h12}:${m} ${ampm}`;
}

function pushClockToProj(str) {
  if (!S.projWin || S.projWin.closed) return;
  const d = S.projWin.document;
  let clockEl = d.getElementById('proj-clock');
  if (!clockEl) {
    clockEl    = d.createElement('div');
    clockEl.id = 'proj-clock';
    injectProjClockStyle(d);
    d.body.appendChild(clockEl);
  }
  clockEl.textContent = str;
  // Apply settings
  const posMap = {
    br:'bottom:18px;right:24px;',
    bl:'bottom:18px;left:24px;',
    tr:'top:18px;right:24px;',
    tl:'top:18px;left:24px;',
    bc:'bottom:18px;left:50%;transform:translateX(-50%);',
    tc:'top:18px;left:50%;transform:translateX(-50%);',
  };
  const styleMap = {
    plain:   'text-shadow:none;',
    shadow:  'text-shadow:0 2px 8px rgba(0,0,0,.95);',
    box:     'background:rgba(0,0,0,.65);padding:4px 10px;border-radius:4px;',
    outline: '-webkit-text-stroke:1px rgba(0,0,0,.8);text-shadow:none;',
    gold:    `color:${CLOCK_STATE.color};text-shadow:0 0 12px rgba(201,168,76,.6);`,
  };
  clockEl.style.cssText = `
    position:fixed;
    ${posMap[CLOCK_STATE.pos] || posMap.br}
    font-family:'Cinzel',serif;
    font-size:${parseInt(CLOCK_STATE.size) * 1.8}px;
    color:${CLOCK_STATE.color};
    letter-spacing:2px;
    z-index:50;
    pointer-events:none;
    white-space:nowrap;
    ${styleMap[CLOCK_STATE.style] || styleMap.shadow}
    display:${CLOCK_STATE.on && CLOCK_STATE.onProj ? 'block' : 'none'};
  `;
}

function injectProjClockStyle(d) {
  if (d.getElementById('bw-clock-style')) return;
  const s = d.createElement('style');
  s.id    = 'bw-clock-style';
  s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap');`;
  d.head.appendChild(s);
}

function pushClockToStage(str) {
  if (!S.stageWin || S.stageWin.closed) return;
  const d  = S.stageWin.document;
  const el = d.getElementById('stg-clock');
  if (el) el.textContent = str;
}

function toggleClock(on) {
  CLOCK_STATE.on = on;
  const panel = document.getElementById('clock-settings-panel');
  if (panel) panel.style.opacity = on ? '1' : '.4';
  tickClock();
  saveClockSettings();
}

function updateClockSettings() {
  CLOCK_STATE.format  = document.getElementById('clock-format')?.value  || '12h';
  CLOCK_STATE.color   = document.getElementById('clock-color')?.value   || '#ffffff';
  CLOCK_STATE.size    = document.getElementById('clock-size')?.value    || '11px';
  CLOCK_STATE.pos     = document.getElementById('clock-pos')?.value     || 'br';
  CLOCK_STATE.style   = document.getElementById('clock-style')?.value   || 'shadow';
  CLOCK_STATE.onProj  = document.getElementById('clock-on-proj')?.checked  ?? true;
  CLOCK_STATE.onStage = document.getElementById('clock-on-stage')?.checked ?? true;
  tickClock();
  saveClockSettings();
}

function saveClockSettings() {
  try { localStorage.setItem('bw_clock', JSON.stringify(CLOCK_STATE)); } catch(e) {}
}

function loadClockSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('bw_clock') || 'null');
    if (!saved) return;
    Object.assign(CLOCK_STATE, saved);
    // Restore UI
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    const chk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
    set('clock-format', CLOCK_STATE.format);
    set('clock-color',  CLOCK_STATE.color);
    set('clock-size',   CLOCK_STATE.size);
    set('clock-pos',    CLOCK_STATE.pos);
    set('clock-style',  CLOCK_STATE.style);
    chk('clock-toggle', CLOCK_STATE.on);
    chk('clock-on-proj',  CLOCK_STATE.onProj);
    chk('clock-on-stage', CLOCK_STATE.onStage);
  } catch(e) {}
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATES
═══════════════════════════════════════════════════════════ */

/* Preset template definitions */
const PRESET_TEMPLATES = [
  {
    id: 'classic-worship',
    name: 'Classic Worship',
    tag: 'Dark',
    bg: 'radial-gradient(ellipse at 28% 28%,#1c0f38 0%,#08051a 55%,#020208 100%)',
    font: 'Playfair Display', textColor: '#f6f2ec', titleColor: '#c9a84c',
    footerColor: '#55535a', align: 'center', shadow: 'soft',
    lineSpacing: '1.65', grid: true, corners: true, footer: true, vignette: false,
    watermark: '', watermarkColor: '#c9a84c22',
  },
  {
    id: 'bold-modern',
    name: 'Bold Modern',
    tag: 'Light',
    bg: 'radial-gradient(ellipse at center,#faf8f5 0%,#ede9e0 100%)',
    font: 'Lato', textColor: '#1a1814', titleColor: '#7a6230',
    footerColor: '#9a9890', align: 'center', shadow: 'none',
    lineSpacing: '1.5', grid: false, corners: false, footer: true, vignette: false,
    watermark: '', watermarkColor: '#00000022',
  },
  {
    id: 'regal-gold',
    name: 'Regal Gold',
    tag: 'Dark',
    bg: 'radial-gradient(ellipse at center,#1a1408 0%,#060400 100%)',
    font: 'Cinzel', textColor: '#fef8e8', titleColor: '#e8c97a',
    footerColor: '#7a6230', align: 'center', shadow: 'glow',
    lineSpacing: '1.65', grid: true, corners: true, footer: true, vignette: true,
    watermark: '✦', watermarkColor: '#c9a84c11',
  },
  {
    id: 'deep-blue',
    name: 'Deep Blue',
    tag: 'Dark',
    bg: 'radial-gradient(ellipse at center,#081424 0%,#020a14 100%)',
    font: 'Playfair Display', textColor: '#e8f0f8', titleColor: '#4a90d9',
    footerColor: '#4a6080', align: 'center', shadow: 'soft',
    lineSpacing: '1.65', grid: true, corners: true, footer: true, vignette: false,
    watermark: '', watermarkColor: '#4a90d911',
  },
  {
    id: 'crimson-fire',
    name: 'Crimson Fire',
    tag: 'Dark',
    bg: 'radial-gradient(ellipse at center,#1a0808 0%,#080202 100%)',
    font: 'Cinzel', textColor: '#fef0f0', titleColor: '#e05050',
    footerColor: '#7a3030', align: 'center', shadow: 'glow',
    lineSpacing: '1.65', grid: false, corners: true, footer: true, vignette: true,
    watermark: '', watermarkColor: '#e0505011',
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    tag: 'Dark',
    bg: 'radial-gradient(ellipse at center,#081a0c 0%,#020804 100%)',
    font: 'Playfair Display', textColor: '#eefef2', titleColor: '#4caf7a',
    footerColor: '#2a5a3a', align: 'center', shadow: 'soft',
    lineSpacing: '1.65', grid: true, corners: true, footer: true, vignette: false,
    watermark: '', watermarkColor: '#4caf7a11',
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    tag: 'Light',
    bg: '#ffffff',
    font: 'Lato', textColor: '#222222', titleColor: '#888888',
    footerColor: '#bbbbbb', align: 'left', shadow: 'none',
    lineSpacing: '1.5', grid: false, corners: false, footer: true, vignette: false,
    watermark: '', watermarkColor: '#00000011',
  },
  {
    id: 'deep-purple',
    name: 'Deep Purple',
    tag: 'Dark',
    bg: 'radial-gradient(ellipse at 28% 28%,#1a0830 0%,#0a0412 100%)',
    font: 'Playfair Display', textColor: '#f0e8ff', titleColor: '#b07aff',
    footerColor: '#6040a0', align: 'center', shadow: 'glow',
    lineSpacing: '1.65', grid: true, corners: true, footer: true, vignette: true,
    watermark: '', watermarkColor: '#b07aff11',
  },
  {
    id: 'slate-pro',
    name: 'Slate Pro',
    tag: 'Dark',
    bg: 'radial-gradient(ellipse at 28% 28%,#141828 0%,#080a0e 100%)',
    font: 'Lato', textColor: '#e8ecf4', titleColor: '#8090b0',
    footerColor: '#404860', align: 'center', shadow: 'hard',
    lineSpacing: '1.5', grid: false, corners: false, footer: true, vignette: false,
    watermark: '', watermarkColor: '#ffffff08',
  },
  {
    id: 'dark-teal',
    name: 'Dark Teal',
    tag: 'Dark',
    bg: 'radial-gradient(ellipse at center,#041418 0%,#020a0c 100%)',
    font: 'Cinzel', textColor: '#e0f8f8', titleColor: '#40c0c0',
    footerColor: '#205050', align: 'center', shadow: 'glow',
    lineSpacing: '1.65', grid: true, corners: true, footer: true, vignette: false,
    watermark: '', watermarkColor: '#40c0c011',
  },
  {
    id: 'newspaper',
    name: 'Newspaper',
    tag: 'Light',
    bg: 'radial-gradient(ellipse at center,#f5f0e8 0%,#e8e0d0 100%)',
    font: 'Playfair Display', textColor: '#1a1008', titleColor: '#5a4020',
    footerColor: '#9a8060', align: 'left', shadow: 'none',
    lineSpacing: '1.5', grid: false, corners: false, footer: true, vignette: false,
    watermark: '', watermarkColor: '#00000011',
  },
  {
    id: 'stadium',
    name: 'Stadium',
    tag: 'Bold',
    bg: '#000000',
    font: 'Lato', textColor: '#ffffff', titleColor: '#ffdd00',
    footerColor: '#666666', align: 'center', shadow: 'hard',
    lineSpacing: '1.4', grid: false, corners: false, footer: false, vignette: false,
    watermark: '', watermarkColor: '#ffffff08',
  },
];

let _customTemplates = [];
let _selectedTemplateId = null;
let _editingTemplateIdx = -1;

/* ── Open / Close ── */
function openTemplates() {
  _selectedTemplateId = null;
  loadCustomTemplates();
  renderPresetGrid();
  renderCustomGrid();
  document.getElementById('templates-modal').style.display = 'flex';
}

function closeTemplates() {
  document.getElementById('templates-modal').style.display = 'none';
}

function tmplTab(btn, panelId) {
  document.querySelectorAll('#templates-modal .db-tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.tmpl-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById(panelId);
  if (panel) panel.style.display = 'flex';
}

/* ── Render preset grid ── */
function renderPresetGrid() {
  const grid = document.getElementById('tmpl-preset-grid');
  if (!grid) return;
  grid.innerHTML = '';
  PRESET_TEMPLATES.forEach(t => {
    grid.appendChild(buildTemplateCard(t, false));
  });
}

/* ── Render custom grid ── */
function renderCustomGrid() {
  const grid = document.getElementById('tmpl-custom-grid');
  if (!grid) return;
  if (!_customTemplates.length) {
    grid.innerHTML = `<div style="color:var(--text-3);font-size:11px;padding:16px;text-align:center;grid-column:1/-1;">
      No custom templates yet.<br>Create one in the Editor tab.
    </div>`;
    return;
  }
  grid.innerHTML = '';
  _customTemplates.forEach((t, i) => {
    grid.appendChild(buildTemplateCard(t, true, i));
  });
}

/* ── Build a template card ── */
function buildTemplateCard(t, isCustom, customIdx) {
  const div = document.createElement('div');
  div.className = 'tmpl-card' + (_selectedTemplateId === t.id ? ' selected' : '');
  div.dataset.id = t.id;

  const isApplied = _selectedTemplateId === t.id;
  const shadows = {
    none:    'none',
    soft:    '0 1px 6px rgba(0,0,0,.9)',
    glow:    `0 0 10px ${t.titleColor}88, 0 1px 6px rgba(0,0,0,.8)`,
    hard:    '1px 1px 0 rgba(0,0,0,.9)',
    outline: '-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000',
  };

  div.innerHTML = `
    <div class="tmpl-card-screen">
      <div class="tmpl-card-bg" style="background:${t.bg};"></div>
      ${t.grid ? '<div class="tmpl-card-grid-line"></div>' : ''}
      ${t.corners ? `<div class="tmpl-card-corners">
        <span class="c-tl"></span><span class="c-tr"></span>
        <span class="c-bl"></span><span class="c-br"></span>
      </div>` : ''}
      ${t.vignette ? '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,.7) 100%);"></div>' : ''}
      <div class="tmpl-card-inner">
        <div class="tmpl-card-title-line" style="color:${t.titleColor};font-family:'${t.font}',serif;">
          Song Title
        </div>
        <div class="tmpl-card-text-line" style="
          color:${t.textColor};
          font-family:'${t.font}',serif;
          text-align:${t.align};
          text-shadow:${shadows[t.shadow] || 'none'};
          line-height:${t.lineSpacing};
        ">
          Amazing grace!<br>How sweet the sound
        </div>
      </div>
      ${t.footer ? `<div class="tmpl-card-footer-line" style="color:${t.footerColor};">VERSE 1 · NIV</div>` : ''}
      ${t.watermark ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px;color:${t.watermarkColor};pointer-events:none;">${escapeHTML(t.watermark)}</div>` : ''}
      ${isApplied ? '<div class="tmpl-apply-badge">ACTIVE</div>' : ''}
    </div>
    <div class="tmpl-card-name">
      <span>${escapeHTML(t.name)}</span>
      <div style="display:flex;gap:4px;align-items:center;">
        <span class="tmpl-card-tag">${t.tag || ''}</span>
        ${isCustom ? `<button class="tmpl-card-del" onclick="event.stopPropagation();deleteCustomTemplate(${customIdx})" title="Delete">✕</button>` : ''}
      </div>
    </div>`;

  div.addEventListener('click', () => {
    _selectedTemplateId = t.id;
    document.querySelectorAll('.tmpl-card').forEach(c => c.classList.remove('selected'));
    div.classList.add('selected');
  });

  div.addEventListener('dblclick', () => {
    _selectedTemplateId = t.id;
    applySelectedTemplate();
  });

  return div;
}

/* ── Apply selected template ── */
function applySelectedTemplate() {
  if (!_selectedTemplateId) { alert('Select a template first.'); return; }
  const t = [...PRESET_TEMPLATES, ..._customTemplates].find(x => x.id === _selectedTemplateId);
  if (!t) return;
  applyTemplateObject(t);
  closeTemplates();
}

function applyTemplateObject(t) {
  // Background
  S.bgId = t.id;
  const slideBg = document.getElementById('slide-bg');
  const outBg   = document.getElementById('out-bg');
  if (slideBg) slideBg.style.background = t.bg;
  if (outBg)   outBg.style.background   = t.bg;

  // Unmark bg swatches
  document.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));

  // Format
  S.format.font        = t.font;
  S.format.color       = t.textColor;
  S.format.align       = t.align;
  S.format.shadow      = t.shadow;
  S.format.lineHeight  = t.lineSpacing;

  // Sync right-panel controls
  const fontMap = {'Playfair Display':'playfair','Cinzel':'cinzel','Lato':'lato','Arial, sans-serif':'sans'};
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('font-sel',      fontMap[t.font] || 'playfair');
  setVal('fmt-shadow',    t.shadow);
  setVal('line-spacing',  t.lineSpacing);
  ['left','center','right'].forEach(a => document.getElementById('align-' + a)?.classList.toggle('on', a === t.align));

  // Deco
  S.deco.grid    = t.grid;
  S.deco.corners = t.corners;
  const dGrid = document.getElementById('deco-grid');
  const dCorn = document.getElementById('deco-corners');
  if (dGrid) dGrid.checked = t.grid;
  if (dCorn) dCorn.checked = t.corners;
  document.getElementById('slide-grid')?.classList.toggle('hidden', !t.grid);
  ['c-tl','c-tr','c-bl','c-br'].forEach(id => {
    document.getElementById(id)?.classList.toggle('hidden', !t.corners);
  });

  // Vignette — inject/remove overlay
  let vig = document.getElementById('slide-vignette');
  if (t.vignette) {
    if (!vig) {
      vig    = document.createElement('div');
      vig.id = 'slide-vignette';
      vig.style.cssText = 'position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,.7) 100%);pointer-events:none;z-index:1;';
      document.getElementById('main-slide')?.appendChild(vig);
    }
  } else {
    vig?.remove();
  }

  // Watermark
  let wm = document.getElementById('slide-watermark');
  if (t.watermark) {
    if (!wm) {
      wm    = document.createElement('div');
      wm.id = 'slide-watermark';
      wm.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:48px;pointer-events:none;z-index:1;';
      document.getElementById('main-slide')?.appendChild(wm);
    }
    wm.style.color   = t.watermarkColor || '#c9a84c22';
    wm.textContent   = t.watermark;
  } else {
    wm?.remove();
  }

  // Rebuild colour swatches with new default
  buildColorRow();
  const el = document.getElementById('s-text');
  if (el) applyStyleToEl(el);

  // Title colour via CSS var on title element
  const titleEl = document.getElementById('s-title');
  if (titleEl) titleEl.style.color = t.titleColor || 'var(--gold-dim)';

  // Footer colour
  const footerEl = document.getElementById('s-footer');
  if (footerEl) footerEl.style.color = t.footerColor || 'var(--text-3)';

  // Push to projection window
  push();

  showSchToast(`Template "${t.name}" applied`);
}

/* ── Open template editor ── */
function openTemplateEditor(customIdx) {
  _editingTemplateIdx = customIdx;
  const tmpl = customIdx >= 0 ? _customTemplates[customIdx] : null;
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
  const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };

  setVal('tmpl-edit-name',      tmpl?.name          || '');
  setVal('tmpl-bg-type',        tmpl?.bgType         || 'gradient');
  setVal('tmpl-bg-preset',      tmpl?.bgPreset        || 'cosmic');
  setVal('tmpl-bg-custom',      tmpl?.bg             || '');
  setVal('tmpl-bg-color',       tmpl?.bgColor         || '#08051a');
  setVal('tmpl-bg-url',         tmpl?.bgUrl           || '');
  setVal('tmpl-font',           tmpl?.font            || 'Playfair Display');
  setVal('tmpl-text-color',     tmpl?.textColor       || '#f6f2ec');
  setVal('tmpl-align',          tmpl?.align           || 'center');
  setVal('tmpl-shadow',         tmpl?.shadow          || 'soft');
  setVal('tmpl-line-spacing',   tmpl?.lineSpacing      || '1.65');
  setVal('tmpl-title-color',    tmpl?.titleColor       || '#c9a84c');
  setVal('tmpl-footer-color',   tmpl?.footerColor      || '#55535a');
  setVal('tmpl-watermark-text', tmpl?.watermark        || '');
  setVal('tmpl-watermark-color',tmpl?.watermarkColor   || '#c9a84c22');
  setChk('tmpl-deco-grid',      tmpl?.grid    ?? true);
  setChk('tmpl-deco-corners',   tmpl?.corners ?? true);
  setChk('tmpl-deco-footer',    tmpl?.footer  ?? true);
  setChk('tmpl-deco-vignette',  tmpl?.vignette ?? false);

  onTmplBgTypeChange();
  previewTemplate();

  // Switch to editor tab
  const editorTab = document.querySelectorAll('#templates-modal .db-tab')[2];
  if (editorTab) tmplTab(editorTab, 'tmpl-editor-panel');
}

function onTmplBgTypeChange() {
  const type = document.getElementById('tmpl-bg-type')?.value || 'gradient';
  const show = id => { const el = document.getElementById(id); if (el) el.style.display = 'block'; };
  const hide = id => { const el = document.getElementById(id); if (el) el.style.display = 'none';  };
  hide('tmpl-bg-gradient-row');
  hide('tmpl-bg-custom-row');
  hide('tmpl-bg-solid-row');
  hide('tmpl-bg-url-row');
  if      (type === 'gradient') show('tmpl-bg-gradient-row');
  else if (type === 'solid')    show('tmpl-bg-solid-row');
  else if (type === 'image')    show('tmpl-bg-url-row');
  else if (type === 'video')    show('tmpl-bg-url-row');
  onTmplBgPresetChange();
  previewTemplate();
}

function onTmplBgPresetChange() {
  const preset = document.getElementById('tmpl-bg-preset')?.value;
  if (preset === 'custom') {
    document.getElementById('tmpl-bg-custom-row').style.display = 'block';
  } else {
    document.getElementById('tmpl-bg-custom-row').style.display = 'none';
  }
  previewTemplate();
}

function getTmplBgValue() {
  const type   = document.getElementById('tmpl-bg-type')?.value || 'gradient';
  const preset = document.getElementById('tmpl-bg-preset')?.value;
  if (type === 'solid') return document.getElementById('tmpl-bg-color')?.value || '#000';
  if (type === 'image') {
    const url = document.getElementById('tmpl-bg-url')?.value || '';
    return url ? `url(${url}) center/cover no-repeat` : '#000';
  }
  if (type === 'gradient') {
    if (preset === 'custom') return document.getElementById('tmpl-bg-custom')?.value || '#000';
    const found = BACKGROUNDS.find(b => b.id === preset);
    return found ? found.bg : BACKGROUNDS[0].bg;
  }
  return '#000';
}

function previewTemplate() {
  const bg          = getTmplBgValue();
  const font        = document.getElementById('tmpl-font')?.value        || 'Playfair Display';
  const textColor   = document.getElementById('tmpl-text-color')?.value  || '#f6f2ec';
  const titleColor  = document.getElementById('tmpl-title-color')?.value || '#c9a84c';
  const footerColor = document.getElementById('tmpl-footer-color')?.value|| '#55535a';
  const align       = document.getElementById('tmpl-align')?.value       || 'center';
  const shadow      = document.getElementById('tmpl-shadow')?.value      || 'soft';
  const spacing     = document.getElementById('tmpl-line-spacing')?.value || '1.65';
  const showGrid    = document.getElementById('tmpl-deco-grid')?.checked;
  const showCorners = document.getElementById('tmpl-deco-corners')?.checked;
  const showFooter  = document.getElementById('tmpl-deco-footer')?.checked;
  const showVig     = document.getElementById('tmpl-deco-vignette')?.checked;
  const watermark   = document.getElementById('tmpl-watermark-text')?.value  || '';
  const wmColor     = document.getElementById('tmpl-watermark-color')?.value || '#c9a84c22';

  const shadows = {
    none:    'none',
    soft:    '0 2px 12px rgba(0,0,0,.9)',
    glow:    `0 0 20px ${titleColor}88, 0 2px 12px rgba(0,0,0,.8)`,
    hard:    '2px 2px 0 rgba(0,0,0,.9)',
    outline: '-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000',
  };

  // Apply to mini preview
  const setS = (id, prop, val) => { const el = document.getElementById(id); if (el) el.style[prop] = val; };
  setS('tmpl-mini-bg',     'background', bg);
  setS('tmpl-mini-grid',   'display', showGrid ? 'block' : 'none');
  setS('tmpl-mini-corners','display', showCorners ? 'block' : 'none');
  setS('tmpl-mini-footer', 'display', showFooter ? 'block' : 'none');
  setS('tmpl-mini-footer', 'color', footerColor);
  setS('tmpl-mini-vignette','display', showVig ? 'block' : 'none');

  const textEl = document.getElementById('tmpl-mini-text');
  if (textEl) {
    textEl.style.fontFamily  = `'${font}', serif`;
    textEl.style.color       = textColor;
    textEl.style.textAlign   = align;
    textEl.style.lineHeight  = spacing;
    textEl.style.textShadow  = shadows[shadow] || 'none';
  }
  const titleEl = document.getElementById('tmpl-mini-title');
  if (titleEl) {
    titleEl.style.color      = titleColor;
    titleEl.style.fontFamily = `'Cinzel', serif`;
  }

  const wmEl = document.getElementById('tmpl-mini-watermark');
  if (wmEl) {
    wmEl.textContent  = watermark;
    wmEl.style.color  = wmColor;
    wmEl.style.display= watermark ? 'flex' : 'none';
  }
}

/* ── Save custom template ── */
function buildTemplateFromEditor() {
  const name = document.getElementById('tmpl-edit-name')?.value.trim();
  if (!name) { alert('Give your template a name.'); return null; }
  const preset = document.getElementById('tmpl-bg-preset')?.value;
  const foundBg = BACKGROUNDS.find(b => b.id === preset);
  return {
    id:           'custom_' + Date.now(),
    name,
    tag:          'Custom',
    bgType:       document.getElementById('tmpl-bg-type')?.value || 'gradient',
    bgPreset:     preset,
    bgUrl:        document.getElementById('tmpl-bg-url')?.value || '',
    bgColor:      document.getElementById('tmpl-bg-color')?.value || '#000',
    bg:           getTmplBgValue(),
    font:         document.getElementById('tmpl-font')?.value || 'Playfair Display',
    textColor:    document.getElementById('tmpl-text-color')?.value || '#f6f2ec',
    titleColor:   document.getElementById('tmpl-title-color')?.value || '#c9a84c',
    footerColor:  document.getElementById('tmpl-footer-color')?.value || '#55535a',
    align:        document.getElementById('tmpl-align')?.value || 'center',
    shadow:       document.getElementById('tmpl-shadow')?.value || 'soft',
    lineSpacing:  document.getElementById('tmpl-line-spacing')?.value || '1.65',
    grid:         document.getElementById('tmpl-deco-grid')?.checked ?? true,
    corners:      document.getElementById('tmpl-deco-corners')?.checked ?? true,
    footer:       document.getElementById('tmpl-deco-footer')?.checked ?? true,
    vignette:     document.getElementById('tmpl-deco-vignette')?.checked ?? false,
    watermark:    document.getElementById('tmpl-watermark-text')?.value || '',
    watermarkColor: document.getElementById('tmpl-watermark-color')?.value || '#c9a84c22',
  };
}

function saveCustomTemplate() {
  const t = buildTemplateFromEditor();
  if (!t) return;
  if (_editingTemplateIdx >= 0) {
    t.id = _customTemplates[_editingTemplateIdx].id;
    _customTemplates[_editingTemplateIdx] = t;
  } else {
    _customTemplates.push(t);
  }
  persistCustomTemplates();
  renderCustomGrid();
  showSchToast(`Template "${t.name}" saved.`);
}

function saveAndApplyTemplate() {
  const t = buildTemplateFromEditor();
  if (!t) return;
  if (_editingTemplateIdx >= 0) {
    t.id = _customTemplates[_editingTemplateIdx].id;
    _customTemplates[_editingTemplateIdx] = t;
  } else {
    _customTemplates.push(t);
  }
  persistCustomTemplates();
  renderCustomGrid();
  applyTemplateObject(t);
  closeTemplates();
}

function deleteCustomTemplate(i) {
  if (!confirm('Delete this template?')) return;
  _customTemplates.splice(i, 1);
  persistCustomTemplates();
  renderCustomGrid();
}

function loadCustomTemplates() {
  try {
    const saved = JSON.parse(localStorage.getItem('bw_templates') || '[]');
    if (Array.isArray(saved)) _customTemplates = saved;
  } catch(e) {}
}

function persistCustomTemplates() {
  try { localStorage.setItem('bw_templates', JSON.stringify(_customTemplates)); } catch(e) {}
}

/* ─────────────────────────────────────────
   STARTUP — clock + template boot
───────────────────────────────────────── */
(function bootExtras() {
  function doBootExtras() {
    loadClockSettings();
    startClock();
    loadCustomTemplates();
    buildSchSongPicker && buildSchSongPicker();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doBootExtras);
  } else {
    doBootExtras();
  }
})();

/* ═══════════════════════════════════════════════════════════
   ACCORDION — right panel collapsible sections
═══════════════════════════════════════════════════════════ */

function toggleAccordion(headEl) {
  const body = headEl.nextElementSibling;
  if (!body) return;
  const isOpen = headEl.classList.toggle('open');
  body.style.display = isOpen ? 'block' : 'none';
  const icon = headEl.querySelector('.r-acc-icon');
  // icon rotation handled by CSS .r-acc-head.open .r-acc-icon
}

/* Open a specific accordion by its panel-tag text */
function openAccordionByLabel(labelText) {
  document.querySelectorAll('.r-acc-head').forEach(head => {
    const tag = head.querySelector('.panel-tag');
    if (tag && tag.textContent.includes(labelText)) {
      if (!head.classList.contains('open')) toggleAccordion(head);
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   OUTPUT PREVIEW — full style reflection
   Fixes: text style, theme, lower third all mirrored
═══════════════════════════════════════════════════════════ */

/* Override push() to also style the output preview properly */
const _origPush = typeof push === 'function' ? push : null;
push = function () {
  // Call original projection-window push
  if (_origPush) _origPush();
  // Now update our local output preview
  updateOutputPreview();
};

function updateOutputPreview() {
  if (!S.slides.length) return;
  const sl   = S.slides[S.cur];
  const song = S.songIdx !== null ? SONGS[S.songIdx]?.title || '' : '';
  const f    = S.format;

  /* ── Reference ── */
  const oRef = document.getElementById('o-ref');
  if (oRef) {
    oRef.textContent = song ? `${song} · ${sl.section || ''}` : (sl.section || '');
    oRef.style.color = 'var(--gold-dim)';
  }

  /* ── Text with full style matching the slide ── */
  const oTxt = document.getElementById('o-txt');
  if (oTxt) {
    oTxt.innerHTML = (sl.text || '').replace(/\n/g, '<br>');

    const shadows = {
      none:    'none',
      soft:    '0 1px 6px rgba(0,0,0,.9)',
      hard:    '1px 1px 0 rgba(0,0,0,.9)',
      glow:    `0 0 8px ${f.color}88, 0 1px 6px rgba(0,0,0,.8)`,
      outline: '-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000',
    };

    Object.assign(oTxt.style, {
      fontFamily:  `'${f.font || 'Playfair Display'}', serif`,
      textAlign:   f.align    || 'center',
      fontWeight:  f.bold     ? '700' : '400',
      fontStyle:   f.italic   ? 'italic' : 'normal',
      color:       f.color    || '#f6f2ec',
      lineHeight:  f.lineHeight || '1.65',
      fontSize:    '9px',
      textShadow:  shadows[f.shadow] || shadows.soft,
    });
  }

  /* ── Background ── */
  const outBg  = document.getElementById('out-bg');
  const curBg  = BACKGROUNDS.find(b => b.id === S.bgId) || BACKGROUNDS[0];
  if (outBg && !S.bgId?.startsWith('custom')) {
    outBg.style.background = curBg.bg;
  }

  /* ── Vignette ── */
  const outVig = document.getElementById('out-vignette');
  if (outVig) {
    const mainVig = document.getElementById('slide-vignette');
    outVig.style.display = mainVig ? 'block' : 'none';
  }

  /* ── Watermark ── */
  const outWm   = document.getElementById('out-watermark');
  const mainWm  = document.getElementById('slide-watermark');
  if (outWm && mainWm) {
    outWm.textContent  = mainWm.textContent;
    outWm.style.color  = mainWm.style.color;
    outWm.style.fontSize = '12px';
  }

  /* ── Counter sync (mini transport) ── */
  const omc = document.getElementById('omt-counter');
  if (omc) omc.textContent = `${S.cur + 1} / ${S.slides.length}`;

  /* ── Badge ── */
  const badge = document.getElementById('o-badge');
  if (badge) {
    badge.textContent = S.live ? 'LIVE' : (S.blanked ? 'BLANK' : 'HIDDEN');
    badge.classList.toggle('live', S.live);
  }

  /* ── Screen live glow ── */
  document.getElementById('out-screen')?.classList.toggle('live', S.live);
}

/* ─────────────────────────────────────────
   LOWER THIRD — fix output preview + strip
───────────────────────────────────────── */

/* Override sendLT and clearLT to update preview */
const _origSendLT  = typeof sendLT  === 'function' ? sendLT  : null;
const _origClearLT = typeof clearLT === 'function' ? clearLT : null;

sendLT = function () {
  const inp  = document.getElementById('lt-input');
  const sel  = document.getElementById('lt-style');
  if (!inp) return;
  const text  = inp.value.trim();
  const style = sel ? sel.value : 'default';
  S.lowerThird.text   = text;
  S.lowerThird.style  = style;
  S.lowerThird.active = !!text;
  updateLTOverlay(text, style);
  updateLTPreviewStrip(text, style);
  push();
  pushStage();
};

clearLT = function () {
  S.lowerThird.text   = '';
  S.lowerThird.active = false;
  const inp = document.getElementById('lt-input');
  if (inp) inp.value = '';
  updateLTOverlay('', 'default');
  updateLTPreviewStrip('', 'default');
  push();
  pushStage();
};

function updateLTPreviewStrip(text, style) {
  const strip = document.getElementById('lt-preview-strip');
  if (!strip) return;
  if (!text) {
    strip.style.display = 'none';
    return;
  }
  strip.style.display  = 'block';
  strip.className      = 'lt-preview-strip lt-' + style;
  strip.textContent    = text;
}

/* Make sure the out-lt element in the preview also shows */
function updateLTOverlay(text, style) {
  /* ── Main slide overlay ── */
  const ov    = document.getElementById('lt-overlay');
  const ovTxt = document.getElementById('lt-overlay-text');
  if (ov) {
    ov.className = 'lt-overlay';
    if (text) {
      ov.classList.add('visible', 'lt-' + style);
      if (ovTxt) ovTxt.textContent = text;
    } else {
      ov.classList.remove('visible');
    }
  }
  /* ── Output preview lower third ── */
  const outLt = document.getElementById('out-lt');
  if (outLt) {
    outLt.className = 'out-lt';
    if (text) {
      outLt.classList.add('visible', 'lt-' + style);
      outLt.textContent = text;
    } else {
      outLt.classList.remove('visible');
    }
  }
}

/* ─────────────────────────────────────────
   TEXT STYLE / THEME — mirror to preview
   Override applyStyleToEl to also trigger preview update
───────────────────────────────────────── */
const _origApplyStyleToEl = typeof applyStyleToEl === 'function' ? applyStyleToEl : null;
applyStyleToEl = function (el) {
  if (_origApplyStyleToEl) _origApplyStyleToEl(el);
  // After applying to main slide, also update the output preview
  requestAnimationFrame(updateOutputPreview);
};

/* Also patch applyTheme to refresh preview */
const _origApplyTheme = typeof applyTheme === 'function' ? applyTheme : null;
applyTheme = function (id) {
  if (_origApplyTheme) _origApplyTheme(id);
  setTimeout(updateOutputPreview, 50);
};

/* ─────────────────────────────────────────
   MINI TRANSPORT — keep in sync with
   blank / freeze / logo button states
───────────────────────────────────────── */

/* Patch toggleBlank to sync mini button */
const _origToggleBlank = typeof toggleBlank === 'function' ? toggleBlank : null;
toggleBlank = function () {
  if (_origToggleBlank) _origToggleBlank();
  document.getElementById('omt-blank')?.classList.toggle('on', S.blanked);
};

/* Patch toggleFreeze to sync mini button */
const _origToggleFreeze = typeof toggleFreeze === 'function' ? toggleFreeze : null;
toggleFreeze = function () {
  if (_origToggleFreeze) _origToggleFreeze();
  document.getElementById('omt-freeze')?.classList.toggle('on', S.frozen);
};

/* Patch toggleLogo to sync mini button */
const _origToggleLogo = typeof toggleLogo === 'function' ? toggleLogo : null;
toggleLogo = function () {
  if (_origToggleLogo) _origToggleLogo();
  document.getElementById('omt-logo')?.classList.toggle('on', S.logo);
};

/* Keep counter in sync when slides change without push */
const _origRenderSlide = typeof renderSlide === 'function' ? renderSlide : null;
renderSlide = function () {
  if (_origRenderSlide) _origRenderSlide();
  const omc = document.getElementById('omt-counter');
  if (omc && S.slides.length) {
    omc.textContent = `${S.cur + 1} / ${S.slides.length}`;
  }
};

/* ─────────────────────────────────────────
   INIT — open first accordion by default
   so right panel isn't completely collapsed
───────────────────────────────────────── */
(function initAccordions() {
  function doInit() {
    // Open Text Style by default
    const heads = document.querySelectorAll('.r-acc-head');
    if (heads.length) {
      // Open first two (Text Style + Theme Presets)
      [0, 1].forEach(i => {
        if (heads[i] && !heads[i].classList.contains('open')) {
          toggleAccordion(heads[i]);
        }
      });
    }
    // Run initial preview update
    updateOutputPreview();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doInit);
  } else {
    setTimeout(doInit, 150);
  }
})();

/* ─────────────────────────────────────────
   SCROLL SHADOW — show shadow on sticky
   preview when user has scrolled down
───────────────────────────────────────── */
(function initScrollShadow() {
  function doInit() {
    const inner = document.getElementById('right-inner-scroll');
    const wrap  = document.getElementById('out-wrap-sticky');
    if (!inner || !wrap) return;
    inner.addEventListener('scroll', () => {
      const scrolled = inner.scrollTop > 4;
      wrap.style.boxShadow = scrolled
        ? '0 6px 24px rgba(0,0,0,.55)'
        : '0 2px 8px rgba(0,0,0,.3)';
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doInit);
  } else {
    doInit();
  }
})();

/* ═══════════════════════════════════════════════════════════
   BIBLE — Verse range fix + Any-word search engine
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   VERSE RANGE — multi-verse toggle
───────────────────────────────────────── */

function onBibMultiToggle() {
  const chk    = document.getElementById('bib-multi-verse');
  const toSel  = document.getElementById('bib-vs-to');
  const toLbl  = document.getElementById('bib-to-lbl');
  const isMulti = chk?.checked;

  if (toSel) toSel.classList.toggle('active', isMulti);
  if (toLbl) toLbl.classList.toggle('active', isMulti);

  if (!isMulti) {
    // Reset "to" to same as "from"
    const fromSel = document.getElementById('bib-vs-from');
    if (toSel && fromSel) {
      toSel.innerHTML = `<option value="same">—</option>`;
    }
  } else {
    // Populate "to" with the full verse range from current chapter
    populateBibToSel();
  }
}

function onBibFromChange() {
  const isMulti = document.getElementById('bib-multi-verse')?.checked;
  if (isMulti) populateBibToSel();
}

function populateBibToSel() {
  const bookSel = document.getElementById('bib-book');
  const chSel   = document.getElementById('bib-ch');
  const fromSel = document.getElementById('bib-vs-from');
  const toSel   = document.getElementById('bib-vs-to');
  if (!bookSel || !chSel || !fromSel || !toSel) return;

  const idx    = parseInt(bookSel.value) || 0;
  const book   = KJV_BOOKS[idx];
  const ch     = parseInt(chSel.value)   || 1;
  const vsFrom = parseInt(fromSel.value) || 1;
  const counts = KJV_VERSES[book.name];
  const maxVs  = (counts && counts[ch - 1]) ? counts[ch - 1] : 30;

  toSel.innerHTML = '';
  for (let v = vsFrom; v <= maxVs; v++) {
    const opt = document.createElement('option');
    opt.value = String(v);
    opt.textContent = String(v);
    toSel.appendChild(opt);
  }
  // Default to last verse
  toSel.value = String(maxVs);
}

/* Override onBibChapterChange to reset multi-verse state */
function onBibChapterChange() {
  const chSel   = document.getElementById('bib-ch');
  const fromSel = document.getElementById('bib-vs-from');
  const toSel   = document.getElementById('bib-vs-to');
  if (!chSel || !fromSel || !toSel) return;

  const idx    = _bib.bookIdx;
  const book   = KJV_BOOKS[idx];
  const ch     = parseInt(chSel.value) || 1;
  _bib.chapter = ch;

  const counts = KJV_VERSES[book.name];
  const maxVs  = (counts && counts[ch - 1]) ? counts[ch - 1] : 30;

  // Always populate "from"
  fromSel.innerHTML = '';
  for (let v = 1; v <= maxVs; v++) {
    const opt = document.createElement('option');
    opt.value = String(v);
    opt.textContent = String(v);
    fromSel.appendChild(opt);
  }
  fromSel.value = '1';

  // Reset "to" — single verse by default
  toSel.innerHTML = `<option value="same">—</option>`;
  toSel.classList.remove('active');
  document.getElementById('bib-to-lbl')?.classList.remove('active');

  // Uncheck multi-verse
  const multiChk = document.getElementById('bib-multi-verse');
  if (multiChk) multiChk.checked = false;
}

/* ── Clean reference string — no duplication ── */
function buildBibRef(bookName, ch, vsFrom, vsTo) {
  const isMulti  = document.getElementById('bib-multi-verse')?.checked;
  const toVal    = document.getElementById('bib-vs-to')?.value;
  const isSame   = !isMulti || toVal === 'same' || vsFrom === vsTo;

  if (isSame) {
    return `${bookName} ${ch}:${vsFrom}`;
  }
  return `${bookName} ${ch}:${vsFrom}–${vsTo}`;
}


function cleanBibRef(ref) {
  if (!ref) return '';
  // Match: BookName Chapter:Verse optionally followed by extra :Verse or -Verse
  // Pattern: any text + space + digits + colon + digits + (optional :digits or -digits)
  const m = ref.match(/^(.+?\s+\d+):(\d+)(?::(\d+))?(?:[–\-](\d+))?$/);
  if (!m) return ref;

  const bookAndChapter = m[1]; // e.g. "John 3"
  const vsFrom         = parseInt(m[2]);
  // m[3] is a spurious extra :N — use it as vsTo only if bigger than vsFrom
  // m[4] is a proper dash range
  let vsTo = m[4] ? parseInt(m[4])
           : m[3] ? parseInt(m[3])
           : vsFrom;

  // If vsTo equals vsFrom — single verse
  if (vsTo === vsFrom) return `${bookAndChapter}:${vsFrom}`;

  // If vsTo is somehow less than vsFrom — single verse
  if (vsTo < vsFrom) return `${bookAndChapter}:${vsFrom}`;

  return `${bookAndChapter}:${vsFrom}-${vsTo}`;
}
/* Override fetchBiblePassage with the clean ref */
fetchBiblePassage = async function () {
  const bookSel  = document.getElementById('bib-book');
  const chSel    = document.getElementById('bib-ch');
  const fromSel  = document.getElementById('bib-vs-from');
  const toSel    = document.getElementById('bib-vs-to');
  if (!bookSel) return;

  const idx     = parseInt(bookSel.value) || 0;
  const book    = KJV_BOOKS[idx];
  const ch      = parseInt(chSel?.value)   || 1;
  const vsFrom  = parseInt(fromSel?.value) || 1;
  const isMulti = document.getElementById('bib-multi-verse')?.checked;
  const toVal   = toSel?.value;
  const vsTo    = (isMulti && toVal && toVal !== 'same')
    ? parseInt(toVal)
    : vsFrom;   // single verse

  const ref = buildBibRef(book.name, ch, vsFrom, vsTo);

  showBibPassagePanel(ref, null);
  const verses = await loadBibVerses(book, ch, vsFrom, vsTo);
  // De-duplicate if same verse returned twice
  const unique = dedupeVerses(verses);
  showBibPassagePanel(ref, unique);
};

/* Remove duplicate verse numbers that sometimes come from the API */
function dedupeVerses(verses) {
  const seen = new Set();
  return verses.filter(v => {
    if (seen.has(v.num)) return false;
    seen.add(v.num);
    return true;
  });
}

/* ─────────────────────────────────────────
   ANY-WORD BIBLE SEARCH ENGINE
   Searches the full offline SCRIPTURE_DB first,
   then fetches from bible-api.com for broader coverage.
───────────────────────────────────────── */

async function bibleWordSearch(query) {
  const q = (query || '').trim();
  if (!q) return;

  // Show results panel with loading state
  const resultsPanel = document.getElementById('bib-search-results');
  const bsrList      = document.getElementById('bsr-list');
  const bsrTitle     = document.getElementById('bsr-title');
  if (!resultsPanel || !bsrList) return;

  resultsPanel.style.display = 'flex';
  bsrList.innerHTML = `<div class="bsr-loading"><div class="bib-spinner"></div>Searching the Bible…</div>`;
  if (bsrTitle) bsrTitle.textContent = `Searching for "${q}"…`;

  // ── Step 1: Search local SCRIPTURE_DB ──
  const localResults = searchLocalDB(q);

  // ── Step 2: Search full Bible via API (key chapters from every book) ──
  const apiResults = await searchBibleAPI(q);

  // Merge — local first, then API, deduplicate by ref
  const allResults  = mergeSearchResults(localResults, apiResults);
  renderBibSearchResults(q, allResults);
}

/* Search the local SCRIPTURE_DB for any matching words */
function searchLocalDB(query) {
  const words   = tokeniseQuery(query);
  const results = [];

  Object.entries(SCRIPTURE_DB).forEach(([ref, text]) => {
    const lowerText = text.toLowerCase();
    const score     = scoreMatch(words, lowerText);
    if (score > 0) {
      results.push({ ref: formatRef(ref), text, score });
    }
  });

  return results.sort((a, b) => b.score - a.score);
}

/* Fetch matching verses from bible-api.com search endpoint */
async function searchBibleAPI(query) {
  const results = [];
  const version = document.getElementById('bible-version-sel')?.value || 'kjv';

  // bible-api.com supports search via /search?q=...
  const encoded = encodeURIComponent(query);
  const url     = `https://bible-api.com/search?q=${encoded}&translation=${version}`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('API ' + resp.status);
    const data = await resp.json();

    // bible-api.com returns { results: [{reference, text}] }
    const hits = data.results || data.verses || [];
    hits.forEach(hit => {
      const ref  = hit.reference || hit.book_name + ' ' + hit.chapter + ':' + hit.verse;
      const text = (hit.text || '').trim().replace(/\n/g, ' ');
      if (ref && text) results.push({ ref, text, score: 50 });
    });
  } catch(e) {
    // API unavailable — that's fine, local results still show
  }

  return results;
}

/* Tokenise query into individual meaningful words */
function tokeniseQuery(q) {
  return q.toLowerCase()
    .replace(/["""''',.:;?!()]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

/* Score how well a text matches the query words */
function scoreMatch(words, lowerText) {
  if (!words.length) return 0;
  let score = 0;
  let allFound = true;
  words.forEach(w => {
    if (lowerText.includes(w)) {
      score++;
    } else {
      allFound = false;
    }
  });
  // Bonus if all words found
  if (allFound) score += words.length;
  return score;
}

/* Common English stop words to ignore in search */
const STOP_WORDS = new Set([
  'a','an','and','are','as','at','be','been','but','by','do','for',
  'from','had','has','have','he','her','him','his','how','i','if',
  'in','is','it','its','me','my','not','of','on','or','our','out',
  'shall','she','so','than','that','the','their','them','then','there',
  'these','they','this','to','unto','up','us','was','we','were','what',
  'when','which','who','will','with','would','ye','you','your','thy',
  'thee','thou','hath','doth','said','saith','unto',
]);

/* Merge local + API results, remove duplicates by ref */
function mergeSearchResults(local, api) {
  const seen = new Set();
  const out  = [];
  [...local, ...api].forEach(r => {
    const key = r.ref.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(r);
    }
  });
  return out.sort((a, b) => (b.score || 0) - (a.score || 0));
}

/* Format a SCRIPTURE_DB key into a readable reference */
function formatRef(key) {
  return key.replace(/\b\w/g, c => c.toUpperCase());
}

/* Highlight matching words inside result text */
function highlightWords(text, words) {
  if (!words.length) return escapeHTML(text);
  let result = escapeHTML(text);
  words.forEach(w => {
    const rx = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    result = result.replace(rx, '<mark>$1</mark>');
  });
  return result;
}

/* Render results list */
function renderBibSearchResults(query, results) {
  const bsrList  = document.getElementById('bsr-list');
  const bsrTitle = document.getElementById('bsr-title');
  if (!bsrList) return;

  const words = tokeniseQuery(query);
  if (bsrTitle) bsrTitle.textContent = results.length
    ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
    : `No results for "${query}"`;

  if (!results.length) {
    bsrList.innerHTML = `<div class="bsr-empty">
      No verses found containing <strong>"${escapeHTML(query)}"</strong>.<br>
      <span style="font-size:10px;color:var(--text-3);">Try fewer words or check spelling.</span>
    </div>`;
    return;
  }

  bsrList.innerHTML = results.map((r, i) => `
    <div class="bsr-item" onclick="selectBibSearchResult(${i})">
      <div class="bsr-ref">${escapeHTML(r.ref)}</div>
      <div class="bsr-text">${highlightWords(r.text.substring(0, 160) + (r.text.length > 160 ? '…' : ''), words)}</div>
    </div>`).join('');

  // Store results for selection
  window._bibSearchResults = results;
}

/* User clicks a result — load it as a passage */
function selectBibSearchResult(i) {
  const results = window._bibSearchResults || [];
  const result  = results[i];
  if (!result) return;

  const verses = [{ num: 1, text: result.text }];
  _bib.lastPassage = { ref: result.ref, verses };
  showBibPassagePanel(result.ref, verses);
  closeBibSearchResults();

  // Try to navigate the dropdowns to this reference
  navigateBibDropdownsToRef(result.ref);
}

/* Try to set the book/chapter/verse dropdowns to match a ref string */
function navigateBibDropdownsToRef(ref) {
  // Parse "Book Chapter:Verse" or "Book Chapter:Verse-Verse"
  const m = ref.match(/^(.+?)\s+(\d+):(\d+)(?:[–-](\d+))?$/i);
  if (!m) return;

  const bookName = m[1].trim();
  const ch       = parseInt(m[2]);
  const vsFrom   = parseInt(m[3]);
  const vsTo     = m[4] ? parseInt(m[4]) : vsFrom;

  const bookIdx = KJV_BOOKS.findIndex(b =>
    b.name.toLowerCase() === bookName.toLowerCase() ||
    b.name.toLowerCase().startsWith(bookName.toLowerCase())
  );
  if (bookIdx < 0) return;

  _bib.bookIdx = bookIdx;
  const bookSel = document.getElementById('bib-book');
  if (bookSel) { bookSel.value = String(bookIdx); onBibBookChange(); }

  setTimeout(() => {
    const chSel = document.getElementById('bib-ch');
    if (chSel) { chSel.value = String(ch); onBibChapterChange(); }

    setTimeout(() => {
      const fromSel = document.getElementById('bib-vs-from');
      if (fromSel) { fromSel.value = String(vsFrom); }

      if (vsTo > vsFrom) {
        const multiChk = document.getElementById('bib-multi-verse');
        if (multiChk) { multiChk.checked = true; onBibMultiToggle(); }
        const toSel = document.getElementById('bib-vs-to');
        if (toSel) toSel.value = String(vsTo);
      }
    }, 60);
  }, 60);
}

function closeBibSearchResults() {
  const panel = document.getElementById('bib-search-results');
  if (panel) panel.style.display = 'none';
  window._bibSearchResults = [];
}


/* ═══════════════════════════════════════════════════════════
   1. RESPONSIVE DRAWERS
═══════════════════════════════════════════════════════════ */

function toggleDrawer(side) {
  const el       = document.querySelector('.' + side);
  const backdrop = document.getElementById('drawer-backdrop');
  if (!el) return;
  const isOpen = el.classList.toggle('drawer-open');
  // Close the other side if opening this one
  if (isOpen) {
    const other = side === 'library' ? 'right' : 'library';
    document.querySelector('.' + other)?.classList.remove('drawer-open');
    if (backdrop) backdrop.classList.add('visible');
  } else {
    if (backdrop) backdrop.classList.remove('visible');
  }
}

function closeAllDrawers() {
  document.querySelector('.library')?.classList.remove('drawer-open');
  document.querySelector('.right')?.classList.remove('drawer-open');
  document.getElementById('drawer-backdrop')?.classList.remove('visible');
}

/* Close drawers when user navigates to a new tab or section */
document.addEventListener('click', e => {
  const isLibItem   = e.target.closest('.lib-item, .ltab, .bib-book-btn');
  const isCenterTab = e.target.closest('.ctab');
  if (isLibItem || isCenterTab) {
    setTimeout(closeAllDrawers, 120);
  }
});

/* Swipe to close drawers on touch */
(function initSwipeClose() {
  let startX = 0;
  document.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend',   e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -60) {
      // Swipe left — close library drawer
      document.querySelector('.library')?.classList.remove('drawer-open');
    }
    if (diff > 60) {
      // Swipe right — close right drawer
      document.querySelector('.right')?.classList.remove('drawer-open');
    }
    const lib   = document.querySelector('.library.drawer-open');
    const right = document.querySelector('.right.drawer-open');
    if (!lib && !right) document.getElementById('drawer-backdrop')?.classList.remove('visible');
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   2. HDMI / MULTI-MONITOR PROJECTION
   Uses Window Management API (getScreenDetails) where available,
   falls back to window.open on the best available screen.
═══════════════════════════════════════════════════════════ */

let _screenDetails    = null;   // ScreenDetails object if API available
let _projScreen       = null;   // Target Screen object for projection
let _autoProjectionOn = false;

/* Called when user opens the app or connects a new display */
async function detectAndAutoProject() {
  // ── Try Window Management API (Chrome 100+) ──
  if ('getScreenDetails' in window) {
    try {
      _screenDetails = await window.getScreenDetails();

      // Listen for screen changes (HDMI plug/unplug)
      _screenDetails.addEventListener('screenschange', onScreensChanged);

      const screens = _screenDetails.screens;
      if (screens.length > 1) {
        // Find the non-primary screen — that is the HDMI/extended display
        _projScreen = screens.find(s => !s.isPrimary) || screens[screens.length - 1];
        showSchToast(`📺 External display detected: ${_projScreen.label || 'Screen ' + (_screenDetails.screens.indexOf(_projScreen) + 1)}`);
        autoOpenOnExternalScreen();
      }
    } catch(e) {
      // Permission denied or not supported — fall back silently
      console.info('[BW] Window Management API not available:', e.message);
    }
  }
}

async function autoOpenOnExternalScreen() {
  if (!_projScreen) return;
  // If projection window is already open on the right screen, do nothing
  if (S.projWin && !S.projWin.closed) return;

  const left   = _projScreen.availLeft   ?? _projScreen.left   ?? 0;
  const top    = _projScreen.availTop    ?? _projScreen.top    ?? 0;
  const width  = _projScreen.availWidth  ?? _projScreen.width  ?? 1920;
  const height = _projScreen.availHeight ?? _projScreen.height ?? 1080;

  S.projWin = window.open(
    '',
    'BW_Projection',
    `left=${left},top=${top},width=${width},height=${height},` +
    `menubar=no,toolbar=no,location=no,status=no,resizable=yes`
  );

  if (!S.projWin) {
    showSchToast('⚠ Popup blocked — allow popups then click Second Screen');
    return;
  }

  S.projWin.document.open();
  S.projWin.document.write(projWindowHTML());
  S.projWin.document.close();

  // Attempt to go fullscreen on the external display
  setTimeout(() => {
    try {
      S.projWin.moveTo(left, top);
      S.projWin.resizeTo(width, height);
      // Request fullscreen inside the projection window
      S.projWin.document.documentElement.requestFullscreen?.();
    } catch(e) { /* best effort */ }
  }, 600);

  document.getElementById('proj-btn')?.classList.add('on');
  push();

  showSchToast(`📺 Projecting on external display (${width}×${height})`);
  _autoProjectionOn = true;
}

function onScreensChanged() {
  if (!_screenDetails) return;
  const screens = _screenDetails.screens;
  const external = screens.find(s => !s.isPrimary);

  if (external && (!S.projWin || S.projWin.closed)) {
    _projScreen = external;
    showSchToast('📺 Display connected — opening projection window…');
    setTimeout(autoOpenOnExternalScreen, 800);
  } else if (!external && S.projWin && !S.projWin.closed) {
    showSchToast('📺 External display disconnected');
  }
}

/* Extend openProjection to use the correct screen position */
const _origOpenProjection = typeof openProjection === 'function' ? openProjection : null;
openProjection = async function () {
  if (S.projWin && !S.projWin.closed) { S.projWin.focus(); return; }

  // Try Window Management API first
  if ('getScreenDetails' in window && !_screenDetails) {
    try {
      _screenDetails = await window.getScreenDetails();
      _screenDetails.addEventListener('screenschange', onScreensChanged);
    } catch(e) { /* permission denied */ }
  }

  // Find external screen
  if (_screenDetails?.screens?.length > 1) {
    _projScreen = _screenDetails.screens.find(s => !s.isPrimary)
               || _screenDetails.screens[_screenDetails.screens.length - 1];
    await autoOpenOnExternalScreen();
    return;
  }

  // Fallback: open without position hints (works with single screen or no API)
  if (_origOpenProjection) { _origOpenProjection(); return; }

  S.projWin = window.open(
    '',
    'BW_Projection',
    'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
  );
  if (!S.projWin) { alert('Popup blocked — allow popups for this site.'); return; }
  S.projWin.document.open();
  S.projWin.document.write(projWindowHTML());
  S.projWin.document.close();
  document.getElementById('proj-btn')?.classList.add('on');
  push();
};

/* Keep projection window fullscreen if user accidentally exits fullscreen */
function maintainProjFullscreen() {
  if (!S.projWin || S.projWin.closed) return;
  try {
    const doc = S.projWin.document;
    if (doc && !S.projWin.document.fullscreenElement) {
      doc.documentElement.requestFullscreen?.();
    }
  } catch(e) { /* ignore */ }
}
setInterval(maintainProjFullscreen, 4000);

/* Wake Lock — prevent screen from sleeping during live output */
let _wakeLock = null;
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      _wakeLock = await navigator.wakeLock.request('screen');
      _wakeLock.addEventListener('release', () => { _wakeLock = null; });
    }
  } catch(e) { /* not critical */ }
}
async function releaseWakeLock() {
  try { await _wakeLock?.release(); } catch(e) { /* ignore */ }
}

/* Hook into toggleLive to manage wake lock and auto-detect screens */
const _origToggleLiveForScreen = typeof toggleLive === 'function' ? toggleLive : null;
toggleLive = function () {
  if (_origToggleLiveForScreen) _origToggleLiveForScreen();
  if (S.live) {
    requestWakeLock();
    detectAndAutoProject();
  } else {
    releaseWakeLock();
  }
};

/* Try to detect screens on page load (user may have already connected HDMI) */
(function initScreenDetect() {
  function doDetect() {
    // Only auto-detect if the user has already granted permission before
    if (localStorage.getItem('bw_screen_permission') === 'granted') {
      detectAndAutoProject();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doDetect);
  } else {
    setTimeout(doDetect, 500);
  }
})();

/* Store permission grant so we can auto-detect on next load */
if ('getScreenDetails' in window) {
  navigator.permissions?.query({ name:'window-management' })
    .then(status => {
      if (status.state === 'granted') {
        localStorage.setItem('bw_screen_permission', 'granted');
      }
      status.addEventListener('change', () => {
        if (status.state === 'granted') {
          localStorage.setItem('bw_screen_permission', 'granted');
          detectAndAutoProject();
        }
      });
    }).catch(() => {});
}

/* ═══════════════════════════════════════════════════════════
   3. BIBLE SHORT-FORM / ABBREVIATION RESOLVER
═══════════════════════════════════════════════════════════ */

const BIBLE_ABBREV = {
  /* Old Testament */
  'gen':   'Genesis',        'ge':    'Genesis',
  'ex':    'Exodus',         'exo':   'Exodus',        'exod': 'Exodus',
  'lev':   'Leviticus',      'le':    'Leviticus',     'lv':   'Leviticus',
  'num':   'Numbers',        'nu':    'Numbers',        'nm':   'Numbers',
  'deut':  'Deuteronomy',    'deu':   'Deuteronomy',   'dt':   'Deuteronomy',
  'josh':  'Joshua',         'jos':   'Joshua',
  'judg':  'Judges',         'jdg':   'Judges',        'jg':   'Judges',
  'rut':   'Ruth',           'ru':    'Ruth',
  '1sam':  '1 Samuel',       '1sa':   '1 Samuel',      '1s':   '1 Samuel',
  '2sam':  '2 Samuel',       '2sa':   '2 Samuel',      '2s':   '2 Samuel',
  '1ki':   '1 Kings',        '1kgs':  '1 Kings',
  '2ki':   '2 Kings',        '2kgs':  '2 Kings',
  '1chr':  '1 Chronicles',   '1ch':   '1 Chronicles',  '1chron':'1 Chronicles',
  '2chr':  '2 Chronicles',   '2ch':   '2 Chronicles',  '2chron':'2 Chronicles',
  'ezr':   'Ezra',           'ez':    'Ezra',
  'neh':   'Nehemiah',       'ne':    'Nehemiah',
  'est':   'Esther',         'esth':  'Esther',
  'job':   'Job',            'jb':    'Job',
  'ps':    'Psalms',         'psa':   'Psalms',        'psalm': 'Psalms',
  'prov':  'Proverbs',       'pro':   'Proverbs',      'pr':   'Proverbs',
  'eccl':  'Ecclesiastes',   'ecc':   'Ecclesiastes',  'ec':   'Ecclesiastes',
  'song':  'Song of Solomon','sos':   'Song of Solomon','ss':  'Song of Solomon',
  'isa':   'Isaiah',         'is':    'Isaiah',
  'jer':   'Jeremiah',       'je':    'Jeremiah',
  'lam':   'Lamentations',   'la':    'Lamentations',
  'ezek':  'Ezekiel',        'eze':   'Ezekiel',
  'dan':   'Daniel',         'da':    'Daniel',        'dn':   'Daniel',
  'hos':   'Hosea',          'ho':    'Hosea',
  'joel':  'Joel',           'jl':    'Joel',
  'amos':  'Amos',           'am':    'Amos',
  'obad':  'Obadiah',        'ob':    'Obadiah',
  'jon':   'Jonah',          'jnh':   'Jonah',
  'mic':   'Micah',          'mi':    'Micah',
  'nah':   'Nahum',          'na':    'Nahum',
  'hab':   'Habakkuk',       'hb':    'Habakkuk',
  'zeph':  'Zephaniah',      'zep':   'Zephaniah',     'zp':   'Zephaniah',
  'hag':   'Haggai',         'hg':    'Haggai',
  'zech':  'Zechariah',      'zec':   'Zechariah',     'zc':   'Zechariah',
  'mal':   'Malachi',        'ml':    'Malachi',
  /* New Testament */
  'matt':  'Matthew',        'mat':   'Matthew',       'mt':   'Matthew',
  'mk':    'Mark',           'mar':   'Mark',
  'luk':   'Luke',           'lk':    'Luke',
  'jn':    'John',           'joh':   'John',
  'act':   'Acts',           'ac':    'Acts',
  'rom':   'Romans',         'ro':    'Romans',        'rm':   'Romans',
  '1cor':  '1 Corinthians',  '1co':   '1 Corinthians',
  '2cor':  '2 Corinthians',  '2co':   '2 Corinthians',
  'gal':   'Galatians',      'ga':    'Galatians',
  'eph':   'Ephesians',
  'phil':  'Philippians',    'php':   'Philippians',   'pp':   'Philippians',
  'col':   'Colossians',
  '1thes': '1 Thessalonians','1th':   '1 Thessalonians','1ths':'1 Thessalonians',
  '2thes': '2 Thessalonians','2th':   '2 Thessalonians','2ths':'2 Thessalonians',
  '1tim':  '1 Timothy',      '1ti':   '1 Timothy',     '1tm':  '1 Timothy',
  '2tim':  '2 Timothy',      '2ti':   '2 Timothy',     '2tm':  '2 Timothy',
  'tit':   'Titus',          'ti':    'Titus',
  'phlm':  'Philemon',       'phm':   'Philemon',
  'heb':   'Hebrews',        'he':    'Hebrews',
  'jas':   'James',          'jm':    'James',
  '1pet':  '1 Peter',        '1pe':   '1 Peter',       '1pt':  '1 Peter',
  '2pet':  '2 Peter',        '2pe':   '2 Peter',       '2pt':  '2 Peter',
  '1jn':   '1 John',         '1jo':   '1 John',
  '2jn':   '2 John',         '2jo':   '2 John',
  '3jn':   '3 John',         '3jo':   '3 John',
  'jude':  'Jude',           'jud':   'Jude',
  'rev':   'Revelation',     're':    'Revelation',    'apoc': 'Revelation',
};

/* Expand a raw reference string into its full canonical form.
   Examples:
     "Gen 1:1"       → "Genesis 1:1"
     "Ex 14:15"      → "Exodus 14:15"
     "1cor 13:4-7"   → "1 Corinthians 13:4-7"
     "ps 23"         → "Psalms 23"
     "Rev 21:4"      → "Revelation 21:4"
*/
function expandBibRef(raw) {
  if (!raw) return raw;
  const trimmed = raw.trim();

  // Split into (optional leading digit)(word part)(rest: space + chapter:verse)
  // Pattern handles: "Gen 1:1", "1cor 13:4", "1 cor 13:4", "Ps23:1" etc.
  const m = trimmed.match(
    /^(\d\s*)?([a-zA-Z]+)[\s.]*([\d:.\-–]+)?$/
  );
  if (!m) return trimmed;

  const prefix   = (m[1] || '').replace(/\s/g, ''); // "1", "2", "3" or ""
  const abbrev   = m[2].toLowerCase();               // "gen", "cor", etc.
  const chapVerse= (m[3] || '').trim();              // "1:1", "13:4-7", etc.

  // Build the lookup key: prefix + abbrev, e.g. "1cor", "2pet", "gen"
  const key = prefix + abbrev;
  const fullName = BIBLE_ABBREV[key]
               || BIBLE_ABBREV[abbrev]
               // Partial match: find first key that starts with our abbrev
               || (() => {
                    const found = Object.keys(BIBLE_ABBREV).find(k => k.startsWith(key) || k.startsWith(abbrev));
                    return found ? BIBLE_ABBREV[found] : null;
                  })();

  if (!fullName) return trimmed; // Unknown — return as-is

  return chapVerse ? `${fullName} ${chapVerse}` : fullName;
}

/* Patch quickScriptureLookup to expand abbreviations */
const _origQuickScriptureLookup = typeof quickScriptureLookup === 'function'
  ? quickScriptureLookup : null;

quickScriptureLookup = async function () {
  const inp = document.getElementById('sc-ref');
  if (!inp) return;

  const raw      = inp.value.trim();
  const expanded = expandBibRef(raw);

  // If we expanded something, show the user what we resolved
  if (expanded !== raw && expanded) {
    inp.value = expanded; // show expanded form in the input box
    showSchToast(`Resolved: ${raw} → ${expanded}`);
  }

  // Check offline DB with the expanded ref
  const key = expanded.toLowerCase();
  if (SCRIPTURE_DB[key]) {
    queueScripture(expanded, SCRIPTURE_DB[key]);
    inp.value = '';
    return;
  }

  // Try bibleSearch with expanded ref
  await bibleSearch(expanded);
  if (_bib.lastPassage) {
    projectBiblePassage();
    inp.value = '';
  }
};

/* Patch bibleWordSearch to also try abbreviation expansion first */
const _origBibleWordSearch = typeof bibleWordSearch === 'function'
  ? bibleWordSearch : null;

bibleWordSearch = async function (query) {
  if (!query) return;
  const expanded = expandBibRef(query.trim());

  // If it expanded to something different and looks like a reference, use bibleSearch
  if (expanded !== query && /\d/.test(expanded)) {
    showSchToast(`Resolved: ${query} → ${expanded}`);
    await bibleSearch(expanded);
    return;
  }

  // Otherwise run the word search
  if (_origBibleWordSearch) await _origBibleWordSearch(query);
};

/* Also patch the SO scripture lookup inside the drawer */
const _origLookupSOScripture = typeof lookupSOScripture === 'function'
  ? lookupSOScripture : null;

lookupSOScripture = function () {
  const refEl = document.getElementById('so-sc-ref');
  if (refEl && refEl.value) {
    const expanded = expandBibRef(refEl.value.trim());
    if (expanded !== refEl.value.trim()) {
      refEl.value = expanded;
      showSchToast(`Resolved: ${refEl.value} → ${expanded}`);
    }
  }
  if (_origLookupSOScripture) _origLookupSOScripture();
};


/* ══════════════════════════════════════
DOMContentLoaded
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
init();
// Set correct default tab views
document.getElementById('slides-view').style.display  = 'flex';
document.getElementById('service-view').style.display = 'none';
document.getElementById('timer-view').style.display   = 'none';
// Load saved service order
try {
const savedSO = JSON.parse(localStorage.getItem('bw_so') || '[]');
if (savedSO.length) { S.so = savedSO; renderSO(); }
} catch(e) {}
});
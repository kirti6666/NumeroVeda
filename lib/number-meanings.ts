export type NumberMeaning={
  title:string;
  lifePath:string;
  destiny:string;
  soulUrge:string;
  personality:string;
  strengths:string[];
  challenges:string[];
};

export const numberMeanings:Record<number,NumberMeaning>={
  1:{title:'The Leader',lifePath:'Independent and driven, here to lead and start new things.',destiny:'Built to lead and to create on your own terms.',soulUrge:'Wants independence and the freedom to be first.',personality:'Comes across as confident and self-assured.',strengths:['Self-motivated','Decisive','Original thinker'],challenges:['Can be stubborn','Impatient with slower people','Finds it hard to ask for help']},
  2:{title:'The Peacemaker',lifePath:'Sensitive and cooperative, happiest working in partnership.',destiny:'Gift for bringing people together and building partnerships.',soulUrge:'Wants love, harmony and close companionship.',personality:'Comes across as gentle, kind and approachable.',strengths:['Diplomatic','Good listener','Works well with others'],challenges:['Takes criticism to heart','Avoids needed conflict','Can be indecisive']},
  3:{title:'The Communicator',lifePath:'Creative and expressive, inspiring people with words and ideas.',destiny:'Talent for words, art and lifting other people’s spirits.',soulUrge:'Wants to express yourself and be appreciated.',personality:'Comes across as charming, lively and fun.',strengths:['Creative','Expressive','Optimistic'],challenges:['Scatters energy across too many things','Loses focus without deadlines','Moody when unappreciated']},
  4:{title:'The Builder',lifePath:'Practical and disciplined, building a secure life step by step.',destiny:'Builds lasting results through method and hard work.',soulUrge:'Wants security, order and a solid foundation.',personality:'Logical & analytical — organised and reliable.',strengths:['Analytical mind','Hardworking','Dependable'],challenges:['Resists sudden change','Can overwork','Slow to trust new people']},
  5:{title:'The Freedom Seeker',lifePath:'Curious and adaptable, learning through change and experience.',destiny:'Thrives on change, travel and communication.',soulUrge:'Wants freedom, variety and new experiences.',personality:'Comes across as energetic, witty and adventurous.',strengths:['Adaptable','Curious','Persuasive'],challenges:['Restless','Can make impulsive decisions','Struggles with routine']},
  6:{title:'The Nurturer',lifePath:'Compassionate — family and community driven.',destiny:'Called to care for, teach and take responsibility for others.',soulUrge:'Wants a loving home and to be needed.',personality:'Comes across as warm, responsible and trustworthy.',strengths:['Caring','Responsible','Creates harmony at home'],challenges:['Takes on too much for others','Can be controlling','Perfectionist']},
  7:{title:'The Seeker',lifePath:'Thoughtful and introspective, searching for deeper truth.',destiny:'Drawn to knowledge, research and inner understanding.',soulUrge:'Wants truth, peace and time alone to reflect.',personality:'Comes across as reserved, thoughtful and wise.',strengths:['Deep thinker','Intuitive','Research-minded'],challenges:['Keeps feelings to yourself','Overthinks','Can seem distant']},
  8:{title:'The Achiever',lifePath:'Ambitious and capable, learning to use power and money well.',destiny:'Empire builder — authority, wealth and influence.',soulUrge:'Wants success, recognition and control of your path.',personality:'Comes across as capable, strong and successful.',strengths:['Ambitious','Natural authority','Good with money and management'],challenges:['Workaholic tendencies','Can be domineering','Measures life by material success']},
  9:{title:'The Humanitarian',lifePath:'Generous and idealistic, here to serve a larger cause.',destiny:'Here to serve others with compassion and wisdom.',soulUrge:'Wants to make a real difference in the world.',personality:'Comes across as generous, graceful and worldly.',strengths:['Compassionate','Generous','Broad-minded'],challenges:['Gives too much of yourself','Holds on to the past','Can be impractical']},
  11:{title:'The Intuitive',lifePath:'Inspired and sensitive, with a strong inner voice. A master number.',destiny:'Inspires others through insight and intuition.',soulUrge:'Wants spiritual meaning and to inspire.',personality:'Comes across as inspiring and a little otherworldly.',strengths:['Strong intuition','Inspiring','Visionary'],challenges:['Nervous tension','Self-doubt','Very sensitive to your surroundings']},
  22:{title:'The Master Builder',lifePath:'Turns big visions into lasting results. A master number.',destiny:'Turns large visions into real, lasting structures.',soulUrge:'Craves to build something legacy-defining.',personality:'Comes across as capable of carrying big responsibilities.',strengths:['Visionary and practical','Big-picture planner','Leads large projects'],challenges:['Heavy pressure on yourself','Can be overbearing','Fear of not reaching your potential']},
  33:{title:'The Master Teacher',lifePath:'Here to guide, heal and uplift others. A master number.',destiny:'Uplifts others through care and teaching.',soulUrge:'Wants to heal and uplift others.',personality:'Comes across as nurturing and wise beyond your years.',strengths:['Selfless','Healing presence','Inspiring teacher'],challenges:['Neglects your own needs','Carries others’ burdens','Very high expectations of yourself']},
};

export const subconsciousMeanings:Record<number,string>={
  1:'Relies heavily on others when things go wrong.',
  2:'Relies heavily on others when things go wrong.',
  3:'Can feel scattered under pressure — support helps.',
  4:'Needs a clear plan and routine to stay calm.',
  5:'Can feel restless under pressure — prefers to keep options open.',
  6:'Nurturing — balance service with self-care.',
  7:'Takes time to reflect before acting in a crisis.',
  8:'Calm and capable when under pressure.',
  9:'Very steady in a crisis, with many inner resources.',
};

export type RulingDetails={planet:string;day:string;colours:string;numbers:string};
export const rulingByBirthNumber:Record<number,RulingDetails>={
  1:{planet:'Sun (Surya)',day:'Sunday',colours:'Gold, Orange, Yellow',numbers:'1, 2, 3, 9'},
  2:{planet:'Moon (Chandra)',day:'Monday',colours:'White, Cream, Light green',numbers:'1, 2, 7'},
  3:{planet:'Jupiter (Guru)',day:'Thursday',colours:'Yellow, Purple',numbers:'3, 6, 9'},
  4:{planet:'Rahu',day:'Saturday',colours:'Blue, Grey',numbers:'1, 4, 5, 6'},
  5:{planet:'Mercury (Budh)',day:'Wednesday',colours:'Green, Light grey',numbers:'1, 5, 6'},
  6:{planet:'Venus (Shukra)',day:'Friday',colours:'White, Pink, Light blue',numbers:'3, 6, 9'},
  7:{planet:'Ketu',day:'Monday',colours:'Green, White, Yellow',numbers:'1, 2, 7'},
  8:{planet:'Saturn (Shani)',day:'Saturday',colours:'Dark blue, Black, Purple',numbers:'1, 4, 8'},
  9:{planet:'Mars (Mangal)',day:'Tuesday',colours:'Red, Crimson, Pink',numbers:'3, 6, 9'},
};

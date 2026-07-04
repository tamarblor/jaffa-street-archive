document.addEventListener('DOMContentLoaded', () => {

    // --- 1. לוגיקת סרטון הפתיחה והתזמונים ---
    const videoWrapper = document.getElementById('intro-video-wrapper');
    const video = document.getElementById('intro-video');
    const logoIntro = document.getElementById('intro-logo');

    document.body.style.overflow = 'hidden';

    // אינטרו: לוגו "רחוב יפו" במרכז (ללא נקודות)
    if (logoIntro) logoIntro.classList.add('show-logo');

    const introStart = Date.now();
    const MIN_INTRO = 900;   // משך מינימלי קצר כדי שהלוגו ייראה
    let introDone = false;
    function endIntro() {
        if (introDone) return;
        introDone = true;
        const wait = Math.max(0, MIN_INTRO - (Date.now() - introStart));
        setTimeout(() => {
            if (videoWrapper) videoWrapper.classList.add('fade-out');   // הלוגו והנקודות נעלמים יחד
            setTimeout(() => {
                if (videoWrapper) videoWrapper.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 700);
        }, wait);
    }
    if (video) {
        video.addEventListener('ended', endIntro);
        setTimeout(endIntro, 4200);   // גיבוי אם הסרטון איטי להיטען
    } else {
        endIntro();
    }

    // --- 2. מאגר הסיפורים (מותאם לטווח דינמי של 0 עד 7 רגשות) ---
    const stories = [
        { name: "אביגיל זהבי", age: "31", location: "יפו מול השוק הפתוח", year: "2018", text: "״פעם הלכתי על המסילה לפני איזה 8 שנים חזרתי בבוקר ממסיבה או משהו בעיר והייתי בדרך הביתה שכחתי שיש רכבת והייתי שיכורה ומאושרת ושמעתי מוזיקה באוזניות ואז אני שומעת צפירה ממש חזקה וקולטת שהרכבת שניה ממני. כמובן שלא מתתי בסוף.״" , img: "1.JPG" , offset: 0, emotions: ["Surprise | הפתעה", "Enjoyment | הנאה", "Fear | פחד"] },

        { name: "איצ׳ה סומינקי", age: "26", location: "מלך הצ׳יפס או הפלאפל", year: "2022", text: "״ב4 לפנות בוקר גנבתי תפוחי אדמה ממלך הצ׳יפס או הפלאפל ליד כי חשבתי שהם לא צריכים את זה (היינו מסטולים) ואז באנו למחרת לשלם כי הבנו שיש סיכוי שהם כן צריכים את התפוחי אדמה, זה היה אחרי החתונה הרביעית של דודה שלי- שהתגרשה מאז.״" , img: "2.JPG" , offset: 2, emotions: ["Enjoyment | הנאה", "Surprise | הפתעה"] },

        { name: "אליה ברנשטיין", age: "30", location: "כל רחוב יפו", year: "2022", text: "״כשהייתי סטודנטית עבדתי בתל אביב במשרד וביום שירד שלג הייתי אמורה לנסוע לעבוד כי תל אביבים לא מבינים מה זה שלג בארץ.. קיצר הלכתי לתחנת רכבת קלה ואחרי המתנה של חצי שעה בסוף הבנתי שהיא לא תגיע למרות שלא היה כתוב בשומקום שהיא לא עובדת ושלכאורה פינו את המסילות מוקדם יותר.. והייתי צריכה ללכת את כל רחוב יפו למרכזית בשלג שהגיע לי לברכיים ולמרות הנעליים חסינות הגשם שלי נרטבו לי לגמרי הגרביים. טראומה קשהה.״" , img: "3.JPG" , offset: 4, emotions: ["Sadness | עצב", "Anger | כעס", "Fear | פחד", "Disgust | גועל (או סלידה)"] },

        { name: "אלישע לדג׳לי", age: "29", location: "בפניה שמובילה לגואה איפה שיש את החניה הגדולה", year: "2022", text: "״ראיתי את עילם מנסה להפריד חבורה של ערסים שהרביצו לאיזה 2 ערסים אחרים, ואז בסוף הרביצו לעילם🤣.״" , img: "4.JPG" , offset: 1, emotions: ["Surprise | הפתעה", "Enjoyment | הנאה"] },

        { name: "דן אורן", age: "30", location: "מיפו מרכז עד מרכזית", year: "2024", text: "״מיהרתי לרכבת לתל אביב והרכבת קלה לא הגיעה, אז החלטתי לקחת את האופניים העירוניים החשמליים אחרי שלא נסעתי על אופניים כמה שנים חחח. התחלתי לנסוע אל התחנה המרכזית על הפסי רכבת ומסתבררר שהפסי רכבת רחבים מידי לגלגלים של האופניים האלה.. אז כשעברתי מעליהם הגלגל נתקע בפנים והחלקתי של החיים. אבל זה היה שפשוף קל בג׳ינס והספקתי לרכבת. מאז למדתי לעבור על הפסי רכבת רק שהגלגל מקביל לפסים (ככה הוא לא נכנס לבפנים) וואלה נסעתי לא מעט עם האופניים. וזהו חחח זה הסיפור שלי.״", img: "5.JPG" , offset: 3, emotions: ["Surprise | הפתעה", "Fear | פחד", "Sadness | עצב"] },

        // הדס אלמגור - דוגמה ל-5 רגשות
        { name: "הדס אלמגור", age: "35", location: "כל יפו", year: "2016", text: "״הייתי בשנה ב' בצלאל. קיץ, רחוב יפו, חברים שלי ירושלמים ואני מהפריפריה יושבים בבר שפונה לסמטה אחת של יפו. שותים, אנחנו חברים כבר שנתיים חבורה עליזה וסטלנית. פתאום עוברת הומלסית ידועה בעיר, והיא נועלת איתי מבט ואז היא קוראת בקול \" את בטוח זונה בת זונה! את שרמוטה!\" אף אחד מהחברים הזבל שלי לא עונה לה אחרי כמה שניות התאפסתי על עצמי ועניתי לה. \"צריך זונה כדי לזהות זונה! ואתם! חבורה של אפסים! אתם חברים אתם? שמישהו פה יקום ויגן על השם שלי! אתם השרמוטות!!..״" , img: "6.JPG" , offset: 6, emotions: ["Anger | כעס", "Contempt | בוז", "Disgust | גועל (או סלידה)", "Surprise | הפתעה", "Sadness | עצב"] },

        { name: "ולאד ואנטורין", age: "29", location: "כל יפו", year: "2026", text: "״ברחוב יפו יש רוכבים של אופניים חשמליות שנוסעים ללא קסדה והמשטרה לא אכפת מהם.״" , img: "7.JPG" , offset: 4, emotions: ["Contempt | בוז", "Anger | כעס"] },

        { name: "זיו טלמון", age: "?", location: "כניסה לבניין של זיו", year: "2023", text: "״איזה יום שישי אחד בערב אני בדיוק עברתי בתקליט בדרך הביתה מאמא. בכל אופן, אני עובר ואומר שלום בתקליט ואז שחר בא ואומר לי - ׳תקשיב לקחו את אחת העגלות אתה יודע על זה משהו?׳ (העגלות שבהן מאכסנים את הכיסאות) אני אומר לו כזה ׳מה מה זאת  אומרת איך מה מי מו?׳ הוא אומר לי ׳לא יודע מישהו לקח את זה׳ סבבה אני שותה איזה בירה הולך הביתה עולה את רחוב יפו. תוך כדי שאני מתקרב הביתה אני קולט שעומד משהו ליד הכניסה לבניין, אני מתקרב וקולט שהעגלה עומדת מחוץ לכניסה לבניין שלי! אני מצלם תמונה ושולח לשחר ומרים אליו טלפון ושואל אותו ׳תגיד זו העגלה?׳ הוא מסתכל על התמונה, נקרע מצחוק ואומר לי ׳כן׳ אני מתחיל לגלוש קצת עם העגלה במורד יפו, פוגש את שחר בכיכר ציון ומעביר לו את העגלה.״" , img: "8.JPG" , offset: 7, emotions: ["Surprise | הפתעה", "Enjoyment | הנאה"] },

        { name: "חן זנזורי", age: "36", location: "?", year: "?", text: "״נפתח לי האם די בזריחה והכל היה בצבע זהב מנצנץ״" , img: "9.JPG" , offset: 5, emotions: ["Enjoyment | הנאה", "Surprise | הפתעה"] },

        { name: "טל אוליאל", age: "30", location: "דוידקה, כספומטים", year: "2023", text: "״ אני הולך ברחוב יפו לכיוון השוק, אני מסתכל בסמטה, אני רואה פאקינג עגלה עם תינוק בפנים ,ואני אוקיי מה הלוז? ואז סימנתי לשוטרים לבוא, ואז יצאה מאיזה דלת הזונה הערבייה המפורסמת, המקבצת נדבות, זה היה התינוק שלה, ואז ילד אחר שלה בן פאקינג איזה שש ראה שאני קראתי לשוטרים והוא פשוט התחיל לרדוף אחריי ואני מוצא את עצמי בסיטואציה שבה אני רץ במעלה רחוב יפו וילד בן שש רודף אחריי וצועק עליי בן זונה ומתחיל לירוק עליי כאילו, ורודף אחריי מתחיל לתת לי כזה בעיטות. ״" , img: "10.JPG" , offset: 8, emotions: ["Fear | פחד", "Disgust | גועל (או סלידה)", "Surprise | הפתעה", "Anger | כעס"] },

        { name: "יסמין סאלווי", age: "30", location: "ליד מאפה נאמן", year: "2025", text: "״מישהו ביקש ממני חיבוק ואמרתי לו עזוב אותי מפגר -  זה לא זמן להפיץ אהבה.״" , img: "11.JPG", offset: 10, emotions: ["Contempt | בוז", "Disgust | גועל (או סלידה)"] },

        { name: "ירדן רוזנבלום", age: "26", location: "כיכר ציון, מול המשביר", year: "2023", text: "״בשנה א צילמתי עם גאיה תרגיל לאיזה קורס, והייתה שם נגנית כינור שניגנה עם עורב (אמיתי) על הראש, היה נראה שיש בינהם איזה שיתוף פעולה הוא ממש היה שם כל הזמן , זה לא היה משהו ריגעי.״" , img: "12.JPG" , offset: 7, emotions: ["Surprise | הפתעה", "Enjoyment | הנאה"] },

        { name: "לארה ביולו", age: "?", location: "יפו 155", year: "?", text: "״הדירה הראשונה ששכרתי כשעזבתי את ההורים הייתה ברחוב יפו מול השוק.. השותפה שלי הייתה אחת המוזרות.. והיא הייתה מקשיבה לפופ נוצרי של שנות ה90 בפול וליום באמצע הלילה..״" , img: "13.JPG" , offset: 11, emotions: ["Disgust | גועל (או סלידה)", "Surprise | הפתעה"] },

        { name: "לארה ביולו", age: "?", location: "?", year: "2009", text: "״בורקס מוסא - הבורקס הכי טוב במדינה זה ברחוב יפו.״" , img: "14.JPG" , offset: 9, emotions: ["Enjoyment | הנאה"] },

        { name: "לידיה ילין", age: "22", location: "דוידקה", year: "2017", text: "״הסתובבתי עם אחותי במרכז העיר והיה לנו קצת כסף לבזבוזים. ראיתי בדוידקה על ספסל תייר יפני מסתכל על מפה ומעיין בה מכל מיני כיוונים. אז חשבתי לעצמי שאולי הוא מסתבך בדרך ושכדאי לי לגשת להציע עזרה. באותה תקופה הייתי ממש משולהבת בנפלאות התרבות היפנית וזה הרגיש לי כאילו הזדמנות משמיים הגיעה.\nכשניגשנו אליו ושאלנו אם הוא צריך עזרה הוא אמר שהוא לא אבוד אלא רק מתכנן את המשך הטיול. ישבנו לדבר איתו בערך 40 דקות. הוא היה רופא קרדיולוג מהעיר נאגויה, בטיול גדול במזרח התיכון. אחרי ישראל הוא תכנן להמשיך לירדן, אחרי שכבר היה במצרים. הוא סיפר לנו שהוא גר בדירה קטנה בעיר ושהוא מתכנן להתחתן בקרוב עם בת הזוג שלו. היה ממש מעניין לדבר. והייתי ממש באקסטזה בכל השיחה (יפני אמיתי!!! יפני אמיתי!!!) אפילו הראנו לו שבדיוק קנינו ב\"הכל בשקל\" מחברות שהיצרן רשם עליהן ביפנית, מתוך הערצה. הוא חשב שזה מגוחך.\nהוא הציע לנו ללוות אותו עד לכיכר ציון, שם המלון שלו, והוא אמר שיעלה להביא לנו משהו מהמזוודה שלו שנוכל לקחת כמזכרת כאילו \"מיפן\". אז באמת המשכנו איתו ברחוב יפו, ואז הוא הוריד לנו מהמלון שני עטים מחנויות כלי כתיבה ביפן. יש לי את האחד שלי עד היום! ויש לי גם את הכרטיס שלו של הרכבת הקלה שהיה עדיין מנייר אז, כי הוא ביקש עזרה בקניית נסיעה.״" , img: "15.JPG" , offset: 13, emotions: ["Enjoyment | הנאה", "Surprise | הפתעה"] },

        { name: "ליסה מייסון", age: "22", location: "משביר, כיכר ציון", year: "2025", text: "״הלכתי פעם אחת על יפו בחמישי בלילה עם הג׳קט שלי שכתוב עליו SEX בענק , וחבורת ערסים חרדים הלכו לקראתי ואחד רץ לתוך הפנים שלי וצעק לי בפרצוף ״!!SEX״ וברח.״" , img: "16.JPG" , offset: 12, emotions: ["Surprise | הפתעה", "Fear | פחד"] },

        { name: "ליסה מייסון", age: "22", location: "מאפה נאמן", year: "2025", text: "״ישבתי עם הפרלמנט של מאפה נאמן, הם שרים שם כל שבוע שירים בפרהסיה.״" , img: "17.JPG" , offset: 15, emotions: ["Enjoyment | הנאה"] },

        { name: "ליסה מייסון", age: "22", location: "כיכר ציון", year: "2025", text: "״צילמו לי את השיניים ברחוב.״" , img: "18.JPG" , offset: 14, emotions: ["Surprise | הפתעה", "Disgust | גועל (או סלידה)"] },

        { name: "ליסה מייסון", age: "22", location: "תחנת רכבת הקלה הטורים", year: "2025", text: "״כמעט גנבתי למישהי כומתה.״" , img: "19.JPG" , offset: 17, emotions: ["Enjoyment | הנאה", "Surprise | הפתעה"] },

        // דוגמה לסיפור ריק - 0 רגשות
        { name: "מיכאל לוי יצחק", age: "?", location: "?", year: "?", text: "״.״" , img: "20.JPG" , offset: 16, emotions: [] },

        { name: "מקס נויז", age: "?", location: "יפו מעל הירידה למזקקה", year: "2015", text: "״אחד החברים הטובים שלי קוראים לו אופיר (המורה) לפני כ10 שנים הייתי מסתובב עם מוהק, חוץ מזה מאודדד אהבתי לעשות סמים במיוחד אמדי, מכיוון שאופיר מורה מוכר בבית ספר, היה לנו חוק שהיינו מסתובבים בעיר, קראו לו ״אל תתנהג״. אז ערב אחד, אופיר לא במצב הכי שפוי, וגם אני לא ועל כל זה אני עם מוהק, לבוש מגניב ובכללי מטר 194. אנחנו פוגשים את התלמידים שלו, אופיר צועק ״מקס! אל תתנהג״ אני עונה בחיוב. וזו הסיטואציה: אני עומד דלוק חרבות, ליד המורה האהוב, התלמידים שואלים אותו על שבוע הבא, והאם יהיה משהו במבחן, בינתיים הם מבינים שהדבר המוזר והדלוק הזה ליידו- זה חבר של המורה. הם שואלים אותו ״מי זה? חבר שלך?״ אופיר מבולבל - תופס לי את היד ואנחנו מתחילים ללכת מהר, כמעט לרוץ לבר הסירה. אופיר אף פעם לא התבייש בי♥️ הוא פשוט קיבל את זה שאני הצרה שלו.״" , img: "21.JPG" , offset: 19, emotions: ["Enjoyment | הנאה", "Fear | פחד"] },

        { name: "מקס נויז", age: "?", location: "תחנה מרכזית", year: "2013", text: "״עבדתי בתחנה המרכזית ירושלים, הייתי סוכן מכירות של גולן טלקום, מפה לשם הכרתי את כללל התחנה, כל עובד דלפק, כל מאבטח וכל שוטר/מגבניק. יום אחד אני רואה שבנצי גולדשטיין מסתובב עם הקטנים שלו ליד המרכזית, עושה שיט של ימניים קיצוניים, שיט של בנצי בקיצור. ישר התחלתי להתרגש, מתי עוד תהיה לי כזאת הזדמנות לראות את בנצי בזמן שאני מוקף במלא שוטרים ומגבניקים?! עברתי ליד השוטרים, הבאתי חיבוק לכמה, הרמתי חיוך שם בזריז, והלכתי לכיוון בנצי… התקרבתי אליו, וצעקתי ״בנצי! יא פאשיסט מסריח״ וירקתי לו בפנים. הם היו המומים, ואני הלכתי לחברים השוטרים שלי, הוא צעק הוא איים והשוטרים היו בוויב של ״אתה לא יכול לעשות לו כלום״ - תתמודד.״" , img: "22.JPG" , offset: 18, emotions: ["Anger | כעס", "Contempt | בוז"] },

        { name: "נגה אבני", age: "26", location: "תחנת רכבת קלה יפו", year: "2014", text: "״כשהינו בחטיבה הינו שמים חצי שקל על המסילה של הרכבת הקלה. מחכים שתעבור ושתמעוך אותו ואז היה יוצא כזה חצי שקל מעוך. והינו ממש מתלהבים מזה כמו ילדים קטנים. אני זוכרת את התחושת בושה שהיתה לי כשהרכבת עברה בתחנה של יפו, שכולם יכלו לשמוע את ה״טומ טומ טומ טומ״ כאילו הרכבת לא בסדר, היה את הקול כשהיא עוברת מעל חצי השקל, והקול הזה נשמע לי תמיד כלכך חזק ואני לא יודעת אם אחרים שמו לב או העמידו פנים שלא איכפת להם. ואז אחרי כל פעם שהרכבת עברה, הלכתי בבושה לקחת את אותו חצי שקל משם . לא יודעת של מי היה הרעיון, ואם הרגשתי יותר התלהבות אחר כך או בושה ואשמה שכזו.״" , img: "23.JPG" , offset: 21, emotions: ["Sadness | עצב", "Fear | פחד"] },

        { name: "נדב לדרמן", age: "29", location: "דוידקה", year: "2015", text: "״זרקתי בדל סיגריה לפח ואז כשחזרתי אחרי כמה זמן ראיתי מלא אנשים רצים עם כוסות מים לכבות את הפח הבוער״" , img: "24.JPG" , offset: 20, emotions: ["Surprise | הפתעה", "Fear | פחד"] },

        { name: "נועה ?", age: "?", location: "?", year: "?", text: "״מישהו דתי כזה עבר מולי ובהה לי בציצי ואז צרח לשמיים ברוך השם.״" , img: "25.JPG" , offset: 23, emotions: ["Surprise | הפתעה", "Disgust | גועל (או סלידה)"] },

        // נועה קמרי - המלכה של הארכיון: קיבלה את כל 7 הרגשות האפשריים!
        { name: "נועה קמרי", age: "28", location: "רכבת קלה", year: "2025", text: "״יציאה רנדומלית עם חברים לקקטוס, חמישי בערב, הרחובות הומי אדם הולכים. והחברים חושבים לעלות על הרכבת הקלה ולחסוך את ההליכה, אני מתנגדת, שונאת צפיפות מפחדת ממחבלים ובעיקר מאמינה שטוב לי ברגל. מפה לשם - זורמת איתם אחרי שכנועים ועולים על הרכבת הקלה. צוחקים עם זוג לידינו ששתה קולה בכוס רגילה ״רק שלא תישפך עלינו הקולה שלך״ . כמה רגעים עוברים, דעתי מוסחת, ותחושת רטיבות עוטפת את הרגל שלי, מסתכלת על הכוס קולה - לא נשפכה עליי. מפנה את המבט לצד שני וקולטת שמהמותן עד הכף רגל אני מכוסה בקיא של נער שיכור, התלוי כמו סחבה על העמוד, מחזיק בשארית כוחותיו ובושתו. גמור, מגעיל, ובעיקר לא בהכרה. ומשם הסיפור מסתיים בכמה מגבונים, ממשיכים לקקטוס משתכרים ומעמיסים קטמין שישכיח את הכל.״" , img: "26.JPG" , offset: 22, emotions: [
            "Anger | כעס",
            "Contempt | בוז",
            "Disgust | גועל (או סלידה)",
            "Enjoyment | הנאה",
            "Fear | פחד",
            "Sadness | עצב",
            "Surprise | הפתעה"
        ] },

        { name: "עומר בראל", age: "23", location: "דוידקה", year: "2025", text: "״הלכתי לראות דירה שפרסמו בפייסבוק, היו תמונות סבירות של דירה ריקה, וכשהגעתי לדירה פתח לי את הדלת בחור הודי במגבת ולא דיבר עברית , סימן לי עם היד להיכנס, כשנכנסתי היה מקרר באמצע המסדרון וכשהסתכלתי לאחד מהחדרים החלונות היו שבורים ואז חדר ליד היה מיטת קומותיים של 4 בחורים הודים עירומים שנופפו לי לשלום כשעברתי, וכשהגעתי למטבח היה מיליון מקקים וג׳וקים מגעילים, וכל המטבח היה מפורק לגמרי.״" , img: "27.JPG" , offset: 25, emotions: ["Disgust | גועל (או סלידה)", "Surprise | הפתעה"] },

        { name: "עומר דגן", age: "29", location: "כיכר ציון", year: "2022", text: "״פעם חזרתי מהקסטה עם אלון באיזה 2-3 בלילה, מישהי ניגשה אלינו באטרף וצעקה \"ערבייי גנב לי את הטלפון בעיר העתיקה!!!! אני חייבת שיחה אפשר שיחה???\" נתנו לה שיחה והיא המשיכה לצעוק שערבי גנב לה את הטלפון ואחרי שהיא ניסתה להתקשר ולא ענו לה היא שאלה אם יש לנו 10 שקל לחזור לעיר העתיקה לחפש את הטלפון...״" , img: "28.JPG" , offset: 24, emotions: ["Surprise | הפתעה", "Fear | פחד"] },

        // שי מועלם - דוגמה לרגש 1 בודד
        { name: "שי מועלם", age: "29", location: "קצפת", year: "2026", text: "״אכלנו קרפ.״" , img: "29.JPG", offset: 27, emotions: ["Enjoyment | הנאה"] },

        { name: "שירי פירסט", age: "29", location: "גשר המיתרים", year: "?", text: "״אני זוכרת שפעם ממש כשפתחו את הקו של הרכבת הקלה הייתי בה ומישהו נשכב על המסילה בגשר המיתרים וכמעט נמחץ. הרכבת עצרה בזמן.״" , img: "30.JPG" , offset: 26, emotions: ["Fear | פחד", "Sadness | עצב"] },

        { name: "שירי פירסט", age: "29", location: "מעל הירידה למזקקה", year: "2025", text: "״שנה שעברה בזמן ״הימים הנוראים״ הלכתי מהבית שלי (נחלאות) למזקקה ודרך רחוב יפו ולאורך כל ההליכה הייתי האישה היחידה ברחוב עם מכנסיים.  החבר שהיה איתי היה היחיד ברחוב שלבש חולצה בצבע (סגול) ולא שחור-לבן.״" , img: "31.JPG" , offset: 29, emotions: ["Contempt | בוז", "Fear | פחד"] },

        { name: "שירי פירסט", age: "29", location: "לאורך רחוב יפו", year: "2015", text: "״בגיל 18 בלילה האחרון לפני סיום התיכון רצנו רק בתחתונים לאורך הרחוב.״" , img: "32.JPG" , offset: 28, emotions: ["Enjoyment | הנאה"] },

        { name: "שירי פירסט", age: "29", location: "כיכר ציון", year: "2015", text: "״בחופש הגדול של 2015 כל יום חמישי מצעדים ודגלים של פעילי להב״ה בכיכר ציון ולאורך הרחוב.״" , img: "33.JPG" , offset: 31, emotions: ["Anger | כעס", "Fear | פחד"] },

        { name: "שלי שטיינגארד", age: "24", location: "כיכר ציון", year: "2026", text: "״זקנה סכיזופרנית רדפה אחריי ואחרי חברים שלי.״" , img: "34.JPG" , offset: 30, emotions: ["Fear | פחד", "Surprise | הפתעה"] },

        { name: "שלמה פורת", age: "40", location: "כיכר ציון", year: "2014", text: "״אחרי חינה הצטרפתי לשלושה חברים למשחק פריזבי די אגדי על פסי הרכבת בכיכר ציון בשלוש בבוקר.״" , img: "35.JPG" , offset: 33, emotions: ["Enjoyment | הנאה"] },

        // דוגמה לסיפור ריק - 0 רגשות
        { name: "שרית צנעני", age: "28", location: "?", year: "?", text: "״.״" , img: "36.JPG" , offset: 32, emotions: [] }
    ];

    const archiveContainer = document.getElementById('archive-container');

    // --- מדבקה שנדבקת על התמונה + סאונד "בלופ" בכל לחיצה על רגש ---
    const STICKER_COLORS = { Anger: "#FF5C34", Contempt: "#7A876B", Disgust: "#8E9817", Enjoyment: "#D98A2C", Fear: "#351E28", Sadness: "#467AA1", Surprise: "#7D5C9D" };
    function stampSticker(pill) {
        const host = pill.closest('.story-card, .map-popup, .so-content, #fullscreen-text');
        if (!host) return;
        const surface = host.querySelector('.sticker-surface');
        if (!surface) return;
        const s = document.createElement('span');
        s.className = 'img-sticker';
        const size = 22;   // גודל אחיד לכל המדבקות
        s.style.width = size + 'px';
        s.style.height = size + 'px';
        s.style.left = (12 + Math.random() * 76) + '%';
        s.style.top = (12 + Math.random() * 76) + '%';
        s.style.backgroundColor = STICKER_COLORS[pill.dataset.emotion] || '#1a1a1a';
        s.style.setProperty('--rot', (Math.random() * 40 - 20).toFixed(0) + 'deg');
        surface.appendChild(s);
    }

    let _audioCtx = null;
    function playPop() {
        try {
            _audioCtx = _audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            const o = _audioCtx.createOscillator(), g = _audioCtx.createGain();
            const t = _audioCtx.currentTime;
            o.type = 'sine';
            o.frequency.setValueAtTime(620, t);
            o.frequency.exponentialRampToValueAtTime(180, t + 0.12);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(0.22, t + 0.012);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.19);
            o.connect(g); g.connect(_audioCtx.destination);
            o.start(t); o.stop(t + 0.2);
        } catch (err) {}
    }

    // =========================================================================
    // --- מנוע סימון טקסט (Highlighter) - מתוקן לזיהוי מדויק של מחברים עם מספר סיפורים ---
    // =========================================================================
    document.addEventListener('click', (e) => {
        const pill = e.target.closest('.emotion-tag');
        if (!pill) return;

        // בכל לחיצה: מדבקה נדבקת על התמונה + סאונד בלופ
        stampSticker(pill);
        playPop();

        const container = pill.closest('.story-card, .single-story-view, #fullscreen-text, .collage-text, .so-info');
        if (!container) return;

        const textBox = container.querySelector('.story-text, .fs-text-content');
        if (!textBox) return;

        const emotionKey = pill.dataset.emotion;

        // פתרון הקסם: מוצאים את הסיפור לפי הטקסט המדויק שלו (מתעלם מרווחים ותגיות HTML)
        const cleanStr = (str) => str.replace(/[\s״"׳'.,!?]/g, '');
        const currentCleanText = cleanStr(textBox.textContent);
        const storyObj = stories.find(s => cleanStr(s.text) === currentCleanText);

        if (!storyObj) return;

        const isAlreadyActive = pill.classList.contains('active-underline-pill');

        container.querySelectorAll('.emotion-tag').forEach(p => p.classList.remove('active-underline-pill'));

        if (isAlreadyActive) {
            textBox.innerHTML = storyObj.text;
        } else {
            pill.classList.add('active-underline-pill');

            // טבלת הכללים מבוססת על מילות המפתח של תחילת כל סיפור (מונעת התנגשות שמות לחלוטין)
            const snippetRules = [
                {
                    id: "פעם הלכתי על המסילה לפני איזה 8 שנים",
                    rules: { "Surprise": "ואז אני שומעת צפירה ממש חזקה וקולטת שהרכבת שניה ממני", "Enjoyment": "והייתי שיכורה ומאושרת", "Fear": "שהרכבת שניה ממני" }
                },
                {
                    id: "ב4 לפנות בוקר גנבתי תפוחי אדמה",
                    rules: { "Enjoyment": "(היינו מסטולים)", "Surprise": "זה היה אחרי החתונה הרביעית של דודה שלי- שהתגרשה מאז" }
                },
                {
                    id: "כשהייתי סטודנטית עבדתי בתל אביב במשרד",
                    rules: { "Sadness": "נרטבו לי לגמרי הגרביים", "Anger": "למרות שלא היה כתוב בשומקום שהיא לא עובדת", "Fear": "טראומה קשהה", "Disgust": "בשלג שהגיע לי לברכיים" }
                },
                {
                    id: "ראיתי את עילם מנסה להפריד חבורה",
                    rules: { "Surprise": "ואז בסוף הרביצו לעילם🤣", "Enjoyment": "🤣" }
                },
                {
                    id: "מיהרתי לרכבת לתל אביב והרכבת קלה לא הגיעה",
                    rules: { "Surprise": "מסתבררר שהפסי רכבת רחבים מידי לגלגלים של האופניים האלה", "Fear": "והחלקתי של החיים", "Sadness": "אחרי שלא נסעתי על אופניים כמה שנים" }
                },
                {
                    id: "הייתי בשנה ב' בצלאל. קיץ, רחוב יפו",
                    rules: { "Anger": "אתם השרמוטות!!", "Contempt": "חבורה של אפסים!", "Disgust": "את בטוח זונה בת זונה!", "Surprise": "פתאום עוברת הומלסית ידועה בעיר", "Sadness": "אף אחד מהחברים הזבל שלי לא עונה לה" }
                },
                {
                    id: "ברחוב יפו יש רוכבים של אופניים חשמליות",
                    rules: { "Contempt": "שנוסעים ללא קסדה", "Anger": "והמשטרה לא אכפת מהם" }
                },
                {
                    id: "איזה יום שישי אחד בערב אני בדיוק עברתי בתקליט",
                    rules: { "Surprise": "קולט שהעגלה עומדת מחוץ לכניסה לבניין שלי!", "Enjoyment": "נקרע מצחוק ואומר לי ׳כן׳" }
                },
                {
                    id: "נפתח לי האם די בזריחה והכל היה בצבע",
                    rules: { "Enjoyment": "והכל היה בצבע זהב מנצנץ", "Surprise": "נפתח לי האם די בזריחה" }
                },
                {
                    id: "אני הולך ברחוב יפו לכיוון השוק, אני מסתכל בסמטה",
                    rules: { "Fear": "רץ במעלה רחוב יפו וילד בן שש רודף אחריי", "Disgust": "ומתחיל לירוק עליי", "Surprise": "אני רואה פאקינג עגלה עם תינוק בפנים", "Anger": "צועק עליי בן זונה" }
                },
                {
                    id: "מישהו ביקש ממני חיבוק ואמרתי לו",
                    rules: { "Contempt": "עזוב אותי מפגר", "Disgust": "זה לא זמן להפיץ אהבה" }
                },
                {
                    id: "בשנה א צילמתי עם גאיה תרגיל לאיזה קורס",
                    rules: { "Surprise": "נגנית כינור שניגנה עם עורב (אמיתי) על הראש", "Enjoyment": "היה נראה שיש בינהם איזה שיתוף פעולה" }
                },
                {
                    id: "הדירה הראשונה ששכרתי כשעזבתי את ההורים",
                    rules: { "Disgust": "השותפה שלי הייתה אחת המוזרות", "Surprise": "והיא הייתה מקשיבה לפופ נוצרי של שנות ה90 בפול וליום באמצע הלילה" }
                },
                {
                    id: "בורקס מוסא - הבורקס הכי טוב במדינה",
                    rules: { "Enjoyment": "הבורקס הכי טוב במדינה זה ברחוב יפו." }
                },
                {
                    id: "הסתובבתי עם אחותי במרכז העיר והיה לנו קצת כסף",
                    rules: { "Enjoyment": "הייתי ממש באקסטזה בכל השיחה (יפני אמיתי!!! יפני אמיתי!!!)", "Surprise": "הוא חשב שזה מגוחך." }
                },
                {
                    id: "הלכתי פעם אחת על יפו בחמישי בלילה עם הג׳קט",
                    rules: { "Surprise": "צעק לי בפרצוף ״!!SEX״ וברח", "Fear": "חבורת ערסים חרדים הלכו לקראתי" }
                },
                {
                    id: "ישבתי עם הפרלמנט של מאפה נאמן",
                    rules: { "Enjoyment": "הם שרים שם כל שבוע שירים בפרהסיה." }
                },
                {
                    id: "צילמו לי את השיניים ברחוב.",
                    rules: { "Surprise": "צילמו לי את השיניים ברחוב.", "Disgust": "צילמו לי את השיניים" }
                },
                {
                    id: "כמעט גנבתי למישהי כומתה.",
                    rules: { "Enjoyment": "כמעט גנבתי למישהי כומתה.", "Surprise": "כמעט גנבתי" }
                },
                {
                    id: "אחד החברים הטובים שלי קוראים לו אופיר (המורה)",
                    rules: { "Enjoyment": "אופיר אף פעם לא התבייש בי", "Fear": "מתחילים ללכת מהר, כמעט לרוץ לבר הסירה." }
                },
                {
                    id: "עבדתי בתחנה המרכזית ירושלים, הייתי סוכן מכירות",
                    rules: { "Anger": "צעקתי ״בנצי! יא פאשיסט מסריח״", "Contempt": "וירקתי לו בפנים." }
                },
                {
                    id: "כשהינו בחטיבה הינו שמים חצי שקל על המסילה",
                    rules: { "Sadness": "אני זוכרת את התחושת בושה שהיתה לי", "Fear": "הלכתי בבושה לקחת את אותו חצי שקל משם" }
                },
                {
                    id: "זרקתי בדל סיגריה לפח ואז כשחזרתי אחרי כמה זמן",
                    rules: { "Surprise": "ראיתי מלא אנשים רצים עם כוסות מים", "Fear": "לכבות את הפח הבוער" }
                },
                {
                    id: "מישהו דתי כזה עבר מולי ובהה לי בציצי",
                    rules: { "Surprise": "צרח לשמיים ברוך השם.", "Disgust": "בהה לי בציצי" }
                },
                {
                    id: "יציאה רנדומלית עם חברים לקקטוס, חמישי בערב",
                    rules: { "Anger": "אני מתנגדת, שונאת צפיפות", "Contempt": "התלוי כמו סחבה על העמוד", "Disgust": "מכוסה בקיא של נער שיכור", "Enjoyment": "משתכרים ומעמיסים קטמין", "Fear": "מפחדת ממחבלים", "Sadness": "מחזיק בשארית כוחותיו ובושתו", "Surprise": "קולטת שמהמותן עד הכף רגל אני מכוסה בקיא" }
                },
                {
                    id: "הלכתי לראות דירה שפרסמו בפייסבוק, היו תמונות",
                    rules: { "Disgust": "מיליון מקקים וג׳וקים מגעילים", "Surprise": "פתח לי את הדלת בחור הודי במגבת" }
                },
                {
                    id: "פעם חזרתי מהקסטה עם אלון באיזה 2-3 בלילה",
                    rules: { "Surprise": "מישהי ניגשה אלינו באטרף וצעקה", "Fear": "שאלה אם יש לנו 10 שקל לחזור" }
                },
                {
                    id: "אכלנו קרפ.",
                    rules: { "Enjoyment": "אכלנו קרפ." }
                },
                {
                    id: "אני זוכרת שפעם ממש כשפתחו את הקו של הרכבת",
                    rules: { "Fear": "מישהו נשכב על המסילה בגשר המיתרים וכמעט נמחץ.", "Sadness": "וכמעט נמחץ" }
                },
                {
                    id: "שנה שעברה בזמן ״הימים הנוראים״ הלכתי מהבית שלי",
                    rules: { "Contempt": "הייתי האישה היחידה ברחוב עם מכנסיים.", "Fear": "היחיד ברחוב שלבש חולצה בצבע" }
                },
                {
                    id: "בגיל 18 בלילה האחרון לפני סיום התיכון רצנו",
                    rules: { "Enjoyment": "רצנו רק בתחתונים לאורך הרחוב." }
                },
                {
                    id: "בחופש הגדול של 2015 כל יום חמישי מצעדים ודגלים",
                    rules: { "Anger": "מצעדים ודגלים של פעילי להב״ה", "Fear": "מצעדים ודגלים של פעילי להב״ה בכיכר ציון" }
                },
                {
                    id: "זקנה סכיזופרנית רדפה אחריי ואחרי חברים שלי.",
                    rules: { "Fear": "זקנה סכיזופרנית רדפה אחריי", "Surprise": "רדפה אחריי ואחרי חברים שלי." }
                },
                {
                    id: "אחרי חינה הצטרפתי לשלושה חברים למשחק פריזבי",
                    rules: { "Enjoyment": "משחק פריזבי די אגדי על פסי הרכבת" }
                }
            ];

            const colors = {
                "Anger": "#FF5C34",
                "Contempt": "#7A876B",
                "Disgust": "#8E9817",
                "Enjoyment": "#D98A2C",
                "Fear": "#351E28",
                "Sadness": "#467AA1",
                "Surprise": "#7D5C9D"
            };

            const lineColor = colors[emotionKey] || "#1a1a1a";

            // שולפים את הכלל של הסיפור הספציפי הזה
            const matchedRuleObj = snippetRules.find(r => storyObj.text.includes(r.id));
            let snippet = matchedRuleObj ? matchedRuleObj.rules[emotionKey] : null;

            // גיבוי חכם: אם אין משפט מוגדר לרגש הזה, מסמן את המשפט השני בסיפור
            if (!snippet) {
                const parts = storyObj.text.split(/(?<=[.״!?”])/);
                snippet = parts.length > 1 ? parts[1].trim() : storyObj.text;
            }

            if (snippet && storyObj.text.includes(snippet)) {
                const marked = storyObj.text.replace(
                    snippet,
                    `<span style="border-bottom: 1.5px solid ${lineColor}; padding-bottom: 2px;">${snippet}</span>`
                );
                textBox.innerHTML = marked;
            }
        }
    });

    function generateTagsHTML(emotionsArray) {
        if (!emotionsArray || emotionsArray.length === 0) return '';
        return emotionsArray.map(tag => {
            const cleanKey = tag.split('|')[0].trim();
            const heLabel = (tag.split('|')[1] || tag).trim();   // רק עברית ל-tooltip
            return `<span class="emotion-tag" data-emotion="${cleanKey}" title="${heLabel}" style="cursor: pointer;"></span>`;
        }).join('');
    }

    // --- עוזר מדיה: מחזיר תמונה או וידאו (כולל סיפורים שנוספו ע"י משתמשים) ---
    function mediaSrc(story) {
        if (story.mediaUrl) return story.mediaUrl;
        return story.img ? `images/${story.img}` : 'images/placeholder.jpg';
    }
    function mediaTag(story, style) {
        const src = mediaSrc(story);
        const st = style || 'width:100%;height:100%;object-fit:cover;';
        if (story.mediaType === 'video') {
            return `<video src="${src}" muted loop playsinline autoplay style="${st}"></video>`;
        }
        return `<img src="${src}" alt="${story.name}" style="${st}">`;
    }

    // --- 3. פונקציית רינדור (גריד / ציר זמן) ---
    function renderStories(storiesArray, isTimeline) {
        if (!archiveContainer) return;
        document.body.classList.remove('geo-mode');
        archiveContainer.innerHTML = '';
        const track = isTimeline ? document.createElement('div') : archiveContainer;
        if (isTimeline) { track.className = 'tl-track'; archiveContainer.appendChild(track); }
        let prevYear = null;
        storiesArray.forEach(story => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card';
            let marker = '';
            if (isTimeline) {
                const y = story.year || '?';
                if (y !== prevYear) {   // נקודה + שנה רק כשהשנה מתחלפת
                    marker = `<div class="tl-marker"><span class="tl-dot"></span><span class="tl-year">[ ${y} ]</span></div>`;
                    prevYear = y;
                } else {
                    marker = `<div class="tl-marker"></div>`;
                }
            }
            storyCard.innerHTML = `
                ${marker}
                <div class="story-image-placeholder sticker-surface">
                    ${mediaTag(story)}
                </div>
                <div class="story-text">${story.text}</div>
                <div class="story-meta">
                    <span class="story-author">${story.name}</span>${story.age ? ', ' + story.age : ''}
                    <div class="story-location">[ ${story.location} | ${story.year || '?'} ]</div>
                </div>
                <div class="story-tags">
                    ${generateTagsHTML(story.emotions)}
                </div>
            `;
            storyCard.addEventListener('click', (e) => {
                if (e.target.closest('.emotion-tag')) return;   // לחיצה על מדבקת רגש לא פותחת סיפור
                openStoryFull(story);
            });
            track.appendChild(storyCard);
        });
    }

    // =========================================================================
    // --- 4. מצב מפה גיאוגרפי: רקע + נקודות + לחיצה שפותחת סיפור ---
    // =========================================================================
    const MAP_FILE = 'images/yaffo-map.png';   // <<< שם קובץ המפה שלך בתיקיית images (שני אם צריך)

    // מיקום כל סיפור על המפה (אחוז רוחב, אחוז גובה) — לפי סדר מאגר ה-stories למעלה
    const STORY_POS = [
        [59.6, 41.2], [35.6, 21.5], [56.5, 36.9], [20.8, 15.9], [44.4, 26.0], [63.0, 45.9],
        [76.7, 65.5], [52.8, 32.6], [29.8, 19.1], [70.5, 56.6], [82.2, 73.0], [83.7, 75.0],
        [61.8, 44.3], [58.2, 39.1], [68.9, 58.5], [84.0, 75.6], [82.5, 73.5], [82.4, 77.4],
        [40.9, 24.1], [43.4, 28.2], [85.9, 78.1], [20.2, 18.2], [88.3, 81.5], [70.1, 56.1],
        [80.2, 74.4], [91.8, 87.1], [71.9, 55.6], [81.7, 76.4], [81.0, 75.4], [12.4, 13.5],
        [84.3, 80.0], [72.7, 59.8], [85.1, 74.0], [86.2, 75.6], [79.9, 77.0], [66.6, 51.2]
    ];

    // שמות רחובות/מקומות שיופיעו על המפה (אחוז רוחב, אחוז גובה) — מבוסס על המפה מגוגל
    const LANDMARKS = [
        { name: "גשר המיתרים",   x: 11, y: 11 },
        { name: "התחנה המרכזית", x: 19, y: 15.5 },
        { name: "תחנת הטורים",   x: 39, y: 21 },
        { name: "שוק מחנה יהודה", x: 57, y: 38 },
        { name: "כיכר דוידקה",   x: 69, y: 53 },
        { name: "צומת האיקסים",  x: 74, y: 60 },
        { name: "כיכר ציון",     x: 84, y: 72 },
        { name: "העיר העתיקה",   x: 93, y: 86 }
    ];

    const EMO_COLORS = { Anger: "#FF5C34", Contempt: "#7A876B", Disgust: "#8E9817", Enjoyment: "#D98A2C", Fear: "#351E28", Sadness: "#467AA1", Surprise: "#7D5C9D" };
    const HE_EMO_COLOR = { 'כעס': '#FF5C34', 'בוז': '#7A876B', 'גועל (או סלידה)': '#8E9817', 'הנאה': '#D98A2C', 'פחד': '#351E28', 'עצב': '#467AA1', 'הפתעה': '#7D5C9D' };
    function dotColor(story) {
        if (!story.emotions || !story.emotions.length) return '#1a1a1a';
        const k = story.emotions[0].split('|')[0].trim();
        return EMO_COLORS[k] || '#1a1a1a';
    }

    let mapWorld = null, mapScale = 1, mapMinScale = 1, mapPanX = 0, mapPanY = 0, mapDragMoved = false, mapOpenIndex = -1;

    function applyMapTransform() {
        if (mapWorld) mapWorld.style.transform = `translate(${mapPanX}px, ${mapPanY}px) scale(${mapScale})`;
    }

    // מגביל את הגרירה והזום כך שהמפה תמיד ממלאה את המסך — בלי רקע ריק סביבה
    function clampMapView() {
        if (!mapWorld) return;
        const vw = archiveContainer.clientWidth, vh = archiveContainer.clientHeight;
        const ww = mapWorld.offsetWidth || 1400, wh = mapWorld.offsetHeight || ww * 0.54;
        if (mapScale < mapMinScale) mapScale = mapMinScale;
        const sw = ww * mapScale, sh = wh * mapScale;
        mapPanX = sw <= vw ? (vw - sw) / 2 : Math.min(0, Math.max(vw - sw, mapPanX));
        mapPanY = sh <= vh ? (vh - sh) / 2 : Math.min(0, Math.max(vh - sh, mapPanY));
    }

    function zoomMapAt(clientX, clientY, factor) {
        const rect = archiveContainer.getBoundingClientRect();
        const mx = clientX - rect.left, my = clientY - rect.top;
        const ns = Math.max(mapMinScale, Math.min(mapMinScale * 6, mapScale * factor));
        const wx = (mx - mapPanX) / mapScale, wy = (my - mapPanY) / mapScale;
        mapScale = ns;
        mapPanX = mx - wx * mapScale;
        mapPanY = my - wy * mapScale;
        clampMapView();
        applyMapTransform();
    }

    // מאזיני גלגלת/לחיצה — נקשרים פעם אחת בלבד
    if (!archiveContainer.dataset.mapBound) {
        archiveContainer.dataset.mapBound = '1';
        archiveContainer.addEventListener('wheel', (e) => {
            if (!archiveContainer.classList.contains('yaffo-street-mode') || !mapWorld) return;
            if (e.target.closest('.map-popup')) return;   // גלילה בתוך הכרטיס, בלי זום
            e.preventDefault();
            zoomMapAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.12 : 0.89);
        }, { passive: false });
        archiveContainer.addEventListener('click', (e) => {
            if (mapDragMoved) { mapDragMoved = false; e.stopPropagation(); e.preventDefault(); }
        }, true);
    }

    function closeMapPopup() {
        if (!mapWorld) return;
        const old = mapWorld.querySelector('.map-popup'); if (old) old.remove();
        mapWorld.querySelectorAll('.map-dot.active').forEach(d => d.classList.remove('active'));
        mapOpenIndex = -1;
    }

    function openMapPopup(index, dot) {
        closeMapPopup();
        mapOpenIndex = index; dot.classList.add('active');
        const story = stories[index];
        const x = STORY_POS[index][0], y = STORY_POS[index][1];
        const pop = document.createElement('div'); pop.className = 'map-popup';
        if (x > 55) { pop.style.right = (100 - x) + '%'; pop.style.transform = 'translateX(-12px)'; }
        else        { pop.style.left = x + '%';          pop.style.transform = 'translateX(12px)'; }
        pop.innerHTML = `
            <div class="map-close">✕</div>
            <div class="sticker-surface">${mediaTag(story, 'display:block;width:100%;height:150px;object-fit:cover;')}</div>
            <div class="map-popup-body">
              <div class="collage-text">
                <div class="story-text">${story.text}</div>
                <div class="story-meta"><span class="story-author">${story.name}</span>${story.age ? ', ' + story.age : ''} [ ${story.location} | ${story.year || '?'} ]</div>
                <div class="story-tags">${generateTagsHTML(story.emotions)}</div>
              </div>
            </div>`;
        pop.querySelector('.map-close').addEventListener('click', (e) => { e.stopPropagation(); closeMapPopup(); });
        mapWorld.appendChild(pop);

        // מיקום אנכי: ממורכז על הנקודה, אך תמיד בתוך גבולות המפה כך שלא ייחתך
        const wh = mapWorld.offsetHeight || 800;
        const ph = pop.offsetHeight;
        let topPx = (y / 100) * wh - ph / 2;
        topPx = Math.max(8, Math.min(Math.max(8, wh - ph - 8), topPx));
        pop.style.top = topPx + 'px';
    }

    // === מצב גיאוגרפי: מפה אמיתית (Leaflet) — ברירת מחדל / לוויין ===
    // ציר רחוב יפו בקואורדינטות אמיתיות (0 = העיר העתיקה במזרח, 1 = גשר המיתרים במערב)
    const JAFFA_PATH = [
        [31.78085, 35.22640], [31.78127, 35.21865], [31.78300, 35.21600], [31.78492, 35.21356],
        [31.78560, 35.21130], [31.78700, 35.20880], [31.78880, 35.20330], [31.79060, 35.20170]
    ];
    const LANDMARKS_LL = [
        { name: "העיר העתיקה", lat: 31.78085, lng: 35.22640 },
        { name: "כיכר ציון", lat: 31.78127, lng: 35.21865 },
        { name: "כיכר דוידקה", lat: 31.78492, lng: 35.21356 },
        { name: "שוק מחנה יהודה", lat: 31.78560, lng: 35.21130 },
        { name: "תחנת הטורים", lat: 31.78700, lng: 35.20880 },
        { name: "התחנה המרכזית", lat: 31.78880, lng: 35.20330 },
        { name: "גשר המיתרים", lat: 31.79060, lng: 35.20170 }
    ];
    const STORY_FRAC = [0.54,0.12,0.33,0.83,0.70,0.27,0.48,0.90,0.20,0.42,0.22,0.20,0.55,0.50,0.43,0.205,0.225,0.19,0.72,0.60,0.17,0.88,0.62,0.415,0.72,0.55,0.425,0.195,0.23,0.98,0.165,0.38,0.185,0.20,0.19,0.15];

    function jaffaPointAt(t) {
        t = Math.max(0, Math.min(1, t));
        const segs = []; let total = 0;
        for (let i = 1; i < JAFFA_PATH.length; i++) {
            const d = Math.hypot(JAFFA_PATH[i][0] - JAFFA_PATH[i-1][0], JAFFA_PATH[i][1] - JAFFA_PATH[i-1][1]);
            segs.push(d); total += d;
        }
        let target = t * total, acc = 0;
        for (let i = 1; i < JAFFA_PATH.length; i++) {
            if (acc + segs[i-1] >= target) {
                const f = (target - acc) / (segs[i-1] || 1e-9);
                return [JAFFA_PATH[i-1][0] + f*(JAFFA_PATH[i][0]-JAFFA_PATH[i-1][0]), JAFFA_PATH[i-1][1] + f*(JAFFA_PATH[i][1]-JAFFA_PATH[i-1][1])];
            }
            acc += segs[i-1];
        }
        return JAFFA_PATH[JAFFA_PATH.length - 1];
    }

    let leafletMap = null, baseLight = null, baseDark = null, satLayer = null, leafStoryMarkers = [];

    function initLeaflet() {
        if (leafletMap) { try { leafletMap.remove(); } catch (e) {} leafletMap = null; }
        leafletMap = L.map('leaflet-map', { zoomControl: false, attributionControl: false }).setView([31.7855, 35.214], 15);
        baseLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 });
        baseDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 });
        satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 });
        (document.body.classList.contains('night') ? baseDark : baseLight).addTo(leafletMap);

        // תוויות מקומות — בציר מקביל מתחת לנקודות (היסט דרומה כדי שלא יוסתרו)
        LANDMARKS_LL.forEach(lm => {
            const icon = L.divIcon({ className: 'leaflet-place', html: `<span>${lm.name}</span>`, iconSize: [0, 0] });
            L.marker([lm.lat, lm.lng], { icon, interactive: false, keyboard: false }).addTo(leafletMap);
        });

        buildMapControls();
        leafletMap.fitBounds(L.latLngBounds(JAFFA_PATH), { padding: [60, 60] });
        setTimeout(() => leafletMap.invalidateSize(), 80);
    }

    function buildMapControls() {
        const panel = document.createElement('div'); panel.className = 'map-ctrl';
        panel.innerHTML = `
            <div class="mc-group mc-zoom">
                <button type="button" id="lz-in">+</button>
                <button type="button" id="lz-out">−</button>
            </div>
            <div class="mc-group mc-view">
                <button type="button" class="mv-map active">[ מפה ]</button>
                <button type="button" class="mv-sat">[ לוויין ]</button>
            </div>`;
        archiveContainer.appendChild(panel);
        const mapEl = document.getElementById('leaflet-map');
        panel.querySelector('#lz-in').addEventListener('click', () => leafletMap.zoomIn());
        panel.querySelector('#lz-out').addEventListener('click', () => leafletMap.zoomOut());
        const mvMap = panel.querySelector('.mv-map'), mvSat = panel.querySelector('.mv-sat');
        mvMap.addEventListener('click', () => {
            if (leafletMap.hasLayer(satLayer)) leafletMap.removeLayer(satLayer);
            const base = document.body.classList.contains('night') ? baseDark : baseLight;
            if (!leafletMap.hasLayer(base)) base.addTo(leafletMap);
            mapEl.classList.remove('sat-active');
            mvMap.classList.add('active'); mvSat.classList.remove('active');
        });
        mvSat.addEventListener('click', () => {
            [baseLight, baseDark].forEach(b => { if (leafletMap.hasLayer(b)) leafletMap.removeLayer(b); });
            if (!leafletMap.hasLayer(satLayer)) satLayer.addTo(leafletMap);
            mapEl.classList.add('sat-active');
            mvSat.classList.add('active'); mvMap.classList.remove('active');
        });

        // הסתרת כפתורי המפה כשפתוח סיפור; החזרה בסגירה / חזרה למפה
        leafletMap.on('popupopen', () => { panel.style.display = 'none'; });
        leafletMap.on('popupclose', () => { panel.style.display = ''; });
    }

    function storyPopupHTML(story) {
        return `
            <div class="sticker-surface">${mediaTag(story, 'display:block;width:100%;height:120px;object-fit:cover;')}</div>
            <div class="lp-body">
              <div class="collage-text">
                <div class="story-text">${story.text}</div>
                <div class="story-meta"><span class="story-author">${story.name}</span>${story.age ? ', ' + story.age : ''} [ ${story.location} | ${story.year || '?'} ]</div>
                <div class="story-tags">${generateTagsHTML(story.emotions)}</div>
              </div>
            </div>`;
    }

    function updateMapMarkers(list) {
        leafStoryMarkers.forEach(m => m.remove());
        leafStoryMarkers = [];
        list.forEach(story => {
            const idx = stories.indexOf(story);
            let t = STORY_FRAC[idx]; if (t == null) return;
            t += ((idx % 5) - 2) * 0.004;   // פיזור קטן לאורך הציר עצמו (נשאר על הקו)
            const ll = jaffaPointAt(t);
            const color = (activeEmotion && HE_EMO_COLOR[activeEmotion]) ? HE_EMO_COLOR[activeEmotion] : dotColor(story);
            const icon = L.divIcon({ className: 'leaflet-emodot', html: `<span style="background:${color}"></span>`, iconSize: [18, 18], iconAnchor: [9, 9] });
            const m = L.marker(ll, { icon }).addTo(leafletMap);
            const heEmo = activeEmotion ? activeEmotion : ((story.emotions[0] || '').split('|')[1] || '').trim();
            if (heEmo) m.bindTooltip(heEmo, { direction: 'top', offset: [0, -6], className: 'emo-tooltip' });
            m.bindPopup(storyPopupHTML(story), { maxWidth: 250, minWidth: 210, className: 'story-leaflet-popup' });
            leafStoryMarkers.push(m);
        });
    }

    function renderYaffoStreet(storiesArray) {
        if (!archiveContainer) return;
        archiveContainer.className = 'yaffo-street-mode';
        document.body.classList.add('geo-mode');
        if (typeof L === 'undefined') { archiveContainer.innerHTML = '<div style="padding:8rem 3rem;font-family:monospace;">לא ניתן לטעון את המפה כרגע.</div>'; return; }
        // יוצרים את המפה רק במעבר-מצב; בחיפוש מעדכנים נקודות בלבד (בלי טעינת אריחים מחדש)
        if (!leafletMap || !document.getElementById('leaflet-map')) {
            archiveContainer.innerHTML = '<div id="leaflet-map"></div>';
            initLeaflet();
        }
        updateMapMarkers(storiesArray);
    }

    // --- 5. פונקציית רינדור (רגעים יחידים) ---
    let currentSingleIndex = 0;
    function renderSingleStory(index) {
        const story = currentSingleList[index];
        if (!story) return;
        archiveContainer.className = 'single-mode';
        archiveContainer.innerHTML = `
            <div class="nav-arrow arrow-right" onclick="changeStory(-1)">⟨</div>
            <div class="single-story-view">
                ${mediaTag(story, 'max-width:70%;height:auto;object-fit:contain;')}
                <div class="single-info-box">
                    <div class="story-text">${story.text}</div>
                    <div class="story-meta">
                        <span class="story-author">${story.name}</span> ${story.age ? ', ' + story.age : ''}
                        <div class="story-location">[ ${story.location} | ${story.year || '?'} ]</div>
                    </div>
                    <div class="story-tags">
                        ${generateTagsHTML(story.emotions)}
                    </div>
                </div>
            </div>
            <div class="nav-arrow arrow-left" onclick="changeStory(1)">⟩</div>
        `;
    }

    window.changeStory = (dir) => {
        if (!currentSingleList.length) return;
        currentSingleIndex = (currentSingleIndex + dir + currentSingleList.length) % currentSingleList.length;
        renderSingleStory(currentSingleIndex);
    };

    function closeFullscreenMode() {
        const overlay = document.getElementById('fullscreen-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    // --- חלון סיפור מלא (נפתח בלחיצה על סיפור) ---
    const storyOverlay = document.getElementById('story-overlay');
    const soContent = storyOverlay ? storyOverlay.querySelector('.so-content') : null;
    let fullList = [], fullIndex = 0;

    function renderStoryFull() {
        const story = fullList[fullIndex];
        if (!story || !soContent) return;
        soContent.innerHTML = `
            <div class="so-media-wrap sticker-surface">${mediaTag(story, 'width:100%;max-height:80vh;object-fit:contain;display:block;')}</div>
            <div class="so-info">
                <div class="story-text">${story.text}</div>
                <div class="story-meta"><span class="story-author">${story.name}</span>${story.age ? ', ' + story.age : ''}
                    <div class="story-location">[ ${story.location} | ${story.year || '?'} ]</div></div>
                <div class="story-tags">${generateTagsHTML(story.emotions)}</div>
            </div>`;
    }

    function openStoryFull(story) {
        if (!storyOverlay) return;
        fullList = getFilteredStories();
        fullIndex = fullList.indexOf(story);
        if (fullIndex < 0) { fullList = [story]; fullIndex = 0; }
        renderStoryFull();
        storyOverlay.style.display = 'flex';
    }

    window.storyNav = (dir) => {
        if (!fullList.length) return;
        fullIndex = (fullIndex + dir + fullList.length) % fullList.length;
        renderStoryFull();
    };

    if (storyOverlay) {
        storyOverlay.querySelector('.so-close').addEventListener('click', () => { storyOverlay.style.display = 'none'; });
        storyOverlay.querySelector('.so-prev').addEventListener('click', () => window.storyNav(1));
        storyOverlay.querySelector('.so-next').addEventListener('click', () => window.storyNav(-1));
        storyOverlay.addEventListener('click', (e) => {
            if (e.target === storyOverlay) storyOverlay.style.display = 'none';   // לחיצה ברקע סוגרת
        });
    }

    // --- מצב תצוגה נוכחי + סינון אחיד (רגש + חיפוש) בכל המצבים ---
    let currentMode = 'map';        // 'map' | 'grid' | 'timeline' | 'single'
    let activeEmotion = null;       // תווית רגש בעברית, או null
    let activeSearch = '';          // טקסט חיפוש חופשי
    let currentSingleList = stories;

    function getFilteredStories() {
        let list = stories.slice();
        if (activeEmotion) {
            list = list.filter(s => (s.emotions || []).some(tag => (tag.split('|')[1] || tag).trim() === activeEmotion));
        }
        if (activeSearch) {
            const t = activeSearch.toLowerCase();
            list = list.filter(s =>
                (s.text || '').toLowerCase().includes(t) ||
                (s.name || '').toLowerCase().includes(t) ||
                (s.location || '').toLowerCase().includes(t)
            );
        }
        return list;
    }

    function renderCurrentMode() {
        closeFullscreenMode();
        const list = getFilteredStories();
        if (currentMode === 'grid') {
            archiveContainer.className = 'grid-mode';
            renderStories(list);
        } else if (currentMode === 'timeline') {
            archiveContainer.className = 'timeline-mode';
            const sorted = [...list].sort((a, b) => (parseInt(a.year) || 9999) - (parseInt(b.year) || 9999));
            renderStories(sorted, true);
        } else {
            renderYaffoStreet(list);
        }
    }

    // --- 7. לוגיקת תפריטים: בחירת מצב תצוגה + סינון לפי רגש ---
    const dropdownContainers = document.querySelectorAll('.dropdown-container');
    dropdownContainers.forEach(container => {
        const navTitle = container.querySelector('.nav-title');
        const defaultLabel = navTitle.textContent;     // שם הקטגוריה הכללי
        container._currentLabel = defaultLabel;

        // הובר חושף תמיד את שם הקטגוריה הכללי; ביציאה חוזר לבחירה הנוכחית (כולל נקודת הצבע)
        container.addEventListener('mouseenter', () => { navTitle.innerHTML = defaultLabel; });
        container.addEventListener('mouseleave', () => { navTitle.innerHTML = container._currentLabel; });

        container.querySelectorAll('.dropdown-menu li').forEach(item => {
            item.addEventListener('click', () => {
                const selected = item.innerText.trim();

                if (selected.includes('ארכיון')) { currentMode = 'grid'; container._currentLabel = `[  ${selected}  ]`; }
                else if (selected.includes('ציר זמן')) { currentMode = 'timeline'; container._currentLabel = `[  ${selected}  ]`; }
                else if (selected.includes('מיקום גיאוגרפי')) { currentMode = 'map'; container._currentLabel = `[  ${selected}  ]`; }
                else {
                    // נלחץ רגש — סינון (לחיצה חוזרת מבטלת). חיווי: שם הרגש + נקודת צבע
                    if (activeEmotion === selected) { activeEmotion = null; container._currentLabel = defaultLabel; }
                    else {
                        activeEmotion = selected;
                        const c = HE_EMO_COLOR[selected] || '#1a1a1a';
                        container._currentLabel = `[ ${selected} <span class="nav-emo-dot" style="background:${c}"></span> ]`;
                    }
                }
                navTitle.innerHTML = container._currentLabel;   // חיווי מיידי
                window.scrollTo(0, 0);
                renderCurrentMode();
            });
        });
    });

    // --- 8. לוגיקת חיפוש חופשי — עובד בכל המצבים ---
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            activeSearch = e.target.value.trim();
            renderCurrentMode();
        });
    }

    const logo = document.querySelector('.logo-img');
    if (logo) {
        logo.addEventListener('mouseenter', () => logo.classList.add('liquefied'));
        logo.addEventListener('mouseleave', () => logo.classList.remove('liquefied'));
    }

    // --- לחיצה על הלוגו פותחת חלון אודות ---
    const aboutOverlay = document.getElementById('about-overlay');
    if (logo && aboutOverlay) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => { aboutOverlay.style.display = 'flex'; });
    }
    if (aboutOverlay) {
        aboutOverlay.addEventListener('click', (e) => { if (e.target === aboutOverlay) aboutOverlay.style.display = 'none'; });
        const ac = aboutOverlay.querySelector('.about-close');
        if (ac) ac.addEventListener('click', () => { aboutOverlay.style.display = 'none'; });
    }

    // --- מצב לילה / יום ---
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('night');
        // החלפת אריחי המפה לכהים/בהירים (אם המפה פתוחה ולא במצב לוויין)
        if (leafletMap && baseLight && baseDark) {
            const mapEl = document.getElementById('leaflet-map');
            if (mapEl && !mapEl.classList.contains('sat-active')) {
                const want = document.body.classList.contains('night') ? baseDark : baseLight;
                const other = document.body.classList.contains('night') ? baseLight : baseDark;
                if (leafletMap.hasLayer(other)) leafletMap.removeLayer(other);
                if (!leafletMap.hasLayer(want)) want.addTo(leafletMap);
            }
        }
    });

    // --- כפתור רענון (טוען מחדש את האתר עם האינטרו) ---
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => location.reload());

    currentMode = 'map';
    renderCurrentMode();

    // --- 10. לוגיקת מסך מלא ---
    const filterItems = document.querySelectorAll('footer .filters li');
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenText = document.getElementById('fullscreen-text');

    let fsIndex = 0;
    let fsMode = 'image';

    const soonOverlay = document.getElementById('soon-overlay');
    function openSoon() { if (soonOverlay) soonOverlay.style.display = 'flex'; }
    if (soonOverlay) {
        soonOverlay.addEventListener('click', (e) => { if (e.target === soonOverlay) soonOverlay.style.display = 'none'; });
        const sc = document.getElementById('soon-close');
        if (sc) sc.addEventListener('click', () => { soonOverlay.style.display = 'none'; });
    }

    filterItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.innerText.includes('רק תמונות')) {
                fsMode = 'image';
                openFullscreenMode();
            } else if (e.target.innerText.includes('רק מילים')) {
                fsMode = 'text';
                openFullscreenMode();
            } else if (e.target.innerText.includes('רק קולות')) {
                openSoon();
            } else {
                closeFullscreenMode();
            }
        });
    });

    function openFullscreenMode() {
        if (!fullscreenOverlay) return;
        fullscreenOverlay.style.display = 'flex';
        updateFullscreenContent();
    }

    function updateFullscreenContent() {
        const story = stories[fsIndex];

        if (fsMode === 'image') {
            if (fullscreenImg) {
                fullscreenImg.style.display = 'block';
                fullscreenImg.src = mediaSrc(story);
                fullscreenImg.alt = story.name;
                fullscreenImg.style.animation = 'none';   // הפעלת אפקט הכניסה מחדש
                void fullscreenImg.offsetWidth;
                fullscreenImg.style.animation = '';
            }
            if (fullscreenText) fullscreenText.style.display = 'none';

        } else if (fsMode === 'text') {
            if (fullscreenImg) fullscreenImg.style.display = 'none';
            if (fullscreenText) {
                fullscreenText.style.display = 'flex';
                fullscreenText.innerHTML = `
                    <div class="fs-text-content">${story.text}</div>
                    <div class="fs-text-meta"><span class="story-author">${story.name}</span>${story.age ? ', ' + story.age : ''} [ ${story.location} | ${story.year || '?'} ]</div>
                    <div class="story-tags">
                        ${generateTagsHTML(story.emotions)}
                    </div>
                `;
            }
        }
    }

    function fsStep(dir) {
        fsIndex = (fsIndex + dir + stories.length) % stories.length;
        updateFullscreenContent();
    }
    if (fullscreenOverlay) {
        const fsPrev = fullscreenOverlay.querySelector('.fs-prev');
        const fsNext = fullscreenOverlay.querySelector('.fs-next');
        if (fsPrev) fsPrev.addEventListener('click', (e) => { e.stopPropagation(); fsStep(1); });
        if (fsNext) fsNext.addEventListener('click', (e) => { e.stopPropagation(); fsStep(-1); });
        fullscreenOverlay.addEventListener('click', (e) => {
            if (e.target.closest('.emotion-tag') || e.target.closest('.fs-arrow')) return;
            fsStep(1);
        });
    }

    // --- 11. הוספת סיפור ע"י משתמש ---
    const EMOTIONS = [
        { key: 'Anger', he: 'כעס' },
        { key: 'Contempt', he: 'בוז' },
        { key: 'Disgust', he: 'גועל (או סלידה)' },
        { key: 'Enjoyment', he: 'הנאה' },
        { key: 'Fear', he: 'פחד' },
        { key: 'Sadness', he: 'עצב' },
        { key: 'Surprise', he: 'הפתעה' }
    ];
    const addOverlay = document.getElementById('add-story-overlay');
    const addForm = document.getElementById('add-story-form');
    const addTrigger = document.querySelector('.add-story');
    const emoPicker = document.getElementById('emo-picker');
    const pickedEmotions = new Set();

    if (emoPicker) {
        EMOTIONS.forEach(em => {
            const d = document.createElement('div');
            d.className = 'emo-pick-dot';
            d.style.backgroundColor = EMO_COLORS[em.key];
            d.title = em.he;
            d.addEventListener('click', () => {
                if (pickedEmotions.has(em.key)) { pickedEmotions.delete(em.key); d.classList.remove('picked'); }
                else { pickedEmotions.add(em.key); d.classList.add('picked'); }
            });
            emoPicker.appendChild(d);
        });
    }

    // הצגת שם הקובץ שנבחר
    const fileInputEl = addForm ? addForm.querySelector('input[type="file"]') : null;
    const fileNameEl = addForm ? addForm.querySelector('.af-file-name') : null;
    if (fileInputEl) {
        fileInputEl.addEventListener('change', () => {
            if (fileNameEl) fileNameEl.textContent = fileInputEl.files[0] ? fileInputEl.files[0].name : '';
        });
    }

    function openAddStory() { if (addOverlay) addOverlay.style.display = 'flex'; }
    function closeAddStory() { if (addOverlay) addOverlay.style.display = 'none'; }

    if (addTrigger) addTrigger.addEventListener('click', openAddStory);
    if (addOverlay) {
        addOverlay.addEventListener('click', (e) => { if (e.target === addOverlay) closeAddStory(); });
        const x = addOverlay.querySelector('.add-close');
        if (x) x.addEventListener('click', closeAddStory);
    }

    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(addForm);
            const name = (fd.get('name') || '').toString().trim();
            const rawText = (fd.get('text') || '').toString().trim();
            if (!name || !rawText) return;

            const emotions = EMOTIONS.filter(em => pickedEmotions.has(em.key)).map(em => `${em.key} | ${em.he}`);
            const story = {
                name: name,
                age: (fd.get('age') || '').toString().trim(),
                location: (fd.get('location') || '').toString().trim() || '?',
                year: (fd.get('year') || '').toString().trim() || '?',
                text: '״' + rawText.replace(/^[״"]+|[״"]+$/g, '') + '״',
                emotions: emotions
            };

            const fileInput = addForm.querySelector('input[type="file"]');
            const file = fileInput && fileInput.files[0];

            addForm.reset();
            if (fileNameEl) fileNameEl.textContent = '';
            pickedEmotions.clear();
            emoPicker.querySelectorAll('.emo-pick-dot.picked').forEach(d => d.classList.remove('picked'));
            closeAddStory();

            saveStory(story, file);   // נשמר בענן אם מחובר, אחרת מקומית
        });
    }

    // --- 12. שמירה בענן (Firebase) — סיפורים שמשותפים בין כל המבקרים ---
    // >>> אחרי שתפתחי פרויקט Firebase, הדביקי כאן את ההגדרות שלך <<<
    const FIREBASE_CONFIG = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    let db = null, storageRef = null, cloudActive = false;
    const SEED_COUNT = stories.length;   // 36 הסיפורים המקוריים

    function fracFromLocation(loc) {
        loc = (loc || '').toString();
        if (/ציון|משביר|מאפה נאמן|קצפת|קקטוס|מזקקה/.test(loc)) return 0.18 + Math.random() * 0.05;
        if (/דוידקה/.test(loc)) return 0.40 + Math.random() * 0.04;
        if (/שוק|יפו ?1[0-9][0-9]/.test(loc)) return 0.52 + Math.random() * 0.04;
        if (/הטורים/.test(loc)) return 0.70;
        if (/מרכזית/.test(loc)) return 0.86;
        if (/גשר|מיתרים/.test(loc)) return 0.97;
        return 0.15 + Math.random() * 0.75;
    }

    function applyCloudStories(docs) {
        stories.length = SEED_COUNT;
        STORY_FRAC.length = SEED_COUNT;
        docs.forEach(data => {
            stories.push({
                name: data.name || '', age: data.age || '', location: data.location || '?',
                year: data.year || '?', text: data.text || '', emotions: data.emotions || [],
                mediaUrl: data.mediaUrl || null, mediaType: data.mediaType || null
            });
            STORY_FRAC.push(fracFromLocation(data.location || ''));
        });
        renderCurrentMode();
    }

    async function saveStory(story, file) {
        if (cloudActive) {
            try {
                if (file) {
                    const safe = file.name.replace(/[^\w.\-]/g, '_');
                    const ref = storageRef.child('media/' + Date.now() + '_' + safe);
                    await ref.put(file);
                    story.mediaUrl = await ref.getDownloadURL();
                    story.mediaType = file.type.startsWith('video') ? 'video' : 'image';
                }
                story.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await db.collection('stories').add(story);
                // המאזין onSnapshot יעדכן את התצוגה אוטומטית — לכולם
            } catch (err) {
                alert('שמירת הסיפור נכשלה: ' + (err && err.message ? err.message : err));
            }
        } else {
            if (file) { story.mediaUrl = URL.createObjectURL(file); story.mediaType = file.type.startsWith('video') ? 'video' : 'image'; }
            stories.push(story);
            STORY_FRAC.push(fracFromLocation(story.location));
            renderCurrentMode();
        }
    }

    try {
        if (window.firebase && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey.indexOf('YOUR_') !== 0) {
            firebase.initializeApp(FIREBASE_CONFIG);
            db = firebase.firestore();
            storageRef = firebase.storage().ref();
            cloudActive = true;
            db.collection('stories').onSnapshot(
                snap => { const docs = []; snap.forEach(d => docs.push(d.data())); applyCloudStories(docs); },
                err => console.warn('טעינת סיפורים מהענן נכשלה:', err)
            );
        }
    } catch (e) { console.warn('Firebase init failed', e); }

    // --- 13. עמוד נתונים ומסקנות (נוכחות מחקרית) ---
    const HE_STOP = new Set(['של','את','זה','לא','אני','על','עם','גם','כי','אבל','הוא','היא','הם','שלי','מה','יש','לי','לו','לה','ואז','אז','כל','היה','הייתי','כבר','רק','אחרי','כמו','עוד','פעם','ולא','וזה','שם','מאוד','בכל','אנחנו','להם','שלו','שלה','אותי','אותו','אותה','לפני','בין','עד','הזה','הזאת','אחד','אחת','זאת','הכי','ממש','קצת','יותר','כזה','כזאת','אם','או','כדי','איך','מי','לך','אתה','וגם','הכל','כן','אין','לכם','שלנו','אבל','הייתה','להיות','כשהייתי']);
    const GENDER = { 'אביגיל':'f','איצ׳ה':'m','אליה':'f','אלישע':'m','דן':'m','הדס':'f','ולאד':'m','זיו':'m','חן':'f','טל':'m','יסמין':'f','ירדן':'f','לארה':'f','לידיה':'f','ליסה':'f','מיכאל':'m','מקס':'m','נגה':'f','נדב':'m','נועה':'f','עומר':'m','שי':'m','שירי':'f','שלי':'f','שלמה':'m','שרית':'f' };
    function guessGender(name) {
        const first = (name || '').toString().trim().split(/\s+/)[0];
        if (GENDER[first]) return GENDER[first];
        return /(ה|ת|ית)$/.test(first) ? 'f' : 'm';
    }
    const txtOf = s => (s.text || '').toString();
    const countRe = (list, re) => list.filter(s => re.test(txtOf(s))).length;

    function computeInsights() {
        const list = stories, N = list.length;
        const corpus = list.map(txtOf).join(' ');
        const emoCount = {};
        list.forEach(s => (s.emotions || []).forEach(t => { const he = (t.split('|')[1] || '').trim(); if (he) emoCount[he] = (emoCount[he] || 0) + 1; }));
        const words = {};
        corpus.replace(/[^֐-׿\s]/g, ' ').split(/\s+/).forEach(w => { w = w.trim(); if (w.length >= 3 && !HE_STOP.has(w)) words[w] = (words[w] || 0) + 1; });
        const topWords = Object.entries(words).sort((a, b) => b[1] - a[1]).slice(0, 12);
        const themes = [
            { name: 'רכבת ומסילה', n: countRe(list, /רכבת|מסיל|פסים|תחנת|תחנה מרכזית/) },
            { name: 'דת ואמונה', n: countRe(list, /חרד|דתי|כיפה|ברוך השם|חינה|ימים נוראים|להב|בית כנסת|נוצרי|מתפלל|ישיבה|שבת/) },
            { name: 'אלכוהול וסמים', n: countRe(list, /שיכור|שתוי|מסטול|סמים|אמדי|קטמין|בירה|שתיתי|דלוק|וודקה|אלכוהול|משתכר|שתינו/) },
            { name: 'משטרה ושוטרים', n: countRe(list, /שוטר|משטרה|מאבטח|מג״ב|מגבניק/) },
            { name: 'ריצה ובריחה', n: countRe(list, /רץ |רצתי|רצנו|בורח|רודף|רדפ|לברוח|רודפת/) },
            { name: 'אוכל', n: countRe(list, /בורקס|פלאפל|צ׳יפס|צ'יפס|קרפ|קולה|תפוחי אדמה|קצפת|מאפה/) },
            { name: 'עירום ותחתונים', n: countRe(list, /עירום|תחתונים|ציצי/) },
            { name: 'אלימות ומכות', n: countRe(list, /הרביצ|מכות|בעיט|מכה |אלימ|הכה|מרביץ|רבו /) },
            { name: 'מין והטרדה', n: countRe(list, /SEX|זונה|שרמוט|ציצי|הטרד|נשיק/) },
            { name: 'כסף וגניבה', n: countRe(list, /גנב|כסף|שקל|שילמ|לשלם|גניב|כספומט/) },
            { name: 'אהבה וחיבוק', n: countRe(list, /אהבה|חיבוק|התאהב|נשיק|אוהב/) },
            { name: 'קללות וצעקות', n: countRe(list, /צעק|צרח|בן זונה|מפגר|יא /) },
            { name: 'בעלי חיים', n: countRe(list, /עורב|כלב|חתול|ציפור|עכבר|ג׳וק|מקק|כינור/) },
            { name: 'ילדים ותינוקות', n: countRe(list, /ילד|תינוק|עגלה/) },
            { name: 'מזג אוויר', n: countRe(list, /שלג|גשם|חורף|שרב|זריחה/) },
            { name: 'אופניים ותחבורה', n: countRe(list, /אופניים|מונית|אוטובוס|קורקינט/) },
            { name: 'זרים ותיירים', n: countRe(list, /תייר|יפני|הודי/) }
        ].filter(t => t.n > 0).sort((a, b) => b.n - a.n).slice(0, 12);
        const night = countRe(list, /לילה|לפנות בוקר|חצות|בלילה/);
        const day = countRe(list, /בבוקר|בוקר|צהריים|זריחה|ביום/);
        let f = 0, m = 0; list.forEach(s => (guessGender(s.name) === 'f' ? f++ : m++));
        const years = list.map(s => parseInt(s.year)).filter(y => !isNaN(y));
        const minY = years.length ? Math.min(...years) : null, maxY = years.length ? Math.max(...years) : null;
        const ages = list.map(s => parseInt(s.age)).filter(a => !isNaN(a) && a > 0 && a < 120);
        const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : null;
        const minAge = ages.length ? Math.min(...ages) : null, maxAge = ages.length ? Math.max(...ages) : null;
        const locCount = {}; list.forEach(s => { const l = (s.location || '').trim(); if (l && l !== '?') locCount[l] = (locCount[l] || 0) + 1; });
        const topLoc = Object.entries(locCount).sort((a, b) => b[1] - a[1])[0];
        const distinctLoc = Object.keys(locCount).length;
        const lens = list.map(s => ({ s, len: txtOf(s).replace(/\s+/g, ' ').trim().length })).filter(o => o.len > 1).sort((a, b) => b.len - a.len);
        const totalWords = corpus.split(/\s+/).filter(Boolean).length;
        let mostEmo = null; list.forEach(s => { if (!mostEmo || (s.emotions || []).length > (mostEmo.emotions || []).length) mostEmo = s; });
        const avgEmo = list.reduce((a, s) => a + (s.emotions || []).length, 0) / (N || 1);
        const totalTags = list.reduce((a, s) => a + (s.emotions || []).length, 0);
        const neutral = list.filter(s => !(s.emotions || []).length).length;
        const topEmotion = Object.entries(emoCount).sort((a, b) => b[1] - a[1])[0];
        const hours = (corpus.match(/\d{1,2}(?:[:.]\d{2})?\s*(?:בבוקר|בלילה|לפנות בוקר|בערב|בצהריים)/g) || []);
        return { N, emoCount, topWords, themes, night, day, f, m, minY, maxY, avgAge, minAge, maxAge, topLoc, distinctLoc, longest: lens[0], shortest: lens[lens.length - 1], totalWords, mostEmo, avgEmo, totalTags, neutral, topEmotion, hours };
    }

    const dataOverlay = document.getElementById('data-overlay');
    const dataContent = document.getElementById('data-content');

    function metric(num, label) { return `<div class="di-metric"><div class="di-num">${num}</div><div class="di-label">${label}</div></div>`; }

    function renderInsights() {
        if (!dataContent) return;
        const d = computeInsights();
        const emoOrder = ['כעס', 'בוז', 'גועל (או סלידה)', 'הנאה', 'פחד', 'עצב', 'הפתעה'];
        const emoHTML = emoOrder.map(he => {
            const c = HE_EMO_COLOR[he] || '#1a1a1a', n = d.emoCount[he] || 0;
            return `<div class="di-emo"><span class="di-emo-dot" style="background:${c}"></span><span class="di-emo-n">${n}</span><span class="di-emo-name">${he.split(' ')[0]}</span></div>`;
        }).join('');
        const tMax = Math.max(1, ...d.themes.map(t => t.n));
        const themesHTML = d.themes.map(t => `<div class="di-bar-row"><span class="di-bar-label">${t.name}</span><span class="di-bar"><span class="di-bar-fill" style="width:${Math.round(t.n / tMax * 100)}%"></span></span><span class="di-bar-n">${t.n}</span></div>`).join('');
        const wordsHTML = d.topWords.map(([w, n]) => `<span class="di-word">${w} <b>${n}</b></span>`).join('');
        const topLocTxt = d.topLoc ? `${d.topLoc[0]} <b>(${d.topLoc[1]})</b>` : '—';

        dataContent.innerHTML = `
            <div class="data-close">✕</div>
            
            <div class="di-title">[ מסקנות ]</div>
            <div class="di-sub">מה מספרים ${d.N} הרגעים שנאספו לאורך רחוב יפו</div>

            <div class="di-metrics">
                ${metric(d.N, 'רגעים בארכיון')}
                ${metric(d.totalWords.toLocaleString('he'), 'מילים בסך הכל')}
                ${metric(d.avgEmo.toFixed(1), 'רגשות בממוצע לסיפור')}
                ${metric(d.topEmotion ? d.topEmotion[0].split(' ')[0] : '—', 'הרגש השכיח ביותר')}
            </div>

            <div class="di-section">
                <div class="di-h">[ ספקטרום הרגשות ]</div>
                <div class="di-emos">${emoHTML}</div>
            </div>

            <div class="di-two">
                <div class="di-section">
                    <div class="di-h">[ יום מול לילה ]</div>
                    <div class="di-vs"><div><div class="di-num">${d.night}</div><div class="di-label">לילה</div></div><div class="di-vs-x">/</div><div><div class="di-num">${d.day}</div><div class="di-label">יום</div></div></div>
                </div>
                <div class="di-section">
                    <div class="di-h">[ נשים מול גברים ]</div>
                    <div class="di-vs"><div><div class="di-num">${d.f}</div><div class="di-label">נשים</div></div><div class="di-vs-x">/</div><div><div class="di-num">${d.m}</div><div class="di-label">גברים</div></div></div>
                </div>
            </div>

            <div class="di-section">
                <div class="di-h">[ נושאים חוזרים ]</div>
                <div class="di-bars">${themesHTML}</div>
            </div>

            <div class="di-two">
                <div class="di-section">
                    <div class="di-h">[ ציר הזמן והמקום ]</div>
                    <p class="di-p">הרגעים משתרעים בין <b>${d.minY || '?'}</b> ל‑<b>${d.maxY || '?'}</b>.</p>
                    <p class="di-p">המקום הכי מסופר: ${topLocTxt}.</p>
                    <p class="di-p"><b>${d.distinctLoc}</b> מיקומים שונים לאורך הרחוב.</p>
                    <p class="di-p">שעות שהוזכרו: ${d.hours.length ? d.hours.slice(0, 6).map(h => '[ ' + h.trim() + ' ]').join(' ') : '—'}</p>
                </div>
                <div class="di-section">
                    <div class="di-h">[ הגילאים ]</div>
                    <p class="di-p">גיל ממוצע של המספרים/ות: <b>${d.avgAge || '—'}</b>.</p>
                    <p class="di-p">הצעיר/ה ביותר: <b>${d.minAge || '—'}</b> · המבוגר/ת ביותר: <b>${d.maxAge || '—'}</b>.</p>
                </div>
            </div>

            <div class="di-two">
                <div class="di-section">
                    <div class="di-h">[ קצוות ]</div>
                    <p class="di-p">הסיפור הכי רגשי: <b>${d.mostEmo ? d.mostEmo.name : '—'}</b> (${d.mostEmo ? (d.mostEmo.emotions || []).length : 0} רגשות).</p>
                    <p class="di-p">הכי ארוך: <b>${d.longest ? d.longest.s.name : '—'}</b> · הכי קצר: <b>${d.shortest ? d.shortest.s.name : '—'}</b>.</p>
                </div>
                <div class="di-section">
                    <div class="di-h">[ רגשות במספרים ]</div>
                    <p class="di-p">סה״כ תגיות רגש: <b>${d.totalTags}</b>.</p>
                    <p class="di-p">סיפורים בלי אף רגש (ניטרליים): <b>${d.neutral}</b>.</p>
                </div>
            </div>

            <div class="di-section">
                <div class="di-h">[ המילים שחוזרות הכי הרבה ]</div>
                <div class="di-words">${wordsHTML}</div>
            </div>
        `;
    }

    const dataBtn = document.getElementById('dataBtn');
    if (dataBtn && dataOverlay) {
        dataBtn.addEventListener('click', () => { renderInsights(); dataOverlay.style.display = 'flex'; });
        dataOverlay.addEventListener('click', (e) => {
            if (e.target === dataOverlay || e.target.closest('.data-close')) dataOverlay.style.display = 'none';
        });
    }

});
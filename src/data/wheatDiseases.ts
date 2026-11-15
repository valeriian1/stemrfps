import type { Disease } from "../domain/wheat";

export const diseases: Disease[] = [
  {
    id: "brown_rust",
    summary: "Розсіяні бурі пустули на поверхні листка.",
    observations: [
      "Порівняйте розташування пустул на кількох листках: для описаних ознак важлива їхня розсіяність.",
      "Окремо сфотографуйте верхню та нижню поверхні листка й зафіксуйте колір утворень.",
      "Під час повторного огляду відзначте появу нових ділянок із симптомами.",
    ],
    nameUk: "Бура іржа",
    scientificName: "Puccinia triticina",
    symptoms:
      "Дрібні оранжево-бурі пустули, розсіяні переважно на верхній поверхні листка. Згодом можуть з’являтися темні пустули.",
    generalActions:
      "Огляньте кілька рослин і зафіксуйте, які листки мають ознаки. Порівняйте з жовтою іржею. Подальший захист обирають із фахівцем з урахуванням фази розвитку та місцевих умов.",
    sources: [
      {
        title:
          "Oklahoma State University: Identifying Rust Diseases of Wheat and Barley",
        url: "https://extension.okstate.edu/fact-sheets/identifying-rust-diseases-of-wheat-and-barley",
      },
    ],
  },
  {
    id: "yellow_rust",
    summary: "Жовті пустули утворюють смуги вздовж листка.",
    observations: [
      "Перевірте, чи утворюють жовті або оранжево-жовті пустули поздовжні ряди.",
      "Порівняйте з бурою іржею, для якої в довіднику описано розсіяні пустули.",
      "Збережіть загальний вигляд рослини та крупний план смуг для подальшого порівняння.",
    ],
    nameUk: "Жовта іржа",
    scientificName: "Puccinia striiformis",
    symptoms:
      "Жовті або оранжево-жовті пустули, часто розміщені поздовжніми смугами вздовж жилок листка.",
    generalActions:
      "Перевірте сусідні рослини, зробіть чіткі фото обох боків листка й повторіть обстеження. За наростання симптомів зверніться до агронома.",
    sources: [
      {
        title:
          "Oklahoma State University: Identifying Rust Diseases of Wheat and Barley",
        url: "https://extension.okstate.edu/fact-sheets/identifying-rust-diseases-of-wheat-and-barley",
      },
    ],
  },
  {
    id: "septoria",
    summary: "Видовжені плями з дрібними темними крапками.",
    observations: [
      "Огляньте межі плям і перевірте, чи помітні всередині дрібні темні утворення.",
      "Зробіть фото всього листка та окремий крупний план плями за природного освітлення.",
      "Зафіксуйте, на яких листках є плями, і порівняйте їхній вигляд під час наступного огляду.",
    ],
    nameUk: "Септоріоз листя",
    scientificName: "Zymoseptoria tritici",
    symptoms:
      "Видовжені некротичні плями; у тканині можуть бути помітні дрібні темні плодові тіла. Самої наявності плям недостатньо для підтвердження.",
    generalActions:
      "Зробіть крупний план плями та фото всього листка. Зафіксуйте дату, стан інших листків і повторіть спостереження. Для підтвердження використайте фахову діагностику.",
    sources: [
      {
        title: "AHDB: Septoria tritici in winter wheat",
        url: "https://ahdb.org.uk/knowledge-library/septoria-tritici-in-winter-wheat",
      },
    ],
  },
  {
    id: "powdery_mildew",
    summary: "Білий борошнистий наліт на листках і стеблах.",
    observations: [
      "Огляньте нижні й верхні листки та стебла, щоб відмітити розташування нальоту.",
      "Збережіть крупний план його поверхні та загальний вигляд ураженого листка.",
      "Під час наступного огляду порівняйте колір, щільність і площу видимого нальоту.",
    ],
    nameUk: "Борошниста роса",
    scientificName: "Blumeria graminis f. sp. tritici",
    symptoms:
      "Білий борошнистий наліт на листках і стеблах, який із часом ущільнюється й може темніти.",
    generalActions:
      "Огляньте нижні та верхні листки, зафіксуйте розташування нальоту. Порівняйте з довідковим описом і за потреби зверніться до фахівця перед вибором заходів захисту.",
    sources: [
      {
        title: "AHDB: Management of powdery mildew in cereals",
        url: "https://ahdb.org.uk/knowledge-library/management-of-powdery-mildew-in-cereals",
      },
    ],
  },
  {
    id: "stem_rust",
    nameUk: "Стеблова іржа",
    scientificName: "Puccinia graminis f. sp. tritici",
    summary: "Видовжені іржаво-бурі пустули на стеблах і піхвах листків.",
    symptoms:
      "Пустули розривають покривну тканину, мають нерівні краї та можуть зливатися. Наприкінці сезону уражені ділянки темніють.",
    observations: [
      "Огляньте стебла, піхви та обидва боки листків.",
      "Зафіксуйте колір і форму пустул крупним планом.",
    ],
    generalActions:
      "Зробіть фото ураженої частини та загального вигляду рослини. Зафіксуйте дату й поширення симптомів. Для підтвердження причини та вибору заходів зверніться до агронома.",
    sources: [
      {
        title: "Oklahoma State University: Stem rust",
        url: "https://extension.okstate.edu/fact-sheets/identifying-rust-diseases-of-wheat-and-barley",
      },
    ],
  },
  {
    id: "tan_spot",
    nameUk: "Піренофороз",
    scientificName: "Pyrenophora tritici-repentis",
    summary: "Овальні бурі плями з жовтим ореолом на листках.",
    symptoms:
      "У центрі плями часто помітна темна крапка. Плями збільшуються, зливаються, тканина листка відмирає. Симптоми можуть нагадувати септоріоз.",
    observations: [
      "Порівняйте центр плями та жовту облямівку.",
      "Сфотографуйте кілька листків із різним ступенем ураження.",
    ],
    generalActions:
      "Зробіть фото ураженої частини та загального вигляду рослини. Зафіксуйте дату й поширення симптомів. Для підтвердження причини та вибору заходів зверніться до агронома.",
    sources: [
      {
        title: "AHDB: management of tan spot disease in wheat barley and rye",
        url: "https://ahdb.org.uk/knowledge-library/management-of-tan-spot-disease-in-wheat-barley-and-rye",
      },
    ],
  },
  {
    id: "fusarium_head_blight",
    nameUk: "Фузаріоз колоса",
    scientificName: "Fusarium spp.",
    summary: "Передчасне побіління окремих колосків або частини колоса.",
    symptoms:
      "На ще зеленому колосі з’являються знебарвлені ділянки. За вологої погоди можливий рожевий або оранжевий наліт. Зерно може бути щуплим.",
    observations: [
      "Огляньте весь колос і межу між зеленою та побілілою частинами.",
      "Зафіксуйте наліт і фазу розвитку рослини; фото листка для огляду колоса недостатньо.",
    ],
    generalActions:
      "Зробіть фото ураженої частини та загального вигляду рослини. Зафіксуйте дату й поширення симптомів. Для підтвердження причини та вибору заходів зверніться до агронома.",
    sources: [
      {
        title: "AHDB: fusarium and microdochium in cereals",
        url: "https://ahdb.org.uk/knowledge-library/fusarium-and-microdochium-in-cereals",
      },
    ],
  },
  {
    id: "loose_smut",
    nameUk: "Летюча сажка",
    scientificName: "Ustilago tritici",
    summary: "Замість зерна в колосі утворюється чорна спорова маса.",
    symptoms:
      "Уражені колоски руйнуються. Спори розлітаються, залишаючи оголений стрижень колоса. Ознаки найкраще помітні під час колосіння.",
    observations: [
      "Огляньте колоски та стрижень колоса.",
      "Порівняйте уражені та зовні здорові колоски на сусідніх рослинах.",
    ],
    generalActions:
      "Зробіть фото ураженої частини та загального вигляду рослини. Зафіксуйте дату й поширення симптомів. Для підтвердження причини та вибору заходів зверніться до агронома.",
    sources: [
      {
        title:
          "AHDB: loose smut in cereals the importance of clean or fungicide treated seed",
        url: "https://ahdb.org.uk/knowledge-library/loose-smut-in-cereals-the-importance-of-clean-or-fungicide-treated-seed",
      },
    ],
  },
  {
    id: "eyespot",
    nameUk: "Церкоспорельоз",
    scientificName: "Oculimacula yallundae / Oculimacula acuformis",
    summary: "Овальні плями у формі вічка біля основи стебла.",
    symptoms:
      "Плями мають світлий центр і темнішу розмиту облямівку. Ураження зазвичай розташоване нижче першого вузла. Ослаблені стебла можуть вилягати.",
    observations: [
      "Огляньте основу стебла, обережно відгорнувши зовнішні піхви.",
      "Зафіксуйте форму плями та наявність вилягання.",
    ],
    generalActions:
      "Зробіть фото ураженої частини та загального вигляду рослини. Зафіксуйте дату й поширення симптомів. Для підтвердження причини та вибору заходів зверніться до агронома.",
    sources: [
      {
        title: "AHDB: eyespot in cereals and risk assessment in wheat",
        url: "https://ahdb.org.uk/knowledge-library/eyespot-in-cereals-and-risk-assessment-in-wheat",
      },
    ],
  },
  {
    id: "take_all",
    nameUk: "Офіобольоз",
    scientificName: "Gaeumannomyces tritici",
    summary: "Почорніння коренів і передчасне побіління колосся.",
    symptoms:
      "Уражені рослини можуть відставати в рості та утворювати осередки в посіві. Корені темніють, біля основи стебла можливий чорний наліт.",
    observations: [
      "Обережно викопайте рослину та огляньте очищені від ґрунту корені.",
      "Порівняйте корені та колосся рослин усередині й поза осередком.",
    ],
    generalActions:
      "Зробіть фото ураженої частини та загального вигляду рослини. Зафіксуйте дату й поширення симптомів. Для підтвердження причини та вибору заходів зверніться до агронома.",
    sources: [
      {
        title: "AHDB: take all disease in cereals prevent detect control",
        url: "https://ahdb.org.uk/knowledge-library/take-all-disease-in-cereals-prevent-detect-control",
      },
    ],
  },
];
export const getDisease = (id: string) => diseases.find((d) => d.id === id);

var isRNFLMarkdown = false;

function getParam(a) {
    var d = location.search.substr(location.search.indexOf("?") + 1),
        c = "", b; d = d.split("&"); for (b = 0; b < d.length; b++) {
        temp = d[b].split("="); if ([temp[0]] == a) { c = temp[1] }
        }
        return c
}
function setCookie(a, d, b) {
    var e = new Date(), c; e.setDate(e.getDate() + b); c = escape(d) + ((b == null) ? "" : "; expires=" + e.toUTCString());
    document.cookie = a + "=" + c
}
function set_game_cookie(c, a) {
    var b = "-" + c.join("") + "_"; a = (a == undefined) ? false : a;
    if (!a) {
        setCookie(games_cookie_name, b, 999)
    } set_visible_cookie(b)
}
function set_visible_cookie(a) {
    document.getElementById("save_string").innerHTML = "http://stakehousesports.com/nflschedulepicker/?a=" + a
}
function getCookie(b) {
    var c, a, e, d = document.cookie.split(";");
    for (c = 0; c < d.length; c++) {
        a = d[c].substr(0, d[c].indexOf("="));
        e = d[c].substr(d[c].indexOf("=") + 1);
        a = a.replace(/^\s+|\s+$/g, "");
        if (a == b) {
            return unescape(e);
        }
    }
}
var conferenceRankingObject = {};
var games_cookie_name = "NFL2023",
    cookie_letter_length = 86,
    cookie64_re = /-[A-Za-z0-9\-_]{86}_?/,
    base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    number_of_weeks = 18,
    week_lists = [
        /*1*/["BUF-LAR","NE-MIA","CLE-CAR","JAC-WAS","PIT-CIN","NO-ATL","PHI-DET","SF-CHI","IND-HOU","BAL-NYJ","KC-ARI","GB-MIN","NYG-TEN","LV-LAC","TB-DAL","DEN-SEA"],
        /*2*/["LAC-KC","NYJ-CLE","WAS-DET","IND-JAC","MIA-BAL","TB-NO","NE-PIT","CAR-NYG","ATL-LAR","SEA-SF","CIN-DAL","ARI-LV","HOU-DEN","CHI-GB","TEN-BUF","MIN-PHI"],
        /*3*/["PIT-CLE","DET-MIN","NO-CAR","HOU-CHI","PHI-WAS","BUF-MIA","CIN-NYJ","BAL-NE","LV-TEN","KC-IND","JAC-LAC","GB-TB","ATL-SEA","LAR-ARI","SF-DEN","DAL-NYG"],
        /*4*/["MIA-CIN","MIN-NO","BUF-BAL","WAS-DAL","TEN-IND","CLE-ATL","NYJ-PIT","JAC-PHI","CHI-NYG","LAC-HOU","SEA-DET","ARI-CAR","NE-GB","DEN-LV","KC-TB","LAR-SF"],
        /*5*/["IND-DEN","NYG-GB","LAC-CLE","DET-NE","PIT-BUF","MIA-NYJ","ATL-TB","SEA-NO","HOU-JAC","TEN-WAS","CHI-MIN","SF-CAR","DAL-LAR","PHI-ARI","CIN-BAL","LV-KC"],
        /*6*/["WAS-CHI","BAL-NYG","TB-PIT","JAC-IND","NYJ-GB","CIN-NO","MIN-MIA","SF-ATL","NE-CLE","CAR-LAR","ARI-SEA","BUF-KC","DAL-PHI","DEN-LAC"],
        /*7*/["NO-ARI","IND-TEN","NYG-JAC","GB-WAS","DET-DAL","ATL-CIN","CLE-BAL","TB-CAR","NYJ-DEN","HOU-LV","SEA-LAC","KC-SF","PIT-MIA","CHI-NE"],
        /*8*/["BAL-TB","DEN-JAC","NE-NYJ","CHI-DAL","PIT-PHI","CAR-ATL","LV-NO","MIA-DET","ARI-MIN","TEN-HOU","NYG-SEA","WAS-IND","SF-LAR","GB-BUF","CIN-CLE"],
        /*9*/["PHI-HOU","MIN-WAS","CAR-CIN","LAC-ATL","BUF-NYJ","IND-NE","LV-JAC","MIA-CHI","GB-DET","SEA-ARI","LAR-TB","TEN-KC","BAL-NO"],
        /*10*/["ATL-CAR","SEA-TB","NO-PIT","DEN-TEN","HOU-NYG","DET-CHI","CLE-MIA","JAC-KC","MIN-BUF","IND-LV","DAL-GB","ARI-LAR","LAC-SF","WAS-PHI"],
        /*11*/["TEN-GB","CHI-ATL","WAS-HOU","NYJ-NE","PHI-IND","LAR-NO","DET-NYG","CAR-BAL","CLE-BUF","LV-DEN","DAL-MIN","KC-LAC","CIN-PIT","SF-ARI"],
        /*12*/["BUF-DET","NYG-DAL","NE-MIN","TB-CLE","ATL-WAS","BAL-JAC","CHI-NYJ","DEN-CAR","CIN-TEN","HOU-MIA","LV-SEA","LAC-ARI","LAR-KC","NO-SF","GB-PHI","PIT-IND"],
        /*13*/["BUF-NE","NYJ-MIN","WAS-NYG","PIT-ATL","DEN-BAL","TEN-PHI","GB-CHI","JAC-DET","CLE-HOU","SEA-LAR","MIA-SF","KC-CIN","LAC-LV","IND-DAL","NO-TB"],
        /*14*/["LV-LAR","NYJ-BUF","PHI-NYG","JAC-TEN","MIN-DET","HOU-DAL","CLE-CIN","BAL-PIT","MIA-LAC","TB-SF","CAR-SEA","KC-DEN","NE-ARI"],
        /*15*/["SF-SEA","IND-MIN","BAL-CLE","ATL-NO","MIA-BUF","NYG-WAS","DAL-JAC","DET-NYJ","PHI-CHI","KC-HOU","PIT-CAR","ARI-DEN","TEN-LAC","CIN-TB","NE-LV","LAR-GB"],
        /*16*/["JAC-NYJ","DET-CAR","HOU-TEN","BUF-CHI","CIN-NE","ATL-BAL","NO-CLE","SEA-KC","NYG-MIN","WAS-SF","PHI-DAL","LV-PIT","GB-MIA","DEN-LAR","TB-ARI","LAC-IND"],
        /*17*/["DAL-TEN","CHI-DET","ARI-ATL","PIT-BAL","DEN-KC","CLE-WAS","CAR-TB","IND-NYG","NO-PHI","MIA-NE","JAC-HOU","NYJ-SEA","SF-LV","MIN-GB","LAR-LAC","BUF-CIN"],
        /*18*/["TB-ATL","NE-BUF","CAR-NO","BAL-CIN","MIN-CHI","TEN-JAC","DET-GB","CLE-PIT","ARI-SF","NYG-PHI","LAC-DEN","KC-LV","DAL-WAS","LAR-SEA","NYJ-MIA","HOU-IND"]
    ],
    team_week_lists = {},
    game_list = [],
    game_list_len = 272,
    day_codes =
      "T             NM"  //01
    + "T            NMM"  //02
    + "T             NM"  //03
    + "T             NM"    //04
    + "T             NM"  //05
    + "T           NM"  //06
    + "T           NM"  //07
    + "T            NM"  //08
    + "T          NM"    //09
    + "T           NM"    //10
    + "T           NM"   //11
    + "TTT           NM"  //12
    + "T            NM" //13
    + "T          NM" //14
    + "TZZZZZ        NM" //15
    + "TZZZZZZZZZZZ  NM" //16
    + "T             NM" //17
    + "                " //18
    ,day_explaination = { T: "Thursday game", N: "Sunday Night game", M: "Monday Night game", U: "@ London, UK", C: "@ Toronto, Canada", " ": "Sunday game", Z:"Saturday game" },
    bye_lookup = {
        6: "DET TEN LV HOU",
        7: "BUF LAR MIN PHI",
        8: "KC LAC",
        9: "CLE DAL DEN NYG PIT SF",
        10: "BAL CLE NE NYJ",
        11: "JAC MIA SEA TB",
        13: "ARI CAR",
        14: "ATL CHI GB IND NO WAS"
    },
    foe_lookup =
    {
        ARI: ["KC","LV","LAR","CAR","PHI","SEA","NO","MIN","SEA","LAR","SF","LAC","NE","DEN","TB","ATL","SF"],
        ATL: ["NO","LAR","SEA","CLE","TB","SF","CIN","CAR","LAC","CAR","CHI","WAS","PIT","NO","BAL","ARI","TB"],
        BAL: ["NYJ","MIA","NE","BUF","CIN","NYG","CLE","TB","NO","CAR","JAC","DEN","PIT","CLE","ATL","PIT","CIN"],
        BUF: ["LAR","TEN","MIA","BAL","PIT","KC","GB","NYJ","MIN","CLE","DET","NE","NYJ","MIA","CHI","CIN","NE"],
        CAR: ["CLE","NYG","NO","ARI","SF","LAR","TB","ATL","CIN","ATL","BAL","DEN","SEA","PIT","DET","TB","NO"],
        CHI: ["SF","GB","HOU","NYG","MIN","WAS","NE","DAL","MIA","DET","ATL","NYJ","GB","PHI","BUF","DET","MIN"],
        CIN: ["PIT","DAL","NYJ","MIA","BAL","NO","ATL","CLE","CAR","PIT","TEN","KC","CLE","TB","NE","BUF","BAL"],
        CLE: ["CAR","NYJ","PIT","ATL","LAC","NE","BAL","CIN","MIA","BUF","TB","HOU","CIN","BAL","NO","WAS","PIT"],
        DAL: ["TB","CIN","NYG","WAS","LAR","PHI","DET","CHI","GB","MIN","NYG","IND","HOU","JAC","PHI","TEN","WAS"],
        DEN: ["SEA","HOU","SF","LV","IND","LAC","NYJ","JAC","TEN","LV","CAR","BAL","KC","ARI","LAR","KC","LAC"],
        DET: ["PHI","WAS","MIN","SEA","NE","DAL","MIA","GB","CHI","NYG","BUF","JAC","MIN","NYJ","CAR","CHI","GB"],
        GB: ["MIN","CHI","TB","NE","NYG","NYJ","WAS","BUF","DET","DAL","TEN","PHI","CHI","LAR","MIA","MIN","DET"],
        HOU: ["IND","DEN","CHI","LAC","JAC","LV","TEN","PHI","NYG","WAS","MIA","CLE","DAL","KC","TEN","JAC","IND"],
        IND: ["HOU","JAC","KC","TEN","DEN","JAC","TEN","WAS","NE","LV","PHI","PIT","DAL","MIN","LAC","NYG","HOU"],
        JAC: ["WAS","IND","LAC","PHI","HOU","IND","NYG","DEN","LV","KC","BAL","DET","TEN","DAL","NYJ","HOU","TEN"],
        KC: ["ARI","LAC","IND","TB","LV","BUF","SF","TEN","JAC","LAC","LAR","CIN","DEN","HOU","SEA","DEN","LV"],
        MIA: ["NE","BAL","BUF","CIN","NYJ","MIN","PIT","DET","CHI","CLE","HOU","SF","LAC","BUF","GB","NE","NYJ"],
        MIN: ["GB","PHI","DET","NO","CHI","MIA","ARI","WAS","BUF","DAL","NE","NYJ","DET","IND","NYG","GB","CHI"],
        NE: ["MIA","PIT","BAL","GB","DET","CLE","CHI","NYJ","IND","NYJ","MIN","BUF","ARI","LV","CIN","MIA","BUF"],
        NO: ["ATL","TB","CAR","MIN","SEA","CIN","ARI","LV","BAL","PIT","LAR","SF","TB","ATL","CLE","PHI","CAR"],
        NYG: ["TEN","CAR","DAL","CHI","GB","BAL","JAC","SEA","HOU","DET","DAL","WAS","PHI","WAS","MIN","IND","PHI"],
        NYJ: ["BAL","CLE","CIN","PIT","MIA","GB","DEN","NE","BUF","NE","CHI","MIN","BUF","DET","JAC","SEA","MIA"],
        LV: ["LAC","ARI","TEN","DEN","KC","HOU","NO","JAC","IND","DEN","SEA","LAC","LAR","NE","PIT","SF","KC"],
        PHI: ["DET","MIN","WAS","JAC","ARI","DAL","PIT","HOU","WAS","IND","GB","TEN","NYG","CHI","DAL","NO","NYG"],
        PIT: ["CIN","NE","CLE","NYJ","BUF","TB","MIA","PHI","NO","CIN","IND","ATL","BAL","CAR","LV","BAL","CLE"],
        LAC: ["LV","KC","JAC","HOU","CLE","DEN","SEA","ATL","SF","KC","ARI","LV","MIA","TEN","IND","LAR","DEN"],
        SEA: ["DEN","SF","ATL","DET","NO","ARI","LAC","NYG","ARI","TB","LV","LAR","CAR","SF","KC","NYJ","LAR"],
        SF: ["CHI","SEA","DEN","LAR","CAR","ATL","KC","LAR","LAC","ARI","NO","MIA","TB","SEA","WAS","LV","ARI"],
        LAR: ["BUF","ATL","ARI","SF","DAL","CAR","SF","TB","ARI","NO","KC","SEA","LV","GB","DEN","LAC","SEA"],
        TB: ["DAL","NO","GB","KC","ATL","PIT","CAR","BAL","LAR","SEA","CLE","NO","SF","CIN","ARI","CAR","ATL"],
        TEN: ["NYG","BUF","LV","IND","WAS","IND","HOU","KC","DEN","GB","CIN","PHI","JAC","LAC","HOU","DAL","JAC"],
        WAS: ["JAC","DET","PHI","DAL","TEN","CHI","GB","IND","MIN","PHI","HOU","ATL","NYG","NYG","SF","CLE","DAL"]
    },
    foe_hash = {
        ARI: { KC: 1,LV: 1,LAR: 1,CAR: 1,PHI: 1,SEA: 1,NO: 1,MIN: 1,SEA: 1,LAR: 1,SF: 1,LAC: 1,NE: 1,DEN: 1,TB: 1,ATL: 1,SF: 1 },
        ATL: { NO: 1,LAR: 1,SEA: 1,CLE: 1,TB: 1,SF: 1,CIN: 1,CAR: 1,LAC: 1,CAR: 1,CHI: 1,WAS: 1,PIT: 1,NO: 1,BAL: 1,ARI: 1,TB: 1 },
        BAL: { NYJ: 1,MIA: 1,NE: 1,BUF: 1,CIN: 1,NYG: 1,CLE: 1,TB: 1,NO: 1,CAR: 1,JAC: 1,DEN: 1,PIT: 1,CLE: 1,ATL: 1,PIT: 1,CIN: 1 },
        BUF: { LAR: 1,TEN: 1,MIA: 1,BAL: 1,PIT: 1,KC: 1,GB: 1,NYJ: 1,MIN: 1,CLE: 1,DET: 1,NE: 1,NYJ: 1,MIA: 1,CHI: 1,CIN: 1,NE: 1 },
        CAR: { CLE: 1,NYG: 1,NO: 1,ARI: 1,SF: 1,LAR: 1,TB: 1,ATL: 1,CIN: 1,ATL: 1,BAL: 1,DEN: 1,SEA: 1,PIT: 1,DET: 1,TB: 1,NO: 1 },
        CHI: { SF: 1,GB: 1,HOU: 1,NYG: 1,MIN: 1,WAS: 1,NE: 1,DAL: 1,MIA: 1,DET: 1,ATL: 1,NYJ: 1,GB: 1,PHI: 1,BUF: 1,DET: 1,MIN: 1 },
        CIN: { PIT: 1,DAL: 1,NYJ: 1,MIA: 1,BAL: 1,NO: 1,ATL: 1,CLE: 1,CAR: 1,PIT: 1,TEN: 1,KC: 1,CLE: 1,TB: 1,NE: 1,BUF: 1,BAL: 1 },
        CLE: { CAR: 1,NYJ: 1,PIT: 1,ATL: 1,LAC: 1,NE: 1,BAL: 1,CIN: 1,MIA: 1,BUF: 1,TB: 1,HOU: 1,CIN: 1,BAL: 1,NO: 1,WAS: 1,PIT: 1 },
        DAL: { TB: 1,CIN: 1,NYG: 1,WAS: 1,LAR: 1,PHI: 1,DET: 1,CHI: 1,GB: 1,MIN: 1,NYG: 1,IND: 1,HOU: 1,JAC: 1,PHI: 1,TEN: 1,WAS: 1 },
        DEN: { SEA: 1,HOU: 1,SF: 1,LV: 1,IND: 1,LAC: 1,NYJ: 1,JAC: 1,TEN: 1,LV: 1,CAR: 1,BAL: 1,KC: 1,ARI: 1,LAR: 1,KC: 1,LAC: 1 },
        DET: { PHI: 1,WAS: 1,MIN: 1,SEA: 1,NE: 1,DAL: 1,MIA: 1,GB: 1,CHI: 1,NYG: 1,BUF: 1,JAC: 1,MIN: 1,NYJ: 1,CAR: 1,CHI: 1,GB: 1 },
        GB: { MIN: 1,CHI: 1,TB: 1,NE: 1,NYG: 1,NYJ: 1,WAS: 1,BUF: 1,DET: 1,DAL: 1,TEN: 1,PHI: 1,CHI: 1,LAR: 1,MIA: 1,MIN: 1,DET: 1 },
        HOU: { IND: 1,DEN: 1,CHI: 1,LAC: 1,JAC: 1,LV: 1,TEN: 1,PHI: 1,NYG: 1,WAS: 1,MIA: 1,CLE: 1,DAL: 1,KC: 1,TEN: 1,JAC: 1,IND: 1 },
        IND: { HOU: 1,JAC: 1,KC: 1,TEN: 1,DEN: 1,JAC: 1,TEN: 1,WAS: 1,NE: 1,LV: 1,PHI: 1,PIT: 1,DAL: 1,MIN: 1,LAC: 1,NYG: 1,HOU: 1 },
        JAC: { WAS: 1,IND: 1,LAC: 1,PHI: 1,HOU: 1,IND: 1,NYG: 1,DEN: 1,LV: 1,KC: 1,BAL: 1,DET: 1,TEN: 1,DAL: 1,NYJ: 1,HOU: 1,TEN: 1 },
        KC: { ARI: 1,LAC: 1,IND: 1,TB: 1,LV: 1,BUF: 1,SF: 1,TEN: 1,JAC: 1,LAC: 1,LAR: 1,CIN: 1,DEN: 1,HOU: 1,SEA: 1,DEN: 1,LV: 1 },
        MIA: { NE: 1,BAL: 1,BUF: 1,CIN: 1,NYJ: 1,MIN: 1,PIT: 1,DET: 1,CHI: 1,CLE: 1,HOU: 1,SF: 1,LAC: 1,BUF: 1,GB: 1,NE: 1,NYJ: 1 },
        MIN: { GB: 1,PHI: 1,DET: 1,NO: 1,CHI: 1,MIA: 1,ARI: 1,WAS: 1,BUF: 1,DAL: 1,NE: 1,NYJ: 1,DET: 1,IND: 1,NYG: 1,GB: 1,CHI: 1 },
        NE: { MIA: 1,PIT: 1,BAL: 1,GB: 1,DET: 1,CLE: 1,CHI: 1,NYJ: 1,IND: 1,NYJ: 1,MIN: 1,BUF: 1,ARI: 1,LV: 1,CIN: 1,MIA: 1,BUF: 1 },
        NO: { ATL: 1,TB: 1,CAR: 1,MIN: 1,SEA: 1,CIN: 1,ARI: 1,LV: 1,BAL: 1,PIT: 1,LAR: 1,SF: 1,TB: 1,ATL: 1,CLE: 1,PHI: 1,CAR: 1 },
        NYG: { TEN: 1,CAR: 1,DAL: 1,CHI: 1,GB: 1,BAL: 1,JAC: 1,SEA: 1,HOU: 1,DET: 1,DAL: 1,WAS: 1,PHI: 1,WAS: 1,MIN: 1,IND: 1,PHI: 1 },
        NYJ: { BAL: 1,CLE: 1,CIN: 1,PIT: 1,MIA: 1,GB: 1,DEN: 1,NE: 1,BUF: 1,NE: 1,CHI: 1,MIN: 1,BUF: 1,DET: 1,JAC: 1,SEA: 1,MIA: 1 },
        LV: { LAC: 1,ARI: 1,TEN: 1,DEN: 1,KC: 1,HOU: 1,NO: 1,JAC: 1,IND: 1,DEN: 1,SEA: 1,LAC: 1,LAR: 1,NE: 1,PIT: 1,SF: 1,KC: 1 },
        PHI: { DET: 1,MIN: 1,WAS: 1,JAC: 1,ARI: 1,DAL: 1,PIT: 1,HOU: 1,WAS: 1,IND: 1,GB: 1,TEN: 1,NYG: 1,CHI: 1,DAL: 1,NO: 1,NYG: 1 },
        PIT: { CIN: 1,NE: 1,CLE: 1,NYJ: 1,BUF: 1,TB: 1,MIA: 1,PHI: 1,NO: 1,CIN: 1,IND: 1,ATL: 1,BAL: 1,CAR: 1,LV: 1,BAL: 1,CLE: 1 },
        LAC: { LV: 1,KC: 1,JAC: 1,HOU: 1,CLE: 1,DEN: 1,SEA: 1,ATL: 1,SF: 1,KC: 1,ARI: 1,LV: 1,MIA: 1,TEN: 1,IND: 1,LAR: 1,DEN: 1 },
        SEA: { DEN: 1,SF: 1,ATL: 1,DET: 1,NO: 1,ARI: 1,LAC: 1,NYG: 1,ARI: 1,TB: 1,LV: 1,LAR: 1,CAR: 1,SF: 1,KC: 1,NYJ: 1,LAR: 1 },
        SF: { CHI: 1,SEA: 1,DEN: 1,LAR: 1,CAR: 1,ATL: 1,KC: 1,LAR: 1,LAC: 1,ARI: 1,NO: 1,MIA: 1,TB: 1,SEA: 1,WAS: 1,LV: 1,ARI: 1 },
        LAR: { BUF: 1,ATL: 1,ARI: 1,SF: 1,DAL: 1,CAR: 1,SF: 1,TB: 1,ARI: 1,NO: 1,KC: 1,SEA: 1,LV: 1,GB: 1,DEN: 1,LAC: 1,SEA: 1 },
        TB: { DAL: 1,NO: 1,GB: 1,KC: 1,ATL: 1,PIT: 1,CAR: 1,BAL: 1,LAR: 1,SEA: 1,CLE: 1,NO: 1,SF: 1,CIN: 1,ARI: 1,CAR: 1,ATL: 1 },
        TEN: { NYG: 1,BUF: 1,LV: 1,IND: 1,WAS: 1,IND: 1,HOU: 1,KC: 1,DEN: 1,GB: 1,CIN: 1,PHI: 1,JAC: 1,LAC: 1,HOU: 1,DAL: 1,JAC: 1 },
        WAS: { JAC: 1,DET: 1,PHI: 1,DAL: 1,TEN: 1,CHI: 1,GB: 1,IND: 1,MIN: 1,PHI: 1,HOU: 1,ATL: 1,NYG: 1,NYG: 1,SF: 1,CLE: 1,DAL: 1 }
    }, unique_foes = 14,
    NFL_teams = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAC", "KC", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "LV", "PHI", "PIT", "LAC", "SEA", "SF", "LAR", "TB", "TEN", "WAS"],
    NFL_teams_len = NFL_teams.length,
    division_teams = {
        AE: ["BUF", "MIA", "NE", "NYJ"],
        AN: ["BAL", "CLE", "CIN", "PIT"],
        AS: ["HOU", "IND", "JAC", "TEN"],
        AW: ["DEN", "KC", "LV", "LAC"],
        NE: ["DAL", "NYG", "PHI", "WAS"],
        NN: ["CHI", "DET", "GB", "MIN"],
        NS: ["ATL", "CAR", "NO", "TB"],
        NW: ["ARI", "SF", "LAR", "SEA"]
    },
    division = {
        BUF: "AE",
        MIA: "AE",
        NE: "AE",
        NYJ: "AE",
        BAL: "AN",
        CLE: "AN",
        CIN: "AN",
        PIT: "AN",
        HOU: "AS",
        IND: "AS",
        JAC: "AS",
        TEN: "AS",
        DEN: "AW",
        KC: "AW",
        LV: "AW",
        LAC: "AW",
        DAL: "NE",
        NYG: "NE",
        PHI: "NE",
        WAS: "NE",
        CHI: "NN",
        DET: "NN",
        GB: "NN",
        MIN: "NN",
        ATL: "NS",
        CAR: "NS",
        NO: "NS",
        TB: "NS",
        ARI: "NW",
        SF: "NW",
        LAR: "NW",
        SEA: "NW"
    },
    table_offsets = {
        NE: 1,
        NN: 6,
        NS: 11,
        NW: 16,
        AE: 1,
        AN: 6,
        AS: 11,
        AW: 16
    }, active_tab,
    tab_prefixes = [
        "week-1",
        "week-2",
        "week-3",
        "week-4",
        "week-5",
        "week-6",
        "week-7",
        "week-8",
        "week-9",
        "week-10",
        "week-11",
        "week-12",
        "week-13",
        "week-14",
        "week-15",
        "week-16",
        "week-17",
        "week-18",
        "help",
        "BUF",
        "MIA",
        "NE",
        "NYJ",
        "BAL",
        "CLE",
        "CIN",
        "PIT",
        "HOU",
        "IND",
        "JAC",
        "TEN",
        "DEN",
        "KC",
        "LV",
        "LAC",
        "DAL",
        "NYG",
        "PHI",
        "WAS",
        "CHI",
        "DET",
        "GB",
        "MIN",
        "ATL",
        "CAR",
        "NO",
        "TB",
        "ARI",
        "SF",
        "LAR",
        "SEA"
    ],
    team_name = {
        ARI: "Arizona Cardinals",
        ATL: "Atlanta Falcons",
        BAL: "Baltimore Ravens",
        BUF: "Buffalo Bills",
        CAR: "Carolina Panthers",
        CHI: "Chicago Bears",
        CIN: "Cincinnati Bengals",
        CLE: "Cleveland Browns",
        DAL: "Dallas Cowboys",
        DEN: "Denver Broncos",
        DET: "Detroit Lions",
        GB: "Green Bay Packers",
        HOU: "Houston Texans",
        IND: "Indianapolis Colts",
        JAC: "Jacksonville Jaguars",
        KC: "Kansas City Chiefs",
        MIA: "Miami Dolphins",
        MIN: "Minnesota Vikings",
        NE: "New England Patriots",
        NO: "New Orleans Saints",
        NYG: "New York Giants",
        NYJ: "New York Jets",
        LV: "Las Vegas Raiders",
        PHI: "Philadelphia Eagles",
        PIT: "Pittsburgh Steelers",
        LAC: "Los Angeles Chargers",
        SEA: "Seattle Seahawks",
        SF: "San Francisco 49ers",
        LAR: "Los Angeles Rams",
        TB: "Tampa Bay Buccaneers",
        TEN: "Tennessee Titans",
        WAS: "Washington Redskins"
    },
    NFC_table = document.getElementById("NFC-table"),
    AFC_table = document.getElementById("AFC-table"),
    table_divider = '<div style="float:left">&nbsp;&nbsp;&nbsp;&nbsp;</div>',
    NO_GAME = 0,
    AWAY_WIN = 1,
    HOME_WIN = 2,
    TIE_GAME = 3,
    WINS = 0,
    LOSSES = 1,
    TIES = 2,
    cookie_bits = [],
    cookie_letters = [],
    game_position = {},
    game_states = {},
    unpicked_games_count = game_list_len,
    conf_record = {},
    div_record = {},
    all_record = {},
    SOS_record = {},
    SOV_record = {},
    conf_pct = {},
    div_pct = {},
    all_pct = {},
    team_pct = {},
    SOS_pct = {},
    SOV_pct = {},
    ii,
    jj;
my_init_func();
function my_init_func() {
    var g = getCookie(games_cookie_name), b = getParam("a"), e, f, a, d, c, h; for (e = NFL_teams_len; e--;) {
        team_week_lists[NFL_teams[e]] = []
    }
    for (e = 0; e < number_of_weeks; e++) {
        a = week_lists[e]; d = a.length;
        Array.prototype.push.apply(game_list, a);
        for (f = 0; f < d; f++) {
            c = a[f];
            h = c.match(/(\w+)-(\w+)/);
            team_week_lists[h[1]][e] = c;
            team_week_lists[h[2]][e] = c
        }
    }
    for (e = game_list_len; e--;) {
        game_position[game_list[e]] = e
    }
    clear_data();
    if (b !== "") {
        set_games_from_string(b)
    }
    else {
        if (g) {
            set_games_from_string(g)
        }
    }
    set_all_rankings();
    show_week_tab("week-1");
    set_game_cookie(cookie_letters, true)
}
function calc_pct(a) {
    var b = a[WINS] + a[LOSSES] + a[TIES];
    if (b === 0) {
        return 0
    }
    return (a[WINS] + 0.5 * a[TIES]) / b
}
function coin_flip(b) {
    var c = b[0], a;
    for (a = 1; a < b.length; a++) {
        if (b[a] < c) { c = b[a] }
    }
    return c;
}
function clear_data() {
    var c,
        b,
        a;
    unpicked_games_count = 256;
    for (c = NFL_teams_len; c--;) {
        a = NFL_teams[c];        
        document.getElementById(a + "-WLT").innerHTML = "0-0";
        document.getElementById(a + "-div").innerHTML = "0-0";
        all_record[a] = [0, 0, 0];
        conf_record[a] = [0, 0, 0];
        div_record[a] = [0, 0, 0];
        SOS_record[a] = [0, 0, 0];
        SOV_record[a] = [0, 0, 0];
        all_pct[a] = 0;
        conf_pct[a] = 0;
        div_pct[a] = 0;
        SOS_pct[a] = 0;
        SOV_pct[a] = 0
    }
    for (c = game_list_len; c--;) {
        b = game_list[c];
        game_states[b] = NO_GAME
    }
    for (c = cookie_letter_length; c--;) {
        cookie_bits[c] = 0;
        cookie_letters[c] = "A"
    }
}

function set_games_from_string(b) {
    if (b.match(cookie64_re) === null) {
        alert("Game data is corrupt, sorry. :(");
        clear_data(); return
    }
    var a = [],
        c = b.substring(1, 1 + cookie_letter_length).split("");
    ii;
    for (ii = 0; ii < cookie_letter_length; ii++) {
        value = base64.indexOf(c[ii]);
        a[ii] = value
    }
    for (ii = 0; ii < game_list_len; ii++) {
        bit_subslot = ii % 3;
        bit_slot = (ii - bit_subslot) / 3; game_value = (a[bit_slot] >> (bit_subslot * 2)) & 3;
        change_game(game_list[ii], game_value)
    }
}

function xor_cookie_bits(b, c, a) {
    position = game_position[b];
    bit_subslot = position % 3;
    bit_slot = (position - bit_subslot) / 3;
    new_value = cookie_bits[bit_slot] ^ ((c ^ a) * Math.pow(4, bit_subslot));
    cookie_bits[bit_slot] = new_value;
    cookie_letters[bit_slot] = base64[new_value];
}

function reset_button() {
    if (confirm("Reset all games to unpicked?")) {
        clear_data(); set_all_rankings();
        set_game_cookie(cookie_letters, true);
        show_week_tab("week-1")
    }
}

function set_game_buttons(b, a) {
    var c = b.match(/(\w+)-(\w+)/);
    if (document.getElementById(b + "-away-td") === null) {
        return
    }
    switch (a) {
        case AWAY_WIN:
            document.getElementById(b + "-away-td").className = c[2] == active_tab ? "team-font selected other-team-tab" : "team-font selected " + c[1];
            document.getElementById(b + "-tie-td").className = "anti-selected"; document.getElementById(b + "-home-td").className = "team-font anti-selected";
            break;
        case HOME_WIN:
            document.getElementById(b + "-away-td").className = "team-font anti-selected";
            document.getElementById(b + "-tie-td").className = "anti-selected";
            document.getElementById(b + "-home-td").className = c[1] == active_tab ? "team-font selected other-team-tab" : "team-font selected " + c[2];
            break;
        case TIE_GAME:
            document.getElementById(b + "-away-td").className = "team-font tied-team";
            document.getElementById(b + "-tie-td").className = "selected tied-tie";
            document.getElementById(b + "-home-td").className = "team-font tied-team";
            break;
        case NO_GAME:
            document.getElementById(b + "-away-td").className = "team-font not-selected";
            document.getElementById(b + "-tie-td").className = "not-selected";
            document.getElementById(b + "-home-td").className = "team-font not-selected";
            break
    }
}

function set_standings_game(b, a) {
    var c = b.match(/(\w+)-(\w+)/);

    switch (a) {
        case AWAY_WIN:
            modify_game(b, c[1], c[2], 1, 0);
            break;
        case HOME_WIN:
            modify_game(b, c[2], c[1], 1, 0);
            break;
        case TIE_GAME:
            modify_game(b, c[1], c[2], 0, 1);
            break
    }
}

function change_game(c, b) {
    var a = game_states[c],
        d;
    if (a != b) {
        d = c.match(/(\w+)-(\w+)/); game_states[c] = b;
        xor_cookie_bits(c, a, b);
        switch (a) {
            case AWAY_WIN:
                modify_game(c, d[1], d[2], -1, 0);
                break;
            case HOME_WIN:
                modify_game(c, d[2], d[1], -1, 0);
                break;
            case TIE_GAME:
                modify_game(c, d[1], d[2], 0, -1);
                break;
            case NO_GAME:
                break
        }
        set_standings_game(c, b); set_game_buttons(c, b)
    }
}

function wgc(b, a) {
    if (a == game_states[b]) {
        a = NO_GAME
    }
    change_game(b, a);
    set_game_cookie(cookie_letters);
    set_all_rankings();
}

function set_all_rankings() {
    var d = [],
        a = [],
        c = {},
        b;
    if (unpicked_games_count > 255) {
        b = "You haven't picked any games. "
    }
    else {
        if (unpicked_games_count > 1) {
            b = "You have " + unpicked_games_count + " unpicked games. "
        }
        else {
            if (unpicked_games_count > 0) {
                b = "You have 1 unpicked game. "
            }
            else {
                b = ""
            }
        }
    }
    document.getElementById("unpicked-warning").innerHTML = b;
    conf_ranker(
        [
            div_ranker("NE", NFC_table, a, c),
            div_ranker("NN", NFC_table, a, c),
            div_ranker("NS", NFC_table, a, c),
            div_ranker("NW", NFC_table, a, c)
        ], 'NFC'
    );

    conf_ranker(
        [
            div_ranker("AE", AFC_table, d, c),
            div_ranker("AN", AFC_table, d, c),
            div_ranker("AS", AFC_table, d, c),
            div_ranker("AW", AFC_table, d, c)
        ], 'AFC');

    wild_ranker(d, c, 'AFC');
    wild_ranker(a, c, 'NFC');
}

function wild_ranker(c, b, confName) {
    var e = c.slice(0),
        a,
        d;

    a = conf_pick_top(e);
    document.getElementById(a + "-conf-rank").innerHTML = 5;
    e.splice(e.indexOf(a), 1); e.push(b[a]); d = conf_pick_top(e);
    document.getElementById(d + "-conf-rank").innerHTML = 6;
    if (!conferenceRankingObject[confName]) {
        conferenceRankingObject[confName] = {
            placements: []
        }
    }
    conferenceRankingObject[confName].placements[5] = { name: a, record: all_record[a] };
    conferenceRankingObject[confName].placements[6] = { name: d, record: all_record[d] };
}

function exchange(d, c, b) {
    var a = b.tBodies[0].getElementsByTagName("tr"),
        e,
        f = 4;
    if (parseFloat(b.rows[d].cells[f].textContent) < parseFloat(b.rows[c].cells[f].textContent)) {
        return;
    }
    if (d == c + 1) {
        b.tBodies[0].insertBefore(a[d], a[c])
    }
    else {
        if (c == d + 1) {
            b.tBodies[0].insertBefore(a[c], a[d])
        }
        else {
            e = b.tBodies[0].replaceChild(a[d], a[c]);
            if (typeof (a[d]) != "undefined") {
                b.tBodies[0].insertBefore(e, a[d])
            }
            else {
                b.appendChild(e)
            }
        }
    }
}

function sort_div(c, a) {
    var b = table_offsets[c];
    exchange(b, b + 2, a);
    exchange(b + 1, b + 3, a);
    exchange(b, b + 1, a);
    exchange(b + 2, b + 3, a);
    exchange(b + 1, b + 2, a)
}

function conf_ranker(c, confName) {
    if (unpicked_games_count === 256) return;
    var e = c.slice(0),
        b,
        d,
        a;

    b = conf_pick_top(e);
    document.getElementById(b + "-conf-rank").innerHTML = 1;
    e.splice(e.indexOf(b), 1);
    d = conf_pick_top(e);
    document.getElementById(d + "-conf-rank").innerHTML = 2;
    e.splice(e.indexOf(d), 1); a = conf_pick_top(e);
    document.getElementById(a + "-conf-rank").innerHTML = 3;
    e.splice(e.indexOf(a), 1);
    document.getElementById(e[0] + "-conf-rank").innerHTML = 4;
    if (confName) {
        conferenceRankingObject[confName] = {
            name: confName,
            placements: {}
        };
        conferenceRankingObject[confName].placements[1] = { name: b, record: all_record[b] };
        conferenceRankingObject[confName].placements[2] = { name: d, record: all_record[d] };
        conferenceRankingObject[confName].placements[3] = { name: a, record: all_record[a] };
        conferenceRankingObject[confName].placements[4] = { name: e[0], record: all_record[e[0]] }
    }
}

function div_ranker(b, d, c, f) {
    var h = division_teams[b].slice(0),
        e,
        g,
        a;

    e = division_pick_top(h);
    document.getElementById(e + "-div-rank").innerHTML = 1;
    h.splice(h.indexOf(e), 1);
    g = division_pick_top(h);
    document.getElementById(g + "-div-rank").innerHTML = 2;
    document.getElementById(g + "-conf-rank").innerHTML = "";
    h.splice(h.indexOf(g), 1);
    c.push(g);
    a = division_pick_top(h);
    document.getElementById(a + "-div-rank").innerHTML = 3;
    document.getElementById(a + "-conf-rank").innerHTML = "";
    h.splice(h.indexOf(a), 1); f[g] = a;
    document.getElementById(h[0] + "-div-rank").innerHTML = 4;
    document.getElementById(h[0] + "-conf-rank").innerHTML = "";
    sort_div(b, d);
    return e
}

function conf_pick_top(a) {
    remaining_teams = best_pct(a, all_pct);
    if (remaining_teams.length == 1) {
        return remaining_teams[0];
    }
    return (conf_tiebreaker(remaining_teams));
}

function conf_tiebreaker(b) {
    var a = (b.length > 2),
        c = b.slice(0);

    c = hth_conf(b);

    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return conf_tiebreaker(c);
            }
    }
    c = best_pct(c, conf_pct);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return conf_tiebreaker(c)
            }
    } c = best_common_pct(c);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return conf_tiebreaker(c);
            }
    }
    c = best_pct(c, SOV_pct);

    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return conf_tiebreaker(c);
            }
    }
    c = best_pct(c, SOS_pct);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return conf_tiebreaker(c);
            }
    }
    return coin_flip(c);
}
function division_pick_top(a) {
    remaining_teams = best_pct(a, all_pct);
    if (remaining_teams.length == 1) {
        return remaining_teams[0]
    } return (division_tiebreaker(remaining_teams))
}

function division_tiebreaker(b) {
    var a = (b.length > 2),
        c;
    c = hth_div(b);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return division_tiebreaker(c)
            }
    }
    c = best_pct(c, div_pct);

    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return division_tiebreaker(c)
            }
    }
    c = best_common_pct(c);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return division_tiebreaker(c);
            }
    }
    c = best_pct(c, conf_pct);
    switch (c.length) {
        case 1:
            return c[0];
        case 2: if (a) {
            return division_tiebreaker(c);
        }
    }
    c = best_pct(c, SOV_pct);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return division_tiebreaker(c)
            }
    } c = best_pct(c, SOS_pct);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return division_tiebreaker(c);
            }
    }
    return coin_flip(c);
}

function hth_conf(e) {
    var g,
        a = e.length,
        b,
        f,
        c,
        d;
    for (c = a; c--;) {
        b = e[c];
        for (d = a; d--;) {
            if (c == d) {
                continue;
            }
            f = e[d];
            if (!(game_states[b + "-" + f] == AWAY_WIN || game_states[f + "-" + b] == HOME_WIN)) {
                break;
            }
        }
        if (d < 0) { return [b] }
    }
    for (c = a; c--;) {
        b = e[c];
        for (d = a; d--;) {
            if (c == d) {
                continue;
            }
            f = e[d];
            if (!(game_states[b + "-" + f] == HOME_WIN || game_states[f + "-" + b] == AWAY_WIN)) {
                break;
            }
        }
        if (d < 0) {
            g = e.slice(0);
            g.splice(c, 1);
            return g
        }
    } return e
}

function hth_div(g) {
    var a, f = {},
        h = {},
        d, e, c,
        b;

    a = g.length;
    for (d = a; d--;) {
        f[g[d]] = [0, 0, 0]
    }
    for (d = a; d--;) {
        c = g[d];

        for (e = a; e--;) {
            if (d == e) {
                continue;
            }
            b = g[e];
            switch (game_states[c + "-" + b]) {
                case AWAY_WIN:
                    f[c][WINS]++;
                    f[b][LOSSES]++;
                    break;
                case HOME_WIN:
                    f[b][WINS]++;
                    f[c][LOSSES]++;
                    break;
                case TIE_GAME:
                    f[c][TIES]++;
                    f[b][TIES]++;
                    break
            }
        }
    }
    for (d = a; d--;) {
        c = g[d]; h[c] = calc_pct(f[c])
    }
    return best_pct(g, h);
}

function common_foes(f) {
    var e = foe_lookup[f[0]],
        c = f.length, a = [],
        b,
        d;

    loop_first_foes:
        for (b = 0; b < unique_foes; b++) {
            foe_to_check = e[b];
            for (d = 1; d < c; d++) {
                if (foe_hash[f[d]][foe_to_check] == undefined) {
                    continue loop_first_foes;
                }
            }
            a.push(foe_to_check)
        } return a
}

function best_common_pct(g) {
    var h = g.length,
        f = {},
        a = common_foes(g),
        b = a.length,
        k,
        e,
        c,
        d,
        j,
        i = [];

    for (k = h; k--;) {
        f[g[k]] = [0, 0, 0]
    }
    for (k = 0; k < b; k++) {
        c = a[k];

        for (e = 0; e < h; e++) {
            d = g[e]; j = f[d]; switch (game_states[c + "-" + d]) {
                case AWAY_WIN:
                    j[LOSSES]++;
                    break;
                case HOME_WIN:
                    j[WINS]++;
                    break;
                case TIE_GAME:
                    j[TIES]++;
                    break
            }

            switch (game_states[d + "-" + c]) {
                case AWAY_WIN:
                    j[WINS]++;
                    break;
                case HOME_WIN:
                    j[LOSSES]++;
                    break;
                case TIE_GAME:
                    j[TIES]++;
                    break
            }
        }
    }

    for (k = 0; k < g.length; k++) {
        d = g[k];
        j = f[d];
        if (j[WINS] + j[LOSSES] + j[TIES] < 4) {
            return g;
        }
        i[d] = calc_pct(j)
    }
    return best_pct(g, i)
}

function best_pct(e, d) {
    var b = [e[0]],
        a = d[e[0]],
        c;

    for (c = 1; c < e.length; c++) {
        test_pct = d[e[c]];
        if (test_pct > a) {
            b = [e[c]];
            a = test_pct
        }
        else {
            if (test_pct == a) {
                b.push(e[c]);
            }
        }
    }
    return b;
}

function set_tabbing_buttons(b) {
    var a = tab_prefixes.length,
        c,
        d;

    active_tab = b;
    document.getElementById("help-tab").style.display = "none";
    autogen_tab.style.display = "block";
    for (c = a; c--;) {
        d = tab_prefixes[c];
        if (d == b) {
            document.getElementById(d + "-button").className = "button_down"
        }
        else {
            document.getElementById(d + "-button").className = "button_up"
        }
    }
}
function show_help() {
    set_tabbing_buttons("help");
    autogen_tab.style.display = "none";
    document.getElementById("help-tab").style.display = "block";
}

function show_week_tab(e) {
    var d,
        g,
        b,
        f,
        c,
        a = document.getElementById("autogen_tab");

    set_tabbing_buttons(e);
    a.className = "";
    d = e.match(/week-(\d+)/);
    g = parseInt(d[1], 10);
    b = week_lists[g - 1];
    a.innerHTML = week_tab(e, g, b);
    for (f = b.length; f--;) {
        c = b[f];
        set_game_buttons(c, game_states[c])
    }
}

function show_team_tab(c) {
    set_tabbing_buttons(c);
    var a = document.getElementById("autogen_tab"),
        d,
        b;
    a.className = c;
    a.innerHTML = team_header(c) + '<div style="clear:both"><br></div>' + make_team_game_tables(c);
    d = team_week_lists[c];
    for (ii = d.length; ii--;) {
        b = d[ii];
        if (b != undefined) {
            set_game_buttons(b, game_states[b]);
        }
    }
}

function week_tab(e, k, p) {
    var j,
        o,
        l,
        i = [],
        m = [],
        b = [],
        a = "",
        d,
        h,
        f,
        c = "", g = "", n; d = bye_lookup[k]; if (d != undefined) {
            a = '<div class="bye_header">Byes: ' + d + "</div>"
        }
    j = p.length; for (n = 0; n < j; n++) {
        o = p[n]; l = o.match(/(\w+)-(\w+)/);
        h = division[l[1]][0];
        f = division[l[2]][0];
        if (h != f) {
            m.push(o)
        }
        else {
            if (h == "A") {
                i.push(o)
            }
            else { b.push(o) }
        }
    }
    if (k > 1) {
        c = '<input class="button_up" type="button" onclick="show_week_tab(\'week-' + (k - 1) + '\')"value="<-- Go to Week ' + (k - 1) + '"></input>';
    }
    if (k < number_of_weeks) {
        g = '<input class="button_up" type="button" style="text-align:right" onclick="show_week_tab(\'week-' + (k + 1) + '\')"value="Go to Week ' + (k + 1) + ' -->"></input>'
    }
    return "Week " + k + ":" + a + "<div>" + week_game_table("AFC", i) + table_divider + week_game_table("AFC vs. NFC", m) + table_divider + week_game_table("NFC", b) + '</div><div style="clear:both"><br></div><div><div style="float:left">' + c + '</div><div style="float:right">' + g + "</div></div>" + table_divider
}

function team_header(b) {
    var a,
        c;
    a = team_name[b].toUpperCase().match(/(.*)\s(.*)/);
    c = a[1] + "&nbsp;<br>" + a[2];
    return '<div><div class="m-icon sp-m' + b + '" style="float: left"></div><div class="team-header" style="float: left">&nbsp;' + c + '&nbsp</div><div class="m-icon sp-m' + b + '" style="float: left"></div><table class="recordtable" style="float: right"><tr><th>WLT</th><th>Div</th><th>Conf</th></tr><tr><td id="team-WLT">' + WLT_string(all_record[b]) + '</td><td id="team-div">' + WLT_string(div_record[b]) + '</td><td id="team-conf">' + WLT_string(conf_record[b]) + '</td></tr><tr><th>SOV</th><th>SOS</th><th></th></tr><tr><td id="team-SOV">' + SOV_pct[b].toFixed(3) + '</td><td id="team-SOS">' + SOS_pct[b].toFixed(3) + "</td><td></td></tr></table></div>";
}

function make_team_game_tables(a) {
    return team_game_table(1, 6, a) + table_divider + team_game_table(7, 12, a) + table_divider + team_game_table(13, 18, a)
}

function week_game_table(g, b) {
    var c,
        e,
        j = "",
        a = "",
        f = "",
        k = "",
        i,
        h,
        d;

    c = '<div style="float:left"><table class="gametable"><tr><th colspan="3">' + g + '</th><th class="transparent"></th></tr><tr><th>Away</th><th class="transparent"></th><th>Home</th><th class="transparent"></th></tr>';

    d = b.length;
    for (h = 0; h < d; h++) {
        i = b[h];
        e = game_buttons(i);
        console.log('game_position[i]', game_position[i])
        console.log('day_codes[game_position[i]]', day_codes[game_position[i]])
        switch (day_codes[game_position[i]]) {
            case "T":
                j += e;
                break;
            case " ":
            case "U":
            case "C":
            case "Z":
                a += e;
                break;
            case "N":
                f += e;
                break;
            case "M":
                k += e;
                break;
            default: alert("OUCH " + i);
                break
        }
    }
    c += j + a + f + k + "</table></div>";
    return c
}

function team_game_table(e, c, b) {
    var f, g, d, a; f = '<div style="float:left"><table class="gametable ' + b + '" ><tr><th class="transparent"></th><th class="' + b + '"      >Away</th><th class="transparent"></td><th class="' + b + '"      >Home</th><th class="transparent"></th></tr>'; g = team_week_lists[b]; for (d = e; d <= c; d++) { a = g[d - 1]; f += game_buttons(a, d) } f += "</table></div>"; return f
}

function game_buttons(i, a) {
    var b = (a == undefined) ? "" : "<td>" + a + " </td>", g, c, f, d, h, e;
    if (i == undefined) {
        e = "<tr>" + b + '<td class="byeweek" colspan="3">Bye week</td></tr>'
    } else {
        g = i.match(/(\w+)-(\w+)/);
        c = g[1];
        f = g[2];
        d = day_codes[game_position[i]];
        h = day_explaination[d];
        e = "<tr>" + b + '<td id="' + i + '-away-td" onclick="wgc( \'' + i + "', " + AWAY_WIN + ')"><div class="m-icon sp-m' + c + '" style="float: left"></div><div style="float:right;padding:3px">' + c + '<br>&nbsp;</div></td><td title="Click = to predict a tie."id="' + i + '-tie-td"  onclick="wgc( \'' + i + "', " + TIE_GAME + ')">&nbsp;=&nbsp;</td><td id="' + i + '-home-td" onclick="wgc( \'' + i + "', " + HOME_WIN + ')"><div style="float:left;padding:3px">' + f + '<br>&nbsp;</div><div class="m-icon sp-m' + f + '" style="float: right"></div></td><td title="' + h + '">' + d + "</td></tr>"
    }
    return e
}


function WLT_string(a) {
    return (a[TIES] === 0) ? a.slice(0, 2).join("-") : a.slice(0, 3).join("-")
}

function update_WLT_html(e, b, a, g, d) {
    var f, c;
    f = WLT_string(a);
    c = WLT_string(g);
    if (d !== "conf") {
        document.getElementById(e + "-" + d).innerHTML = f;
        document.getElementById(b + "-" + d).innerHTML = c
    }
    if (active_tab === e) {
        document.getElementById("team-" + d).innerHTML = f
    }
    else {
        if (active_tab === b) {
            document.getElementById("team-" + d).innerHTML = c
        }
    }
}

function modify_game(e, d, b, c, a) { unpicked_games_count -= (c + a); if (a == -1) { modify_SOV(e, d, b, 0, -1); modify_SOV(e, b, d, 0, -1) } else { if (c == -1) { modify_SOV(e, d, b, -1, 0) } } game_work(d, b, all_record, all_pct, "WLT", c, a); modify_SOS(d, c, 0, a); modify_SOS(b, 0, c, a); if (a == 1) { modify_SOV(e, d, b, 0, 1); modify_SOV(e, b, d, 0, 1) } else { if (c == 1) { modify_SOV(e, d, b, 1, 0) } } if (division[d][0] == division[b][0]) { game_work(d, b, conf_record, conf_pct, "conf", c, a); if (division[d] == division[b]) { game_work(d, b, div_record, div_pct, "div", c, a) } } } function game_work(i, h, d, g, b, c, a) { var f = d[i], e = d[h]; f[WINS] += c; e[LOSSES] += c; f[TIES] += a; e[TIES] += a; g[i] = calc_pct(f); g[h] = calc_pct(e); update_WLT_html(i, h, f, e, b) } function modify_SOV(e, j, i, n, r) { var p = foe_lookup[j], o = foe_lookup[i], b, f, a, h, k, d, m, c, g, l, q; c = SOV_record[j]; g = all_record[i]; c[WINS] += g[WINS] * n; c[LOSSES] += g[LOSSES] * n; c[TIES] += g[TIES] * n; l = calc_pct(c); SOV_pct[j] = l; if (active_tab == j) { document.getElementById("team-SOV").innerHTML = l.toFixed(3) } for (f = 0; f < unique_foes; f++) { b = p[f]; a = SOV_record[b]; h = j + "-" + b; k = (h == e) ? undefined : game_states[h]; if (k == HOME_WIN) { a[WINS] += n; a[TIES] += r } d = b + "-" + j; m = (d == e) ? undefined : game_states[d]; if (m == AWAY_WIN) { a[WINS] += n; a[TIES] += r } q = calc_pct(a); SOV_pct[b] = q; if (active_tab == b) { document.getElementById("team-SOV").innerHTML = q.toFixed(3) } if (r === 0) { b = o[f]; a = SOV_record[b]; h = i + "-" + b; k = (h == e) ? undefined : game_states[h]; if (k === HOME_WIN) { a[LOSSES] += n } d = b + "-" + i; m = (d == e) ? undefined : game_states[d]; if (m === AWAY_WIN) { a[LOSSES] += n } q = calc_pct(a); SOV_pct[b] = q; if (active_tab == b) { document.getElementById("team-SOV").innerHTML = q.toFixed(3) } } } } function modify_SOS(e, d, j, a) {
    var g = division[e], f = foe_lookup[e], c, b, h, i;
    for (i = unique_foes; i--;) {
        c = f[i];
        b = (division[c] == g) ? 2 : 1;
        h = SOS_record[c];
        h[WINS] += b * d;
        h[LOSSES] += b * j;
        h[TIES] += b * a;
        foe_SOS_pct = calc_pct(h);
        SOS_pct[c] = foe_SOS_pct;
        if (active_tab == c) {
            document.getElementById("team-SOS").innerHTML = foe_SOS_pct.toFixed(3)
        }
    }
};
function rnfl(elem) {
    isRNFLMarkdown = elem.checked;
    markdownExport();
}
function markdownExport() {
    var sb = [];
    var url = $("#save_string").html();
    if (!url) return;
    for (var conference in conferenceRankingObject) {
        var conferenceName = conferenceRankingObject[conference].name,
            conferenceLogo = '';
        if (isRNFLMarkdown) {
            conferenceLogo = "[](/" + conferenceName+")"
        }
        //1-6
        sb.push("#" + conferenceLogo + conferenceName+"\n\n");
        sb.push("Rank | Team | W | L | T\n");
        sb.push("-|-|-:|-:|-:|\n");
        for (var placement in conferenceRankingObject[conference].placements) {
            /* AFC
             *  1   |   KC  |  8 |  8   |   0   |
             */
            var team = conferenceRankingObject[conference].placements[placement],
                TeamLogo = '';
            if (isRNFLMarkdown) {
                TeamLogo = "[](/" + team.name + ")";
            }
            sb.push(placement + "|" + TeamLogo
                + "["+team.name +"]("+url+"#"+ team.name+")" + "|"
                + team.record[0] + "|"
                + team.record[1] + "|"
                + team.record[2] + "|\n");
        }
    }
    sb.push("[Generated by the NFL Playoff Predictor](" + url + ")");
    $("#markdownField").html(sb.join(''));
}

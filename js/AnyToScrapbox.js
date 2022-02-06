javascript:(function(){
    var url = window.location.href;
    if(url.includes("https://www.amazon.co.jp/")){

        // 書名を取得する
        var ttl = document.getElementById("productTitle");
        if (!ttl) var ttl = document.getElementById("ebooksProductTitle");
        // 取得した書名をデフォルト値としてページタイトルを決める
        var title = window.prompt('選択範囲を概要としてスクラップします。', ttl.innerText.trim());
        if (!title) return;
        // 『』をつける
        title = '『'+ title +'』';

        // サブタイトル（書名直後のバージョンと発売日が書いてある部分）を取得する
        var subttl = document.getElementById("productSubtitle");
        var sub;
        if(subttl) {
            sub = "\n" + subttl.innerText; // 後のために改行を付与　タグに囲まれたテキスト部分を取得
        } else {
            sub = ""; // サブタイトルが空のとき（undifined防止）
        }

        // 選択範囲を取得する
        var select = window.getSelection().toString();　// 選択範囲を文字列として取得
        if (select){ // 選択範囲があるとき
            select = select.replace(/(\W+)( )(\W+)/g,'$1$3'); // 字間に時々紛れている半角スペースを除去
            select = "\n> " + select.replace(/\n/g,'\n> '); // 行ごとに引用の「>」を付与
        }else{
            select = ""; // 選択範囲が空のとき（undifined防止）
        };

        // 書影を取得する
        var image=document.getElementById("imgBlkFront");
        if (!image) var image = document.getElementById("ebooksImgBlkFront");
        var imageurl = image.getAttribute("src");

        // 著者を取得する
        var authors = [];
        var c = document.getElementsByClassName('author');
        for (g = 0; g < c.length ;g++){
            var at = c[g].innerText.replace(/\r?\n|\t/g, '').replace(/,/,'');
            var pu = at.match(/\(.+\)/);
            var ct = at.replace(/\(.+\)/,'').replace(/ /g,'');
            authors.push(pu + ' [' + ct + ']');
        }

        // 以上の情報を、実際に書き込みたい形に整えてひとつの文字列にまとめる
        var lines = '['+imageurl+' '+window.location.href+']\n'  + authors.join(' ') + sub + '\n\n知った経緯\n \n' + select + '\n[#書籍]\n[＊]\n[@]\n';

    }else if(url.includes("https://play.google.com/store/apps/")){
        var appttl = document.querySelectorAll("h1.AHFaub span");
        var title = appttl[0].innerText;
        title = '🎮'+ title;
        var links = ['['+document.title+' '+window.location.href+']'];
        var lines = '\n' + links + '\n\n\n[#スマホゲーム]\n[＊]\n';

    }else{
        alert("このサイトにはまだ対応していません。");
        return;
    }

    // URLの形にするためにエンコード
    var body = encodeURIComponent(lines);

    // 自分のプロジェクトのURLとして開いてページを作成（または同名のページに追記）
    window.open('https://scrapbox.io/noratetsuobj/'+encodeURIComponent(title.trim())+'?body='+body)
})();

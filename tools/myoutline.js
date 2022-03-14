// 出力するScrapboxのプロジェクト名を入力
var SBproject = "";

// 表示・検索の候補にするScrapboxプロジェクトのリストを作成
var SBlist = [
    {"name":"Noratetsu's Room","address":"noratetsu"},
    {"name":"Unnamed Camp","address":"unnamedcamp"},
    ]

// 起動時の処理
if(!localStorage.hasOwnProperty('outlinedata')) { // 初回のみ発動
    const data = '[{"noid":"Nm2eeIs20","position":1,"attr":"","text":"new node","from":"","source":"","note":""}]';
    localStorage.setItem('outlinedata', data);
};
var outlinedata = JSON.parse(localStorage.getItem('outlinedata'));
console.log("ロードしたデータベースの内容を出力")
console.log(outlinedata)

var keydata = ["noid","position","attr","text","from","source","note"];

if(!localStorage.hasOwnProperty('colordata')) { // 初回のみ発動
    const data = '[{"name":"薄赤","code":"#ffeaea"},{"name":"薄青","code":"#e4e4ff"},{"name":"薄水","code":"#d6f6ff"},{"name":"薄緑","code":"#d9f3d9"},{"name":"薄黄","code":"#fffde0"},{"name":"薄紫","code":"#f3d9ff"},{"name":"赤","code":"#f01b1b"},{"name":"青","code":"#441bf8"},{"name":"水","code":"#a1ddff"},{"name":"緑","code":"#37b137"},{"name":"黄","code":"#ffff2b"},{"name":"紫","code":"#b11cb1"}]';
    localStorage.setItem('colordata', data);
};
var colordata = JSON.parse(localStorage.getItem('colordata'));

if(localStorage.hasOwnProperty('Saved-date')) document.getElementById("saveddate").innerText = localStorage.getItem("Saved-date");

if(localStorage.getItem("outlineHTML") == null) { // 初回のみ発動
    localStorage.getItem("outlineHTML") = document.getElementById("content").innerHTML;
};
document.getElementById("content").innerHTML = localStorage.getItem("outlineHTML");

var sessionsavetimes = 0;
SessionSave(sessionsavetimes);

SetSBProjectList();
SetEvents();
SetAttr();
SetNodeEvent();


// 以下function

// イベント追加の類
function SetNodeEvent(){ // アウトライナー機能の追加
    SetDragAndDrop();
    CopyPlain();
    AddEventBySelector("main li div span","keydown",NewNode);
    AddEventBySelector("main li div span","keydown",SpanShortcut);
    AddEventBySelector("main li div span","blur",UpdateText);
    SetOnclickByClass("node-icon",ToggleExpand);
    SetOnclickByClass("focus-icon",FocusNode);
}
function SetEvents(){ // inputボタン類
    SetOnclickByID("search-button",clickSearch);
    SetOnclickByID("update-attr",UpdateAttr);
    SetOnclickByID("convert-sb",ConvertAllToScrapbox);
    SetOnclickByID("save-data",ClickSaveHTML);
    SetOnclickByID("load-data",ClickLoadData);
    SetOnclickByID("undo",Undo);
    SetOnclickByID("redo",Redo);
    SetOnclickByID("focus-parent",FocusParentNode);
    SetOnclickByID("focus-to-sb",ConvertFocusToScrapbox);
    SetOnclickByID("focus-to-md",ConvertFocusToMarkdown);
}
function SetAttr(){ // 詳細欄を構築する（keyが変わっても良いようにHTMLに直接書かずにページ開く都度生成）
    let target = document.getElementById("attributes");
    for(let i = 0; i < keydata.length; i++){
        let attrdiv = document.createElement("div");
        let targetdiv = target.appendChild(attrdiv);
        let attrlabel = document.createElement('span');
        attrlabel.innerText = keydata[i];
        targetdiv.appendChild(attrlabel);
        let attrtxt;
        switch(keydata[i]){
            // 編集不可要素
            case "noid":
            case "position":
                attrtxt = document.createElement("span");
                break;
            // 編集可能要素
            default:
                attrtxt = document.createElement('textarea');
                attrtxt.rows = "1";
                if(keydata[i]=="text") attrtxt.rows = 2;
                if(keydata[i]=="note") attrtxt.rows = 2;
        }
        attrtxt.id = "attr-" + keydata[i];
        targetdiv.appendChild(attrtxt);
    }
}
function SetSBProjectList(){ // Scrapboxリストのアイテムを生成
    const target = document.getElementById("sb-select");
    for(let i = 0; i < SBlist.length; i++){
        let listitem = document.createElement("option");
        listitem.value = SBlist[i].address;
        listitem.innerText = SBlist[i].name;
        target.appendChild(listitem);
    }
}

// 細かい処理の省略系
function IndexOfNoid(noid){ // liを入れるとそのliのnoidを元にoutlinedataのIndexを返す
    // outlinedataとnoidで照合する
    let dataarray = Array.from(outlinedata);
    let datanum = dataarray.findIndex(e => e.noid.includes(noid));
    return datanum;
}
function SetOnclickByID(id,event){
    let target = document.getElementById(id);
    target.addEventListener('click', event);
}
function SetOnclickByClass(classname,event){
    let target = document.getElementsByClassName(classname);
    for(let i = 0; i < target.length; i++){
        target[i].addEventListener('click', event);
    }
}
function AddEventBySelector(selector,type,f){
    let targets = document.querySelectorAll(selector);
    for(let i = 0; i < targets.length; i++){
        targets[i].addEventListener(type,f);
    }
}
function IndexOfNodeInNodelist(target,select){ // 要素と検索範囲を入れると範囲内のIndexを返す
    let judgecolumn = document.querySelectorAll(select);
    let judgearray = Array.from(judgecolumn);
    return judgearray.indexOf(target)
}
function DateAndTimeStr(){
    const str = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let dateObj = new Date();
    let yy = dateObj.getFullYear().toString().slice(-2)
    let date = str[Number(yy)] + str[dateObj.getMonth()] + str[dateObj.getDate()] + str[dateObj.getHours()] + str[dateObj.getMinutes()] + str[dateObj.getSeconds()] + dateObj.getMilliseconds();
    return date;
}
function DateAndTime(format){
    let dateObj = new Date();
    let yyyy = dateObj.getFullYear();
    let yy = dateObj.getFullYear().toString().slice(-2);
    let m = dateObj.getMonth() + 1;
    let mm = ('00' + (dateObj.getMonth() + 1)).slice(-2);
    let d = dateObj.getDate();
    let dd = ('00' + dateObj.getDate()).slice(-2);
    let h = dateObj.getHours();
    let hh = ('00' + dateObj.getHours()).slice(-2);
    let n = dateObj.getMinutes();
    let nn = ('00' + dateObj.getMinutes()).slice(-2);
    let s = dateObj.getSeconds();
    let ss = ('00' + dateObj.getSeconds()).slice(-2);

    let date = '';
    switch(format){
        case "yymmdd":
            date = yy + mm + dd;
            break;
        case "yyyymmdd":
            date = yyyy + mm + dd;
            break;
        case "yyyymmddhhnnss":
        case "ymdhns":
            date = yyyy + mm + dd + hh + nn + ss;
            break;
        case "yymmddhhnnss":
            date = yy + mm + dd + hh + nn + ss;
            break;
        case "年月日":
            date = yyyy + "年" + m + "月" + d + "日";
            break;
        case "年月日時分":
            date = yyyy + "年" + m + "月" + d + "日" + h + "時" + n + "分";
            break;
        case "年月日時分秒":
            date = yyyy + "年" + m + "月" + d + "日" + h + "時" + n + "分" + s + "秒";
            break;
        case "yyyy/mm/dd":
            date = yyyy + "/" + mm + "/" + dd;
            break;
        case "yyyy/mm/dd hh:nn":
            date = yyyy + "/" + mm + "/" + dd + " " + hh + ":" + nn;
            break;
        case "yyyy-mm-dd":
            date = yyyy + "-" + mm + "-" + dd;
            break;
        case "yyyy.mm.dd":
            date = yyyy + "." + mm + "." + dd;
            break;
        case "yyyy.m.d":
            date = yyyy + "." + m + "." + d;
            break;
        default:
            date = yyyy + "/" + mm + "/" + dd;
    }
    return date;
}


// ノード作成系
// outlinedataを元にノード作成（現バージョンでは不使用）
function BuildNode(target,i){ // targetはul
    let createli = document.createElement('li');

    let noid = outlinedata[i].noid;
    createli.setAttribute("noid",noid);
    createli.setAttribute("draggable","true");
    
    let creatediv = document.createElement("div");
                    
    let focusicon = document.createElement("i");
    focusicon.className = "focus-icon fas fa-search-plus";
    let nodeicon = document.createElement("i");
    nodeicon.className = "node-icon fas fa-caret-right";

    let createspan = document.createElement("span");
    createspan.setAttribute("contenteditable","true");
    createspan.innerText = outlinedata[i].text;

    if(GetBGColor(outlinedata[i].attr)) createspan.style.backgroundColor = GetBGColor(outlinedata[i].attr);
    if(GetColor(outlinedata[i].attr)) createspan.style.color = GetColor(outlinedata[i].attr);
    if(outlinedata[i].attr.includes("！")){
        createspan.style.color = "#f01b1b"; // 「！」をつけたカードは文字色を赤に
    };
    if(outlinedata[i].from){
        createli.classList.add("quote");
        createspan.style.color = "#37b137"; // 引用カードは文字色を緑に
    };
    for(let j = 0; j < colordata.length; j++){ // カラーコード一覧を総当りでチェック
        let bgcolor = "/" + colordata[j].name + "/" // 同じ文字を含む別な色に当たらないように仕切り文字を使用
        if(outlinedata[i].attr.includes(bgcolor)){
            createspan.style.backgroundColor = colordata[j].code; // 含まれていればcodeを適用
        }
        let fontcolor = "[" + colordata[j].name + "]" // 同じ文字を含む別な色に当たらないように仕切り文字を使用
        if(outlinedata[i].attr.includes(fontcolor)){
            createspan.style.color = colordata[j].code; // 含まれていればcodeを適用
        }
    };

    let createa_from = document.createElement('a');
    if(outlinedata[i].from){
        createa_from.className = "from-icon fas fa-quote-left"
        createa_from.title =  decodeURI(outlinedata[i].from);
    };
    let createa_source = document.createElement('a');
    if(outlinedata[i].source){
        createa_source.className = "source-icon fas fa-external-link-square-alt"
        createa_source.href = outlinedata[i].source;
        createa_source.title =  decodeURI(outlinedata[i].source);
        createa_source.target = "_blank";
        createa_source.rel = "noopener noreferrer";
    };
    let maskdata = document.createElement('p');
    maskdata.textContent = outlinedata[i].attr;
    maskdata.className = "masked"

    let createul = document.createElement('ul');
    let position = outlinedata[i].position.toString();
    let parray = position.split(".");
    let ulclass = "node-level-" + (parray.length + 1);
    createul.setAttribute("level",ulclass)

    let targetli = target.appendChild(createli);
    let targetdiv = targetli.appendChild(creatediv);
    targetdiv.appendChild(focusicon);
    targetdiv.appendChild(nodeicon);
    targetdiv.appendChild(createspan);
    targetdiv.appendChild(createa_from);
    targetdiv.appendChild(createa_source);
    targetdiv.appendChild(maskdata);
    targetli.appendChild(createul);

    return document.querySelector('[noid="'+noid+'"]');
}

// Enterで下に新しいノードを作る
function NewNode(e) {
    if (e.which=== 13) { // Enterの時
        e.preventDefault(); // 本来の挙動はさせない
        let thisli = this.closest("li"); // liを取得
        let newli = SetNewNode();
        thisli.after(newli);
        let newli2 = thisli.nextElementSibling;
        newli2.querySelector("ul").setAttribute("level",thisli.querySelector("ul").getAttribute("level"));
        SyncBoth(newli2.querySelector("span"));
        newli2.querySelector("span").focus();
    };
}
function SetNewNode(){
    let noid = "N" + DateAndTimeStr();
    // outlinedataを更新する        
    let newitem = new Object;
    for(let i = 0; i < keydata.length; i++){
        newitem[keydata[i]] = "";
    }
    newitem.noid = noid
    outlinedata.push(newitem); // outlinedataに場所だけ作る（textやpositionは別のタイミングで書き込む）
    

    let createli = document.createElement("li");
    createli.setAttribute("noid",noid);
    createli.setAttribute("draggable","true");
    
    let creatediv = document.createElement("div");
            
    let focusicon = document.createElement("i");
    focusicon.className = "focus-icon fa-search-plus";
    focusicon.title = "フォーカス";
    let nodeicon = document.createElement("i");
    nodeicon.className = "node-icon fa-caret-right";
    nodeicon.title = "子項目を開閉";
    let createspan = document.createElement("span");
    createspan.setAttribute("contenteditable","true");
    createspan.innerText = "";
    
    let createul = document.createElement("ul");
    //createul.setAttribute("level",thisli.querySelector("ul").getAttribute("level"));

    let target = document.querySelector("main");// thisli.after(createli);
    let newli = target.appendChild(createli); // 作成したノードをnoidで取得
    
    let newdiv = newli.appendChild(creatediv);
    newdiv.appendChild(focusicon);
    newdiv.appendChild(nodeicon);
    let newspan = newdiv.appendChild(createspan);
    
    newli.appendChild(createul);
    
    console.log("新規ノード（" + noid + "）を作成しました。");
    newspan.focus();
    return newli;
}

// ノードテキスト変更を反映
function UpdateText(){ // onblurで発動
    let text = this.innerText;
    let parentli = this.closest("li");
    let noid = parentli.getAttribute("noid");
    // outlinedataとnoidで照合する
    if(outlinedata[IndexOfNoid(noid)].text==text) return; // 変更がない場合何もしない
    outlinedata[IndexOfNoid(noid)].text = text;
    // mainとfocusを同期する
    SyncBoth(this)
}


// データの更新処理系
// MainとFocusの同期処理
function SyncBoth(target){ // targetはspan
    const attrnoid = document.getElementById("attr-noid")
    const focusnoid = attrnoid.innerText;
    const contentul = document.querySelector('#content [noid="'+focusnoid+'"] > ul');
    const focus = document.getElementById("focus")
    if(IndexOfNodeInNodelist(target,"ul#content span")!=-1){ // contentなら
        if(IndexOfNodeInNodelist(target,".onfocus span")!=-1){
            focus.innerHTML = contentul.innerHTML;
            console.log("MainをFocusに反映しました。");
        }
    }else if(IndexOfNodeInNodelist(target,"ul#focus span")!=-1){
        contentul.innerHTML = focus.innerHTML;
        console.log("FocusをMainに反映しました。");
    }
    FixLevel();
    UpdatePosition();
    SetNodeEvent();
}

// ノード移動時にインデントレベルのデータを更新する
function FixLevel(){
    function query(level){
        let liul = " > li > ul"
        let text = "#content";
        for(let i = 0; i < level-1; i++){
            text = text + liul;
        }
        return document.querySelectorAll(text)
    }
    let i = 2
    while(query(i).length!=0){
        let target = query(i);
        for(let j = 0; j < target.length; j++){
            let oldlevel = target[j].getAttribute("level");
            let newlevel = oldlevel.replace(/node-level-(\d{1}|\d{2}) */,"node-level-" + i + " ");
            target[j].setAttribute("level",newlevel);
        }
        i++;
    }
    console.log("levelを更新しました。")
}

// outlinedata内のposition欄を更新する
function UpdatePosition(){ // 新規追加時・D&D時に発動
    let presentli = document.querySelectorAll("#content li");
    for(let i = 0; i < presentli.length; i++){
        // そのツリー内で兄弟の何番目か
        let ordernum = GetLiOrder(presentli[i]);
        // それぞれのliのレベルを取得する
        let presentlv = GetLiLevel(presentli[i]);
        // 各階層でこれが何番目かを判定する
        let orderarray = new Array(); // 何番目かを収める配列を作る
        orderarray[0] = ordernum; // 最下層の順番をまず収める
        // 書き直すpositionデータを作る
        let judgeli = presentli[i];
        if(presentlv>1){
            for(let j = 0; j < presentlv-1; j++){
                // 階層に応じて遡る
                let presentul = judgeli.parentNode;
                let parentli = presentul.parentNode;
                let parentorder = GetLiOrder(parentli);//親の階層を取得
                orderarray.push(parentorder);
                judgeli = parentli;
            }
        }
        let position = orderarray[0];
        if(orderarray.length>1){
            for(let j = 1; j < orderarray.length; j++){
                position = orderarray[j] + "." + position
            }
        }
        // outlinedataとnoidで照合する
        outlinedata[IndexOfNoid(presentli[i].getAttribute("noid"))].position = position;
        }
    console.log("positionを更新しました。")
}
function GetLiOrder(li){ // liが兄弟の中で何番目か取得（1始まり）
    let parentul = li.parentNode; // 親ulを取得
    let indexarray = Array.from(parentul.childNodes); // 親の子要素（＝兄弟）を配列にする <!-- コメント -->もカウントされるので注意
    return indexarray.indexOf(li)+1;
}
function GetLiLevel(li){ // liの階層を取得（文字列から取得するので1始まり）
    let parentul = li.parentNode; // 親ulを取得
    let level = parentul.getAttribute("level");
    let presentlv = level.substring(11);
    return Number(presentlv); // 文字列から数字に
}

// ホットキー等
// コピペ時にHTMLタグを貼り付けない
// https://teratail.com/questions/29072
function CopyPlain() {
    let span = document.querySelectorAll("main li div span");
    for(let i = 0; i < span.length; i++){
        span[i].addEventListener("paste", function (e) {
            if(e.shiftKey == true) return;
            e.preventDefault();
            var text;
            if (window.clipboardData) {
                text = window.clipboardData.getData("text");
            } else {
                text = e.clipboardData.getData("text/plain");
            }

            if (document.selection) {
                // 〜Internet Explorer 10
                var range = document.selection.createRange();
                range.text = text;
            } else {
                // Internet Explorer 11/Chrome/Firefox
                var selection = window.getSelection();
                var range = selection.getRangeAt(0);
                var node = document.createTextNode(text);
                range.insertNode(node);
                range.setStartAfter(node);
                range.setEndAfter(node);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }, false);
    }
};

// ホットキーを設定
function SpanShortcut(e){
    const thisli = this.closest("li");
    const noid = thisli.getAttribute("noid");
    if(e.which === 9 && e.shiftKey == false){ // Tabで兄項目の子項目へ
        e.preventDefault(); // 本来の挙動はさせない
        // 兄項目がなければ何もしない        
        if(!thisli.previousElementSibling) return;
        SessionSave(sessionsavetimes); // 処理前を保存
        let targetul = thisli.previousElementSibling.querySelector("ul")
        targetul.appendChild(thisli);
        this.focus();
        console.log("ノード（" + noid + "）を移動しました。");
        SyncBoth(this);
    }else if(e.which === 9 && e.shiftKey == true){ // Shift+Tabで親項目の弟項目へ
        e.preventDefault(); // 本来の挙動はさせない
        // もし一番上なら何もしない
        if(thisli.parentNode.getAttribute("level")=="node-level-1") return;
        SessionSave(sessionsavetimes);
        let thisul = thisli.parentNode;
        let targetli = thisul.parentNode
        targetli.after(thisli);
        this.focus();
        console.log("ノード（" + noid + "）を移動しました。");
        SyncBoth(this);
    }else if(e.which === 40 && e.ctrlKey == true){ // Ctrl+↓で弟項目の下へ
        e.preventDefault(); // 本来の挙動はさせない
        // 弟項目がなければ何もしない
        if(thisli==thisli.parentNode.lastChild) return;
        SessionSave(sessionsavetimes);
        thisli.nextElementSibling.after(thisli);
        this.focus();
        console.log("ノード（" + noid + "）を移動しました。");
        SyncBoth(this);
    }else if(e.which === 38 && e.ctrlKey == true){ // Ctrl+↑で兄項目の上へ
        e.preventDefault(); // 本来の挙動はさせない
        // 兄項目がなければ何もしない
        if(!thisli.previousElementSibling) return;
        SessionSave(sessionsavetimes);
        thisli.previousElementSibling.before(thisli);
        this.focus();
        console.log("ノード（" + noid + "）を移動しました。");
        SyncBoth(this);
    }else if(e.which === 40 && e.ctrlKey == false){ // ↓でフォーカスを次のspanへ
        e.preventDefault(); // 本来の挙動はさせない
        // もし最後尾ならreturn
        let contentspan = document.querySelectorAll("ul#content span");
        let focusspan = document.querySelectorAll("ul#focus span");
        if(IndexOfNodeInNodelist(this,"ul#content span")!=-1 && IndexOfNodeInNodelist(this,"ul#content span")==contentspan.length-1) return;        
        if(IndexOfNodeInNodelist(this,"ul#focus span")!=-1 && IndexOfNodeInNodelist(this,"ul#focus span")==focusspan.length-1) return;
        // contentかfocusか判定
        if(IndexOfNodeInNodelist(this,"ul#content span")!=-1){ // もしcontentなら
            let spans = document.querySelectorAll("ul#content span");
            let removespans = document.querySelectorAll("ul#content .hidden-main span");
            let origarray = Array.from(spans);
            let removearray = Array.from(removespans);
            let judgearray = origarray.filter(node => removearray.indexOf(node)==-1);
            let num = judgearray.indexOf(this);
            let targetspan = judgearray[num+1];
            targetspan.focus();
        }else{ // もしfocusなら
            let spans = document.querySelectorAll("ul#focus span");
            let judgearray = Array.from(spans);
            let num = judgearray.indexOf(this);
            let targetspan = spans[num+1];
            targetspan.focus();
        }

    }else if(e.which === 38 && e.ctrlKey == false){ // ↑でフォーカスを前のspanへ
        e.preventDefault(); // 本来の挙動はさせない
        // もし先頭ならreturn
        if(IndexOfNodeInNodelist(this,"ul#content span")==0 || IndexOfNodeInNodelist(this,"ul#focus span")==0) return;
        // contentかfocusか判定
        if(IndexOfNodeInNodelist(this,"ul#content span")!=-1){ // もしcontentなら
            let spans = document.querySelectorAll("ul#content span");
            let removespans = document.querySelectorAll("ul#content .hidden-main span");
            let origarray = Array.from(spans);
            let removearray = Array.from(removespans);
            let judgearray = origarray.filter(node => removearray.indexOf(node)==-1);
            let num = judgearray.indexOf(this);
            let targetspan = judgearray[num-1];
            targetspan.focus();
        }else{ // もしfocusなら
            let spans = document.querySelectorAll("ul#focus span");
            let judgearray = Array.from(spans);
            let num = judgearray.indexOf(this);
            let targetspan = spans[num-1];
            targetspan.focus();
        }
    }else if(e.which === 8 && e.ctrlKey == true && e.shiftKey == true){ // Ctrl+Shift+Backspace
        e.preventDefault(); // 本来の挙動はさせない
        SessionSave(sessionsavetimes);
        const noid = thisli.getAttribute("noid");
        // ノードを削除する
        const targetnodes = document.querySelectorAll('[noid="'+noid+'"]');
        for(let i = 0; i < targetnodes.length; i++){
            targetnodes[i].remove();
        }
        RefreshData();
        if(document.getElementById("content").innerHTML==""){
            const newli = document.getElementById("content").appendChild(SetNewNode());
            newli.querySelector("ul").setAttribute("level","node-level-2");
            FixLevel();
            UpdatePosition();
            SetNodeEvent();
        }
        console.log(noid + "以下のノードを削除しました。")
    }
}
// 削除をデータベースに反映させる
// content内に存在していないnoidを一括で処理する
function RefreshData(){
    const presentnodes = document.querySelectorAll("ul#content li");
    let noidarray = new Array();
    for(let i = 0; i < presentnodes.length; i++){
        noidarray.push(presentnodes[i].getAttribute("noid"))
    }
    const focusnoid = document.getElementById("attr-noid").innerText;
    let removed = outlinedata;
    for(let i = 0; i < outlinedata.length; i++){
        let noid = outlinedata[i].noid;
        if(noidarray.indexOf(noid)==-1){ // もし存在していなければ
            removed = removed.filter( elem => elem.noid != noid); // 除外する
            if(noid==focusnoid){ // 削除されたノードをフォーカスしていた場合はクリア
                ClearAttr();
                document.getElementById("focus").innerHTML = "";
            }
        }
    }
    outlinedata = removed;
}

// 全てのliにドラッグ＆ドロップで移動する機能をつける
var targetnoid,targetplace,dragelm; // スコープの外側で使い回すため予め宣言
function SetDragAndDrop(){
    document.querySelectorAll('li').forEach (elm => {
        elm.ondragstart = function (event) {
            targetnoid = event.target.getAttribute("noid");
            if(IndexOfNodeInNodelist(event.target,"ul#content li")!=-1){
                targetplace = "content"; // ドラッグするliはcontentにある
            }else{
                targetplace = "focus"; // ドラッグするliはfocusにある
            }
            event.dataTransfer.setData('text/plain', event.target.getAttribute("noid"));
            dragelm = event.target;
        };
        let elmdiv = elm.querySelector("div");
        elmdiv.ondragover = function (event) {
            event.preventDefault();
            // もしドラッグ元がfocusでドラッグ先がcontentのフォーカス内なら
            if(targetplace=="focus" && IndexOfNodeInNodelist(this,".onfocus li div")!=-1){
                return;
            };
            // もしドラッグ元がcontentのフォーカス内且つドラッグ先がfocusなら
            if(targetplace=="content" && IndexOfNodeInNodelist(document.querySelector('[noid="'+targetnoid+'"]'),".onfocus li")!=-1 && IndexOfNodeInNodelist(this,"ul#focus li div")!=-1){
                return;
            };

            let rect = this.getBoundingClientRect();
            if ((event.clientY - rect.top) < (rect.height / 2)) {
                //マウスカーソルの位置が要素の半分より上
                this.style.borderTop = '2px solid red';
                this.style.borderBottom = '';
            } else if((event.clientX - rect.left) > (rect.width / 2)) {
                this.style.borderTop = '';
                this.style.borderBottom = '2px dotted blue';
            } else {
                //マウスカーソルの位置が要素の半分より下
                this.style.borderTop = '';
                this.style.borderBottom = '2px solid blue';
            }
        };
        elmdiv.ondragleave = function () {
            this.style.borderTop = '';
            this.style.borderBottom = '';
        };
        elmdiv.ondrop = function (event) {
            event.preventDefault();
            let li = this.closest("li");            
            let ul = li.querySelector("ul");
            this.style.borderTop = '';
            this.style.borderBottom = '';
            SessionSave(sessionsavetimes);
            if(targetplace=="focus"){
                // もしドラッグ先がcontentのフォーカス内なら実行しない
                if(IndexOfNodeInNodelist(this,".onfocus li div")!=-1) return;
                let rect = this.getBoundingClientRect();
                if ((event.clientY - rect.top) < (rect.height / 2)) {
                    //マウスカーソルの位置が要素の半分より上
                    li.before(dragelm);
                } else if((event.clientX - rect.left) > (rect.width / 2)) {
                    ul.appendChild(dragelm);
                } else {
                    //マウスカーソルの位置が要素の半分より下
                    li.after(dragelm);
                }
                // focusの変化をcontent（のonfocus内）に反映させる
                let noid = document.getElementById("attr-noid").innerText;
                document.querySelector('#content [noid="'+noid+'"] > ul').innerHTML = document.getElementById("focus").innerHTML;
            }else if(targetplace=="content"){
                // もしドラッグ元がcontentのフォーカス内且つドラッグ先がfocusなら実行しない
                if(IndexOfNodeInNodelist(document.querySelector('[noid="'+targetnoid+'"]'),".onfocus li")!=-1 && IndexOfNodeInNodelist(this,"ul#focus li div")!=-1) return;
                let rect = this.getBoundingClientRect();
                if ((event.clientY - rect.top) < (rect.height / 2)) {
                    //マウスカーソルの位置が要素の半分より上
                    li.before(dragelm);
                } else if((event.clientX - rect.left) > (rect.width / 2)) {
                    ul.appendChild(dragelm);
                } else {
                    //マウスカーソルの位置が要素の半分より下
                    li.after(dragelm);
                }
                let attrnoid = document.getElementById("attr-noid")
                let noid = attrnoid.innerText;
                let contentul = document.querySelector('#content [noid="'+noid+'"] > ul');
                let focus = document.getElementById("focus")
                if(IndexOfNodeInNodelist(this,"#focus div")!=-1){
                    // もしドラッグ先がfocusなら結果をcontentに反映する
                    contentul.innerHTML = focus.innerHTML;
                }else if(IndexOfNodeInNodelist(this,"#content .onfocus div")!=-1){
                    // もしドラッグ先がcontentならfocusをリフレッシュする
                    focus.innerHTML = contentul.innerHTML;
                }
            }
            dragelm.querySelector("div > span").focus();
            console.log("D&Dでノード（" + targetnoid + "）を移動しました。")
            FixLevel();
            UpdatePosition();
            //SetNodeEvent();
        };
    });
}


// 子項目を開閉する
function ToggleExpand(){
    let parentdiv = this.parentNode;
    let targetul = parentdiv.nextSibling;
    if(!targetul.firstChild) return; // 子項目がなければ何もしない
    let tag,ctag;    
    if(IndexOfNodeInNodelist(parentdiv,"ul#content li div")!=-1){
        tag = "hidden-main";
        ctag = "collapsed-main"
    }else{
        tag = "hidden-focus"
        ctag = "collapsed-focus"
    }
    const noid = this.closest("li").getAttribute("noid");
    const targetuls = document.querySelectorAll('[noid="'+noid+'"] > ul');
    const targeticons = document.querySelectorAll('[noid="'+noid+'"] > div > .node-icon');
    for(let i = 0; i < targetuls.length; i++){
        if(targetuls[i].classList.contains(tag)){
            targetuls[i].classList.remove(tag)
            targeticons[i].classList.remove(ctag)
        }else{
            targetuls[i].classList.add(tag);
            targeticons[i].classList.add(ctag)
        }
    }
}


// フォーカス画面関連
function SetFocus(noid,li){
    GetAttr(noid);
    let focustarget = document.getElementById("focus");
    let ul = li.querySelector("ul");
    focustarget.innerHTML = ul.innerHTML;
    SetNodeEvent();
    console.log(noid + "をFocusにセットしました。")
}
function FocusNode(){ // focusiconクリックで発動
    if(this.closest("li").classList.contains("onfocus")){
        this.closest("li").classList.remove("onfocus");
        this.classList.remove("onfocus"); 
        ClearAttr();
        document.getElementById("focus").innerHTML = "";
        return
    }
    let focusicons = document.querySelectorAll(".onfocus"); // 既についているonfocusを取得
    for(let i = 0; i < focusicons.length; i++){
        focusicons[i].classList.remove("onfocus");
    }
    this.classList.add("onfocus"); // アイコンにonfocusをつける
    let thisli = this.closest("li");
    thisli.classList.add("onfocus"); // li全体にonfocusをつける
    let targetid = thisli.getAttribute("noid");
    SetFocus(targetid,thisli);
}
function FocusParentNode(){ // 「↑」ボタンで発動
    let noid = document.getElementById("attr-noid").innerText;
    let thisli = document.querySelector('[noid="'+noid+'"]');
    let parentul = thisli.parentNode;
    if(parentul.getAttribute("level")=="node-level-1") return alert("この項目が最上位です。");
    let parentli = parentul.parentNode;
    let parentnoid = parentli.getAttribute("noid");
    SetFocus(parentnoid,parentli);
}
function GetAttr(noid){ // FocusNode()で呼び出す　noidを元にメタデータを取得して表示
    document.getElementById("noidlinks").innerHTML = null;
    for(let i = 0; i < outlinedata.length; i++){
        if(outlinedata[i].noid==noid){
            for(let item in outlinedata[i]){ // 割り出した配列番号を元にオブジェクト内を全て取り出す
                let areaid = "attr-" + item;
                let target = document.getElementById(areaid);
                let txt = outlinedata[i][item];
                switch(item){
                    case "noid":
                    case "position":
                        target.innerText = txt; // spanの中身はinnerTextで指定
                        break;
                    default:
                        target.value = txt; // textareaの中身はvalueで指定
                }
            }
            let getlink = GetLink(outlinedata[i].note);
            if(getlink!=null){ // もしnote内にリンクがあれば
                for(let j = 0; j < getlink.length; j++){
                    // ツールチップにリンク先のtext
                    // クリックでリンク先をフォーカス
                    let targetdiv = document.getElementById("noidlinks")
                    let i_link = document.createElement("i");
                    i_link.className = "link-icon forwardlink fas fa-link";
                    let index = IndexOfNoid(getlink[j]);
                    i_link.title = outlinedata[index].text;
                    i_link.setAttribute("linknoid",getlink[j]);
                    targetdiv.appendChild(i_link);
                    SetOnclickByClass("forwardlink",FocusLink);
                }
            }
        }
    }
    for(let i = 0; i < outlinedata.length; i++){
        let getbacklink = GetLink(outlinedata[i].note);
        if(getbacklink==null) continue;
        for(let j = 0; j < getbacklink.length; j++){
            if(getbacklink[j].includes(noid)){
                let targetdiv = document.getElementById("noidlinks")
                let i_link = document.createElement("i");
                i_link.className = "link-icon backlink fas fa-link";
                i_link.title = outlinedata[i].text;
                i_link.setAttribute("linknoid",outlinedata[i].noid);
                targetdiv.appendChild(i_link);
                SetOnclickByClass("backlink",FocusLink);
            }
        }
    }
}
function ClearAttr(){
    document.getElementById("attr-noid").innerText = "";
    document.getElementById("attr-position").innerText = "";
    document.getElementById("attr-attr").value = "";
    document.getElementById("attr-text").value = "";
    document.getElementById("attr-from").value = "";
    document.getElementById("attr-source").value = "";
    document.getElementById("attr-note").value = "";
}
function FocusLink(){ // リンク・バックリンクのアイコンクリック時発動
    let noid = this.getAttribute("linknoid");
    let li = document.querySelector('[noid="'+noid+'"]');
    SetFocus(noid,li);
}

function UpdateAttr(){ // 「更新」ボタンで発動
    // noidを取得する
    let noid = document.getElementById("attr-noid").innerText;
    if(noid=="") return console.log("ノードがフォーカスされていません。");
    // outlinedataとnoidで照合する
    let dataarray = Array.from(outlinedata);
    let datanum = dataarray.findIndex(e => e.noid.includes(noid));
    outlinedata[datanum].attr = document.getElementById("attr-attr").value;
    outlinedata[datanum].text = document.getElementById("attr-text").value;
    outlinedata[datanum].from = document.getElementById("attr-from").value;
    outlinedata[datanum].source = document.getElementById("attr-source").value;
    outlinedata[datanum].note= document.getElementById("attr-note").value;
    // アウトラインを同期する
    let targets = document.querySelectorAll('[noid="'+noid+'"]');
    for(let i = 0; i < targets.length; i++){
        let targetspan = targets[i].querySelector("span");
        targetspan.innerText = outlinedata[datanum].text;
        if(GetBGColor(outlinedata[datanum].attr)) targetspan.style.backgroundColor = GetBGColor(outlinedata[datanum].attr);
        if(GetColor(outlinedata[datanum].attr)) targetspan.style.color = GetColor(outlinedata[datanum].attr);
        if (outlinedata[datanum].from){
            targetspan.style.color = "#37b137";
        }
        if (outlinedata[datanum].attr.includes("！")) targetspan.style.color = "#f01b1b";
        for(let j = 0; j < colordata.length; j++){ // カラーコード一覧を総当りでチェック
            let bgcolor = "/" + colordata[j].name + "/" // /背景色/
            if(outlinedata[datanum].attr.includes(bgcolor)){
                targetspan.style.backgroundColor = colordata[j].code; // 含まれていればcodeを適用
            }
            let fontcolor = "[" + colordata[j].name + "]" // [文字色]
            if(outlinedata[datanum].attr.includes(fontcolor)){
                targetspan.style.color = colordata[j].code; // 含まれていればcodeを適用
            }
        };
        let targetdiv = targetspan.parentNode;
        let headingmatch = outlinedata[datanum].attr.match(/<h.*>/)
        if (headingmatch){
            switch(headingmatch[0]){
                case "<h1>":
                    targetspan.style.borderLeft = "#ea5532 6px solid";
                    break;
                case "<h2>":
                    targetspan.style.borderLeft = "#239dda 5px solid";
                    break;
                case "<h3>":
                    targetspan.style.borderLeft = "#009854 4px solid";
                    break;
                }            
        }else{
            targetspan.style.borderLeft = "unset";
        }
        if(targetdiv.querySelector(".from-icon")){
            targetdiv.querySelector(".from-icon").remove();
        }
        if(outlinedata[datanum].from){
            let createa_from = document.createElement('a');
            createa_from.className = "from-icon fas fa-quote-left"
            createa_from.title =  decodeURI(outlinedata[datanum].from);
            targetdiv.appendChild(createa_from);
        }
        if(targetdiv.querySelector(".source-icon")){
            targetdiv.querySelector(".source-icon").remove();
        }
        if(outlinedata[datanum].source){
            let createa_source = document.createElement('a');
            createa_source.className = "source-icon fas fa-external-link-square-alt"
            createa_source.href = outlinedata[datanum].source;
            createa_source.title =  decodeURI(outlinedata[datanum].source);
            createa_source.target = "_blank";
            createa_source.rel = "noopener noreferrer";
            targetdiv.appendChild(createa_source);
        }
    }
    console.log(noid + "のメタデータを更新しました。")
}

function GetLink(txt) { // note欄内のブラケットを取得
    let match = new Array();
    match = txt.match(/\[\[[^\[|\]]*\]\]/g); // 全ての[[hoge]]　ただしhogeに[や]を含まない
    if (match == null)
        return null; // なければnullを返す
    let replace = new Array();
    for (let i = 0; i < match.length; i++) {
        replace[i] = match[i].replace(/\[\[|\]\]/g, "");
    }
    return replace; // 配列を返す
}
function GetColor(txt) { // attr欄の文字色指定を取得
    let match = txt.match(/\[[^\[|\]]*\]/); // [hoge]　ただしhogeに[や]を含まない
    if (!match) return "unset"; // なければnullを返す
    let replace = match[0].replace(/\[|\]/g, "");
    for(let i = 0; i < colordata.length; i++){
        if(replace==colordata[i].name) return "unset";
    }
    return replace; // 中身を返す
}
function GetBGColor(txt) { // attr欄の背景色指定を取得
    let match = txt.match(/\/[^\/]*\//); // /hoge/　ただしhogeに/を含まない
    if (!match) return "unset"; // なければnullを返す
    let replace = match[0].replace(/\//g, "");
    for(let i = 0; i < colordata.length; i++){
        if(replace==colordata[i].name) return "unset";
    }
    return replace; // 中身を返す
}


// データ保存系
function SaveHTML(title){
    let focusicons = document.querySelectorAll(".onfocus"); // 既についているonfocusを取得
    for(let i = 0; i < focusicons.length; i++){
        focusicons[i].classList.remove("onfocus"); // onfocusを除去
    }
    localStorage.setItem(title,document.getElementById("content").innerHTML)
}
function SaveData(title){
    localStorage.setItem(title,JSON.stringify(outlinedata));
}
function AutoSaveHTML(){ // タブリロード時発動
    SaveHTML("outlineHTML");
    SaveData("outlinedata");
    ClearSessionStorage();
}
function ClickSaveHTML(){ // ヘッダーの「保存」ボタンクリックで発動
    let q = window.confirm("現在のデータを保存しますか？");
    if(q==false) return;
    SaveHTML("Saved-outlineHTML");
    SaveData("Saved-outlinedata");
    let date = DateAndTime("yyyy/mm/dd hh:nn")
    localStorage.setItem("Saved-date",date);
    document.getElementById("saveddate").innerText = date;
    console.log(date + " 現在のデータを保存しました。")
}
function ClickLoadData(){ // ヘッダーの「呼出」ボタンクリックで発動
    let q = window.confirm("保存されたデータを呼び出し、現在のデータを上書きしますか？");
    if(q==false) return;
    document.getElementById("content").innerHTML = localStorage.getItem("Saved-outlineHTML");
    outlinedata = JSON.parse(localStorage.getItem("Saved-outlinedata"));
    console.log("保存されたデータを呼び出しました。");
    console.log(outlinedata);
    SetNodeEvent();
}
function SessionSave(time){ // 引数は回数 起動時とノード移動時に発動
    let HTMLtitle = "SSave-outlineHTML" + time;
    let Datatitle = "SSave-outlinedata" + time;
    sessionStorage.setItem(HTMLtitle,document.getElementById("content").innerHTML);
    sessionStorage.setItem(Datatitle,JSON.stringify(outlinedata));
    sessionsavetimes++;
    undocount = 0; // 新たなセーブの度にundo判定をリセット
    console.log(HTMLtitle + "/" + Datatitle + " にセーブしました。")
}
function SessionSaveForUndo(time){ 
    let HTMLtitle = "SSave-outlineHTML" + time;
    let Datatitle = "SSave-outlinedata" + time;
    sessionStorage.setItem(HTMLtitle,document.getElementById("content").innerHTML);
    sessionStorage.setItem(Datatitle,JSON.stringify(outlinedata));
    console.log(HTMLtitle + "/" + Datatitle + " にセーブしました。")
}
function LoadSessionSave(num){ // numは何番目のデータか
    let HTMLtitle = "SSave-outlineHTML" + num;
    let Datatitle = "SSave-outlinedata" + num;
    document.getElementById("content").innerHTML = sessionStorage.getItem(HTMLtitle);
    outlinedata = JSON.parse(sessionStorage.getItem(Datatitle));
    SetNodeEvent();
    console.log(HTMLtitle + "/" + Datatitle + " をロードしました。")
    // alert(HTMLtitle + "\n" + Datatitle + "\nをロードしました。")
}

var undocount = 0; // 「やり直し」の回数管理用変数
function Undo(){
    if(sessionsavetimes - undocount < 1) return;
    if(undocount==0) SessionSaveForUndo(sessionsavetimes);
    undocount++;
    let num = sessionsavetimes - undocount;
    LoadSessionSave(num);
    console.log("undocount:" + undocount);
}
function Redo(){
    if(undocount==0) return;
    undocount--;
    let num = sessionsavetimes - undocount;
    LoadSessionSave(num);
    console.log("undocount:" + undocount);
}

function ClearSessionStorage(){ // タブリロード時にsessionStorageをクリア
    for(let i = 0; i < 10000; i++){
        let HTMLtitle = "SSave-outlineHTML" + i;
        let Datatitle = "SSave-outlinedata" + i;
        if(sessionStorage.getItem(HTMLtitle) == null) break;
        if(sessionStorage.getItem(Datatitle) == null) break;
        sessionStorage.removeItem(HTMLtitle);
        sessionStorage.removeItem(Datatitle);
    }
}


// アウトラインデータのエクスポート系
function ConvertToScrapbox(spans,title){
    let body = "";
    for(let i = 0; i < spans.length; i++){
        let ul = spans[i].closest("ul");
        let level = Number(ul.getAttribute("level").substring(11));
        let tab = "\t";
        for(let j = 0; j < level-1; j++){
            tab = "\t" + tab;
        }
        let text = tab + spans[i].innerText + "\n";
        body += text;
    }
    body = encodeURIComponent("\n\n"+body);

    // 自分のプロジェクトのURLとして開いてページを作成（または同名のページに追記）
    window.open('https://scrapbox.io/'+SBproject+'/'+encodeURIComponent(title.trim())+'?body='+body);
}
// Mainにあるアウトライン全体をScrapboxに出力（出力先プロジェクトは冒頭で指定）
function ConvertAllToScrapbox(){
    if(SBproject=="") return;
    let allspan = document.querySelectorAll("#content li div span");
    let title = DateAndTime("yyyymmdd") + " MyOutline"
    ConvertToScrapbox(allspan,title);
    console.log("Scrapboxに「" + title + "」を出力しました。")
}
// FocusしているアウトラインをScrapboxに出力（出力先プロジェクトは冒頭で指定）
function ConvertFocusToScrapbox(){
    if(SBproject=="") return;
    if(document.getElementById("attr-noid").innerText=="") return;
    let spans = document.querySelectorAll("#focus li div span");
    let judgelevel = document.querySelector("#focus>li>ul").getAttribute("level").substring(11);
    let body = "";
    for(let i = 0; i < spans.length; i++){
        let li = spans[i].closest("li");
        let ul = li.querySelector("ul");
        let levelstr = ul.getAttribute("level").substring(11);
        let level = Number(levelstr)-Number(judgelevel);
        let tab = "\t";
        if(level>0 && level<20){
            for(let j = 0; j < level; j++){
                tab = "\t" + tab;
            }
        }
        let text = tab + spans[i].innerText + "\n";
        body += text;
    }
    body = encodeURIComponent("\n"+body);
    let title = DateAndTime("yyyymmdd") + " " + document.getElementById("attr-text").value;
    
    // 自分のプロジェクトのURLとして開いてページを作成（または同名のページに追記）
    window.open('https://scrapbox.io/'+SBproject+'/'+encodeURIComponent(title.trim())+'?body='+body);
    console.log("Scrapboxに「" + title + "」を出力しました。")
}

// Markdown形式で出力（β版）　DL処理にしようかと思ってやめて現在は新規タブで開く状態
function ConvertFocusToMarkdown() {
    if(document.getElementById("attr-noid").innerText=="") return;
    let spans = document.querySelectorAll("#focus li div span");
    let judgelevel = document.querySelector("#focus>li>ul").getAttribute("level").substring(11);
    let body = "## "+ document.getElementById("attr-text").value + "\n";
    for(let i = 0; i < spans.length; i++){
        let li = spans[i].closest("li");
        let ul = li.querySelector("ul");
        let levelstr = ul.getAttribute("level").substring(11);
        let level = Number(levelstr)-Number(judgelevel)+1;
        let tab = "";
        if(level>0 && level<20){
            for(let j = 0; j < level; j++){
                tab = "  " + tab;
            }
        }
        let text = tab + "- " + spans[i].innerText + "\n";
        body += text;
    }
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var blob = new Blob([bom,body], { "type" : "text/plain" });

    if (window.navigator.msSaveBlob) { 
        window.navigator.msSaveBlob(blob, "focus.md"); 

        // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
        // window.navigator.msSaveOrOpenBlob(blob, "test.txt"); 
    } else if (window.webkitURL && window.webkitURL.createObject) {
        // for Chrome
        window.open(window.webkitURL.createObjectURL(blob));
      }else {
        window.open(window.URL.createObjectURL(blob), '_blank');
        // document.getElementById("data-download").href = window.URL.createObjectURL(blob);
    }
}


// 検索（β版）　現在NOT検索が正しく働いていない模様
function clickSearch(){ // AND検索+OR検索+NOT検索
    var search_catch = document.getElementById("search-words").value; // 検索用のテキストエリアの値を取得する
    let searchwords = document.getElementById("searching");
    searchwords.innerText = "検索：" + search_catch;
    const q = document.querySelectorAll("ul#content li"); // li要素を取得する
    if(!search_catch){ // 検索欄が空の時
        for(let i = 0; i < q.length; i++) {q[i].classList.remove("hidden-search");} // 非表示を全てリセットする
        return
    }
    for(let i = 0; i < q.length; i++){
        q[i].classList.add("hidden-search"); // まず全てを非表示にする
    };
    let sOR = search_catch.split(" "); // 半角スペースでブロックにばらす
    let sAND = allsplit(sOR);
    for(let i = 0; i < q.length; i++){
        let n = q[i].innerHTML;
        let result = search(n,sAND) // trueならhidden
        if(result){
            q[i].classList.add("hidden-search");
        }else{
            q[i].classList.remove("hidden-search");
        }
    }
};
function splitwords(str,letter){ // 文字列を区切り文字でばらして配列を返す
    let array = new Array();
    for(let i = 0; i < str.length; i++){ // ブロックごとに
        array[i] = str[i].split(letter); // 区切り文字で更にバラす
    };
    return array;
}
function allsplit(sOR){ // 検索単語群を入れると検索単語の配列を返す
    let sNOT = new Array();
    sNOT = splitwords(sOR,"-"); // ここでマイナス記号は消えて文字の前に空要素ができる 2次元配列になる
    let sAND = new Array();
    for(let i = 0; i < sNOT.length; i++){
        sAND[i] = splitwords(sNOT[i],"+"); // プラス記号は消える 3次元配列になる
    }
    return sAND;
}
function search(str,sAND){ // 被検索文字列に対して+でばらした配列で検索をかける
    let t; // hidden判定（挙動確認用） 
    t = true; // まずhiddenになっているとする
    let tminus = 0; // マイナス検索をひとつでも満たすかチェック
    let tplus = 0; // OR検索をひとつでも満たすかチェック
    for(let i = 0; i < sAND.length; i++){ // 検索単語群それぞれについて
        let resultNOT = 0; // マイナス検索結果を入れる
        let result = 0; // 普通の検索結果を入れる
        if(sAND[i][0]==""){ // もしマイナス検索なら
            resultNOT = JudgeExactMatching(str,sAND[i][1]); // 条件を満たせば1が返る（1の時検索結果から除外する必要がある）
            tminus += resultNOT;// マイナスはひとつでも満たせば除去だから足していって0より大きいかを判定する
        }else{ // もしマイナス検索でないなら
            result = JudgeExactMatching(str,sAND[i][0]);
            tplus += result;
        }
    }
    if(tplus!=0) t = false; // 単語群がひとつでもあればhidden除去だが
    if(tminus!=0) t = true; // マイナスがひとつでもあればhidden
    return t
}
function JudgeExactMatching(card,words){ // wordsは一次元配列
    let TorF; // 全部掛けて1になるか判定するため　1か0を入れる
    let tester = 1; // 掛けられる元
    for(let i = 0; i < words.length; i++){
        if(card.includes(words[i])){ // もし単語を含んでいれば
            TorF = 1;
        }else{ // 含まなければ
            TorF = 0;
        }
        tester *= TorF;
    }
    return tester;
}

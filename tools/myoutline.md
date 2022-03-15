## Noratetsu's Outline

- お試し
  - https://nora-tetsu.github.io/mypage/tools/myoutline.html
- jsファイルの中身
  - https://github.com/nora-tetsu/mypage/blob/main/tools/myoutline.js
- htmlファイルの中身
  - https://github.com/nora-tetsu/mypage/blob/main/tools/myoutline.html


## お知らせ

- 2022/03/15
  - 初回起動時にfetchでサンプルデータ（説明書き）を取得するようにした
    - [説明用ページ](https://nora-tetsu.github.io/mypage/tools/myoutline_sample.html)は不要に
    - 「サンプルを再取得」で現在のデータを破棄してサンプルデータを再取得
- 2022/03/14
  - 下記「度々発生した種のバグ」記載


### 度々発生した種のバグ

タブリロード時に自動で保存するせいで、何らかの理由でデータがおかしくなった状態でリロードしても抜け出せないパターン…  
コンソールで`document.getElementById("content").innerHTML = ""`、localStorageを削除してリロードで解消（できるようにさっき書き換えた）

というか、コンソールで
```js
outlinedata = [{"noid":"Nm2eeIs20","position":1,"attr":"","text":"new node","from":"","source":"","note":""}];
document.getElementById("content").innerHTML = '<li noid="Nm2eeIs20" draggable="true" class=""><div><i class="focus-icon fa-search-plus" title="フォーカス"></i><i class="node-icon fa-caret-right" title="子項目を開閉"></i><span contenteditable="true">new node</span></div><ul level="node-level-2 " class=""></ul>'
```
を実行し、
localStorageの「outlinedata」の値を`[{"noid":"Nm2eeIs20","position":1,"attr":"","text":"new node","from":"","source":"","note":""}]`、  
「outlineHTML」の値を`<li noid="Nm2eeIs20" draggable="true" class=""><div><i class="focus-icon fa-search-plus" title="フォーカス"></i><i class="node-icon fa-caret-right" title="子項目を開閉"></i><span contenteditable="true">new node</span></div><ul level="node-level-2 " class=""></ul>`  
にしてリロードで初期値に戻るか。

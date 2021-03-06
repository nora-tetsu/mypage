## Noratetsu's Outline

- お試し
  - https://nora-tetsu.github.io/mypage/tools/myoutline.html
- jsファイルの中身
  - https://github.com/nora-tetsu/mypage/blob/main/tools/myoutline.js
- htmlファイルの中身
  - https://github.com/nora-tetsu/mypage/blob/main/tools/myoutline.html


## お知らせ

- 2022/03/16
  - リンク/バックリンク表示位置をメタデータ欄右上→メタデータ欄左下に変更
  - **説明を更新しました。サンプル再取得でご確認いただけます。**
    - ツールをご利用になっている場合は「保存」「呼出」をご活用ください。
  - ペースト時に多重にペーストされてしまうのを修正（できた気がする）
  - D&D時に場合によってエラーが出ていたのをtry...catchで処理
  - ヘッダーのScrapboxを開く機能を付与し忘れていたのを修正
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

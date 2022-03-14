## Noratetsu's Outline

- お試し（動くはず…）
  - https://nora-tetsu.github.io/mypage/tools/myoutline.html
- jsファイル
  - https://github.com/nora-tetsu/mypage/blob/main/tools/myoutline.js
- 操作方法等（ノードの開閉のみ可能の説明用ページ）
  - https://nora-tetsu.github.io/mypage/tools/myoutline_sample.html

## 度々発生した種のバグ

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
にしてリロードで直るか。

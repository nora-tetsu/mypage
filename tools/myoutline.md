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


# Hand-Over

## client
```
├─dist :ビルド出力フォルダ
├─src
│  angular.json :Angularの設定ファイル
```

### client/src
```
│  index.html :フロントのエントリーポイント(プログラム等全てをここでロードする)
│  main.server.ts :アプリ高速化にかかるファイル(原則変更不要)
│  main.ts :上記同様
│  manifest.webmanifest :PWAに関するメイン設定ファイル
│  polyfills.ts
│  styles.scss :グローバルscss
│
├─app
│  │  app-routing.module.ts :ルーティング設定
│  │  app.component.html
│  │  app.component.scss
│  │  app.component.ts
│  │  app.module.ts :モジュール設定
│  │  mat-paginator-jp.ts :MatTarble翻訳オーバーライドクラス(現状不要)
│  │
│  ├─components
│  │  ├─account :/maintainance の実態
│  │  ├─dashboard
│  │  ├─device-list
│  │  ├─dialogs :各ダイアログ群
│  │  │  ├─account-delete
│  │  │  ├─account-log-delete
│  │  │  ├─card-delete
│  │  │  ├─card-edit
│  │  │  ├─card-register
│  │  │  ├─device-delete
│  │  │  ├─device-edit
│  │  │  ├─device-register
│  │  │  ├─device-tmpopen
│  │  │  ├─home-update
│  │  │  ├─member-delete
│  │  │  ├─member-dialog
│  │  │  ├─member-edit
│  │  │  ├─navi-member-link
│  │  │  └─navi-qr
│  │  ├─help :mdファイルを表示するためのコンポーネント
│  │  ├─home :メイン画面ラッパーコンポーネント
│  │  ├─log
│  │  ├─login
│  │  ├─matprogressspinner :ロード用画面コンポーネント
│  │  ├─member
│  │  ├─navi
│  │  ├─nfc
│  │  ├─reset
│  │  ├─reset-init
│  │  ├─stamp-dialog :手動打刻コンポーネント
│  │  ├─status-list
│  │  ├─tutrial-modal 
│  │  ├─work-hours
│  │  └─work-hours-chart
│  ├─guards :ルーティングガード群
│  │      admin.guard.ts :管理者か一般者か判断するフィルター
│  │      auth.guard.ts :認証フィルター
│  │      init.guard.ts :初期パスワードフィルター
│  │
│  ├─models :モデル群、データ型インターフェース
│  │      card.ts　
│  │      device.ts
│  │      filter.ts
│  │      holiday.ts
│  │      log.ts
│  │      member.ts
│  │      message.ts
│  │      user.ts
│  │      workHours.ts
│  │
│  └─services :webアプリ内API群
│          auth.service.ts :認証系
│          db.service.ts :DB交信系
│          spinner.service.ts :ロード画面
│
├─assets :静的ファイル
│  │  .gitkeep
│  │  README.md
│  │
│  └─icons :基本的なサイズを一通り用意
├─environments
└─styles
        variables.scss :色変数定義
```

## server
```
│  app.js :サーバーアプリの実態
├─backup :AWSバックアップ用プログラム
├─bin
│   www :webサーバーエントリーポイント
├─models :DBスキーマ
│      card.js 
│      device.js
│      holiday.js
│      log.js
│      member.js
│      message.js
│      user.js
├─routes :サーバーAPI群
│      authRouter.js :認証API
│      dbRouter.js :webアプリ間API、DBのCRUDが主体で認証制限あり
│      doorRouter.js :端末間API
└─test :パッチなど
```

## 概要
フロントエンドはフロントエンドフレームワークであるAngularで作成しています。UIコンポーネントライブラリとしてAngular Materialを併用しています。Angularをビルドするのにnode.jsのインストールが必要で、angular cliを利用するとコンポーネント作成やビルド、ローカル実行など簡単に行え、ほぼ必須な立ち位置です。<br>
バックエンドではnode.js上のwebサーバーライブラリであるExpressを使っています。上記でビルドした静的ファイル群をExpressからダウンロードする形で、クライアント側を実現しており、他にDBを含むAPIサーバとしての役割になっています。後述しますが、Expressアプリはlocalhostとしてwebサーバを起動します。<br>
実運用ではApacheを最も外側のwebサーバーとして運用しており、サーバ内のlocalhostにマップする形でリバースプロキシとして利用しています。ExpressアプリをApacheのようなデーモンソフトとして起動しておくためにpm2というnode.js用デーモン化ソフトを使っています。<br>
pm2では、もちろんpm2自体がデーモン化しているわけですが、サーバ起動時のExpressアプリの振る舞いやExpressアプリのログ出力などを含めてpm2を通して設定しなければならない項目があります。<br>


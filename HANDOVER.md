# Hand-Over

## client
```
├─dist
├─src
│  angular.json
```

### client/src
```
│  index.html
│  main.server.ts
│  main.ts
│  manifest.webmanifest
│  polyfills.ts
│  styles.scss
│
├─app
│  │  app-routing.module.ts
│  │  app.component.html
│  │  app.component.scss
│  │  app.component.ts
│  │  app.module.ts
│  │  mat-paginator-jp.ts
│  │
│  ├─components
│  │  ├─account
│  │  ├─dashboard
│  │  ├─device-list
│  │  ├─dialogs
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
│  │  ├─help
│  │  ├─home
│  │  ├─log
│  │  ├─login
│  │  ├─matprogressspinner
│  │  ├─member
│  │  ├─navi
│  │  ├─nfc
│  │  ├─reset
│  │  ├─reset-init
│  │  ├─stamp-dialog
│  │  ├─status-list
│  │  ├─tutrial-modal
│  │  ├─work-hours
│  │  └─work-hours-chart
│  ├─guards
│  │      admin.guard.ts
│  │      auth.guard.ts
│  │      init.guard.ts
│  │
│  ├─models
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
│  └─services
│          auth.service.ts
│          db.service.ts
│          spinner.service.ts
│
├─assets
│  │  .gitkeep
│  │  README.md
│  │
│  └─icons
├─environments
└─styles
        variables.scss
```

## server
```
│  app.js
├─backup
├─bin
│   www
├─models
│      card.js
│      device.js
│      holiday.js
│      log.js
│      member.js
│      message.js
│      user.js
├─routes
│      authRouter.js
│      dbRouter.js
│      doorRouter.js
└─test
```
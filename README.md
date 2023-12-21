pnpm install -D @base-stone/librarys
https://unpkg.com/@base-stone/librarys


## 常规项目代码目录

```
├── fun.ts
├── main.ts
├── request.ts
├── store.ts
└── utils.ts
    
```

## Store 使用
```
  import { localStore, sessionStore } from '@base-stone/librarys' 
  localStore.set("name", {age: 1}) //localStorage
  localStore.get("name")
  sessionStore.set("name", {age: 1}) //sessionStorage
  sessionStore.get("name")
```

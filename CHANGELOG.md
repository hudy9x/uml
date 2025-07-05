## What's Changed

✨ Features

- Save uml as file ([0c3b4ef](../../commit/0c3b4ef))
- Auto update (#7) ([6b27fcf](../../commit/6b27fcf))

🐛 Bug Fixes

- Remove notes temporary ([3dc9f4e](../../commit/3dc9f4e))
- Reset the tauri.conf.json file to the original before generating release.json file ([e999a5c](../../commit/e999a5c))
- Use nodejs script to update pubKey instead of shell script, cuz it can not run cross-platform correctly ([382cb8c](../../commit/382cb8c))
- Generate new sign and create a new step in pipeline to update public key to tauri.conf.json file ([44ca91e](../../commit/44ca91e))
- Change sign key ([511176b](../../commit/511176b))
- Add TAURI_SIGNING_PRIVATE_KEY_PASSWORD ([c6a6c96](../../commit/c6a6c96))
- Add TAURI_SIGNING_PRIVATE_KEY to build step ([be3f6f5](../../commit/be3f6f5))
- Generate new public key and add the private key to github variable (#8) ([887c966](../../commit/887c966))

♻️ Refactoring

- Get the signature that returns by the tauri_build step ([911646f](../../commit/911646f))

🔨 Other Changes

- Group actions into a dropdown menu ([033fd81](../../commit/033fd81))
- So, when building process ran out of time the upload latest.json step wasn't interupted. That's why it doesn't exist on the lastest release. Now open window platform and rebuild again ([c16cc57](../../commit/c16cc57))
- Try to add a timeout to Tauri build step ([5c792d4](../../commit/5c792d4))
- Found the latest.json at the root folder now try the last time ([62b7d66](../../commit/62b7d66))
- Debug: list all files in current folder and try to open ./latest.json file ([d590b7e](../../commit/d590b7e))
- Debug: switch command and find latest.json first ([590cb9c](../../commit/590cb9c))
- Debug: add commands to find latest.json ([25b2267](../../commit/25b2267))
- Debug: find the latest.json file ([4323ef2](../../commit/4323ef2))
- Debug: echo the signature for testing ([970af0c](../../commit/970af0c))
- Use macos-latest to generate release.json file ([b5d96f1](../../commit/b5d96f1))
- Remove .key and .key.pub before generating a new one ([78a7cb5](../../commit/78a7cb5))


📋 Full Changelog: [6b27fcf...033fd81](../../compare/6b27fcf...033fd81)
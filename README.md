# todo-app

ตัวอย่างโปรเจกต์ขนาดเล็กสำหรับทดลองการทำงานร่วมกันระหว่าง **คน, AI และ GitHub**

ตัวแอปเป็น Todo แบบง่าย ใช้ HTML, CSS และ JavaScript เก็บข้อมูลไว้ใน `localStorage`
ไม่มี backend และไม่มีขั้นตอน build จึงเปิด `index.html` เพื่อทดลองได้ทันที

## Repo นี้มีไว้ทำอะไร

ประโยชน์หลักของ repo นี้ไม่ใช่ความซับซ้อนของแอป Todo แต่คือการสาธิต workflow
สำหรับพัฒนาโปรแกรมด้วย AI อย่างปลอดภัยและตรวจสอบย้อนหลังได้:

- คนเปิด PR แล้วให้ AI ตรวจโค้ดอัตโนมัติ
- AI เปิด PR แล้วคนตรวจและสั่งให้ AI แก้ไขผ่านคอมเมนต์
- ทุกการเปลี่ยนแปลงอยู่ใน PR, review และ GitHub Actions
- CI ตรวจโค้ดก่อน merge
- Branch protection ป้องกันการเปลี่ยนแปลงที่ไม่ผ่านการตรวจ
- Watchdog แจ้งเตือนหากมี commit ไปถึง `main` โดยไม่ผ่าน PR

จึงใช้ repo นี้เป็น **ห้องทดลอง** หรือ **ต้นแบบสำหรับนำ workflow ไปใช้กับ repo อื่น**
ได้ง่าย ไม่ใช่ Todo app สำหรับใช้งานจริงในระดับ production

## วิธีทำงานแบบสั้น ๆ

```text
คนเปิด Issue หรือ PR
        |
        v
สั่ง AI ผ่านคอมเมนต์ /opencode หรือ /oc
        |
        v
AI แก้โค้ดและเปิด/อัปเดต PR
        |
        v
CI + AI review ตรวจสอบ
        |
        v
คนตรวจ อนุมัติ และ merge
```

## ผู้มีส่วนร่วม

| ผู้มีส่วนร่วม | หน้าที่ |
|---|---|
| เจ้าของ repo | สั่งงาน ตรวจ review อนุมัติ และ merge |
| Local agent | ช่วยแก้โค้ดจากเครื่องของเรา |
| Cloud agent | รับคำสั่งจากคอมเมนต์ `/opencode` หรือ `/oc` ใน GitHub |

## GitHub Actions

| Workflow | หน้าที่ |
|---|---|
| `opencode.yml` | รับคำสั่งจากเจ้าของ repo ผ่านคอมเมนต์ แล้วแก้โค้ดหรือเปิด PR |
| `opencode-review.yml` | ตรวจ PR อัตโนมัติด้วย OpenCode |
| `direct-push-watchdog.yml` | แจ้งเตือนเมื่อมี commit ไป `main` โดยไม่ผ่าน PR |
| `ci.yml` | ตรวจ JavaScript และไฟล์สำคัญของโปรเจกต์ |

PR ที่เปิดโดย Dependabot จะข้าม automatic OpenCode review เพราะ Dependabot
ไม่มีสิทธิ์เขียนคอมเมนต์ แต่เจ้าของ repo ยังสั่ง `/opencode ...` ใน PR เหล่านั้นได้

## ทดลองใช้งานแอป

1. เปิดไฟล์ `index.html` ในเบราว์เซอร์
2. เพิ่มรายการ Todo
3. ดับเบิลคลิกข้อความเพื่อแก้ไข
4. ใช้ปุ่มกรองรายการ หรือกดล้างรายการที่เสร็จแล้ว

ข้อมูลจะถูกเก็บไว้ในเบราว์เซอร์เครื่องนั้นเท่านั้น ไม่มีฐานข้อมูลกลาง

## ทดลอง workflow ของ AI

1. เปิด Issue หรือ PR
2. เขียนคอมเมนต์ เช่น:

   ```text
   /opencode อธิบายการทำงานของไฟล์นี้
   ```

   หรือ:

   ```text
   /oc แก้บั๊กนี้และเพิ่มการตรวจสอบที่จำเป็น
   ```

3. ตรวจ branch, PR, review และผล CI
4. แก้ไขตาม review แล้ว merge เมื่อทุกอย่างเรียบร้อย

คำสั่งของ AI จำกัดไว้เฉพาะเจ้าของ repo เพื่อป้องกันผู้อื่นนำ Actions และ API key
ไปใช้งานโดยไม่ได้รับอนุญาต

## ถ้าจะนำไปใช้กับ repo อื่น

ต้องติดตั้ง OpenCode GitHub App, เพิ่ม secret `OPENCODE_API_KEY`, ตั้งค่า branch
protection และตรวจสอบ workflow ให้เหมาะกับสิทธิ์ของ repo ก่อนใช้งานจริง

กฎและรายละเอียดเชิงลึกอยู่ใน:

- [`AGENTS.md`](AGENTS.md) - กฎการทำงานของ repo
- [`.opencode/skills/pr-flow/SKILL.md`](.opencode/skills/pr-flow/SKILL.md) - ขั้นตอนการทำงานแบบ PR
- [`docs/GITHUB-SETUP.md`](docs/GITHUB-SETUP.md) - คู่มือตั้งค่าและบทเรียนจากการใช้งานจริง

## โครงสร้างไฟล์หลัก

```text
index.html / styles.css / app.js   ตัวแอป Todo
vercel.json                        การตั้งค่า deploy แบบ static
.github/workflows/                 workflow ของ GitHub Actions
.opencode/skills/                  กฎการทำงานของ AI
AGENTS.md                          กฎความปลอดภัยและการพัฒนา
docs/GITHUB-SETUP.md                คู่มือตั้งค่า GitHub และ OpenCode
```

## License

MIT - ดูรายละเอียดใน [`LICENSE`](LICENSE)

# คู่มือเรียนรู้ GitHub และ AI จาก todo-app

เอกสารนี้ใช้ `todo-app` เป็นห้องทดลองสำหรับเรียนรู้การพัฒนาซอฟต์แวร์
ร่วมกับ GitHub Actions และ AI ตั้งแต่การแก้โค้ดจนถึงการ deploy

## เป้าหมาย

เมื่อเรียนจบควรสามารถ:

- เข้าใจ repository, branch, commit และ remote
- เปิดและอ่าน Pull Request ได้
- review diff และแยก bug จริงออกจากข้อเสนอแนะได้
- อ่าน GitHub Actions และแก้ workflow ที่ล้มเหลวได้
- ใช้ permissions และ secrets อย่างปลอดภัย
- สั่ง AI ให้ทำงานเป็นขอบเขตและตรวจงานที่ AI สร้าง
- ทดสอบเว็บและตรวจ Preview deployment
- ใช้ Dependabot และ branch protection ได้อย่างถูกต้อง

เส้นทางหลักคือ:

```text
คิดโจทย์ -> Issue -> branch -> แก้โค้ด -> PR -> CI -> review
-> แก้ตาม feedback -> approve -> merge -> deploy -> ตรวจผล
```

## 1. เข้าใจ Repository

Repository คือพื้นที่เก็บ source code, ประวัติการแก้ไข, branch, Issue,
Pull Request, workflow, เอกสาร และ configuration

ใน repo นี้มีสองส่วน:

```text
index.html / styles.css / app.js   ตัวแอป Todo
.github/workflows/                 GitHub Actions
AGENTS.md                          กฎสำหรับ agent และการทำงาน
.opencode/                         skill สำหรับ PR workflow
docs/                              คู่มือและบทเรียน
```

ให้จำแนกให้ได้ว่า:

- เปลี่ยนหน้าตาแอป: `index.html` หรือ `styles.css`
- เปลี่ยน behavior: `app.js`
- เปลี่ยนการตรวจอัตโนมัติ: `.github/workflows/`
- เปลี่ยนกฎของ agent: `AGENTS.md`
- อธิบาย repo หรือสอนผู้ใช้: `README.md` หรือ `docs/`

## 2. Git พื้นฐาน

Git บันทึกการเปลี่ยนแปลงเป็น commit:

```text
ไฟล์บนเครื่อง -> git add -> staging area -> git commit
-> git push -> GitHub
```

คำสั่งที่ควรรู้:

```bash
git status
git diff
git log --oneline
git add <file>
git commit -m "docs: update guide"
git push
```

ความหมายของคำสำคัญ:

- **Working tree**: ไฟล์ที่กำลังแก้บนเครื่อง
- **Staging area**: ไฟล์ที่เลือกไว้สำหรับ commit
- **Commit**: จุดบันทึกการเปลี่ยนแปลงหนึ่งชุด
- **Remote**: repository บน GitHub เช่น `origin`

แบบฝึกหัด: แก้เอกสารเล็กน้อย ดู `status` และ `diff` แล้ว commit และ push
เพื่อสังเกตการเดินทางของการเปลี่ยนแปลงจากเครื่องไป GitHub

## 3. Branch

Branch คือเส้นทางการพัฒนาที่แยกจาก `main`:

```text
main
 |
 +-- feat/add-search
```

ให้รักษา `main` เป็นเวอร์ชันที่เชื่อถือได้ และใช้ branch อื่นสำหรับงานใหม่
ตัวอย่างชื่อ branch:

```text
feat/task-counter
fix/empty-task
docs/update-readme
chore/update-dependencies
```

หนึ่ง branch ควรมีงานหนึ่งเรื่อง เพื่อให้ diff และ review เข้าใจง่าย

## 4. Pull Request

Pull Request คือคำขอให้นำการเปลี่ยนแปลงจาก branch หนึ่งเข้าอีก branch หนึ่ง
และเป็นพื้นที่สำหรับ:

- อธิบายเหตุผลของการเปลี่ยนแปลง
- อ่าน diff
- รับ review
- ดูผล CI
- คุยกับคนและ AI
- เก็บ audit trail

PR ที่ดีควรตอบคำถาม:

1. แก้ปัญหาอะไร
2. เปลี่ยนอะไร
3. ทดสอบอย่างไร
4. มีความเสี่ยงหรือข้อจำกัดอะไร

ตัวอย่างโครงสร้างคำอธิบาย:

```md
## เหตุผล

อธิบายปัญหาและเหตุผลที่ต้องแก้

## การเปลี่ยนแปลง

- รายการการเปลี่ยนแปลง

## การทดสอบ

- คำสั่งหรือวิธีทดสอบ
```

## 5. อ่าน Diff และ Review

ใน diff:

```diff
- โค้ดเดิม
+ โค้ดใหม่
```

ลำดับ review ที่แนะนำ:

1. อ่านเป้าหมายของ PR
2. ตรวจว่า scope มีเพียงเรื่องเดียว
3. ตรวจ behavior กรณีปกติ
4. ตรวจ edge case เช่น input ว่าง ข้อมูลยาว และกดปุ่มซ้ำ
5. ตรวจ security เช่น secret และการใช้ข้อมูลผู้ใช้
6. ตรวจว่ามีหลักฐานการทดสอบ

แยกให้ชัดระหว่าง:

- bug ที่ควรแก้ก่อน merge
- security risk
- ข้อเสนอแนะด้าน UX หรือ style
- สิ่งที่ตรวจแล้วถูกต้อง

อย่าปฏิเสธ PR เพียงเพราะไม่ตรงกับความชอบส่วนตัว และอย่า merge เพียงเพราะ
CI ผ่านโดยไม่อ่าน diff

## 6. GitHub Actions

ใน repo นี้มี workflow หลัก:

| Workflow | หน้าที่ |
|---|---|
| `ci.yml` | ตรวจ JavaScript และไฟล์สำคัญ |
| `opencode-review.yml` | ให้ OpenCode review PR อัตโนมัติ |
| `opencode.yml` | รับคำสั่ง `/opencode` หรือ `/oc` |
| `direct-push-watchdog.yml` | แจ้งเตือน commit ที่เข้า `main` โดยไม่ผ่าน PR |

โครงสร้าง workflow ที่ควรรู้:

```yaml
name: ci
on:
  pull_request:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout
      - run: node --check app.js
```

- `on`: เหตุการณ์ที่ทำให้ workflow เริ่ม
- `jobs`: งานที่ต้องทำ
- `steps`: ขั้นตอนของงาน
- `permissions`: สิทธิ์ของ token
- `env`: ตัวแปรแวดล้อม

แบบฝึกหัด: เพิ่ม check ที่ตรวจว่าไฟล์สำคัญมีอยู่ แล้วเปิด PR เพื่อดู log

## 7. Permissions และ Secrets

ให้สิทธิ์น้อยที่สุดเท่าที่จำเป็น:

```yaml
permissions:
  contents: read
```

เหมาะกับ CI ที่อ่านโค้ดอย่างเดียว ส่วน agent ที่ต้อง push อาจต้องใช้
`contents: write`, `pull-requests: write` และ `issues: write`

ค่าลับต้องอยู่ใน GitHub Secrets:

```yaml
env:
  OPENCODE_API_KEY: ${{ secrets.OPENCODE_API_KEY }}
```

ห้าม commit `.env`, token หรือ API key และอย่าแสดง secret ใน log
ทุกครั้งที่เพิ่ม permission ให้ถามว่า workflow ถูกโจมตีแล้วความเสียหายสูงสุดคืออะไร

## 8. ทำงานร่วมกับ OpenCode

คำสั่ง AI ที่ดีควรมีเป้าหมาย ขอบเขต acceptance criteria และวิธีทดสอบ:

```text
/oc เพิ่ม search สำหรับ task

ขอบเขต:
- แก้เฉพาะ index.html และ app.js
- ไม่เพิ่ม dependency
- ไม่เปลี่ยนรูปแบบ localStorage

เงื่อนไข:
- ไม่สนตัวพิมพ์เล็กใหญ่
- แสดงข้อความเมื่อไม่พบผลลัพธ์
- filter เดิมต้องยังทำงาน

การตรวจสอบ:
- รัน node --check app.js
- สรุปไฟล์ที่เปลี่ยนเป็นภาษาไทย
```

ใช้คำสั่งแบบอ่านอย่างเดียวได้เมื่อยังไม่ต้องการแก้โค้ด:

```text
/oc อธิบาย app.js เป็นภาษาไทย ห้ามแก้ไฟล์และห้ามเปิด PR
```

แบ่งงานใหญ่เป็นหลาย Issue/PR แทนการสั่ง AI ให้สร้างระบบทั้งหมดในครั้งเดียว

## 9. การทดสอบ

`node --check app.js` ตรวจ syntax เท่านั้น ไม่ได้ยืนยันว่า UI ทำงานถูกต้อง
ควรทดสอบหลายระดับ:

- **Syntax**: ตรวจ JavaScript
- **Manual browser**: เพิ่ม ลบ เสร็จ แก้ไข filter และ refresh
- **Edge case**: input ว่าง ความยาวสูงสุด งานจำนวนมาก และกดปุ่มซ้ำ
- **Browser smoke test**: เปิดหน้าและตรวจว่าปุ่มหลักใช้งานได้

ผลทดสอบที่ดีต้องเชื่อมกับ behavior ที่ผู้ใช้สนใจ ไม่ใช่เพียงบอกว่า
คำสั่งหนึ่งผ่าน

## 10. Deploy และ Preview

โดยทั่วไป:

```text
PR branch -> Preview deployment
main      -> Production deployment
```

ก่อน merge ให้ตรวจ Preview URL, CSS, JavaScript, browser console, responsive
layout และการเก็บข้อมูลหลัง refresh

## 11. Dependabot

เมื่อ Dependabot เปิด PR ให้อ่านประเภทการอัปเดต changelog และ breaking change
ก่อน merge ตรวจ:

1. CI ผ่านหรือไม่
2. workflow และ permissions ยังถูกต้องหรือไม่
3. action มาจากแหล่งที่เชื่อถือได้หรือไม่
4. major version เปลี่ยน behavior หรือไม่

Dependency update ไม่ใช่เพียงการเปลี่ยนตัวเลข version เพราะอาจเปลี่ยน API,
runtime หรือ security behavior

## 12. Branch Protection และการ Merge

workflow ที่ปลอดภัยคือ:

```text
สร้าง branch -> แก้โค้ด -> เปิด PR -> CI + review
-> แก้ feedback -> approval -> squash merge -> deploy
```

กฎที่ควรมี:

- ต้องใช้ PR
- ต้องมี approval
- ต้องผ่าน required checks
- ยกเลิก approval เมื่อมี push ใหม่
- ห้าม force-push และห้ามลบ `main`

อย่าใช้ admin bypass เป็นเรื่องปกติ และตรวจ commit ล่าสุดก่อน merge เสมอ

## 13. ออกแบบ PR ให้ดี

PR ควรมีวัตถุประสงค์เดียว เปลี่ยนไฟล์เท่าที่จำเป็น มี acceptance criteria
และมีผลทดสอบที่อ่านได้

ไม่ควรรวมงานลักษณะนี้ไว้ใน PR เดียว:

```text
เพิ่ม search + แก้ security + เปลี่ยน README + อัปเดต Actions
```

ควรแยกเป็น PR ของ feature, security และ documentation เพื่อให้ review ง่าย
และย้อนกลับได้ตรงจุด

## 14. Issue และ Project Management

ใช้ Issue เป็นหน่วยงาน และระบุสิ่งที่ไม่รวมในงาน:

```md
## ปัญหา

เกิดปัญหาอะไร

## เป้าหมาย

ต้องการให้เกิดอะไร

## Acceptance criteria

- [ ] เงื่อนไขที่ 1
- [ ] เงื่อนไขที่ 2

## ไม่รวมในงานนี้

- ไม่ทำ backend
- ไม่เปลี่ยนรูปแบบข้อมูล
```

การระบุว่าไม่รวมอะไรช่วยป้องกัน AI ขยาย scope เอง

## 15. Security สำหรับ AI Agent

หลักการสำคัญ:

- **Least privilege**: ให้สิทธิ์เท่าที่จำเป็น
- **Human approval**: ให้คนตัดสินใจ merge
- **Audit trail**: ใช้ Issue และ PR เป็นหลักฐาน
- **No secrets in code**: ไม่ฝัง token ใน source
- **OWNER-only trigger**: จำกัดผู้สั่ง agent
- **Review generated changes**: ตรวจงาน AI ทุกครั้ง

คำถามที่ควรถาม:

- AI เข้าถึง secret หรือไม่
- AI push ไป branch ไหน
- AI merge เองได้หรือไม่
- workflow จาก fork ใช้สิทธิ์อะไร
- ถ้า workflow ถูกโจมตีจะเสียหายแค่ไหน
- มีวิธีย้อนกลับหรือไม่

## 16. แก้ปัญหาเมื่อ workflow ล้มเหลว

ทำตามลำดับ:

1. เปิด Actions run
2. ดู job ที่ fail
3. อ่าน error แรกใน log
4. แยกว่าเป็น code, permission หรือ infrastructure error
5. ตรวจ event และ commit ที่ trigger
6. แก้เฉพาะต้นเหตุ
7. push commit ใหม่
8. ตรวจ run ใหม่
9. บันทึกบทเรียนเมื่อเป็นปัญหาที่อาจเกิดซ้ำ

ตัวอย่างวงจรจริง:

```text
อ่าน log -> พบคำสั่ง gh api ผิด -> แก้ workflow
-> เปิด PR -> CI ผ่าน -> merge -> ตรวจ run บน main
```

## แผนฝึกปฏิบัติ

### สัปดาห์ที่ 1: Git และ PR

สร้าง branch แก้ README เปิด PR อ่าน diff และ merge

### สัปดาห์ที่ 2: ฟีเจอร์ Todo

ทำ task counter, search, priority และ due date โดยแยกเป็น PR

### สัปดาห์ที่ 3: Review และ Actions

ทำให้ CI fail โดยตั้งใจ อ่าน log แก้ให้ผ่าน และเพิ่ม check ใหม่

### สัปดาห์ที่ 4: AI workflow

ให้ OpenCode อธิบายโค้ด เพิ่มฟีเจอร์ review และแก้ตาม comment

### สัปดาห์ที่ 5: Security

ตรวจ branch protection, permissions, Dependabot และ secret scanning

### สัปดาห์ที่ 6: Deployment

แก้ UI ดู Preview ทดสอบบนมือถือ merge ตรวจ production และฝึก rollback

## หลักคิดสำคัญ

ทุกครั้งที่เปลี่ยนแปลง ให้ถาม:

- การเปลี่ยนแปลงนี้แก้ปัญหาอะไร
- ใครเป็นคนตรวจ
- จะพิสูจน์ได้อย่างไรว่าทำงาน
- ถ้าพังจะรู้ได้อย่างไร
- ถ้าต้องย้อนกลับจะทำอย่างไร
- AI มีสิทธิ์มากเกินจำเป็นหรือไม่

เป้าหมายของการเรียนรู้ repo นี้จึงไม่ใช่แค่การทำ Todo app แต่คือการเข้าใจ
วงจรพัฒนาซอฟต์แวร์จริง: `คิด -> แก้ -> review -> test -> deploy -> monitor -> rollback`

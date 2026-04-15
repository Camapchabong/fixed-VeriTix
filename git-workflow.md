# 📘 Git Workflow (Team Project)

> **KHÔNG BAO GIỜ code trực tiếp trên nhánh `main`.**
> Mọi thay đổi phải đi theo flow:

```
feature → dev → staging → main
```

---

# 🌿 1. Cấu trúc nhánh

| Nhánh       | Vai trò                              |
| ----------- | ------------------------------------ |
| `main`      | Production (code chạy thật, ổn định) |
| `staging`   | Test gần production                  |
| `dev`       | Nhánh dev chung của team             |
| `feature/*` | Nhánh làm task riêng                 |

---

# 🚀 2. Tạo nhánh

## 🔹 Tạo `dev` và `staging` (chỉ làm 1 lần)

```bash
git checkout main
git pull origin main

git checkout -b dev
git push -u origin dev

git checkout main
git checkout -b staging
git push -u origin staging
```

---

## 🔹 Tạo nhánh feature

👉 Luôn tạo từ `dev` (KHÔNG phải main)

```bash
git checkout dev
git pull
git checkout -b <ten-nhanh>
```

---

## 🏷️ Quy tắc đặt tên nhánh

Format:

```
<type>/<mo-ta>
```

| Loại     | Ví dụ                  |
| -------- | ---------------------- |
| feature  | `feature/uc01-map-gis` |
| fix      | `fix/login-error`      |
| docs     | `docs/api`             |
| refactor | `refactor/dashboard`   |

---

# ✍️ 3. Commit

## Format:

```
<type>: <mo-ta>
```

### Ví dụ tốt

```bash
git commit -m "feat: hien thi ban do GIS"
git commit -m "fix: loi khong load API"
git commit -m "refactor: tach component"
```

### ❌ Không nên

```bash
git commit -m "update"
git commit -m "done"
```

---

# 📤 4. Push code

```bash
git push -u origin <branch>
```

---

# 🔄 5. Workflow làm việc

## 🔹 Bước 1: Tạo feature

```bash
git checkout dev
git pull
git checkout -b feature/xxx
```

---

## 🔹 Bước 2: Code & commit

```bash
git add .
git commit -m "feat: ..."
```

---

## 🔹 Bước 3: Push

```bash
git push -u origin feature/xxx
```

---

## 🔹 Bước 4: Merge vào dev

```bash
git checkout dev
git pull
git merge feature/xxx
git push
```

---

## 🔹 Bước 5: Dev → Staging

```bash
git checkout staging
git pull
git merge dev
git push
```

---

## 🔹 Bước 6: Staging → Main

```bash
git checkout main
git pull
git merge staging
git push
```

---

# 🔁 6. Cập nhật code mới

👉 Luôn sync trước khi code tiếp

```bash
git checkout dev
git pull

git checkout feature/xxx
git merge dev
```

---

# ⚔️ 7. Xử lý conflict

```bash
# sửa file conflict
git add .

git merge --continue
# hoặc nếu rebase:
git rebase --continue
```

---

# 🔀 8. Pull Request

## Title

```
[UC01] hien thi ban do 
```

## Description

```
- hien thi ban do
- load marker
- filter theo quan

UC lien quan: UC01-UC05
```

---

# 🧹 9. Xoá branch sau khi merge

```bash
git branch -d feature/xxx
git push origin --delete feature/xxx
```

---

# 📊 Tổng flow

```
feature/xxx
     ↓
     dev
     ↓
  staging
     ↓
    main
```

---

# ⚠️ Quy tắc quan trọng

* ❌ Không code trên main
* ❌ Không merge feature → main
* ✅ Mỗi task = 1 branch
* ✅ Luôn pull trước khi code
* ✅ Merge theo flow: feature → dev → staging → main

---

# 💡 Best Practice

* Commit rõ ràng, có ý nghĩa
* Không commit "update", "done"
* Sync dev thường xuyên
* Dùng Pull Request để review code
* Xoá branch sau khi merge

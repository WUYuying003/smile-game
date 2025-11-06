# 🚀 快速开始指南

欢迎使用**笑容收集之旅**像素游戏！这是一个完整的网页游戏项目，可以免费部署到GitHub Pages。

## ⚡ 3分钟快速部署

### 选项1：网页操作（最简单）

1. **创建GitHub仓库**
   - 访问 https://github.com/new
   - Repository name: `smile-game`
   - 选择 "Public"
   - 点击 "Create repository"

2. **上传文件**
   - 在仓库页面点击 "Add file" → "Upload files"
   - 拖拽这3个文件：
     - ✅ `index.html`
     - ✅ `game.js`
     - ✅ `styles.css`
   - 点击 "Commit changes"

3. **启用GitHub Pages**
   - 点击 "Settings" → "Pages"
   - Source: 选择 `main` 分支
   - 点击 "Save"

4. **完成！**
   - 访问: `https://你的用户名.github.io/smile-game/`

---

### 选项2：命令行（推荐）

```bash
# 1. 进入项目文件夹
cd web_game

# 2. 快速初始化（替换成你的信息）
./init.sh 你的GitHub用户名 仓库名

# 例如: ./init.sh john smile-game

# 3. 推送到GitHub
git push -u origin main

# 4. 在GitHub启用Pages（Settings → Pages）
```

---

## 📂 项目文件

```
web_game/
├── 🎮 核心文件（必需）
│   ├── index.html      # 游戏页面
│   ├── game.js         # 游戏逻辑
│   └── styles.css      # 样式
│
├── 📖 文档
│   ├── README.md                # 项目说明
│   ├── QUICK_START.md          # 本文件
│   ├── DEPLOYMENT_GUIDE.md     # 详细部署教程
│   └── PROJECT_STRUCTURE.md    # 项目结构说明
│
└── 🛠️ 工具
    ├── init.sh         # 初始化脚本
    ├── deploy.sh       # 部署脚本
    └── TEST.html       # 本地测试页面
```

---

## 🎯 本地测试

### 方式1：使用测试页面

双击打开 `TEST.html`，然后点击"开始游戏"

### 方式2：使用Python服务器

```bash
# Python 3
cd web_game
python3 -m http.server 8000

# 访问: http://localhost:8000
```

### 方式3：使用VS Code Live Server

1. 安装 "Live Server" 扩展
2. 右键 `index.html` → "Open with Live Server"

---

## 🎮 游戏玩法

1. **目标**: 按数字顺序点击圆圈 (1→2→3→...)
2. **计时**: 每个目标10秒
3. **升级**: 完成所有目标进入下一关
4. **挑战**: 关卡越高，目标越多

### 控制
- 🖱️ **鼠标**: 点击圆圈
- 👆 **触摸屏**: 触摸圆圈
- ⌨️ **键盘**:
  - `R` - 重新开始
  - `ESC` - 暂停

---

## 🔄 更新游戏

修改后重新部署：

```bash
# 使用快速部署脚本
./deploy.sh

# 或手动操作
git add .
git commit -m "Update game"
git push
```

等待1-2分钟，刷新网页即可看到更新。

---

## 🎨 自定义游戏

### 修改颜色

编辑 `game.js`，找到 `COLORS` 对象：

```javascript
const COLORS = {
    bg: '#1a0d2e',           // 背景 - 深紫色
    primary: '#9d4edd',      // 主色 - 紫色
    accent: '#ffd60a',       // 强调 - 黄色
    // ... 改成你喜欢的颜色
};
```

### 修改难度

编辑 `game.js`：

```javascript
// 每个目标的时间（秒）
let targetTimer = 10.0;  // 改为 15.0 更简单

// 每关目标数量
targetsPerLevel = Math.min(2 + level - 1, 8);  // 改第一个数字
```

### 修改主角

编辑 `game.js` 中的 `SMILEY_SPRITE` 数组，这是一个16×16的像素矩阵。

---

## ❓ 常见问题

### Q: 显示404错误？
**A**: 等待5-10分钟，GitHub Pages需要构建时间。确保在Settings → Pages中已启用。

### Q: 游戏显示不正常？
**A**: 
1. 确认三个文件都已上传
2. 清除浏览器缓存 (Ctrl/Cmd + Shift + R)
3. 按F12查看控制台错误

### Q: 推送失败？
**A**:
```bash
# 检查远程仓库
git remote -v

# 如果没有，添加
git remote add origin https://github.com/用户名/仓库名.git
```

### Q: 手机上不流畅？
**A**: 在 `game.js` 中降低分辨率：
```javascript
canvas.width = 1280;   // 从1920改为1280
canvas.height = 720;   // 从1080改为720
```

---

## 📚 更多帮助

- 📖 **详细部署教程**: 查看 `DEPLOYMENT_GUIDE.md`
- 📁 **项目结构说明**: 查看 `PROJECT_STRUCTURE.md`
- 🎮 **游戏说明**: 查看 `README.md`
- 🌐 **GitHub Pages文档**: https://pages.github.com/

---

## 🎯 检查清单

部署前确认：
- [ ] 创建了GitHub仓库（Public）
- [ ] 上传了三个核心文件
- [ ] 启用了GitHub Pages
- [ ] 等待1-2分钟
- [ ] 访问URL测试

---

## 🎉 成功示例

你的游戏URL格式：
```
https://用户名.github.io/仓库名/
```

例如：
- 用户名: `john`
- 仓库名: `smile-game`
- URL: `https://john.github.io/smile-game/`

---

## 💡 下一步

- ✅ 部署成功后，分享URL给朋友
- 🎨 自定义颜色和难度
- 📱 在手机上测试
- 🌟 添加更多功能（音效、排行榜等）

---

## 🆘 需要帮助？

1. 查看 `DEPLOYMENT_GUIDE.md` 获取详细教程
2. 在GitHub仓库创建Issue
3. 参考GitHub Pages官方文档

---

**🚀 现在就开始部署吧！祝你成功！😊**

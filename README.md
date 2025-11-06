# 😊 笑容收集之旅 - Pixel Game

一个基于像素艺术风格的互动网页游戏，使用你的笑脸作为主角！

## 🎮 游戏特点

- **像素风格**：16×16像素的复古游戏美学
- **互动玩法**：按顺序点击圆圈收集笑容
- **紫黄配色**：冷色调紫色系 + 明亮黄色点缀
- **响应式设计**：支持1920×1080分辨率，自适应不同屏幕
- **触摸支持**：支持鼠标点击和触摸屏操作

## 🚀 在GitHub Pages上部署

### 步骤1：创建GitHub仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `smile-collection-game` (或任何你喜欢的名字)
   - Description: "笑容收集之旅 - 像素游戏"
   - 选择 "Public" (公开仓库)
   - 勾选 "Add a README file"
4. 点击 "Create repository"

### 步骤2：上传游戏文件

#### 方法A：通过GitHub网页界面上传

1. 进入你的仓库页面
2. 点击 "Add file" → "Upload files"
3. 将以下文件拖拽到上传区域：
   - `index.html`
   - `game.js`
   - `styles.css`
4. 在底部填写提交信息："Add game files"
5. 点击 "Commit changes"

#### 方法B：通过Git命令行上传（推荐）

```bash
# 1. 克隆你的仓库
git clone https://github.com/你的用户名/smile-collection-game.git
cd smile-collection-game

# 2. 复制游戏文件到仓库目录
cp /path/to/web_game/* .

# 3. 添加文件到Git
git add index.html game.js styles.css

# 4. 提交更改
git commit -m "Add pixel game files"

# 5. 推送到GitHub
git push origin main
```

### 步骤3：启用GitHub Pages

1. 进入你的仓库页面
2. 点击 "Settings" (设置)
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分：
   - Branch: 选择 `main`
   - Folder: 选择 `/ (root)`
5. 点击 "Save"
6. 等待1-2分钟，页面会显示：
   ```
   ✅ Your site is live at https://你的用户名.github.io/smile-collection-game/
   ```

### 步骤4：访问你的游戏

打开浏览器访问：
```
https://你的用户名.github.io/smile-collection-game/
```

🎉 恭喜！你的游戏现在已经在线了！

## 📱 分享给其他人

将上面的URL分享给朋友，他们可以直接在浏览器中玩你的游戏！

### 可选：使用自定义域名

1. 购买一个域名（如：smile-game.com）
2. 在仓库的 Settings → Pages → Custom domain 中添加你的域名
3. 在域名提供商处配置DNS记录指向GitHub Pages

## 🎯 游戏玩法

1. **目标**：按数字顺序（1→2→3→...）点击圆圈
2. **计时**：每个目标有10秒时间限制
3. **升级**：完成所有目标后进入下一关
4. **挑战**：关卡越高，目标数量越多（最多8个）

### 控制方式

- **鼠标**：点击目标圆圈
- **触摸屏**：触摸目标圆圈
- **键盘**：
  - `R` - 重新开始
  - `ESC` - 暂停

## 🛠️ 技术细节

- **分辨率**：1920×1080 px
- **像素比例**：16×16 px 网格
- **主角尺寸**：16×16 像素
- **技术栈**：纯HTML5 + CSS3 + JavaScript（无需外部依赖）
- **兼容性**：支持所有现代浏览器

## 🎨 配色方案

- **背景**：深紫色 (#1a0d2e, #2d1b4e)
- **主色调**：紫色系 (#9d4edd, #c77dff)
- **强调色**：黄色 (#ffd60a)
- **辅助色**：黑白灰

## 📝 更新游戏

修改游戏后更新到GitHub Pages：

```bash
# 1. 修改文件后提交
git add .
git commit -m "Update game"

# 2. 推送到GitHub
git push origin main

# 3. 等待1-2分钟，GitHub Pages会自动更新
```

## 🐛 故障排除

### 游戏无法显示？

1. 确认三个文件（index.html, game.js, styles.css）都在仓库根目录
2. 检查GitHub Pages是否已启用
3. 清除浏览器缓存后刷新页面
4. 打开浏览器开发者工具（F12）查看错误信息

### 部署后看到404错误？

- 等待5-10分钟，GitHub Pages需要时间构建
- 确认仓库是Public（公开）状态
- 检查URL是否正确

## 📧 支持

如有问题，可以：
1. 在GitHub仓库创建Issue
2. 查看GitHub Pages文档：https://pages.github.com/

## 📄 许可证

MIT License - 自由使用、修改和分享

---

**祝你游戏愉快！ 😊**

# Level 2 - Hand Tracking Coin Collection Game 🎮# 😊 笑容收集之旅 - Pixel Game



A web-based interactive game that uses **MediaPipe Hand Tracking** technology to detect hand gestures and collect coins by touching numbered targets in sequence.一个基于像素艺术风格的互动网页游戏，使用你的笑脸作为主角！



![Game Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) ![MediaPipe](https://img.shields.io/badge/MediaPipe-Hands-blue)## 🎮 游戏特点



## 🌟 Features- **像素风格**：16×16像素的复古游戏美学

- **互动玩法**：按顺序点击圆圈收集笑容

### Core Gameplay- **紫黄配色**：冷色调紫色系 + 明亮黄色点缀

- **Hand Tracking Technology**: Real-time hand detection using MediaPipe Hands- **响应式设计**：支持1920×1080分辨率，自适应不同屏幕

- **Camera Integration**: Uses webcam to track your index finger position- **触摸支持**：支持鼠标点击和触摸屏操作

- **Touch Detection**: Touch numbered targets in sequential order (1→2→3→...)

- **Progressive Difficulty**: 5 levels with increasing number of targets## 🚀 在GitHub Pages上部署

- **Time Challenge**: 10-second countdown for each target

- **Animated Coins**: Custom spinning coin sprite animation (8 frames)### 步骤1：创建GitHub仓库



### Visual Design1. 登录 [GitHub](https://github.com)

- **Pixel Art Style**: Retro gaming aesthetic with Press Start 2P font2. 点击右上角的 "+" → "New repository"

- **Purple/Yellow Theme**: Eye-catching color scheme3. 填写仓库信息：

- **Particle Effects**: Coins fly to score display on collection   - Repository name: `smile-collection-game` (或任何你喜欢的名字)

- **Real-time Video Feed**: Mirrored camera view for intuitive interaction   - Description: "笑容收集之旅 - 像素游戏"

- **Responsive UI**: Score panel, level indicator, timer, and camera status   - 选择 "Public" (公开仓库)

   - 勾选 "Add a README file"

### Game Mechanics4. 点击 "Create repository"

- Collect coins by touching targets with your index finger

- Targets must be touched in numeric order### 步骤2：上传游戏文件

- Wrong order triggers a warning modal

- Complete Level 5 to win and reveal the secret code#### 方法A：通过GitHub网页界面上传

- Press 'R' to restart at any time

1. 进入你的仓库页面

## 🎯 How to Play2. 点击 "Add file" → "Upload files"

3. 将以下文件拖拽到上传区域：

1. **Allow Camera Access**: Click "Enable Camera" when prompted   - `index.html`

2. **Position Your Hand**: Hold your hand in front of the webcam   - `game.js`

3. **Touch Targets**: Point your index finger at numbered targets in order   - `styles.css`

4. **Collect Coins**: Each successful touch adds to your score4. 在底部填写提交信息："Add game files"

5. **Complete Levels**: Finish all targets before time runs out5. 点击 "Commit changes"

6. **Win the Game**: Complete Level 5 to see the victory screen!

#### 方法B：通过Git命令行上传（推荐）

## 🚀 Live Demo

```bash

Play the game online: **[https://wuyuying003.github.io/week8/web_game/](https://wuyuying003.github.io/week8/web_game/)**# 1. 克隆你的仓库

git clone https://github.com/你的用户名/smile-collection-game.git

## 🛠️ Technology Stackcd smile-collection-game



- **HTML5 Canvas**: Game rendering (1920x1080 resolution)# 2. 复制游戏文件到仓库目录

- **Vanilla JavaScript**: Game logic and interactioncp /path/to/web_game/* .

- **CSS3**: Pixel art styling and animations

- **MediaPipe Hands**: Hand tracking and landmark detection# 3. 添加文件到Git

- **WebRTC**: Camera access via getUserMedia APIgit add index.html game.js styles.css



### External Libraries# 4. 提交更改

- [MediaPipe Hands](https://cdn.jsdelivr.net/npm/@mediapipe/hands/) - Hand trackinggit commit -m "Add pixel game files"

- [MediaPipe Camera Utils](https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/) - Camera management

- [MediaPipe Drawing Utils](https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/) - Visualization helpers# 5. 推送到GitHub

git push origin main

## 📁 Project Structure```



```### 步骤3：启用GitHub Pages

web_game/

├── index.html          # Main HTML structure1. 进入你的仓库页面

├── game.js            # Game logic and hand tracking2. 点击 "Settings" (设置)

├── styles.css         # Pixel art styling3. 在左侧菜单中找到 "Pages"

├── Spinning Coin.png  # 8-frame coin sprite sheet4. 在 "Source" 部分：

├── key.gif           # Victory screen animation (optional)   - Branch: 选择 `main`

└── README.md         # This file   - Folder: 选择 `/ (root)`

```5. 点击 "Save"

6. 等待1-2分钟，页面会显示：

## 🎮 Game Configuration   ```

   ✅ Your site is live at https://你的用户名.github.io/smile-collection-game/

### Customizable Settings (in `game.js`)   ```



```javascript### 步骤4：访问你的游戏

const VICTORY_LEVEL = 5;           // Number of levels to win

const COIN_FRAME_COUNT = 8;        // Coin animation frames打开浏览器访问：

const COIN_FRAME_SPEED = 0.075;    // Animation speed```

const TARGET_RADIUS = 50;          // Target sizehttps://你的用户名.github.io/smile-collection-game/

const TOUCH_THRESHOLD = 80;        // Touch detection sensitivity```

let targetTimer = 10.0;            // Time per target (seconds)

```🎉 恭喜！你的游戏现在已经在线了！



### Color Scheme## 📱 分享给其他人



```javascript将上面的URL分享给朋友，他们可以直接在浏览器中玩你的游戏！

--color-bg: #1a0d2e;        // Dark purple background

--color-primary: #9d4edd;   // Purple primary### 可选：使用自定义域名

--color-accent: #ffd60a;    // Yellow accent (coins)

--color-success: #06ffa5;   // Green success1. 购买一个域名（如：smile-game.com）

--color-wrong: #e63946;     // Red error2. 在仓库的 Settings → Pages → Custom domain 中添加你的域名

```3. 在域名提供商处配置DNS记录指向GitHub Pages



## 💻 Local Development## 🎯 游戏玩法



### Prerequisites1. **目标**：按数字顺序（1→2→3→...）点击圆圈

- Modern web browser (Chrome, Firefox, Edge, Safari)2. **计时**：每个目标有10秒时间限制

- Webcam access3. **升级**：完成所有目标后进入下一关

- Local web server (for testing)4. **挑战**：关卡越高，目标数量越多（最多8个）



### Installation### 控制方式



1. **Clone the repository**- **鼠标**：点击目标圆圈

   ```bash- **触摸屏**：触摸目标圆圈

   git clone https://github.com/WUYuying003/week8.git- **键盘**：

   cd week8/web_game  - `R` - 重新开始

   ```  - `ESC` - 暂停



2. **Run a local server**## 🛠️ 技术细节

   

   Using Python:- **分辨率**：1920×1080 px

   ```bash- **像素比例**：16×16 px 网格

   python3 -m http.server 8000- **主角尺寸**：16×16 像素

   ```- **技术栈**：纯HTML5 + CSS3 + JavaScript（无需外部依赖）

   - **兼容性**：支持所有现代浏览器

   Or using Node.js:

   ```bash## 🎨 配色方案

   npx http-server -p 8000

   ```- **背景**：深紫色 (#1a0d2e, #2d1b4e)

- **主色调**：紫色系 (#9d4edd, #c77dff)

3. **Open in browser**- **强调色**：黄色 (#ffd60a)

   ```- **辅助色**：黑白灰

   http://localhost:8000/index.html

   ```## 📝 更新游戏



### Browser Compatibility修改游戏后更新到GitHub Pages：



✅ **Supported Browsers**```bash

- Chrome 87+# 1. 修改文件后提交

- Firefox 78+git add .

- Edge 88+git commit -m "Update game"

- Safari 14+

# 2. 推送到GitHub

⚠️ **Requirements**git push origin main

- WebRTC support

- WebGL support (for MediaPipe)# 3. 等待1-2分钟，GitHub Pages会自动更新

- Camera permissions enabled```



## 🎨 Customization Guide## 🐛 故障排除



### Change Coin Sprite### 游戏无法显示？

1. Replace `Spinning Coin.png` with your custom sprite sheet

2. Update frame dimensions in `game.js`:1. 确认三个文件（index.html, game.js, styles.css）都在仓库根目录

   ```javascript2. 检查GitHub Pages是否已启用

   const COIN_FRAME_WIDTH = 16;  // Your frame width3. 清除浏览器缓存后刷新页面

   const COIN_FRAME_HEIGHT = 16; // Your frame height4. 打开浏览器开发者工具（F12）查看错误信息

   const COIN_FRAME_COUNT = 8;   // Number of frames

   ```### 部署后看到404错误？



### Adjust Difficulty- 等待5-10分钟，GitHub Pages需要时间构建

- **Easier**: Increase `targetTimer`, decrease `targetsPerLevel`- 确认仓库是Public（公开）状态

- **Harder**: Decrease `targetTimer`, increase `VICTORY_LEVEL`- 检查URL是否正确



### Modify Colors## 📧 支持

Edit CSS variables in `styles.css`:

```css如有问题，可以：

:root {1. 在GitHub仓库创建Issue

    --color-accent: #your-color;2. 查看GitHub Pages文档：https://pages.github.com/

    --color-primary: #your-color;

}## 📄 许可证

```

MIT License - 自由使用、修改和分享

## 🐛 Troubleshooting

---

### Camera Not Working

- **Check Permissions**: Allow camera access in browser settings**祝你游戏愉快！ 😊**

- **Try HTTPS**: Some browsers require secure connection
- **Restart Browser**: Close and reopen the browser
- **Check DevTools**: Open console (F12) for error messages

### Hand Not Detected
- **Lighting**: Ensure good lighting conditions
- **Distance**: Keep hand 30-60cm from camera
- **Background**: Plain background works best
- **Calibration**: Try moving hand slowly at first

### Performance Issues
- **Close Other Tabs**: Free up system resources
- **Lower Resolution**: Edit camera settings in `initializeCamera()`
- **Disable Extensions**: Try incognito mode

## 📝 Game States

The game has 6 different states:

1. **waiting_camera**: Waiting for camera initialization
2. **playing**: Active gameplay
3. **level_complete**: Level finished, showing next level info
4. **game_over**: Time ran out
5. **wrong**: Wrong target touched (2-second penalty)
6. **victory**: All 5 levels completed

## 🏆 Victory Condition

Complete **Level 5** to win and unlock the secret code: **0218**

## 🚀 Deployment to GitHub Pages

### Quick Setup

1. **Push to GitHub** (already done!)
   ```bash
   git add .
   git commit -m "Deploy game"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository: https://github.com/WUYuying003/week8
   - Click "Settings" → "Pages"
   - Under "Source", select "main" branch and "/web_game" folder
   - Click "Save"
   - Your game will be live at: https://wuyuying003.github.io/week8/web_game/

3. **Wait 2-3 minutes** for GitHub to build and deploy

### Custom Domain (Optional)

You can use a custom domain by:
1. Adding a `CNAME` file with your domain
2. Configuring DNS settings in your domain registrar

## 📄 License

This project is open source and available for educational purposes.

## 👥 Credits

- **Game Design**: Interactive hand tracking game concept
- **MediaPipe**: Google's MediaPipe Hands technology
- **Font**: Press Start 2P (Google Fonts)
- **Sprite Art**: Custom 8-frame coin animation

## 🔗 Links

- **Repository**: [https://github.com/WUYuying003/week8](https://github.com/WUYuying003/week8)
- **Live Demo**: [https://wuyuying003.github.io/week8/web_game/](https://wuyuying003.github.io/week8/web_game/)
- **MediaPipe Docs**: [https://mediapipe.dev](https://mediapipe.dev)

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Enjoy the game! 🎮✨**

Made with ❤️ using MediaPipe Hand Tracking Technology

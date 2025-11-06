#!/bin/bash

# 笑容收集之旅 - 快速初始化脚本
# 使用方法: ./init.sh <你的GitHub用户名> <仓库名>

echo "😊 笑容收集之旅 - 快速初始化"
echo "================================"
echo ""

# 检查参数
if [ $# -lt 2 ]; then
    echo "❌ 使用方法: ./init.sh <GitHub用户名> <仓库名>"
    echo ""
    echo "示例："
    echo "  ./init.sh john smile-game"
    echo ""
    echo "这将连接到："
    echo "  https://github.com/john/smile-game"
    echo ""
    exit 1
fi

USERNAME=$1
REPO=$2

echo "📝 配置信息："
echo "  用户名: $USERNAME"
echo "  仓库名: $REPO"
echo "  仓库URL: https://github.com/$USERNAME/$REPO"
echo ""

read -p "确认以上信息正确？(y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 已取消"
    exit 1
fi

# 检查是否已初始化
if [ -d .git ]; then
    echo "⚠️  警告: 已存在Git仓库"
    read -p "是否要重新初始化？这将删除现有Git历史！(y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf .git
        echo "✅ 已删除现有Git仓库"
    else
        echo "❌ 已取消"
        exit 1
    fi
fi

# 初始化Git
echo ""
echo "🔧 初始化Git仓库..."
git init

# 添加文件
echo "📁 添加文件..."
git add index.html game.js styles.css README.md DEPLOYMENT_GUIDE.md

# 提交
echo "💾 创建初始提交..."
git commit -m "Initial commit: Add Smile Collection Pixel Game

- Pixel art style game (16x16)
- Purple/Yellow color theme
- Touch/Click interaction
- Level progression system
- Responsive design for 1920x1080"

# 设置远程仓库
echo "🔗 连接到GitHub..."
git remote add origin "https://github.com/$USERNAME/$REPO.git"

# 设置主分支
git branch -M main

echo ""
echo "✅ 初始化完成！"
echo ""
echo "📋 下一步："
echo "  1. 确保你已在GitHub创建仓库: https://github.com/$USERNAME/$REPO"
echo "  2. 运行以下命令推送代码："
echo ""
echo "     git push -u origin main"
echo ""
echo "  3. 在GitHub仓库中启用Pages:"
echo "     Settings → Pages → Source: main → Save"
echo ""
echo "  4. 访问你的游戏:"
echo "     https://$USERNAME.github.io/$REPO/"
echo ""
echo "💡 提示: 使用 ./deploy.sh 可快速更新部署"

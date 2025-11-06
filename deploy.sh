#!/bin/bash

# 笑容收集之旅 - GitHub Pages 部署脚本
# 使用方法: ./deploy.sh

echo "😊 笑容收集之旅 - 部署到 GitHub Pages"
echo "========================================"
echo ""

# 检查是否在git仓库中
if [ ! -d .git ]; then
    echo "❌ 错误：当前目录不是git仓库"
    echo "请先运行以下命令初始化仓库："
    echo ""
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    echo "  git remote add origin https://github.com/你的用户名/仓库名.git"
    echo "  git push -u origin main"
    echo ""
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 发现未提交的更改..."
    git status --short
    echo ""
    
    read -p "是否提交这些更改？(y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "输入提交信息: " commit_msg
        
        if [ -z "$commit_msg" ]; then
            commit_msg="Update game"
        fi
        
        git add .
        git commit -m "$commit_msg"
        echo "✅ 更改已提交"
    else
        echo "⚠️  跳过提交"
    fi
fi

# 推送到GitHub
echo ""
echo "🚀 推送到 GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo ""
    echo "你的游戏将在1-2分钟后上线"
    echo "访问地址："
    
    # 尝试获取仓库URL
    remote_url=$(git config --get remote.origin.url)
    if [ -n "$remote_url" ]; then
        # 转换SSH URL到HTTPS
        remote_url=${remote_url/git@github.com:/https://github.com/}
        remote_url=${remote_url/.git/}
        
        # 生成GitHub Pages URL
        user_repo=$(echo $remote_url | sed 's/https:\/\/github.com\///')
        pages_url="https://$(echo $user_repo | cut -d'/' -f1).github.io/$(echo $user_repo | cut -d'/' -f2)/"
        
        echo "  $pages_url"
    fi
    
    echo ""
    echo "📋 后续步骤："
    echo "  1. 访问 GitHub 仓库的 Settings → Pages"
    echo "  2. 确认 Source 设置为 'main' 分支"
    echo "  3. 等待部署完成"
else
    echo ""
    echo "❌ 推送失败"
    echo "请检查："
    echo "  1. 是否已设置远程仓库"
    echo "  2. 是否有推送权限"
    echo "  3. 网络连接是否正常"
fi

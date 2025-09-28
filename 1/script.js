// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeToggle();
    initializeFilter();
    initializeLinkInteractions();
    initializeAnimations();
    loadUserPreferences();
});

/**
 * 主题切换功能
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // 添加切换动画
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

/**
 * 更新主题图标
 */
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

/**
 * 筛选功能
 */
function initializeFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const linkCards = document.querySelectorAll('.link-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选链接卡片
            filterLinks(linkCards, filter);
        });
    });
}

/**
 * 筛选链接卡片
 */
function filterLinks(linkCards, filter) {
    linkCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            card.classList.remove('hidden');
            // 添加延迟动画
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.classList.add('hidden');
            }, 300);
        }
    });
}

/**
 * 链接交互功能
 */
function initializeLinkInteractions() {
    const linkCards = document.querySelectorAll('.link-card');
    
    linkCards.forEach(card => {
        // 添加点击音效（可选）
        card.addEventListener('click', function(e) {
            // 这里可以添加实际的链接跳转逻辑
            const linkText = this.querySelector('span').textContent;
            
            // 示例：根据链接类型执行不同操作
            handleLinkClick(linkText, this);
            
            // 添加点击反馈动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // 鼠标悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/**
 * 处理链接点击
 */
function handleLinkClick(linkText, element) {
    // 这里可以根据链接类型执行不同的操作
    switch(linkText) {
        case 'GitHub':
            // window.open('https://github.com/your-username', '_blank');
            showNotification('GitHub 链接点击');
            break;
        case 'LinkedIn':
            // window.open('https://linkedin.com/in/your-profile', '_blank');
            showNotification('LinkedIn 链接点击');
            break;
        case '个人博客':
            // window.open('https://your-blog.com', '_blank');
            showNotification('博客链接点击');
            break;
        case 'YouTube':
            // window.open('https://youtube.com/your-channel', '_blank');
            showNotification('YouTube 链接点击');
            break;
        case '简历':
            // window.open('/resume.pdf', '_blank');
            showNotification('简历下载');
            break;
        case '作品集':
            // window.open('https://your-portfolio.com', '_blank');
            showNotification('作品集链接点击');
            break;
        case 'Twitter':
            // window.open('https://twitter.com/your-handle', '_blank');
            showNotification('Twitter 链接点击');
            break;
        case '邮箱':
            // window.location.href = 'mailto:your.email@example.com';
            showNotification('邮箱联系');
            break;
        default:
            showNotification('链接点击: ' + linkText);
    }
}

/**
 * 显示通知
 */
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 1001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-size: 0.9rem;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * 初始化动画
 */
function initializeAnimations() {
    // 添加滚动动画观察器
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // 观察所有主要区块
    const sections = document.querySelectorAll('.profile-section, .links-section, .skills-section, .filter-section, .contact-section');
    sections.forEach(section => {
        observer.observe(section);
        section.style.animationPlayState = 'paused';
    });
}

/**
 * 加载用户偏好设置
 */
function loadUserPreferences() {
    // 加载保存的筛选状态
    const savedFilter = localStorage.getItem('linkFilter') || 'all';
    const filterButton = document.querySelector(`[data-filter="${savedFilter}"]`);
    if (filterButton) {
        filterButton.click();
    }
    
    // 加载其他用户设置
    loadCustomizations();
}

/**
 * 加载自定义设置
 */
function loadCustomizations() {
    // 这里可以添加更多自定义功能
    // 例如：自定义主题色、布局偏好等
    
    // 示例：动态设置主题色
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--primary-color', savedColor);
    }
    
    // 添加键盘快捷键支持
    initializeKeyboardShortcuts();
}

/**
 * 键盘快捷键
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + T: 切换主题
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            document.getElementById('theme-toggle').click();
        }
        
        // 数字键 1-5: 快速筛选
        if (e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const filterButtons = document.querySelectorAll('.filter-btn');
            const index = parseInt(e.key) - 1;
            if (filterButtons[index]) {
                filterButtons[index].click();
            }
        }
    });
}

/**
 * 技能标签交互
 */
document.addEventListener('DOMContentLoaded', function() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 添加点击效果
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // 可以添加技能详情显示功能
            showSkillDetails(this.textContent);
        });
    });
});

/**
 * 显示技能详情（示例功能）
 */
function showSkillDetails(skillName) {
    const skillDetails = {
        '前端开发': 'HTML, CSS, JavaScript, React, Vue.js 等现代前端技术',
        '后端开发': 'Node.js, Python, Java 等后端技术栈',
        'UI/UX设计': '用户界面和用户体验设计',
        '数据分析': '数据处理和分析能力',
        '机器学习': 'AI 和机器学习相关技术',
        '摄影': '摄影爱好和技巧',
        '音乐': '音乐创作和演奏',
        '旅行': '旅行经验和文化体验'
    };
    
    const detail = skillDetails[skillName] || '暂无详细信息';
    showNotification(`${skillName}: ${detail}`);
}

/**
 * 联系方式点击处理
 */
document.addEventListener('DOMContentLoaded', function() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            
            // 复制到剪贴板
            navigator.clipboard.writeText(text).then(() => {
                showNotification('已复制到剪贴板: ' + text);
            }).catch(() => {
                showNotification('联系方式: ' + text);
            });
        });
    });
});

/**
 * 头像点击彩蛋
 */
document.addEventListener('DOMContentLoaded', function() {
    const avatar = document.getElementById('avatar-img');
    let clickCount = 0;
    
    avatar.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount === 5) {
            // 连续点击5次的彩蛋
            this.style.transform = 'rotate(360deg) scale(1.2)';
            showNotification('🎉 发现彩蛋！欢迎来到我的个人引导站！');
            
            setTimeout(() => {
                this.style.transform = '';
                clickCount = 0;
            }, 1000);
        } else {
            // 普通点击效果
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        }
        
        // 重置计数器
        setTimeout(() => {
            if (clickCount < 5) clickCount = 0;
        }, 2000);
    });
});

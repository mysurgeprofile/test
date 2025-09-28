class NavigationPage {
  constructor() {
    this.links = [];
    this.currentTheme = 'light';
    this.initializeApp();
  }

  async initializeApp() {
    await this.loadUserProfile();
    await this.loadLinks();
    this.setupEventListeners();
    this.renderCategories();
  }

  async loadUserProfile() {
    const initData = await window.discourseArtifactReady;
    const userProfile = document.querySelector('.user-profile');
    const userName = userProfile.querySelector('.user-name');
    const userAvatar = userProfile.querySelector('.user-avatar');
    
    userName.textContent = initData.name;
    userAvatar.style.backgroundImage = `url(${initData.avatar_template.replace('{size}', '80')})`;
  }

  async loadLinks() {
    try {
      const storedLinks = await window.discourseArtifact.get('links');
      this.links = storedLinks ? JSON.parse(storedLinks) : this.getDefaultLinks();
    } catch (error) {
      console.error('Error loading links:', error);
      this.links = this.getDefaultLinks();
    }
  }

  getDefaultLinks() {
    return [
      {
        id: '1',
        title: 'Google',
        url: 'https://google.com',
        icon: 'fab fa-google',
        description: 'Search Engine',
        category: 'frequently-used'
      }
    ];
  }

  async saveLinks() {
    try {
      await window.discourseArtifact.set('links', JSON.stringify(this.links));
    } catch (error) {
      console.error('Error saving links:', error);
    }
  }

  setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));

    // Add link
    document.getElementById('addLink').addEventListener('click', () => this.showModal());

    // Modal form
    document.getElementById('linkForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
    document.getElementById('cancelButton').addEventListener('click', () => this.hideModal());
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  handleSearch(query) {
    const normalizedQuery = query.toLowerCase();
    const links = document.querySelectorAll('.link-card');
    
    links.forEach(link => {
      const text = link.textContent.toLowerCase();
      link.style.display = text.includes(normalizedQuery) ? 'block' : 'none';
    });
  }

  showModal(linkToEdit = null) {
    const modal = document.getElementById('modal');
    const form = document.getElementById('linkForm');
    modal.style.display = 'flex';

    if (linkToEdit) {
      document.getElementById('modal-title').textContent = 'Edit Link';
      document.getElementById('linkTitle').value = linkToEdit.title;
      document.getElementById('linkUrl').value = linkToEdit.url;
      document.getElementById('linkIcon').value = linkToEdit.icon;
      document.getElementById('linkDescription').value = linkToEdit.description;
      document.getElementById('linkCategory').value = linkToEdit.category;
      form.dataset.editId = linkToEdit.id;
    } else {
      document.getElementById('modal-title').textContent = 'Add New Link';
      form.reset();
      delete form.dataset.editId;
    }
  }

  hideModal() {
    document.getElementById('modal').style.display = 'none';
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
      id: e.target.dataset.editId || Date.now().toString(),
      title: document.getElementById('linkTitle').value,
      url: document.getElementById('linkUrl').value,
      icon: document.getElementById('linkIcon').value,
      description: document.getElementById('linkDescription').value,
      category: document.getElementById('linkCategory').value
    };

    if (e.target.dataset.editId) {
      const index = this.links.findIndex(l => l.id === e.target.dataset.editId);
      this.links[index] = formData;
    } else {
      this.links.push(formData);
    }

    await this.saveLinks();
    this.renderCategories();
    this.hideModal();
  }

  async deleteLink(id) {
    if (confirm('Are you sure you want to delete this link?')) {
      this.links = this.links.filter(link => link.id !== id);
      await this.saveLinks();
      this.renderCategories();
    }
  }

  renderCategories() {
    const categories = {
      'frequently-used': 'Frequently Used',
      'work': 'Work',
      'entertainment': 'Entertainment',
      'social': 'Social',
      'tools': 'Tools'
    };

    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = '';

    Object.entries(categories).forEach(([key, title]) => {
      const categoryLinks = this.links.filter(link => link.category === key);
      if (categoryLinks.length === 0) return;

      const categoryElement = document.createElement('div');
      categoryElement.className = 'category';
      categoryElement.innerHTML = `
        <div class="category-header">
          <h2>${title}</h2>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="links-grid">
          ${categoryLinks.map(link => this.renderLink(link)).join('')}
        </div>
      `;

      categoryElement.querySelector('.category-header').addEventListener('click', (e) => {
        const grid = e.currentTarget.nextElementSibling;
        const icon = e.currentTarget.querySelector('i');
        grid.style.display = grid.style.display === 'none' ? 'grid' : 'none';
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-right');
      });

      categoriesContainer.appendChild(categoryElement);
    });
  }

  renderLink(link) {
    return `
      <div class="link-card" data-id="${link.id}">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <i class="${link.icon || 'fas fa-link'}" style="font-size: 1.2em;"></i>
          <div>
            <button onclick="nav.showModal(${JSON.stringify(link)})" style="background: none; border: none; color: var(--text-color); cursor: pointer;">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="nav.deleteLink('${link.id}')" style="background: none; border: none; color: var(--text-color); cursor: pointer;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <h3><a href="${link.url}" target="_blank">${link.title}</a></h3>
        <p>${link.description}</p>
      </div>
    `;
  }
}

const nav = new NavigationPage();

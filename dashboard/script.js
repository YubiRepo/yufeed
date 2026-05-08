let sourcesConfig = {};
let sourceCounts = {};
let currentArticles = [];
let currentSource = 'antara';
let currentCategory = '';

// Initialize UI
document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    await loadConfig();
    renderSourcesSidebar();
    
    // Fetch default source
    fetchNews('antara');

    // Modal close logic
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') closeModal();
    });

    // Source Form Handler
    document.getElementById('source-form').addEventListener('submit', handleSourceSubmit);
});

function filterSources() {
    const query = document.getElementById('source-search').value.toLowerCase();
    renderSourcesSidebar(query);
}

// Navigation logic
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.sidebar .source-item').forEach(item => item.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).style.display = 'block';
    
    // Highlight sidebar item
    const navItem = Array.from(document.querySelectorAll('.nav-section .source-item'))
        .find(el => el.getAttribute('onclick')?.includes(`'${tabId}'`));
    if (navItem) navItem.classList.add('active');

    // Update Header
    const titles = {
        'feed': sourcesConfig[currentSource]?.name || 'News Feed',
        'sources': 'Sources Inventory',
        'docs': 'Yufeed Developer API'
    };
    const descs = {
        'feed': 'Live intelligence from news crawlers',
        'sources': 'Configure and monitor your crawler targets',
        'docs': 'Endpoints and integration parameters'
    };
    
    document.getElementById('active-source-title').innerText = titles[tabId];
    document.getElementById('active-source-desc').innerText = descs[tabId];

    if (tabId === 'sources') renderSourcesTable();
}

// Toast logic
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" size="16" style="color: ${type === 'success' ? '#10b981' : '#ef4444'}"></i>
            <span>${message}</span>
        </div>
        <i data-lucide="x" size="14" style="cursor: pointer; opacity: 0.5;" onclick="this.parentElement.remove()"></i>
    `;
    container.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => toast.remove(), 5000);
}

async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        sourcesConfig = await response.json();
        const count = Object.keys(sourcesConfig).length;
        document.getElementById('stat-sources-count').innerText = `${count} / ${count}`;
    } catch (error) {
        console.error('Failed to load config', error);
    }
}

// Key-Value Pair Editor Logic
function addRow(type, key = '', value = '') {
    const container = document.getElementById(`${type}-container`);
    const row = document.createElement('div');
    row.className = 'kv-row';
    row.style = 'display: grid; grid-template-columns: 1fr 1fr 32px; gap: 8px; align-items: center;';
    
    row.innerHTML = `
        <input type="text" placeholder="Key" class="input kv-key" value="${key}" style="height: 32px; font-size: 0.75rem;">
        <input type="text" placeholder="Value" class="input kv-value" value="${value}" style="height: 32px; font-size: 0.75rem;">
        <button type="button" class="btn btn-ghost" style="height: 32px; width: 32px; padding: 0; color: #ef4444;" onclick="this.parentElement.remove()">
            <i data-lucide="trash-2" size="14"></i>
        </button>
    `;
    container.appendChild(row);
    lucide.createIcons();
}

function collectKeyValue(type) {
    const container = document.getElementById(`${type}-container`);
    const rows = container.querySelectorAll('.kv-row');
    const data = {};
    rows.forEach(row => {
        const key = row.querySelector('.kv-key').value.trim();
        const value = row.querySelector('.kv-value').value.trim();
        if (key) data[key] = value;
    });
    return data;
}

function populateKeyValue(type, data) {
    const container = document.getElementById(`${type}-container`);
    container.innerHTML = '';
    if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
            addRow(type, key, value);
        });
    }
}

function renderSkeletons() {
    const grid = document.getElementById('article-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const skel = document.createElement('div');
        skel.className = 'skeleton-card';
        skel.innerHTML = `
            <div class="skeleton-image skeleton"></div>
            <div class="skeleton-content">
                <div class="skeleton-line skeleton" style="width: 30%"></div>
                <div class="skeleton-line skeleton"></div>
                <div class="skeleton-line skeleton"></div>
                <div class="skeleton-line skeleton short"></div>
                <div style="display:flex; justify-content:space-between; margin-top:20px;">
                    <div class="skeleton-line skeleton" style="width: 40%"></div>
                    <div class="skeleton-line skeleton" style="width: 30%"></div>
                </div>
            </div>
        `;
        grid.appendChild(skel);
    }
}

// Source Management Modal
function openSourceModal(id = null) {
    const modal = document.getElementById('source-modal-overlay');
    const modalContent = modal.querySelector('.modal-content');
    const form = document.getElementById('source-form');
    const title = document.getElementById('source-modal-title');
    
    modalContent.style.maxWidth = '800px';
    form.reset();
    document.getElementById('categories-container').innerHTML = '';
    document.getElementById('selectors-container').innerHTML = '';
    document.getElementById('src-id').disabled = false;
    title.innerText = 'Add New Source';

    if (id) {
        const src = sourcesConfig[id];
        document.getElementById('src-id').value = id;
        document.getElementById('src-id').disabled = true;
        document.getElementById('src-name').value = src.name;
        document.getElementById('src-url').value = src.baseUrl;
        populateKeyValue('categories', src.categories);
        populateKeyValue('selectors', src.selectors);
        title.innerText = 'Edit Source Configuration';
    } else {
        addRow('categories');
        addRow('selectors', 'content', '');
    }

    modal.style.display = 'flex';
    lucide.createIcons();
}

function closeSourceModal() {
    document.getElementById('source-modal-overlay').style.display = 'none';
}

async function handleSourceSubmit(e) {
    e.preventDefault();
    try {
        const data = {
            id: document.getElementById('src-id').value,
            name: document.getElementById('src-name').value,
            baseUrl: document.getElementById('src-url').value,
            categories: collectKeyValue('categories'),
            selectors: collectKeyValue('selectors')
        };

        const response = await fetch('/api/sources', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            showToast('Yufeed configuration updated!');
            await loadConfig();
            renderSourcesSidebar();
            renderSourcesTable();
            closeSourceModal();
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

async function renderSourcesTable() {
    const tbody = document.getElementById('sources-tbody');
    tbody.innerHTML = '<tr><td colspan="4" class="loading">Loading Yufeed inventory...</td></tr>';
    
    try {
        const response = await fetch('/api/sources');
        const sources = await response.json();
        
        tbody.innerHTML = '';
        sources.forEach(src => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 500;">${src.name}</td>
                <td><code style="background: var(--muted); padding: 2px 6px; border-radius: 4px;">${src.id}</code></td>
                <td style="color: var(--muted-foreground); font-size: 0.75rem;">${src.baseUrl}</td>
                <td style="text-align: right;">
                    <div style="display: flex; justify-content: flex-end; gap: 8px;">
                        <button class="btn btn-outline" style="height: 32px; padding: 0 8px;" onclick="openSourceModal('${src.id}')">Edit</button>
                        <button class="btn btn-outline" style="height: 32px; padding: 0 8px; color: #ef4444;" onclick="deleteSource('${src.id}')">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4" class="error">Failed to load from database</td></tr>';
    }
}

async function deleteSource(id) {
    if (!confirm(`Delete ${id}? This cannot be undone.`)) return;
    try {
        await fetch(`/api/sources/${id}`, { method: 'DELETE' });
        showToast('Source removed from Yufeed');
        await loadConfig();
        renderSourcesSidebar();
        renderSourcesTable();
    } catch (error) {
        showToast('Delete failed', 'error');
    }
}

async function fetchNews(sourceId, category = '') {
    renderSkeletons();
    currentSource = sourceId;
    currentCategory = category;

    try {
        const url = `/api/news/${sourceId}${category ? '/' + category : ''}?fetchDetail=true`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            const sourceInfo = sourcesConfig[sourceId];
            const sourceName = sourceInfo ? sourceInfo.name : (result.data.title || 'Source');
            
            currentArticles = result.data.posts.map((post, index) => {
                const dateObj = new Date(post.pubDate);
                const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                
                return {
                    id: index,
                    source: sourceName,
                    title: post.title,
                    thumbnail: post.thumbnail || 'https://via.placeholder.com/400x200?text=No+Image',
                    snippet: post.description || post.content?.substring(0, 150) + '...',
                    content: post.contentHtml || post.content?.split('\n').map(p => `<p>${p}</p>`).join('') || '<p>No content available</p>',
                    author: post.author || 'Editorial',
                    date: dateStr,
                    time: timeStr,
                    tags: post.tags || [],
                    link: post.link
                };
            });
            
            sourceCounts[sourceId] = currentArticles.length;
            document.getElementById('stat-total').innerText = currentArticles.length;
            
            renderArticles(currentArticles);
            renderCategorySelector(sourceId);
            renderSourcesSidebar(); 
        } else {
            document.getElementById('article-grid').innerHTML = `<div class="error">Yufeed Error: ${result.message}</div>`;
        }
    } catch (error) {
        document.getElementById('article-grid').innerHTML = `<div class="error">Failed to connect to Yufeed server</div>`;
    }
}

function renderCategorySelector(sourceId) {
    const headerRight = document.getElementById('header-actions');
    const categories = sourcesConfig[sourceId]?.categories || {};
    
    if (Object.keys(categories).length <= 1) {
        headerRight.innerHTML = '';
        return;
    }

    let html = '<select class="category-select" onchange="fetchNews(\'' + sourceId + '\', this.value)">';
    Object.keys(categories).forEach(cat => {
        html += `<option value="${cat}" ${currentCategory === cat ? 'selected' : ''}>${cat.toUpperCase()}</option>`;
    });
    html += '</select>';
    headerRight.innerHTML = html;
}

function renderSourcesSidebar(filter = '') {
    const list = document.getElementById('source-list');
    list.innerHTML = '';
    
    Object.entries(sourcesConfig).forEach(([id, source]) => {
        if (filter && !source.name.toLowerCase().includes(filter)) return;
        
        const div = document.createElement('div');
        div.className = 'source-item';
        if (id === currentSource) div.classList.add('active');
        
        const count = sourceCounts[id] || 0;
        const badgeHtml = count > 0 ? `<span class="source-badge">${count}</span>` : '';
        
        div.innerHTML = `
            <div class="source-item-left">
                <div class="source-dot"></div>
                <span>${source.name}</span>
            </div>
            ${badgeHtml}
        `;
        div.onclick = () => {
            showTab('feed');
            document.querySelectorAll('.sidebar .source-item').forEach(i => i.classList.remove('active'));
            div.classList.add('active');
            document.getElementById('active-source-title').innerText = source.name;
            fetchNews(id);
        };
        list.appendChild(div);
    });
}

function renderArticles(articles) {
    const grid = document.getElementById('article-grid');
    grid.innerHTML = '';
    
    if (articles.length === 0) {
        grid.innerHTML = '<div class="error">No articles matching your criteria</div>';
        return;
    }

    articles.forEach((article, index) => {
        const card = document.createElement('div');
        card.className = 'article-card animate-fade-up';
        card.style.animationDelay = `${index * 0.05}s`;
        card.innerHTML = `
            <div class="article-image" style="background-image: url('${article.thumbnail}')"></div>
            <div class="article-content-wrapper">
                <div class="article-source">${article.source}</div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-snippet">${article.snippet}</p>
                <div class="article-meta">
                    <span style="display:flex; align-items:center; gap:4px;"><i data-lucide="user" size="12"></i> ${article.author}</span>
                    <span style="display:flex; align-items:center; gap:4px;"><i data-lucide="clock" size="12"></i> ${article.date} ${article.time}</span>
                </div>
            </div>
        `;
        card.onclick = () => openModal(article);
        grid.appendChild(card);
    });
    lucide.createIcons();
}

function openModal(article) {
    const modal = document.getElementById('modal-overlay');
    const tagsContainer = document.getElementById('modal-tags');
    
    tagsContainer.innerHTML = '';
    if (article.tags && article.tags.length > 0) {
        article.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.innerText = tag;
            tagsContainer.appendChild(span);
        });
    }

    document.getElementById('modal-title').innerText = article.title;
    document.getElementById('modal-meta').innerText = `By ${article.author} | ${article.date} ${article.time} | Source: ${article.source}`;
    
    const bodyContent = `
        <img src="${article.thumbnail}" alt="${article.title}">
        ${article.content}
    `;
    document.getElementById('modal-body').innerHTML = bodyContent;
    document.getElementById('modal-link').href = article.link;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

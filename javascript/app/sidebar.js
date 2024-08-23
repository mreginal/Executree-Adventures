document.addEventListener('DOMContentLoaded', () => {
    function createToggleButton() {
        const button = document.createElement('button');
        button.className = 'toggle-btn';
        button.innerHTML = '☰';
        button.addEventListener('click', toggleSidebar);
        return button;
    }

    function createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.className = 'sidebar';
        sidebar.id = 'sidebar';

        const logo = document.createElement('img');
        logo.src = '../../images/utils/logo.png';
        logo.alt = 'Logo-Executree Adventures';

        const menuItems = [
            { name: 'Menu', href: 'menu.html', icon: 'fa-solid fa-house' },
            { name: 'Sobre', href: 'about.html', icon: 'fas fa-address-card' },
            { name: 'Créditos', href: 'credits.html', icon: 'fas fa-star' },
            { name: 'Contato', href: '#', icon: 'fas fa-envelope' }
        ];

        sidebar.appendChild(logo);

        menuItems.forEach(item => {
            const link = document.createElement('a');
            link.href = item.href;
            link.innerHTML = `<i class="${item.icon}"></i>${item.name}`;
            link.addEventListener('click', () => {
                toggleSidebar();
            });
            sidebar.appendChild(link);
        });

        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.addEventListener('click', logout);
        sidebar.appendChild(logoutBtn);
        
        return sidebar;
    }

    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('active');
        if (sidebar.classList.contains('active')) {
            content.style.marginLeft = '250px';
        } else {
            content.style.marginLeft = '0';
        }
    }

    function logout() {
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'userID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
        window.location.href = "../app/login.html";
    }
    

    function sideBar() {
        const app = document.querySelector('body'); 
        app.appendChild(createToggleButton());
        app.appendChild(createSidebar());
    }

    sideBar();
});

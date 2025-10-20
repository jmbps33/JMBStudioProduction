/* Extracted from JMBSTUDPROD.htm */

// Navigation functionality
        function showSection(sectionId) {
            // Hide all sections with fade out
            const sections = document.querySelectorAll('.section-content');
            sections.forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    section.classList.add('hidden');
                }, 200);
            });
            
            // Show selected section with enhanced animation
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                setTimeout(() => {
                    targetSection.classList.remove('hidden');
                    targetSection.style.opacity = '0';
                    targetSection.style.transform = 'translateY(30px)';
                    
                    // Trigger reflow
                    targetSection.offsetHeight;
                    
                    // Animate in
                    targetSection.style.transition = 'all 0.6s ease-out';
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                    
                    // Add staggered animations to child elements
                    const animatedElements = targetSection.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .bounce-in, .scale-in, .rotate-in');
                    animatedElements.forEach((el, index) => {
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            el.style.transition = 'all 0.5s ease-out';
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, 100 + (index * 100));
                    });
                }, 250);
            }
            
            // Update active nav button
            const navButtons = document.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => {
                btn.classList.remove('text-indigo-600');
                btn.classList.add('text-gray-700');
            });
            
            // Hide mobile menu
            document.getElementById('mobileMenu').classList.add('hidden');
        }

        function toggleMobileMenu() {
            const mobileMenu = document.getElementById('mobileMenu');
            mobileMenu.classList.toggle('hidden');
        }

        let isAdminLoggedIn = false;

        function showAdminLogin() {
            if (isAdminLoggedIn) {
                adminLogout();
            } else {
                const modal = document.getElementById('adminLoginModal');
                modal.classList.remove('hidden');
                document.getElementById('adminUsername').focus();
            }
        }

        function closeAdminLogin() {
            const modal = document.getElementById('adminLoginModal');
            modal.classList.add('hidden');
            
            // Clear form
            document.getElementById('adminUsername').value = '';
            document.getElementById('adminPassword').value = '';
            document.getElementById('loginError').classList.add('hidden');
        }

        function handleAdminLogin(event) {
            event.preventDefault();
            
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            const errorDiv = document.getElementById('loginError');
            
            // Check credentials (you can change these)
            if (username === 'Josiejorenz2024' && password === 'jmb2026') {
                isAdminLoggedIn = true;
                
                // Update button text
                const adminBtn = document.getElementById('adminPortalBtn');
                adminBtn.innerHTML = `
                    <span class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Logout
                    </span>
                `;
                adminBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
                adminBtn.classList.add('bg-red-600', 'hover:bg-red-700');
                
                // Close modal
                closeAdminLogin();
                
                // Show success message
                showNotification('Login Successful! You now have admin access.', 'success');
                
                // Show all admin portals after successful login
                showAllAdminPortals();
                
            } else {
                errorDiv.classList.remove('hidden');
                document.getElementById('adminPassword').value = '';
                document.getElementById('adminPassword').focus();
            }
        }

        function adminLogout() {
            isAdminLoggedIn = false;
            
            // Reset button appearance
            const adminBtn = document.getElementById('adminPortalBtn');
            adminBtn.innerHTML = 'Admin Portal';
            adminBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
            adminBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
            
            // Hide all admin portals
            const adminPortals = document.querySelectorAll('.admin-portal');
            adminPortals.forEach(portal => {
                portal.classList.remove('active');
            });
            
            // Hide background settings button
            const backgroundBtn = document.getElementById('backgroundSettingsBtn');
            if (backgroundBtn) {
                backgroundBtn.classList.add('hidden');
            }
            
            showNotification('Logged Out! Admin access has been revoked.', 'info');
        }

        // Show all admin portals after login
        function showAllAdminPortals() {
            const adminPortals = document.querySelectorAll('.admin-portal');
            adminPortals.forEach(portal => {
                portal.classList.add('active');
            });
            
            // Show background settings button for admin
            const backgroundBtn = document.getElementById('backgroundSettingsBtn');
            if (backgroundBtn) {
                backgroundBtn.classList.remove('hidden');
            }
        }

        // Admin portal functionality
        function hideAdminPortal(section) {
            const portal = document.getElementById(section + 'Admin');
            portal.classList.remove('active');
        }

        function toggleAdminView(viewId) {
            // Hide all admin views in the current section
            const allViews = document.querySelectorAll('.admin-view');
            allViews.forEach(view => {
                view.classList.add('hidden');
            });
            
            // Show the selected view
            const targetView = document.getElementById(viewId);
            if (targetView) {
                targetView.classList.remove('hidden');
            }
        }

        // Notification system
        function showNotification(message, type = 'info') {
            const colors = {
                success: 'bg-green-100 border-green-400 text-green-700',
                error: 'bg-red-100 border-red-400 text-red-700',
                info: 'bg-blue-100 border-blue-400 text-blue-700'
            };
            
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 ${colors[type]} px-4 py-3 rounded-lg shadow-lg z-50 border`;
            notification.innerHTML = `
                <div class="flex items-center gap-2">
                    <span>${message}</span>
                </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 4000);
        }

        // Media modal functionality
        function openMediaModal(src, type) {
            const modal = document.getElementById('mediaModal');
            const modalImage = document.getElementById('modalImage');
            const modalVideo = document.getElementById('modalVideo');
            
            if (type === 'image') {
                modalImage.src = src;
                modalImage.classList.remove('hidden');
                modalVideo.classList.add('hidden');
                modalVideo.pause();
            } else {
                modalVideo.src = src;
                modalVideo.classList.remove('hidden');
                modalImage.classList.add('hidden');
            }
            
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeMediaModal() {
            const modal = document.getElementById('mediaModal');
            const modalImage = document.getElementById('modalImage');
            const modalVideo = document.getElementById('modalVideo');
            
            modal.classList.add('hidden');
            modalImage.src = '';
            modalVideo.src = '';
            modalVideo.pause();
            modalImage.classList.add('hidden');
            modalVideo.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        // Enhanced Gallery functionality with better media display
        function addGalleryItem(event) {
            event.preventDefault();
            
            const title = document.getElementById('galleryTitle').value.trim();
            const type = document.getElementById('galleryType').value;
            const fileInput = document.getElementById('galleryFile');
            const description = document.getElementById('galleryDescription').value.trim();
            
            if (!title) {
                showNotification('Please enter a title for your media.', 'error');
                return;
            }
            
            if (!fileInput.files[0]) {
                showNotification('Please select a file to upload.', 'error');
                return;
            }
            
            const file = fileInput.files[0];
            
            // File size validation (max 15GB for videos, 10GB for images)
            const maxSize = type === 'video' ? 15 * 1024 * 1024 * 1024 : 10 * 1024 * 1024 * 1024;
            if (file.size > maxSize) {
                showNotification(`File size must be less than ${type === 'video' ? '15GB' : '10GB'}.`, 'error');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const fileUrl = e.target.result;
                const galleryItems = document.getElementById('galleryItems');
                
                // Remove placeholder if it exists
                const placeholder = galleryItems.querySelector('div p');
                if (placeholder && placeholder.textContent.includes('No Gallery Items Yet')) {
                    galleryItems.innerHTML = '';
                }
                
                const itemDiv = document.createElement('div');
                itemDiv.className = 'gallery-item';
                
                if (type === 'image') {
                    itemDiv.innerHTML = `
                        <div class="relative overflow-hidden">
                            <img src="${fileUrl}" alt="${title}" class="gallery-media" onclick="openMediaModal('${fileUrl}', 'image')">
                            <div class="gallery-overlay">
                                <div class="text-white text-center">
                                    <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <p class="text-sm font-medium">Click to view full size</p>
                                </div>
                            </div>
                            <div class="media-badge">📷 Image</div>
                        </div>
                        <div class="p-6">
                            <h4 class="font-bold text-gray-800 text-lg mb-2">${title}</h4>
                            <p class="text-gray-600 text-sm leading-relaxed">${description || 'No description provided.'}</p>
                        </div>
                    `;
                } else {
                    itemDiv.innerHTML = `
                        <div class="relative overflow-hidden">
                            <video class="gallery-media" preload="metadata" onclick="openMediaModal('${fileUrl}', 'video')">
                                <source src="${fileUrl}" type="${file.type}">
                                Your browser does not support the video tag.
                            </video>
                            <div class="gallery-overlay">
                                <div class="play-button">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="media-badge">🎬 Video</div>
                        </div>
                        <div class="p-6">
                            <h4 class="font-bold text-gray-800 text-lg mb-2">${title}</h4>
                            <p class="text-gray-600 text-sm leading-relaxed">${description || 'No description provided.'}</p>
                        </div>
                    `;
                }
                
                // Add with animation
                itemDiv.style.opacity = '0';
                itemDiv.style.transform = 'translateY(20px)';
                galleryItems.appendChild(itemDiv);
                
                // Animate in
                setTimeout(() => {
                    itemDiv.style.transition = 'all 0.5s ease-out';
                    itemDiv.style.opacity = '1';
                    itemDiv.style.transform = 'translateY(0)';
                }, 100);
                
                // Add to admin list
                addToGalleryAdminList(title, description, type, fileUrl);
                
                // Reset form
                event.target.reset();
                hideAdminPortal('gallery');
                
                showNotification(`${type === 'image' ? 'Image' : 'Video'} added to gallery successfully! 🎉`, 'success');
            };
            
            reader.onerror = function() {
                showNotification('Error reading file. Please try again.', 'error');
            };
            
            reader.readAsDataURL(file);
        }

        function addToGalleryAdminList(title, description, type, fileUrl) {
            const adminList = document.getElementById('galleryAdminList');
            
            // Remove placeholder if it exists
            const placeholder = adminList.querySelector('div p');
            if (placeholder && placeholder.textContent.includes('No gallery items')) {
                adminList.innerHTML = '';
            }
            
            const listItem = document.createElement('div');
            listItem.className = 'bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow';
            
            let thumbnail = '';
            if (type === 'image') {
                thumbnail = `<img src="${fileUrl}" alt="${title}" class="w-16 h-16 object-cover rounded-lg">`;
            } else {
                thumbnail = `
                    <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                `;
            }
            
            listItem.innerHTML = `
                <div class="flex items-start gap-4">
                    ${thumbnail}
                    <div class="flex-1 min-w-0">
                        <h5 class="font-semibold text-gray-800 truncate">${title}</h5>
                        <p class="text-sm text-gray-600 mt-1 line-clamp-2">${description || 'No description'}</p>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="text-xs px-2 py-1 rounded-full ${type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}">
                                ${type === 'image' ? '📷 Image' : '🎬 Video'}
                            </span>
                        </div>
                    </div>
                    <button onclick="removeGalleryItem(this, '${title}')" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors flex-shrink-0">
                        Delete
                    </button>
                </div>
            `;
            
            adminList.appendChild(listItem);
        }

        function removeGalleryItem(button, title) {
            if (!confirm(`Are you sure you want to delete "${title}"?`)) {
                return;
            }
            
            const listItem = button.closest('.bg-white');
            
            // Remove from admin list with animation
            listItem.style.transition = 'all 0.3s ease-out';
            listItem.style.opacity = '0';
            listItem.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                listItem.remove();
                
                // Remove from gallery display
                const galleryItems = document.getElementById('galleryItems');
                const galleryCards = galleryItems.querySelectorAll('.gallery-item');
                galleryCards.forEach(card => {
                    const cardTitle = card.querySelector('h4');
                    if (cardTitle && cardTitle.textContent === title) {
                        card.style.transition = 'all 0.3s ease-out';
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => card.remove(), 300);
                    }
                });
                
                // Check if no items left and add placeholder
                setTimeout(() => {
                    checkAndAddGalleryPlaceholder();
                }, 400);
                
                showNotification('Gallery item removed successfully!', 'success');
            }, 300);
        }

        function checkAndAddGalleryPlaceholder() {
            const galleryItems = document.getElementById('galleryItems');
            const adminList = document.getElementById('galleryAdminList');
            
            if (galleryItems.children.length === 0) {
                galleryItems.innerHTML = `
                    <div class="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <div class="text-6xl mb-4">📸</div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2">No Gallery Items Yet</h3>
                        <p class="text-gray-600 text-sm">Use the admin portal to add stunning images and videos to showcase your work!</p>
                    </div>
                `;
            }
            
            if (adminList.children.length === 0) {
                adminList.innerHTML = `
                    <div class="bg-white p-3 rounded border text-center">
                        <p class="text-gray-600">No gallery items added yet.</p>
                    </div>
                `;
            }
        }

        // News functionality
        function addNewsItem(event) {
            event.preventDefault();
            
            const title = document.getElementById('newsTitle').value;
            const imageInput = document.getElementById('newsImage');
            const content = document.getElementById('newsContent').value;
            
            const currentDate = new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long',
                day: 'numeric'
            });
            
            function createNewsArticle(imageUrl = '') {
                const newsItems = document.getElementById('newsItems');
                
                // Remove placeholder if it exists
                const placeholder = newsItems.querySelector('div p');
                if (placeholder && placeholder.textContent.includes('No news articles')) {
                    newsItems.innerHTML = '';
                }
                
                const articleDiv = document.createElement('article');
                articleDiv.className = 'border-b border-gray-200 pb-6 clickable-item';
                
                let imageHtml = '';
                if (imageUrl) {
                    imageHtml = `<img src="${imageUrl}" alt="${title}" class="w-full h-48 object-cover rounded-lg mb-3 cursor-pointer" onclick="openMediaModal('${imageUrl}', 'image')">`;
                }
                
                // Make links clickable in content
                const linkifiedContent = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline">$1</a>');
                
                articleDiv.innerHTML = `
                    <h3 class="text-xl font-bold text-indigo-600 mb-2">${title}</h3>
                    <p class="text-gray-600 text-sm mb-3">Published: ${currentDate}</p>
                    ${imageHtml}
                    <p class="text-gray-700">${linkifiedContent}</p>
                `;
                
                newsItems.insertBefore(articleDiv, newsItems.firstChild);
                
                // Add to admin list
                addToNewsAdminList(title, content, currentDate);
                
                // Reset form
                event.target.reset();
                hideAdminPortal('news');
                
                showNotification('News article published successfully!', 'success');
            }
            
            if (imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    createNewsArticle(e.target.result);
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                createNewsArticle();
            }
        }

        function addToNewsAdminList(title, content, date) {
            const adminList = document.getElementById('newsAdminList');
            
            // Remove placeholder if it exists
            const placeholder = adminList.querySelector('div p');
            if (placeholder && placeholder.textContent.includes('No news articles')) {
                adminList.innerHTML = '';
            }
            
            const listItem = document.createElement('div');
            listItem.className = 'bg-white p-3 rounded border';
            
            const shortContent = content.length > 80 ? content.substring(0, 80) + '...' : content;
            
            listItem.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="flex-1">
                        <h5 class="font-medium text-gray-800">${title}</h5>
                        <p class="text-sm text-gray-600 mt-1">${shortContent}</p>
                        <span class="text-xs text-gray-500">Published: ${date}</span>
                    </div>
                    <button onclick="removeNewsItem(this)" class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors">Delete</button>
                </div>
            `;
            
            adminList.insertBefore(listItem, adminList.firstChild);
        }

        function removeNewsItem(button) {
            const listItem = button.closest('.bg-white');
            const title = listItem.querySelector('h5').textContent;
            
            // Remove from admin list
            listItem.remove();
            
            // Remove from news display
            const newsItems = document.getElementById('newsItems');
            const newsArticles = newsItems.querySelectorAll('article');
            newsArticles.forEach(article => {
                const articleTitle = article.querySelector('h3');
                if (articleTitle && articleTitle.textContent === title) {
                    article.remove();
                }
            });
            
            // Check if no items left and add placeholder
            checkAndAddPlaceholder('newsItems', 'newsAdminList', 'No news articles added yet. Use the admin portal to add news.', 'No news articles added yet.');
            
            showNotification('News article removed successfully!', 'success');
        }

        // Partnership content functionality
        function addPartnershipContent(event) {
            event.preventDefault();
            
            const title = document.getElementById('partnerTitle').value;
            const imageInput = document.getElementById('partnerImage');
            const content = document.getElementById('partnerContent').value;
            
            function createPartnershipContent(imageUrl = '') {
                const partnerContent = document.getElementById('partnerContent');
                
                // Remove placeholder if it exists
                const placeholder = partnerContent.querySelector('div p');
                if (placeholder && placeholder.textContent.includes('No partnership content')) {
                    partnerContent.innerHTML = '';
                }
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'bg-gray-50 rounded-lg p-6 clickable-item';
                
                let imageHtml = '';
                if (imageUrl) {
                    imageHtml = `<img src="${imageUrl}" alt="${title}" class="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer" onclick="openMediaModal('${imageUrl}', 'image')">`;
                }
                
                // Make links clickable in content
                const linkifiedContent = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline">$1</a>');
                
                contentDiv.innerHTML = `
                    <h3 class="text-xl font-bold text-indigo-600 mb-3">${title}</h3>
                    ${imageHtml}
                    <p class="text-gray-700 leading-relaxed">${linkifiedContent}</p>
                `;
                
                partnerContent.appendChild(contentDiv);
                
                // Add to admin list
                addToPartnershipAdminList(title, content);
                
                // Reset form
                event.target.reset();
                hideAdminPortal('partner');
                
                showNotification('Partnership content added successfully!', 'success');
            }
            
            if (imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    createPartnershipContent(e.target.result);
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                createPartnershipContent();
            }
        }

        function addToPartnershipAdminList(title, content) {
            const adminList = document.getElementById('partnerAdminList');
            
            // Remove placeholder if it exists
            const placeholder = adminList.querySelector('div p');
            if (placeholder && placeholder.textContent.includes('No partnership content')) {
                adminList.innerHTML = '';
            }
            
            const listItem = document.createElement('div');
            listItem.className = 'bg-white p-3 rounded border';
            
            const shortContent = content.length > 80 ? content.substring(0, 80) + '...' : content;
            
            listItem.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="flex-1">
                        <h5 class="font-medium text-gray-800">${title}</h5>
                        <p class="text-sm text-gray-600 mt-1">${shortContent}</p>
                    </div>
                    <button onclick="removePartnershipContent(this)" class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors">Delete</button>
                </div>
            `;
            
            adminList.appendChild(listItem);
        }

        function removePartnershipContent(button) {
            const listItem = button.closest('.bg-white');
            const title = listItem.querySelector('h5').textContent;
            
            // Remove from admin list
            listItem.remove();
            
            // Remove from partnership display
            const partnerContent = document.getElementById('partnerContent');
            const contentDivs = partnerContent.querySelectorAll('.bg-gray-50');
            contentDivs.forEach(div => {
                const divTitle = div.querySelector('h3');
                if (divTitle && divTitle.textContent === title) {
                    div.remove();
                }
            });
            
            // Check if no items left and add placeholder
            checkAndAddPlaceholder('partnerContent', 'partnerAdminList', 'No partnership content added yet. Use the admin portal to add content.', 'No partnership content added yet.');
            
            showNotification('Partnership content removed successfully!', 'success');
        }

        // Partners functionality
        function addPartner(event) {
            event.preventDefault();
            
            const name = document.getElementById('partnerName').value;
            const logoInput = document.getElementById('partnerLogo');
            const description = document.getElementById('partnerDescription').value;
            const website = document.getElementById('partnerWebsite').value;
            
            if (!logoInput.files[0]) {
                showNotification('Please select a logo file to upload.', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const logoUrl = e.target.result;
                
                const partnersGrid = document.getElementById('partnersGrid');
                
                // Remove placeholder if it exists
                const placeholder = partnersGrid.querySelector('div p');
                if (placeholder && placeholder.textContent.includes('No partners added yet')) {
                    partnersGrid.innerHTML = '';
                }
                
                const partnerDiv = document.createElement('div');
                partnerDiv.className = 'text-center p-6 bg-gray-50 rounded-lg clickable-item';
                
                let websiteHtml = '';
                if (website) {
                    websiteHtml = `<a href="${website}" target="_blank" rel="noopener noreferrer" class="inline-block mt-2 text-indigo-600 hover:text-indigo-800 underline text-sm">Visit Website</a>`;
                }
                
                partnerDiv.innerHTML = `
                    <img src="${logoUrl}" alt="${name} Logo" class="w-20 h-20 mx-auto mb-4 object-contain cursor-pointer" onclick="openMediaModal('${logoUrl}', 'image')">
                    <h4 class="font-bold text-gray-800 mb-2">${name}</h4>
                    <p class="text-gray-600 text-sm">${description}</p>
                    ${websiteHtml}
                `;
                
                partnersGrid.appendChild(partnerDiv);
                
                // Add to admin list
                addToPartnersAdminList(name, description, logoUrl, website);
                
                // Reset form
                event.target.reset();
                hideAdminPortal('partners');
                
                showNotification('Partner added successfully!', 'success');
            };
            
            reader.readAsDataURL(logoInput.files[0]);
        }

        function addToPartnersAdminList(name, description, logoUrl, website) {
            const adminList = document.getElementById('partnersAdminList');
            
            // Remove placeholder if it exists
            const placeholder = adminList.querySelector('div p');
            if (placeholder && placeholder.textContent.includes('No partners added yet')) {
                adminList.innerHTML = '';
            }
            
            const listItem = document.createElement('div');
            listItem.className = 'bg-white p-3 rounded border';
            
            const shortDescription = description.length > 60 ? description.substring(0, 60) + '...' : description;
            
            let websiteInfo = '';
            if (website) {
                websiteInfo = `<p class="text-xs text-gray-500">Website: ${website}</p>`;
            }
            
            listItem.innerHTML = `
                <div class="flex items-center gap-3">
                    <img src="${logoUrl}" alt="${name} Logo" class="w-12 h-12 object-contain rounded">
                    <div class="flex-1">
                        <h5 class="font-medium text-gray-800">${name}</h5>
                        <p class="text-sm text-gray-600">${shortDescription}</p>
                        ${websiteInfo}
                    </div>
                    <button onclick="removePartner(this)" class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors">Delete</button>
                </div>
            `;
            
            adminList.appendChild(listItem);
        }

        function removePartner(button) {
            const listItem = button.closest('.bg-white');
            const name = listItem.querySelector('h5').textContent;
            
            // Remove from admin list
            listItem.remove();
            
            // Remove from partners display
            const partnersGrid = document.getElementById('partnersGrid');
            const partnerCards = partnersGrid.querySelectorAll('.bg-gray-50');
            partnerCards.forEach(card => {
                const cardName = card.querySelector('h4');
                if (cardName && cardName.textContent === name) {
                    card.remove();
                }
            });
            
            // Check if no items left and add placeholder
            checkAndAddPlaceholder('partnersGrid', 'partnersAdminList', 'No partners added yet. Use the admin portal to add partners.', 'No partners added yet.');
            
            showNotification('Partner removed successfully!', 'success');
        }

        // Helper function to check and add placeholders
        function checkAndAddPlaceholder(displayId, adminId, displayText, adminText) {
            const displayContainer = document.getElementById(displayId);
            const adminContainer = document.getElementById(adminId);
            
            if (displayContainer.children.length === 0) {
                displayContainer.innerHTML = `
                    <div class="text-center p-6 bg-gray-50 rounded-lg">
                        <p class="text-gray-600">${displayText}</p>
                    </div>
                `;
            }
            
            if (adminContainer.children.length === 0) {
                adminContainer.innerHTML = `
                    <div class="bg-white p-3 rounded border text-center">
                        <p class="text-gray-600">${adminText}</p>
                    </div>
                `;
            }
        }

        // Contact form functionality
        function sendMessage(event) {
            event.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;
            
            // Reset form
            event.target.reset();
            
            showNotification(`Thank you, ${name}! Your message has been received. We'll get back to you soon.`, 'success');
        }

        // Christmas Countdown functionality
        function updateChristmasCountdown() {
            const now = new Date();
            const currentYear = now.getFullYear();
            
            // Set Christmas date for current year
            let christmas = new Date(currentYear, 11, 25); // December 25th
            
            // If Christmas has passed this year, set it for next year
            if (now > christmas) {
                christmas = new Date(currentYear + 1, 11, 25);
            }
            
            const timeDifference = christmas - now;
            
            // Calculate time units
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            
            // Update the display
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;
            
            // If it's Christmas Day, show special message
            if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
                document.getElementById('christmasCountdown').innerHTML = `
                    <div class="bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white py-4 text-center relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                        <div class="relative z-10">
                            <div class="flex items-center justify-center gap-2 mb-2">
                                <span class="text-2xl">🎄</span>
                                <h3 class="text-2xl font-bold">Merry Christmas!</h3>
                                <span class="text-2xl">🎅</span>
                            </div>
                            <p class="text-lg">🎁 Wishing you joy, peace, and happiness! 🎁</p>
                        </div>
                    </div>
                `;
            }
        }

        // Enhanced search functionality
        function initializeSearch() {
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    const query = e.target.value.toLowerCase().trim();
                    
                    if (query.length < 2) {
                        searchResults.classList.add('hidden');
                        return;
                    }
                    
                    const results = performSearch(query);
                    displaySearchResults(results);
                });
            }
        }
        
        function performSearch(query) {
            const searchableContent = [
                { section: 'home', title: 'Welcome to JMB Studio', content: 'creative solutions production services mission vision' },
                { section: 'about', title: 'About Us', content: 'multimedia video photography graphic design digital marketing' },
                { section: 'history', title: 'Our History', content: 'founded 2023 growth journey beginning' },
                { section: 'founder', title: 'Founder', content: 'jorenz balbuena ceo chief executive officer' },
                { section: 'gallery', title: 'Gallery', content: 'images videos portfolio work showcase' },
                { section: 'news', title: 'News & Updates', content: 'latest news updates announcements' },
                { section: 'partner', title: 'Partner With Us', content: 'partnership collaboration business opportunities' },
                { section: 'partners', title: 'Our Partners', content: 'business partners collaborators clients' },
                { section: 'contact', title: 'Contact Us', content: 'phone email message get in touch' }
            ];
            
            return searchableContent.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.content.toLowerCase().includes(query)
            );
        }
        
        function displaySearchResults(results) {
            const searchResults = document.getElementById('searchResults');
            
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="p-3 text-gray-600">No results found</div>';
            } else {
                searchResults.innerHTML = results.map(result => `
                    <div class="p-3 hover:bg-gray-100 cursor-pointer border-b" onclick="showSection('${result.section}'); hideSearch();">
                        <h4 class="font-medium text-gray-800">${result.title}</h4>
                        <p class="text-sm text-gray-600">Click to view section</p>
                    </div>
                `).join('');
            }
            
            searchResults.classList.remove('hidden');
        }
        
        function hideSearch() {
            document.getElementById('searchResults').classList.add('hidden');
            document.getElementById('searchInput').value = '';
        }

        // Birthday Raffle functionality
        function showBirthdayRaffleModal() {
            const modal = document.getElementById('birthdayRaffleModal');
            modal.classList.remove('hidden');
            
            // Focus on first input
            setTimeout(() => {
                document.getElementById('raffleFullName').focus();
            }, 100);
        }

        function closeBirthdayRaffleModal() {
            const modal = document.getElementById('birthdayRaffleModal');
            modal.classList.add('hidden');
            
            // Reset form
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                // Reset ticket count and total
                document.getElementById('raffleTickets').value = '1';
                document.getElementById('totalAmount').textContent = '₱50';
            }
        }

        function adjustTickets(change) {
            const ticketsInput = document.getElementById('raffleTickets');
            const totalAmountSpan = document.getElementById('totalAmount');
            
            let currentTickets = parseInt(ticketsInput.value) || 1;
            let newTickets = currentTickets + change;
            
            // Ensure tickets stay within bounds
            if (newTickets < 1) newTickets = 1;
            if (newTickets > 50) newTickets = 50;
            
            ticketsInput.value = newTickets;
            
            // Update total amount
            const totalAmount = newTickets * 50;
            totalAmountSpan.textContent = `₱${totalAmount}`;
        }

        // Update total when tickets input changes directly
        document.addEventListener('DOMContentLoaded', function() {
            const ticketsInput = document.getElementById('raffleTickets');
            if (ticketsInput) {
                ticketsInput.addEventListener('input', function() {
                    let tickets = parseInt(this.value) || 1;
                    if (tickets < 1) tickets = 1;
                    if (tickets > 50) tickets = 50;
                    this.value = tickets;
                    
                    const totalAmount = tickets * 50;
                    document.getElementById('totalAmount').textContent = `₱${totalAmount}`;
                });
            }
        });

        function generateRaffleNumber() {
            // Generate a unique raffle number: RAFFLE-YYYYMMDD-HHMMSS-XXX
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
            
            return `RAFFLE-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
        }

        function generateRaffleTicketNumbers(count) {
            const tickets = [];
            for (let i = 0; i < count; i++) {
                // Generate ticket number: JMB-YYYYMMDD-XXXXX
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const random = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
                
                tickets.push(`JMB-${year}${month}${day}-${random}`);
            }
            return tickets;
        }

        function submitBirthdayRaffle(event) {
            event.preventDefault();
            
            // Collect all form data
            const formData = {
                // Personal Information
                fullName: document.getElementById('raffleFullName').value.trim(),
                age: document.getElementById('raffleAge').value,
                email: document.getElementById('raffleEmail').value.trim(),
                phone: document.getElementById('rafflePhone').value.trim(),
                
                // Address Information
                address: document.getElementById('raffleAddress').value.trim(),
                city: document.getElementById('raffleCity').value.trim(),
                province: document.getElementById('raffleProvince').value.trim(),
                
                // Raffle Details
                tickets: parseInt(document.getElementById('raffleTickets').value),
                totalAmount: parseInt(document.getElementById('raffleTickets').value) * 50,
                message: document.getElementById('raffleMessage').value.trim(),
                
                // Generated Information
                raffleNumber: generateRaffleNumber(),
                ticketNumbers: generateRaffleTicketNumbers(parseInt(document.getElementById('raffleTickets').value)),
                registrationDate: new Date().toLocaleString('en-PH', { 
                    timeZone: 'Asia/Manila',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            };
            
            // Show processing state
            const submitBtn = event.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '🎫 Processing Registration...';
            submitBtn.disabled = true;
            
            // Simulate processing time
            setTimeout(() => {
                // Generate email content
                const emailSubject = `🎂 Birthday Raffle Registration - ${formData.fullName} (${formData.raffleNumber})`;
                const emailBody = `
🎂 JORENZ MELO BALBUENA'S BIRTHDAY RAFFLE REGISTRATION
=====================================================

🎫 REGISTRATION DETAILS
-----------------------
Registration Number: ${formData.raffleNumber}
Registration Date: ${formData.registrationDate}
Status: PENDING PAYMENT

👤 PARTICIPANT INFORMATION
--------------------------
Full Name: ${formData.fullName}
Age: ${formData.age} years old
Email: ${formData.email}
Phone: ${formData.phone}

📍 ADDRESS INFORMATION
----------------------
Complete Address: ${formData.address}
City: ${formData.city}
Province: ${formData.province}

🎟️ RAFFLE TICKET DETAILS
-------------------------
Number of Tickets: ${formData.tickets} ticket(s)
Ticket Price: ₱50 each
Total Amount: ₱${formData.totalAmount}

🎫 YOUR RAFFLE TICKET NUMBERS:
${formData.ticketNumbers.map((ticket, index) => `Ticket ${index + 1}: ${ticket}`).join('\n')}

💝 SPECIAL MESSAGE
------------------
${formData.message || 'No special message provided.'}

💳 PAYMENT INSTRUCTIONS
-----------------------
Please send your payment of ₱${formData.totalAmount} via GCash:

GCash Name: JORENZ MELO BALBUENA
GCash Number: 0947818896

IMPORTANT: After sending payment, please take a screenshot of your GCash receipt and send it along with your registration number (${formData.raffleNumber}) to jorenzmelo21@gmail.com to confirm your raffle entry.

📋 IMPORTANT REMINDERS
----------------------
✓ Keep this email as your official raffle receipt
✓ Payment must be completed within 24 hours to secure your tickets
✓ Send payment proof to jorenzmelo21@gmail.com with your registration number
✓ Winners will be announced on Jorenz Melo Balbuena's birthday
✓ Prizes must be claimed within 30 days of announcement
✓ All decisions by the organizer are final

🎁 RAFFLE PRIZES
----------------
🥇 1st Prize: [To be announced]
🥈 2nd Prize: [To be announced]
🥉 3rd Prize: [To be announced]
🎊 Consolation Prizes: [To be announced]

📞 CONTACT INFORMATION
----------------------
For questions or concerns:
Email: jorenzmelo21@gmail.com
Phone: 09050869449 (TM) / 09947134879 (DITO)

🎉 Thank you for joining Jorenz Melo Balbuena's Birthday Raffle! 🎉
Good luck and may the odds be in your favor!

---
JMB Studio Production, Inc.
"Bringing your creative vision to life"

This is an automated registration confirmation.
Registration ID: ${formData.raffleNumber}
                `.trim();
                
                // Create mailto link
                const mailtoLink = `mailto:jorenzmelo21@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                
                // Open email client
                window.open(mailtoLink, '_blank');
                
                // Show success message with ticket details
                showRaffleSuccessModal(formData);
                
                // Store registration locally for reference
                const registrations = JSON.parse(localStorage.getItem('raffleRegistrations') || '[]');
                registrations.push({
                    id: formData.raffleNumber,
                    name: formData.fullName,
                    email: formData.email,
                    tickets: formData.tickets,
                    totalAmount: formData.totalAmount,
                    ticketNumbers: formData.ticketNumbers,
                    registrationDate: formData.registrationDate,
                    status: 'Pending Payment'
                });
                localStorage.setItem('raffleRegistrations', JSON.stringify(registrations));
                
                // Reset form and close modal
                closeBirthdayRaffleModal();
                
            }, 2000);
        }

        function showRaffleSuccessModal(formData) {
            // Create success modal
            const successModal = document.createElement('div');
            successModal.id = 'raffleSuccessModal';
            successModal.className = 'admin-login-modal';
            
            successModal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4 scale-in card-hover max-h-[90vh] overflow-y-auto">
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">🎉</div>
                        <h2 class="text-2xl font-bold gradient-text bounce-in">Registration Successful!</h2>
                        <p class="text-gray-600 mt-2 fade-in stagger-1">Your raffle registration has been processed</p>
                    </div>
                    
                    <div class="space-y-4">
                        <!-- Registration Summary -->
                        <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
                            <h3 class="text-lg font-semibold text-gray-800 mb-3">🎫 Registration Summary</h3>
                            <div class="grid md:grid-cols-2 gap-4 text-sm">
                                <div><strong>Registration #:</strong> ${formData.raffleNumber}</div>
                                <div><strong>Participant:</strong> ${formData.fullName}</div>
                                <div><strong>Tickets Purchased:</strong> ${formData.tickets}</div>
                                <div><strong>Total Amount:</strong> ₱${formData.totalAmount}</div>
                            </div>
                        </div>

                        <!-- Ticket Numbers -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-3">🎟️ Your Raffle Ticket Numbers</h3>
                            <div class="grid grid-cols-1 gap-2">
                                ${formData.ticketNumbers.map((ticket, index) => `
                                    <div class="bg-white p-2 rounded border text-center font-mono text-sm">
                                        <strong>Ticket ${index + 1}:</strong> ${ticket}
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Next Steps -->
                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h3 class="text-lg font-semibold text-blue-800 mb-3">📋 Next Steps</h3>
                            <div class="text-sm space-y-2">
                                <div class="flex items-start gap-2">
                                    <span class="text-blue-600">1.</span>
                                    <span>Check your email client - a detailed registration email has been prepared</span>
                                </div>
                                <div class="flex items-start gap-2">
                                    <span class="text-blue-600">2.</span>
                                    <span>Send the email to complete your registration</span>
                                </div>
                                <div class="flex items-start gap-2">
                                    <span class="text-blue-600">3.</span>
                                    <span>Wait for payment instructions from JMB Studio Production</span>
                                </div>
                                <div class="flex items-start gap-2">
                                    <span class="text-blue-600">4.</span>
                                    <span>Complete payment within 24 hours to secure your tickets</span>
                                </div>
                            </div>
                        </div>

                        <!-- Important Note -->
                        <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <h3 class="text-lg font-semibold text-yellow-800 mb-2">⚠️ Important</h3>
                            <p class="text-sm text-yellow-700">
                                Keep your registration number <strong>${formData.raffleNumber}</strong> safe! 
                                You'll need it for payment confirmation and prize claiming.
                            </p>
                        </div>
                    </div>

                    <!-- Close Button -->
                    <div class="flex justify-center pt-6 mt-6 border-t">
                        <button onclick="closeRaffleSuccessModal()" class="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all hover-lift pulse-glow font-semibold">
                            🎊 Awesome! Close
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(successModal);
            
            // Show success notification
            showNotification(`🎉 Raffle registration successful! Registration #: ${formData.raffleNumber}`, 'success');
        }

        function closeRaffleSuccessModal() {
            const successModal = document.getElementById('raffleSuccessModal');
            if (successModal) {
                successModal.remove();
            }
        }

        // MOA Partnership functionality
        function showMOAModal() {
            const modal = document.getElementById('moaModal');
            modal.classList.remove('hidden');
            
            // Focus on first input
            setTimeout(() => {
                document.getElementById('companyName').focus();
            }, 100);
        }

        function closeMOAModal() {
            const modal = document.getElementById('moaModal');
            modal.classList.add('hidden');
            
            // Reset form
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }

        function submitMOA(event) {
            event.preventDefault();
            
            // Collect all form data
            const formData = {
                // Company Information
                companyName: document.getElementById('companyName').value,
                companyType: document.getElementById('companyType').value,
                registrationNumber: document.getElementById('registrationNumber').value,
                industry: document.getElementById('industry').value,
                
                // Contact Person
                contactName: document.getElementById('contactName').value,
                contactPosition: document.getElementById('contactPosition').value,
                contactEmail: document.getElementById('contactEmail').value,
                contactPhone: document.getElementById('contactPhone').value,
                
                // Company Address
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zipCode: document.getElementById('zipCode').value,
                country: document.getElementById('country').value,
                
                // Partnership Details
                partnershipType: document.getElementById('partnershipType').value,
                services: document.getElementById('services').value,
                proposedCollaboration: document.getElementById('proposedCollaboration').value,
                expectedBenefits: document.getElementById('expectedBenefits').value,
                
                // Submission Info
                submissionDate: new Date().toLocaleString(),
                submissionId: 'MOA-' + Date.now()
            };
            
            // Show review modal instead of directly sending
            showMOAReview(formData);
        }

        function showMOAReview(formData) {
            // Create review modal
            const reviewModal = document.createElement('div');
            reviewModal.id = 'moaReviewModal';
            reviewModal.className = 'admin-login-modal';
            
            reviewModal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full mx-4 scale-in card-hover max-h-[90vh] overflow-y-auto">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold gradient-text bounce-in">📋 Review Your MOA Application</h2>
                        <p class="text-gray-600 mt-2 fade-in stagger-1">Please review all information before sending</p>
                    </div>
                    
                    <div class="space-y-6">
                        <!-- Company Information -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-3">Company Information</h3>
                            <div class="grid md:grid-cols-2 gap-4 text-sm">
                                <div><strong>Company Name:</strong> ${formData.companyName}</div>
                                <div><strong>Company Type:</strong> ${formData.companyType}</div>
                                <div><strong>Registration Number:</strong> ${formData.registrationNumber || 'Not provided'}</div>
                                <div><strong>Industry:</strong> ${formData.industry}</div>
                            </div>
                        </div>

                        <!-- Contact Person -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-3">Primary Contact Person</h3>
                            <div class="grid md:grid-cols-2 gap-4 text-sm">
                                <div><strong>Full Name:</strong> ${formData.contactName}</div>
                                <div><strong>Position/Title:</strong> ${formData.contactPosition}</div>
                                <div><strong>Email Address:</strong> ${formData.contactEmail}</div>
                                <div><strong>Phone Number:</strong> ${formData.contactPhone}</div>
                            </div>
                        </div>

                        <!-- Company Address -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-3">Company Address</h3>
                            <div class="text-sm space-y-2">
                                <div><strong>Street Address:</strong> ${formData.address}</div>
                                <div class="grid md:grid-cols-3 gap-4">
                                    <div><strong>City:</strong> ${formData.city}</div>
                                    <div><strong>State/Province:</strong> ${formData.state}</div>
                                    <div><strong>ZIP/Postal Code:</strong> ${formData.zipCode}</div>
                                </div>
                                <div><strong>Country:</strong> ${formData.country}</div>
                            </div>
                        </div>

                        <!-- Partnership Details -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-3">Partnership Details</h3>
                            <div class="text-sm space-y-3">
                                <div><strong>Type of Partnership:</strong> ${formData.partnershipType}</div>
                                <div>
                                    <strong>Services/Products Offered:</strong>
                                    <p class="mt-1 text-gray-700">${formData.services}</p>
                                </div>
                                <div>
                                    <strong>Proposed Collaboration:</strong>
                                    <p class="mt-1 text-gray-700">${formData.proposedCollaboration}</p>
                                </div>
                                <div>
                                    <strong>Expected Mutual Benefits:</strong>
                                    <p class="mt-1 text-gray-700">${formData.expectedBenefits || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Submission Info -->
                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h3 class="text-lg font-semibold text-blue-800 mb-3">Submission Information</h3>
                            <div class="text-sm space-y-1">
                                <div><strong>Submission ID:</strong> ${formData.submissionId}</div>
                                <div><strong>Submission Date:</strong> ${formData.submissionDate}</div>
                                <div><strong>Email will be sent to:</strong> jorenzmelo21@gmail.com</div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 pt-6 mt-6 border-t">
                        <button onclick="editMOAApplication()" class="flex-1 bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors hover-lift font-semibold">
                            ✏️ Edit Application
                        </button>
                        <button onclick="confirmSendMOA()" class="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors hover-lift pulse-glow font-semibold">
                            📧 Confirm & Send
                        </button>
                        <button onclick="closeMOAReview()" class="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors hover-lift">
                            ❌ Cancel
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(reviewModal);
            
            // Store form data globally for later use
            window.currentMOAData = formData;
        }

        function editMOAApplication() {
            // Close review modal and return to form
            closeMOAReview();
            // The original form modal should still be open with data intact
        }

        function closeMOAReview() {
            const reviewModal = document.getElementById('moaReviewModal');
            if (reviewModal) {
                reviewModal.remove();
            }
            delete window.currentMOAData;
        }

        function confirmSendMOA() {
            const formData = window.currentMOAData;
            if (!formData) {
                showNotification('Error: Application data not found. Please try again.', 'error');
                return;
            }
            
            // Create email content
            const emailSubject = `MOA Partnership Application - ${formData.companyName}`;
            const emailBody = `
MEMORANDUM OF AGREEMENT - PARTNERSHIP APPLICATION
================================================

Submission ID: ${formData.submissionId}
Submission Date: ${formData.submissionDate}

COMPANY INFORMATION
-------------------
Company Name: ${formData.companyName}
Company Type: ${formData.companyType}
Registration Number: ${formData.registrationNumber || 'Not provided'}
Industry: ${formData.industry}

PRIMARY CONTACT PERSON
----------------------
Full Name: ${formData.contactName}
Position/Title: ${formData.contactPosition}
Email Address: ${formData.contactEmail}
Phone Number: ${formData.contactPhone}

COMPANY ADDRESS
---------------
Street Address: ${formData.address}
City: ${formData.city}
State/Province: ${formData.state}
ZIP/Postal Code: ${formData.zipCode}
Country: ${formData.country}

PARTNERSHIP DETAILS
-------------------
Type of Partnership: ${formData.partnershipType}

Services/Products Offered:
${formData.services}

Proposed Collaboration:
${formData.proposedCollaboration}

Expected Mutual Benefits:
${formData.expectedBenefits || 'Not specified'}

TERMS & CONDITIONS
------------------
✓ Applicant agrees that this MOA application is subject to review and approval by JMB Studio Production, Inc.
✓ Applicant confirms that all information provided is accurate and complete.
✓ Applicant authorizes JMB Studio Production to contact them regarding this partnership application.

---
This MOA application was submitted through the JMB Studio Production website.
For questions or follow-up, please contact the applicant directly at: ${formData.contactEmail}
            `.trim();
            
            // Create mailto link
            const mailtoLink = `mailto:jorenzmelo21@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Show loading state
            const confirmBtn = document.querySelector('#moaReviewModal button[onclick="confirmSendMOA()"]');
            const originalText = confirmBtn.innerHTML;
            confirmBtn.innerHTML = '📤 Sending...';
            confirmBtn.disabled = true;
            
            // Simulate processing time
            setTimeout(() => {
                // Open email client
                window.open(mailtoLink, '_blank');
                
                // Show success message
                showNotification(`MOA Application prepared successfully! 📧\n\nSubmission ID: ${formData.submissionId}\n\nYour email client should open with the pre-filled application. Please send the email to complete your submission.`, 'success');
                
                // Close all modals
                closeMOAReview();
                closeMOAModal();
                
                // Store submission locally for reference
                const submissions = JSON.parse(localStorage.getItem('moaSubmissions') || '[]');
                submissions.push({
                    id: formData.submissionId,
                    companyName: formData.companyName,
                    contactName: formData.contactName,
                    contactEmail: formData.contactEmail,
                    submissionDate: formData.submissionDate,
                    status: 'Email Prepared'
                });
                localStorage.setItem('moaSubmissions', JSON.stringify(submissions));
                
            }, 1500);
        }

        // Background Settings functionality
        function showBackgroundSettings() {
            // Check if user is admin
            if (!isAdminLoggedIn) {
                showNotification('Access denied! Please login as admin to customize background settings.', 'error');
                return;
            }
            
            const modal = document.getElementById('backgroundModal');
            modal.classList.remove('hidden');
            
            // Load current background settings
            const currentBg = document.body.style.backgroundImage;
            if (currentBg && currentBg !== 'none') {
                const urlMatch = currentBg.match(/url\("(.+)"\)/);
                if (urlMatch) {
                    document.getElementById('backgroundUrl').value = urlMatch[1];
                }
            }
        }

        function closeBackgroundSettings() {
            const modal = document.getElementById('backgroundModal');
            modal.classList.add('hidden');
        }

        function applyBackground() {
            const url = document.getElementById('backgroundUrl').value.trim();
            const opacity = document.getElementById('backgroundOpacity').value;
            const size = document.getElementById('backgroundSize').value;
            const position = document.getElementById('backgroundPosition').value;
            
            if (!url) {
                showNotification('Please enter a background image URL.', 'error');
                return;
            }
            
            // Validate URL format
            try {
                new URL(url);
            } catch (e) {
                showNotification('Please enter a valid URL.', 'error');
                return;
            }
            
            // Apply background to body
            document.body.style.backgroundImage = `url("${url}")`;
            document.body.style.backgroundSize = size;
            document.body.style.backgroundPosition = position;
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
            
            // Update the overlay opacity
            const bgPattern = document.querySelector('.bg-pattern');
            if (bgPattern) {
                const overlay = bgPattern.querySelector('::before') || bgPattern;
                bgPattern.style.setProperty('--bg-opacity', opacity / 100);
            }
            
            // Update the gradient overlay opacity
            const style = document.createElement('style');
            style.textContent = `
                .bg-pattern::before {
                    opacity: ${opacity / 100} !important;
                }
            `;
            document.head.appendChild(style);
            
            closeBackgroundSettings();
            showNotification('Background applied successfully! 🎨', 'success');
        }

        function resetBackground() {
            // Reset to original gradient background
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundSize = 'auto';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'repeat';
            document.body.style.backgroundAttachment = 'scroll';
            
            // Reset form
            document.getElementById('backgroundUrl').value = '';
            document.getElementById('backgroundOpacity').value = '20';
            document.getElementById('backgroundSize').value = 'cover';
            document.getElementById('backgroundPosition').value = 'center';
            document.getElementById('opacityValue').textContent = '20%';
            
            // Remove any custom styles
            const customStyles = document.querySelectorAll('style');
            customStyles.forEach(style => {
                if (style.textContent.includes('.bg-pattern::before')) {
                    style.remove();
                }
            });
            
            showNotification('Background reset to default! ✨', 'success');
        }

        // Update opacity value display
        document.addEventListener('DOMContentLoaded', function() {
            const opacitySlider = document.getElementById('backgroundOpacity');
            const opacityValue = document.getElementById('opacityValue');
            
            if (opacitySlider && opacityValue) {
                opacitySlider.addEventListener('input', function() {
                    opacityValue.textContent = this.value + '%';
                });
            }
        });

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            showSection('home');
            initializeSearch();
            
            // Start Christmas countdown
            updateChristmasCountdown();
            setInterval(updateChristmasCountdown, 1000);
            
            // Close search when clicking outside
            document.addEventListener('click', function(e) {
                const searchContainer = document.querySelector('.search-container');
                if (searchContainer && !searchContainer.contains(e.target)) {
                    hideSearch();
                }
            });
            
            // Close modal with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeMediaModal();
                    closeAdminLogin();
                    closeBackgroundSettings();
                    closeMOAModal();
                    closeBirthdayRaffleModal();
                    closeRaffleSuccessModal();
                }
            });
        });

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'99195d1b33184ee4',t:'MTc2MDk3MjIwNi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
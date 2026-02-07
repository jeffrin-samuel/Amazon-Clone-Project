/* ==========================================
   AMAZON CLONE - JAVASCRIPT INTERACTIVITY
   ========================================== */

// Global cart array to track items
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// ==========================================
// FEATURE 1: FORM VALIDATION (Search Bar)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    const searchForm = document.querySelector('.nav-search');

    // Create error message element
    const errorMsg = document.createElement('div');
    errorMsg.className = 'search-error';
    errorMsg.style.display = 'none';
    searchForm.parentElement.appendChild(errorMsg);

    searchIcon.addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = searchInput.value.trim();

        if (searchValue === '') {
            // Show error for empty search
            errorMsg.textContent = 'Please enter a search term';
            errorMsg.style.display = 'block';
            searchInput.style.border = '2px solid red';
            
            setTimeout(() => {
                errorMsg.style.display = 'none';
                searchInput.style.border = 'none';
            }, 3000);
        } else if (searchValue.length < 2) {
            // Validate minimum length
            errorMsg.textContent = 'Search term must be at least 2 characters';
            errorMsg.style.display = 'block';
            searchInput.style.border = '2px solid red';
            
            setTimeout(() => {
                errorMsg.style.display = 'none';
                searchInput.style.border = 'none';
            }, 3000);
        } else {
            // Valid search
            errorMsg.style.display = 'none';
            searchInput.style.border = '2px solid green';
            alert(`Searching for: "${searchValue}"`);
            
            setTimeout(() => {
                searchInput.style.border = 'none';
            }, 2000);
        }
    });

    // Allow Enter key to trigger search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchIcon.click();
        }
    });
});

// ==========================================
// FEATURE 2: LOGIN & SIGNUP MODALS
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const signInBtn = document.querySelector('.nav-signin');
    
    // Only add login click handler if user is not logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        signInBtn.addEventListener('click', showLoginModal);
    }

    function showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <span class="modal-close">&times;</span>
                <div class="auth-logo"></div>
                <h2>Sign in to Amazon</h2>
                <form class="auth-form" id="loginForm">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="loginEmail" required>
                        <span class="error-text"></span>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="loginPassword" required>
                        <span class="error-text"></span>
                    </div>
                    <button type="submit" class="auth-submit-btn">Sign in</button>
                </form>
                <div class="auth-divider">
                    <span>New to Amazon?</span>
                </div>
                <button class="auth-secondary-btn" id="showSignup">Create your Amazon account</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Login form submission
        const loginForm = modal.querySelector('#loginForm');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            // Clear previous errors
            modal.querySelectorAll('.error-text').forEach(span => span.textContent = '');
            modal.querySelectorAll('input').forEach(input => input.classList.remove('input-error'));
            
            let hasError = false;
            
            // Email validation
            if (email === '') {
                showError('loginEmail', 'Email is required');
                hasError = true;
            } else if (!isValidEmail(email)) {
                showError('loginEmail', 'Enter a valid email address');
                hasError = true;
            }
            
            // Password validation
            if (password === '') {
                showError('loginPassword', 'Password is required');
                hasError = true;
            } else if (password.length < 6) {
                showError('loginPassword', 'Password must be at least 6 characters');
                hasError = true;
            }
            
            if (!hasError) {
                // Store user info
                localStorage.setItem('userEmail', email);
                localStorage.setItem('isLoggedIn', 'true');
                
                modal.remove();
                showSuccessMessage('Successfully logged in! Welcome back!');
                updateUserUI();
            }
        });

        // Show signup modal
        const showSignupBtn = modal.querySelector('#showSignup');
        showSignupBtn.addEventListener('click', () => {
            modal.remove();
            showSignupModal();
        });
    }

    function showSignupModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <span class="modal-close">&times;</span>
                <div class="auth-logo"></div>
                <h2>Create account</h2>
                <form class="auth-form" id="signupForm">
                    <div class="form-group">
                        <label>Your name</label>
                        <input type="text" id="signupName" required>
                        <span class="error-text"></span>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="signupEmail" required>
                        <span class="error-text"></span>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="signupPassword" required>
                        <span class="error-text"></span>
                        <small>Password must be at least 6 characters</small>
                    </div>
                    <div class="form-group">
                        <label>Re-enter password</label>
                        <input type="password" id="signupPasswordConfirm" required>
                        <span class="error-text"></span>
                    </div>
                    <button type="submit" class="auth-submit-btn">Create your Amazon account</button>
                </form>
                <div class="auth-footer">
                    Already have an account? <a href="#" id="showLogin">Sign in</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Signup form submission
        const signupForm = modal.querySelector('#signupForm');
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const confirmPassword = document.getElementById('signupPasswordConfirm').value.trim();
            
            // Clear previous errors
            modal.querySelectorAll('.error-text').forEach(span => span.textContent = '');
            modal.querySelectorAll('input').forEach(input => input.classList.remove('input-error'));
            
            let hasError = false;
            
            // Name validation
            if (name === '') {
                showError('signupName', 'Name is required');
                hasError = true;
            }
            
            // Email validation
            if (email === '') {
                showError('signupEmail', 'Email is required');
                hasError = true;
            } else if (!isValidEmail(email)) {
                showError('signupEmail', 'Enter a valid email address');
                hasError = true;
            }
            
            // Password validation
            if (password === '') {
                showError('signupPassword', 'Password is required');
                hasError = true;
            } else if (password.length < 6) {
                showError('signupPassword', 'Password must be at least 6 characters');
                hasError = true;
            }
            
            // Confirm password validation
            if (confirmPassword === '') {
                showError('signupPasswordConfirm', 'Please confirm your password');
                hasError = true;
            } else if (password !== confirmPassword) {
                showError('signupPasswordConfirm', 'Passwords do not match');
                hasError = true;
            }
            
            if (!hasError) {
                // Store user info
                localStorage.setItem('userName', name);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('isLoggedIn', 'true');
                
                modal.remove();
                showSuccessMessage('Successfully registered! Welcome to Amazon, ' + name + '!');
                updateUserUI();
            }
        });

        // Show login modal
        const showLoginBtn = modal.querySelector('#showLogin');
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove();
            showLoginModal();
        });
    }

    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorSpan = input.parentElement.querySelector('.error-text');
        input.classList.add('input-error');
        errorSpan.textContent = message;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));
    }

    function showSuccessMessage(message) {
        const successToast = document.createElement('div');
        successToast.className = 'success-toast';
        successToast.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(successToast);

        setTimeout(() => {
            successToast.remove();
        }, 4000);
    }

    function updateUserUI() {
        const userName = localStorage.getItem('userName') || 'User';
        const signInSection = document.querySelector('.nav-signin');
        
        // Remove any existing click listeners by cloning
        const newSignInSection = signInSection.cloneNode(false);
        signInSection.parentNode.replaceChild(newSignInSection, signInSection);
        
        // Clear existing content
        newSignInSection.innerHTML = '';
        newSignInSection.style.cursor = 'pointer';
        
        // Create user greeting
        const greeting = document.createElement('p');
        greeting.innerHTML = `<span>Hello, ${userName}</span>`;
        
        // Create sign out option
        const signOutText = document.createElement('p');
        signOutText.className = 'nav-second';
        signOutText.textContent = 'Sign Out';
        signOutText.style.cursor = 'pointer';
        
        newSignInSection.appendChild(greeting);
        newSignInSection.appendChild(signOutText);
        
        // Sign out handler - only add to the logged-in version
        newSignInSection.addEventListener('click', function() {
            // Clear user data
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('isLoggedIn');
            
            // Show logout success
            showSuccessMessage('Successfully logged out!');
            
            // Reset UI
            const signInSection = document.querySelector('.nav-signin');
            const newSignInSection = signInSection.cloneNode(false);
            signInSection.parentNode.replaceChild(newSignInSection, signInSection);
            
            newSignInSection.innerHTML = `
                <p><span>Hello, sign in</span></p>
                <p class="nav-second">Account & Lists</p>
            `;
            newSignInSection.style.cursor = 'pointer';
            newSignInSection.classList.add('border');
            
            // Re-add login handler to the logged-out version
            newSignInSection.addEventListener('click', showLoginModal);
        });
    }

    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        updateUserUI();
    }
});

// ==========================================
// FEATURE 3: DYNAMIC THEME TOGGLE
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Create theme toggle button
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle border';
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    themeToggle.title = 'Toggle Dark Mode';
    
    // Insert after returns
    const navReturns = document.querySelector('.nav-returns');
    navReturns.parentElement.insertBefore(themeToggle, navReturns.nextSibling);

    // Check for saved theme preference in Local Storage
    const savedTheme = localStorage.getItem('amazonTheme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    }

    themeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        themeToggle.title = 'Toggle Light Mode';
        localStorage.setItem('amazonTheme', 'dark');
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        themeToggle.title = 'Toggle Dark Mode';
        localStorage.setItem('amazonTheme', 'light');
    }
});

// ==========================================
// FEATURE 4: SHOW/HIDE FAQ SECTION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Create FAQ section
    const faqSection = document.createElement('div');
    faqSection.className = 'faq-section';
    faqSection.innerHTML = `
        <div class="faq-container">
            <h2>Frequently Asked Questions</h2>
            
            <div class="faq-item">
                <div class="faq-question">
                    <span>How do I track my order?</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>You can track your order by going to "Returns & Orders" section. Enter your order number and email address to view the current status and estimated delivery date.</p>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">
                    <span>What is the return policy?</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>Most items can be returned within 30 days of delivery. The item must be in new, unused condition with original packaging. Refunds are processed within 5-7 business days.</p>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">
                    <span>Do you offer international shipping?</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>Yes! We ship to over 100 countries worldwide. Shipping costs and delivery times vary by destination. Check the shipping calculator at checkout for details.</p>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">
                    <span>How can I contact customer service?</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>You can reach our customer service team 24/7 via:<br>
                    • Live chat on our website<br>
                    • Email: support@amazon.com<br>
                    • Phone: 1-800-AMAZON-1</p>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">
                    <span>Is my payment information secure?</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>Absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers.</p>
                </div>
            </div>
        </div>
    `;

    // Insert FAQ before footer
    const footer = document.querySelector('footer');
    footer.parentElement.insertBefore(faqSection, footer);

    // Add click handlers to FAQ questions
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('i');

            // Toggle active class
            faqItem.classList.toggle('active');

            // Toggle icon
            if (faqItem.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
                answer.style.maxHeight = '0';
            }
        });
    });
});

// ==========================================
// FEATURE 5: CART SYSTEM WITH ADD/REMOVE
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Add "See more" modal functionality
    const seeMoreLinks = document.querySelectorAll('.box-content p');
    
    seeMoreLinks.forEach(link => {
        if (link.textContent === 'See more') {
            link.style.cursor = 'pointer';
            
            link.addEventListener('click', function() {
                const categoryName = this.parentElement.querySelector('h2').textContent;
                showCategoryModal(categoryName);
            });
        }
    });

    // Create category modal
    function showCategoryModal(category) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2>${category}</h2>
                <p>Explore our wide selection of ${category.toLowerCase()} products!</p>
                <div class="modal-features">
                    <div class="feature">
                        <i class="fa-solid fa-truck"></i>
                        <span>Fast Delivery</span>
                    </div>
                    <div class="feature">
                        <i class="fa-solid fa-shield-halved"></i>
                        <span>Secure Shopping</span>
                    </div>
                    <div class="feature">
                        <i class="fa-solid fa-rotate-left"></i>
                        <span>Easy Returns</span>
                    </div>
                </div>
                <button class="modal-button">Shop Now</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        const shopBtn = modal.querySelector('.modal-button');
        shopBtn.addEventListener('click', () => {
            alert(`Redirecting to ${category} products...`);
            modal.remove();
        });
    }

    // Add cart buttons to each product box
    document.querySelectorAll('.box').forEach((box, index) => {
        const itemName = box.querySelector('h2').textContent;
        const itemId = 'item-' + index;
        
        // Create cart buttons container
        const cartBtns = document.createElement('div');
        cartBtns.className = 'cart-buttons';
        
        const addBtn = document.createElement('button');
        addBtn.className = 'cart-btn add-to-cart-btn';
        addBtn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
        addBtn.dataset.itemId = itemId;
        addBtn.dataset.itemName = itemName;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'cart-btn remove-from-cart-btn';
        removeBtn.innerHTML = '<i class="fa-solid fa-cart-minus"></i> Remove';
        removeBtn.dataset.itemId = itemId;
        removeBtn.dataset.itemName = itemName;
        removeBtn.style.display = 'none';
        
        cartBtns.appendChild(addBtn);
        cartBtns.appendChild(removeBtn);
        box.querySelector('.box-content').appendChild(cartBtns);
        
        // Check if item is already in cart
        if (isInCart(itemId)) {
            addBtn.style.display = 'none';
            removeBtn.style.display = 'block';
        }
        
        // Add to cart handler
        addBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = this.dataset.itemId;
            const itemName = this.dataset.itemName;
            
            if (isInCart(itemId)) {
                showToast('Item already in cart!', 'info');
                return;
            }
            
            addToCart(itemId, itemName);
            this.style.display = 'none';
            removeBtn.style.display = 'block';
            showToast(`${itemName} added to cart!`, 'success');
            updateCartUI();
        });
        
        // Remove from cart handler
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = this.dataset.itemId;
            const itemName = this.dataset.itemName;
            
            removeFromCart(itemId);
            this.style.display = 'none';
            addBtn.style.display = 'block';
            showToast(`${itemName} removed from cart`, 'info');
            updateCartUI();
        });
    });

    // Cart functionality
    function addToCart(itemId, itemName) {
        if (!isInCart(itemId)) {
            cartItems.push({ id: itemId, name: itemName });
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }

    function removeFromCart(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function isInCart(itemId) {
        return cartItems.some(item => item.id === itemId);
    }

    function updateCartUI() {
        const cartCount = cartItems.length;
        let cartBadge = document.querySelector('.cart-badge');
        
        if (!cartBadge) {
            cartBadge = document.createElement('span');
            cartBadge.className = 'cart-badge';
            document.querySelector('.nav-cart').appendChild(cartBadge);
        }
        
        if (cartCount > 0) {
            cartBadge.textContent = cartCount;
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `mini-toast ${type}`;
        
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-circle-xmark';
        
        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    }

    // View cart functionality
    const navCart = document.querySelector('.nav-cart');
    navCart.style.cursor = 'pointer';
    navCart.addEventListener('click', function() {
        showCartModal();
    });

    function showCartModal() {
        const modal = document.createElement('div');
        modal.className = 'custom-modal cart-modal';
        
        let cartHTML = `
            <div class="modal-content cart-modal-content">
                <span class="modal-close">&times;</span>
                <h2><i class="fa-solid fa-shopping-cart"></i> Shopping Cart</h2>
        `;
        
        if (cartItems.length === 0) {
            cartHTML += `
                <div class="empty-cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <p>Your cart is empty</p>
                    <button class="modal-button" onclick="this.closest('.cart-modal').remove()">Continue Shopping</button>
                </div>
            `;
        } else {
            cartHTML += '<div class="cart-items-list">';
            cartItems.forEach(item => {
                cartHTML += `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <i class="fa-solid fa-box"></i>
                            <span>${item.name}</span>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">
                            <i class="fa-solid fa-trash"></i> Remove
                        </button>
                    </div>
                `;
            });
            cartHTML += `
                </div>
                <div class="cart-summary">
                    <div class="cart-total">
                        <span>Total Items:</span>
                        <strong>${cartItems.length}</strong>
                    </div>
                    <button class="modal-button checkout-btn">Proceed to Checkout</button>
                </div>
            `;
        }
        
        cartHTML += '</div>';
        modal.innerHTML = cartHTML;
        document.body.appendChild(modal);
        
        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Remove item from cart in modal
        modal.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                const item = cartItems.find(i => i.id === itemId);
                removeFromCart(itemId);
                updateCartUI();
                
                // Update product box buttons
                const allBoxes = document.querySelectorAll('.box');
                allBoxes.forEach(box => {
                    const addBtn = box.querySelector('.add-to-cart-btn');
                    const removeBtn = box.querySelector('.remove-from-cart-btn');
                    if (addBtn && addBtn.dataset.itemId === itemId) {
                        addBtn.style.display = 'block';
                        removeBtn.style.display = 'none';
                    }
                });
                
                showToast(`${item.name} removed from cart`, 'info');
                modal.remove();
                
                // Reopen cart if items still exist
                if (cartItems.length > 0) {
                    setTimeout(() => showCartModal(), 300);
                }
            });
        });

        // Checkout button
        const checkoutBtn = modal.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Proceeding to checkout...\nTotal items: ' + cartItems.length);
                modal.remove();
            });
        }
    }

    // Initialize cart count on page load
    updateCartUI();
});

// ==========================================
// BONUS: INTERACTIVE NAVIGATION & WELCOME
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Sticky header on scroll
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('sticky-header');
        } else {
            header.classList.remove('sticky-header');
        }
    });

    // Smooth scroll for "Back to Top"
    const backToTop = document.querySelector('.foot-panel1 a');
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Welcome message on first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        setTimeout(() => {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'welcome-toast';
            welcomeMsg.innerHTML = `
                <i class="fa-solid fa-gift"></i>
                <span>Welcome! Get 20% off on your first order!</span>
                <button class="toast-close">&times;</button>
            `;
            document.body.appendChild(welcomeMsg);

            localStorage.setItem('hasVisited', 'true');

            const closeToast = welcomeMsg.querySelector('.toast-close');
            closeToast.addEventListener('click', function() {
                welcomeMsg.remove();
            });

            setTimeout(() => {
                welcomeMsg.remove();
            }, 5000);
        }, 2000);
    }
});
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const bgContainer = document.getElementById('bg-container');
const buttonContainer = document.querySelector('.button-container');

let noClicks = 0;
const messages = [
    "NO 💔", 
    "Are you sure? 🥺", 
    "Think again! 😢", 
    "Don't do this! 😭", 
    "Last chance! 😱", 
    "Okay, it's impossible now! 😈"
];

// Floating Hearts Background Generator (Anti-Gravity style)
function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.classList.add('floating-heart');
    
    // Randomize properties
    const size = Math.random() * 1.5 + 0.5;
    const duration = Math.random() * 8 + 6;
    const left = Math.random() * 100;
    
    heart.style.fontSize = `${size}rem`;
    heart.style.left = `${left}vw`;
    heart.style.animationDuration = `${duration}s`;
    
    bgContainer.appendChild(heart);
    
    // Remove heart after animation completes
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// Create hearts periodically
setInterval(createHeart, 400);
// Initial hearts
for(let i=0; i<10; i++) setTimeout(createHeart, Math.random()*2000);

// "No" Button Logic
function handleNoAction() {
    noClicks++;
    
    // Update Yes Button Size and Style
    const scale = 1 + noClicks * 0.4;
    yesBtn.style.transform = `scale(${scale})`;
    yesBtn.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
    // Add pulsing glow effect as it gets bigger
    yesBtn.style.boxShadow = `0 0 ${20 + noClicks*10}px rgba(76, 175, 80, 0.6)`;
    
    // Update No Button text if available
    if (noClicks < messages.length) {
        noBtn.innerHTML = messages[noClicks];
    }
    
    // Make the button position fixed so it dodges around whole screen
    noBtn.style.position = 'fixed';
    
    // Calculate random position considering button size
    const maxX = window.innerWidth - noBtn.offsetWidth;
    const maxY = window.innerHeight - noBtn.offsetHeight;
    
    // Constrain inside viewport with some padding
    const randomX = Math.max(20, Math.floor(Math.random() * (maxX - 20)));
    const randomY = Math.max(20, Math.floor(Math.random() * (maxY - 20)));
    
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    
    // Anti-gravity rotation effect on NO button
    noBtn.style.transform = `rotate(${Math.random() * 60 - 30}deg) scale(${Math.max(0.3, 1 - noClicks * 0.15)})`;
    
    // Eventually disappears or makes YES cover the button area
    if (noClicks >= 6) {
        noBtn.style.display = 'none';
        
        // Reset button container to just center YES nicely
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        
        // Add extreme pulse to Yes
        yesBtn.classList.add('glow');
    }
}

noBtn.addEventListener('click', handleNoAction);

// Dodge effect for desktop (if user hovers)
noBtn.addEventListener('mouseover', () => {
    // Start dodging after first click
    if (noClicks > 0 && noClicks < 6) {
        handleNoAction();
    }
});

// Confetti Effect Generator
function triggerConfetti() {
    for (let i = 0; i < 120; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        
        const colors = ['#ff4d4d', '#4CAF50', '#ffeb3b', '#2196F3', '#e91e63', '#9c27b0'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Start from center
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.zIndex = '1000';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        
        document.body.appendChild(confetti);
        
        // Explode outward
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 25 + 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        
        const animateConfetti = () => {
            x += vx;
            y += vy + 2; // Gravity
            // Air resistance
            vx *= 0.95;
            
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            
            confetti.style.transform = `rotate(${x * 2}deg)`;
            confetti.style.opacity = parseFloat(confetti.style.opacity || 1) - 0.015;
            
            if (confetti.style.opacity > 0) {
                requestAnimationFrame(animateConfetti);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animateConfetti);
    }
}

// "Yes" Button Logic
yesBtn.addEventListener('click', () => {
    // Try to play sound (might be blocked by browser without interaction, but this is a click event)
    try {
        const audio = new Audio('https://rpg.hamsterrepublic.com/wiki-images/d/d7/Oddbounce.ogg');
        audio.volume = 0.5;
        audio.play().catch(e => {
            // Audio blocked or failed, ignore silently to keep smooth flow
        });
    } catch (err) {}
    
    triggerConfetti();
    
    setTimeout(() => {
        // Fade out page 1
        page1.classList.remove('active');
        page1.classList.add('hidden');
        
        setTimeout(() => {
            page1.style.display = 'none';
            page2.style.display = 'flex';
            
            // Allow display change to process before adding opacity class
            setTimeout(() => {
                page2.classList.remove('hidden');
                page2.classList.add('active');
                
                // Animate reasons sequentially
                const reasons = document.querySelectorAll('.reason');
                reasons.forEach((reason, index) => {
                    setTimeout(() => {
                        reason.classList.add('animate-reason');
                    }, 500 * (index + 1));
                });
            }, 50);
        }, 1000); // Wait for fade out CSS transition
    }, 400); // Short delay after confetti explosion
});

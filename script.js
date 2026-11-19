/**
 * SmartSupport AI – Interactive Client-Side JavaScript
 * Includes:
 * 1. AI Rule-Based Natural Language Chatbot with simulated typing & sound
 * 2. Real-Time Order Tracking Interactive Demo with multi-state progress
 * 3. FAQ Dynamic Search & Category Filter with Accordion
 * 4. Contact Form Validation with Ticket Generator Modal & Confetti
 * 5. Floating Chatbot Toggle & Synchronization
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all subsystems
  initChatSystem();
  initOrderTracker();
  initFaqSystem();
  initContactForm();
  initNavigationAndUI();
  initAudioFeedback();
});

/* ==========================================================================
   1. AI CHATBOT SYSTEM (Rules, NLP-Lite, Simulated Typing & Multi-Interface)
   ========================================================================== */

// Knowledge Base Dictionary with multiple keywords, regex, structured answers & follow-up suggestions
const KNOWLEDGE_BASE = [
  {
    category: 'greetings',
    triggers: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'start'],
    response: `Hello! 👋 Welcome to **SmartSupport AI**. I am your automated 24/7 intelligent assistant.\n\nI can help you with:\n• 💰 **Refunds & Returns** (policies, status, payout times)\n• 📦 **Order Tracking** (live location, delivery dates, items)\n• 💳 **Payments & Billing** (accepted cards, failed charges, receipts)\n• 🚚 **Shipping & Delivery** (speeds, address changes, couriers)\n\nWhat can I assist you with today?`,
    suggestions: ['How do I get a refund?', 'Track order ORD-7412', 'Accepted payment methods', 'Shipping times']
  },
  {
    category: 'refunds',
    triggers: ['refund', 'return', 'money back', 'exchange', 'damaged', 'broken item', 'cancel refund', 'reimburse', 'payout'],
    response: `💰 **Refund Policy & Return Guidelines:**\n\n1. **30-Day Guarantee:** You can return any item within 30 days of delivery for a 100% full refund.\n2. **Free Return Shipping:** We provide pre-paid digital shipping labels.\n3. **Processing Timeline:** Once your return is received at our hub, refunds are issued to your original payment method in **3 to 5 business days**.\n\nWould you like to initiate a return or check the status of an existing refund?`,
    suggestions: ['Initiate a return', 'Check refund status', 'Speak to human agent', 'Track my order']
  },
  {
    category: 'orders_track',
    triggers: ['track', 'where is my order', 'status of order', 'package status', 'delivery status', 'find order', 'where is package'],
    response: `📦 **Order Tracking Assistance:**\n\nYou can track any package instantly using our **Live Order Tracking Demo** above! \n\nSimply enter your **Order ID** (for example: **ORD-7412** or **ORD-9821**), or click below to check right now.`,
    suggestions: ['Track ORD-7412 (Out for Delivery)', 'Track ORD-9821 (Delivered)', 'Track ORD-3390 (In Transit)', 'Modify shipping address']
  },
  {
    category: 'orders_modify',
    triggers: ['cancel order', 'change address', 'modify order', 'edit order', 'wrong address', 'change items', 'update address'],
    response: `✏️ **Modifying or Cancelling Your Order:**\n\n• **Within 60 Minutes:** You can modify items or change your delivery address directly through your confirmation email before the package enters the fulfillment queue.\n• **After Dispatch:** Once an order is marked **Shipped**, address changes must be rerouted through the courier (FedEx / UPS).\n\nIf you need immediate redirection, submit a ticket in our Contact Support section below with high priority!`,
    suggestions: ['Submit urgent ticket', 'Track current order', 'Talk to representative']
  },
  {
    category: 'payments',
    triggers: ['payment', 'pay', 'credit card', 'debit card', 'paypal', 'apple pay', 'google pay', 'declined', 'failed payment', 'invoice', 'charge', 'billing', 'currency'],
    response: `💳 **Payments & Billing Information:**\n\n• **Accepted Payment Methods:** Visa, MasterCard, American Express, PayPal, Apple Pay, Google Pay, and Klarna.\n• **Declined Payments:** Usually occur due to incorrect billing ZIP codes, 3D Secure verification timeouts, or temporary bank security blocks. Retrying or using PayPal resolves 90% of issues.\n• **Security:** All transactions are encrypted with PCI-DSS Level 1 bank-grade 256-bit SSL encryption.\n• **Invoices:** PDF tax receipts are emailed automatically upon checkout.`,
    suggestions: ['How to retry failed payment', 'Ask for invoice copy', 'How do refunds work?']
  },
  {
    category: 'delivery',
    triggers: ['shipping', 'delivery', 'courier', 'how long', 'fedex', 'ups', 'dhl', 'express', 'standard', 'international', 'customs', 'shipping cost'],
    response: `🚚 **Shipping Speeds & Courier Options:**\n\n• **Standard Ground (3–5 Days):** Free on all orders over $50. Flat $4.99 otherwise.\n• **Express Priority (1–2 Days):** Flat $14.99 with guaranteed priority dispatch and live GPS courier tracking.\n• **International Shipping:** Available to 120+ countries (7–12 business days average).\n\nAll packages include instant tracking numbers emailed upon dispatch.`,
    suggestions: ['Track order ORD-7412', 'Delayed package help', 'Can I change my address?']
  },
  {
    category: 'human_agent',
    triggers: ['human', 'agent', 'representative', 'operator', 'talk to person', 'real person', 'live agent', 'support team', 'call me'],
    response: `👩‍💼 **Connect With Our Concierge Support Team:**\n\nI can escalate your inquiry immediately to our senior human specialists!\n\n• Average wait time: **Under 15 minutes**\n• Toll-Free Phone: **+1 (800) 555-SMART**\n• Or scroll down to our **Contact Support Form** to submit a priority ticket and get a reference number.`,
    suggestions: ['Submit support ticket', 'Check order tracking', 'Common questions']
  },
  {
    category: 'thanks',
    triggers: ['thank', 'thanks', 'awesome', 'great', 'helpful', 'appreciate', 'perfect', 'cool', 'good job'],
    response: `You are very welcome! 😊 It's my pleasure to help. If you have any other questions about orders, payments, or refunds, just let me know!`,
    suggestions: ['Track an order', 'View FAQ', 'Refund policy']
  }
];

// Fallback response for unhandled queries
const FALLBACK_RESPONSE = {
  response: `I'm not completely certain about that specific phrasing, but here is what I can quickly assist you with:\n\n• 📦 **Track an order** (enter ORD-XXXX)\n• 💰 **Refund policy & returns**\n• 💳 **Accepted payment options & billing**\n• 🚚 **Shipping rates & delivery timelines**\n\nYou can also contact our human support team directly below!`,
  suggestions: ['How do I get a refund?', 'Where is my order?', 'Payment methods', 'Contact human agent']
};

let soundMuted = false;

function initChatSystem() {
  const mainMessagesContainer = document.getElementById('mainChatMessages');
  const mainChatForm = document.getElementById('mainChatForm');
  const mainChatInput = document.getElementById('mainChatInput');
  const typingIndicator = document.getElementById('typingIndicator');
  const clearMainChatBtn = document.getElementById('clearMainChatBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const exportChatBtn = document.getElementById('exportChatBtn');
  const voiceMicBtn = document.getElementById('voiceMicBtn');

  // Set initial bot message timestamp
  const initBotTime = document.getElementById('initBotTime');
  if (initBotTime) {
    initBotTime.textContent = getCurrentTimeString();
  }

  // Handle Main Chat Form Submit
  if (mainChatForm) {
    mainChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = mainChatInput.value.trim();
      if (!userText) return;

      mainChatInput.value = '';
      handleUserMessage(userText, 'main');
    });
  }

  // Quick prompt chips in main chat sidebar
  document.querySelectorAll('.prompt-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      if (query) {
        handleUserMessage(query, 'main');
        // Smooth scroll to chat if not visible
        document.getElementById('chat-section').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Hero Quick Prompt Bar
  const heroPromptInput = document.getElementById('heroPromptInput');
  const heroSendBtn = document.getElementById('heroSendBtn');
  const heroChatPreview = document.getElementById('heroChatPreview');

  if (heroSendBtn && heroPromptInput) {
    const sendHeroMessage = () => {
      const text = heroPromptInput.value.trim();
      if (!text) return;
      heroPromptInput.value = '';
      
      // Add to hero preview
      appendUserBubble(text, heroChatPreview);
      playNotificationSound('sent');

      setTimeout(() => {
        const replyObj = getBotResponse(text);
        appendBotBubble(replyObj.response, heroChatPreview, replyObj.suggestions, 'hero');
        playNotificationSound('received');
      }, 700);
    };

    heroSendBtn.addEventListener('click', sendHeroMessage);
    heroPromptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendHeroMessage();
      }
    });
  }

  // Hero Interactive Chips inside preview
  document.querySelectorAll('.hero-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const ask = chip.getAttribute('data-ask');
      const order = chip.getAttribute('data-sample-order');
      if (order) {
        // Track order demo
        const trackInput = document.getElementById('orderTrackingInput');
        if (trackInput) {
          trackInput.value = order;
          performOrderSearch(order);
          document.getElementById('order-tracker').scrollIntoView({ behavior: 'smooth' });
        }
      } else if (ask) {
        handleUserMessage(ask, 'main');
        document.getElementById('chat-section').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Floating Chat Handlers
  initFloatingChat();

  // Clear Main Chat Button
  if (clearMainChatBtn) {
    clearMainChatBtn.addEventListener('click', () => {
      if (mainMessagesContainer) {
        mainMessagesContainer.innerHTML = `
          <div class="chat-bubble bot-bubble">
            <div class="bubble-icon"><i class="fa-solid fa-brain"></i></div>
            <div class="bubble-body">
              <p>Conversation cleared! How can I assist you today?</p>
              <span class="bubble-time">${getCurrentTimeString()}</span>
            </div>
          </div>
        `;
        showToast('Chat history cleared', 'info');
      }
    });
  }

  // Sound Toggle Button
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundMuted = !soundMuted;
      const soundIcon = document.getElementById('soundIcon');
      if (soundIcon) {
        soundIcon.className = soundMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
      }
      showToast(soundMuted ? 'Sound muted' : 'Sound enabled', 'info');
    });
  }

  // Export Chat History Button
  if (exportChatBtn) {
    exportChatBtn.addEventListener('click', () => {
      exportChatLog();
    });
  }

  // Voice Input Simulation Button
  if (voiceMicBtn) {
    voiceMicBtn.addEventListener('click', () => {
      simulateVoiceInput(mainChatInput);
    });
  }

  // Connect "Ask AI About [Topic]" buttons from common topics section
  document.querySelectorAll('.ask-topic-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      if (query) {
        handleUserMessage(query, 'main');
        document.getElementById('chat-section').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Handle incoming user query, show typing state, compute response, append to UI
 */
function handleUserMessage(userText, targetWindow = 'main') {
  const mainMessages = document.getElementById('mainChatMessages');
  const typingIndicator = document.getElementById('typingIndicator');
  const floatingMessages = document.getElementById('floatingMessages');
  const floatingTyping = document.getElementById('floatingTyping');

  const container = targetWindow === 'floating' ? floatingMessages : mainMessages;
  const indicator = targetWindow === 'floating' ? floatingTyping : typingIndicator;

  if (!container) return;

  // 1. Append User Bubble
  appendUserBubble(userText, container);
  playNotificationSound('sent');

  // 2. Show Typing Indicator
  if (indicator) {
    indicator.classList.remove('hidden');
    container.scrollTop = container.scrollHeight;
  }

  // Check if user entered an Order ID pattern (e.g. ORD-1234 or ORD-XXXX)
  const orderRegex = /\b(ORD-\d{4})\b/i;
  const match = userText.match(orderRegex);

  // 3. Simulated response delay (600ms - 1100ms) for realistic agent feeling
  const delay = Math.floor(Math.random() * 500) + 650;

  setTimeout(() => {
    if (indicator) {
      indicator.classList.add('hidden');
    }

    let botData;

    if (match) {
      const orderId = match[1].toUpperCase();
      const mockOrder = getMockOrder(orderId);
      botData = {
        response: `🔎 **Order Lookup: ${orderId}**\n\n• **Status:** ${mockOrder.status}\n• **Estimated Delivery:** ${mockOrder.estDelivery}\n• **Carrier:** ${mockOrder.carrier}\n• **Items:** ${mockOrder.items.map(i => i.name).join(', ')}\n\nWould you like me to open the live tracking animation for this package?`,
        suggestions: [`Track ${orderId} in visual tracker`, 'Update delivery address', 'Speak to human agent']
      };
    } else {
      botData = getBotResponse(userText);
    }

    // Append Bot Bubble
    appendBotBubble(botData.response, container, botData.suggestions, targetWindow);
    playNotificationSound('received');

  }, delay);
}

/**
 * Matches user query against knowledge base
 */
function getBotResponse(query) {
  const normalized = query.toLowerCase().trim();

  // Score match across knowledge base triggers
  let bestMatch = null;
  let highestScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const trigger of item.triggers) {
      if (normalized.includes(trigger)) {
        score += trigger.length; // prioritize longer, more specific triggers
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 0) {
    return {
      response: bestMatch.response,
      suggestions: bestMatch.suggestions
    };
  }

  return FALLBACK_RESPONSE;
}

/**
 * Append User Bubble to specific chat container
 */
function appendUserBubble(text, container) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user-bubble';
  bubble.innerHTML = `
    <div class="bubble-body">
      <p>${escapeHtml(text)}</p>
      <span class="bubble-time">${getCurrentTimeString()}</span>
    </div>
  `;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

/**
 * Append Bot Bubble with formatted markdown and actionable suggestion chips
 */
function appendBotBubble(markdownText, container, suggestions = [], targetWindow = 'main') {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble bot-bubble';

  // Format bold and bullet markdown simply for HTML display
  let formattedText = escapeHtml(markdownText)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n• /g, '<br>&bull; ')
    .replace(/\n/g, '<br>');

  let suggestionsHtml = '';
  if (suggestions && suggestions.length > 0) {
    suggestionsHtml = `
      <div class="mini-bubble-actions">
        ${suggestions.map(s => `<button class="pill-chip-sm chat-followup-chip" data-query="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join('')}
      </div>
    `;
  }

  bubble.innerHTML = `
    <div class="bubble-icon"><i class="fa-solid fa-robot"></i></div>
    <div class="bubble-body">
      <div>${formattedText}</div>
      ${suggestionsHtml}
      <span class="bubble-time">${getCurrentTimeString()}</span>
    </div>
  `;

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;

  // Bind clicks on generated follow-up suggestion chips
  bubble.querySelectorAll('.chat-followup-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query) {
        if (query.includes('Track') && query.includes('visual tracker')) {
          const orderMatch = query.match(/ORD-\d{4}/i);
          if (orderMatch) {
            const trackInput = document.getElementById('orderTrackingInput');
            if (trackInput) {
              trackInput.value = orderMatch[0];
              performOrderSearch(orderMatch[0]);
              document.getElementById('order-tracker').scrollIntoView({ behavior: 'smooth' });
            }
          }
        } else {
          handleUserMessage(query, targetWindow);
        }
      }
    });
  });
}

/**
 * Initialize Floating Chatbot Widget
 */
function initFloatingChat() {
  const toggleBtn = document.getElementById('floatingChatToggle');
  const chatContainer = document.getElementById('floatingChatContainer');
  const chatBox = document.getElementById('floatingChatBox');
  const minimizeBtn = document.getElementById('minimizeFloatingChat');
  const floatingForm = document.getElementById('floatingChatForm');
  const floatingInput = document.getElementById('floatingChatInput');

  if (!toggleBtn || !chatBox || !chatContainer) return;

  const toggleFloating = (forceOpen = null) => {
    const isClosed = chatBox.classList.contains('hidden');
    const shouldOpen = forceOpen !== null ? forceOpen : isClosed;

    if (shouldOpen) {
      chatBox.classList.remove('hidden');
      chatContainer.classList.add('open');
      if (floatingInput) floatingInput.focus();
    } else {
      chatBox.classList.add('hidden');
      chatContainer.classList.remove('open');
    }
  };

  toggleBtn.addEventListener('click', () => toggleFloating());
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => toggleFloating(false));
  }

  // Open Chat from Header button
  const openChatNavBtn = document.getElementById('openChatNavBtn');
  if (openChatNavBtn) {
    openChatNavBtn.addEventListener('click', () => {
      toggleFloating(true);
      chatBox.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Mobile drawer launch chat button
  const mobileLaunchChat = document.getElementById('mobileLaunchChat');
  if (mobileLaunchChat) {
    mobileLaunchChat.addEventListener('click', () => {
      document.getElementById('mobileDrawer').classList.remove('open');
      toggleFloating(true);
    });
  }

  // Footer chat button
  const footerChatBtn = document.getElementById('footerChatBtn');
  if (footerChatBtn) {
    footerChatBtn.addEventListener('click', () => {
      toggleFloating(true);
    });
  }

  // Floating Chat Form Submit
  if (floatingForm && floatingInput) {
    floatingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = floatingInput.value.trim();
      if (!val) return;
      floatingInput.value = '';
      handleUserMessage(val, 'floating');
    });
  }

  // Floating chips
  document.querySelectorAll('.float-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const ask = chip.getAttribute('data-ask');
      if (ask) {
        handleUserMessage(ask, 'floating');
      }
    });
  });
}

/* ==========================================================================
   2. ORDER TRACKING SECTION (Working Demo & Realistic Mock Database)
   ========================================================================== */

const MOCK_ORDERS = {
  'ORD-7412': {
    id: 'ORD-7412',
    status: 'Out for Delivery',
    stepNumber: 4,
    progressPercent: '75%',
    estDelivery: 'Today by 4:30 PM',
    carrier: 'FedEx Priority Air (Tracking #FX-8894129)',
    driverName: 'Marcus Vance',
    vehicle: 'Electric Delivery Van #402',
    courierNote: '"Package is in final courier route. Gate code 4092 received. Signature will be required upon delivery."',
    items: [
      { name: 'AeroPulse Pro Noise-Cancelling Headphones', sub: 'Space Silver • Qty: 1 • Warranty Included', price: '$249.00', icon: 'fa-headphones-simple' },
      { name: 'Magnetic Fast Charging Dock', sub: 'Matte Black • Qty: 1', price: '$49.00', icon: 'fa-charging-station' }
    ],
    timeline: [
      { label: 'Order Placed', time: 'Nov 17, 09:14 AM' },
      { label: 'Processing', time: 'Nov 17, 02:40 PM' },
      { label: 'Shipped', time: 'Nov 18, 08:30 AM' },
      { label: 'Out for Delivery', time: 'Today, 08:15 AM' },
      { label: 'Delivered', time: 'Expected by 4:30 PM' }
    ]
  },
  'ORD-9821': {
    id: 'ORD-9821',
    status: 'Delivered',
    stepNumber: 5,
    progressPercent: '100%',
    estDelivery: 'Delivered Yesterday at 3:15 PM',
    carrier: 'UPS Ground Signature (Tracking #1Z-998240)',
    driverName: 'Sarah Jenkins',
    vehicle: 'UPS Van #118',
    courierNote: '"Left safely with receptionist at front desk. Signed by S. Jenkins."',
    items: [
      { name: 'UltraWide 34" Curved Studio Monitor', sub: 'WQHD 144Hz • Qty: 1', price: '$499.00', icon: 'fa-desktop' },
      { name: 'Braided Thunderbolt 4 Cable 2m', sub: 'Reinforced Nylon • Qty: 2', price: '$38.00', icon: 'fa-plug' }
    ],
    timeline: [
      { label: 'Order Placed', time: 'Nov 14, 11:20 AM' },
      { label: 'Processing', time: 'Nov 14, 04:15 PM' },
      { label: 'Shipped', time: 'Nov 15, 09:00 AM' },
      { label: 'Out for Delivery', time: 'Nov 16, 08:45 AM' },
      { label: 'Delivered', time: 'Nov 16, 03:15 PM' }
    ]
  },
  'ORD-3390': {
    id: 'ORD-3390',
    status: 'In Transit',
    stepNumber: 3,
    progressPercent: '50%',
    estDelivery: 'Thursday, Nov 22',
    carrier: 'DHL Express Worldwide (Tracking #DHL-409112)',
    driverName: 'Regional Logistics Hub',
    vehicle: 'Cargo Flight #DL-880',
    courierNote: '"Departed Frankfurt International Hub. In transit to destination sorting facility."',
    items: [
      { name: 'Custom Mechanical Ergonomic Keyboard', sub: 'Linear switches • RGB backlit • Qty: 1', price: '$189.00', icon: 'fa-keyboard' }
    ],
    timeline: [
      { label: 'Order Placed', time: 'Nov 18, 10:05 AM' },
      { label: 'Processing', time: 'Nov 18, 06:12 PM' },
      { label: 'Shipped', time: 'Nov 19, 07:45 AM' },
      { label: 'Out for Delivery', time: 'Expected Nov 22' },
      { label: 'Delivered', time: 'Expected Nov 22' }
    ]
  },
  'ORD-1105': {
    id: 'ORD-1105',
    status: 'Processing',
    stepNumber: 2,
    progressPercent: '25%',
    estDelivery: 'Nov 24 – Nov 26',
    carrier: 'Preparing Carrier Allocation',
    driverName: 'Fulfillment Team Austin TX',
    vehicle: 'Warehouse Sorting Station 4',
    courierNote: '"Order has been picked, quality checked, and is awaiting courier freight pickup."',
    items: [
      { name: 'Smart Ambient LED Desk Bar', sub: 'Matte Grey • Auto-Dimming • Qty: 1', price: '$85.00', icon: 'fa-lightbulb' }
    ],
    timeline: [
      { label: 'Order Placed', time: 'Today, 06:20 AM' },
      { label: 'Processing', time: 'Today, 11:45 AM' },
      { label: 'Shipped', time: 'Expected Tomorrow' },
      { label: 'Out for Delivery', time: 'Pending Dispatch' },
      { label: 'Delivered', time: 'Pending Dispatch' }
    ]
  }
};

function getMockOrder(orderId) {
  const normalized = orderId.trim().toUpperCase();
  if (MOCK_ORDERS[normalized]) {
    return MOCK_ORDERS[normalized];
  }

  // Generate dynamic valid order for any custom ID typed
  return {
    id: normalized,
    status: 'In Transit',
    stepNumber: 3,
    progressPercent: '50%',
    estDelivery: 'In 2 Business Days',
    carrier: 'Express Logistics Courier',
    driverName: 'Regional Delivery Hub',
    vehicle: 'Express Transport Unit',
    courierNote: `"Your package ${normalized} is moving smoothly through our distribution network."`,
    items: [
      { name: `Special Order Package (${normalized})`, sub: 'Standard Delivery • Qty: 1', price: '$129.00', icon: 'fa-box' }
    ],
    timeline: [
      { label: 'Order Placed', time: '2 Days Ago' },
      { label: 'Processing', time: 'Yesterday' },
      { label: 'Shipped', time: 'Today, 04:30 AM' },
      { label: 'Out for Delivery', time: 'Tomorrow' },
      { label: 'Delivered', time: 'Expected in 2 Days' }
    ]
  };
}

function initOrderTracker() {
  const trackBtn = document.getElementById('trackOrderBtn');
  const trackInput = document.getElementById('orderTrackingInput');
  const sampleBtns = document.querySelectorAll('.sample-tag-btn');
  const quickTrackNavBtn = document.getElementById('quickTrackNavBtn');
  const btnNotifySms = document.getElementById('btnNotifySms');
  const btnAskAiAboutOrder = document.getElementById('btnAskAiAboutOrder');

  // Quick Nav Track button
  if (quickTrackNavBtn) {
    quickTrackNavBtn.addEventListener('click', () => {
      const section = document.getElementById('order-tracker');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
      if (trackInput) trackInput.focus();
    });
  }

  // Search button click
  if (trackBtn && trackInput) {
    trackBtn.addEventListener('click', () => {
      const id = trackInput.value.trim();
      if (!id) {
        showToast('Please enter an Order ID', 'warning');
        return;
      }
      performOrderSearch(id);
    });

    trackInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        trackBtn.click();
      }
    });
  }

  // Sample order buttons click
  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sampleId = btn.getAttribute('data-id');
      if (sampleId && trackInput) {
        trackInput.value = sampleId;
        performOrderSearch(sampleId);
      }
    });
  });

  // SMS Live Alert Button
  if (btnNotifySms) {
    btnNotifySms.addEventListener('click', () => {
      const orderId = document.getElementById('dispTrackingNum')?.textContent || 'this order';
      showToast(`🔔 Live SMS alerts enabled for ${orderId}!`, 'success');
      btnNotifySms.innerHTML = '<i class="fa-solid fa-check"></i> Alerts Active';
      btnNotifySms.classList.add('btn-outline-emerald');
    });
  }

  // Ask AI about this order button
  if (btnAskAiAboutOrder) {
    btnAskAiAboutOrder.addEventListener('click', () => {
      const orderId = document.getElementById('dispTrackingNum')?.textContent || 'ORD-7412';
      handleUserMessage(`Where is order ${orderId} and when will it arrive?`, 'main');
      document.getElementById('chat-section').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function performOrderSearch(orderId) {
  const data = getMockOrder(orderId);
  const resultsContainer = document.getElementById('trackerResults');

  if (!resultsContainer) return;

  // Add subtle animation refresh
  resultsContainer.style.opacity = '0.5';
  resultsContainer.style.transform = 'translateY(5px)';

  setTimeout(() => {
    // 1. Update Banner Summary
    const dispTrackingNum = document.getElementById('dispTrackingNum');
    const dispEstDelivery = document.getElementById('dispEstDelivery');
    const dispCarrier = document.getElementById('dispCarrier');
    const dispStatusPill = document.getElementById('dispStatusPill');

    if (dispTrackingNum) dispTrackingNum.textContent = data.id;
    if (dispEstDelivery) dispEstDelivery.textContent = data.estDelivery;
    if (dispCarrier) dispCarrier.textContent = data.carrier;

    if (dispStatusPill) {
      dispStatusPill.textContent = data.status;
      dispStatusPill.className = 'status-pill';
      if (data.status === 'Out for Delivery') dispStatusPill.classList.add('status-out');
      else if (data.status === 'Delivered') dispStatusPill.classList.add('status-delivered');
      else if (data.status === 'In Transit') dispStatusPill.classList.add('status-transit');
      else dispStatusPill.classList.add('status-processing');
    }

    // 2. Update Timeline Steps
    const progressFill = document.getElementById('timelineProgressFill');
    if (progressFill) {
      progressFill.style.width = data.progressPercent;
    }

    const stepsContainer = document.getElementById('timelineSteps');
    if (stepsContainer && data.timeline) {
      const steps = stepsContainer.querySelectorAll('.timeline-step');
      steps.forEach((stepEl, idx) => {
        const stepNum = idx + 1;
        stepEl.classList.remove('completed', 'active');

        if (stepNum < data.stepNumber) {
          stepEl.classList.add('completed');
        } else if (stepNum === data.stepNumber) {
          stepEl.classList.add('active');
        }

        // Update timestamps if available
        const timeEl = stepEl.querySelector('.step-time');
        if (timeEl && data.timeline[idx]) {
          timeEl.textContent = data.timeline[idx].time;
        }
      });
    }

    // 3. Update Package Items List
    const itemsListContainer = document.getElementById('dispItemsList');
    if (itemsListContainer && data.items) {
      itemsListContainer.innerHTML = data.items.map(item => `
        <div class="order-item-row">
          <div class="item-img-placeholder"><i class="fa-solid ${item.icon || 'fa-box'}"></i></div>
          <div class="item-meta">
            <div class="item-name">${escapeHtml(item.name)}</div>
            <div class="item-sub">${escapeHtml(item.sub)}</div>
          </div>
          <div class="item-price">${escapeHtml(item.price)}</div>
        </div>
      `).join('');
    }

    // 4. Update Driver / Courier Note
    const dispDriverName = document.getElementById('dispDriverName');
    const dispVehicle = document.getElementById('dispVehicle');
    const dispCourierMsg = document.getElementById('dispCourierMsg');

    if (dispDriverName) dispDriverName.textContent = `Courier: ${data.driverName}`;
    if (dispVehicle) dispVehicle.textContent = `Vehicle: ${data.vehicle}`;
    if (dispCourierMsg) dispCourierMsg.textContent = data.courierNote;

    resultsContainer.style.opacity = '1';
    resultsContainer.style.transform = 'translateY(0)';
    resultsContainer.style.transition = 'all 0.3s ease-out';

    showToast(`Tracking updated for ${data.id}`, 'info');

    // Trigger confetti if delivered!
    if (data.status === 'Delivered' && typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, 250);
}

/* ==========================================================================
   3. FREQUENTLY ASKED QUESTIONS (FAQ) SYSTEM
   ========================================================================== */

function initFaqSystem() {
  const faqItems = document.querySelectorAll('.faq-item');
  const filterTabs = document.querySelectorAll('.faq-tab');
  const searchInput = document.getElementById('faqSearchInput');
  const clearSearchBtn = document.getElementById('clearFaqSearch');
  const emptyState = document.getElementById('faqEmptyState');

  // Accordion Expand / Collapse
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPane = item.querySelector('.faq-answer-pane');

    if (questionBtn && answerPane) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Optional: close other accordions for sleek single-open feeling
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question-btn');
            const otherPane = other.querySelector('.faq-answer-pane');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherPane) otherPane.style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          answerPane.style.maxHeight = null;
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answerPane.style.maxHeight = answerPane.scrollHeight + 'px';
        }
      });
    }
  });

  // Category Filtering
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const selectedCat = tab.getAttribute('data-category');
      applyFaqFilters(selectedCat, searchInput ? searchInput.value : '');
    });
  });

  // Search Filtering
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      if (clearSearchBtn) {
        if (query.length > 0) clearSearchBtn.classList.remove('hidden');
        else clearSearchBtn.classList.add('hidden');
      }

      const activeTab = document.querySelector('.faq-tab.active');
      const selectedCat = activeTab ? activeTab.getAttribute('data-category') : 'all';
      applyFaqFilters(selectedCat, query);
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        const activeTab = document.querySelector('.faq-tab.active');
        applyFaqFilters(activeTab ? activeTab.getAttribute('data-category') : 'all', '');
      });
    }
  }

  // Footer Category links
  document.querySelectorAll('.cat-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-cat');
      const targetTab = document.querySelector(`.faq-tab[data-category="${cat}"]`);
      if (targetTab) {
        targetTab.click();
        document.getElementById('faq').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Helpful feedback buttons
  document.querySelectorAll('.btn-helpful').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-feedback');
      if (parent) {
        parent.innerHTML = '<span class="text-accent"><i class="fa-solid fa-circle-check"></i> Thank you for your feedback!</span>';
        showToast('Feedback recorded. Thank you!', 'info');
      }
    });
  });
}

function applyFaqFilters(category, searchQuery) {
  const faqItems = document.querySelectorAll('.faq-item');
  const emptyState = document.getElementById('faqEmptyState');
  const searchLower = searchQuery.toLowerCase().trim();
  let visibleCount = 0;

  faqItems.forEach(item => {
    const itemCat = item.getAttribute('data-category');
    const qText = item.querySelector('.faq-q-text')?.textContent.toLowerCase() || '';
    const aText = item.querySelector('.faq-answer-inner')?.textContent.toLowerCase() || '';

    const matchesCategory = (category === 'all' || itemCat === category);
    const matchesSearch = (!searchQuery || qText.includes(searchLower) || aText.includes(searchLower));

    if (matchesCategory && matchesSearch) {
      item.classList.remove('hidden');
      visibleCount++;
    } else {
      item.classList.add('hidden');
    }
  });

  if (emptyState) {
    if (visibleCount === 0) emptyState.classList.remove('hidden');
    else emptyState.classList.add('hidden');
  }
}

/* ==========================================================================
   4. CONTACT SUPPORT FORM (Validation, Ticket Generator & Modal)
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('supportContactForm');
  const messageInput = document.getElementById('contactMessage');
  const charCount = document.getElementById('charCount');
  const dropzone = document.getElementById('fileDropzone');
  const fileInput = document.getElementById('fileAttachment');
  const dropzoneLabel = document.getElementById('dropzoneLabel');

  // Character counter for message textarea
  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCount.textContent = `${len} / 500 characters`;
      if (len > 500) {
        charCount.style.color = '#f87171';
      } else {
        charCount.style.color = 'var(--text-subtle)';
      }
    });
  }

  // File dropzone interactivity
  if (dropzone && fileInput) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '#8b5cf6';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        updateDropzoneName(e.dataTransfer.files[0].name);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        updateDropzoneName(fileInput.files[0].name);
      }
    });
  }

  function updateDropzoneName(filename) {
    if (dropzoneLabel) {
      dropzoneLabel.innerHTML = `<i class="fa-solid fa-file-circle-check text-accent"></i> Selected: <strong>${escapeHtml(filename)}</strong>`;
    }
  }

  // Form Submission & Validation
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('contactName');
      const emailEl = document.getElementById('contactEmail');
      const categoryEl = document.getElementById('contactCategory');
      const msgEl = document.getElementById('contactMessage');
      const priorityEl = document.querySelector('input[name="priority"]:checked');

      // Validation Errors
      let isValid = true;

      // Name
      const nameVal = nameEl.value.trim();
      const nameError = document.getElementById('nameError');
      if (!nameVal || nameVal.length < 2) {
        nameError.textContent = 'Please enter your full name (at least 2 letters)';
        isValid = false;
      } else {
        nameError.textContent = '';
      }

      // Email
      const emailVal = emailEl.value.trim();
      const emailError = document.getElementById('emailError');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
      } else {
        emailError.textContent = '';
      }

      // Category
      const catVal = categoryEl.value;
      const catError = document.getElementById('categoryError');
      if (!catVal) {
        catError.textContent = 'Please select an inquiry category';
        isValid = false;
      } else {
        catError.textContent = '';
      }

      // Message
      const msgVal = msgEl.value.trim();
      const msgError = document.getElementById('messageError');
      if (!msgVal || msgVal.length < 10) {
        msgError.textContent = 'Please write a brief explanation (min 10 characters)';
        isValid = false;
      } else {
        msgError.textContent = '';
      }

      if (!isValid) return;

      // Simulate submission loading
      const submitBtn = document.getElementById('submitTicketBtn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      submitBtn.disabled = true;
      btnText.classList.add('hidden');
      btnSpinner.classList.remove('hidden');

      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnSpinner.classList.add('hidden');

        // Generate Ticket ID
        const ticketId = `#TKT-${Math.floor(10000 + Math.random() * 90000)}`;

        // Populate Modal Details
        document.getElementById('modalTicketId').textContent = ticketId;
        document.getElementById('modalContactName').textContent = nameVal;
        document.getElementById('modalContactEmail').textContent = emailVal;
        document.getElementById('modalCategory').textContent = categoryEl.options[categoryEl.selectedIndex].text;
        document.getElementById('modalPriority').textContent = priorityEl ? priorityEl.value : 'Normal';

        // Show Modal
        const ticketModal = document.getElementById('ticketModal');
        if (ticketModal) {
          ticketModal.classList.remove('hidden');
        }

        // Fire Confetti
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        // Reset form
        form.reset();
        if (charCount) charCount.textContent = '0 / 500 characters';
        if (dropzoneLabel) dropzoneLabel.innerHTML = 'Drag and drop or <strong class="link-span">browse files</strong>';

        showToast(`Ticket ${ticketId} created successfully!`, 'success');
      }, 1200);
    });
  }

  // Modal Close Handlers
  const ticketModal = document.getElementById('ticketModal');
  const closeTicketModal = document.getElementById('closeTicketModal');
  const modalCloseAction = document.getElementById('modalCloseAction');
  const modalAskAiAction = document.getElementById('modalAskAiAction');

  const closeModal = () => {
    if (ticketModal) ticketModal.classList.add('hidden');
  };

  if (closeTicketModal) closeTicketModal.addEventListener('click', closeModal);
  if (modalCloseAction) modalCloseAction.addEventListener('click', closeModal);

  if (ticketModal) {
    ticketModal.addEventListener('click', (e) => {
      if (e.target === ticketModal) closeModal();
    });
  }

  // "Follow Up in AI Chat" action from modal
  if (modalAskAiAction) {
    modalAskAiAction.addEventListener('click', () => {
      const ticketId = document.getElementById('modalTicketId')?.textContent || '#TKT-90000';
      closeModal();
      handleUserMessage(`I just submitted ticket ${ticketId}. Can you summarize my request?`, 'main');
      document.getElementById('chat-section').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   5. NAVIGATION & UI HELPERS (ScrollSpy, Drawer, Toasts, Audio)
   ========================================================================== */

function initNavigationAndUI() {
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header background blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.background = 'rgba(7, 9, 22, 0.95)';
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.background = 'rgba(9, 10, 22, 0.85)';
      header.style.boxShadow = 'none';
    }

    // ScrollSpy active link update
    const scrollPos = window.scrollY + 100;
    const sections = ['home', 'topics', 'order-tracker', 'chat-section', 'faq', 'contact'];

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });
  });

  // Mobile Drawer Toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }
  if (closeDrawerBtn && mobileDrawer) {
    closeDrawerBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }
  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });
}

/**
 * Toast Notification Utility
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'warning') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Synthesizes subtle Web Audio beeps for messaging (Zero external dependencies)
 */
let audioCtx = null;
function initAudioFeedback() {
  // Lazily initialized on first user interaction
  window.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
  }, { once: true });
}

function playNotificationSound(type = 'received') {
  if (soundMuted || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'sent') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else {
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (err) {
    // Ignore audio error if unsupported
  }
}

/**
 * Export Chat Conversation to Text File
 */
function exportChatLog() {
  const messages = document.querySelectorAll('#mainChatMessages .chat-bubble');
  if (messages.length === 0) {
    showToast('No messages to export', 'warning');
    return;
  }

  let log = `=== SmartSupport AI Conversation Transcript ===\nGenerated on: ${new Date().toLocaleString()}\n\n`;

  messages.forEach(msg => {
    const isBot = msg.classList.contains('bot-bubble');
    const sender = isBot ? 'SmartSupport AI' : 'User';
    const text = msg.querySelector('.bubble-body')?.innerText || '';
    log += `[${sender}]\n${text}\n-----------------------------------\n\n`;
  });

  const blob = new Blob([log], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SmartSupport-Transcript-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Chat transcript downloaded', 'success');
}

/**
 * Voice input simulation with interactive visual feedback
 */
function simulateVoiceInput(inputEl) {
  if (!inputEl) return;
  showToast('🎙️ Listening... (Voice simulator active)', 'info');
  inputEl.placeholder = 'Listening to your voice...';

  const samplePhrases = [
    'How do I request a refund for order ORD-7412?',
    'What payment methods are supported on your site?',
    'Where is my package and who is delivering it?',
    'I want to speak with a customer service representative.'
  ];

  const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];

  setTimeout(() => {
    inputEl.value = randomPhrase;
    inputEl.placeholder = "Ask a question (e.g. 'How do refunds work?' or 'Where is my order?')";
    showToast('Speech transcribed successfully!', 'success');
    inputEl.focus();
  }, 1400);
}

/**
 * Helpers
 */
function getCurrentTimeString() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

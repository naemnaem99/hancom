// ---- Demo 1: team avatar toggle (mirrors Avatar.jsx's useState) ----
var teamBtn = document.querySelector('[data-role="team-toggle"]');
var teamHint = document.querySelector('[data-role="team-hint"]');
var teamOnline = true;
teamBtn.addEventListener('click', function () {
  teamOnline = !teamOnline;
  teamBtn.classList.toggle('online', teamOnline);
  teamHint.textContent = (teamOnline ? '온라인' : '오프라인') + ' · 사각형을 클릭해보세요';
});

// ---- Demo 2: chat items (each written out individually, no map) ----
var unread1 = 3;
document.querySelector('[data-role="chat-1"]').addEventListener('click', function () {
  unread1 = 0;
  var badge = document.querySelector('[data-role="chat-1-badge"]');
  badge.textContent = unread1;
  badge.classList.toggle('zero', unread1 === 0);
});

var unread2 = 1;
document.querySelector('[data-role="chat-2"]').addEventListener('click', function () {
  unread2 = 0;
  var badge = document.querySelector('[data-role="chat-2-badge"]');
  badge.textContent = unread2;
  badge.classList.toggle('zero', unread2 === 0);
});

// ---- Demo 3: product cards (each written out individually, no map) ----
function wireProductToggle(cardRole, badgeRole, startType) {
  var type = startType;
  var card = document.querySelector('[data-role="' + cardRole + '"]');
  var badge = document.querySelector('[data-role="' + badgeRole + '"]');
  card.addEventListener('click', function () {
    type = type === 'new' ? 'sale' : 'new';
    badge.className = 'badge ' + type;
    badge.textContent = type === 'new' ? 'NEW' : 'SALE';
  });
}
wireProductToggle('product-1', 'product-1-badge', 'sale');
wireProductToggle('product-2', 'product-2-badge', 'new');
wireProductToggle('product-3', 'product-3-badge', 'sale');

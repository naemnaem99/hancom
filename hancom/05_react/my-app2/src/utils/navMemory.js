// SPA 내에서 페이지를 이동할 때만 유지되는 순수 JS 메모리.
// 새로고침하면 스크립트가 처음부터 다시 실행되므로 자동으로 null로 초기화된다.
let lastSpirit = null

export const setLastSpirit = (spirit) => {
    lastSpirit = spirit
}

export const getLastSpirit = () => lastSpirit

<script setup>
defineProps({
  user: { type: Object, default: null },
});

const mobileOpen = ref(false);
const menuOpen = ref(false);
const reduce = useReducedMotion();

function getCookie(name) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

onMounted(() => {
  function onDocClick(event) {
    const dropdown = document.getElementById("user-dropdown");
    const button = document.getElementById("user-menu-button");
    const target = event.target;
    if (dropdown && button && !button.contains(target) && !dropdown.contains(target)) {
      menuOpen.value = false;
    }
  }
  document.addEventListener("click", onDocClick);
  onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
});

async function handleLogout(event) {
  event.preventDefault();
  if (!confirm("정말 로그아웃 하시겠습니까?")) return;
  menuOpen.value = false;
  try {
    const response = await fetch("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrf_token"),
      },
    });
    if (response.ok) {
      window.location.href = "/auth/login";
    } else {
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  } catch {
    alert("로그아웃 중 오류가 발생했습니다.");
  }
}

function initial(username) {
  return (username && username[0] ? username[0] : "?").toUpperCase();
}
</script>

<template>
  <header class="bg-surface border-b border-border sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative flex items-center h-16">
        <a href="/" class="flex items-center space-x-3 shrink-0 z-10 min-w-0">
          <SanzeroMark variant="icon" />
          <span class="flex flex-col justify-center min-w-0">
            <span class="text-lg font-bold tracking-tight text-ink leading-none">산재ON</span>
            <span class="mt-1 text-[11px] text-muted tracking-tight leading-none whitespace-nowrap">산업재해 보상 서비스</span>
          </span>
        </a>

        <nav class="hidden md:flex absolute inset-x-0 justify-center items-center space-x-8" aria-label="주요 메뉴">
          <a href="/compensation/calculator" class="nav-link text-sm font-medium text-muted hover:text-ink">보상금 계산기</a>
          <a href="/compensation/status" class="nav-link text-sm font-medium text-muted hover:text-ink">보상 진행 현황</a>
          <a href="/analysis/precedent" class="nav-link text-sm font-medium text-muted hover:text-ink">판례 분석</a>
        </nav>

        <div class="flex items-center space-x-3 ml-auto shrink-0 z-10">
          <div v-if="user" class="relative">
            <button
              id="user-menu-button"
              type="button"
              class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
              @click="menuOpen = !menuOpen"
            >
              <div class="w-8 h-8 bg-ink text-surface rounded-full flex items-center justify-center">
                <span class="font-medium text-xs">{{ initial(user.username) }}</span>
              </div>
              <span class="hidden md:block text-ink font-medium">{{ user.username }}</span>
              <svg
                class="w-4 h-4 text-muted header-caret"
                :class="{ 'is-open': menuOpen, 'is-reduced': reduce }"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div
              v-show="menuOpen"
              id="user-dropdown"
              class="absolute right-0 mt-2 w-48 bg-surface rounded-lg border border-border py-1 z-50 header-panel"
            >
              <a href="/auth/profile" class="block px-4 py-2 text-sm text-ink hover:bg-surface">프로필 관리</a>
              <hr class="my-1 border-border" />
              <button type="button" class="block w-full text-left px-4 py-2 text-sm text-ink hover:bg-surface" @click="handleLogout">
                로그아웃
              </button>
            </div>
          </div>
          <a
            v-else
            href="/auth/login"
            class="bg-ink text-surface px-5 py-2 rounded-none text-sm font-medium hover:opacity-90 header-login"
          >
            로그인
          </a>

          <button
            type="button"
            class="md:hidden p-2 text-muted hover:text-ink rounded-md"
            :aria-expanded="mobileOpen ? 'true' : 'false'"
            aria-controls="mobile-menu"
            aria-label="메뉴 열기"
            @click="mobileOpen = !mobileOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <nav
        v-show="mobileOpen"
        id="mobile-menu"
        class="md:hidden border-t border-border py-3 space-y-1 header-panel"
      >
        <a href="/compensation/calculator" class="block px-2 py-2 text-sm text-ink">보상금 계산기</a>
        <a href="/compensation/status" class="block px-2 py-2 text-sm text-ink">보상 진행 현황</a>
        <a href="/analysis/precedent" class="block px-2 py-2 text-sm text-ink">판례 분석</a>
      </nav>
    </div>
  </header>
</template>

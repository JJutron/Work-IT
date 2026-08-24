<script setup>
import { getHomePayload } from "~/lib/home";
import { GUEST_CLAIM_PROGRESS } from "~/lib/types";

const { data: payload } = await useAsyncData("home", getHomePayload, {
  default: () => ({
    user: null,
    claim_progress: GUEST_CLAIM_PROGRESS,
  }),
});

const user = computed(() => payload.value?.user ?? null);
const progress = computed(() => payload.value?.claim_progress ?? GUEST_CLAIM_PROGRESS);
const heroCta = computed(() => progress.value.home_cta);
</script>

<template>
  <Header :user="user" />
  <main id="main-content" class="pb-0 pt-0">
    <Hero :cta="heroCta" />
    <ClaimProgress :progress="progress" />
    <IndustryReality />
    <FeatureChapters />
    <Reveal>
      <HomeCtaBar :summary="progress.summary" :next="progress.next_action" />
    </Reveal>
  </main>
  <Footer />
</template>

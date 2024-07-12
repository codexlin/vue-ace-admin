<script setup lang="ts"></script>

<template>
  <div class="not-found">
    <div class="desc">
      <div class="code text-7xl">404</div>
      <div ref="typedRef" class="content mb-5 text-3xl">The Page</div>
      <RouterLink to="/">
        <button class="rounded bg-light-800 px-5 py-2 text-lg transition" hover="shadow-md" dark="text-black">
          Go Home
        </button>
      </RouterLink>
    </div>
    <img src="../assets/notFound/16.svg" class="cover" alt="page not found" />
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
}

.desc {
  flex: 1;
  width: 300px;
  font-weight: bold;

  .code {
    margin-bottom: 20px;
    font-size: 7rem;
  }

  .content {
    height: 40px;
    margin-bottom: 5px;
    font-size: 3rem;
  }

  button {
    padding: 0.625rem 1.25rem;
    font-size: 1.125rem;
    background-color: #f3f4f6; // bg-light-800
    border-radius: 0.375rem;
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 4px 6px rgb(0 0 0 / 10%); // shadow-md
    }

    &.dark {
      color: #000; // text-black
    }
  }
}

.cover {
  width: 700px;
  max-width: 100%;
  height: auto;
  max-height: 100%;
  margin: 0 5px;
}
</style>

<template>
  <v-app class="iframe">
    <slot />
  </v-app>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}

.page-enter,
.page-leave-to {
  opacity: 0;
}

.v-main .v-container {
  max-width: 1000px;
}

/*--------------------------------------------------------------
## Netbook
--------------------------------------------------------------*/
@media only screen and (max-width: 1024px) {
  html {
    font-size: 90%;
  }
}
/*--------------------------------------------------------------
## iPad
--------------------------------------------------------------*/
@media only screen and (max-width: 960px) {
  html {
    font-size: 85%;
  }
}
/*--------------------------------------------------------------
## iPad
--------------------------------------------------------------*/
@media only screen and (max-width: 768px) {
  html {
    font-size: 80%;
  }
}
/*--------------------------------------------------------------
## iPad
--------------------------------------------------------------*/
@media only screen and (max-width: 480px) {
  html {
    font-size: 75%;
  }
}
</style>

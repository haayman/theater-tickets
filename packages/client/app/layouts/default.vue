<template>
  <v-app>
    <NavBar />

    <v-main>
      <v-container>
        <slot />
      </v-container>
      <NotifcationRenderer />
    </v-main>
  </v-app>
</template>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.3s;
}

.layout-enter,
.layout-leave-to {
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

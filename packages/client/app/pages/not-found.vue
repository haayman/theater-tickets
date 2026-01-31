<template>
  <div>
    <div class="alert alert-danger">
      Reservering is niet gevonden. Waarschijnlijk heb je het geannuleerd?
    </div>

    <nuxt-link :to="{ name: 'reserveren' }" class="btn btn-primary" tag="button">
      Nieuwe reservering
    </nuxt-link>
  </div>
</template>

<script></script>

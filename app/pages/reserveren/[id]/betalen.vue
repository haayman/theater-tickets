<script>
export default {
  watch: {
    $route: {
      handler: "get",
      immediate: true,
    },
  },

  methods: {
    async get() {
      try {
        const id = this.$route.params.id;
        const result = await fetch(`/api/reservering/${id}/newPayment`, {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }).then((response) => response.json());
        if (result.paymentUrl) {
          document.location.href = result.paymentUrl;
        } else {
          this.$router.push({ name: "reserveren-id-betaald", params: { id } });
        }
      } catch (e) {
        console.error(e);
        this.$router.replace({ name: "not-found" }, this.$route.params);
      }
    },
  },
  render: null,
};
</script>

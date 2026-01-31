<script setup lang="ts">
const { isAuthenticated } = useAuth();

const router = useRouter();
if (!isAuthenticated.value) {
  router.replace({ name: "voorstelling" });
} else {
  router.replace({ name: "beheer-reserveringen" });
}
</script>

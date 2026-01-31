export default defineNuxtRouteMiddleware(() => {
  const { isAdministrator } = useAuth();

  if (!isAdministrator.value) {
    return navigateTo("/");
  }
});

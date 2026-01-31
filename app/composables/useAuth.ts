import { useStorage, StorageSerializers } from "@vueuse/core";
import type { LoginBody, LoginResponse, ProfileResponse } from "~/types/auth";
import { User } from "~~/models";

/**
 * Composable for authorization management
 */
export function useAuth() {
  const config = useRuntimeConfig();

  const { routes, base } = config.public.api;

  const userStorage = useStorage<User>("user", null, undefined, {
    serializer: StorageSerializers.object,
    listenToStorageChanges: true,
  });

  const accessTokenStorage = useStorage<string>("accessToken", null, undefined, {
    listenToStorageChanges: true,
  });

  const accessTokenCookie = useCookie("auth._token.local");

  const isAuthenticated = computed(() => userStorage.value);
  const redirectedFrom = ref<string | undefined>();

  /**
   * Send login request to server
   */
  async function login(body: LoginBody) {
    try {
      const { token } = await $fetch<LoginResponse>("/api/auth/", {
        method: "POST",
        body,
      });

      accessTokenStorage.value = token;

      const { user } = await $fetch<ProfileResponse>(`${base}${routes.profile.index}`, {
        headers: getAuthorizationHeader(),
      });
      userStorage.value = user;
    } catch (error: any) {
      throw new Error(error?.data?.message || error?.message || "Er is een fout opgetreden");
    }
  }

  /**
   * Clear login session
   */
  function logout() {
    accessTokenStorage.value = null;
    userStorage.value = null;
    accessTokenCookie.value = null;
  }

  /**
   * Creates authorization header to be used with API calls
   */
  function getAuthorizationHeader() {
    const token = accessTokenStorage.value;

    if (!token) return undefined;

    return { authorization: `Bearer ${token}` };
  }

  /**
   * Fetch user using the authorization token
   */
  async function fetchUser() {
    try {
      const { user } = await $fetch<ProfileResponse>(`${base}${routes.profile.index}`);

      userStorage.value = user;
    } catch (e) {
      useNotifyBus.emit({ message: "U bent uitgelogd omdat de sessie is verlopen", stack: e });
      logout();
    }
  }

  const user = computed(() => (userStorage.value ? new User(userStorage.value) : null));

  const isAdministrator = computed(() => {
    return user.value?.role === "admin";
  });

  const isSpeler = computed(() => {
    return user.value?.role === "speler" || isAdministrator.value;
  });

  const isKassa = computed(() => {
    return user.value?.role === "kassa";
  });

  /**
   * Checks if current session is valid
   */
  async function validate(): Promise<boolean> {
    if (!isAuthenticated.value) return false;

    try {
      await $fetch<ProfileResponse>(`${base}${routes.profile.index}`);
      return true;
    } catch (e) {
      return false;
    }
  }

  function isAuthorized(role: string): boolean {
    return !!user.value?.isAuthorised(role);
  }

  return {
    user,
    isAdministrator,
    isSpeler,
    isKassa,
    isAuthenticated,
    redirectedFrom,
    login,
    logout,
    fetchUser,
    validate,
    getAuthorizationHeader,
    isAuthorized,
  };
}

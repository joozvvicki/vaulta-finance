// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const client = useSupabaseClient();

  if (user.value && (to.path === "/login" || to.path === "/register")) {
    return navigateTo("/app/dashboard");
  }

  if (to.path.startsWith("/app")) {
    if (!user.value) {
      const {
        data: { session },
      } = await client.auth.getSession();

      if (!session) {
        console.log("🚫 Blokada: Brak sesji, kieruję na /login");
        return navigateTo("/login");
      }
    }
  }
});

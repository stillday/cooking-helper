// src/routes/+layout.server.ts
export const load = async ({ event }) => {
  const getSession = event.locals.getSession;

  return {
    session: await getSession()
  };
};
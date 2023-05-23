// src/routes/+layout.server.ts
export const load = ({ locals: { getSession}}) => {
  return {
    session: getSession()
  };
};
export const environment = {
  production: false,
  /**
   * Quando preenchida, o login chama POST `${apiUrl}/auth/login`
   * com `{ usuario, senha }` e espera `{ token, usuario, nome?, expiraEm? }`.
   */
  apiUrl: '',
};

export interface NavigationRouter {
  getRoute(action: string): Promise<string | false>;
}

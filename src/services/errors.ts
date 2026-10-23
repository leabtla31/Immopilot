/** Raised when a requested resource does not exist or is not owned by the caller. */
export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} introuvable`);
    this.name = "NotFoundError";
  }
}

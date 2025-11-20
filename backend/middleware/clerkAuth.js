import { requireAuth } from "@clerk/express";

export const checkAuth = requireAuth();

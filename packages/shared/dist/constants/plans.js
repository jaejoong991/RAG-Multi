"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_LIMITS = void 0;
exports.PLAN_LIMITS = {
    FREE: {
        queriesPerMonth: 1000,
        storageMB: 500,
        documentsCount: 5,
        maxFileSizeMB: 10,
        models: ['gpt-4o-mini'],
    },
    PRO: {
        queriesPerMonth: 25000,
        storageMB: 50000, // 50GB
        documentsCount: 100,
        maxFileSizeMB: 50,
        models: ['gpt-4o-mini', 'gpt-4-turbo', 'claude-3-haiku', 'gemini-1.5-flash'],
    },
    BUSINESS: {
        queriesPerMonth: 1000000, // Effectively unlimited for small/mid
        storageMB: 1000000, // 1TB
        documentsCount: 1000,
        maxFileSizeMB: 100,
        models: ['gpt-4o', 'claude-3-opus', 'gemini-1.5-pro'],
    },
    ENTERPRISE: {
        queriesPerMonth: Infinity,
        storageMB: Infinity,
        documentsCount: Infinity,
        maxFileSizeMB: 500,
        models: ['all'],
    },
};
//# sourceMappingURL=plans.js.map